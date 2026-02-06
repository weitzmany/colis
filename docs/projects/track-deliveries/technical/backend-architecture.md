# Technical: Backend Architecture

## Overview
The backend is a Node.js REST API that manages authentication, packages, status history, and notifications. It also runs background jobs for carrier polling.

## Stack
- **Runtime**: Node.js 20
- **Framework**: Express 4 or NestJS 10
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Queue**: BullMQ with Redis
- **Testing**: Jest + Supertest

## Directory Structure (Proposed)
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── packages/
│   │   ├── carriers/
│   │   └── notifications/
│   ├── jobs/
│   ├── middleware/
│   ├── utils/
│   └── prisma/
└── tests/
```

## Modules
- **Auth**: registration, login, refresh, reset
- **Packages**: create, update, list, refresh
- **Carriers**: API clients, normalization
- **Notifications**: email templates + send

## Background Jobs
- **Carrier Polling**: every 2-4 hours
- **Email Notifications**: status-change triggered
- **Cleanup**: archive and retention tasks

## Error Handling
- Central error middleware
- Structured error responses
- Retry logic for carrier API calls

## Related Docs
- [API Design](api-design.md)
- [Carrier Integrations](../features/carrier-integrations.md)
