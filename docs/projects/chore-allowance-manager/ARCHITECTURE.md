# Chore & Allowance Manager - Architecture

**Version**: 1.0  
**Last Updated**: 2026-01-20  
**Status**: Planning

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js Web App (Desktop/Mobile)  │  React Native Mobile   │
│  - Parent Dashboard                │  - Quick Check-off      │
│  - Family Management               │  - Push Notifications   │
│  - Analytics & Reports             │  - Offline Access       │
└──────────────┬────────────────────────────────┬─────────────┘
               │                                 │
               │          HTTPS/REST API         │
               │                                 │
┌──────────────┴────────────────────────────────┴─────────────┐
│                      API GATEWAY LAYER                       │
├──────────────────────────────────────────────────────────────┤
│  - Authentication & Authorization                            │
│  - Rate Limiting                                             │
│  - Request Validation                                        │
│  - API Versioning                                            │
└──────────────┬───────────────────────────────────────────────┘
               │
               │
┌──────────────┴───────────────────────────────────────────────┐
│                    APPLICATION LAYER                          │
├──────────────────────────────────────────────────────────────┤
│  NestJS Backend Services:                                     │
│  - Chore Service (CRUD, scheduling)                          │
│  - User/Family Service (family management)                   │
│  - Reward Service (points, allowances)                       │
│  - Notification Service (reminders, alerts)                  │
│  - Gamification Service (streaks, badges)                    │
└──────────────┬───────────────────────────────────────────────┘
               │
               │
┌──────────────┴───────────────────────────────────────────────┐
│                      DATA LAYER                              │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                          │
│  - Users, Families, Chores, Rewards                          │
│  - Completion History, Transactions                          │
│  - Notifications, Gamification Data                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
├──────────────────────────────────────────────────────────────┤
│  - Firebase Cloud Messaging (Push Notifications)            │
│  - AWS S3 (File Storage - optional)                         │
│  - SendGrid/SES (Email Notifications)                       │
└──────────────────────────────────────────────────────────────┘
```

### System Components

1. **Client Layer**:
   - Next.js web application (responsive, mobile-first)
   - React Native mobile apps (iOS and Android)

2. **API Gateway Layer**:
   - Authentication and authorization
   - Rate limiting and request validation
   - API versioning

3. **Application Layer**:
   - NestJS backend services
   - Business logic and data processing
   - Service orchestration

4. **Data Layer**:
   - PostgreSQL database
   - Data persistence and querying

5. **External Services**:
   - Push notification service (Firebase)
   - Email service (SendGrid/SES)
   - File storage (AWS S3 - optional)

### Data Flow

1. **User Action** → Client (Web/Mobile)
2. **API Request** → API Gateway (Auth, Validation)
3. **Service Processing** → Application Layer (Business Logic)
4. **Data Operation** → Data Layer (Database)
5. **Response** → Client (UI Update)
6. **Notifications** → External Services (Push/Email)

---

## Frontend Architecture

### Next.js Web Application

**Framework**: Next.js 14+ with App Router  
**Language**: TypeScript  
**Styling**: Tailwind CSS  
**State Management**: React Context + Server Components

#### Directory Structure

```
app/
├── (auth)/               # Authentication routes
│   ├── login/
│   ├── signup/
│   └── layout.tsx
├── (dashboard)/          # Dashboard routes
│   ├── chores/           # Chore management
│   ├── family/           # Family management
│   ├── rewards/          # Rewards & allowance
│   ├── analytics/        # Analytics & reports
│   └── layout.tsx
├── api/                  # API routes (if needed)
├── layout.tsx
└── page.tsx
components/
├── ui/                   # Reusable UI components
├── forms/                # Form components
├── chores/               # Chore-specific components
├── rewards/              # Reward-specific components
└── dashboard/            # Dashboard components
lib/
├── api/                  # API client functions
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── types/                # TypeScript types
```

#### Component Structure

- **Server Components**: Used for initial data fetching and rendering
- **Client Components**: Used for interactivity and user input
- **Progressive Enhancement**: Core features work without JavaScript

#### Routing Strategy

- **App Router**: Next.js 14+ App Router for file-based routing
- **Dynamic Routes**: `/chores/[id]`, `/family/[memberId]`
- **Parallel Routes**: Dashboard layout with parallel routes for chores, rewards, analytics
- **Route Groups**: `(auth)`, `(dashboard)` for layout organization

### React Native Mobile App

**Framework**: React Native (Expo)  
**Language**: TypeScript  
**Navigation**: React Navigation  
**State Management**: Redux Toolkit + RTK Query

#### Directory Structure

```
src/
├── navigation/           # Navigation configuration
├── screens/              # Screen components
│   ├── ChoresScreen/
│   ├── DashboardScreen/
│   ├── RewardsScreen/
│   └── ProfileScreen/
├── components/           # Reusable components
├── services/             # API services
├── store/                # Redux store
│   ├── slices/
│   └── store.ts
├── hooks/                # Custom hooks
├── utils/                # Utility functions
└── types/                # TypeScript types
```

#### Key Mobile Features

1. **Offline-First Architecture**:
   - Local storage with AsyncStorage
   - Offline chore check-off
   - Background sync when online

2. **Push Notifications**:
   - Firebase Cloud Messaging integration
   - Notification scheduling
   - Deep linking from notifications

3. **Quick Check-off**:
   - Swipe gestures for quick completion
   - Haptic feedback
   - Optimistic UI updates

---

## Backend Architecture

### NestJS Application

**Framework**: NestJS  
**Language**: TypeScript  
**Database**: PostgreSQL with TypeORM  
**API Style**: RESTful

#### Directory Structure

```
src/
├── app.module.ts         # Root module
├── main.ts               # Application entry point
├── modules/              # Feature modules
│   ├── auth/             # Authentication module
│   ├── users/            # User management module
│   ├── families/         # Family management module
│   ├── chores/           # Chore management module
│   ├── rewards/          # Rewards module
│   ├── notifications/    # Notification module
│   └── gamification/     # Gamification module
├── common/               # Shared code
│   ├── guards/           # Auth guards
│   ├── decorators/       # Custom decorators
│   ├── filters/          # Exception filters
│   ├── interceptors/     # Interceptors
│   └── pipes/            # Validation pipes
├── config/               # Configuration
└── database/             # Database migrations
```

#### Service Layer

Each module follows this structure:

```
module/
├── module.module.ts      # Module definition
├── controller.ts         # REST endpoints
├── service.ts            # Business logic
├── entity.ts             # TypeORM entity
├── dto/                  # Data transfer objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── query-*.dto.ts
└── tests/                # Unit tests
```

### API Design

**Base URL**: `/api/v1`  
**Authentication**: JWT Bearer tokens  
**Content Type**: `application/json`

#### Key Endpoints

**Authentication**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

**Users & Families**:
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `GET /families` - Get user's families
- `POST /families` - Create family
- `GET /families/:id` - Get family details
- `PUT /families/:id` - Update family
- `POST /families/:id/members` - Add family member

**Chores**:
- `GET /chores` - List chores (with filters)
- `POST /chores` - Create chore
- `GET /chores/:id` - Get chore details
- `PUT /chores/:id` - Update chore
- `DELETE /chores/:id` - Delete chore
- `POST /chores/:id/complete` - Mark chore complete
- `POST /chores/:id/uncomplete` - Mark chore incomplete

**Rewards**:
- `GET /rewards` - List rewards
- `POST /rewards` - Create reward
- `GET /rewards/:id` - Get reward details
- `PUT /rewards/:id` - Update reward
- `DELETE /rewards/:id` - Delete reward
- `GET /allowances` - Get allowance history
- `POST /allowances/calculate` - Calculate current allowance

**Notifications**:
- `GET /notifications` - List notifications
- `POST /notifications/register-device` - Register device for push notifications
- `PUT /notifications/preferences` - Update notification preferences

**Gamification**:
- `GET /gamification/stats` - Get user stats (streaks, badges)
- `GET /gamification/ranking` - Get family ranking
- `POST /gamification/badges/:id/claim` - Claim earned badge

→ [Detailed API Documentation](technical/api-design.md)

### Authentication & Authorization

**Authentication Strategy**: JWT (JSON Web Tokens)

**Token Flow**:
1. User logs in with credentials
2. Server validates credentials
3. Server generates access token (15 min expiry) and refresh token (7 day expiry)
4. Client stores tokens securely
5. Client includes access token in Authorization header for API requests
6. Client uses refresh token to get new access token when expired

**Authorization Model**: Role-Based Access Control (RBAC)

**Roles**:
- `parent` - Full access to family data, can manage chores, rewards, family members
- `kid` - View own chores, complete chores, view own rewards and stats
- `admin` - Platform admin (for support and system management)

**Access Control**:
- Parents can manage all family data
- Kids can only view and complete their own chores
- Kids cannot delete chores or modify rewards
- Parents can view all family members' data

---

## Infrastructure

### Hosting & Deployment

**Cloud Provider**: AWS (or similar)  
**Containerization**: Docker  
**Orchestration**: Docker Compose (dev), AWS ECS/Fargate (production)

#### Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│               AWS Cloud Infrastructure                │
├──────────────────────────────────────────────────────┤
│  CloudFront (CDN) → Next.js Static Assets           │
│  ALB (Load Balancer) → ECS (Backend Services)       │
│  RDS PostgreSQL (Database)                           │
│  S3 (File Storage - optional)                        │
│  CloudWatch (Monitoring & Logs)                      │
└──────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

**Tool**: GitHub Actions  
**Workflow**: Push to `main` → Build → Test → Deploy

#### CI/CD Steps

1. **Code Push**: Developer pushes to GitHub
2. **Linting**: ESLint, Prettier checks
3. **Type Checking**: TypeScript compilation
4. **Unit Tests**: Jest tests run
5. **Integration Tests**: API tests run
6. **Build**: Docker images built
7. **Push Images**: Images pushed to ECR (Elastic Container Registry)
8. **Deploy**: Services deployed to ECS/Fargate
9. **Health Check**: Deployment verified
10. **Notifications**: Team notified of deployment status

### Monitoring & Logging

**Monitoring**: AWS CloudWatch  
**Logging**: Structured JSON logs  
**Error Tracking**: Sentry (or similar)  
**Metrics**: Custom CloudWatch metrics

**Key Metrics**:
- API response times
- Error rates
- Database query performance
- Active user sessions
- Chore completion rates

→ [Detailed DevOps Documentation](technical/devops.md)

### Scaling Strategy

**Horizontal Scaling**:
- Backend services scale based on CPU/memory usage
- Load balancer distributes traffic across instances

**Database Scaling**:
- Read replicas for read-heavy operations
- Connection pooling for efficient connections
- Caching layer (Redis) for frequently accessed data

**CDN**: CloudFront for static assets and Next.js pages

---

## Security Architecture

### Authentication Flow

```
1. User Login:
   - User submits credentials
   - Server validates credentials (bcrypt password hash)
   - Server generates access + refresh tokens (JWT)
   - Tokens returned to client

2. Authenticated Request:
   - Client includes access token in Authorization header
   - Server verifies token (signature, expiry)
   - Server extracts user ID and role from token
   - Server authorizes based on role

3. Token Refresh:
   - Client sends refresh token when access token expires
   - Server validates refresh token
   - Server generates new access token
   - New access token returned to client
```

### Authorization Model

**Role-Based Access Control (RBAC)**:

- **Parents**:
  - Create, read, update, delete chores
  - Create, read, update, delete rewards
  - View all family member data
  - Manage family settings

- **Kids**:
  - View assigned chores
  - Complete own chores
  - View own rewards and allowance
  - View own stats and badges

### Data Encryption

**Data at Rest**:
- Database encryption (AWS RDS encryption)
- Encrypted backups

**Data in Transit**:
- HTTPS/TLS for all communications
- Certificate pinning for mobile apps

**Sensitive Data**:
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens signed with strong secret keys
- Refresh tokens stored hashed in database

### Security Best Practices

1. **Input Validation**: All inputs validated with class-validator
2. **SQL Injection Prevention**: TypeORM parameterized queries
3. **XSS Prevention**: React/Next.js automatic escaping
4. **CSRF Protection**: CSRF tokens for state-changing operations
5. **Rate Limiting**: API rate limiting to prevent abuse
6. **Content Security Policy**: CSP headers for web app
7. **HTTPS Only**: All traffic over HTTPS
8. **Secure Headers**: Helmet.js for security headers

→ [Detailed Security Documentation](technical/security.md)

---

## Data Architecture

### Database: PostgreSQL

**Version**: PostgreSQL 15+  
**ORM**: TypeORM  
**Migrations**: TypeORM migrations

### Database Schema (Overview)

**Core Tables**:

- `users` - User accounts
- `families` - Family groups
- `family_members` - Family membership (users in families)
- `chores` - Chore definitions
- `chore_assignments` - Chore assignments to family members
- `chore_completions` - Chore completion history
- `rewards` - Reward definitions
- `reward_redemptions` - Reward redemption history
- `allowances` - Allowance transactions
- `notifications` - Notification queue
- `badges` - Badge definitions
- `user_badges` - Earned badges

→ [Detailed Database Schema](technical/database-schema.md)

### Data Models

**Key Relationships**:

- User → Family Members (many-to-many through family_members)
- Family → Chores (one-to-many)
- Chore → Chore Assignments (one-to-many)
- Chore Assignment → Chore Completions (one-to-many)
- Family Member → Allowances (one-to-many)
- Family Member → Badges (many-to-many through user_badges)

### Data Flow

1. **Chore Creation**:
   - Parent creates chore
   - Chore stored in `chores` table
   - If recurring, schedule created

2. **Chore Assignment**:
   - Parent assigns chore to kid
   - Assignment stored in `chore_assignments`
   - Notification created for kid

3. **Chore Completion**:
   - Kid marks chore complete
   - Completion stored in `chore_completions`
   - Points/allowance calculated and updated
   - Notification sent to parent

4. **Allowance Calculation**:
   - Allowance calculated from completed chores
   - Transaction stored in `allowances`
   - Balance updated for family member

---

## Integration Architecture

### External APIs

1. **Firebase Cloud Messaging (FCM)**:
   - Push notifications to mobile apps
   - Device token registration
   - Message targeting (user, topic)

2. **SendGrid/SES**:
   - Email notifications
   - Password reset emails
   - Weekly summary emails

3. **AWS S3 (Optional)**:
   - User profile images
   - Family photos
   - Chore attachments (optional)

### Webhooks

**Not applicable for MVP** (no external webhooks needed initially)

### Event-Driven Architecture

**Internal Events** (using EventEmitter or message queue):

- `chore.completed` → Update allowance, check badges, send notifications
- `chore.missed` → Send missed chore notification
- `badge.earned` → Send badge earned notification
- `allowance.updated` → Send allowance update notification

---

## Performance Considerations

### Caching Strategy

**Client-Side Caching**:
- React Query (web) for API response caching
- Redux Toolkit (mobile) with persistence

**Server-Side Caching** (future):
- Redis for frequently accessed data
- Cache invalidation on data changes

### Database Optimization

1. **Indexes**:
   - Indexes on foreign keys
   - Indexes on frequently queried fields (status, assignedTo, dueDate)
   - Composite indexes for common queries

2. **Query Optimization**:
   - Eager loading with TypeORM relations
   - Pagination for large result sets
   - Query result caching for expensive queries

3. **Connection Pooling**:
   - Database connection pool (10-20 connections)
   - Reuse connections across requests

### API Performance

- **Response Time Target**: < 200ms for 95% of requests
- **Pagination**: Limit results to 50 items per page
- **Lazy Loading**: Load data progressively
- **Compression**: Gzip compression for API responses

---

## Scalability Plan

### Phase 1: Single Server (MVP)

- All services on single server
- PostgreSQL on same server or managed RDS
- Suitable for 0-1,000 active families

### Phase 2: Horizontal Scaling (Growth)

- Backend services on multiple instances (ECS/Fargate)
- Load balancer distributing traffic
- Managed RDS with read replicas
- Redis caching layer
- Suitable for 1,000-10,000 active families

### Phase 3: Microservices (Scale)

- Services split into microservices (if needed)
- Message queue for inter-service communication
- Separate databases per service (if needed)
- Advanced caching and CDN
- Suitable for 10,000+ active families

---

**End of Architecture Document**

→ [Return to Documentation Index](INDEX.md)  
→ [View PRD Overview](PRD_OVERVIEW.md)  
→ [View Technical Specifications](technical/)
