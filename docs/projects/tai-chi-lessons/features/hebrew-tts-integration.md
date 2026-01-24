# Feature: Hebrew TTS Integration

## Overview

Hebrew text-to-speech (TTS) narration is a **core differentiator** of the Tai Chi Lessons platform. Instead of relying on AI video providers to generate Hebrew speech (which most don't support or do poorly), the system generates Hebrew audio narration **separately** using dedicated TTS services and overlays it onto the video clips using ffmpeg.

**User Benefit**: Clear, natural Hebrew narration that Hebrew speakers can understand and follow

**Business Value**: 
- Enables Hebrew market access (no existing Hebrew Tai Chi content)
- Quality control (dedicated TTS providers have better Hebrew support)
- Provider independence (video generation doesn't need to support Hebrew)

---

## User Stories

1. **As a Hebrew speaker**, I want to hear instructions in Hebrew so that I can understand and follow the movements
2. **As a user**, I want clear, natural-sounding narration so that I can focus on learning (not struggling to understand)
3. **As the system**, I want to generate audio separately from video so that I can control quality and support multiple languages
4. **As a developer**, I want to swap TTS providers so that I can optimize for quality, cost, or availability

---

## Requirements

### Functional Requirements

1. **Hebrew TTS Generation**:
   - Generate Hebrew audio narration for each scene (5 audio files per job)
   - Use dedicated Hebrew TTS provider (Google Cloud TTS, Azure TTS, or alternative)
   - Store narration text in database for debugging/reproducibility

2. **Audio Synchronization**:
   - Audio duration must match or be shorter than corresponding video clip
   - Audio starts at beginning of video (no delay)
   - Audio fades out if shorter than video

3. **Voice Configuration**:
   - Hebrew language: `he-IL` (Israel Hebrew)
   - Voice gender: Neutral or Female (calm, instructional tone)
   - Speaking rate: 0.9x (slightly slower for clarity)
   - Audio format: MP3 (for ffmpeg compatibility)

4. **Storage**:
   - Store audio files temporarily during generation
   - Store final audio URLs in database (`audio_narrations` table)
   - Delete temporary files after stitching

### Non-Functional Requirements

1. **Quality**:
   - Natural-sounding Hebrew speech (not robotic)
   - Clear pronunciation of movement instructions
   - Consistent voice across all scenes

2. **Performance**:
   - Generate audio for one scene in <5 seconds
   - Total audio generation time (5 scenes): <30 seconds

3. **Cost**:
   - Cost per scene: <$0.05
   - Total audio cost per lesson: <$0.25

4. **Reliability**:
   - 99% TTS generation success rate
   - Fallback to alternative provider if primary fails

---

## Hebrew Narration Strategy

### Why Separate Audio Generation?

**Problem**: Most AI video generation providers:
1. Don't support Hebrew audio
2. Have poor quality Hebrew TTS (if available)
3. Lock you into their TTS engine (no control over voice, pace)

**Solution**: Generate audio and video **independently**, then merge with ffmpeg

**Benefits**:
- **Quality control**: Use best-in-class Hebrew TTS providers (Google, Azure)
- **Provider independence**: Video provider doesn't need Hebrew support
- **Flexibility**: Change TTS provider without affecting video generation
- **Cost optimization**: Dedicated TTS services are cheaper than video+audio generation

---

## Architecture

### Audio Generation Flow

```
Worker → Fetch scene narration text
Worker → Call TTS Provider API
TTS Provider → Returns audio file (MP3)
Worker → Download audio to temp storage
Worker → Store audio URL in database (audio_narrations table)
Worker → Proceed to next scene
```

### TTS Provider Interface

```php
interface TTSProviderInterface {
  public function generateSpeech(string $text, string $language, array $options): string;
  public function getSupportedLanguages(): array;
  public function getSupportedVoices(string $language): array;
}
```

### Example: Google Cloud TTS Implementation

```php
class GoogleTTSClient implements TTSProviderInterface {
  private string $apiKey;
  private string $baseUrl = 'https://texttospeech.googleapis.com';
  
  public function generateSpeech(string $text, string $language, array $options = []): string {
    $voiceName = $options['voiceName'] ?? 'he-IL-Standard-A';
    $speakingRate = $options['speakingRate'] ?? 0.9;
    
    $response = $this->post('/v1/text:synthesize', [
      'input' => ['text' => $text],
      'voice' => [
        'languageCode' => $language,
        'name' => $voiceName,
        'ssmlGender' => 'NEUTRAL'
      ],
      'audioConfig' => [
        'audioEncoding' => 'MP3',
        'speakingRate' => $speakingRate,
        'pitch' => 0.0,
        'volumeGainDb' => 0.0
      ]
    ]);
    
    // Decode base64 audio content
    $audioContent = base64_decode($response['audioContent']);
    
    // Upload to temp storage
    $audioUrl = $this->uploadToTempStorage($audioContent, "{$jobId}_{$sceneIndex}.mp3");
    
    return $audioUrl;
  }
  
  public function getSupportedLanguages(): array {
    return ['he', 'en', 'ar', 'ru'];
  }
  
  public function getSupportedVoices(string $language): array {
    if ($language === 'he') {
      return [
        'he-IL-Standard-A' => 'Female',
        'he-IL-Standard-B' => 'Male',
        'he-IL-Standard-C' => 'Female',
        'he-IL-Standard-D' => 'Male',
        'he-IL-Wavenet-A' => 'Female (High Quality)',
        'he-IL-Wavenet-B' => 'Male (High Quality)'
      ];
    }
    return [];
  }
}
```

---

## Narration Text for MVP Lesson

### Scene 1: Opening Posture
**Hebrew**:
```
נעמוד במרחק כתפיים בין הרגליים. 
הברכיים מעט כפופות. 
הזרועות רפויות לצדדים. 
נשימה איטית ורגועה.
```

**Translation**: 
"We'll stand with feet shoulder-width apart. Knees slightly bent. Arms relaxed at sides. Slow, calm breathing."

**Duration**: ~8 seconds

---

### Scene 2: Basic Breathing
**Hebrew**:
```
בשאיפה, הידיים עולות לאט. 
בנשיפה, הידיים יורדות לאט. 
נשימה עמוקה ואיטית.
```

**Translation**: 
"On the inhale, hands rise slowly. On the exhale, hands lower slowly. Deep, slow breathing."

**Duration**: ~7 seconds

---

### Scene 3: First Movement
**Hebrew**:
```
תנועה איטית של הזרועות. 
זרוע אחת למעלה, זרוע אחת למטה. 
העברת משקל איטית מרגל אחת לשנייה.
```

**Translation**: 
"Slow arm movement. One arm up, one arm down. Slow weight transfer from one leg to the other."

**Duration**: ~8 seconds

---

### Scene 4: Weight and Grounding
**Hebrew**:
```
נעביר את המשקל מצד לצד, לאט. 
נרגיש את הקרקע מתחת לרגליים. 
הברכיים רכות, הגוף מרוכז.
```

**Translation**: 
"We transfer weight side to side, slowly. Feel the ground beneath your feet. Knees soft, body centered."

**Duration**: ~9 seconds

---

### Scene 5: Closing Posture
**Hebrew**:
```
מורידים את הידיים לאט לצדדים. 
חוזרים לתנוחת מנוחה. 
נשימה אחרונה, עמוקה ורגועה.
```

**Translation**: 
"Lower hands slowly to sides. Return to resting posture. One final breath, deep and calm."

**Duration**: ~7 seconds

---

## Database Schema

### audio_narrations Table

```sql
CREATE TABLE audio_narrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  scene_index INT NOT NULL,  -- 0 to 4
  provider VARCHAR(50) NOT NULL,  -- e.g., 'google-tts', 'azure-tts'
  audio_url TEXT NULL,
  status ENUM('pending', 'generating', 'completed', 'failed') NOT NULL,
  narration_text TEXT NOT NULL,  -- Hebrew text
  duration_seconds DECIMAL(5,2) NULL,  -- Actual audio duration
  voice_name VARCHAR(100) DEFAULT 'he-IL-Standard-A',
  speaking_rate DECIMAL(3,2) DEFAULT 0.90,
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

## Audio Generation Process

### Step-by-Step Flow

**1. After Video Clips Generated (Job Status: generating_audio)**
```
Worker → Update job (status: generating_audio, progress: 70)
Worker → Fetch lesson narration texts (5 scenes)
Worker → Create 5 audio_narrations records (status: pending)
```

**2. For Each Scene (Sequential)**
```
Worker → Update audio (status: generating)
Worker → Call TTS Provider API
  Request: {
    text: narration_text,
    language: 'he-IL',
    voice: 'he-IL-Standard-A',
    speakingRate: 0.9
  }
TTS Provider → Returns base64-encoded MP3 audio
Worker → Decode audio content
Worker → Upload audio to temp storage
Worker → Store audio URL
Worker → Update audio (status: completed, audio_url, duration_seconds)
Worker → Update job progress (+5% per scene)
```

**3. All Audio Generated**
```
Worker → Verify all 5 audio files completed
Worker → Proceed to ffmpeg stitching (status: stitching)
```

---

## TTS Provider Selection

### Primary Provider: Google Cloud Text-to-Speech

**Why Google Cloud TTS?**
- ✅ **High-quality Hebrew voices** (Wavenet, Standard)
- ✅ **Natural-sounding speech** (not robotic)
- ✅ **Reliable API** (99.9% uptime SLA)
- ✅ **Affordable pricing**: $4 per 1M characters (Standard), $16 per 1M characters (Wavenet)
- ✅ **Easy integration** (REST API, client libraries)

**Voice Options**:
- `he-IL-Standard-A`: Female, natural (MVP default)
- `he-IL-Wavenet-A`: Female, high quality (Phase 2 upgrade)

**Cost Estimate**:
- Average narration: ~50 words × 5 scenes = 250 words ≈ 1,500 characters
- Cost per lesson: $0.006 (Standard) or $0.024 (Wavenet)
- Very affordable compared to video generation ($4 per lesson)

---

### Fallback Provider: Azure Cognitive Services TTS

**Why Azure TTS?**
- ✅ **High-quality Hebrew voices** (Neural voices)
- ✅ **Reliable alternative** if Google fails
- ✅ **Similar API structure** (easy to swap)

**Voice Options**:
- `he-IL-HilaNeural`: Female, conversational
- `he-IL-AvriNeural`: Male, calm

**Implementation**:
```php
class AzureTTSClient implements TTSProviderInterface {
  private string $apiKey;
  private string $region = 'eastus';
  
  public function generateSpeech(string $text, string $language, array $options = []): string {
    $voiceName = $options['voiceName'] ?? 'he-IL-HilaNeural';
    
    $ssml = <<<SSML
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="he-IL">
  <voice name="{$voiceName}">
    <prosody rate="0.9">
      {$text}
    </prosody>
  </voice>
</speak>
SSML;
    
    $response = $this->post("/cognitiveservices/v1", $ssml, [
      'Content-Type' => 'application/ssml+xml',
      'X-Microsoft-OutputFormat' => 'audio-16khz-128kbitrate-mono-mp3'
    ]);
    
    // Upload audio to temp storage
    return $this->uploadToTempStorage($response, "{$jobId}_{$sceneIndex}.mp3");
  }
}
```

---

## Error Handling

### TTS Generation Failures

**Scenario 1: Provider API Error**
```
Worker → Call Google TTS API
API → Returns error: "Invalid language code"
Worker → Log error in audio.error_message
Worker → Mark audio as failed
Worker → Retry with corrected language code
If retry_count >= 3:
  Worker → Switch to fallback provider (Azure TTS)
  If fallback also fails:
    Worker → Mark job as failed (error: "Audio generation failed after retries")
```

**Scenario 2: Audio Too Long**
```
TTS Provider → Returns audio (duration: 15 seconds)
Video clip duration: 10 seconds
Worker → Log warning: "Audio longer than video"
Worker → Trim audio to match video duration (using ffmpeg)
Worker → Store trimmed audio
```

**Scenario 3: Empty or Invalid Text**
```
Worker → Fetch narration text
Narration text is empty or null
Worker → Log error: "Missing narration text for scene X"
Worker → Mark job as failed
Developer → Fix narration text in lesson structure
```

---

## Audio Synchronization with Video

### Overlay Strategy

**Using ffmpeg**:
```bash
ffmpeg -i video_clip.mp4 -i audio_narration.mp3 \
  -c:v copy \
  -c:a aac \
  -map 0:v:0 -map 1:a:0 \
  -shortest \
  output.mp4
```

**Flags**:
- `-c:v copy`: Copy video codec (no re-encoding)
- `-c:a aac`: Convert audio to AAC (widely compatible)
- `-map 0:v:0`: Use video from input 0
- `-map 1:a:0`: Use audio from input 1
- `-shortest`: Trim to shortest stream (video or audio)

**Result**: Video with Hebrew audio overlay

---

## Testing Strategy

### Unit Tests

1. **TTS Provider Interface**:
   - Test `GoogleTTSClient::generateSpeech()` returns audio URL
   - Test `GoogleTTSClient::getSupportedLanguages()` includes 'he'

2. **Narration Text Validation**:
   - Test all 5 scenes have Hebrew narration text
   - Verify narration text is not empty

### Integration Tests

1. **Audio Generation End-to-End**:
   - Generate audio for one scene → Verify audio file created
   - Check database: audio_narrations record with status='completed'

2. **Provider Fallback**:
   - Mock Google TTS failure → Verify Azure TTS used as fallback
   - Verify audio still generated successfully

3. **Audio Duration Validation**:
   - Generate audio → Verify duration matches narration length
   - Compare audio duration with video clip duration

### E2E Tests

1. **Complete Lesson Audio**:
   - Generate 5 audio files → Verify all stored correctly
   - Verify audio URLs accessible and downloadable

2. **Hebrew Speaker Testing**:
   - Play audio to native Hebrew speakers
   - Verify comprehension and naturalness
   - Target: 85%+ comprehension rate

---

## Success Metrics

### MVP Success Criteria

- **TTS Generation Success Rate**: 99% (499 out of 500 audio generations succeed)
- **Average Audio Generation Time**: <5 seconds per scene
- **Total Audio Generation Time**: <30 seconds (5 scenes)
- **Cost Per Audio**: <$0.05 per scene
- **Total Audio Cost**: <$0.25 per lesson
- **Hebrew Comprehension**: 85%+ (user feedback)

### Quality Metrics

- **Naturalness**: 4/5 average rating from Hebrew speakers
- **Clarity**: 4.5/5 average rating (pronunciation, pace)
- **Voice Consistency**: Same voice across all scenes (no jarring changes)

---

## Future Enhancements (Post-MVP)

### Phase 2: Voice Selection

**Feature**: User selects voice preference (male, female, or neutral)

```php
// User request
{
  "voicePreference": "female"  // "male", "female", "neutral"
}

// Backend maps to voice names
$voiceMap = [
  'female' => 'he-IL-Standard-A',
  'male' => 'he-IL-Standard-B',
  'neutral' => 'he-IL-Standard-C'
];
```

### Phase 3: Narration Speed Control

**Feature**: User controls narration pace (slow, normal, fast)

```php
// Speaking rate mapping
$speedMap = [
  'slow' => 0.8,    // 80% speed
  'normal' => 0.9,  // 90% speed (MVP default)
  'fast' => 1.0     // 100% speed
];
```

### Phase 4: Multi-Language Support

**Feature**: Generate lessons in multiple languages (Hebrew, English, Arabic, Russian)

```php
// Language → TTS configuration
$ttsConfig = [
  'he' => ['languageCode' => 'he-IL', 'voice' => 'he-IL-Standard-A'],
  'en' => ['languageCode' => 'en-US', 'voice' => 'en-US-Standard-C'],
  'ar' => ['languageCode' => 'ar-XA', 'voice' => 'ar-XA-Standard-A'],
  'ru' => ['languageCode' => 'ru-RU', 'voice' => 'ru-RU-Standard-A']
];
```

### Phase 5: Custom Narration Upload

**Feature**: Users upload their own Hebrew narration (MP3 files)

**Use Case**: Users with specific voice preferences or professional narrators

**Implementation**:
- Upload audio files per scene
- Validate duration matches video
- Use uploaded audio instead of TTS-generated audio

---

## Related Documentation

- [PRD Overview](../PRD_OVERVIEW.md#hebrew-tts-narration) - Hebrew TTS as core differentiator
- [Architecture](../ARCHITECTURE.md#hebrew-tts-api) - TTS provider architecture
- [Video Generation Pipeline](video-generation-pipeline.md) - Scene-level narration text
- [FFmpeg Pipeline](../technical/ffmpeg-pipeline.md) - Audio overlay process
