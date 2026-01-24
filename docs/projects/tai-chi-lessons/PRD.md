# PRD – AI-Generated Tai Chi Video Lesson Website

## 1. Purpose

Build a web-based system that generates **beginner-level Tai Chi video lessons using AI**, optimized for:
- Absolute beginners
- Slow, safe, educational movement
- Hebrew narration
- Personal, non-social usage

This is not a content platform or social product.  
It is a **video generation engine** exposed through a simple website UI.

The primary consumer of this document is an AI coding / architecture model (Claude Sonnet).

---

## 2. Core Product Goals

1. Generate a complete Tai Chi lesson video (up to 5 minutes)
2. Ensure movements are slow, clear, and beginner-safe
3. Support Hebrew narration with consistent quality
4. Abstract video generation providers behind a unified interface
5. Be cost-aware, async, and provider-fault-tolerant
6. Enable future expansion (additional lessons, levels, styles)

---

## 3. Target User

- Individual user
- No prior Tai Chi experience
- Wants a calm, guided, first lesson at home
- Non-technical, expects “press button → get video”

No social, sharing, or collaboration features are required.

---

## 4. User Flow (MVP)

1. User opens website
2. Clicks “Generate Tai Chi Lesson”
3. Selects (or defaults):
   - Level: Beginner
   - Duration: up to 5 minutes
   - Language: Hebrew
4. Clicks “Generate”
5. Sees progress status (async)
6. Receives a playable / downloadable video

---

## 5. MVP Scope

### Included
- Single lesson type: “Tai Chi – First Lesson”
- One instructor
- Natural, calm environment
- Hebrew narration
- One generated video per request
- Async generation with progress polling

### Excluded
- Authentication
- User accounts
- Video editing UI
- Social features
- Payments (for now)

---

## 6. High-Level Architecture

### Frontend
- Angular
- TypeScript
- Minimal UI
- Polling-based status updates

### Backend
- PHP (Slim Framework preferred)
- REST API
- Async job processing (queue or worker)
- ffmpeg installed on server

### External AI Services
- Video generation provider(s)
- Text-to-Speech provider (Hebrew)
- Object storage (S3 / R2 compatible)

---

## 7. Key Architectural Principle

**Do NOT generate a full 5-minute video in a single API call.**

Instead:
- Split lesson into multiple short scenes
- Generate short clips (5–10s each)
- Stitch clips into a single MP4
- Add narration as a separate audio layer

This is mandatory due to provider limits and cost control.

---

## 8. Lesson Structure (Hard-Coded for MVP)

The lesson is split into logical scenes:
1. Opening posture
2. Basic breathing
3. First movement
4. Weight and grounding awareness
5. Closing posture

Each scene:
- Has its own prompt fragment
- Has its own narration text
- Produces one short video clip

---

## 9. Prompt Engine

Prompts are dynamically assembled but must:
- Stay under 2000 characters
- Explicitly describe:
  - What to do
  - What NOT to do (no fast movement, no martial elements, etc.)
- Enforce:
  - Slow pace
  - Educational tone
  - Beginner safety

Prompt text must be persisted for debugging and reproducibility.

---

## 10. Hebrew Narration Strategy

Do NOT rely on video providers to generate Hebrew speech.

Required flow:
1. Generate video clips **without audio**
2. Generate Hebrew narration using a dedicated TTS service
3. Merge audio + video using ffmpeg

This guarantees:
- Stable Hebrew quality
- Control over pace and tone
- Independence from video provider limitations

---

## 11. Backend API Design

### POST /api/video-jobs
Creates a new video generation job.

Request:
```json
{
  "lessonType": "tai-chi-beginner",
  "durationSeconds": 300,
  "language": "he",
  "providerPreference": "auto"
}
```

Rsponse:
```json
{
  "jobId": "uuid",
  "status": "queued"
}
```

---

### GET /api/video-jobs/{jobId}
Returns job status and result.

Response:
```json
{
  "jobId": "uuid",
  "status": "processing",
  "progress": 0.65,
  "videoUrl": null
}
```

---

## 12. Job Lifecycle States
- queued
- generating_clips
- generating_audio
- stitching
- completed
- failed

All state transitions must be persisted.

---

## 13. Video Generation Orchestration
1. Job created
2. Lesson split into scenes
3. For each scene:
 - Build scene prompt
 - Call video provider
 - Store clip URL
4. Generate narration audio per scene
5. Stitch clips into one video (ffmpeg)
6. Overlay narration audio
7. Upload final MP4
8. Mark job as completed

--- 

## 14. Provider Abstraction
Implement a provider interface, e.g.:
- VideoProviderInterface
 - generateClip(prompt, duration)
 - getStatus(taskId)
 - getResult(taskId)
Providers may include:
- Primary provider
- Fallback provider
Provider selection logic must be centralized.

---

## 15. Storage
- All intermediate clips stored temporarily
- Final MP4 stored in object storage
- Backend returns signed URL to client

---

## 16. Database (Conceptual)

video_jobs
- id (UUID)
- status
- lessonType
- durationSeconds
- language
- createdAt
- updatedAt

video_clips
- id
- jobId
- sceneIndex
- provider
- providerTaskId
- clipUrl
- status
- metadata (JSON)

---

## 17. Error Handling
- Provider failure → retry or fallback
- Audio generation failure → retry
- ffmpeg failure → mark job failed with logs
- All failures must be traceable per job

---

## 18. Security & Cost Control
- API keys only on backend
- Rate limiting per IP
- Max jobs per day
- Prompt hash caching to avoid duplicate costs

---

## 19. Non-Goals
- Real-time video generation
- Live instructors
- Physical feedback or motion tracking
- Medical or therapeutic claims

---

## 20. Future Extensions (Out of Scope for MVP)
- Additional lessons
- Multiple difficulty levels
- Different instructors
- User accounts
- Public API
- Mobile app

---

## 21. Guiding Principles
- Safety over spectacle
- Slow is better than impressive
- Deterministic workflows over “magic”
- Replaceable providers
- AI as a tool, not a black box

