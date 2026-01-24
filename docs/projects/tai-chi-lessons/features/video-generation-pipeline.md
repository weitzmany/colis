# Feature: Video Generation Pipeline

## Overview

The video generation pipeline is the core technical feature of the Tai Chi Lessons platform. Instead of generating a single 5-minute video in one API call (which is technically infeasible and cost-prohibitive), the system breaks lessons into **5 short scenes** (5-10 seconds each), generates each scene separately using AI video providers, and stitches them together into a complete lesson.

**User Benefit**: Receive a complete, cohesive 5-minute Tai Chi lesson video

**Business Value**: 
- Overcomes provider limitations (most AI video providers don't support 5+ minute videos)
- Enables cost control (per-scene generation, caching opportunities)
- Provides fault tolerance (retry individual scenes on failure)

---

## User Stories

1. **As a user**, I want to receive a complete 5-minute lesson video so that I can follow along without interruptions
2. **As the system**, I want to generate short video clips so that I can work within provider constraints and control costs
3. **As the system**, I want to retry failed scenes individually so that one provider failure doesn't waste the entire generation
4. **As a developer**, I want to track scene-level progress so that I can debug failures and optimize generation time

---

## Requirements

### Functional Requirements

1. **Scene Splitting**:
   - Every lesson must be split into exactly 5 scenes (MVP)
   - Each scene has: name, prompt text, narration text, target duration
   - Scene order is fixed and logical (opening → closing posture)

2. **Clip Generation**:
   - Each scene generates one video clip (5-10 seconds)
   - Clips are generated sequentially (not parallel in MVP)
   - Each clip is stored temporarily during generation

3. **Prompt Management**:
   - Each scene has a dedicated prompt (under 2000 characters)
   - Prompts enforce: slow pace, beginner safety, no martial elements
   - Prompts are persisted in database for debugging/reproducibility

4. **Progress Tracking**:
   - Scene-level status: `pending`, `generating`, `completed`, `failed`
   - Overall job progress calculated from scene completion (0-100%)
   - Frontend displays progress during generation

5. **Error Handling**:
   - Failed scene retries up to 3 times
   - After 3 failures, try fallback provider
   - If all retries fail, mark job as failed with specific error

### Non-Functional Requirements

1. **Performance**:
   - Generate 5 scenes in under 7 minutes (total)
   - Each scene generation: <90 seconds (provider-dependent)

2. **Reliability**:
   - 95% scene generation success rate (per scene)
   - 99% job completion rate (all 5 scenes)

3. **Cost Control**:
   - Average cost per scene: <$0.80
   - Total generation cost: <$4 per complete lesson

---

## Lesson Structure

### MVP Lesson: "Tai Chi - First Lesson" (5 Scenes)

#### Scene 1: Opening Posture (10 seconds)
**Purpose**: Establish stance and stillness

**Prompt**:
```
A person standing in a calm, open space performing Tai Chi opening posture. 
Feet shoulder-width apart, knees slightly bent, arms relaxed at sides. 
Body centered and still. Slow, mindful breathing. 
Camera: Medium shot, slight angle. 
Style: Educational, slow-motion emphasis. 
No fast movements, no martial elements. Beginner-safe.
```

**Narration (Hebrew)**:
```
נעמוד במרחק כתפיים בין הרגליים. הברכיים מעט כפופות. 
הזרועות רפויות לצדדים. נשימה איטית ורגועה.
```
*(Translation: "We'll stand with feet shoulder-width apart. Knees slightly bent. Arms relaxed at sides. Slow, calm breathing.")*

---

#### Scene 2: Basic Breathing (10 seconds)
**Purpose**: Connect breath with body awareness

**Prompt**:
```
A person in Tai Chi stance performing slow, deep breathing. 
Arms gently rise with inhale, lower with exhale. 
Movement is extremely slow and controlled. 
Focus on breath coordination. 
Camera: Medium-close shot. 
No fast movements, no martial elements. Beginner-safe.
```

**Narration (Hebrew)**:
```
בשאיפה, הידיים עולות לאט. 
בנשיפה, הידיים יורדות לאט. 
נשימה עמוקה ואיטית.
```
*(Translation: "On the inhale, hands rise slowly. On the exhale, hands lower slowly. Deep, slow breathing.")*

---

#### Scene 3: First Movement - "Parting the Wild Horse's Mane" (10 seconds)
**Purpose**: Introduce basic arm movement with weight shift

**Prompt**:
```
A person in Tai Chi stance performing "Parting the Wild Horse's Mane" movement. 
Slow arm extension forward, one arm up, one arm down. 
Gentle weight shift from one leg to the other. 
Movement is slow, controlled, and graceful. 
Camera: Medium shot, front angle. 
No fast movements, no martial elements. Beginner-safe, educational focus.
```

**Narration (Hebrew)**:
```
תנועה איטית של הזרועות. 
זרוע אחת למעלה, זרוע אחת למטה. 
העברת משקל איטית מרגל אחת לשנייה.
```
*(Translation: "Slow arm movement. One arm up, one arm down. Slow weight transfer from one leg to the other.")*

---

#### Scene 4: Weight and Grounding Awareness (10 seconds)
**Purpose**: Emphasize root and balance

**Prompt**:
```
A person in Tai Chi stance practicing weight distribution and grounding. 
Slow shift of weight from left to right foot. 
Body remains centered, knees slightly bent. 
Calm facial expression, focused but relaxed. 
Camera: Full body shot. 
No fast movements, no martial elements. Beginner-safe, balance emphasis.
```

**Narration (Hebrew)**:
```
נעביר את המשקל מצד לצד, לאט. 
נרגיש את הקרקע מתחת לרגליים. 
הברכיים רכות, הגוף מרוכז.
```
*(Translation: "We transfer weight side to side, slowly. Feel the ground beneath your feet. Knees soft, body centered.")*

---

#### Scene 5: Closing Posture (10 seconds)
**Purpose**: Return to stillness, complete the cycle

**Prompt**:
```
A person in Tai Chi stance returning to opening posture. 
Arms slowly lower to sides, body becomes still. 
Deep, final breath. Peaceful, calm conclusion. 
Camera: Medium shot. 
No fast movements, no martial elements. Beginner-safe, calming ending.
```

**Narration (Hebrew)**:
```
מורידים את הידיים לאט לצדדים. 
חוזרים לתנוחת מנוחה. 
נשימה אחרונה, עמוקה ורגועה.
```
*(Translation: "Lower hands slowly to sides. Return to resting posture. One final breath, deep and calm.")*

---

## Scene Generation Flow

### Step-by-Step Process

**1. Job Created (Status: queued)**
```
User → POST /api/video-jobs
Backend → Create video_jobs record (status: queued)
Backend → Enqueue job → Worker Queue
```

**2. Worker Picks Up Job (Status: generating_clips)**
```
Worker → Fetch job from queue
Worker → Update job (status: generating_clips, progress: 0)
Worker → Fetch lesson structure (5 scenes)
Worker → Create 5 video_clips records (status: pending)
```

**3. For Each Scene (Sequential)**
```
Worker → Update clip (status: generating)
Worker → Build scene prompt
Worker → Call Video Provider API (generateClip)
Worker → Store provider task ID
Worker → Poll provider status (every 5 seconds)
Worker → Wait for clip completion (max 90 seconds)
Worker → Fetch clip URL from provider
Worker → Update clip (status: completed, clipUrl)
Worker → Update job progress (+20% per scene)
```

**4. All Scenes Completed**
```
Worker → Verify all 5 clips completed
Worker → Proceed to audio generation (see Hebrew TTS feature)
Worker → Proceed to stitching (see FFmpeg Pipeline)
```

---

## Prompt Engineering

### Prompt Structure Template

```
[SUBJECT] A person in [CONTEXT] performing [MOVEMENT].

[MOVEMENT_DETAILS] [Specific movement description].

[PACE_EMPHASIS] Movement is slow, controlled, and [ADJECTIVES].

[CAMERA] Camera: [SHOT_TYPE], [ANGLE].

[CONSTRAINTS] No fast movements, no martial elements. Beginner-safe, [FOCUS].
```

### Prompt Constraints

**Maximum Length**: 2000 characters (provider limit)

**Required Elements**:
- Subject: "A person in Tai Chi stance"
- Movement description: Specific, clear, simple
- Pace emphasis: "slow", "controlled", "gentle"
- Safety constraints: "No fast movements, no martial elements, beginner-safe"
- Camera direction: "Medium shot", "Full body", etc.

**Prohibited Elements**:
- Fast movements
- Martial arts combat
- Advanced techniques
- Jumping or high-impact movements

### Prompt Persistence

All prompts are stored in `video_clips.prompt_text` for:
- **Debugging**: If a clip fails, review the prompt
- **Reproducibility**: Regenerate identical clips
- **Optimization**: Analyze successful prompts
- **Caching** (Phase 3): Reuse clips with identical prompts

---

## Database Schema

### video_clips Table

```sql
CREATE TABLE video_clips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  scene_index INT NOT NULL,  -- 0 to 4
  scene_name VARCHAR(100) NOT NULL,  -- e.g., "Opening Posture"
  provider VARCHAR(50) NOT NULL,  -- e.g., "provider-a"
  provider_task_id VARCHAR(255) NULL,
  clip_url TEXT NULL,
  status ENUM('pending', 'generating', 'completed', 'failed') NOT NULL,
  prompt_text TEXT NOT NULL,
  metadata JSON NULL,  -- Provider-specific data
  retry_count INT DEFAULT 0,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES video_jobs(id) ON DELETE CASCADE,
  INDEX idx_job_scene (job_id, scene_index),
  INDEX idx_status (status)
);
```

---

## Error Handling

### Scene Generation Failures

**Scenario 1: Provider API Timeout**
```
Worker → Call provider API
Provider → No response after 90 seconds
Worker → Mark clip as failed
Worker → Increment retry_count
If retry_count < 3:
  Worker → Retry with same provider
Else:
  Worker → Try fallback provider
  If fallback also fails:
    Worker → Mark job as failed (error: "Scene X generation failed after retries")
```

**Scenario 2: Provider Returns Error**
```
Provider → Returns error: "Invalid prompt"
Worker → Log error in clip.error_message
Worker → Mark clip as failed
Worker → Retry with modified prompt (if possible)
If retry_count >= 3:
  Worker → Mark job as failed
```

**Scenario 3: Clip URL Inaccessible**
```
Worker → Fetch clip URL from provider
Worker → Attempt to download clip
Download fails (404, timeout, etc.)
Worker → Retry download (max 3 attempts)
If download fails 3 times:
  Worker → Mark clip as failed
  Worker → Request regeneration from provider
```

---

## Testing Strategy

### Unit Tests

1. **Lesson Structure Loading**:
   - Test `SceneManager::getLessonScenes('tai-chi-beginner')` returns 5 scenes
   - Verify each scene has: name, prompt, narration, duration

2. **Prompt Validation**:
   - Test prompt length < 2000 characters
   - Verify required elements present (subject, pace, constraints)

3. **Progress Calculation**:
   - Test job progress updates correctly per scene (0%, 20%, 40%, 60%, 80%, 100%)

### Integration Tests

1. **Scene Generation End-to-End**:
   - Create job → Generate all 5 scenes → Verify all clips completed
   - Check database: 5 clip records with status='completed'

2. **Provider Failure Handling**:
   - Mock provider failure → Verify retry logic
   - Mock 3 failures → Verify fallback provider used

3. **Clip Persistence**:
   - Generate clips → Verify clipUrl stored in database
   - Verify clips downloadable from stored URL

### E2E Tests

1. **Complete Video Generation**:
   - User creates job → System generates 5 scenes → Stitches → Returns video
   - Verify final video is 5 scenes concatenated

2. **User Experience**:
   - Monitor progress updates during generation
   - Verify smooth progression from 0% → 100%

---

## Success Metrics

### MVP Success Criteria

- **Scene Generation Success Rate**: 95% per scene (47 out of 50 scene generations succeed)
- **Average Scene Generation Time**: <90 seconds per scene
- **Total Lesson Generation Time**: <10 minutes (5 scenes + audio + stitching)
- **Cost Per Scene**: <$0.80 average
- **Total Cost Per Lesson**: <$4 average

### Post-MVP Optimization Goals (Phase 3)

- **Scene Generation Success Rate**: 98%
- **Average Scene Generation Time**: <60 seconds (with caching)
- **Total Lesson Generation Time**: <5 minutes
- **Cost Per Scene**: <$0.40 (with prompt caching)
- **Total Cost Per Lesson**: <$2

---

## Future Enhancements (Post-MVP)

### Phase 2: Scene Customization

- User selects scene duration (5s, 10s, or 15s)
- User selects environment (indoor, outdoor, park)
- More scenes per lesson (7-10 scenes for longer lessons)

### Phase 3: Intelligent Caching

**Prompt Hash Caching**:
```php
$promptHash = md5($promptText);
$cachedClip = VideoClip::where('prompt_hash', $promptHash)
  ->where('status', 'completed')
  ->first();

if ($cachedClip) {
  // Reuse existing clip (no generation needed)
  return $cachedClip->clipUrl;
} else {
  // Generate new clip
  $clipUrl = $this->provider->generateClip($promptText, $duration);
  // Store with prompt hash
  VideoClip::create([
    'prompt_hash' => $promptHash,
    'clip_url' => $clipUrl,
    // ...
  ]);
}
```

**Benefits**:
- Reduce generation costs (reuse identical scenes)
- Faster generation (no API calls for cached scenes)
- Consistent quality (same prompt = same clip)

### Phase 4: Parallel Scene Generation

**Current**: Sequential generation (Scene 1 → Scene 2 → Scene 3 → Scene 4 → Scene 5)

**Future**: Parallel generation (all 5 scenes at once)

**Benefits**:
- Reduce total generation time from 8 minutes → 2 minutes
- Requires concurrent worker pool

**Implementation**:
```php
// Dispatch 5 jobs in parallel
foreach ($scenes as $scene) {
  dispatch(new GenerateSceneJob($jobId, $scene));
}

// Wait for all scenes to complete
while ($job->completedSceneCount() < 5) {
  sleep(5);
}
```

---

## Related Documentation

- [PRD Overview](../PRD_OVERVIEW.md#mvp-features) - MVP scene-based generation requirement
- [Architecture](../ARCHITECTURE.md#video-orchestrator) - Video orchestration system design
- [Hebrew TTS Integration](hebrew-tts-integration.md) - Audio narration for each scene
- [Video Provider Abstraction](../technical/video-provider-abstraction.md) - Provider interface
- [FFmpeg Pipeline](../technical/ffmpeg-pipeline.md) - Clip stitching process
