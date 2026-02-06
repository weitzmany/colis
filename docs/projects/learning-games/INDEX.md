# Learning Games - Documentation Index

## Overview

**Learning Games** is an interactive, game-based learning platform that transforms challenging STEM subjects (initially Physics 1 and Calculus 1) into engaging practice experiences with adaptive learning, progress tracking, and exam preparation.

**Status**: Planning  
**Last Updated**: 2026-01-22  
**Priority**: High  
**Category**: Full-Stack Web & Mobile Application (Educational Technology)

## Quick Links

- [PRD Overview](PRD_OVERVIEW.md) - Complete product requirements and MVP definition
- [Architecture](ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs

## Documentation Structure

### Main Documentation
- **[PRD_OVERVIEW.md](PRD_OVERVIEW.md)** - Main requirements document
  - Executive Summary
  - Problem Statement & Solution
  - **MVP Definition** (Complete with features, criteria, timeline)
  - Post-MVP Features (Phase 2+)
  - User Personas
  - Business Model
  - Success Metrics
  - Timeline & Milestones
  
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
  - System Overview
  - Frontend Architecture (Angular)
  - Backend Architecture (PHP/Slim)
  - Database Design (MySQL)
  - Security Architecture
  - Mobile Architecture (Phase 2)
  - Integration Architecture

- **[EXPERTS.md](EXPERTS.md)** - Expert team and contributions
  - Product Management (Patricia Martinez)
  - Educational Content (Carol Williams)
  - Learning Analytics (Andrew Mitchell)
  - Architecture (Marcus Johnson)
  - Security & Compliance (Ryan Kim, Constance White)
  - Full expert team with sign-offs

### General/Shared Features

This project uses the following general features (or will once they're extracted):

#### Potential General Features (Not Yet Extracted)
- **Authentication System** (⚠️ Candidate) - JWT authentication, user registration/login, password reset
  - Status: Currently project-specific, candidate for extraction (7+ projects use it)
  - Will reference [../../general/anchorage/PRD.md](../../general/anchorage/PRD.md) once extracted
- **Notification System** (⚠️ Candidate) - Email/push notifications for practice reminders
  - Status: Currently project-specific, candidate for extraction (5+ projects use it)
  - Will reference [../../general/notifications/PRD.md](../../general/notifications/PRD.md) once extracted

**Note**: These features are currently project-specific but are candidates for extraction to `general/` once they meet the criteria (3+ projects + minimal configuration OR architectural override).

### Project-Specific Features

All core learning features are project-specific due to educational content domain:

- **Game-Based Practice System** - Interactive challenges, quizzes, difficulty progression
- **Adaptive Learning Engine** - Personalized difficulty, concept mastery tracking
- **Exam Preparation Tools** - Mock exams, timed sessions, performance analysis
- **Progress & Analytics Dashboard** - Skill tracking, streaks, learning analytics
- **Content Management System** - Question banks, metadata, versioning
- **Mobile Learning Features** (Phase 2) - Quick practice, offline access, notifications

These features are tightly coupled to the educational domain and won't be extracted to general features.

## Tech Stack

### Frontend
- **Framework**: Angular
- **State Management**: NgRx or Angular Services
- **UI Components**: Angular Material
- **Mobile**: React Native + Expo (Phase 2)

### Backend
- **Framework**: PHP (Slim 4)
- **Authentication**: JWT tokens
- **API**: RESTful API design
- **Content Delivery**: Question serving API

### Database
- **Primary DB**: MySQL
- **Schema**: Users, questions, progress, analytics
- **Containerization**: Docker + Docker Compose

### Infrastructure
- **Deployment**: Docker containers
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Application logging (planned)

## Project Status

- **Current Phase**: Planning
- **Last Updated**: 2026-01-22
- **Priority**: High (Educational technology focus)
- **MVP Target**: TBD (see PRD_OVERVIEW.md for detailed timeline)

## Key Differentiators

1. **STEM Focus** - Specialized in Physics and Calculus, not general knowledge
2. **Adaptive Learning** - Personalized difficulty based on performance
3. **Exam Preparation** - Specifically designed for university exam success
4. **Progress Tracking** - Detailed analytics on concept mastery
5. **Game-Based Engagement** - Makes challenging subjects motivating

## Target Users

1. **University Students** - Primary users taking Physics 1, Calculus 1
2. **High School Students** - Preparing for advanced STEM courses
3. **Lifelong Learners** - Seeking to improve STEM knowledge

## Navigation Guide

### For Product Managers
- Start with [PRD_OVERVIEW.md](PRD_OVERVIEW.md) - MVP definition and business model
- Review success metrics and timeline sections

### For Developers
- Start with [ARCHITECTURE.md](ARCHITECTURE.md) - Technical design
- Review API design and database schema sections
- Check potential general features for authentication patterns

### For Educational Content Creators
- Review [PRD_OVERVIEW.md](PRD_OVERVIEW.md) - Educational requirements
- Focus on adaptive learning and content management sections
- See [EXPERTS.md](EXPERTS.md) for Carol Williams and Andrew Mitchell contributions

### For Stakeholders
- Read Executive Summary in [PRD_OVERVIEW.md](PRD_OVERVIEW.md)
- Review Success Metrics and Business Model sections
- Check Timeline & Milestones for delivery expectations

## Related Documentation

- [Projects List Entry](../../reference/PROJECTS_LIST.md#3-learning-games) - Summary entry
- [General Features Index](../general/INDEX.md) - Shared features (future)

## Contributing to Documentation

When updating this documentation:
1. Update the relevant specific file (PRD_OVERVIEW.md, ARCHITECTURE.md, etc.)
2. Update this INDEX.md if structure changes
3. Add expert contributions to EXPERTS.md
4. Keep files under 500 lines (split if needed)
5. Maintain cross-references between documents

---

**Learning Games transforms STEM learning into interactive, motivating practice that improves mastery and exam performance.**
