# Vehicle Maintenance Tracker - Architecture

**Last Updated**: 2026-01-21  
**Architecture Lead**: Marcus Johnson  
**Contributors**: Samuel Rodriguez (Backend), Thomas Anderson (Frontend), Benjamin Lee (Database)

## System Overview

Vehicle Maintenance Tracker is a full-stack web application with future mobile support, designed using modern cloud-native architecture principles.

### High-Level Architecture

```
┌─────────────────┐
│                 │
│  Next.js        │  Frontend (Vercel)
│  Frontend       │  - Server-side rendering
│  (TypeScript)   │  - Static generation
│                 │  - API routes
└────────┬────────┘
         │
         │ HTTPS/REST
         │
┌────────┴────────┐
│                 │
│  Express API    │  Backend (Railway/DO)
│  (Node.js)      │  - Business logic
│  (TypeScript)   │  - Authentication
│                 │  - Data validation
└────────┬────────┘
         │
         │ SQL
         │
┌────────┴────────┐
│                 │
│  PostgreSQL     │  Database
│  Database       │  - User data
│                 │  - Vehicle data
│                 │  - Service history
└─────────────────┘

External Services:
- SendGrid (Email)
- AWS S3/Cloudflare R2 (Storage)
- Sentry (Error tracking)
```

### System Components

1. **Frontend Layer** (Next.js)
   - User interface
   - Client-side routing
   - Server-side rendering
   - API routes for BFF pattern

2. **Backend Layer** (Express)
   - RESTful API
   - Business logic
   - Authentication/Authorization
   - Data validation

3. **Data Layer** (PostgreSQL)
   - Relational database
   - ACID compliance
   - Data persistence

4. **External Services**
   - **SendGrid**: Email reminders
   - **AWS S3**: Document storage (Phase 2+)
   - **Sentry**: Error monitoring
   - **Vercel Analytics**: Usage analytics

### Data Flow

1. **User Action** → Frontend (Next.js)
2. **Frontend** → Backend API (Express)
3. **Backend** → Database (PostgreSQL)
4. **Database** → Backend → Frontend → User

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + hooks (simple state), Zustand (complex state if needed)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API (built-in)
- **UI Components**: Headless UI + custom components

### Component Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/       # Dashboard group
│   │   ├── page.tsx       # Dashboard home
│   │   ├── vehicles/      # Vehicles pages
│   │   ├── maintenance/   # Maintenance pages
│   │   └── history/       # History pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── features/         # Feature-specific
├── lib/                   # Utilities
│   ├── api/              # API client
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Helper functions
│   └── validation/       # Zod schemas
└── types/                 # TypeScript types
```

### State Management

**Local State** (useState, useReducer):
- Form inputs
- UI state (modals, dropdowns)
- Component-specific state

**Global State** (React Context):
- User authentication state
- Active vehicle selection
- Theme preferences

**Server State** (No external library for MVP):
- Fetch on component mount
- Optimistic updates for mutations
- Phase 2+: Consider React Query if needed

### Routing

Using Next.js App Router (Server Components):
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Main dashboard
- `/dashboard/vehicles` - Vehicles list
- `/dashboard/vehicles/[id]` - Vehicle details
- `/dashboard/vehicles/[id]/maintenance` - Maintenance schedule
- `/dashboard/vehicles/[id]/history` - Service history

## Backend Architecture

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest + Supertest

### API Structure

```
backend/
├── src/
│   ├── routes/           # API routes
│   │   ├── auth.ts      # Auth endpoints
│   │   ├── vehicles.ts  # Vehicle endpoints
│   │   ├── maintenance.ts  # Maintenance endpoints
│   │   └── history.ts   # History endpoints
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Prisma client
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts      # Auth middleware
│   │   ├── validation.ts  # Request validation
│   │   └── error.ts     # Error handling
│   ├── utils/            # Utilities
│   ├── config/           # Configuration
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
└── tests/                # Tests
```

### API Design Principles

1. **RESTful** - Resource-based URLs, HTTP methods
2. **Stateless** - No server-side session state
3. **JSON** - JSON request/response bodies
4. **Versioning** - `/api/v1/` prefix for future compatibility
5. **Error Handling** - Consistent error response format

### Authentication Flow

1. **Signup/Login** → Backend generates JWT
2. **Client** stores JWT in httpOnly cookie
3. **Subsequent requests** → JWT in cookie header
4. **Backend** validates JWT on protected routes
5. **Token Refresh** → Automatic refresh before expiration

### Business Logic Layer

**Services** (business logic):
- `AuthService` - User authentication
- `VehicleService` - Vehicle CRUD operations
- `MaintenanceService` - Maintenance scheduling logic
- `HistoryService` - Service history management
- `ReminderService` - Reminder scheduling (Phase 1: email, Phase 3: push)

**Controllers** (request/response):
- Parse request
- Call service
- Return response

## Database Architecture

### Technology

- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Hosting**: Railway or Supabase

### Database Schema (Simplified)

```sql
-- Users
Table users {
  id: uuid PRIMARY KEY
  email: varchar(255) UNIQUE NOT NULL
  password_hash: varchar(255) NOT NULL
  name: varchar(255)
  created_at: timestamp
  updated_at: timestamp
}

-- Vehicles
Table vehicles {
  id: uuid PRIMARY KEY
  user_id: uuid FOREIGN KEY → users.id
  make: varchar(100) NOT NULL
  model: varchar(100) NOT NULL
  year: integer NOT NULL
  vin: varchar(17) UNIQUE
  license_plate: varchar(20)
  purchase_date: date
  current_mileage: integer
  created_at: timestamp
  updated_at: timestamp
}

-- Maintenance Schedules
Table maintenance_schedules {
  id: uuid PRIMARY KEY
  vehicle_id: uuid FOREIGN KEY → vehicles.id
  task_name: varchar(255) NOT NULL  (e.g., "Oil Change")
  interval_months: integer           (e.g., 3 for every 3 months)
  interval_miles: integer            (e.g., 3000 for every 3K miles)
  last_completed_date: date
  last_completed_mileage: integer
  next_due_date: date                (calculated)
  next_due_mileage: integer          (calculated)
  is_active: boolean DEFAULT true
  created_at: timestamp
  updated_at: timestamp
}

-- Service History
Table service_history {
  id: uuid PRIMARY KEY
  vehicle_id: uuid FOREIGN KEY → vehicles.id
  maintenance_schedule_id: uuid FOREIGN KEY → maintenance_schedules.id (nullable)
  service_date: date NOT NULL
  service_mileage: integer NOT NULL
  service_type: varchar(255) NOT NULL  (e.g., "Oil Change", "Tire Rotation")
  description: text
  cost: decimal(10,2)
  shop_name: varchar(255)
  invoice_url: varchar(500)           (Phase 2+)
  notes: text
  created_at: timestamp
  updated_at: timestamp
}

-- Reminders (for tracking sent reminders)
Table reminders {
  id: uuid PRIMARY KEY
  maintenance_schedule_id: uuid FOREIGN KEY → maintenance_schedules.id
  reminder_date: date NOT NULL
  reminder_type: enum('email', 'push')  (MVP: email only)
  sent_at: timestamp
  status: enum('pending', 'sent', 'failed')
  created_at: timestamp
}
```

[See detailed schema in technical/database-schema.md]

### Data Relationships

- **One User → Many Vehicles**
- **One Vehicle → Many Maintenance Schedules**
- **One Vehicle → Many Service History Entries**
- **One Maintenance Schedule → Many Service History Entries** (optional link)
- **One Maintenance Schedule → Many Reminders**

### Indexing Strategy

**Primary Indexes**:
- `users.email` (unique)
- `vehicles.user_id` (foreign key)
- `vehicles.vin` (unique)
- `maintenance_schedules.vehicle_id` (foreign key)
- `service_history.vehicle_id` (foreign key)

**Query Optimization**:
- Index `maintenance_schedules.next_due_date` for reminder queries
- Index `service_history.service_date` for history queries
- Composite index on `(user_id, created_at)` for user-specific queries

## Infrastructure

### Hosting & Deployment

**Frontend** (Vercel):
- Automatic deployments from GitHub
- Preview deployments for PRs
- Edge functions for API routes
- CDN for static assets

**Backend** (Railway or DigitalOcean):
- Containerized deployment (Docker)
- Automatic deployments from GitHub
- Environment variable management
- Horizontal scaling (Phase 3+)

**Database** (Railway or Supabase):
- Managed PostgreSQL
- Automated backups (daily)
- Point-in-time recovery
- Connection pooling

### CI/CD Pipeline

**GitHub Actions Workflow**:

1. **On Pull Request**:
   - Run linter (ESLint)
   - Run type checker (TypeScript)
   - Run tests (Jest)
   - Build check

2. **On Merge to Main**:
   - Run linter, type checker, tests
   - Build production bundles
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - Run smoke tests

3. **On Release Tag**:
   - Create release notes
   - Deploy to production
   - Notify team (Slack/Discord)

### Monitoring & Logging

**Error Monitoring** (Sentry):
- Frontend errors
- Backend errors
- Performance monitoring

**Logging** (Winston + Cloud Logging):
- Application logs
- API request logs
- Error logs
- Audit logs (user actions)

**Analytics** (Vercel Analytics + Plausible):
- Page views
- User flows
- Performance metrics
- Privacy-friendly (no cookies)

### Scaling Strategy

**Phase 1-2 (MVP)**: Vertical scaling (bigger server)
**Phase 3**: Horizontal scaling
- Load balancer
- Multiple backend instances
- Database read replicas
- CDN for static assets

## Security Architecture

### Authentication & Authorization

**Authentication**:
- JWT tokens (httpOnly cookies)
- Token expiration: 7 days
- Refresh token rotation
- Password hashing: bcrypt (10 rounds)

**Authorization**:
- Role-based access control (RBAC) - Phase 4+
- User can only access their own data
- Middleware checks on all protected routes

### Data Encryption

**In Transit**:
- HTTPS/TLS for all connections
- Certificate management via Vercel/Railway

**At Rest**:
- Database encryption (managed by host)
- Encrypted backups
- S3 bucket encryption (Phase 2+)

### Security Best Practices

1. **Input Validation**: Zod schemas for all inputs
2. **SQL Injection Prevention**: Parameterized queries (Prisma ORM)
3. **XSS Prevention**: React escaping, CSP headers
4. **CSRF Protection**: SameSite cookies, CSRF tokens
5. **Rate Limiting**: Express rate limit middleware
6. **Dependency Scanning**: Dependabot, npm audit

[See detailed security specifications in technical/security.md]

## Data Architecture

### Data Models

**User Model**:
- Authentication data
- Profile information
- Preferences

**Vehicle Model**:
- Vehicle identification (VIN, make, model, year)
- Mileage tracking
- Ownership information

**Maintenance Schedule Model**:
- Recurring maintenance tasks
- Time and mileage intervals
- Due date calculations

**Service History Model**:
- Completed services
- Cost tracking
- Invoice storage (Phase 2+)

**Reminder Model**:
- Scheduled reminders
- Delivery status

### Data Flow Patterns

**Vehicle Creation**:
1. User submits vehicle form
2. Frontend validates input (Zod)
3. Backend validates + creates vehicle
4. Database saves vehicle
5. Return vehicle data + success

**Maintenance Reminder**:
1. Cron job checks `next_due_date` daily
2. Find schedules due within 7 days
3. Create reminder record
4. Send email via SendGrid
5. Mark reminder as sent

**Service Logging**:
1. User logs completed service
2. Backend creates service history entry
3. Update `last_completed_date` and `last_completed_mileage` on schedule
4. Recalculate `next_due_date` and `next_due_mileage`
5. Update vehicle `current_mileage` if higher

## Integration Architecture

### External APIs

**SendGrid** (Email Service):
- Transactional emails
- Maintenance reminders
- Account notifications

**AWS S3 / Cloudflare R2** (Phase 2+):
- Invoice/receipt storage
- User-uploaded documents

**Stripe** (Phase 4+):
- Payment processing
- Subscription management

### API Integration Patterns

**Email Reminders**:
```typescript
interface EmailService {
  sendMaintenanceReminder(
    to: string,
    vehicleInfo: VehicleInfo,
    maintenanceTask: MaintenanceTask,
    dueDate: Date
  ): Promise<void>;
}
```

**Document Storage** (Phase 2+):
```typescript
interface StorageService {
  uploadDocument(
    file: File,
    userId: string,
    vehicleId: string
  ): Promise<{ url: string }>;
  
  deleteDocument(url: string): Promise<void>;
}
```

## Mobile Architecture (Phase 3+)

### Technology Stack

- **Framework**: React Native
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Camera**: React Native Camera

### Mobile-Specific Features

1. **Offline Support** - AsyncStorage for cached data
2. **Push Notifications** - Maintenance reminders
3. **Camera Integration** - Receipt/invoice capture
4. **Biometric Auth** - FaceID/TouchID (optional)

### Mobile Architecture

```
Mobile App (React Native)
├── Offline Storage (AsyncStorage)
├── Push Notifications (FCM)
├── Camera Integration
└── API Client → Backend API (same as web)
```

## Performance Optimization

### Frontend Performance

- **Code Splitting**: Dynamic imports, route-based splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Below-the-fold content
- **Caching**: Browser caching, service workers (Phase 3+)

### Backend Performance

- **Database Indexing**: Indexes on frequently queried columns
- **Connection Pooling**: Prisma connection pooling
- **Caching**: Redis for frequent queries (Phase 3+)
- **Rate Limiting**: Prevent API abuse

### Database Performance

- **Query Optimization**: Efficient SQL queries
- **Pagination**: Limit result sets
- **Eager Loading**: Reduce N+1 queries
- **Read Replicas** (Phase 3+): Scale reads

## Disaster Recovery & Backup

### Backup Strategy

- **Database Backups**: Daily automated backups (Railway/Supabase)
- **Point-in-Time Recovery**: Restore to any point in last 30 days
- **Document Backups** (Phase 2+): S3 versioning enabled

### Recovery Plan

1. **Database Corruption**: Restore from latest backup (< 24hr data loss)
2. **Server Failure**: Deploy new instance from Docker image (< 1hr downtime)
3. **Complete Failure**: Restore from backups to new infrastructure (< 4hr)

## Development Workflow

### Local Development

```bash
# Frontend (Next.js)
cd frontend
npm install
npm run dev  # http://localhost:3000

# Backend (Express)
cd backend
npm install
npx prisma migrate dev  # Run migrations
npm run dev  # http://localhost:3001
```

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret
NEXTAUTH_URL=http://localhost:3000
```

**Backend** (`.env`):
```
DATABASE_URL=postgresql://user:pass@localhost:5432/vehicle_tracker
JWT_SECRET=dev-secret
SENDGRID_API_KEY=your-key
PORT=3001
```

### Docker Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: vehicle_tracker
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/vehicle_tracker
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
```

## Architecture Decision Records (ADRs)

### ADR-001: Next.js for Frontend

**Decision**: Use Next.js (App Router) for frontend  
**Rationale**: 
- Server-side rendering for SEO
- API routes for BFF pattern
- Excellent developer experience
- Large ecosystem
**Alternatives**: Create React App, Vite
**Status**: Accepted

### ADR-002: Express for Backend

**Decision**: Use Express.js for backend  
**Rationale**: 
- Simple, unopinionated
- Large ecosystem
- Good performance
- Easy to learn
**Alternatives**: NestJS (more opinionated), Fastify (faster)
**Status**: Accepted

### ADR-003: PostgreSQL for Database

**Decision**: Use PostgreSQL for database  
**Rationale**: 
- Relational data fits well
- ACID compliance
- Excellent performance
- Mature ecosystem
**Alternatives**: MySQL (similar), MongoDB (NoSQL, less suitable)
**Status**: Accepted

### ADR-004: JWT Authentication

**Decision**: Use JWT tokens (httpOnly cookies) for authentication  
**Rationale**: 
- Stateless
- Scalable
- Standard approach
**Alternatives**: Session-based (requires Redis)
**Status**: Accepted

## Future Architecture Considerations

### Phase 3+: Microservices (If Needed)

If the application grows significantly, consider splitting into microservices:
- **Auth Service**: User authentication
- **Vehicle Service**: Vehicle and maintenance management
- **Notification Service**: Email and push notifications
- **Analytics Service**: Reporting and analytics

### Phase 3+: Event-Driven Architecture

For real-time features (e.g., live notifications):
- **Message Queue**: RabbitMQ or AWS SQS
- **Event Bus**: Publish/subscribe pattern
- **WebSockets**: Real-time updates

### Phase 4+: AI/ML Features

For predictive maintenance:
- **ML Service**: Predict maintenance needs based on history
- **Anomaly Detection**: Detect unusual expense patterns
- **Cost Optimization**: Suggest cost-saving opportunities

---

## Related Documents

- [PRD Overview](PRD_OVERVIEW.md) - Product requirements
- [Database Schema](technical/database-schema.md) - Detailed database design
- [API Design](technical/api-design.md) - API endpoint specifications
- [Security](technical/security.md) - Security implementation details

---

**This architecture supports scalable, secure, and maintainable development of the Vehicle Maintenance Tracker application.**
