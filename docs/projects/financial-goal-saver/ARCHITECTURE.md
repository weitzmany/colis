# Financial Goal Saver - Technical Architecture

## System Overview

Financial Goal Saver is a full-stack web and mobile application built on modern technologies that prioritize security, scalability, and user experience. The architecture follows a three-tier design: frontend (Next.js), backend (NestJS), and database (PostgreSQL), with external integrations for bank connectivity (Plaid API).

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Web App (Next.js + React)          Mobile App (React Native)  │
│  - Next.js 15 with TypeScript       - iOS & Android (Phase 2)  │
│  - Tailwind CSS, shadcn/ui          - Expo Framework            │
│  - SWR for data fetching            - Offline-first with sync   │
│  - Client-side state (Zustand)      - Push notifications (FCM)  │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS / REST API
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                   Backend API (NestJS)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Auth Module    │  Goals Module  │  Savings Module      │  │
│  │  - JWT tokens   │  - CRUD        │  - Automation engine │  │
│  │  - OAuth flow   │  - Validation  │  - Transfer logic    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Transactions   │  Insights      │  Notifications       │  │
│  │  - Plaid sync   │  - Analytics   │  - Email/Push        │  │
│  │  - Categorize   │  - Spending    │  - Scheduled jobs    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                   PostgreSQL 16 Database                        │
│  Tables: users, goals, transactions, plaid_items,              │
│          savings_rules, notifications, audit_logs              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                        │
├─────────────────────────────────────────────────────────────────┤
│  Plaid API        │  SendGrid/SES    │  Sentry/Winston        │
│  - Link SDK       │  - Email alerts  │  - Error tracking      │
│  - Transactions   │  - Notifications │  - Logging             │
│  - Auth API       │                  │                        │
│  - ACH transfers  │                  │                        │
└─────────────────────────────────────────────────────────────────┘
```

### System Components

1. **Frontend (Web App)**
   - Next.js 15 server-side rendering for SEO and performance
   - React components with TypeScript for type safety
   - Tailwind CSS for responsive design
   - shadcn/ui for accessible UI components

2. **Frontend (Mobile App - Phase 2)**
   - React Native with Expo for cross-platform (iOS/Android)
   - Offline-first architecture with local SQLite cache
   - Push notifications via Firebase Cloud Messaging

3. **Backend API**
   - NestJS framework with modular architecture
   - RESTful API with JWT authentication
   - Plaid integration for bank connectivity
   - Automated savings engine (cron jobs)

4. **Database**
   - PostgreSQL 16 for relational data
   - Prisma ORM for type-safe database operations
   - Automated backups and point-in-time recovery

5. **External Services**
   - Plaid API for bank account linking and transaction data
   - SendGrid/AWS SES for transactional emails
   - Sentry for error tracking and monitoring

---

## Frontend Architecture

### Web Application (Next.js)

**Framework**: Next.js 15 with React 18, TypeScript 5.3

**Key Technologies**:
- **Styling**: Tailwind CSS for utility-first responsive design
- **UI Components**: shadcn/ui for accessible, customizable components
- **State Management**: Zustand for global state (user, goals, settings)
- **Data Fetching**: SWR for automatic caching, revalidation, and optimistic updates
- **Forms**: React Hook Form for performant form validation
- **Charts**: Recharts for spending insights and goal progress visualizations

**Directory Structure**:
```
src/
├── app/                      # Next.js 15 App Router
│   ├── (auth)/               # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── insights/
│   │   └── settings/
│   ├── api/                  # Next.js API routes (BFF pattern)
│   │   ├── auth/
│   │   └── proxy/            # Proxy to NestJS backend
│   ├── layout.tsx
│   └── page.tsx
├── components/               # Reusable React components
│   ├── ui/                   # shadcn/ui base components
│   ├── goals/                # Goal-related components
│   ├── charts/               # Chart components
│   └── layouts/              # Layout components
├── lib/                      # Utility libraries
│   ├── api.ts                # API client (fetch wrapper)
│   ├── auth.ts               # Auth utilities
│   └── utils.ts              # Helper functions
├── hooks/                    # Custom React hooks
│   ├── useGoals.ts
│   ├── useTransactions.ts
│   └── useInsights.ts
├── store/                    # Zustand stores
│   ├── authStore.ts
│   ├── goalsStore.ts
│   └── settingsStore.ts
└── types/                    # TypeScript type definitions
    ├── api.ts
    ├── goal.ts
    └── transaction.ts
```

**Key Features**:

1. **Server-Side Rendering (SSR)**
   - Dashboard pages use SSR for faster initial load
   - Sensitive data rendered server-side (no client-side exposure)

2. **Client-Side Navigation**
   - Next.js App Router with instant page transitions
   - Prefetching for anticipated user actions

3. **Responsive Design**
   - Mobile-first Tailwind CSS approach
   - Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

4. **Optimistic UI Updates**
   - Immediate feedback on user actions (goal creation, automation settings)
   - SWR revalidation ensures data consistency

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation support
   - Screen reader-friendly components (aria labels)

### Mobile Application (React Native - Phase 2)

**Framework**: React Native with Expo SDK

**Key Technologies**:
- **UI Components**: React Native Paper for Material Design
- **Navigation**: React Navigation for stack and tab navigation
- **State Management**: Redux Toolkit (for mobile-specific needs)
- **Offline Storage**: SQLite for offline-first architecture
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Biometric Auth**: Expo LocalAuthentication (FaceID/TouchID)

**Features**:
- Progress dashboard (quick goal checks)
- Milestone notifications (push alerts)
- Spending insights on-the-go
- Offline access to recent data
- Biometric authentication for security

---

## Backend Architecture

### API Server (NestJS)

**Framework**: NestJS with Express.js, TypeScript 5.3

**Architecture Pattern**: Modular monolith (modules for each domain)

**Key Modules**:

1. **Auth Module**
   - User registration and login (JWT tokens)
   - OAuth flow for social login (Google, Facebook - Phase 2)
   - Password reset and email verification
   - Session management (refresh tokens)

2. **Goals Module**
   - CRUD operations for financial goals
   - Goal validation (target amount, deadline)
   - Goal prioritization logic
   - Goal progress calculations

3. **Savings Module**
   - Automated savings engine (cron jobs)
   - Transfer scheduling and execution
   - Safety buffer calculations
   - Savings rule management (user preferences)

4. **Transactions Module**
   - Plaid transaction syncing (webhooks and polling)
   - Transaction categorization (ML-based in Phase 3)
   - Spending analysis and aggregation
   - Transaction search and filtering

5. **Insights Module**
   - Monthly spending summaries
   - Category-based analytics
   - Recurring subscription detection
   - Savings opportunities identification

6. **Notifications Module**
   - Email notifications (SendGrid/SES)
   - Push notifications (FCM - Phase 2)
   - Scheduled notifications (cron jobs)
   - Notification preferences management

7. **Plaid Module**
   - Plaid Link SDK integration
   - Access token management
   - Webhook handling (transactions, errors)
   - Connection status monitoring

**Directory Structure**:
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/                 # Data transfer objects
│   │   └── guards/              # Auth guards
│   ├── goals/
│   │   ├── goals.controller.ts
│   │   ├── goals.service.ts
│   │   ├── goals.module.ts
│   │   └── dto/
│   ├── savings/
│   │   ├── savings.controller.ts
│   │   ├── savings.service.ts
│   │   ├── savings.module.ts
│   │   ├── engines/             # Savings algorithms
│   │   │   ├── calculator.ts
│   │   │   └── scheduler.ts
│   │   └── jobs/                # Cron jobs
│   │       └── transfer.job.ts
│   ├── transactions/
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── transactions.module.ts
│   │   └── plaid/               # Plaid integration
│   │       ├── plaid.service.ts
│   │       └── plaid.webhooks.ts
│   ├── insights/
│   │   ├── insights.controller.ts
│   │   ├── insights.service.ts
│   │   └── insights.module.ts
│   └── notifications/
│       ├── notifications.controller.ts
│       ├── notifications.service.ts
│       └── notifications.module.ts
├── common/
│   ├── decorators/              # Custom decorators
│   ├── filters/                 # Exception filters
│   ├── guards/                  # Global guards
│   ├── interceptors/            # Global interceptors
│   └── pipes/                   # Validation pipes
├── config/
│   ├── database.config.ts
│   ├── plaid.config.ts
│   └── email.config.ts
├── prisma/
│   ├── schema.prisma            # Prisma schema
│   └── migrations/              # Database migrations
├── app.module.ts
└── main.ts
```

**Key Features**:

1. **JWT Authentication**
   - Access tokens (15 min expiry) for API requests
   - Refresh tokens (7 days) for token renewal
   - Secure HttpOnly cookies for web app

2. **Modular Architecture**
   - Each module is self-contained (controllers, services, DTOs)
   - Dependency injection via NestJS
   - Easy to test and scale

3. **Automated Savings Engine**
   - Cron job runs daily at 6 AM (configurable)
   - Analyzes last 3 months of spending patterns
   - Calculates safe transfer amount (income - expenses - buffer)
   - Distributes savings across goals by priority
   - Schedules ACH transfers via Plaid

4. **Plaid Webhook Handling**
   - Real-time transaction updates
   - Error notifications (connection failures)
   - Automatic retry for failed syncs

5. **Error Handling**
   - Global exception filter for consistent error responses
   - Sentry integration for error tracking
   - Winston logging for audit trails

---

## Database Architecture

### PostgreSQL Schema

**Database**: PostgreSQL 16  
**ORM**: Prisma (type-safe database client)

**Core Tables**:

1. **users**
   - `id` (UUID, primary key)
   - `email` (unique, not null)
   - `password_hash` (bcrypt, not null)
   - `first_name`, `last_name`
   - `created_at`, `updated_at`
   - `is_active` (boolean, default true)
   - `email_verified` (boolean, default false)

2. **plaid_items**
   - `id` (UUID, primary key)
   - `user_id` (foreign key → users.id)
   - `plaid_item_id` (unique, not null)
   - `plaid_access_token` (encrypted, not null)
   - `institution_name`
   - `status` (enum: connected, error, disconnected)
   - `created_at`, `updated_at`
   - `last_synced_at`

3. **accounts**
   - `id` (UUID, primary key)
   - `plaid_item_id` (foreign key → plaid_items.id)
   - `plaid_account_id` (unique, not null)
   - `account_name`
   - `account_type` (enum: checking, savings, credit)
   - `current_balance` (decimal)
   - `available_balance` (decimal)
   - `currency` (default USD)
   - `created_at`, `updated_at`

4. **goals**
   - `id` (UUID, primary key)
   - `user_id` (foreign key → users.id)
   - `name` (not null)
   - `category` (enum: vacation, emergency, home, car, education, other)
   - `target_amount` (decimal, not null)
   - `current_amount` (decimal, default 0)
   - `deadline` (date)
   - `priority` (enum: high, medium, low)
   - `image_url` (optional)
   - `is_active` (boolean, default true)
   - `created_at`, `updated_at`

5. **transactions**
   - `id` (UUID, primary key)
   - `plaid_item_id` (foreign key → plaid_items.id)
   - `account_id` (foreign key → accounts.id)
   - `plaid_transaction_id` (unique, not null)
   - `date` (date, indexed)
   - `amount` (decimal)
   - `merchant_name`
   - `category` (array of strings, e.g., ["Food and Drink", "Restaurants"])
   - `pending` (boolean)
   - `created_at`, `updated_at`

6. **savings_rules**
   - `id` (UUID, primary key)
   - `user_id` (foreign key → users.id)
   - `goal_id` (foreign key → goals.id)
   - `is_automated` (boolean, default false)
   - `frequency` (enum: weekly, biweekly, monthly)
   - `safety_buffer` (decimal, default 500.00)
   - `min_transfer_amount` (decimal, default 25.00)
   - `created_at`, `updated_at`

7. **transfers**
   - `id` (UUID, primary key)
   - `user_id` (foreign key → users.id)
   - `goal_id` (foreign key → goals.id)
   - `amount` (decimal, not null)
   - `status` (enum: scheduled, completed, failed, cancelled)
   - `scheduled_date` (date)
   - `completed_date` (date, nullable)
   - `error_message` (text, nullable)
   - `created_at`, `updated_at`

8. **notifications**
   - `id` (UUID, primary key)
   - `user_id` (foreign key → users.id)
   - `type` (enum: milestone, transfer, insight, reminder)
   - `title`, `message`
   - `is_read` (boolean, default false)
   - `created_at`, `read_at`

### Database Indexes

**Performance Optimization**:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Goal queries
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_is_active ON goals(is_active);

-- Transaction queries (most frequent)
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_user_date ON transactions(plaid_item_id, date DESC);

-- Transfer queries
CREATE INDEX idx_transfers_user_id ON transfers(user_id);
CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_transfers_scheduled_date ON transfers(scheduled_date);

-- Notifications queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### Data Relationships

```
users (1) ──────────< (many) plaid_items
plaid_items (1) ─────< (many) accounts
accounts (1) ────────< (many) transactions

users (1) ───────────< (many) goals
users (1) ───────────< (many) savings_rules
goals (1) ───────────< (many) savings_rules

users (1) ───────────< (many) transfers
goals (1) ───────────< (many) transfers

users (1) ───────────< (many) notifications
```

### Migration Strategy

**Prisma Migrations**:
- All schema changes tracked via Prisma migrations
- Migration files stored in `prisma/migrations/`
- Development: `prisma migrate dev`
- Production: `prisma migrate deploy` (automated via CI/CD)
- Rollback: Revert migration and re-deploy previous version

**Seed Data** (Development):
- Sample users, goals, transactions for testing
- Run via `prisma db seed`

---

## Security Architecture

### Authentication Flow

1. **User Registration**:
   - User submits email + password
   - Backend hashes password with bcrypt (10 rounds)
   - Creates user record with `email_verified = false`
   - Sends verification email with JWT token
   - User clicks link, backend verifies token and sets `email_verified = true`

2. **User Login**:
   - User submits email + password
   - Backend verifies password hash
   - Generates JWT access token (15 min expiry)
   - Generates refresh token (7 days expiry)
   - Returns tokens (access token in response, refresh token in HttpOnly cookie)

3. **Token Refresh**:
   - Access token expires after 15 minutes
   - Frontend automatically sends refresh token to `/auth/refresh`
   - Backend validates refresh token
   - Issues new access token + refresh token pair

4. **Logout**:
   - Frontend sends logout request with refresh token
   - Backend invalidates refresh token (blacklist in Redis - Phase 2)
   - Clears HttpOnly cookie

### Authorization Model

**Role-Based Access Control (RBAC)**:
- **User Role**: Default role, access to own goals and transactions
- **Admin Role** (Phase 2): Access to user management, analytics dashboard

**Resource-Level Authorization**:
- Users can only access their own data
- JWT contains `userId` claim
- Guards verify `userId` matches resource owner

### Data Encryption

1. **Encryption at Rest**:
   - PostgreSQL Transparent Data Encryption (TDE)
   - Plaid access tokens encrypted with AES-256
   - Passwords hashed with bcrypt (never stored in plaintext)

2. **Encryption in Transit**:
   - TLS 1.3 for all client-server communication
   - HTTPS enforced (HSTS headers)
   - Secure WebSocket connections (WSS) for real-time features (Phase 2)

### Plaid Security

**Secure Token Storage**:
- Plaid access tokens stored encrypted in database
- Decrypted only in memory during API calls
- Never exposed to frontend

**Webhook Verification**:
- Plaid webhook requests verified with HMAC signature
- Rejects requests with invalid signatures

### OWASP Top 10 Mitigations

1. **Injection**: Prisma ORM prevents SQL injection (parameterized queries)
2. **Broken Authentication**: JWT with refresh tokens, bcrypt password hashing
3. **Sensitive Data Exposure**: TLS encryption, encrypted Plaid tokens
4. **XML External Entities (XXE)**: Not applicable (no XML parsing)
5. **Broken Access Control**: Guards verify user owns resources
6. **Security Misconfiguration**: Secure headers (Helmet.js), no default credentials
7. **Cross-Site Scripting (XSS)**: React auto-escapes content, CSP headers
8. **Insecure Deserialization**: No untrusted serialized objects
9. **Components with Known Vulnerabilities**: Automated dependency scanning (Dependabot)
10. **Insufficient Logging**: Winston logging, Sentry error tracking

---

## Integration Architecture

### Plaid API Integration

**Plaid SDK**: `plaid-node` (official Node.js library)

**Integration Flow**:

1. **Link Account** (OAuth Flow):
   ```
   User clicks "Connect Bank"
     ↓
   Frontend opens Plaid Link (modal)
     ↓
   User selects bank, enters credentials
     ↓
   Plaid verifies credentials, returns public_token
     ↓
   Frontend sends public_token to backend /plaid/exchange
     ↓
   Backend exchanges public_token for access_token via Plaid API
     ↓
   Backend stores encrypted access_token in database
     ↓
   Backend initiates first transaction sync
   ```

2. **Transaction Sync** (Webhook + Polling):
   - **Webhooks**: Plaid sends real-time updates (new transactions, errors)
   - **Polling**: Backup sync every 4 hours via cron job
   - **Process**:
     ```
     Receive webhook or cron trigger
       ↓
     Call Plaid Transactions API with access_token
       ↓
     Fetch new/modified transactions since last sync
       ↓
     Upsert transactions in database (deduplicate by plaid_transaction_id)
       ↓
     Trigger spending insights recalculation
     ```

3. **ACH Transfer Initiation** (Phase 2):
   - Use Plaid Transfer API to schedule ACH transfers
   - Backend creates transfer via Plaid API
   - Plaid handles ACH processing (2-3 business days)
   - Webhook notifies backend of transfer status (pending, completed, failed)

**Error Handling**:
- **Connection Errors**: Notify user via email, prompt to reconnect
- **Rate Limits**: Exponential backoff with retry queue
- **Sync Failures**: Log error, retry after 1 hour, max 5 retries

### Email Integration (SendGrid/AWS SES)

**Use Cases**:
- Welcome emails (user registration)
- Email verification links
- Password reset emails
- Goal milestone notifications
- Weekly progress summaries
- Transfer confirmations

**Implementation**:
- **SendGrid SDK**: For transactional emails
- **Email Templates**: HTML templates with Handlebars
- **Email Queue**: Bull queue for async email sending (prevents API blocking)

### Push Notifications (Phase 2 - Mobile)

**Firebase Cloud Messaging (FCM)**:
- Register device token when user logs in on mobile
- Backend sends push notifications via FCM Admin SDK
- Use cases: Goal milestones, transfer confirmations, spending alerts

---

## Infrastructure

### Hosting (MVP - DigitalOcean)

**App Platform**:
- **Frontend**: Next.js app deployed to DigitalOcean App Platform
- **Backend**: NestJS API deployed to DigitalOcean App Platform
- **Database**: Managed PostgreSQL 16 (DigitalOcean)
- **SSL**: Automatic HTTPS via Let's Encrypt

**Advantages**:
- Simple deployment (Git push to deploy)
- Affordable for MVP ($10-30/month total)
- Managed database with automated backups
- Auto-scaling (vertical scaling)

### Hosting (Post-MVP - AWS)

**AWS Services**:
- **Frontend**: CloudFront CDN + S3 (Next.js static export)
- **Backend**: ECS Fargate (containerized NestJS API)
- **Database**: RDS PostgreSQL with Multi-AZ
- **Cache**: ElastiCache Redis (session storage, queue)
- **Email**: SES for transactional emails
- **Storage**: S3 for goal images and documents

**Advantages**:
- Better scalability (horizontal scaling)
- Global CDN for faster load times
- Advanced monitoring (CloudWatch)
- Cost optimization for higher traffic

### CI/CD Pipeline (GitHub Actions)

**Workflow**:

```yaml
# .github/workflows/deploy.yml

1. Code Push to GitHub (main branch)
   ↓
2. GitHub Actions Triggered
   ↓
3. Run Tests (Jest unit tests, Supertest E2E tests)
   ↓
4. Build Docker Images (frontend, backend)
   ↓
5. Push to Container Registry (DigitalOcean Registry)
   ↓
6. Deploy to App Platform
   ↓
7. Run Database Migrations (prisma migrate deploy)
   ↓
8. Health Check (GET /health endpoint)
   ↓
9. Rollback if Health Check Fails
```

**Environments**:
- **Development**: Local Docker Compose
- **Staging**: DigitalOcean (staging.financialgoalsaver.com)
- **Production**: DigitalOcean (financialgoalsaver.com)

### Monitoring & Observability

**Error Tracking**:
- **Sentry**: Real-time error tracking and crash reporting
- **Integration**: Frontend (Next.js), Backend (NestJS), Mobile (React Native - Phase 2)
- **Alerts**: Slack notifications for critical errors

**Logging**:
- **Winston**: Structured logging (JSON format)
- **Log Levels**: error, warn, info, debug
- **Storage**: DigitalOcean Logs (MVP), CloudWatch (post-MVP)

**Uptime Monitoring**:
- **UptimeRobot**: Free uptime monitoring (5-minute checks)
- **Endpoints**: /health (backend), homepage (frontend)
- **Alerts**: Email/SMS on downtime

**Performance Monitoring** (Phase 2):
- **New Relic** or **Datadog**: APM for backend performance
- **Google Analytics**: User behavior tracking (privacy-compliant)

### Backup & Disaster Recovery

**Database Backups**:
- **Automated Daily Backups**: DigitalOcean managed backups (7-day retention)
- **Manual Backups**: Before major migrations
- **Point-in-Time Recovery**: Supported by DigitalOcean PostgreSQL

**Recovery Time Objective (RTO)**: 4 hours  
**Recovery Point Objective (RPO)**: 24 hours (daily backups)

**Disaster Recovery Plan**:
1. Detect outage via monitoring
2. Investigate root cause
3. Restore from latest backup (if database failure)
4. Redeploy application (if application failure)
5. Run health checks
6. Notify users via status page

---

## Scalability Strategy

### MVP Scalability (0-10K Users)

**Vertical Scaling**:
- DigitalOcean App Platform auto-scales vertically
- Database: Start with smallest instance, upgrade as needed
- Expected cost: $30-50/month for 10K users

**Bottlenecks**:
- Database queries (mitigated by indexes)
- Plaid API rate limits (500 requests/min for development tier)

### Post-MVP Scalability (10K-100K Users)

**Horizontal Scaling**:
- **Backend**: Multiple NestJS instances behind load balancer (AWS ECS + ALB)
- **Database**: Read replicas for read-heavy workloads (PostgreSQL streaming replication)
- **Cache**: Redis for session storage and frequently accessed data (goals, insights)

**Optimizations**:
- **CDN**: CloudFront for static assets (Next.js pages, images)
- **Database Connection Pooling**: pgBouncer for efficient connection management
- **Background Jobs**: Bull queue with Redis for async tasks (email, notifications)
- **API Rate Limiting**: Prevent abuse (100 requests/min per user)

**Expected Cost**: $500-1000/month for 100K users

### Long-Term Scalability (100K+ Users)

**Microservices** (if needed):
- Break monolith into services: Auth, Goals, Transactions, Savings, Insights
- API Gateway (Kong or AWS API Gateway) for routing
- Event-driven architecture (Kafka or AWS EventBridge) for inter-service communication

**Database Sharding** (if needed):
- Shard by `user_id` for horizontal database scaling
- Requires application-level sharding logic

---

## Performance Targets

### Response Time Targets

- **API Response Time**: <200ms (p95)
- **Page Load Time**: <2 seconds (desktop), <3 seconds (mobile)
- **Transaction Sync**: <30 seconds (from webhook to UI update)
- **Automated Savings Calculation**: <5 seconds per user

### Optimization Strategies

1. **Database Optimization**:
   - Indexes on frequently queried columns
   - Connection pooling (10-20 connections)
   - Query result caching (Redis - Phase 2)

2. **Frontend Optimization**:
   - Next.js code splitting (automatic)
   - Image optimization (next/image)
   - Lazy loading for charts and visualizations
   - SWR caching for API responses

3. **API Optimization**:
   - Response compression (gzip)
   - Pagination for large datasets (transactions, notifications)
   - Batch API requests (fetch multiple goals in one request)

---

## Technology Stack Summary

| Layer              | Technology                         | Version/Details                  |
|--------------------|-----------------------------------|----------------------------------|
| **Frontend (Web)** | Next.js                            | 15 (React 18, TypeScript 5.3)    |
|                    | Tailwind CSS                       | 3.x                              |
|                    | shadcn/ui                          | Latest                           |
|                    | SWR                                | 2.x (data fetching)              |
|                    | Zustand                            | 4.x (state management)           |
| **Mobile**         | React Native                       | 0.73+ (Expo SDK 50+)             |
|                    | React Navigation                   | 6.x                              |
|                    | React Native Paper                 | 5.x (UI components)              |
| **Backend**        | Node.js                            | 20 LTS                           |
|                    | NestJS                             | 10.x (TypeScript 5.3)            |
|                    | Prisma ORM                         | 5.x                              |
|                    | Express.js                         | 4.x                              |
| **Database**       | PostgreSQL                         | 16                               |
|                    | Redis                              | 7.x (Phase 2 - cache/queue)      |
| **Integrations**   | Plaid API                          | plaid-node SDK 18.x              |
|                    | SendGrid                           | @sendgrid/mail 7.x               |
|                    | Firebase (FCM)                     | firebase-admin SDK 12.x          |
| **Infrastructure** | Docker                             | Latest                           |
|                    | DigitalOcean                       | App Platform, Managed PostgreSQL |
|                    | GitHub Actions                     | CI/CD                            |
| **Monitoring**     | Sentry                             | Error tracking                   |
|                    | Winston                            | Logging                          |
|                    | UptimeRobot                        | Uptime monitoring                |

---

**Last Updated**: 2026-01-21  
**Status**: Planning - Ready for Expert Review
