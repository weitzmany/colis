# Recipes - Documentation Index

## Overview

**Recipes** is a full-stack web and mobile application that helps users discover, save, and plan meals. The platform provides a mobile-first experience with recipe collections, meal planning, grocery list automation, and an optimized cooking mode.

**Target Audience**: Home cooks, families, meal planners, and diet-conscious users

**Business Model**: Freemium (Free tier + Premium subscription)

## Documentation Structure

### Core Documentation
- **[PRD Overview](PRD_OVERVIEW.md)** - Main product requirements document with MVP definition
- **[Architecture](ARCHITECTURE.md)** - Technical architecture and system design
- **[Expert Contributions](EXPERTS.md)** - Expert reviews and sign-offs

### Feature Documentation
- **[Cooking Mode](features/cooking-mode.md)** - Step-by-step cooking interface with timers
- **[Meal Planning](features/meal-planning.md)** - Weekly planner and grocery list automation
- **[Recipe Import](features/recipe-import.md)** - URL import and sharing functionality

### Technical Documentation
- **[API Design](technical/api-design.md)** - RESTful API specification
- **[Database Schema](technical/database-schema.md)** - Recipe data model and relationships
- **[Search System](technical/search-system.md)** - Recipe search and filtering
- **[Mobile Architecture](technical/mobile-architecture.md)** - React Native offline-first design

### Business Documentation
- **[Revenue Model](business/revenue-model.md)** - Freemium pricing and monetization
- **[User Personas](business/user-personas.md)** - Target user profiles
- **[Success Metrics](business/success-metrics.md)** - KPIs and measurement plan

### Compliance Documentation
- **[Data Privacy](compliance/data-privacy.md)** - GDPR, user data handling
- **[Accessibility](compliance/accessibility.md)** - WCAG compliance for recipes

## General/Shared Features

This project will use the following general features when they are extracted to `../general/`:

### Planned General Features (Candidates)
- **[Authentication System](../general/INDEX.md#authentication-system)** - User accounts and login (7 projects need this)
- **[Notification System](../general/INDEX.md#notification-system)** - Push reminders and email alerts (5 projects need this)
- **[Mobile App Foundation](../general/INDEX.md#mobile-app-foundation)** - React Native + Expo setup (5 projects need this)

**Note**: These are currently project-specific but are strong candidates for extraction to general features. This project's implementation will contribute to the general feature design.

## Project Status

- **Current Phase**: Planning
- **Priority**: Medium
- **Last Updated**: 2026-01-23
- **Target MVP Launch**: Q2 2026

## Quick Links

- [Project List Entry](../../reference/PROJECTS_LIST.md#recipes)
- [General Features Index](../general/INDEX.md)
- [Mobile Learning Companion](../mobile-learning-companion/INDEX.md) (Similar mobile architecture)
- [Meal Planner & Grocery](../meal-planner-grocery/INDEX.md) (Complementary project)

## Tech Stack Summary

- **Frontend**: Next.js 14+ (React, TypeScript)
- **Backend**: Node.js with NestJS
- **Database**: PostgreSQL
- **Mobile**: React Native + Expo
- **Search**: PostgreSQL Full-Text Search or Elasticsearch
- **Infrastructure**: Docker, CI/CD
- **Hosting**: Vercel (Web), App Store + Google Play (Mobile)

## MVP Features (Phase 1)

1. Recipe saving and collections
2. Basic meal planner
3. Cooking mode with timers
4. Mobile-responsive web app

See [PRD Overview - MVP Definition](PRD_OVERVIEW.md#mvp-minimum-viable-product-definition) for complete MVP scope.

## Development Phases

- **Phase 1 (MVP)**: Recipe library, cooking mode, basic meal planning - 8 weeks
- **Phase 2 (Core)**: Import/sharing, grocery automation, mobile app - 10 weeks
- **Phase 3 (Premium)**: Nutrition insights, diet profiles, recommendations - 8 weeks

---

**Last Updated**: 2026-01-23
**Status**: Planning - Comprehensive documentation structure created
