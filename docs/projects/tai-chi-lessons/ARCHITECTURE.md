# Tai Chi Lessons - Architecture

## System Overview

The Tai Chi Lessons platform is a **video generation engine** built on an asynchronous job processing architecture. The system breaks Tai Chi lessons into multiple short scenes, generates each scene as a separate video clip using AI providers, generates Hebrew narration separately, and stitches everything together into a complete lesson video.

### High-Level Architecture Diagram

```
┌─────────────┐
│   Browser   │
│  (Angular)  │
└──────┬──────┘
       │ HTTP REST
       │
┌──────▼──────────────────────────────────────────────┐
│              Backend API (PHP/Slim)                  │
│                                                      │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Routes   │  │ Job Manager  │  │  Database   │ │
│  └─────┬─────┘  └──────┬───────┘  └─────────────┘ │
│        │                │                           │
│        │         ┌──────▼──────────┐                │
│        │         │  Worker Queue   │                │
│        │         └──────┬──────────┘                │
│        │                │                           │
└────────┼────────────────┼───────────────────────────┘
         │                │
         │         ┌──────▼──────────────────┐
         │         │   Video Orchestrator    │
         │         │  (Scene Generation)     │
         │         └──────┬──────────────────┘
         │                │
         │         ┌──────┴───────────────────┬──────────────┐
         │         │                          │              │
         │  ┌──────▼──────────┐   ┌──────────▼───────┐   ┌─▼────────┐
         │  │ Video Provider   │   │  TTS Provider    │   │  ffmpeg  │
         │  │   (Abstracted)   │   │    (Hebrew)      │   │ Pipeline │
         │  └──────┬───────────┘   └──────────┬───────┘   └─┬────────┘
         │         │                          │              │
         │         │                          │              │
         │         └────────────┬─────────────┴──────────────┘
         │                      │
         │              ┌───────▼──────────┐
         │              │  Object Storage  │
         │              │   (S3/R2/MinIO)  │
         │              └──────────────────┘
         │
         └──────────── Signed URL ──────────────────────────►
```

### System Components

1. **Frontend (Angular)**: 
   - Single-page web application
   - Job creation and status polling
   - Video playback

2. **Backend API (PHP/Slim)**:
   - REST API for job management
   - Job queue orchestration
   - Provider abstraction layer

3. **Worker Queue**:
   - Async job processing
   - Video generation orchestration
   - Scene-level retry logic

4. **Video Orchestrator**:
   - Splits lessons into scenes
   - Coordinates video + audio generation
   - Manages ffmpeg stitching

5. **External Providers**:
   - AI video generation (abstracted)
   - Hebrew TTS service
   - Object storage

6. **ffmpeg Pipeline**:
   - Clip concatenation
   - Audio overlay
   - Format conversion

### Data Flow

**User Initiates Generation:**
```
User → Frontend → POST /api/video-jobs → Backend
Backend → Create job (status: queued) → Database
Backend → Enqueue job → Worker Queue
Backend → Return jobId → Frontend
```

**Worker Processes Job:**
```
Worker → Fetch job → Database
Worker → Split lesson into scenes → Video Orchestrator
For each scene:
  Orchestrator → Generate video clip → Video Provider
  Orchestrator → Store clip URL → Database
Orchestrator → Generate Hebrew audio → TTS Provider
Orchestrator → Stitch clips + audio → ffmpeg Pipeline
ffmpeg → Final MP4 → Object Storage
Worker → Update job (status: completed, videoUrl) → Database
```

**User Polls for Status:**
```
Frontend → GET /api/video-jobs/{jobId} → Backend
Backend → Fetch job status → Database
Backend → Return status + videoUrl → Frontend
Frontend → Display video player (if completed)
```

---

## Frontend Architecture

### Framework and Libraries

- **Angular 18**: Component-based UI framework
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming for polling
- **Video.js**: Video player with HTML5 support

### State Management

**MVP Approach**: Component-level state (no global state management)

```typescript
// VideoGenerationComponent
interface JobState {
  jobId: string | null;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  videoUrl: string | null;
  error: string | null;
}
```

**RxJS Polling Pattern**:
```typescript
import { interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

pollJobStatus(jobId: string) {
  return interval(3000).pipe(
    switchMap(() => this.http.get<JobStatus>(`/api/video-jobs/${jobId}`)),
    takeWhile(status => status.status !== 'completed' && status.status !== 'failed', true)
  );
}
```

### Routing

**MVP Routes**:
- `/` - Main page (video generation UI)

**Post-MVP Routes** (Phase 2):
- `/login` - User authentication
- `/history` - Video generation history
- `/library` - Personal video library

### Component Structure

```
src/
├── app/
│   ├── components/
│   │   ├── video-generation/
│   │   │   ├── video-generation.component.ts
│   │   │   ├── video-generation.component.html
│   │   │   └── video-generation.component.scss
│   │   ├── video-player/
│   │   │   ├── video-player.component.ts
│   │   │   ├── video-player.component.html
│   │   │   └── video-player.component.scss
│   │   └── progress-indicator/
│   │       ├── progress-indicator.component.ts
│   │       ├── progress-indicator.component.html
│   │       └── progress-indicator.component.scss
│   ├── services/
│   │   ├── video-job.service.ts
│   │   └── api.service.ts
│   ├── models/
│   │   ├── job-state.model.ts
│   │   └── job-status.model.ts
│   └── app.component.ts
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## Backend Architecture

### API Design (REST)

**Framework**: PHP 8.2+ with Slim Framework 4

**Endpoints**:

1. **POST /api/video-jobs**
   - Create new video generation job
   - Returns: `{ jobId, status }`

2. **GET /api/video-jobs/{jobId}**
   - Get job status and result
   - Returns: `{ jobId, status, progress, videoUrl, error }`

3. **POST /api/video-jobs/{jobId}/cancel** (Post-MVP)
   - Cancel in-progress job
   - Returns: `{ jobId, status }`

### Database Design

**Tables**:

#### `video_jobs`
```sql
CREATE TABLE video_jobs (
  id VARCHAR(36) PRIMARY KEY,  -- UUID
  status ENUM('queued', 'generating_clips', 'generating_audio', 'stitching', 'completed', 'failed') NOT NULL,
  lesson_type VARCHAR(100) NOT NULL DEFAULT 'tai-chi-beginner',
  duration_seconds INT NOT NULL DEFAULT 300,
  language VARCHAR(10) NOT NULL DEFAULT 'he',
  provider_preference VARCHAR(50) DEFAULT 'auto',
  progress DECIMAL(5,2) DEFAULT 0.00,  -- 0.00 to 100.00
  video_url TEXT NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

#### `video_clips`
```sql
CREATE TABLE video_clips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  scene_index INT NOT NULL,  -- 0-4 for 5 scenes
  scene_name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL,  -- e.g., 'provider-a', 'provider-b'
  provider_task_id VARCHAR(255) NULL,
  clip_url TEXT NULL,
  status ENUM('pending', 'generating', 'completed', 'failed') NOT NULL,
  prompt_text TEXT NOT NULL,  -- Store for debugging/reproducibility
  metadata JSON NULL,  -- Provider-specific metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES video_jobs(id) ON DELETE CASCADE,
  INDEX idx_job_scene (job_id, scene_index),
  INDEX idx_status (status)
);
```

#### `audio_narrations`
```sql
CREATE TABLE audio_narrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  scene_index INT NOT NULL,
  provider VARCHAR(50) NOT NULL,  -- e.g., 'google-tts', 'azure-tts'
  audio_url TEXT NULL,
  status ENUM('pending', 'generating', 'completed', 'failed') NOT NULL,
  narration_text TEXT NOT NULL,
  duration_seconds DECIMAL(5,2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES video_jobs(id) ON DELETE CASCADE,
  INDEX idx_job_scene (job_id, scene_index)
);
```

### Authentication/Authorization

**MVP**: No authentication required

**Phase 2**: 
- JWT-based authentication
- User accounts with email/password
- Video generation history per user
- Rate limiting per user

### Business Logic

**Job Lifecycle Manager** (`JobManager` class):
```php
class JobManager {
  public function createJob(array $params): string;
  public function getJobStatus(string $jobId): array;
  public function updateJobStatus(string $jobId, string $status): void;
  public function updateJobProgress(string $jobId, float $progress): void;
  public function markJobCompleted(string $jobId, string $videoUrl): void;
  public function markJobFailed(string $jobId, string $error): void;
}
```

**Scene Manager** (`SceneManager` class):
```php
class SceneManager {
  public function getLessonScenes(string $lessonType): array;
  public function createClipRecord(string $jobId, int $sceneIndex, array $scene): int;
  public function updateClipStatus(int $clipId, string $status): void;
  public function getJobClips(string $jobId): array;
}
```

**Provider Manager** (`ProviderManager` class):
```php
interface VideoProviderInterface {
  public function generateClip(string $prompt, int $durationSeconds): string; // Returns taskId
  public function getTaskStatus(string $taskId): array;
  public function getResult(string $taskId): ?string; // Returns clip URL or null
}

class ProviderManager {
  private array $providers; // ['primary' => ProviderA, 'fallback' => ProviderB]
  
  public function selectProvider(string $preference = 'auto'): VideoProviderInterface;
  public function generateWithFallback(string $prompt, int $duration): string;
}
```

---

## Infrastructure

### Hosting/Deployment

**MVP Requirements**:
- **Server**: 4+ CPU cores, 8+ GB RAM, 50+ GB disk
- **OS**: Linux (Ubuntu 22.04 LTS recommended)
- **Dependencies**: 
  - PHP 8.2+ with CLI
  - ffmpeg 6+
  - Redis (for job queue)
  - MySQL 8+ or PostgreSQL 14+

**Hosting Options**:
- DigitalOcean Droplet ($48/month for 4 vCPU, 8GB RAM)
- AWS EC2 t3.large ($60/month on-demand)
- Hetzner Cloud CX31 ($12/month, 4 vCPU, 8GB RAM) - cost-effective for MVP

### CI/CD Pipeline

**MVP**: Manual deployment

**Phase 2**: Automated deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          ssh user@server "cd /var/www/tai-chi && git pull && composer install && php artisan migrate"
```

### Monitoring/Logging

**MVP Logging**:
- PHP error logs: `/var/log/php/errors.log`
- Application logs: `/var/www/tai-chi/storage/logs/app.log`
- Job logs: Database table `job_logs` (optional)

**Phase 3 Monitoring** (Observability package):
- Error tracking: Sentry
- Performance monitoring: New Relic or DataDog
- Uptime monitoring: Pingdom or UptimeRobot

### Scaling Strategy

**MVP**: Single server (sufficient for 10 concurrent jobs)

**Phase 2**: 
- Separate job worker server (dedicated for video processing)
- Load balancer for API servers (if >100 requests/min)

**Phase 3**:
- Auto-scaling worker pool (Kubernetes or AWS Auto Scaling)
- CDN for video delivery (CloudFlare, AWS CloudFront)
- Database read replicas (if >1000 users)

---

## Security Architecture

### Authentication Flow (Phase 2)

**JWT-Based Authentication**:
```
User → POST /api/auth/login → Backend
Backend → Verify credentials → Database
Backend → Generate JWT token → User
User → Include JWT in Authorization header → Backend
Backend → Verify JWT → Allow request
```

**JWT Payload**:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user",
  "iat": 1672531200,
  "exp": 1672617600
}
```

### Authorization Model (Phase 2)

**Roles**:
- `user`: Can generate videos, view own history
- `admin`: Can view all jobs, manage users

**Permissions**:
- `generate_video`: Create new video jobs
- `view_own_jobs`: View own job history
- `view_all_jobs`: View all jobs (admin only)

### Data Encryption

**In Transit**:
- HTTPS/TLS 1.3 for all API requests
- Enforce HTTPS redirect (no plain HTTP)

**At Rest** (Phase 2):
- Database encryption (MySQL transparent data encryption)
- API keys stored in environment variables (not in code)

### Security Best Practices

**MVP**:
1. **API Key Security**:
   - Provider API keys in `.env` (not committed)
   - Backend-only API calls (never expose keys to frontend)

2. **Rate Limiting**:
   - 10 video generation requests per IP per day
   - Prevent abuse of free MVP

3. **Input Validation**:
   - Validate job parameters (duration, language, lessonType)
   - Sanitize user inputs (prevent SQL injection, XSS)

4. **CORS Configuration**:
   - Restrict CORS to frontend domain only
   - No wildcard `Access-Control-Allow-Origin: *`

**Phase 2** (with user accounts):
5. **Password Security**:
   - bcrypt hashing (cost factor 12+)
   - Password requirements: 8+ chars, mix of types

6. **Session Management**:
   - JWT expiration: 24 hours
   - Refresh token mechanism
   - Logout invalidates tokens

7. **GDPR Compliance**:
   - Privacy policy
   - Cookie consent
   - User data export/deletion

---

## Data Architecture

### Database Schema

**Normalized Relational Schema**:
- `video_jobs`: Core job entity
- `video_clips`: One-to-many relationship with jobs
- `audio_narrations`: One-to-many relationship with jobs

**Relationships**:
```
video_jobs (1) ──┬── (N) video_clips
                 └── (N) audio_narrations
```

### Data Models

**Job Model**:
```php
class VideoJob {
  public string $id;  // UUID
  public string $status;
  public string $lessonType;
  public int $durationSeconds;
  public string $language;
  public string $providerPreference;
  public float $progress;
  public ?string $videoUrl;
  public ?string $errorMessage;
  public DateTime $createdAt;
  public DateTime $updatedAt;
  public ?DateTime $completedAt;
}
```

**Clip Model**:
```php
class VideoClip {
  public int $id;
  public string $jobId;
  public int $sceneIndex;
  public string $sceneName;
  public string $provider;
  public ?string $providerTaskId;
  public ?string $clipUrl;
  public string $status;
  public string $promptText;
  public ?array $metadata;
  public DateTime $createdAt;
  public DateTime $updatedAt;
}
```

### Data Relationships

**Job → Clips**:
```php
// In VideoJob model
public function clips(): array {
  return VideoClip::where('job_id', $this->id)
    ->orderBy('scene_index')
    ->findAll();
}
```

**Job Progress Calculation**:
```php
public function calculateProgress(): float {
  $clips = $this->clips();
  $totalScenes = count($clips);
  $completedScenes = count(array_filter($clips, fn($c) => $c->status === 'completed'));
  
  if ($totalScenes === 0) return 0.0;
  
  // Clips: 70%, Audio: 20%, Stitching: 10%
  $clipProgress = ($completedScenes / $totalScenes) * 70;
  // TODO: Add audio and stitching progress
  return $clipProgress;
}
```

### Data Flow

**Job Creation**:
```
Frontend → Backend → Insert video_jobs (status: queued)
Backend → Enqueue job → Worker Queue
Backend → Return jobId
```

**Scene Generation**:
```
Worker → Fetch job
Worker → Insert video_clips (status: pending, 5 records)
For each clip:
  Worker → Update clip (status: generating)
  Worker → Call Video Provider API
  Worker → Store provider task ID
  Worker → Poll provider status
  Worker → Update clip (status: completed, clipUrl)
```

**Stitching**:
```
Worker → Fetch all completed clips
Worker → Download clips to temp directory
Worker → Generate audio narration
Worker → Download audio to temp directory
Worker → Run ffmpeg concat + overlay
Worker → Upload final MP4 to object storage
Worker → Update job (status: completed, videoUrl)
Worker → Delete temp files
```

---

## Integration Architecture

### External APIs

#### Video Provider API

**Interface Contract**:
```php
interface VideoProviderInterface {
  public function generateClip(string $prompt, int $durationSeconds): string;
  public function getTaskStatus(string $taskId): array;
  public function getResult(string $taskId): ?string;
}
```

**Example Implementation** (Provider A):
```php
class ProviderAClient implements VideoProviderInterface {
  private string $apiKey;
  private string $baseUrl = 'https://api.provider-a.com/v1';
  
  public function generateClip(string $prompt, int $durationSeconds): string {
    $response = $this->post('/generate', [
      'prompt' => $prompt,
      'duration' => $durationSeconds,
      'model' => 'video-gen-v2'
    ]);
    return $response['taskId'];
  }
  
  public function getTaskStatus(string $taskId): array {
    $response = $this->get("/tasks/{$taskId}");
    return [
      'status' => $response['status'], // 'pending', 'processing', 'completed', 'failed'
      'progress' => $response['progress'] ?? 0
    ];
  }
  
  public function getResult(string $taskId): ?string {
    $status = $this->getTaskStatus($taskId);
    return $status['status'] === 'completed' ? $status['videoUrl'] : null;
  }
}
```

#### Hebrew TTS API

**Interface**:
```php
interface TTSProviderInterface {
  public function generateSpeech(string $text, string $language): string; // Returns audio URL
  public function getSupportedLanguages(): array;
}
```

**Example Implementation** (Google Cloud TTS):
```php
class GoogleTTSClient implements TTSProviderInterface {
  private string $apiKey;
  
  public function generateSpeech(string $text, string $language): string {
    $response = $this->post('/v1/text:synthesize', [
      'input' => ['text' => $text],
      'voice' => [
        'languageCode' => 'he-IL',
        'name' => 'he-IL-Standard-A',
        'ssmlGender' => 'NEUTRAL'
      ],
      'audioConfig' => [
        'audioEncoding' => 'MP3',
        'speakingRate' => 0.9  // Slightly slower for clarity
      ]
    ]);
    
    // Decode base64 audio, upload to storage
    $audioContent = base64_decode($response['audioContent']);
    return $this->uploadToStorage($audioContent);
  }
  
  public function getSupportedLanguages(): array {
    return ['he', 'en', 'ar', 'ru'];
  }
}
```

### Third-Party Services

1. **Object Storage** (S3-compatible):
   - AWS S3
   - Cloudflare R2
   - MinIO (self-hosted)

2. **Video Generation Providers**:
   - Provider A (primary)
   - Provider B (fallback)

3. **TTS Providers**:
   - Google Cloud Text-to-Speech
   - Azure Cognitive Services TTS
   - AWS Polly (backup)

### Webhooks (Future)

**Phase 3**: Provider webhooks for async status updates

```php
// POST /api/webhooks/video-provider
public function handleVideoProviderWebhook(Request $request) {
  $payload = $request->getBody();
  $signature = $request->getHeaderLine('X-Provider-Signature');
  
  if (!$this->verifyWebhookSignature($signature, $payload)) {
    return $response->withStatus(401);
  }
  
  $data = json_decode($payload, true);
  $taskId = $data['taskId'];
  $status = $data['status'];
  
  // Update clip status
  VideoClip::where('provider_task_id', $taskId)
    ->update(['status' => $status]);
    
  return $response->withStatus(200);
}
```

### Event-Driven Architecture (Future)

**Phase 3**: Event bus for decoupled services

```php
// Event: VideoClipGenerated
Event::dispatch(new VideoClipGenerated($clipId, $clipUrl));

// Listener: UpdateJobProgress
Event::listen(VideoClipGenerated::class, function($event) {
  $job = VideoJob::findByClipId($event->clipId);
  $job->updateProgress();
});
```

---

## Performance Considerations

### Video Generation Optimization

1. **Scene-based generation** (current approach):
   - 5 scenes × 5-10 seconds = ~45 seconds total video
   - Parallelize scene generation where possible
   - Target: 5-8 minutes total generation time

2. **Provider selection**:
   - Choose fastest provider for MVP
   - Fallback to slower provider if primary fails

3. **Clip caching** (Phase 3):
   - Cache clips by prompt hash
   - Reuse identical scenes across jobs
   - Reduce costs and generation time

### Database Performance

1. **Indexes**:
   - `video_jobs.status` (frequently queried)
   - `video_jobs.created_at` (for history queries)
   - `video_clips.job_id, scene_index` (composite index)

2. **Query optimization**:
   - Fetch job + clips in single query (JOIN)
   - Use prepared statements (prevent SQL injection + performance)

3. **Connection pooling**:
   - Persistent database connections
   - Max 10 connections for MVP (sufficient)

### Scalability

**MVP**: Single server handles 10 concurrent jobs

**Phase 2**: Dedicated worker server
- API server: Handles HTTP requests only
- Worker server: Processes video generation jobs
- Shared database and Redis queue

**Phase 3**: Horizontal scaling
- Multiple worker servers (queue-based distribution)
- Load balancer for API servers
- CDN for video delivery

---

## Related Documentation

- [PRD Overview](PRD_OVERVIEW.md) - Product requirements and MVP definition
- [Video Generation Pipeline](features/video-generation-pipeline.md) - Scene-based generation details
- [Hebrew TTS Integration](features/hebrew-tts-integration.md) - Audio narration strategy
- [API Design](technical/api-design.md) - REST endpoints and job lifecycle
- [Video Provider Abstraction](technical/video-provider-abstraction.md) - Provider interface and fallback
- [FFmpeg Pipeline](technical/ffmpeg-pipeline.md) - Video stitching and audio overlay
