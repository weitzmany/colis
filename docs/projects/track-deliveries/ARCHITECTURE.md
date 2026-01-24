# Track Deliveries - Architecture Document

**Version**: 1.0  
**Last Updated**: 2026-01-24  
**Status**: Planning / Proposal

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Architecture](#database-architecture)
5. [Infrastructure Architecture](#infrastructure-architecture)
6. [Security Architecture](#security-architecture)
7. [Integration Architecture](#integration-architecture)
8. [Scalability & Performance](#scalability--performance)
9. [Monitoring & Observability](#monitoring--observability)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

Track Deliveries follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Web App   │  │  Mobile App │  │  Mobile Browser  │   │
│  │  (Next.js)  │  │ (React Native)│  │   (Responsive)   │   │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
└─────────┼─────────────────┼───────────────────┼─────────────┘
          │                 │                   │
          └─────────────────┴───────────────────┘
                            │
                       HTTPS/TLS
                            │
┌───────────────────────────┼────────────────────────────────┐
│                      API Gateway                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Rate Limiting, Authentication, Request Routing      │  │
│  └─────────────────────────┬────────────────────────────┘  │
└────────────────────────────┼───────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
┌────────┴─────────┐                 ┌──────────┴────────────┐
│  Application     │                 │   Background Jobs     │
│    Server        │                 │    (Bull Queue)       │
│  (Express/NestJS)│◄────────────────┤  - Carrier Polling    │
│  - REST API      │                 │  - Email Sending      │
│  - WebSockets    │                 │  - Status Updates     │
└────────┬─────────┘                 └──────────┬────────────┘
         │                                      │
         │         ┌──────────────────┐         │
         ├─────────┤  Cache (Redis)   ├─────────┤
         │         │  - API Cache     │         │
         │         │  - Session Store │         │
         │         └──────────────────┘         │
         │                                      │
         │         ┌──────────────────┐         │
         └─────────┤  Database        ├─────────┘
                   │  (PostgreSQL)    │
                   │  - User Data     │
                   │  - Package Data  │
                   │  - Status History│
                   └──────────────────┘
                            │
                   ┌────────┴────────┐
                   │                 │
          ┌────────┴────────┐  ┌────┴──────────────┐
          │  Email Service  │  │  Carrier APIs     │
          │   (SendGrid)    │  │  - USPS           │
          │  - Alerts       │  │  - UPS            │
          │  - Notifications│  │  - FedEx          │
          └─────────────────┘  │  - DHL            │
                               └───────────────────┘
```

### System Components

#### Frontend Layer
- **Next.js Web App**: Server-side rendered React app with API routes
- **Mobile App (Phase 2)**: React Native app for iOS and Android
- **Responsive Design**: Mobile-first approach for all screen sizes

#### API Layer
- **API Gateway**: Express or NestJS REST API
- **Authentication**: JWT-based authentication with refresh tokens
- **Rate Limiting**: Prevent abuse and ensure fair usage

#### Application Layer
- **Business Logic**: Package management, carrier detection, notification logic
- **Background Jobs**: Carrier polling, email sending, data cleanup

#### Data Layer
- **PostgreSQL**: Primary relational database for structured data
- **Redis**: Caching layer and job queue

#### Integration Layer
- **Carrier APIs**: USPS, UPS, FedEx, DHL tracking APIs
- **Email Service**: SendGrid for transactional emails
- **Push Notifications (Phase 2)**: FCM (Firebase Cloud Messaging) for mobile push

---

### Data Flow

#### Package Tracking Flow

```
1. User adds tracking number via web/mobile
   ↓
2. Frontend validates input, sends to API
   ↓
3. API authenticates user (JWT)
   ↓
4. API auto-detects carrier from tracking number
   ↓
5. API creates package record in database
   ↓
6. API queues background job for initial status fetch
   ↓
7. Background job calls carrier API
   ↓
8. Carrier API returns current status
   ↓
9. Background job updates package status in database
   ↓
10. Frontend displays updated package with status
```

#### Status Update Flow (Background Job)

```
1. Cron job triggers every 2-4 hours
   ↓
2. Job fetches all active packages from database
   ↓
3. For each package, call carrier API (with rate limiting)
   ↓
4. Compare new status with previous status
   ↓
5. If status changed:
   a. Update package status in database
   b. Insert new status history record
   c. Queue notification job (email/push)
   ↓
6. Notification job sends email/push to user
   ↓
7. User receives alert about status change
```

---

## Frontend Architecture

### Technology Stack

**Framework**: Next.js 14 with App Router  
**Language**: TypeScript 5  
**Styling**: Tailwind CSS 3  
**State Management**: React Context API or Zustand  
**Forms**: React Hook Form + Zod validation  
**HTTP Client**: Axios  
**Testing**: Jest (unit), Playwright (E2E)

---

### Directory Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── layout.tsx       # Dashboard layout with nav
│   │   ├── page.tsx         # Main timeline view
│   │   ├── packages/
│   │   │   ├── [id]/       # Package detail page
│   │   │   │   └── page.tsx
│   │   │   └── add/        # Add package page
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx     # Notification preferences
│   ├── api/                 # API routes (if using Next.js API routes)
│   │   └── auth/           # Auth endpoints (optional)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── package/             # Package-specific components
│   │   ├── PackageCard.tsx
│   │   ├── PackageList.tsx
│   │   ├── PackageTimeline.tsx
│   │   ├── AddPackageForm.tsx
│   │   └── StatusBadge.tsx
│   ├── auth/                # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/                     # Utility functions
│   ├── api.ts              # API client (Axios)
│   ├── auth.ts             # Auth helpers (JWT)
│   ├── carrier.ts          # Carrier detection logic
│   └── utils.ts            # General utilities
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── usePackages.ts      # Package data hook
│   └── useNotifications.ts # Notification preferences hook
├── types/                   # TypeScript types
│   ├── package.ts
│   ├── user.ts
│   └── api.ts
├── context/                 # React Context (if using)
│   ├── AuthContext.tsx
│   └── PackageContext.tsx
├── public/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
└── styles/                  # Global styles
    └── globals.css
```

---

### Component Architecture

#### Component Hierarchy

```
App (Next.js Root)
├── Layout (Header, Footer)
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   └── Footer
├── Dashboard (Protected Route)
│   ├── Sidebar (Navigation)
│   └── PackageTimeline (Main View)
│       ├── TimelineSection ("Today", "Tomorrow", etc.)
│       │   └── PackageCard (Individual Package)
│       │       ├── StatusBadge
│       │       ├── CarrierLogo
│       │       ├── TrackingNumber
│       │       ├── DeliveryEstimate
│       │       └── Actions (View Details, Delete)
│       └── EmptyState (No packages)
└── Modals
    ├── AddPackageModal
    │   └── AddPackageForm
    │       ├── TrackingNumberInput
    │       ├── CarrierSelect (fallback)
    │       └── NotesInput
    └── PackageDetailModal
        ├── StatusHistory
        ├── PackageInfo
        └── Actions (Edit, Delete, Archive)
```

---

### State Management

**Approach**: React Context API for MVP, migrate to Zustand if needed.

#### Auth Context

```typescript
// context/AuthContext.tsx
interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}
```

#### Package Context

```typescript
// context/PackageContext.tsx
interface PackageContext {
  packages: Package[];
  isLoading: boolean;
  addPackage: (trackingNumber: string, note?: string) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  refreshPackage: (id: string) => Promise<void>;
  refreshAll: () => Promise<void>;
}
```

---

### Routing

**Next.js App Router**: File-based routing with layouts and route groups.

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Landing Page | No | Marketing page with CTA |
| `/login` | Login | No | User login form |
| `/register` | Register | No | User registration form |
| `/forgot-password` | Forgot Password | No | Password reset request |
| `/dashboard` | Dashboard | Yes | Main timeline view |
| `/packages/add` | Add Package | Yes | Add tracking number |
| `/packages/[id]` | Package Detail | Yes | Package detail and history |
| `/settings` | Settings | Yes | Notification preferences |

---

### API Integration

**API Client**: Axios with interceptors for authentication.

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor (add JWT token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle 401 errors)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token or redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Performance Optimization

#### Code Splitting
- **Next.js automatic code splitting** per route
- **Dynamic imports** for heavy components (charts, modals)

#### Image Optimization
- **Next.js Image component** for optimized images
- **WebP format** with fallback to PNG/JPEG

#### Caching Strategy
- **Static pages**: Cached at CDN (landing page)
- **Dynamic pages**: Revalidate every 5 minutes (dashboard)
- **API responses**: Cache in React Query/SWR (1-minute stale time)

#### Bundle Size
- **Target**: < 200 KB initial bundle (gzipped)
- **Lazy load**: Heavy dependencies (chart libraries, PDF export)
- **Tree shaking**: Remove unused code (Tailwind purge)

---

## Backend Architecture

### Technology Stack

**Framework**: Node.js 20 with Express 4 (or NestJS 10)  
**Language**: TypeScript 5  
**Database**: PostgreSQL 15  
**ORM**: Prisma 5  
**Cache**: Redis 7  
**Job Queue**: Bull (Redis-backed)  
**Authentication**: JWT (jsonwebtoken), bcrypt  
**Email**: SendGrid API  
**Testing**: Jest (unit), Supertest (integration)

---

### Directory Structure

```
backend/
├── src/
│   ├── modules/               # Feature modules
│   │   ├── auth/             # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── users/            # User management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.repository.ts
│   │   ├── packages/         # Package tracking
│   │   │   ├── packages.controller.ts
│   │   │   ├── packages.service.ts
│   │   │   ├── packages.repository.ts
│   │   │   └── dto/
│   │   │       ├── create-package.dto.ts
│   │   │       └── update-package.dto.ts
│   │   ├── carriers/         # Carrier integrations
│   │   │   ├── carriers.service.ts
│   │   │   ├── usps.service.ts
│   │   │   ├── ups.service.ts
│   │   │   ├── fedex.service.ts
│   │   │   └── dhl.service.ts
│   │   └── notifications/    # Email/push notifications
│   │       ├── notifications.service.ts
│   │       ├── email.service.ts
│   │       └── templates/
│   │           ├── out-for-delivery.html
│   │           └── delivered.html
│   ├── jobs/                  # Background jobs
│   │   ├── carrier-poll.job.ts
│   │   ├── email.job.ts
│   │   └── cleanup.job.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                 # Utility functions
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── carrier-detector.ts
│   │   └── logger.ts
│   ├── types/                 # TypeScript types
│   │   ├── express.d.ts
│   │   └── carrier.ts
│   ├── config/                # Configuration
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── prisma/                # Prisma ORM
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example               # Environment variables template
├── package.json
└── tsconfig.json
```

---

### API Design

**Architecture**: RESTful API with JSON responses  
**Documentation**: OpenAPI 3.0 (Swagger)  
**Versioning**: URL versioning (`/api/v1/...`)

#### API Endpoints

##### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |
| POST | `/api/v1/auth/refresh` | Refresh access token | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password | No |

##### Packages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/packages` | Get all user packages | Yes |
| GET | `/api/v1/packages/:id` | Get package by ID | Yes |
| POST | `/api/v1/packages` | Add new package | Yes |
| PUT | `/api/v1/packages/:id` | Update package | Yes |
| DELETE | `/api/v1/packages/:id` | Delete package | Yes |
| POST | `/api/v1/packages/:id/refresh` | Refresh package status | Yes |
| GET | `/api/v1/packages/:id/history` | Get status history | Yes |

##### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/me` | Get current user | Yes |
| PUT | `/api/v1/users/me` | Update user profile | Yes |
| GET | `/api/v1/users/me/preferences` | Get notification preferences | Yes |
| PUT | `/api/v1/users/me/preferences` | Update preferences | Yes |

---

### Request/Response Format

#### Add Package Request

```json
POST /api/v1/packages
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "trackingNumber": "1Z999AA10123456784",
  "note": "Gift for Mom's birthday"
}
```

#### Add Package Response (Success)

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "pkg_1234567890",
    "trackingNumber": "1Z999AA10123456784",
    "carrier": "UPS",
    "status": "in_transit",
    "estimatedDelivery": "2026-01-27",
    "note": "Gift for Mom's birthday",
    "createdAt": "2026-01-24T12:00:00Z",
    "updatedAt": "2026-01-24T12:00:00Z"
  }
}
```

#### Error Response

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "INVALID_TRACKING_NUMBER",
    "message": "Tracking number format is invalid",
    "details": "Tracking number must be 8-30 characters"
  }
}
```

---

### Authentication Flow

**Strategy**: JWT (JSON Web Token) with refresh tokens

#### Registration Flow

```
1. User submits email + password
   ↓
2. Server validates input (email format, password strength)
   ↓
3. Server checks if email already exists
   ↓
4. Server hashes password (bcrypt, 10 rounds)
   ↓
5. Server creates user record in database
   ↓
6. Server sends verification email (with token)
   ↓
7. User clicks verification link
   ↓
8. Server marks email as verified
   ↓
9. Server returns access token + refresh token
   ↓
10. Frontend stores tokens (localStorage/cookie)
```

#### Login Flow

```
1. User submits email + password
   ↓
2. Server finds user by email
   ↓
3. Server compares password hash (bcrypt.compare)
   ↓
4. If valid, server generates JWT access token (expires 7 days)
   ↓
5. Server generates refresh token (expires 30 days)
   ↓
6. Server returns tokens to client
   ↓
7. Frontend stores tokens (localStorage/cookie)
   ↓
8. Frontend includes access token in Authorization header
```

#### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_1234567890",
    "email": "user@example.com",
    "tier": "free",
    "iat": 1706112000,
    "exp": 1706716800
  },
  "signature": "..."
}
```

---

### Background Jobs

**Job Queue**: Bull (Redis-backed)  
**Scheduler**: Node-cron

#### Carrier Polling Job

**Frequency**: Every 2-4 hours  
**Purpose**: Fetch latest status updates from carrier APIs

```typescript
// jobs/carrier-poll.job.ts
import { Queue, Worker } from 'bullmq';
import { CarrierService } from '../modules/carriers/carriers.service';
import { PackageService } from '../modules/packages/packages.service';

const carrierPollQueue = new Queue('carrier-poll', {
  connection: redisConnection
});

// Add job to queue every 2 hours
cron.schedule('0 */2 * * *', async () => {
  const activePackages = await PackageService.getActivePackages();
  
  for (const pkg of activePackages) {
    await carrierPollQueue.add('poll-carrier', {
      packageId: pkg.id,
      trackingNumber: pkg.trackingNumber,
      carrier: pkg.carrier
    });
  }
});

// Worker to process jobs
const worker = new Worker('carrier-poll', async (job) => {
  const { packageId, trackingNumber, carrier } = job.data;
  
  // Call carrier API
  const status = await CarrierService.getStatus(carrier, trackingNumber);
  
  // Update package in database
  await PackageService.updateStatus(packageId, status);
  
  // If status changed, queue notification
  if (status.hasChanged) {
    await notificationQueue.add('send-notification', {
      packageId,
      status: status.current
    });
  }
}, {
  connection: redisConnection
});
```

#### Email Notification Job

**Trigger**: Status change detected  
**Purpose**: Send email alerts to users

```typescript
// jobs/email.job.ts
import { Queue, Worker } from 'bullmq';
import { EmailService } from '../modules/notifications/email.service';

const notificationQueue = new Queue('notifications', {
  connection: redisConnection
});

const worker = new Worker('notifications', async (job) => {
  const { packageId, status } = job.data;
  
  // Get package and user info
  const pkg = await PackageService.findById(packageId);
  const user = await UserService.findById(pkg.userId);
  
  // Check user notification preferences
  if (!user.preferences.emailAlerts) return;
  
  // Send email based on status
  if (status === 'out_for_delivery') {
    await EmailService.sendOutForDeliveryEmail(user.email, pkg);
  } else if (status === 'delivered') {
    await EmailService.sendDeliveredEmail(user.email, pkg);
  }
}, {
  connection: redisConnection
});
```

---

## Database Architecture

### Database: PostgreSQL 15

**Why PostgreSQL**:
- Reliable, ACID-compliant relational database
- Strong support for JSON data types (for flexible carrier responses)
- Excellent indexing and query performance
- Mature ecosystem and tooling

---

### Schema Design

#### Tables

**users**
- `id` (UUID, primary key)
- `email` (VARCHAR, unique, not null)
- `password_hash` (VARCHAR, not null)
- `email_verified` (BOOLEAN, default false)
- `tier` (ENUM: 'free', 'premium', default 'free')
- `created_at` (TIMESTAMP, not null)
- `updated_at` (TIMESTAMP, not null)

**packages**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users)
- `tracking_number` (VARCHAR, not null)
- `carrier` (VARCHAR, not null)
- `status` (ENUM: 'pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'exception')
- `estimated_delivery` (DATE, nullable)
- `note` (TEXT, nullable)
- `archived` (BOOLEAN, default false)
- `created_at` (TIMESTAMP, not null)
- `updated_at` (TIMESTAMP, not null)

**status_history**
- `id` (UUID, primary key)
- `package_id` (UUID, foreign key to packages)
- `status` (VARCHAR, not null)
- `message` (TEXT, nullable)
- `location` (VARCHAR, nullable)
- `timestamp` (TIMESTAMP, not null)
- `created_at` (TIMESTAMP, not null)

**notification_preferences**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users, unique)
- `email_alerts` (BOOLEAN, default true)
- `out_for_delivery_alert` (BOOLEAN, default true)
- `delivered_alert` (BOOLEAN, default true)
- `delay_alert` (BOOLEAN, default true)
- `created_at` (TIMESTAMP, not null)
- `updated_at` (TIMESTAMP, not null)

---

### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String   @id @default(uuid())
  email           String   @unique
  passwordHash    String   @map("password_hash")
  emailVerified   Boolean  @default(false) @map("email_verified")
  tier            Tier     @default(FREE)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  packages        Package[]
  preferences     NotificationPreferences?

  @@map("users")
}

enum Tier {
  FREE
  PREMIUM
}

model Package {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  trackingNumber     String   @map("tracking_number")
  carrier            String
  status             PackageStatus
  estimatedDelivery  DateTime? @map("estimated_delivery")
  note               String?
  archived           Boolean  @default(false)
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  statusHistory      StatusHistory[]

  @@index([userId])
  @@index([status])
  @@map("packages")
}

enum PackageStatus {
  PRE_TRANSIT
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  EXCEPTION
}

model StatusHistory {
  id         String   @id @default(uuid())
  packageId  String   @map("package_id")
  status     String
  message    String?
  location   String?
  timestamp  DateTime
  createdAt  DateTime @default(now()) @map("created_at")

  package    Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)

  @@index([packageId])
  @@index([timestamp])
  @@map("status_history")
}

model NotificationPreferences {
  id                    String   @id @default(uuid())
  userId                String   @unique @map("user_id")
  emailAlerts           Boolean  @default(true) @map("email_alerts")
  outForDeliveryAlert   Boolean  @default(true) @map("out_for_delivery_alert")
  deliveredAlert        Boolean  @default(true) @map("delivered_alert")
  delayAlert            Boolean  @default(true) @map("delay_alert")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notification_preferences")
}
```

---

### Database Indexes

**Performance Optimization**: Indexes on frequently queried fields

- `users.email` (unique index)
- `packages.user_id` (index for user package queries)
- `packages.status` (index for status filtering)
- `status_history.package_id` (index for history queries)
- `status_history.timestamp` (index for time-based queries)

---

### Data Retention Policy

**Active Packages**: Keep indefinitely (user-controlled)  
**Delivered Packages**: Keep for 90 days (free tier), unlimited (premium)  
**Status History**: Keep for 90 days (free tier), unlimited (premium)  
**Archived Packages**: Keep for 1 year  
**Deleted User Data**: Permanently delete within 30 days (GDPR compliance)

---

## Infrastructure Architecture

### Hosting Strategy

**Environment**: Multi-environment (Development, Staging, Production)  
**Approach**: Containerized deployment with Docker

---

### Infrastructure Components

#### Frontend Hosting
- **Platform**: Vercel or Netlify
- **CDN**: Cloudflare or AWS CloudFront
- **SSL**: Let's Encrypt (automatic renewal)

#### Backend Hosting
- **Platform**: DigitalOcean Droplet or AWS EC2
- **Container**: Docker + Docker Compose
- **Load Balancer**: Nginx (reverse proxy)

#### Database Hosting
- **Platform**: DigitalOcean Managed PostgreSQL or AWS RDS
- **Backups**: Daily automated backups (30-day retention)
- **Monitoring**: Database performance metrics

#### Redis Hosting
- **Platform**: Redis Cloud or DigitalOcean Managed Redis
- **Purpose**: Caching + job queue

---

### Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                          Internet                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │      Cloudflare CDN         │
                │   (SSL, DDoS Protection)    │
                └──────────────┬──────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
┌────────┴─────────┐                      ┌──────────┴────────┐
│   Vercel         │                      │  DigitalOcean     │
│  (Frontend)      │                      │  Droplet          │
│  - Next.js App   │                      │  (Backend)        │
│  - Static Assets │                      │  - Docker         │
│  - Edge Functions│                      │  - Nginx          │
└──────────────────┘                      │  - Express API    │
                                          │  - Background Jobs│
                                          └────────┬──────────┘
                                                   │
                              ┌────────────────────┴────────────────────┐
                              │                                         │
                    ┌─────────┴──────────┐              ┌──────────────┴──────────┐
                    │  PostgreSQL        │              │  Redis Cloud            │
                    │  (Managed DB)      │              │  (Cache + Job Queue)    │
                    │  - Primary DB      │              │  - API Cache            │
                    │  - Backups         │              │  - Session Store        │
                    └────────────────────┘              └─────────────────────────┘
```

---

### CI/CD Pipeline

**Platform**: GitHub Actions

#### Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: trackdeliveries/backend:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to DigitalOcean
        run: |
          ssh ${{ secrets.DO_HOST }} "cd /app && docker-compose pull && docker-compose up -d"
```

---

## Security Architecture

### Authentication Security

**Password Requirements**:
- Minimum 8 characters
- Must include uppercase, lowercase, number
- Hashed with bcrypt (10 rounds)

**JWT Tokens**:
- Access token expires in 7 days
- Refresh token expires in 30 days
- Tokens signed with HS256 algorithm
- Secret key stored in environment variables

**Session Management**:
- Token stored in httpOnly cookie (CSR) or localStorage (SPA)
- CSRF protection for cookie-based auth
- Logout invalidates tokens (blacklist in Redis)

---

### API Security

**Rate Limiting**:
- 100 requests/minute per user (authenticated)
- 20 requests/minute per IP (unauthenticated)
- Sliding window algorithm

**Input Validation**:
- All user input validated (Zod schemas)
- SQL injection prevention (parameterized queries via ORM)
- XSS protection (sanitize HTML input)

**HTTPS**:
- TLS 1.2+ enforced
- HSTS header (Strict-Transport-Security)
- Certificate auto-renewal (Let's Encrypt)

---

### Data Security

**Data Encryption**:
- **At Rest**: PostgreSQL encryption (if supported by provider)
- **In Transit**: HTTPS/TLS for all API calls

**PII Protection**:
- Email addresses encrypted in database (future)
- Tracking numbers NOT considered PII (public info)
- No storage of carrier credentials

**GDPR Compliance**:
- User data export (JSON download)
- User data deletion (hard delete after 30 days)
- Cookie consent banner
- Privacy policy and terms of service

---

## Integration Architecture

### Carrier API Integrations

#### USPS (United States Postal Service)

**API**: USPS Web Tools API  
**Authentication**: API Key (free for development)  
**Rate Limit**: 100 requests/minute  
**Endpoint**: `https://secure.shippingapis.com/ShippingAPI.dll`

**Request Example**:
```xml
POST https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=
<TrackRequest USERID="YOUR_USER_ID">
  <TrackID ID="9400111899223136512345"></TrackID>
</TrackRequest>
```

**Response Example**:
```xml
<TrackResponse>
  <TrackInfo ID="9400111899223136512345">
    <TrackSummary>
      Your item was delivered at 10:15 am on January 24, 2026 in ANYTOWN, NY 12345.
    </TrackSummary>
    <Status>Delivered</Status>
    <EstimatedDeliveryDate>January 24, 2026</EstimatedDeliveryDate>
  </TrackInfo>
</TrackResponse>
```

---

#### UPS (United Parcel Service)

**API**: UPS Tracking API  
**Authentication**: OAuth 2.0 client credentials  
**Rate Limit**: 250 requests/minute  
**Endpoint**: `https://onlinetools.ups.com/rest/Track`

**Request Example**:
```json
POST https://onlinetools.ups.com/rest/Track
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "TrackRequest": {
    "InquiryNumber": "1Z999AA10123456784"
  }
}
```

**Response Example**:
```json
{
  "TrackResponse": {
    "Shipment": {
      "InquiryNumber": {
        "Value": "1Z999AA10123456784"
      },
      "Package": {
        "Activity": {
          "Status": {
            "Description": "Delivered"
          },
          "Date": "20260124",
          "Time": "101500"
        }
      }
    }
  }
}
```

---

#### FedEx

**API**: FedEx Track API  
**Authentication**: OAuth 2.0 client credentials  
**Rate Limit**: 500 requests/minute  
**Endpoint**: `https://apis.fedex.com/track/v1/trackingnumbers`

**Request Example**:
```json
POST https://apis.fedex.com/track/v1/trackingnumbers
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "trackingInfo": [
    {
      "trackingNumberInfo": {
        "trackingNumber": "123456789012"
      }
    }
  ],
  "includeDetailedScans": true
}
```

---

### Email Service Integration

**Provider**: SendGrid  
**Authentication**: API Key  
**Rate Limit**: 100 emails/second (free tier)  
**Templates**: HTML + plain text fallback

**Email Types**:
1. **Welcome Email** (user registration)
2. **Email Verification** (confirm email address)
3. **Out for Delivery Alert** (package will arrive today)
4. **Delivered Alert** (package has been delivered)
5. **Delay Alert** (estimated delivery changed)
6. **Password Reset** (forgot password)

---

## Scalability & Performance

### Scalability Strategy

#### Horizontal Scaling
- **Frontend**: Serverless (Vercel) - auto-scales
- **Backend**: Multiple API servers behind load balancer
- **Database**: Read replicas for read-heavy queries
- **Redis**: Redis Cluster for distributed caching

#### Vertical Scaling
- **Database**: Increase CPU/RAM as data grows
- **Backend**: Larger droplet/instance size if needed

---

### Caching Strategy

**Cache Levels**:
1. **CDN Cache** (Cloudflare) - Static assets, landing page
2. **API Cache** (Redis) - Carrier API responses (15-minute TTL)
3. **Database Cache** (PostgreSQL) - Query result caching

**Cache Keys**:
- Carrier API: `carrier:{carrier}:{trackingNumber}` (15 minutes)
- User packages: `user:{userId}:packages` (1 minute)
- User preferences: `user:{userId}:preferences` (5 minutes)

---

### Performance Targets

**Frontend**:
- **Page Load**: < 2 seconds (3G network)
- **Lighthouse Score**: 90+ (mobile and desktop)
- **Bundle Size**: < 200 KB (gzipped)

**Backend**:
- **API Response Time**: < 500ms (95th percentile)
- **Database Queries**: < 100ms (95th percentile)
- **Background Jobs**: Process within 5 minutes

**Database**:
- **Query Performance**: < 100ms for simple queries
- **Connection Pooling**: 10-20 connections
- **Index Coverage**: 90%+ of queries use indexes

---

## Monitoring & Observability

### Monitoring Tools

**Error Tracking**: Sentry  
**Uptime Monitoring**: UptimeRobot or Pingdom  
**APM**: New Relic or Datadog (optional)  
**Logging**: Winston (structured JSON logs)

---

### Metrics to Track

**Application Metrics**:
- Total users (free vs premium)
- Active packages per user
- Carrier API success rate
- Email delivery rate
- User retention rate

**Technical Metrics**:
- API response times (p50, p95, p99)
- Database query times
- Background job completion rate
- Error rate (4xx, 5xx)
- Uptime percentage

**Business Metrics**:
- Free to premium conversion rate
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

---

### Logging Strategy

**Log Levels**: DEBUG, INFO, WARN, ERROR  
**Format**: Structured JSON logs  
**Storage**: Centralized logging (Papertrail, Loggly, or CloudWatch)

**Example Log Entry**:
```json
{
  "timestamp": "2026-01-24T12:00:00Z",
  "level": "info",
  "message": "Package status updated",
  "context": {
    "packageId": "pkg_1234567890",
    "userId": "user_9876543210",
    "oldStatus": "in_transit",
    "newStatus": "out_for_delivery",
    "carrier": "UPS"
  }
}
```

---

### Alerting

**Critical Alerts** (PagerDuty, Slack):
- API error rate > 5%
- Database connection failures
- Background job failures > 10%
- Uptime < 99%

**Warning Alerts** (Email, Slack):
- API response time > 1 second
- Carrier API failures > 20%
- Email delivery rate < 95%

---

## Deployment Architecture

### Environments

**Development**: Local development (Docker Compose)  
**Staging**: DigitalOcean droplet (mirrors production)  
**Production**: DigitalOcean droplet + Vercel

---

### Docker Setup

**Dockerfile (Backend)**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/trackdeliveries
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=trackdeliveries
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-24  
**Status**: Planning / Proposal

---

**Track Deliveries architecture is designed for scalability, security, and maintainability, with clear separation of concerns and robust infrastructure.**
