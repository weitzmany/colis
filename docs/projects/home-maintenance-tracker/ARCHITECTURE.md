# Home Maintenance Tracker - Architecture

**Status**: Planning  
**Last Updated**: 2026-01-20  
**Version**: 2.0

---

## System Overview

Home Maintenance Tracker is a full-stack web and mobile application built on a modern, scalable architecture. The system follows a three-tier architecture pattern with a React-based frontend (web and mobile), Node.js backend API, and PostgreSQL database.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │   Next.js Web    │           │  React Native    │       │
│  │   Application    │           │   Mobile App     │       │
│  │  (TypeScript)    │           │  (iOS/Android)   │       │
│  └──────────────────┘           └──────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             NestJS Backend API (Node.js)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐    │  │
│  │  │   Auth   │  │  Tasks   │  │   Reminders    │    │  │
│  │  │ Service  │  │ Service  │  │    Service     │    │  │
│  │  └──────────┘  └──────────┘  └────────────────┘    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐    │  │
│  │  │ Service  │  │   User   │  │  Notification  │    │  │
│  │  │ History  │  │ Service  │  │    Service     │    │  │
│  │  └──────────┘  └──────────┘  └────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL / Prisma ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             PostgreSQL Database                      │  │
│  │  - Users & Authentication                            │  │
│  │  - Properties                                        │  │
│  │  - Maintenance Tasks & Schedules                     │  │
│  │  - Service History                                   │  │
│  │  - Reminders & Notifications                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐  │
│  │ SendGrid │  │ Firebase │  │   AWS S3   │  │  OAuth  │  │
│  │  (Email) │  │   (FCM)  │  │  (Files)   │  │(Google) │  │
│  └──────────┘  └──────────┘  └────────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### System Components

**Frontend Components:**
- **Web Application** (Next.js): Desktop/mobile web interface, responsive design
- **Mobile Application** (React Native): Native iOS/Android apps with offline support

**Backend Components:**
- **API Gateway**: Request routing, authentication, rate limiting
- **Authentication Service**: User registration, login, JWT token management
- **Task Service**: Maintenance task CRUD, scheduling logic
- **Reminder Service**: Notification generation, delivery scheduling
- **Service History Service**: Service log management, invoice/photo storage
- **User Service**: User profile, property management
- **Notification Service**: Multi-channel notification delivery (email, push, SMS)

**Data Storage:**
- **PostgreSQL**: Primary relational database for all structured data
- **AWS S3** (Post-MVP): Object storage for invoices, photos, documents

**External Services:**
- **SendGrid**: Transactional email delivery
- **Firebase Cloud Messaging**: Push notifications for mobile apps
- **Google OAuth**: Third-party authentication
- **AWS S3**: File storage (post-MVP)

### Data Flow

1. **User Interaction**: User creates maintenance task via web/mobile app
2. **API Request**: Client sends HTTPS request to backend API
3. **Authentication**: JWT token validated, user authorized
4. **Business Logic**: Task service processes request, validates data
5. **Data Persistence**: Prisma ORM writes to PostgreSQL database
6. **Response**: API returns success/error response to client
7. **Background Job**: Reminder service schedules future notifications
8. **Notification Delivery**: At scheduled time, notification sent via SendGrid/FCM

---

## Frontend Architecture

### Web Application (Next.js 14)

**Framework**: Next.js 14 with App Router, TypeScript, Tailwind CSS

**Directory Structure:**
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── history/
│   │   └── calendar/
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   ├── tasks/
│   ├── calendar/
│   └── ui/
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
├── hooks/
│   ├── useTasks.ts
│   ├── useHistory.ts
│   └── useReminders.ts
└── types/
    └── index.ts
```

**Key Technologies:**
- **Next.js 14**: React framework with server-side rendering, App Router
- **TypeScript**: Type safety throughout application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Query**: Data fetching, caching, and synchronization
- **Zustand**: Lightweight state management for client state
- **React Hook Form**: Form validation and management
- **Recharts**: Chart library for cost analytics
- **date-fns**: Date manipulation and formatting
- **Axios**: HTTP client for API requests

**State Management Strategy:**
- **Server State**: React Query for API data, caching, and synchronization
- **Client State**: Zustand for UI state (modals, filters, preferences)
- **Form State**: React Hook Form for form handling

**Routing:**
- Next.js App Router for file-based routing
- Protected routes with middleware authentication
- Dynamic routes for task details, history views

**Performance Optimizations:**
- Server-side rendering for initial page load
- Static generation for marketing pages
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Lazy loading for non-critical components

### Mobile Application (React Native)

**Framework**: React Native with Expo, TypeScript

**Directory Structure:**
```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.tsx
│   │   ├── tasks.tsx
│   │   ├── history.tsx
│   │   └── settings.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── _layout.tsx
├── components/
│   ├── dashboard/
│   ├── tasks/
│   └── ui/
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
├── hooks/
└── types/
```

**Key Technologies:**
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and toolkit
- **TypeScript**: Type safety
- **React Navigation**: Navigation and routing
- **React Query**: Data fetching and caching
- **Expo Notifications**: Push notification handling
- **React Native Paper**: Material Design UI components
- **AsyncStorage**: Local data persistence
- **Expo Camera**: Photo capture for receipts

**Mobile-Specific Features:**
- **Push Notifications**: Real-time reminder notifications
- **Camera Integration**: Capture photos of invoices, before/after work
- **Offline Support**: AsyncStorage for offline task viewing
- **Biometric Authentication**: Face ID / Touch ID support
- **Calendar Integration**: Sync maintenance tasks with device calendar

**Performance Optimizations:**
- FlatList virtualization for long task lists
- Image caching and optimization
- Lazy loading of screens
- Minimal bundle size with tree shaking

---

## Backend Architecture

### API Design (REST)

**Framework**: NestJS (Node.js) with TypeScript

**API Structure:**
```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── strategies/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── tasks/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── history/
│   │   ├── history.controller.ts
│   │   ├── history.service.ts
│   │   └── history.module.ts
│   ├── reminders/
│   │   ├── reminders.controller.ts
│   │   ├── reminders.service.ts
│   │   └── reminders.module.ts
│   ├── notifications/
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notifications.module.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── decorators/
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── test/
```

**API Endpoints:**

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

**Users:**
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile
- `DELETE /users/me` - Delete user account

**Properties:**
- `GET /properties` - Get user's properties
- `POST /properties` - Create new property
- `GET /properties/:id` - Get property details
- `PATCH /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

**Maintenance Tasks:**
- `GET /tasks` - Get all tasks (with filters: status, category, property)
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task details
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/complete` - Mark task as complete
- `GET /tasks/upcoming` - Get upcoming tasks (next 30 days)
- `GET /tasks/overdue` - Get overdue tasks
- `GET /tasks/calendar` - Get calendar view of tasks

**Maintenance Templates:**
- `GET /templates` - Get all maintenance templates
- `GET /templates/:id` - Get template details
- `POST /templates/:id/apply` - Apply template to create task

**Service History:**
- `GET /history` - Get service history (paginated, filterable)
- `POST /history` - Create service log entry
- `GET /history/:id` - Get service log details
- `PATCH /history/:id` - Update service log
- `DELETE /history/:id` - Delete service log
- `GET /history/stats` - Get service history statistics

**Reminders:**
- `GET /reminders` - Get active reminders
- `POST /reminders` - Create manual reminder
- `PATCH /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder
- `POST /reminders/:id/snooze` - Snooze reminder

**Notifications:**
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `DELETE /notifications/:id` - Delete notification

### Database Design

**ORM**: Prisma ORM for type-safe database access

**Database Schema (Prisma):**

```prisma
// User & Authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?   // Nullable for OAuth users
  firstName     String?
  lastName      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  properties    Property[]
  tasks         Task[]
  history       ServiceHistory[]
  reminders     Reminder[]
  notifications Notification[]
  
  // OAuth
  oauthProvider String?
  oauthId       String?
  
  // Subscription
  subscriptionTier SubscriptionTier @default(FREE)
  subscriptionEndDate DateTime?
  
  @@map("users")
}

enum SubscriptionTier {
  FREE
  PREMIUM
  PROPERTY_MANAGER
}

// Property
model Property {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  address     String
  city        String?
  state       String?
  zipCode     String?
  type        PropertyType
  purchaseDate DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tasks       Task[]
  history     ServiceHistory[]
  
  @@map("properties")
}

enum PropertyType {
  SINGLE_FAMILY
  CONDO
  TOWNHOUSE
  APARTMENT
  OTHER
}

// Maintenance Task
model Task {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  propertyId      String
  property        Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  title           String
  description     String?
  category        TaskCategory
  status          TaskStatus  @default(PENDING)
  
  // Scheduling
  isRecurring     Boolean   @default(false)
  recurrenceType  RecurrenceType?
  recurrenceValue Int?
  nextDueDate     DateTime?
  lastCompletedDate DateTime?
  
  // Cost (if estimated)
  estimatedCost   Float?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  history         ServiceHistory[]
  reminders       Reminder[]
  
  @@index([userId, status])
  @@index([propertyId])
  @@index([nextDueDate])
  @@map("tasks")
}

enum TaskCategory {
  HVAC
  PLUMBING
  ELECTRICAL
  APPLIANCE
  LANDSCAPING
  ROOF
  GUTTER
  PAINT
  FLOORING
  PEST_CONTROL
  GENERAL
  OTHER
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
  CANCELLED
}

enum RecurrenceType {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  SEMI_ANNUAL
  ANNUAL
  CUSTOM
}

// Service History Log
model ServiceHistory {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  propertyId    String
  property      Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  taskId        String?
  task          Task?    @relation(fields: [taskId], references: [id], onDelete: SetNull)
  
  title         String
  description   String?
  category      TaskCategory
  completedDate DateTime
  
  // Cost
  cost          Float?
  
  // Vendor (Post-MVP: can be foreign key to Vendor table)
  vendorName    String?
  vendorContact String?
  
  // Notes
  notes         String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([userId])
  @@index([propertyId])
  @@index([completedDate])
  @@map("service_history")
}

// Reminder
model Reminder {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  reminderDate DateTime
  sent        Boolean  @default(false)
  sentAt      DateTime?
  
  // Snooze
  snoozedUntil DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([reminderDate, sent])
  @@map("reminders")
}

// Notification (In-App)
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  message   String
  read      Boolean  @default(false)
  
  // Link (optional)
  linkType  String?
  linkId    String?
  
  createdAt DateTime @default(now())
  
  @@index([userId, read])
  @@map("notifications")
}

enum NotificationType {
  TASK_DUE
  TASK_OVERDUE
  REMINDER
  SYSTEM
}

// Maintenance Template (Pre-built tasks)
model MaintenanceTemplate {
  id              String    @id @default(cuid())
  
  title           String
  description     String
  category        TaskCategory
  
  // Default schedule
  recurrenceType  RecurrenceType
  recurrenceValue Int
  
  // Default estimated cost (optional)
  estimatedCost   Float?
  
  // Template metadata
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@map("maintenance_templates")
}
```

**Key Database Decisions:**
- **Prisma ORM**: Type-safe queries, automatic migrations, excellent TypeScript integration
- **PostgreSQL**: Robust relational database, excellent performance, JSON support for flexible data
- **Indexes**: Strategic indexes on frequently queried fields (userId, status, nextDueDate)
- **Cascade Deletes**: User deletion cascades to all related data
- **Soft Deletes**: Not implemented in MVP (can add later if needed)

### Authentication/Authorization

**Strategy**: JWT (JSON Web Tokens) with refresh tokens

**Authentication Flow:**
1. User registers or logs in with email/password or Google OAuth
2. Backend generates:
   - **Access Token**: Short-lived (15 minutes), contains user ID and role
   - **Refresh Token**: Long-lived (30 days), stored in database
3. Client stores access token in memory (React state)
4. Client stores refresh token in HttpOnly cookie (web) or secure storage (mobile)
5. Client includes access token in Authorization header for API requests
6. When access token expires, client uses refresh token to get new access token
7. Refresh tokens can be revoked (logout, security concern)

**Authorization:**
- **User Access Control**: Users can only access their own data
- **Route Guards**: Protected API endpoints require valid JWT
- **Role-Based Access** (Future): Admin role for support staff

**Security Measures:**
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT signed with secret key
- Refresh tokens stored in database for revocation
- Rate limiting on authentication endpoints (5 attempts per minute)
- HTTPS only (enforced in production)

### Business Logic

**Task Scheduling Logic:**
- When task is created with recurring schedule, calculate nextDueDate
- When task is completed, update lastCompletedDate and calculate next nextDueDate
- Overdue tasks: tasks where nextDueDate < current date and status != COMPLETED

**Reminder Generation:**
- **Cron job** runs daily at 6:00 AM server time
- Finds tasks with nextDueDate in next 7 days
- Creates reminder entries in database
- Reminder service sends notifications at scheduled times

**Notification Delivery:**
- **Email**: SendGrid for transactional emails (7 days before, 1 day before)
- **Push**: Firebase Cloud Messaging for mobile push notifications
- **In-App**: Notification entries in database for in-app notification center

**Service History Auto-Logging:**
- When task is marked complete, optionally create service history log entry
- Pre-fill service log with task title, category, completion date
- User can add cost, notes, vendor details

---

## Infrastructure

### Hosting/Deployment

**MVP Infrastructure** (DigitalOcean):
- **Web App**: DigitalOcean App Platform (Next.js deployment)
- **Backend API**: DigitalOcean App Platform (Node.js deployment)
- **Database**: DigitalOcean Managed PostgreSQL (2GB RAM, 1vCPU)
- **CDN**: DigitalOcean Spaces CDN for static assets
- **Estimated Cost**: $50-70/month

**Production Infrastructure** (AWS - Future):
- **Web App**: AWS Amplify or EC2 with Auto Scaling
- **Backend API**: AWS Elastic Beanstalk or ECS (containers)
- **Database**: AWS RDS PostgreSQL (Multi-AZ for high availability)
- **File Storage**: AWS S3 with CloudFront CDN
- **Load Balancer**: AWS ALB (Application Load Balancer)
- **Estimated Cost**: $200-400/month (scales with usage)

### CI/CD Pipeline

**GitHub Actions Workflow:**

1. **Development Branch Push**:
   - Run linting (ESLint, Prettier)
   - Run type checking (TypeScript)
   - Run unit tests (Jest)
   - Build frontend and backend
   - Report test coverage

2. **Pull Request to Main**:
   - All development checks
   - Integration tests
   - E2E tests (Playwright/Cypress)
   - Security scanning (Snyk)
   - Code review required

3. **Merge to Main**:
   - Build Docker images
   - Push to container registry
   - Deploy to staging environment
   - Run smoke tests
   - Manual approval for production

4. **Production Deployment**:
   - Deploy backend API
   - Run database migrations
   - Deploy frontend (Next.js)
   - Deploy mobile app to TestFlight/Google Play Internal Testing
   - Post-deployment health checks

**Deployment Strategy:**
- **Blue-Green Deployment**: Zero downtime deployments
- **Database Migrations**: Prisma Migrate for safe schema changes
- **Rollback Plan**: Previous Docker images kept for quick rollback

### Monitoring/Logging

**Error Tracking**: Sentry
- Frontend errors (web and mobile)
- Backend API errors
- Performance monitoring
- User session replays

**Application Performance Monitoring**: DataDog (or New Relic)
- API endpoint performance
- Database query performance
- Server resource usage (CPU, memory, disk)
- Custom metrics (task completion rate, reminder delivery rate)

**Logging**: Winston (backend), Console (frontend)
- Structured JSON logging
- Log levels: ERROR, WARN, INFO, DEBUG
- Log aggregation to DataDog or CloudWatch

**Uptime Monitoring**: UptimeRobot or Pingdom
- Monitor API endpoints (health check)
- Monitor web app availability
- Alert on downtime (email, Slack, SMS)

**Alerts:**
- API error rate > 1%
- Database connection failures
- Reminder delivery failures
- Server resource usage > 80%

### Scaling Strategy

**Vertical Scaling** (MVP - Month 1-6):
- Increase server resources as needed
- Upgrade database instance size
- Simple, cost-effective for initial growth

**Horizontal Scaling** (Growth Phase - Month 6+):
- **API**: Multiple backend instances behind load balancer
- **Database**: Read replicas for query performance
- **Caching**: Redis for frequently accessed data (task lists, user profiles)
- **CDN**: CloudFront for static asset delivery

**Database Optimization:**
- **Indexes**: Ensure all frequently queried fields are indexed
- **Query Optimization**: Use EXPLAIN ANALYZE to identify slow queries
- **Connection Pooling**: Prisma connection pooling (default 10 connections)
- **Archiving**: Archive old service history (> 2 years) to separate table

**Caching Strategy** (Post-MVP):
- **Redis Cache**: User profiles, task lists, maintenance templates
- **Client-Side Cache**: React Query cache with stale-while-revalidate
- **CDN Cache**: Static assets (images, CSS, JS) with long cache times

---

## Security Architecture

### Authentication Flow

**JWT Token Structure:**
```json
{
  "sub": "user-id-cuid",
  "email": "user@example.com",
  "tier": "PREMIUM",
  "iat": 1642000000,
  "exp": 1642000900
}
```

**Token Security:**
- Access tokens stored in memory (web) or secure storage (mobile)
- Refresh tokens stored in HttpOnly cookies (web) or secure storage (mobile)
- Tokens signed with HS256 algorithm
- Token rotation on refresh

### Authorization Model

**Access Control Rules:**
- Users can only access their own data (enforced at API level)
- Property-level access: Users can only access properties they own
- Task-level access: Users can only access tasks for their properties
- Service history access: Users can only access their own service logs

**Database-Level Security:**
- Row-level security (future): Enforce access control at database level
- Connection encryption: SSL/TLS for database connections
- Least privilege: API connects with limited database permissions

### Data Encryption

**At Rest:**
- Database: PostgreSQL encryption at rest (managed by hosting provider)
- File storage: AWS S3 server-side encryption (SSE-S3) - Post-MVP
- Backups: Encrypted backups

**In Transit:**
- HTTPS/TLS 1.3 for all API requests
- WebSocket connections (future): WSS (secure WebSockets)
- Database connections: SSL/TLS encryption

### Security Best Practices

1. **Input Validation**: All user inputs validated and sanitized (class-validator)
2. **SQL Injection Prevention**: Prisma ORM prevents SQL injection
3. **XSS Prevention**: React escapes output by default, CSP headers
4. **CSRF Protection**: CSRF tokens for state-changing requests
5. **Rate Limiting**: Prevent brute force attacks (10 requests/minute for auth endpoints)
6. **Secure Headers**: Helmet.js for security headers
7. **Dependency Scanning**: Snyk for vulnerability scanning
8. **Regular Security Audits**: Quarterly penetration testing (post-launch)

---

## Data Architecture

### Data Models

**Core Entities:**
- **User**: User accounts, authentication, subscription tier
- **Property**: User's properties (address, type)
- **Task**: Maintenance tasks with scheduling
- **ServiceHistory**: Completed maintenance logs
- **Reminder**: Scheduled reminder notifications
- **Notification**: In-app notifications
- **MaintenanceTemplate**: Pre-built task templates

**Data Relationships:**
- User → Properties (one-to-many)
- Property → Tasks (one-to-many)
- Task → ServiceHistory (one-to-many)
- Task → Reminders (one-to-many)
- User → Notifications (one-to-many)

### Data Flow

**Task Creation Flow:**
1. User creates task via frontend
2. Frontend sends POST /tasks request with task data
3. Backend validates data (NestJS validation pipes)
4. Prisma creates task record in database
5. If recurring, calculate nextDueDate
6. Create initial reminder records (7 days before, 1 day before)
7. Return task data to frontend
8. Frontend updates React Query cache

**Reminder Delivery Flow:**
1. Cron job runs daily at 6:00 AM
2. Query database for reminders due today
3. For each reminder:
   - Send email via SendGrid
   - Send push notification via Firebase
   - Create in-app notification record
   - Mark reminder as sent
4. Log delivery success/failure

**Service History Logging:**
1. User marks task as complete
2. Frontend presents service log form (pre-filled with task data)
3. User adds cost, notes, vendor details
4. Frontend sends POST /history request
5. Backend creates service history record
6. Update task lastCompletedDate
7. Calculate next nextDueDate (if recurring)
8. Return success response

---

## Integration Architecture

### External APIs

**SendGrid (Email):**
- **Purpose**: Transactional email delivery (reminders, password reset, welcome emails)
- **Integration**: SendGrid Node.js SDK
- **Templates**: Dynamic email templates with personalization
- **Tracking**: Delivery status, open rates, click rates

**Firebase Cloud Messaging (Push Notifications):**
- **Purpose**: Push notifications for mobile apps (iOS and Android)
- **Integration**: Expo Notifications SDK
- **Notification Types**: Task reminders, overdue alerts, service updates
- **Delivery**: Direct to device, background/foreground handling

**Google OAuth:**
- **Purpose**: Third-party authentication (sign up / sign in with Google)
- **Integration**: Passport.js with Google OAuth2 strategy
- **Scope**: Email, profile (name, photo)
- **Flow**: OAuth 2.0 authorization code flow

**AWS S3 (Post-MVP):**
- **Purpose**: File storage for invoices, photos, warranties
- **Integration**: AWS SDK for JavaScript v3
- **Security**: Pre-signed URLs for secure upload/download
- **Organization**: Files organized by user ID, property ID, task ID

### Third-Party Services

**Sentry (Error Tracking):**
- Frontend and backend error tracking
- Performance monitoring
- User session replays
- Release tracking for deployment correlation

**DataDog (APM & Monitoring):**
- Application performance monitoring
- Infrastructure monitoring
- Log aggregation and analysis
- Custom metrics and dashboards

**Stripe (Future - Payment Processing):**
- Subscription billing for Premium/Property Manager tiers
- Payment method management
- Webhook handling for subscription events

### Webhooks

**Incoming Webhooks (Future):**
- Stripe: Subscription events (created, updated, cancelled)
- SendGrid: Email delivery events (delivered, bounced, opened)

**Webhook Security:**
- Signature verification for all webhooks
- Idempotency keys to prevent duplicate processing
- Retry logic with exponential backoff

---

## Performance Optimization

### Backend Performance

**Database Query Optimization:**
- Strategic indexes on frequently queried fields
- Use Prisma's include/select to fetch only needed data
- Pagination for large result sets (default: 50 items per page)
- Database connection pooling (10 connections default)

**Caching Strategy (Post-MVP):**
- Redis cache for user profiles, task lists, templates
- Cache invalidation on data updates
- Cache TTL: 5 minutes for frequently changing data, 1 hour for static data

**API Response Time Goals:**
- GET requests: < 200ms (p95)
- POST/PATCH requests: < 500ms (p95)
- Background jobs: Process within 5 seconds

### Frontend Performance

**Web App Optimization:**
- Server-side rendering for initial page load (Next.js)
- Static generation for marketing pages
- Code splitting with dynamic imports
- Image optimization (Next.js Image component)
- Lazy loading for non-critical components
- React Query caching for API data

**Mobile App Optimization:**
- FlatList virtualization for task lists
- Image caching and compression
- Lazy loading of screens
- Minimal bundle size (tree shaking)
- Native splash screen for perceived performance

**Performance Budgets:**
- Web: Initial load < 3 seconds (3G), Time to Interactive < 5 seconds
- Mobile: App launch < 2 seconds, Screen transitions < 300ms

---

## Testing Strategy

**Unit Tests:**
- Backend services (85% coverage target)
- Frontend components (80% coverage target)
- Jest for testing framework
- Test database for backend tests (SQLite in-memory)

**Integration Tests:**
- API endpoint tests (test entire request/response cycle)
- Database integration tests
- Third-party service integration tests (mocked)
- Supertest for HTTP testing

**End-to-End Tests:**
- Critical user flows (registration, task creation, marking complete)
- Playwright for web app E2E tests
- Detox for mobile app E2E tests
- Run on CI pipeline before deployment

**Manual Testing:**
- Beta testing with real users (20-30 testers)
- Device testing (iOS, Android, various screen sizes)
- Browser testing (Chrome, Safari, Firefox, Edge)
- Accessibility testing (screen readers, keyboard navigation)

---

## Disaster Recovery & Backup

**Database Backups:**
- Automated daily backups (managed by hosting provider)
- Point-in-time recovery (7 days retention)
- Weekly full backups (30 days retention)
- Backup restoration testing quarterly

**File Backups (Post-MVP):**
- AWS S3 versioning enabled
- Cross-region replication for disaster recovery
- Lifecycle policies for cost optimization

**Disaster Recovery Plan:**
- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 24 hours (daily backups)
- **Backup Restoration Procedure**: Documented step-by-step process
- **Disaster Simulation**: Annual DR test

---

## Technology Decisions Summary

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Frontend Web** | Next.js 14 | SSR, React, excellent DX, App Router |
| **Frontend Mobile** | React Native (Expo) | Cross-platform, code sharing with web, fast development |
| **Backend API** | NestJS (Node.js) | TypeScript, modular architecture, excellent ecosystem |
| **Database** | PostgreSQL | Robust, relational, JSON support, mature |
| **ORM** | Prisma | Type-safe, migrations, excellent DX |
| **Authentication** | JWT + OAuth | Stateless, scalable, third-party auth support |
| **Email** | SendGrid | Reliable, excellent deliverability, templates |
| **Push Notifications** | Firebase CM | Free, reliable, cross-platform |
| **Hosting (MVP)** | DigitalOcean | Cost-effective, managed services, simple deployment |
| **Hosting (Scale)** | AWS | Scalable, mature, enterprise-ready |
| **CI/CD** | GitHub Actions | Integrated with GitHub, flexible, good free tier |
| **Monitoring** | Sentry + DataDog | Comprehensive, industry-standard |

---

## Architecture Decision Records (ADRs)

### ADR-001: Choose NestJS over Express
**Status**: Accepted  
**Date**: 2026-01-20

**Context**: Need to choose backend framework for Node.js API.

**Decision**: Use NestJS instead of plain Express.

**Rationale**:
- **TypeScript-first**: Better type safety, DX
- **Modular Architecture**: Clear separation of concerns (modules, controllers, services)
- **Dependency Injection**: Easier testing, better code organization
- **Built-in Features**: Validation, serialization, guards, interceptors
- **Scalability**: Enterprise-grade architecture patterns
- **Community**: Large community, excellent documentation

**Consequences**:
- Steeper learning curve than Express
- More boilerplate code
- Better long-term maintainability

---

### ADR-002: Use Prisma ORM over TypeORM
**Status**: Accepted  
**Date**: 2026-01-20

**Context**: Need to choose ORM for PostgreSQL database access.

**Decision**: Use Prisma ORM instead of TypeORM.

**Rationale**:
- **Type Safety**: Excellent TypeScript support, generated types
- **Developer Experience**: Prisma Studio, migrations, seeding
- **Performance**: Efficient query generation
- **Modern**: Active development, modern architecture
- **Migrations**: Safe, reversible migrations with `prisma migrate`

**Consequences**:
- Limited raw SQL support (can use `$queryRaw` when needed)
- Prisma Client generation adds build step
- Excellent DX and type safety outweigh limitations

---

### ADR-003: React Native with Expo over React Native CLI
**Status**: Accepted  
**Date**: 2026-01-20

**Context**: Need to choose React Native setup for mobile app.

**Decision**: Use React Native with Expo instead of React Native CLI.

**Rationale**:
- **Faster Development**: No native code setup, faster builds
- **OTA Updates**: Push updates without app store approval
- **Built-in Services**: Notifications, camera, authentication
- **Easier Testing**: TestFlight/Google Play integration
- **Community**: Large community, excellent documentation

**Consequences**:
- Limited access to native modules (can eject if needed)
- Slightly larger app bundle size
- Expo limitations are acceptable for this use case

---

## Next Steps

1. **Finalize Database Schema**: Review and approve Prisma schema
2. **Create API Spec**: OpenAPI/Swagger documentation for all endpoints
3. **Design Wireframes**: UI/UX design for all screens
4. **Setup Development Environment**: Initialize repositories, configure CI/CD
5. **Begin Backend Development**: Start with authentication and task services
6. **Frontend Development**: Begin Next.js web app development
7. **Mobile Development**: Begin React Native app development (parallel with web)

---

**Document Maintained By**: Marcus Johnson (Architecture Expert), Samuel Rodriguez (Backend Expert)  
**Last Reviewed**: 2026-01-20  
**Status**: Ready for Implementation
