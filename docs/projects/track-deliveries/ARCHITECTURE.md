# Track Deliveries - Architecture Document

**Version**: 1.1  
**Last Updated**: 2026-01-25  
**Status**: Planning / Proposal

---

## System Overview

Track Deliveries follows a three-tier architecture with clear separation of concerns.

```
Clients (Web, Mobile, Responsive)
        |
      HTTPS
        |
API Gateway / App Server (Express or NestJS)
        |
+-----------------+-----------------+
|                 |                 |
Database       Cache/Queue     Background Jobs
(PostgreSQL)   (Redis/Bull)     (Carrier polling, alerts)
        |
External Services (Carrier APIs, Email Provider)
```

### Core Components
- **Frontend**: Next.js web app (MVP), React Native app (Phase 2)
- **Backend**: Node.js REST API with authentication and rate limiting
- **Data Layer**: PostgreSQL for relational data, Redis for caching and jobs
- **Integrations**: Carrier APIs, email provider, optional webhooks

---

## Data Flows

### Package Tracking Flow
1. User submits tracking number.
2. API validates and detects carrier.
3. Package record stored in database.
4. Background job fetches carrier status.
5. Status updates and history are persisted.
6. User views updated timeline.

### Status Update Flow (Background Jobs)
1. Scheduler runs every 2-4 hours.
2. Active packages are pulled from database.
3. Carrier APIs are queried with caching and rate limiting.
4. Status changes trigger notification jobs.
5. Emails are sent based on user preferences.

---

## Architecture References

Detailed technical specifications are broken out into focused documents:

- [Frontend Architecture](technical/frontend-architecture.md)
- [Backend Architecture](technical/backend-architecture.md)
- [API Design](technical/api-design.md)
- [Database Schema](technical/database-schema.md)
- [Security](technical/security.md)
- [Mobile Architecture](technical/mobile-architecture.md)
- [Third-Party Integrations](technical/third-party-integrations.md)
- [Infrastructure Architecture](technical/infrastructure-architecture.md)
- [Performance & Scalability](technical/performance-scalability.md)
- [Observability](technical/observability.md)

---

## Key Architectural Decisions

- **Polling Frequency**: Every 2-4 hours to respect carrier rate limits.
- **Auth Strategy**: JWT access + refresh tokens for stateless sessions.
- **Data Storage**: PostgreSQL with status history and notification preferences.
- **Queueing**: Redis-backed jobs for carrier polling and alerts.
- **MVP Mobile Strategy**: Responsive web app first, native app in Phase 2.

---

## Non-Functional Requirements (Summary)

- **Performance**: < 2s mobile page load, < 500ms API response (p95)
- **Reliability**: 99.5% uptime target
- **Security**: TLS 1.2+, rate limiting, OWASP-aligned input validation
- **Accessibility**: WCAG 2.1 AA compliance for UI

---

**Document Version**: 1.1  
**Last Updated**: 2026-01-25  
**Status**: Planning / Proposal
