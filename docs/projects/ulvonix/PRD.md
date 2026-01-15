# Ulvonix - PRD

**Status**: Planning / Proposal  
**Last Updated**: 2026-01-05

## Project Name

**Ulvonix**

## Project Type

Full-Stack Web & Mobile Application (Customer-Facing)

## Main Idea

Ulvonix is a unified social media bots platform that combines the capabilities of `bots/` and `discord-story-bot/` into a single, customer-facing product. It provides bot orchestration, content automation, scheduling, moderation, and analytics across multiple social platforms.

## Target Audience

- Brands and creators automating social media workflows
- Community managers managing engagement
- Teams running multiple social bots
- Businesses needing moderation and automation

## Technology Stack

**Frontend:**
- Next.js (React) with TypeScript
- Admin dashboard UI

**Backend:**
- Node.js with Express or NestJS
- Database: MySQL or SQLite (TBD)
- Queue system for bot jobs

**Mobile:**
- React Native (iOS & Android)
- Push notifications for moderation alerts

**Infrastructure:**
- Docker containerization
- CI/CD integration

## Core Features

### 1. Bot Orchestration
- Manage multiple bots from one dashboard
- Start/stop bots per platform
- Centralized bot configuration

### 2. Platform Integrations
- Discord, Telegram, Twitter/X, Instagram (phased)
- API integration per platform
- Token and permission management

### 3. Content Automation
- Scheduled posts and replies
- Content queues
- Auto-responses and triggers
- AI-assisted content generation (future)

### 4. Moderation Tools
- Keyword filters
- Auto-moderation rules
- Flagged content review
- User blacklist/whitelist

### 5. Analytics
- Engagement metrics
- Bot activity logs
- Response performance
- Growth tracking

### 6. Collaboration
- Team roles and permissions
- Shared bot management
- Activity audit logs

## Business Model

### Free Tier
- 1 platform integration
- 1 bot
- Limited scheduling

### Premium Tier ($X/month)
- Multiple platforms
- Advanced automation
- Analytics and reporting
- Team collaboration

## Success Metrics

- Monthly active teams
- Bots managed per account
- Engagement growth for users
- Automation time saved

## Development Phases

### Phase 1: MVP
- Discord bot management
- Basic scheduling
- Simple moderation

### Phase 2: Core Features
- Multi-platform integrations
- Analytics dashboard
- Team roles

### Phase 3: Advanced Features
- AI content tools
- Advanced automation
- Alerts and monitoring

## Notes

- **Customer-Facing**: Built for end users and teams
- **Unified Platform**: Replaces `bots/` and `discord-story-bot/`
- **Security**: Must protect tokens and moderation workflows

---

**Ulvonix is the unified social media bots platform, combining the best of `bots/` and `discord-story-bot/` into a single customer-facing product.**

---

## Review/Contribution

_This PRD will be reviewed and refined before implementation._
