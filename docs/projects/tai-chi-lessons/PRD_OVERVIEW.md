# Tai Chi Lessons - Product Requirements Document

## Executive Summary

**Vision**: Create an AI-powered video generation engine that produces beginner-level Tai Chi lessons with Hebrew narration, enabling absolute beginners to learn safe, slow, and educational Tai Chi movements at home.

**Target Users**: Individual users with no prior Tai Chi experience seeking calm, guided first lessons

**Key Value Propositions**:
- AI-generated personalized Tai Chi video lessons
- Hebrew narration for accessibility
- Beginner-safe, slow-paced movements
- On-demand generation (no pre-recorded library)

**Success Metrics**:
- MVP: Generate complete 5-minute lesson in under 10 minutes
- Video quality: 90% user satisfaction with movement clarity
- Hebrew TTS quality: 85% comprehension rate
- System stability: 99% successful job completion rate

---

## Problem Statement

### What problem does this solve?

Beginners interested in Tai Chi face barriers to entry:
1. **Language barriers**: Most Tai Chi content is in English or Chinese
2. **Pace issues**: Many tutorials move too quickly for absolute beginners
3. **Safety concerns**: Fast or advanced movements can cause injury
4. **Lack of personalization**: Pre-recorded content doesn't adapt to individual needs

### Who experiences this problem?

- Hebrew-speaking individuals interested in Tai Chi
- Complete beginners with no martial arts background
- People seeking calm, meditative movement practices at home
- Users who prefer guided instruction in their native language

### Current solutions and their limitations

**Existing Solutions**:
- YouTube Tai Chi tutorials (mostly English, variable quality)
- In-person classes (requires travel, fixed schedule)
- DVD/streaming courses (static content, no Hebrew options)

**Limitations**:
- Limited Hebrew content
- Pre-recorded content can't adapt to user level
- Fast-paced movements unsafe for beginners
- No on-demand generation

---

## Solution Overview

### Proposed Solution

A web-based **video generation engine** that:
1. Breaks Tai Chi lessons into logical scenes (5-10 seconds each)
2. Generates each scene as a separate video clip using AI providers
3. Generates Hebrew narration using dedicated TTS services
4. Stitches clips together with synchronized audio
5. Delivers a complete, playable lesson video

**This is NOT**:
- A content platform
- A social product
- A real-time streaming service

**This IS**:
- A video generation engine
- An async job processing system
- A beginner education tool

### How it addresses the problem

1. **Language barrier**: Hebrew narration via dedicated TTS
2. **Pace control**: Explicitly slow movements in AI prompts
3. **Safety**: Beginner-focused prompts exclude fast/advanced moves
4. **On-demand**: Generate fresh videos per request

### Key Differentiators

- **Scene-based generation**: Overcomes provider limitations (no 5-minute single calls)
- **Hebrew-first design**: TTS audio separate from video generation
- **Provider abstraction**: Swappable AI video providers (fallback resilience)
- **Cost-aware**: Prompt caching, scene reuse, rate limiting

---

## User Personas

### Primary User: "Miriam - The Curious Beginner"

**Demographics**:
- Age: 45-65
- Location: Israel (Hebrew speaker)
- Technical skill: Basic (can use websites, watch videos)
- Tai Chi experience: None

**Needs**:
- Slow, clear movement instruction
- Hebrew narration she can understand
- Safe exercises she can do at home
- Calm, non-intimidating introduction

**Pain Points**:
- Existing content too fast or advanced
- Language barriers in most tutorials
- Uncertainty about correct form
- Fear of injury from incorrect movements

**User Story**: "As a Hebrew-speaking beginner, I want to watch a slow, guided Tai Chi lesson in my language so that I can learn safely at home without feeling overwhelmed."

### Secondary User: "David - The Wellness Seeker"

**Demographics**:
- Age: 30-50
- Location: Israel
- Technical skill: Moderate
- Tai Chi experience: Aware but never practiced

**Needs**:
- Convenient at-home practice
- Stress relief through gentle movement
- No commitment to classes
- On-demand access

**Pain Points**:
- Can't commit to fixed class schedules
- Prefers trying new activities privately
- Limited Hebrew Tai Chi resources
- Wants to start "from zero"

**User Story**: "As a busy professional, I want to generate a Tai Chi lesson on demand so that I can practice stress relief at home on my schedule."

---

## MVP (Minimum Viable Product) Definition

### MVP Scope

- **Core Problem**: Hebrew-speaking beginners have no access to slow, safe, Hebrew-narrated Tai Chi instruction
- **Core User**: Individual Hebrew speakers with zero Tai Chi experience
- **Core Value**: Generate a complete 5-minute beginner Tai Chi lesson with Hebrew narration on demand

### MVP Features (Must-Have)

#### 1. Simple Video Generation UI
**Description**: Minimal web interface with one button: "Generate Tai Chi Lesson"

- **Why in MVP**: Essential for user interaction (only way to request videos)
- **User story**: As a user, I want to click one button so that I can request a lesson without complex choices
- **Acceptance criteria**:
  - Single-page Angular app
  - "Generate" button triggers job creation
  - Progress indicator shows generation status
  - Video player displays completed lesson

#### 2. Scene-Based Video Generation
**Description**: Break lesson into 5 short scenes, generate each as 5-10 second clip using AI video providers

- **Why in MVP**: Core technical approach (cannot generate 5-minute videos in single API call due to provider limits)
- **User story**: As the system, I want to generate multiple short clips so that I can work within provider constraints and control costs
- **Acceptance criteria**:
  - 5 predefined scenes (opening posture, breathing, first movement, grounding, closing)
  - Each scene has dedicated prompt (under 2000 chars)
  - Clips stored temporarily during generation
  - Scene order is fixed for MVP

#### 3. Hebrew TTS Narration
**Description**: Generate Hebrew audio narration separately from video, then overlay using ffmpeg

- **Why in MVP**: Core differentiator (Hebrew language support)
- **User story**: As a Hebrew speaker, I want to hear instructions in Hebrew so that I can understand and follow along
- **Acceptance criteria**:
  - Dedicated Hebrew TTS provider integration
  - Narration text matches scene content
  - Audio synchronized with video timing
  - Consistent voice across all scenes

#### 4. Async Job Processing
**Description**: Background job queue processes video generation asynchronously with progress tracking

- **Why in MVP**: Video generation takes 5-10 minutes (cannot be synchronous)
- **User story**: As a user, I want to see generation progress so that I know my request is being processed
- **Acceptance criteria**:
  - Job lifecycle states (queued, processing, completed, failed)
  - Progress percentage exposed via API
  - Frontend polls job status every 3 seconds
  - Failed jobs show error message

#### 5. Video Stitching Pipeline
**Description**: ffmpeg-based pipeline stitches short clips into single MP4 with audio overlay

- **Why in MVP**: Must deliver single playable video (not 5 separate clips)
- **User story**: As a user, I want to receive one complete video so that I can watch the entire lesson without interruption
- **Acceptance criteria**:
  - ffmpeg installed on backend server
  - Clips concatenated in scene order
  - Hebrew audio overlaid on final video
  - Output: Single MP4 file (720p minimum)
  - Uploaded to object storage (S3/R2 compatible)

### MVP Success Criteria

- **User Adoption**: 10 successful video generations in first week (internal testing)
- **Generation Time**: Complete 5-minute lesson in under 10 minutes (async)
- **Quality**: 90% of generated videos have clear, slow movements (manual review)
- **Hebrew TTS**: 85% comprehension rate (user feedback)
- **Technical Stability**: 99% job completion rate (no failed jobs due to system errors)
- **Cost Control**: Average generation cost under $5 per video

### MVP Timeline

- **Development**: 8 weeks
  - Week 1-2: Backend API, job queue, database schema
  - Week 3-4: Video provider integration, scene generation
  - Week 5-6: Hebrew TTS integration, ffmpeg pipeline
  - Week 7: Frontend UI, job polling
  - Week 8: End-to-end testing, bug fixes
- **Testing**: 2 weeks
  - Internal testing: 10+ video generations
  - Hebrew speaker feedback: 5+ users
  - Performance and cost testing
- **Launch**: Week 11 (internal alpha release)

### MVP Tech Stack

- **Frontend**: Angular 18, TypeScript
- **Backend**: PHP (Slim Framework 4), REST API
- **Database**: MySQL or PostgreSQL
- **Job Queue**: Redis-backed queue or database-based queue
- **Video Processing**: ffmpeg (installed on server)
- **Video Provider**: Primary + fallback AI video generation provider (abstracted)
- **TTS Provider**: Hebrew TTS service (Google Cloud TTS, Azure TTS, or alternative)
- **Object Storage**: S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
- **Hosting**: DigitalOcean, AWS, or similar (with ffmpeg support)

### What's NOT in MVP (Future Features)

- **User Authentication**: No login required (anyone can generate)
  - *Why post-MVP*: Adds complexity, MVP is single-user proof-of-concept
- **Multiple Lesson Types**: Only "First Tai Chi Lesson"
  - *Why post-MVP*: Need to validate one lesson before expanding library
- **Difficulty Levels**: Only beginner level
  - *Why post-MVP*: Must prove beginner experience first
- **Video Editing UI**: No ability to customize scenes or regenerate clips
  - *Why post-MVP*: Adds significant complexity, fixed lesson structure sufficient for MVP
- **Social Features**: No sharing, comments, or profiles
  - *Why post-MVP*: This is a personal tool, not a social platform
- **Payment System**: Free to use
  - *Why post-MVP*: Validate value proposition before monetization
- **Mobile App**: Responsive web only
  - *Why post-MVP*: Web-first reduces development scope
- **Multiple Instructors**: Single AI-generated instructor persona
  - *Why post-MVP*: Consistency more important than variety for MVP
- **Real-time Generation**: All generation is async
  - *Why post-MVP*: Technically infeasible with current providers

---

## Post-MVP Features (Phase 2+)

### Phase 2: Core Enhancements (Weeks 12-20)

1. **User Authentication** [Priority: High]
   - User accounts with login/signup
   - Video generation history
   - Personal library of generated lessons

2. **Multiple Lesson Types** [Priority: High]
   - Lesson 2: Basic movements
   - Lesson 3: Flow and transitions
   - Lesson 4: Balance and centering
   - Lesson 5: Complete beginner sequence

3. **Video Customization** [Priority: Medium]
   - Select lesson duration (3, 5, or 7 minutes)
   - Choose narration pace (slow, normal)
   - Select environment (indoor, outdoor, park)

4. **Improved Progress UI** [Priority: Medium]
   - Real-time scene-by-scene progress
   - Estimated time remaining
   - Preview of current scene being generated

### Phase 3: Advanced Features (Weeks 21-30)

5. **Difficulty Levels** [Priority: Medium]
   - Beginner (MVP)
   - Intermediate
   - Advanced

6. **Download and Save** [Priority: Medium]
   - Download videos for offline viewing
   - Save favorite lessons
   - Video expires after 7 days (re-generate on demand)

7. **Cost Optimization** [Priority: High]
   - Scene prompt caching (reuse clips for identical prompts)
   - Multiple provider load balancing
   - Smart fallback on provider failure

8. **Analytics Dashboard** [Priority: Low]
   - Generation success rate
   - Average generation time
   - Cost per video
   - User engagement metrics

### Phase 4: Future Expansion (Post-MVP)

9. **Additional Languages** [Priority: Low]
   - English narration
   - Arabic narration
   - Russian narration

10. **Mobile App** [Priority: Low]
    - Native iOS app
    - Native Android app
    - Optimized for mobile video playback

11. **Public API** [Priority: Low]
    - Developer access to video generation
    - API key management
    - Usage-based pricing

12. **Instructor Customization** [Priority: Low]
    - Male/female instructor option
    - Different instructor personas
    - Customizable instructor appearance

---

## Technical Requirements (High-Level)

### Tech Stack Summary

- **Frontend**: Angular 18, TypeScript, RxJS (polling), Video.js (player)
- **Backend**: PHP 8.2+, Slim Framework 4, REST API
- **Database**: MySQL 8+ or PostgreSQL 14+
- **Job Queue**: Redis-backed or database-based async job queue
- **Video Processing**: ffmpeg 6+
- **AI Services**: 
  - Video generation provider (abstracted interface)
  - Hebrew TTS provider (Google Cloud TTS, Azure, or alternative)
- **Storage**: S3-compatible object storage
- **Infrastructure**: Server with ffmpeg installed, adequate disk space for temporary files

### Infrastructure

- **Server Requirements**:
  - 4+ CPU cores (ffmpeg video processing)
  - 8+ GB RAM
  - 50+ GB disk space (temporary clip storage)
  - ffmpeg installed and accessible
- **Object Storage**:
  - S3-compatible (AWS S3, Cloudflare R2, MinIO)
  - Bucket for final MP4 files
  - Signed URL generation for secure access
- **External Services**:
  - Video generation API (provider-agnostic)
  - Hebrew TTS API (Google Cloud TTS, Azure TTS, etc.)

### Integrations

- **Video Provider API**: Generate short video clips (5-10s)
- **TTS Provider API**: Generate Hebrew audio narration
- **Object Storage API**: Upload/download video files

### Non-Functional Requirements

- **Performance**: Generate complete 5-minute lesson in under 10 minutes
- **Reliability**: 99% job completion rate
- **Cost**: Under $5 per video generation (on average)
- **Security**: API keys secured on backend, rate limiting, no user data storage (MVP)
- **Scalability**: Handle 10 concurrent video generations (MVP capacity)

---

## Business Requirements (High-Level)

### Revenue Model (Post-MVP)

- **Freemium**: 
  - Free: 1 video generation per week
  - Premium: $9.99/month for unlimited generations
- **Pay-per-video**: $2.99 per video generation (no subscription)
- **API Access**: Usage-based pricing for developers (Phase 4)

### Pricing Strategy (Post-MVP)

- **Launch**: Free during MVP and Phase 2 (validate value proposition)
- **Phase 3**: Introduce freemium model
- **Phase 4**: Add pay-per-video and API pricing

### Go-to-Market (Post-MVP)

- **MVP Launch**: Internal testing, friends/family feedback
- **Phase 2**: Soft launch to Hebrew-speaking communities (Facebook groups, forums)
- **Phase 3**: Public launch with landing page, SEO, content marketing
- **Phase 4**: Partnerships with wellness apps, Hebrew learning platforms

---

## Timeline & Milestones

### Phase 1: MVP (Weeks 1-11)

- **Week 1-2**: Backend foundation (API, database, job queue)
- **Week 3-4**: Video provider integration, scene generation logic
- **Week 5-6**: Hebrew TTS, ffmpeg pipeline
- **Week 7**: Frontend UI, video player, job polling
- **Week 8**: End-to-end testing, bug fixes
- **Week 9-10**: Internal testing (10+ video generations)
- **Week 11**: Alpha launch (internal)

### Phase 2: Core Enhancements (Weeks 12-20)

- **Week 12-14**: User authentication, video history
- **Week 15-18**: Multiple lesson types (Lessons 2-5)
- **Week 19-20**: Video customization options

### Phase 3: Advanced Features (Weeks 21-30)

- **Week 21-24**: Difficulty levels (beginner, intermediate, advanced)
- **Week 25-27**: Download, save, and caching
- **Week 28-30**: Analytics dashboard, cost optimization

---

## Success Criteria

### Quantitative Metrics

**MVP Success**:
- 10+ successful video generations in first week
- <10 minute average generation time
- 99% job completion rate
- <$5 average cost per video

**Phase 2 Success**:
- 50+ registered users
- 100+ total video generations
- 85%+ Hebrew TTS comprehension rate (user feedback)
- 80%+ user satisfaction with movement clarity

**Phase 3 Success**:
- 200+ registered users
- 500+ total video generations
- 70% user retention (return within 30 days)
- $3 average cost per video (optimization working)

### Qualitative Metrics

- **MVP**: Users can successfully generate and watch a complete lesson
- **Phase 2**: Users report feeling comfortable following movements
- **Phase 3**: Users recommend the platform to friends

### Business Goals

- **MVP**: Validate technical feasibility and Hebrew TTS quality
- **Phase 2**: Validate user demand and engagement
- **Phase 3**: Achieve product-market fit, prepare for monetization

---

## Risks & Mitigation

### Technical Risks

1. **Risk**: Video provider API limits or downtime
   - **Impact**: High (cannot generate videos)
   - **Probability**: Medium
   - **Mitigation**: 
     - Implement provider abstraction with fallback
     - Support multiple video providers
     - Monitor provider status and switch proactively

2. **Risk**: Hebrew TTS quality insufficient
   - **Impact**: High (core differentiator fails)
   - **Probability**: Medium
   - **Mitigation**: 
     - Test multiple TTS providers during development
     - Use Google Cloud TTS or Azure (high-quality Hebrew)
     - Allow manual narration upload as fallback (Phase 2)

3. **Risk**: ffmpeg stitching fails or produces artifacts
   - **Impact**: Medium (visual quality issues)
   - **Probability**: Low
   - **Mitigation**: 
     - Extensive testing with sample clips
     - Use proven ffmpeg command patterns
     - Manual review of first 20 generated videos

4. **Risk**: Generation takes too long (>15 minutes)
   - **Impact**: Medium (poor user experience)
   - **Probability**: Medium
   - **Mitigation**: 
     - Optimize scene count and clip duration
     - Parallelize scene generation where possible
     - Monitor and alert on slow jobs

### Business Risks

5. **Risk**: Low user demand for AI-generated Tai Chi
   - **Impact**: High (product not viable)
   - **Probability**: Medium
   - **Mitigation**: 
     - MVP testing with target users (Hebrew speakers)
     - Pivot to other wellness/exercise content if needed
     - Validate demand with landing page before full build

6. **Risk**: Generation costs too high (>$10 per video)
   - **Impact**: High (not financially sustainable)
   - **Probability**: Medium
   - **Mitigation**: 
     - Implement prompt caching to reuse clips
     - Optimize scene count and duration
     - Rate limiting and usage caps
     - Explore lower-cost video providers

7. **Risk**: Legal/safety concerns (users injure themselves)
   - **Impact**: High (liability)
   - **Probability**: Low
   - **Mitigation**: 
     - Clear disclaimers (not medical advice)
     - Emphasize slow, safe movements in prompts
     - Terms of service with liability waiver
     - Beginner-only content in MVP

### Compliance Risks

8. **Risk**: Video content copyright issues
   - **Impact**: Medium (legal complications)
   - **Probability**: Low
   - **Mitigation**: 
     - Use AI-generated content only (no stock footage)
     - Clear ownership of generated videos
     - Terms clarify user rights to generated content

9. **Risk**: Data privacy concerns (if user accounts added)
   - **Impact**: Medium (GDPR compliance)
   - **Probability**: Low (no user accounts in MVP)
   - **Mitigation**: 
     - No user data collection in MVP
     - GDPR compliance before Phase 2 user accounts
     - Privacy policy and cookie consent (Phase 2)

---

## Guiding Principles

1. **Safety over spectacle**: Slow, beginner-safe movements always take priority
2. **Deterministic workflows**: Predictable, traceable video generation pipeline
3. **Provider independence**: Swappable AI video providers (not locked to one vendor)
4. **Hebrew-first design**: Language support is core, not an afterthought
5. **Cost-aware architecture**: Scene-based generation controls costs
6. **AI as a tool**: Video generation is a means to deliver lessons, not the product itself

---

## Related Documentation

- [Architecture](ARCHITECTURE.md) - System design and video pipeline
- [Video Generation Pipeline](features/video-generation-pipeline.md) - Scene-based generation details
- [Hebrew TTS Integration](features/hebrew-tts-integration.md) - Audio narration strategy
- [API Design](technical/api-design.md) - REST endpoints and job lifecycle
- [Cost Control Strategy](business/cost-control-strategy.md) - Provider cost management
