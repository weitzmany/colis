# Tai Chi Lessons - Documentation Index

## Overview

An AI-powered web application that generates beginner-level Tai Chi video lessons with Hebrew narration. The system uses a scene-based video generation approach, stitching multiple short clips into complete lessons with synchronized audio narration.

**Project Type**: Web Application (Video Generation Engine)  
**Status**: Planning  
**Priority**: Medium  

## Documentation Structure

- [PRD Overview](PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](ARCHITECTURE.md) - Technical architecture and video pipeline design
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs

### Global/Shared Features

This project may use the following general features (documented in [../general/](../general/INDEX.md)):
- No general features currently identified (standalone video generation system)

### Project-Specific Features

- [Video Generation Pipeline](features/video-generation-pipeline.md) - Scene-based video clip generation and stitching
- [Hebrew TTS Integration](features/hebrew-tts-integration.md) - Text-to-speech for Hebrew narration
- [Async Job Processing](features/async-job-processing.md) - Background video generation with progress tracking

### Technical

- [API Design](technical/api-design.md) - REST API endpoints and job lifecycle
- [Video Provider Abstraction](technical/video-provider-abstraction.md) - Provider interface and fallback strategy
- [FFmpeg Pipeline](technical/ffmpeg-pipeline.md) - Video stitching and audio overlay

### Business

- [Cost Control Strategy](business/cost-control-strategy.md) - Provider cost management and caching
- [Success Metrics](business/success-metrics.md) - MVP success criteria

## Project Status

- **Current Phase**: Planning
- **Last Updated**: 2026-01-25
- **Priority**: Medium
- **Target Users**: Individual beginners with no Tai Chi experience

## Key Characteristics

- **Single-purpose**: Personal video generation tool (non-social)
- **Hebrew-first**: Hebrew narration via dedicated TTS
- **Scene-based**: Multiple short clips stitched into lessons
- **Provider-agnostic**: Abstracted video generation providers
- **Async processing**: Background job queue with progress polling

## Quick Links

- [MVP Definition](PRD_OVERVIEW.md#mvp-minimum-viable-product-definition)
- [User Flow](PRD_OVERVIEW.md#user-flow)
- [Lesson Structure](features/video-generation-pipeline.md#lesson-structure)
- [API Endpoints](technical/api-design.md#endpoints)
