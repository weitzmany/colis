# Mobile Learning Companion - Documentation Index

## Overview

The **Mobile Learning Companion** is an educational mobile application designed to provide students with offline-capable practice exercises, progress tracking, and intelligent reminders to support continuous learning. Built with Capacitor for cross-platform mobile deployment (iOS & Android), the app enables learners to practice anytime, anywhere, with or without internet connectivity.

**Target Users**: Students (K-12, university), self-learners, professional learners  
**Primary Value**: Offline-first mobile learning with intelligent progress tracking and adaptive reminders  
**Business Model**: Freemium with premium features for advanced analytics and content libraries

## Documentation Structure

### Core Documentation
- **[PRD Overview](PRD_OVERVIEW.md)** - Main product requirements document with MVP definition
- **[Architecture](ARCHITECTURE.md)** - Technical architecture and system design
- **[Expert Contributions](EXPERTS.md)** - Expert reviews and sign-offs

### General/Shared Features

This project may use the following general features (documented in [../general/](../general/INDEX.md)):

**Potential General Features** (to be evaluated):
- **Authentication System** - User registration, login, and JWT-based auth (if multi-user support needed)
- **Notification System** - Push notifications and reminders (core feature)
- **Mobile App Foundation** - Capacitor setup, offline-first architecture

**Note**: These features are currently project-specific but may be extracted to `general/` if adopted by 3+ projects with minimal configuration requirements OR if they meet architectural override criteria (security-critical, centrally deployed, compliance-required).

### Project-Specific Features

All features are currently project-specific:
- **Offline Practice** - Core learning feature with offline capability
- **Progress Tracking** - Learning analytics and progress visualization
- **Smart Notifications** - Adaptive reminder system for practice sessions
- **Content Library** - Practice exercises and learning materials

## Project Status

- **Current Phase**: Planning
- **Priority**: Medium
- **Last Updated**: 2026-01-22
- **Target Launch**: Q3 2026 (MVP)

## Quick Links

- **Project Entry**: [PROJECTS_LIST.md](../../reference/PROJECTS_LIST.md#22-mobile-learning-companion)
- **General Features**: [../general/INDEX.md](../general/INDEX.md)

## Expert Team

See [EXPERTS.md](EXPERTS.md) for complete expert team and contributions.

**Core Team**:
- Patricia Martinez - Product Manager
- Michael Brown - Mobile Expert
- Carol Williams - Educational Content Expert
- Samuel Rodriguez - Backend Expert
- Thomas Anderson - Frontend Expert

---

**Document Version**: 1.0  
**Created**: 2026-01-22  
**Status**: Initial planning phase
