# Medical Records Manager - Architecture

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client Layer                                │
├─────────────────────────────────────────────────────────────────────┤
│  Web App (Next.js + React)           Mobile App (React Native)      │
│  - Responsive Design                  - iOS & Android (Phase 2)     │
│  - Progressive Web App                - Document Scanning           │
│  - Offline Capability (Phase 2)       - Push Notifications          │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway / CDN                            │
├─────────────────────────────────────────────────────────────────────┤
│  - CloudFront CDN for static assets                                 │
│  - API Gateway for load balancing                                   │
│  - TLS 1.3 termination                                              │
│  - Rate limiting and DDoS protection                                │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Application Layer (NestJS)                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Auth API   │  │  Records API  │  │ Reminders API│            │
│  │  (JWT/OAuth) │  │  (CRUD + S3)  │  │  (Scheduler) │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │Appointments  │  │ Medications   │  │  Sharing API │            │
│  │     API      │  │     API       │  │  (Temp Links)│            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
                │                  │                  │
                ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL     │  │   AWS S3 (Files) │  │  Redis (Cache)   │
│   (Structured    │  │   - Encrypted    │  │  - Sessions      │
│   Data Storage)  │  │   - Documents    │  │  - Job Queue     │
│   - Encrypted    │  │   - Versioning   │  │  - Rate Limiting │
└──────────────────┘  └──────────────────┘  └──────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Background Services                              │
├─────────────────────────────────────────────────────────────────────┤
│  - Email/SMS Notification Service (Bull Queue + Redis)              │
│  - Scheduled Reminder Service (Cron Jobs)                           │
│  - Document Processing Service (OCR - Phase 3)                      │
│  - Audit Logging Service (CloudWatch Logs)                          │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   External Services                                  │
├─────────────────────────────────────────────────────────────────────┤
│  - SendGrid (Email)           - AWS CloudWatch (Monitoring)         │
│  - Twilio (SMS - Phase 2)     - Sentry (Error Tracking)             │
│  - Stripe (Payments)          - Firebase (Push - Phase 2)           │
└─────────────────────────────────────────────────────────────────────┘
```

### System Components

#### Client Layer
- **Web Application**: Next.js 14 with React 18, TypeScript, Tailwind CSS
- **Mobile Application** (Phase 2): React Native with Expo for iOS and Android

#### API Layer
- **Backend Framework**: NestJS with TypeScript
- **API Type**: RESTful API with OpenAPI (Swagger) documentation
- **Authentication**: JWT tokens with refresh tokens, OAuth 2.0 (Google, Apple - Phase 2)

#### Data Layer
- **Primary Database**: PostgreSQL 16 with encryption at rest
- **File Storage**: AWS S3 with server-side encryption (AES-256)
- **Caching**: Redis for sessions, rate limiting, and job queues

#### Infrastructure
- **Cloud Provider**: AWS (EC2, RDS, S3, CloudFront, CloudWatch)
- **Containerization**: Docker with Docker Compose (MVP), Kubernetes (Phase 3)
- **CI/CD**: GitHub Actions for automated testing and deployment

## Frontend Architecture

### Web Application (Next.js + React)

#### Technology Stack
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **State Management**: 
  - React Query for server state (data fetching, caching)
  - React Context API for client state (theme, user preferences)
- **Routing**: Next.js App Router with dynamic routes
- **Build Tool**: Turbopack (Next.js default)

#### Component Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth pages (login, register, forgot-password)
│   ├── (dashboard)/              # Protected dashboard pages
│   │   ├── records/              # Medical records pages
│   │   ├── appointments/         # Appointments pages
│   │   ├── medications/          # Medications pages (Phase 2)
│   │   ├── profile/              # User profile pages
│   │   └── settings/             # Settings pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (Button, Input, Card, etc.)
│   ├── layout/                   # Layout components (Header, Sidebar, Footer)
│   ├── forms/                    # Form components
│   ├── records/                  # Medical records components
│   ├── appointments/             # Appointment components
│   └── shared/                   # Shared components
├── lib/                          # Utility libraries
│   ├── api/                      # API client and hooks
│   ├── auth/                     # Authentication utilities
│   ├── validation/               # Zod schemas
│   └── utils/                    # Helper functions
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
└── styles/                       # Global styles and Tailwind config
```

#### State Management Strategy

**Server State (React Query)**:
- API data fetching and caching
- Automatic background refetching
- Optimistic updates for better UX
- Query invalidation on mutations

```typescript
// Example: Fetching medical records
const { data: records, isLoading } = useQuery({
  queryKey: ['records', userId],
  queryFn: () => api.records.getAll(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Client State (Context API)**:
- User authentication state
- UI preferences (theme, language)
- Transient UI state (modals, toasts)

```typescript
// Example: Auth context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Auth logic...
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Routing Structure

**Public Routes**:
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset page

**Protected Routes** (require authentication):
- `/dashboard` - Main dashboard
- `/records` - Medical records vault
- `/records/[id]` - Individual record view
- `/appointments` - Appointments list
- `/appointments/[id]` - Individual appointment view
- `/medications` - Medications list (Phase 2)
- `/profile` - User profile
- `/settings` - Account settings

#### Performance Optimizations

1. **Code Splitting**: 
   - Automatic code splitting with Next.js dynamic imports
   - Lazy load heavy components (document viewer, PDF renderer)

2. **Image Optimization**:
   - Next.js Image component for automatic optimization
   - WebP format with fallback to JPEG/PNG
   - Responsive images with srcset

3. **Caching**:
   - React Query for API response caching
   - Service Worker for offline capability (Phase 2)
   - CDN caching for static assets (CloudFront)

4. **Bundle Size**:
   - Tree-shaking with Webpack/Turbopack
   - Remove unused Tailwind classes in production
   - Optimize dependencies (e.g., lodash-es instead of lodash)

### Mobile Application (React Native) - Phase 2

#### Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Query + Context API (same as web)
- **Forms**: React Hook Form with Zod validation (same as web)
- **Storage**: Expo SecureStore for sensitive data, AsyncStorage for non-sensitive

#### Key Mobile Features
- **Document Scanning**: Expo Camera for scanning documents
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Biometric Authentication**: Expo Local Authentication (Face ID, Touch ID)
- **Offline Access**: SQLite for offline data storage
- **File Upload**: Expo File System for document uploads

## Backend Architecture

### Application Framework (NestJS)

#### Technology Stack
- **Framework**: NestJS with TypeScript
- **API Type**: RESTful API with OpenAPI/Swagger documentation
- **Validation**: class-validator and class-transformer
- **ORM**: TypeORM for PostgreSQL
- **Authentication**: Passport.js with JWT strategy
- **File Upload**: Multer for multipart/form-data
- **Background Jobs**: Bull queue with Redis

#### Module Structure

```
src/
├── app.module.ts                 # Root application module
├── main.ts                       # Application entry point
├── config/                       # Configuration files
│   ├── database.config.ts        # Database configuration
│   ├── auth.config.ts            # JWT configuration
│   └── aws.config.ts             # AWS S3 configuration
├── modules/                      # Feature modules
│   ├── auth/                     # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── guards/
│   ├── users/                    # User management module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── entities/user.entity.ts
│   ├── records/                  # Medical records module
│   │   ├── records.module.ts
│   │   ├── records.controller.ts
│   │   ├── records.service.ts
│   │   ├── entities/record.entity.ts
│   │   └── dto/
│   ├── appointments/             # Appointments module
│   │   ├── appointments.module.ts
│   │   ├── appointments.controller.ts
│   │   ├── appointments.service.ts
│   │   └── entities/appointment.entity.ts
│   ├── notifications/            # Notification module
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts
│   │   ├── email.service.ts
│   │   └── sms.service.ts (Phase 2)
│   ├── sharing/                  # Secure sharing module (Phase 2)
│   │   ├── sharing.module.ts
│   │   ├── sharing.controller.ts
│   │   ├── sharing.service.ts
│   │   └── entities/share-link.entity.ts
│   └── storage/                  # File storage module
│       ├── storage.module.ts
│       ├── storage.service.ts
│       └── s3.service.ts
├── common/                       # Shared utilities
│   ├── decorators/               # Custom decorators
│   ├── guards/                   # Auth guards
│   ├── interceptors/             # Request/response interceptors
│   ├── pipes/                    # Validation pipes
│   ├── filters/                  # Exception filters
│   └── middleware/               # Custom middleware
├── database/                     # Database files
│   ├── migrations/               # TypeORM migrations
│   └── seeds/                    # Database seeds (dev/test)
└── types/                        # TypeScript types
```

#### API Endpoints

**Authentication** (`/api/auth`):
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

**Users** (`/api/users`):
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `DELETE /users/me` - Delete current user account
- `GET /users/me/emergency-info` - Get emergency information
- `PUT /users/me/emergency-info` - Update emergency information

**Medical Records** (`/api/records`):
- `GET /records` - List all records for current user
- `GET /records/:id` - Get specific record
- `POST /records` - Upload new medical record
- `PUT /records/:id` - Update record metadata
- `DELETE /records/:id` - Delete record
- `GET /records/search` - Search records by criteria

**Appointments** (`/api/appointments`):
- `GET /appointments` - List all appointments
- `GET /appointments/:id` - Get specific appointment
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment
- `GET /appointments/upcoming` - Get upcoming appointments

**Notifications** (Internal API):
- Background service for sending email/SMS notifications
- No direct API endpoints (triggered by events)

**Sharing** (`/api/sharing` - Phase 2):
- `POST /sharing/links` - Create temporary share link
- `GET /sharing/links` - List all share links
- `GET /sharing/links/:id` - Get share link details
- `DELETE /sharing/links/:id` - Revoke share link
- `GET /sharing/access/:token` - Access shared records (public endpoint)

#### Request/Response Flow

```
Client Request
     │
     ▼
[HTTPS/TLS 1.3]
     │
     ▼
[NestJS Middleware]
  - CORS
  - Rate Limiting
  - Request Logging
     │
     ▼
[Authentication Guard]
  - Validate JWT token
  - Extract user from token
     │
     ▼
[Route Handler (Controller)]
  - Parse request
  - Validate DTO (class-validator)
     │
     ▼
[Business Logic (Service)]
  - Process request
  - Database operations
  - S3 operations
     │
     ▼
[Response Interceptor]
  - Transform response
  - Add metadata
     │
     ▼
[HTTPS/TLS 1.3]
     │
     ▼
Client Response
```

## Security Architecture

### Authentication Flow

#### Registration & Login

```
User Registration:
1. User submits email + password
2. Server validates email format and password strength (min 12 chars, upper/lower/number/special)
3. Server hashes password with bcrypt (cost factor: 12)
4. Server creates user record in database
5. Server sends verification email (Phase 2)
6. Server returns JWT access token + refresh token

User Login:
1. User submits email + password
2. Server retrieves user by email
3. Server compares password with bcrypt hash
4. Server generates JWT access token (15 min expiry) + refresh token (30 day expiry)
5. Server returns tokens to client
6. Client stores access token in memory, refresh token in httpOnly cookie
```

#### JWT Token Structure

```typescript
interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  role: 'user' | 'admin'; // User role (future: family member roles)
  iat: number;           // Issued at timestamp
  exp: number;           // Expiration timestamp
}
```

**Access Token**:
- Expiry: 15 minutes
- Storage: Client memory (not localStorage to prevent XSS)
- Purpose: API authentication

**Refresh Token**:
- Expiry: 30 days
- Storage: httpOnly cookie (prevents XSS attacks)
- Purpose: Generate new access token without re-login

#### Token Refresh Flow

```
1. Client makes API request with expired access token
2. Server returns 401 Unauthorized
3. Client sends refresh token to /auth/refresh endpoint
4. Server validates refresh token
5. Server generates new access token
6. Server returns new access token to client
7. Client retries original request with new access token
```

### Authorization Model

#### Role-Based Access Control (RBAC)

**MVP Roles**:
- `user`: Standard user with access to their own data
- `admin`: System administrator with elevated privileges (staff only)

**Phase 2 Roles** (Family Profile Management):
- `account_owner`: Primary account holder (full access)
- `family_admin`: Can manage family profiles (read/write)
- `family_member`: Read-only access to shared family data
- `caregiver`: Read/write access to specific family member profiles

#### Authorization Rules

```typescript
// Example: Authorization guard for medical records
@UseGuards(JwtAuthGuard, RecordOwnershipGuard)
@Get('records/:id')
async getRecord(@Param('id') id: string, @CurrentUser() user: User) {
  // RecordOwnershipGuard ensures user owns the record
  return this.recordsService.findOne(id);
}
```

**Ownership Rules**:
- Users can only access their own data (users, records, appointments, medications)
- Admin users can access all data (for support purposes only, with audit logging)
- Shared records (Phase 2) can be accessed via temporary share link with expiration

### Data Encryption

#### Encryption at Rest

**Database Encryption**:
- **Method**: AWS RDS encryption with AES-256
- **Key Management**: AWS Key Management Service (KMS)
- **Encrypted Fields**: 
  - User passwords (bcrypt hash, cost factor 12)
  - Emergency contact information
  - Sensitive medical information (allergies, medications)
- **Backup Encryption**: Automated RDS backups encrypted with same key

**File Storage Encryption** (AWS S3):
- **Method**: Server-side encryption (SSE-S3) with AES-256
- **Key Management**: AWS-managed keys (SSE-S3) for MVP, customer-managed keys (SSE-KMS) for Phase 2
- **Bucket Policy**: Enforce encryption for all uploads (deny unencrypted uploads)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::medical-records-bucket/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": "AES256"
        }
      }
    }
  ]
}
```

#### Encryption in Transit

**HTTPS/TLS Configuration**:
- **Protocol**: TLS 1.3 (TLS 1.2 as fallback)
- **Certificate**: AWS Certificate Manager (ACM) with auto-renewal
- **Cipher Suites**: Strong ciphers only (AES-GCM, ChaCha20-Poly1305)
- **HSTS**: Enabled with max-age=31536000 (1 year)

```
HTTP Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**API Security Headers**:
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Audit Logging

#### HIPAA-Compliant Audit Trail

**Logged Events**:
- User authentication (login, logout, password reset)
- Record access (view, download, upload, delete)
- Record sharing (create share link, access shared record, revoke link)
- Profile changes (emergency info update, medication changes)
- Admin actions (any admin access to user data)

**Audit Log Structure**:
```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: AuditAction; // LOGIN, RECORD_VIEW, RECORD_DOWNLOAD, etc.
  resourceType: string; // 'record', 'appointment', 'user', etc.
  resourceId: string | null;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  metadata: Record<string, any>; // Additional context
}
```

**Audit Log Storage**:
- **Service**: AWS CloudWatch Logs
- **Retention**: 7 years (HIPAA requirement)
- **Access**: Restricted to admin users only
- **Immutability**: Logs cannot be modified or deleted (CloudWatch Logs protection)

**Example Audit Log Entry**:
```json
{
  "id": "log_12345",
  "timestamp": "2026-01-24T10:30:00Z",
  "userId": "user_abc123",
  "userEmail": "john@example.com",
  "action": "RECORD_VIEW",
  "resourceType": "record",
  "resourceId": "record_xyz789",
  "ipAddress": "192.0.2.1",
  "userAgent": "Mozilla/5.0...",
  "result": "success",
  "metadata": {
    "recordType": "lab_result",
    "recordName": "Blood Test Results 2025-12-15"
  }
}
```

## Data Architecture

### Database Schema (PostgreSQL)

#### Entity Relationship Diagram

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│    Users    │          │   Records   │          │Appointments │
├─────────────┤          ├─────────────┤          ├─────────────┤
│ id (PK)     │──────┐   │ id (PK)     │          │ id (PK)     │
│ email       │      │   │ user_id(FK) │◄─────┐   │ user_id(FK) │◄───┐
│ password    │      │   │ title       │      │   │ date_time   │    │
│ firstName   │      │   │ description │      │   │ provider    │    │
│ lastName    │      └──►│ category    │      │   │ location    │    │
│ dateOfBirth │          │ provider    │      │   │ notes       │    │
│ phone       │          │ uploadedAt  │      │   │ status      │    │
│ address     │          │ fileUrl     │      │   │ createdAt   │    │
│ emergencyInfo          │ fileSize    │      └───┤ updatedAt   │    │
│ allergies   │          │ mimeType    │          └─────────────┘    │
│ medications │          │ createdAt   │                             │
│ role        │          │ updatedAt   │                             │
│ createdAt   │          └─────────────┘                             │
│ updatedAt   │                                                      │
└─────────────┘          ┌─────────────┐                             │
      │                  │ShareLinks   │                             │
      │                  │(Phase 2)    │                             │
      │                  ├─────────────┤                             │
      │                  │ id (PK)     │                             │
      │                  │ user_id(FK) │◄────────────────────────────┘
      │                  │ record_id   │
      │                  │ token       │
      │                  │ expiresAt   │
      │                  │ createdAt   │
      │                  └─────────────┘
      │
      │                  ┌─────────────┐
      └─────────────────►│FamilyProfiles
                         │(Phase 2)    │
                         ├─────────────┤
                         │ id (PK)     │
                         │ account_id  │
                         │ name        │
                         │ dateOfBirth │
                         │ relationship│
                         │ createdAt   │
                         └─────────────┘
```

#### Schema Definitions

**Users Table**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- bcrypt hash
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  phone VARCHAR(20),
  address TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(100),
  allergies TEXT[], -- Array of allergy strings
  current_medications TEXT[], -- Array of medication strings
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' or 'admin'
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Records Table**:
```sql
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'lab_result', 'imaging', 'prescription', 'vaccination', 'insurance', 'other'
  provider VARCHAR(255),
  document_date DATE,
  file_url TEXT NOT NULL, -- S3 object URL
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL, -- Size in bytes
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_records_user_id ON records(user_id);
CREATE INDEX idx_records_category ON records(category);
CREATE INDEX idx_records_document_date ON records(document_date);
CREATE INDEX idx_records_uploaded_at ON records(uploaded_at);
```

**Appointments Table**:
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_time TIMESTAMP NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  provider_specialty VARCHAR(255),
  provider_phone VARCHAR(20),
  location TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date_time ON appointments(date_time);
CREATE INDEX idx_appointments_status ON appointments(status);
```

**Audit Logs Table**:
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  result VARCHAR(20) NOT NULL, -- 'success' or 'failure'
  metadata JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
```

**Share Links Table** (Phase 2):
```sql
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  access_count INTEGER DEFAULT 0,
  max_accesses INTEGER, -- Optional limit on access count
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_user_id ON share_links(user_id);
CREATE INDEX idx_share_links_expires_at ON share_links(expires_at);
```

### Data Models (TypeORM Entities)

**User Entity**:
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // bcrypt hash

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true, name: 'emergency_contact_name' })
  emergencyContactName: string;

  @Column({ nullable: true, name: 'emergency_contact_phone' })
  emergencyContactPhone: string;

  @Column({ nullable: true, name: 'emergency_contact_relationship' })
  emergencyContactRelationship: string;

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  allergies: string[];

  @Column({ type: 'text', array: true, nullable: true, default: [], name: 'current_medications' })
  currentMedications: string[];

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  @OneToMany(() => Record, record => record.user)
  records: Record[];

  @OneToMany(() => Appointment, appointment => appointment.user)
  appointments: Appointment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**Record Entity**:
```typescript
@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  category: 'lab_result' | 'imaging' | 'prescription' | 'vaccination' | 'insurance' | 'other';

  @Column({ nullable: true })
  provider: string;

  @Column({ type: 'date', nullable: true, name: 'document_date' })
  documentDate: Date;

  @Column({ name: 'file_url' })
  fileUrl: string; // S3 URL

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### File Storage Architecture (AWS S3)

#### S3 Bucket Structure

```
medical-records-bucket/
├── users/
│   └── {user_id}/
│       ├── records/
│       │   └── {record_id}/
│       │       └── {filename}.{ext}
│       └── avatars/
│           └── profile.{ext}
└── temp/
    └── {upload_id}/
        └── {filename}.{ext}  (deleted after 24 hours)
```

#### S3 Configuration

**Bucket Policy**:
- **Public Access**: Blocked (all objects private)
- **Encryption**: Server-side encryption (SSE-S3) with AES-256
- **Versioning**: Enabled (for accidental deletion recovery)
- **Lifecycle**: Transition to Glacier after 1 year (cost optimization)
- **CORS**: Configured for web/mobile app uploads

**IAM Policy for Application**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::medical-records-bucket/users/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::medical-records-bucket"
    }
  ]
}
```

#### File Upload Flow

```
1. Client requests pre-signed upload URL from API
   POST /api/storage/presigned-url
   Body: { fileName, fileSize, mimeType, recordId }

2. API generates pre-signed URL (15 min expiry)
   - Validates file size (max 50 MB)
   - Validates MIME type (PDF, JPEG, PNG, HEIC)
   - Generates S3 key: users/{userId}/records/{recordId}/{filename}
   - Returns pre-signed URL to client

3. Client uploads file directly to S3 using pre-signed URL
   PUT https://medical-records-bucket.s3.amazonaws.com/...
   - Bypass server for large file uploads
   - Reduces server load

4. Client notifies API of successful upload
   POST /api/records/:id/confirm-upload
   - API updates record with file URL
   - API triggers audit log entry

5. API returns record metadata to client
```

## Integration Architecture

### Third-Party Services

#### SendGrid (Email Notifications)

**Purpose**: Transactional emails for reminders, password resets, account notifications

**Integration**:
- **API**: SendGrid REST API v3
- **Email Types**:
  - Appointment reminders (24 hours before)
  - Medication reminders (daily, for Phase 2)
  - Password reset emails
  - Account verification emails (Phase 2)
  - Premium subscription receipts

**Email Templates**:
```
- `appointment-reminder`: Appointment details with date, time, provider
- `password-reset`: Password reset link with 1-hour expiry
- `account-verification`: Email verification link (Phase 2)
- `subscription-receipt`: Payment confirmation and receipt
```

**Configuration**:
```typescript
// sendgrid.service.ts
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendAppointmentReminder(appointment: Appointment, user: User) {
    const msg = {
      to: user.email,
      from: 'noreply@medicalrecordsmanager.com',
      templateId: 'd-appointment-reminder-template-id',
      dynamicTemplateData: {
        firstName: user.firstName,
        appointmentDate: appointment.dateTime.toLocaleDateString(),
        appointmentTime: appointment.dateTime.toLocaleTimeString(),
        providerName: appointment.providerName,
        location: appointment.location,
      },
    };
    await SendGrid.send(msg);
  }
}
```

#### Twilio (SMS Notifications) - Phase 2

**Purpose**: SMS reminders for appointments and medications

**Integration**:
- **API**: Twilio REST API
- **SMS Types**:
  - Appointment reminders
  - Medication reminders

**Configuration**:
```typescript
// twilio.service.ts
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.client = Twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN')
    );
  }

  async sendSMS(to: string, body: string) {
    await this.client.messages.create({
      to,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      body,
    });
  }
}
```

#### Stripe (Payment Processing)

**Purpose**: Subscription billing for premium tiers

**Integration**:
- **API**: Stripe API v2023-08-16
- **Features**:
  - Subscription creation and management
  - Payment method storage
  - Invoice generation
  - Webhook handling for payment events

**Subscription Products**:
- **Pro**: $9.99/month or $99/year
- **Premium**: $19.99/month or $199/year

**Webhook Events**:
- `checkout.session.completed`: User subscribed
- `invoice.payment_succeeded`: Successful payment
- `invoice.payment_failed`: Failed payment (retry/notify)
- `customer.subscription.deleted`: Subscription cancelled

#### Firebase Cloud Messaging (Push Notifications) - Phase 2

**Purpose**: Mobile push notifications for appointments, medications, and updates

**Integration**:
- **Service**: Firebase Cloud Messaging (FCM)
- **Platforms**: iOS and Android (React Native)
- **Notification Types**:
  - Appointment reminders
  - Medication reminders
  - Shared record access notifications

## Infrastructure Architecture

### AWS Infrastructure

#### Production Environment

**Compute**:
- **EC2**: t3.medium instances (2 vCPU, 4 GB RAM) with Auto Scaling (min 2, max 10)
- **Load Balancer**: Application Load Balancer (ALB) with health checks
- **Auto Scaling**: Target tracking based on CPU utilization (70% threshold)

**Database**:
- **RDS PostgreSQL**: db.t3.medium instance (2 vCPU, 4 GB RAM)
- **Multi-AZ**: Enabled for high availability
- **Automated Backups**: Daily backups with 30-day retention
- **Encryption**: Enabled with AWS KMS

**Storage**:
- **S3**: Standard storage class with lifecycle transition to Glacier (1 year)
- **CloudFront**: CDN for static assets (Next.js, images, CSS)

**Caching**:
- **ElastiCache Redis**: cache.t3.micro instance (1 GB RAM)
- **Purpose**: Session storage, rate limiting, Bull queue

**Monitoring & Logging**:
- **CloudWatch**: Metrics, logs, and alarms
- **Sentry**: Error tracking and performance monitoring
- **CloudWatch Alarms**: CPU > 80%, memory > 80%, disk > 80%

#### Development/Staging Environment

- **EC2**: t3.small instances (1 vCPU, 2 GB RAM)
- **RDS PostgreSQL**: db.t3.micro instance (1 vCPU, 1 GB RAM)
- **ElastiCache Redis**: cache.t3.micro instance
- **S3**: Separate bucket for dev/staging files

### Deployment Pipeline (CI/CD)

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
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
      - run: npm run test:unit
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: ghcr.io/org/medical-records-manager:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS ECS
        run: |
          # Update ECS service with new Docker image
          aws ecs update-service --cluster prod-cluster --service api-service --force-new-deployment
```

### Scalability Strategy

#### Horizontal Scaling

**Application Tier**:
- Auto Scaling Group with target tracking policy
- Scale out when CPU > 70% or memory > 70%
- Scale in when CPU < 30% for 10 minutes
- Min instances: 2, Max instances: 10

**Database Tier**:
- Read replicas for read-heavy operations (Phase 3)
- Connection pooling to reduce database load

**Storage Tier**:
- S3 automatically scales (no limits)
- CloudFront CDN for global content delivery

#### Vertical Scaling

**Application Tier**:
- Start with t3.medium (2 vCPU, 4 GB RAM)
- Scale to t3.large (2 vCPU, 8 GB RAM) when sustained high load
- Scale to c5.large (2 vCPU, 4 GB RAM, compute-optimized) for CPU-intensive workloads

**Database Tier**:
- Start with db.t3.medium (2 vCPU, 4 GB RAM)
- Scale to db.r5.large (2 vCPU, 16 GB RAM, memory-optimized) when memory pressure

### Disaster Recovery Strategy

#### Backup Strategy

**Database Backups**:
- Automated daily backups (30-day retention)
- Manual snapshots before major changes
- Cross-region backup replication (Phase 3)
- Point-in-time recovery (PITR) enabled

**File Storage Backups**:
- S3 versioning enabled (recover deleted files)
- S3 lifecycle policy: Transition to Glacier after 1 year
- Cross-region replication for critical data (Phase 3)

**Application Code Backups**:
- Git version control (GitHub)
- Docker images stored in GitHub Container Registry
- Infrastructure as Code (Terraform) stored in Git

#### Recovery Objectives

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour (based on backup frequency)

#### Disaster Recovery Plan

1. **Database Failure**:
   - Failover to Multi-AZ standby (automatic, < 2 minutes)
   - If standby fails, restore from latest backup (30-60 minutes)

2. **Application Failure**:
   - Auto Scaling automatically replaces unhealthy instances
   - If entire deployment fails, rollback to previous Docker image (10 minutes)

3. **Region Failure** (Phase 3):
   - Failover to secondary AWS region
   - DNS update to point to secondary region
   - RTO: 4 hours, RPO: 1 hour

---

**This architecture document provides a comprehensive technical overview of the Medical Records Manager system, covering frontend, backend, security, data storage, integrations, and infrastructure. It serves as a foundation for implementation and future enhancements.**
