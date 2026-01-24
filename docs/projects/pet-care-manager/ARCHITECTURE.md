# Pet Care Manager - Architecture

## System Overview

Pet Care Manager is a full-stack web and mobile application built on a modern, scalable architecture designed for high availability, security, and performance. The system follows a three-tier architecture with a React-based frontend (web and mobile), a NestJS backend API, and a PostgreSQL database.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                           │
├─────────────────────┬───────────────────────────────────────┤
│   Web Application   │      Mobile Application               │
│   (Next.js 15)      │      (React Native + Expo)           │
│   - TypeScript      │      - TypeScript                    │
│   - Tailwind CSS    │      - Expo Router                   │
│   - shadcn/ui       │      - React Navigation              │
│   - Zustand         │      - Zustand                       │
└──────────┬──────────┴─────────────┬─────────────────────────┘
           │                        │
           │    RESTful API (HTTPS) │
           │                        │
           ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│              Backend API (NestJS + Node.js)                  │
│   - RESTful API endpoints                                   │
│   - JWT authentication & authorization                      │
│   - Business logic & validation                             │
│   - Notification scheduling & delivery                      │
│   - File upload & storage management                        │
└──────────┬──────────────────────────┬───────────────────────┘
           │                          │
           │                          │ Redis (Caching)
           │                          │
           ▼                          ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│   Data Layer            │   │   External Services          │
├─────────────────────────┤   ├──────────────────────────────┤
│   PostgreSQL 16         │   │   Firebase (Push Notif.)     │
│   - Pet data            │   │   SendGrid (Email)           │
│   - Health records      │   │   Twilio (SMS - Phase 2)     │
│   - User accounts       │   │   DigitalOcean Spaces        │
│   - Appointments        │   │   (File storage)             │
└─────────────────────────┘   └──────────────────────────────┘
```

### System Components

1. **Frontend Layer**:
   - **Web Application**: Next.js 15 with server-side rendering (SSR) and static generation
   - **Mobile Application**: React Native with Expo for cross-platform iOS/Android development

2. **Backend Layer**:
   - **API Server**: NestJS framework providing RESTful API endpoints
   - **Authentication Service**: JWT-based authentication with refresh tokens
   - **Notification Service**: Multi-channel notification delivery (push, email, SMS)
   - **File Storage Service**: Document and photo upload management

3. **Data Layer**:
   - **Primary Database**: PostgreSQL 16 for relational data storage
   - **Cache Layer**: Redis 7 for session management and rate limiting
   - **Object Storage**: DigitalOcean Spaces (S3-compatible) for files

4. **External Services**:
   - **Push Notifications**: Firebase Cloud Messaging (FCM)
   - **Email**: SendGrid for transactional emails
   - **SMS** (Phase 2): Twilio for SMS notifications
   - **CDN**: DigitalOcean CDN for static asset delivery

### Data Flow

```
User Action (Web/Mobile)
    ↓
Frontend validates & sends request
    ↓
Backend API receives request
    ↓
JWT authentication & authorization
    ↓
Business logic validation
    ↓
Database operations (Prisma ORM)
    ↓
Response sent to client
    ↓
Async: Notification scheduling (if applicable)
    ↓
Background job: Notification delivery (push/email/SMS)
```

---

## Frontend Architecture

### Web Application (Next.js 15)

**Framework**: Next.js 15 (React 19)  
**Language**: TypeScript  
**Styling**: Tailwind CSS  
**UI Components**: shadcn/ui (Radix UI primitives)  
**State Management**: React Context API + Zustand for global state

#### Component Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth routes (login, register)
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── pets/             # Pet management
│   │   ├── medications/      # Medication tracking
│   │   ├── appointments/     # Appointment management
│   │   ├── health-records/   # Health records vault
│   │   └── settings/         # User settings
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── forms/                # Form components
│   ├── cards/                # Pet card, medication card, etc.
│   ├── modals/               # Modal dialogs
│   └── layouts/              # Layout components
├── lib/
│   ├── api/                  # API client & endpoints
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── store/                # Zustand stores
│   └── types/                # TypeScript types
├── styles/                   # Global styles
└── public/                   # Static assets
```

#### State Management Strategy

- **React Context**: User authentication state, theme preferences
- **Zustand**: Global state (pets list, medications list, appointments)
- **React Query** (TanStack Query): Server state management, caching, and synchronization
- **Local State**: Component-specific state (form inputs, UI toggles)

#### Routing Strategy

- **Next.js App Router**: File-based routing with server components
- **Dynamic Routes**: `/pets/[petId]`, `/medications/[medicationId]`
- **Protected Routes**: Middleware-based authentication checks
- **Parallel Routes**: Modals and intercept routes for improved UX

### Mobile Application (React Native + Expo)

**Framework**: React Native with Expo (SDK 51+)  
**Language**: TypeScript  
**Navigation**: Expo Router (file-based routing)  
**State Management**: Zustand + React Query  
**Offline Storage**: Expo SQLite + AsyncStorage

#### Mobile App Structure

```
src/
├── app/                      # Expo Router (file-based)
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── index.tsx         # Home/Dashboard
│   │   ├── pets.tsx          # Pets list
│   │   ├── medications.tsx   # Medications
│   │   └── appointments.tsx  # Appointments
│   ├── (auth)/               # Auth screens
│   ├── pet/[id].tsx          # Pet detail (dynamic)
│   └── _layout.tsx           # Root layout
├── components/
│   ├── cards/                # Pet card, medication card
│   ├── forms/                # Form components
│   └── modals/               # Bottom sheets, modals
├── lib/
│   ├── api/                  # API client
│   ├── hooks/                # Custom hooks
│   ├── store/                # Zustand stores
│   ├── database/             # SQLite schemas & queries
│   └── notifications/        # Push notification handling
└── assets/                   # Images, fonts
```

#### Offline-First Strategy

- **SQLite Database**: Local storage for pet data, medications, appointments
- **Sync Strategy**: Background sync when network available
- **Offline Queue**: Queue API requests when offline, retry on reconnection
- **Conflict Resolution**: Last-write-wins with user-facing conflict UI

#### Push Notifications

- **Firebase Cloud Messaging**: Cross-platform push notifications
- **Expo Notifications API**: Local notifications and scheduling
- **Notification Types**:
  - Medication reminders (time-based)
  - Appointment reminders (24h, 1h before)
  - Vaccination due reminders (30 days before)
  - System notifications (updates, tips)

---

## Backend Architecture

### NestJS API Server

**Framework**: NestJS 10 (Node.js)  
**Language**: TypeScript  
**API Style**: RESTful API  
**ORM**: Prisma 5  
**Authentication**: JWT with refresh tokens

#### Module Structure

```
src/
├── main.ts                   # Application entry point
├── app.module.ts             # Root module
├── auth/
│   ├── auth.module.ts        # Authentication module
│   ├── auth.service.ts       # Auth logic (JWT, tokens)
│   ├── auth.controller.ts    # Auth endpoints (/login, /register)
│   ├── guards/               # Auth guards (JWT, roles)
│   └── strategies/           # Passport strategies
├── users/
│   ├── users.module.ts       # User management module
│   ├── users.service.ts      # User CRUD operations
│   ├── users.controller.ts   # User endpoints
│   └── dto/                  # Data transfer objects
├── pets/
│   ├── pets.module.ts        # Pet management module
│   ├── pets.service.ts       # Pet CRUD operations
│   ├── pets.controller.ts    # Pet endpoints
│   └── dto/                  # Pet DTOs
├── medications/
│   ├── medications.module.ts # Medication tracking module
│   ├── medications.service.ts# Medication logic
│   ├── medications.controller.ts # Medication endpoints
│   └── dto/                  # Medication DTOs
├── appointments/
│   ├── appointments.module.ts# Appointment module
│   ├── appointments.service.ts# Appointment logic
│   ├── appointments.controller.ts # Appointment endpoints
│   └── dto/                  # Appointment DTOs
├── health-records/
│   ├── health-records.module.ts # Health records module
│   ├── health-records.service.ts # File upload/retrieval
│   ├── health-records.controller.ts # Health record endpoints
│   └── dto/                  # Health record DTOs
├── notifications/
│   ├── notifications.module.ts # Notification service module
│   ├── notifications.service.ts # Notification scheduling & delivery
│   ├── notification-scheduler.service.ts # Cron jobs for reminders
│   └── providers/            # FCM, SendGrid, Twilio providers
├── common/
│   ├── decorators/           # Custom decorators
│   ├── filters/              # Exception filters
│   ├── interceptors/         # Logging, transformation
│   ├── pipes/                # Validation pipes
│   └── guards/               # Authorization guards
├── config/                   # Configuration management
└── prisma/                   # Prisma schema & migrations
    ├── schema.prisma         # Database schema
    └── migrations/           # Migration files
```

#### API Design Principles

- **RESTful Conventions**: Use standard HTTP methods (GET, POST, PUT, DELETE)
- **Resource-Based URLs**: `/api/pets`, `/api/medications`, `/api/appointments`
- **Versioning**: `/api/v1/*` for future API version support
- **Consistent Response Format**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation successful"
  }
  ```
- **Error Responses**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": [...]
    }
  }
  ```

#### Key API Endpoints

**Authentication**:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login (returns JWT + refresh token)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (invalidate refresh token)

**Pets**:
- `GET /api/v1/pets` - List user's pets
- `POST /api/v1/pets` - Create new pet profile
- `GET /api/v1/pets/:id` - Get pet details
- `PUT /api/v1/pets/:id` - Update pet info
- `DELETE /api/v1/pets/:id` - Delete pet profile

**Medications**:
- `GET /api/v1/pets/:petId/medications` - List pet's medications
- `POST /api/v1/pets/:petId/medications` - Add medication
- `PUT /api/v1/medications/:id` - Update medication
- `POST /api/v1/medications/:id/log-dose` - Log medication dose
- `DELETE /api/v1/medications/:id` - Delete medication

**Appointments**:
- `GET /api/v1/pets/:petId/appointments` - List pet's appointments
- `POST /api/v1/pets/:petId/appointments` - Schedule appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

**Health Records**:
- `GET /api/v1/pets/:petId/health-records` - List pet's health records
- `POST /api/v1/pets/:petId/health-records` - Upload health record
- `GET /api/v1/health-records/:id/download` - Download health record file
- `DELETE /api/v1/health-records/:id` - Delete health record

#### Authentication & Authorization

**JWT Strategy**:
- **Access Token**: Short-lived (15 minutes), contains user ID and roles
- **Refresh Token**: Long-lived (7 days), stored securely, used to obtain new access tokens
- **Token Storage**:
  - Web: HTTPOnly secure cookies (refresh token), localStorage (access token)
  - Mobile: Expo SecureStore (both tokens)

**Authorization Levels**:
- **Owner**: Full access to own pets and data
- **Family Member** (Phase 2): Limited access to shared pets
- **Admin** (future): System administration access

#### Business Logic

**Medication Reminder Logic**:
1. User creates medication with schedule (daily, weekly, custom)
2. Backend calculates next reminder times based on schedule
3. Cron job runs every minute, checks for due reminders
4. Notification service sends reminders via configured channels (push, email)
5. User logs dose, system updates next reminder time

**Appointment Reminder Logic**:
1. User schedules appointment with date/time
2. Backend creates reminder jobs (24h before, 1h before)
3. Cron job checks for upcoming appointments
4. Notification service sends timely reminders
5. Post-appointment: prompt user to upload vet notes/records

**Vaccination Tracking Logic**:
1. User logs vaccination with date and next due date
2. Backend calculates reminder date (30 days before due date)
3. Notification service sends reminder 30 days before
4. If not updated, follow-up reminders at 14 days, 7 days, 1 day before due date

---

## Infrastructure

### MVP Infrastructure (DigitalOcean)

**Hosting**: DigitalOcean  
**Environment**: Production, Staging

#### Infrastructure Components

1. **Application Servers** (DigitalOcean Droplets):
   - 2x Droplets (8GB RAM, 4 vCPUs) for API servers
   - Load balancer (DigitalOcean Load Balancer)
   - Auto-scaling: Manual scaling based on load

2. **Database**:
   - Managed PostgreSQL 16 (DigitalOcean Managed Database)
   - 4GB RAM, 2 vCPUs
   - Automated backups (daily)
   - Point-in-time recovery

3. **Cache Layer**:
   - Managed Redis 7 (DigitalOcean Managed Redis)
   - 1GB RAM
   - Session storage, rate limiting

4. **Object Storage**:
   - DigitalOcean Spaces (S3-compatible)
   - Pet photos, health record documents
   - CDN enabled for fast delivery

5. **CDN**:
   - DigitalOcean CDN
   - Static assets, pet photos
   - Global edge locations

#### Deployment Strategy

**Containerization**: Docker  
**Orchestration**: Docker Compose (MVP), Kubernetes (Phase 2+)

**Docker Setup**:
- `api.Dockerfile`: NestJS API server
- `web.Dockerfile`: Next.js web app
- `docker-compose.yml`: Local development environment
- `docker-compose.prod.yml`: Production deployment

**CI/CD Pipeline** (GitHub Actions):
1. Code push to main branch
2. Run tests (unit, integration, E2E)
3. Build Docker images
4. Push images to DigitalOcean Container Registry
5. Deploy to production (rolling deployment)
6. Health check validation
7. Rollback on failure

### Phase 2+ Infrastructure (AWS Migration)

**Why AWS**: Better scalability, advanced services, global reach

**AWS Services**:
- **Compute**: ECS (Fargate) for containerized API servers
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Cache**: ElastiCache Redis (clustered)
- **Storage**: S3 (files), CloudFront (CDN)
- **Load Balancing**: Application Load Balancer (ALB)
- **Monitoring**: CloudWatch, X-Ray
- **Secrets**: AWS Secrets Manager
- **CI/CD**: CodePipeline + CodeBuild

#### Scaling Strategy

**Horizontal Scaling**:
- Auto-scaling groups for API servers (scale on CPU/memory usage)
- Read replicas for PostgreSQL (scale read-heavy queries)
- Redis cluster (scale cache layer)

**Vertical Scaling**:
- Upgrade instance sizes as needed
- Database performance tuning (indexes, query optimization)

---

## Security Architecture

### Authentication Flow

1. **User Registration**:
   - User submits email + password
   - Backend hashes password (bcrypt, 12 rounds)
   - User account created in database
   - Email verification sent (SendGrid)

2. **User Login**:
   - User submits email + password
   - Backend verifies credentials
   - Generate JWT access token (15 min expiry)
   - Generate refresh token (7 day expiry)
   - Return both tokens to client
   - Store refresh token in database (hashed)

3. **Token Refresh**:
   - Client sends refresh token
   - Backend validates refresh token
   - Generate new access token
   - Return new access token to client

4. **Logout**:
   - Client sends refresh token
   - Backend invalidates refresh token in database
   - Client clears local tokens

### Authorization Model

**Role-Based Access Control (RBAC)**:
- **Owner**: Full CRUD access to own pets and data
- **Family Member** (Phase 2): Read/write access to shared pets (permissions configurable by owner)
- **Admin** (future): System administration capabilities

**Resource-Level Authorization**:
- Users can only access their own pets and related data
- Guards on every API endpoint verify ownership before allowing operations
- Database queries filtered by user ID to prevent unauthorized access

### Data Encryption

**Encryption at Rest**:
- Database: PostgreSQL encryption at rest (managed database provider handles encryption)
- Object Storage: DigitalOcean Spaces encryption at rest
- Sensitive fields: Additional application-level encryption for PII (pet owner names, addresses)

**Encryption in Transit**:
- HTTPS/TLS 1.3 for all API communication
- Certificate management: Let's Encrypt (auto-renewal)
- Strict Transport Security (HSTS) headers

**Sensitive Data Handling**:
- Passwords: Hashed with bcrypt (12 rounds)
- Tokens: Refresh tokens hashed before storage
- Health Records: Files encrypted before upload to object storage
- PII: Application-level encryption for names, addresses, phone numbers

### Security Best Practices

1. **Input Validation**:
   - DTOs (Data Transfer Objects) with class-validator
   - Sanitize all user inputs to prevent XSS
   - Parameterized queries (Prisma ORM) to prevent SQL injection

2. **Rate Limiting**:
   - Redis-based rate limiting (100 requests per minute per user)
   - Stricter limits on auth endpoints (5 login attempts per 15 minutes)

3. **CORS Configuration**:
   - Whitelist allowed origins (web app domain, mobile app)
   - Credentials allowed for authenticated requests

4. **Security Headers**:
   - Helmet.js for Express security headers
   - Content Security Policy (CSP)
   - X-Frame-Options, X-Content-Type-Options

5. **Logging & Monitoring**:
   - Sentry for error tracking and alerting
   - Audit logs for sensitive operations (login, data access)
   - Failed login attempt monitoring

6. **Secrets Management**:
   - Environment variables for secrets (never hardcode)
   - AWS Secrets Manager (Phase 2+)
   - Rotate secrets regularly (database passwords, API keys)

---

## Data Architecture

### Database Schema (PostgreSQL + Prisma)

#### Core Tables

**users**:
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  phoneNumber   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  pets          Pet[]
  refreshTokens RefreshToken[]
}
```

**pets**:
```prisma
model Pet {
  id            String    @id @default(uuid())
  userId        String
  name          String
  species       String    // dog, cat, bird, etc.
  breed         String?
  birthDate     DateTime?
  weight        Float?    // in pounds or kg
  gender        String?   // male, female, unknown
  photoUrl      String?
  microchipId   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  medications   Medication[]
  appointments  Appointment[]
  vaccinations  Vaccination[]
  healthRecords HealthRecord[]
  
  @@index([userId])
}
```

**medications**:
```prisma
model Medication {
  id            String    @id @default(uuid())
  petId         String
  name          String
  dosage        String
  frequency     String    // daily, weekly, custom
  scheduleTime  String[]  // Array of times (e.g., ["08:00", "20:00"])
  startDate     DateTime
  endDate       DateTime?
  notes         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  pet           Pet       @relation(fields: [petId], references: [id], onDelete: Cascade)
  doses         MedicationDose[]
  
  @@index([petId])
  @@index([isActive])
}
```

**medication_doses**:
```prisma
model MedicationDose {
  id            String    @id @default(uuid())
  medicationId  String
  scheduledTime DateTime
  actualTime    DateTime?
  status        String    // pending, given, missed, skipped
  notes         String?
  createdAt     DateTime  @default(now())
  
  medication    Medication @relation(fields: [medicationId], references: [id], onDelete: Cascade)
  
  @@index([medicationId])
  @@index([scheduledTime])
  @@index([status])
}
```

**appointments**:
```prisma
model Appointment {
  id            String    @id @default(uuid())
  petId         String
  title         String
  appointmentDate DateTime
  vetName       String?
  vetPhone      String?
  vetAddress    String?
  notes         String?
  reminderSent  Boolean   @default(false)
  status        String    @default("scheduled") // scheduled, completed, cancelled
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  pet           Pet       @relation(fields: [petId], references: [id], onDelete: Cascade)
  
  @@index([petId])
  @@index([appointmentDate])
}
```

**vaccinations**:
```prisma
model Vaccination {
  id            String    @id @default(uuid())
  petId         String
  vaccineName   String
  dateGiven     DateTime
  nextDueDate   DateTime?
  veterinarian  String?
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  pet           Pet       @relation(fields: [petId], references: [id], onDelete: Cascade)
  
  @@index([petId])
  @@index([nextDueDate])
}
```

**health_records**:
```prisma
model HealthRecord {
  id            String    @id @default(uuid())
  petId         String
  title         String
  recordType    String    // vet-visit, lab-result, x-ray, prescription, other
  recordDate    DateTime
  fileUrl       String?
  fileSize      Int?
  mimeType      String?
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  pet           Pet       @relation(fields: [petId], references: [id], onDelete: Cascade)
  
  @@index([petId])
  @@index([recordType])
}
```

**refresh_tokens**:
```prisma
model RefreshToken {
  id            String    @id @default(uuid())
  userId        String
  tokenHash     String    @unique
  expiresAt     DateTime
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([expiresAt])
}
```

#### Database Relationships

- **User → Pets**: One-to-many (one user can have multiple pets)
- **Pet → Medications**: One-to-many (one pet can have multiple medications)
- **Medication → Doses**: One-to-many (one medication has multiple dose logs)
- **Pet → Appointments**: One-to-many (one pet can have multiple appointments)
- **Pet → Vaccinations**: One-to-many (one pet can have multiple vaccination records)
- **Pet → Health Records**: One-to-many (one pet can have multiple health records)

#### Indexes & Performance

**Primary Indexes**:
- All `@id` fields have automatic primary key indexes
- Foreign keys (`userId`, `petId`, etc.) have indexes for fast joins

**Additional Indexes**:
- `medications.isActive`: Fast filtering of active medications
- `medication_doses.scheduledTime`: Fast reminder queries
- `appointments.appointmentDate`: Fast upcoming appointment queries
- `vaccinations.nextDueDate`: Fast vaccination reminder queries

**Query Optimization**:
- Use Prisma's `include` and `select` for efficient data fetching
- Paginate large result sets (limit/offset or cursor-based)
- Use database views for complex aggregations (Phase 2+)

---

## Integration Architecture

### External APIs

#### Firebase Cloud Messaging (Push Notifications)

**Purpose**: Send push notifications to mobile apps (iOS & Android)

**Integration**:
- NestJS notification service sends requests to FCM API
- Device tokens stored in user settings (encrypted)
- Notification payload includes title, body, data (deep linking)

**Notification Types**:
- Medication reminders
- Appointment reminders
- Vaccination due reminders
- System notifications

#### SendGrid (Email Notifications)

**Purpose**: Send transactional emails

**Integration**:
- NestJS notification service uses SendGrid SDK
- Email templates stored in SendGrid (dynamic content)
- Retry logic for failed deliveries

**Email Types**:
- Account verification
- Password reset
- Medication reminders (backup to push)
- Appointment reminders (backup to push)
- Weekly summary reports

#### Twilio (SMS Notifications) - Phase 2

**Purpose**: Send SMS notifications (backup to push/email)

**Integration**:
- NestJS notification service uses Twilio SDK
- Phone numbers verified before SMS delivery
- Rate limiting to prevent abuse

**SMS Types**:
- Critical medication reminders (high-priority meds)
- Urgent appointment reminders (same-day)

### Third-Party Services

#### DigitalOcean Spaces (Object Storage)

**Purpose**: Store pet photos and health record documents

**Integration**:
- S3-compatible API (AWS SDK for JavaScript)
- Pre-signed URLs for secure file uploads
- CDN integration for fast file delivery

**File Management**:
- Pet photos: Resized and optimized (multiple sizes: thumbnail, medium, large)
- Health records: Encrypted before upload, virus scanning
- File retention: 30 days for deleted files (soft delete), then permanent deletion

#### Stripe (Payment Processing) - Phase 2

**Purpose**: Handle premium subscription payments

**Integration**:
- Stripe SDK for subscription management
- Webhook endpoint for payment events (success, failure, cancellation)
- Customer portal for subscription management

---

## Monitoring & Logging

### Error Tracking (Sentry)

**Purpose**: Real-time error monitoring and alerting

**Integration**:
- Sentry SDK integrated in backend (NestJS) and frontend (Next.js, React Native)
- Error context captured (user ID, request details, stack trace)
- Alerts sent to development team for critical errors

**Monitored Events**:
- Application crashes
- Unhandled exceptions
- API errors (500-level status codes)
- Failed database queries
- Failed notification deliveries

### Application Monitoring (Datadog) - Phase 2

**Purpose**: Performance monitoring, metrics, and tracing

**Features**:
- APM (Application Performance Monitoring)
- Distributed tracing (request flow across services)
- Custom metrics (medication dose logging rate, appointment creation rate)
- Uptime monitoring and alerts

### Logging Strategy

**Log Levels**:
- **ERROR**: Critical errors requiring immediate attention
- **WARN**: Warning conditions (e.g., rate limit approaching)
- **INFO**: General informational messages (user actions, system events)
- **DEBUG**: Detailed debug information (development only)

**Structured Logging**:
- JSON-formatted logs for easy parsing
- Include: timestamp, log level, message, user ID (if applicable), request ID, context

**Log Storage**:
- MVP: DigitalOcean Droplet local logs (rotated daily)
- Phase 2+: Centralized logging (AWS CloudWatch Logs or ELK stack)

---

## Scalability & Performance

### Performance Targets

- **Web App Load Time**: < 2 seconds (initial page load)
- **API Response Time**: < 200ms (p95)
- **Mobile App Startup**: < 1 second
- **Database Query Time**: < 50ms (p95)
- **Notification Delivery**: < 5 seconds from scheduled time

### Caching Strategy

**Redis Caching**:
- Session data (user sessions, JWT token validation)
- API response caching (pet list, medication list - short TTL)
- Rate limiting counters
- Notification delivery status

**Client-Side Caching**:
- React Query: Automatic server state caching (5-minute default TTL)
- Service Worker (PWA): Cache static assets for offline access

### Database Optimization

**Query Optimization**:
- Use Prisma's query optimization features
- Avoid N+1 queries (use `include` for eager loading)
- Use pagination for large result sets

**Connection Pooling**:
- Prisma connection pooling (max 10 connections for MVP)
- Scale connection pool with increased load

**Read Replicas** (Phase 2+):
- PostgreSQL read replicas for read-heavy queries
- Direct write queries to primary database

### Horizontal Scaling (Phase 2+)

**Stateless API Servers**:
- All state stored in database or Redis (no local state)
- Enable horizontal scaling with load balancer

**Auto-Scaling**:
- Scale API servers based on CPU/memory usage
- Scale during peak hours (evenings, weekends)

---

## Deployment Strategy

### CI/CD Pipeline (GitHub Actions)

**Workflow**:
1. **Trigger**: Code push to main branch
2. **Test**: Run unit tests, integration tests, E2E tests
3. **Build**: Build Docker images (API, web)
4. **Push**: Push images to DigitalOcean Container Registry
5. **Deploy**: Deploy to production (rolling deployment)
6. **Health Check**: Validate deployment health
7. **Rollback**: Automatic rollback on failure

**Environments**:
- **Development**: Local development environment
- **Staging**: Pre-production environment (mirrors production)
- **Production**: Live production environment

### Deployment Process

**Rolling Deployment**:
1. Deploy new version to 1 server
2. Health check validation
3. Deploy to remaining servers sequentially
4. Keep old version running until new version validated

**Zero-Downtime Deployment**:
- Load balancer routes traffic to healthy servers
- Old version remains available during deployment
- Graceful shutdown of old servers

**Database Migrations**:
- Prisma migrations run before deployment
- Backward-compatible migrations (no breaking changes)
- Rollback plan for failed migrations

---

## Disaster Recovery

### Backup Strategy

**Database Backups**:
- Automated daily backups (DigitalOcean Managed Database)
- Point-in-time recovery (7-day retention)
- Weekly full backups stored offsite (S3)

**Object Storage Backups**:
- DigitalOcean Spaces built-in redundancy
- Cross-region replication (Phase 2+)

### Recovery Procedures

**Database Recovery**:
1. Restore from latest backup
2. Apply transaction logs (point-in-time recovery)
3. Validate data integrity
4. Resume application

**Service Outage**:
1. Identify root cause
2. Failover to standby infrastructure (Phase 2+)
3. Notify users of issue and ETA
4. Restore service
5. Post-mortem analysis

---

## Review/Contribution

**Expert**: Marcus Johnson (Architecture)  
**Date**: 2026-01-25  
**Changes**: Created comprehensive Pet Care Manager architecture document covering system overview (three-tier architecture with Next.js web, React Native mobile, NestJS backend, PostgreSQL database), frontend architecture (Next.js 15 with App Router, React Native with Expo, state management with Zustand and React Query, offline-first mobile strategy), backend architecture (NestJS module structure, RESTful API design, JWT authentication, medication/appointment reminder logic), infrastructure (DigitalOcean for MVP with Droplets, managed PostgreSQL, Redis, Spaces, CI/CD with GitHub Actions; AWS migration path for Phase 2+), security architecture (JWT authentication flow, RBAC authorization, encryption at rest and in transit, security best practices), data architecture (Prisma schema with users, pets, medications, appointments, vaccinations, health records, refresh tokens; database indexes and query optimization), integration architecture (Firebase Cloud Messaging, SendGrid, Twilio, DigitalOcean Spaces, Stripe), monitoring and logging (Sentry error tracking, Datadog APM for Phase 2+, structured logging), scalability and performance (caching strategy with Redis and React Query, database optimization, horizontal scaling for Phase 2+), deployment strategy (CI/CD with GitHub Actions, rolling deployment, zero-downtime deployment), and disaster recovery (backup strategy, recovery procedures). This architecture provides a solid, scalable foundation for Pet Care Manager with clear paths for growth from MVP to Phase 2+ with AWS migration.

---
