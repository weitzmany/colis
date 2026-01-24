# Energy Usage Tracker - System Architecture

**Project**: Energy Usage Tracker (EnergyWise)  
**Status**: Planning  
**Last Updated**: 2026-01-20

---

## System Overview

Energy Usage Tracker is a full-stack web application with a future mobile app component that enables households to track utility usage, monitor costs, and receive budget alerts. The system follows a modern 3-tier architecture with clear separation between presentation (Next.js frontend), business logic (NestJS backend), and data persistence (PostgreSQL database).

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Web App (TypeScript)                                   │
│  - Server-Side Rendering (SSR)                                  │
│  - Client-Side Routing                                          │
│  - Responsive UI (Tailwind CSS)                                 │
│  - Charts (Recharts)                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS/REST API
                     │ JWT Authentication
┌────────────────────▼────────────────────────────────────────────┐
│                      Application Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  NestJS Backend (Node.js, TypeScript)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Auth Module    │  Usage Module  │  Budget Module       │   │
│  │  - JWT Auth     │  - Readings    │  - Budget Setup      │   │
│  │  - User Mgmt    │  - Calculations│  - Alert Logic       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Insights Module │ Notifications │  Property Module     │   │
│  │  - Analytics     │  - Email       │  - Property Setup    │   │
│  │  - Optimization  │  - In-App      │  - Multi-Property    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Shared Services: Prisma ORM, Validation, Error Handling       │
└────────────────────┬───────────────────┬────────────────────────┘
                     │                   │
                     │ Prisma ORM        │ SMTP
┌────────────────────▼─────────┐    ┌───▼──────────────────────┐
│     Data Layer               │    │  External Services       │
├──────────────────────────────┤    ├──────────────────────────┤
│  PostgreSQL 16               │    │  Email Service           │
│  - users                     │    │  - SendGrid / AWS SES    │
│  - properties                │    │                          │
│  - utilities                 │    │  Future: OCR, SMS        │
│  - meter_readings            │    └──────────────────────────┘
│  - bills                     │
│  - budgets                   │
│  - alerts                    │
└──────────────────────────────┘
```

### System Components

1. **Frontend (Next.js)**: Server-side rendered React application with TypeScript
   - Handles UI/UX, user interactions, data visualization
   - Communicates with backend via RESTful API
   - Implements authentication state management
   - Responsive design for mobile/tablet/desktop

2. **Backend (NestJS)**: Node.js application server with modular architecture
   - Business logic for usage calculations, budget alerts, insights
   - RESTful API endpoints with OpenAPI documentation
   - Database operations via Prisma ORM
   - Authentication via JWT tokens
   - Background jobs for scheduled alerts

3. **Database (PostgreSQL)**: Relational database for structured data
   - Stores users, properties, utilities, meter readings, bills, budgets, alerts
   - Implements foreign key constraints for data integrity
   - Indexed for query performance

4. **External Services**:
   - **Email Service** (SendGrid/AWS SES): Sends budget alerts, bill reminders
   - **OCR Service** (Phase 2): Bill parsing (Google Cloud Vision, AWS Textract)
   - **SMS Service** (Phase 3): Text message alerts (Twilio)

### Data Flow

**Typical User Flow: Log Meter Reading**
```
1. User enters meter reading in Next.js UI
2. Frontend validates input, sends POST /api/readings to NestJS backend
3. Backend validates request, authenticates user via JWT
4. Backend calculates usage (current reading - previous reading)
5. Backend stores reading in PostgreSQL via Prisma
6. Backend checks if budget exceeded, triggers alert if needed
7. Backend sends email alert via SendGrid (if budget exceeded)
8. Backend returns success response to frontend
9. Frontend updates UI, shows updated usage and budget status
```

---

## Frontend Architecture

### Framework & Libraries

**Core**:
- **Next.js 15** (React 18): Server-side rendering, file-based routing, API routes
- **TypeScript**: Type safety, better developer experience, reduced runtime errors
- **React 18**: Component-based UI, hooks for state management

**Styling & UI**:
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Pre-built accessible React components (Button, Input, Select, Dialog, etc.)
- **Recharts**: Declarative charting library for usage visualization (line charts, bar charts, area charts)

**Forms & Validation**:
- **React Hook Form**: Performant form state management with minimal re-renders
- **Zod**: TypeScript-first schema validation for form inputs

**State Management**:
- **React Context API** (MVP): Built-in state management for auth, user, property context
- **Zustand** (post-MVP, if needed): Lightweight state management for complex global state

**HTTP Client**:
- **Fetch API** (native): For API calls to NestJS backend
- **SWR** or **React Query** (post-MVP): Data fetching, caching, revalidation

### Component Structure

```
src/
├── app/                          # Next.js 13+ app directory (file-based routing)
│   ├── (auth)/                   # Authentication routes (grouped)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   └── layout.tsx            # Auth layout (no sidebar)
│   ├── (dashboard)/              # Dashboard routes (grouped, requires auth)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── readings/
│   │   │   └── page.tsx          # Meter readings page
│   │   ├── budget/
│   │   │   └── page.tsx          # Budget setup page
│   │   ├── insights/
│   │   │   └── page.tsx          # Insights page
│   │   └── layout.tsx            # Dashboard layout (sidebar, nav)
│   ├── api/                      # API routes (proxies to NestJS)
│   │   └── [...slug]/
│   │       └── route.ts          # Catch-all API proxy
│   ├── layout.tsx                # Root layout (global styles, providers)
│   └── page.tsx                  # Landing page
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── UsageChart.tsx        # Recharts usage visualization
│   │   ├── BudgetCard.tsx        # Budget progress card
│   │   ├── MetricCard.tsx        # Metric display card
│   │   └── AlertBanner.tsx       # Budget alert banner
│   ├── forms/                    # Form components
│   │   ├── ReadingForm.tsx       # Meter reading entry form
│   │   ├── BudgetForm.tsx        # Budget setup form
│   │   └── PropertyForm.tsx      # Property setup form
│   └── layout/                   # Layout components
│       ├── Header.tsx            # App header/nav
│       ├── Sidebar.tsx           # Dashboard sidebar
│       └── Footer.tsx            # App footer
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client (fetch wrapper)
│   ├── auth.ts                   # Auth utilities (JWT, local storage)
│   └── utils.ts                  # General utilities
├── types/                        # TypeScript types/interfaces
│   ├── user.ts                   # User types
│   ├── property.ts               # Property types
│   ├── reading.ts                # Reading types
│   └── ...
└── hooks/                        # Custom React hooks
    ├── useAuth.tsx               # Authentication hook
    ├── useProperty.tsx           # Property context hook
    └── useReadings.tsx           # Readings data hook
```

### Routing

**Next.js 13+ App Directory Routing**:
- File-based routing with nested layouts
- Server components by default (better performance)
- Client components for interactivity (marked with `'use client'`)

**Routes**:
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (requires auth)
- `/readings` - Meter readings page (requires auth)
- `/budget` - Budget setup page (requires auth)
- `/insights` - Insights page (requires auth)

**Authentication Guards**:
- Middleware checks JWT token for protected routes
- Redirects to `/login` if unauthenticated
- Stores redirect path for post-login navigation

### State Management

**MVP: React Context API**:
```typescript
// AuthContext: User authentication state
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// PropertyContext: Current property state
interface PropertyContextType {
  property: Property | null;
  setProperty: (property: Property) => void;
  properties: Property[];
  loadProperties: () => Promise<void>;
}
```

**Post-MVP: Zustand (if needed for complex state)**:
- Global state for user preferences, app settings
- Lightweight alternative to Redux with simpler API
- Used only if Context API becomes insufficient

### API Communication

**API Client** (`lib/api.ts`):
```typescript
// Fetch wrapper with JWT authentication
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}

// Usage example
const readings = await apiCall<Reading[]>('/readings', { method: 'GET' });
```

**API Routes** (`app/api/[...slug]/route.ts`):
- Next.js API routes proxy requests to NestJS backend
- Avoids CORS issues, simplifies deployment
- Adds request logging, error handling

---

## Backend Architecture

### Framework & Libraries

**Core**:
- **NestJS**: Enterprise-grade Node.js framework with TypeScript, dependency injection, modular architecture
- **Node.js 20 LTS**: Long-term support version for stability
- **TypeScript**: Type safety, better maintainability

**Database**:
- **Prisma ORM**: Type-safe database client with schema migrations
- **PostgreSQL 16**: Relational database with JSON support, full-text search

**Authentication**:
- **JWT** (JSON Web Tokens): Stateless authentication
- **bcrypt**: Password hashing (10 rounds)
- **Passport.js**: Authentication middleware

**Validation**:
- **class-validator**: Decorator-based validation for DTOs
- **class-transformer**: Object transformation and serialization

**Email**:
- **Nodemailer**: Email sending library
- **SendGrid** or **AWS SES**: Email service providers

**Background Jobs** (Phase 2+):
- **Bull**: Redis-based queue for scheduled jobs (budget alerts, reminders)
- **Redis**: In-memory data store for queue, caching

### Modular Architecture

**NestJS Modules**:
```
src/
├── main.ts                       # Application entry point
├── app.module.ts                 # Root module (imports all feature modules)
├── auth/                         # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts        # Login, register endpoints
│   ├── auth.service.ts           # JWT generation, password validation
│   ├── jwt.strategy.ts           # Passport JWT strategy
│   └── dto/
│       ├── register.dto.ts       # Registration DTO
│       └── login.dto.ts          # Login DTO
├── users/                        # User management module
│   ├── users.module.ts
│   ├── users.controller.ts       # User CRUD endpoints
│   ├── users.service.ts          # User business logic
│   └── dto/
│       └── update-user.dto.ts    # Update user DTO
├── properties/                   # Property management module
│   ├── properties.module.ts
│   ├── properties.controller.ts  # Property CRUD endpoints
│   ├── properties.service.ts     # Property business logic
│   └── dto/
│       └── create-property.dto.ts
├── readings/                     # Meter readings module
│   ├── readings.module.ts
│   ├── readings.controller.ts    # Readings CRUD endpoints
│   ├── readings.service.ts       # Usage calculation logic
│   └── dto/
│       └── create-reading.dto.ts
├── budgets/                      # Budget management module
│   ├── budgets.module.ts
│   ├── budgets.controller.ts     # Budget CRUD endpoints
│   ├── budgets.service.ts        # Budget logic, alert triggering
│   └── dto/
│       └── create-budget.dto.ts
├── insights/                     # Insights & analytics module
│   ├── insights.module.ts
│   ├── insights.controller.ts    # Insights endpoints
│   └── insights.service.ts       # Analytics calculations
├── notifications/                # Notification module
│   ├── notifications.module.ts
│   ├── notifications.service.ts  # Email sending logic
│   └── templates/                # Email templates
│       └── budget-alert.hbs      # Handlebars template
├── common/                       # Shared utilities
│   ├── decorators/               # Custom decorators
│   ├── filters/                  # Exception filters
│   ├── guards/                   # Auth guards
│   ├── interceptors/             # Logging, transform interceptors
│   └── pipes/                    # Validation pipes
└── prisma/                       # Prisma schema and migrations
    ├── schema.prisma             # Database schema
    └── migrations/               # Migration files
```

### API Design (REST)

**Base URL**: `/api` (proxied via Next.js API routes in MVP)

**Authentication**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `GET /api/auth/me` - Get current user (requires JWT)

**Properties**:
- `POST /api/properties` - Create property
- `GET /api/properties` - List user's properties
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

**Meter Readings**:
- `POST /api/readings` - Create meter reading
- `GET /api/readings?property_id=X&utility_type=Y` - List readings (filtered)
- `GET /api/readings/:id` - Get reading details
- `PUT /api/readings/:id` - Update reading
- `DELETE /api/readings/:id` - Delete reading

**Budgets**:
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets?property_id=X` - Get property budgets
- `DELETE /api/budgets/:id` - Delete budget

**Insights**:
- `GET /api/insights/usage-summary?property_id=X&month=Y` - Monthly usage summary
- `GET /api/insights/trends?property_id=X&months=6` - Usage trends
- `GET /api/insights/optimization` - Optimization recommendations

**API Responses**:
```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "message": "Reading created successfully"
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid meter reading value",
    "details": { ... }
  }
}
```

### Authentication & Authorization

**JWT Authentication**:
```typescript
// JWT payload
interface JwtPayload {
  sub: string;      // User ID
  email: string;    // User email
  iat: number;      // Issued at
  exp: number;      // Expiration (7 days)
}

// JWT generation
const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
  expiresIn: '7d',
});
```

**Password Security**:
- **Hashing**: bcrypt with 10 rounds (secure, performant)
- **Validation**: Minimum 8 characters, mix of letters/numbers (enforced via class-validator)
- **Storage**: Never store plaintext passwords

**Authorization**:
- **JWT Guard**: Protects all routes except `/auth/register`, `/auth/login`
- **User Context**: Extracted from JWT, available in all controllers via `@CurrentUser()` decorator

### Business Logic

**Usage Calculation**:
```typescript
// Calculate usage from meter readings
function calculateUsage(currentReading: number, previousReading: number): number {
  if (previousReading > currentReading) {
    throw new Error('Current reading must be greater than previous reading');
  }
  return currentReading - previousReading;
}

// Example: Electricity meter
// Previous reading: 1000 kWh
// Current reading: 1150 kWh
// Usage: 150 kWh
```

**Budget Alert Logic**:
```typescript
// Check if budget exceeded
function checkBudgetAlert(
  currentCost: number,
  budgetLimit: number,
  alertThreshold: number = 0.8 // 80% threshold
): boolean {
  return currentCost >= budgetLimit * alertThreshold;
}

// Trigger email alert if threshold exceeded
if (checkBudgetAlert(currentCost, budget.limit)) {
  await notificationService.sendBudgetAlert(user, property, budget);
}
```

**Insights Engine** (Phase 2+):
```typescript
// Month-over-month comparison
function calculateMonthOverMonth(
  currentMonth: Reading[],
  previousMonth: Reading[]
): {
  percentChange: number;
  absoluteChange: number;
  insight: string;
} {
  const currentTotal = currentMonth.reduce((sum, r) => sum + r.usage, 0);
  const previousTotal = previousMonth.reduce((sum, r) => sum + r.usage, 0);
  const absoluteChange = currentTotal - previousTotal;
  const percentChange = (absoluteChange / previousTotal) * 100;
  
  const insight =
    percentChange > 10
      ? `Usage increased by ${percentChange.toFixed(1)}% this month`
      : percentChange < -10
      ? `Great! Usage decreased by ${Math.abs(percentChange).toFixed(1)}% this month`
      : 'Usage remained stable this month';
  
  return { percentChange, absoluteChange, insight };
}
```

---

## Infrastructure

### Hosting & Deployment

**MVP: DigitalOcean**:
- **Droplet**: $12-24/month (2GB RAM, 1-2 vCPUs, 50GB SSD)
- **PostgreSQL Managed Database**: $15/month (1GB RAM, 10GB storage, automated backups)
- **Spaces (S3-compatible)**: $5/month (250GB storage, 1TB bandwidth) - for bill uploads (Phase 2+)
- **Total MVP Cost**: ~$32-44/month

**Deployment Architecture**:
```
┌────────────────────────────────────────────────────┐
│  DigitalOcean Droplet (Ubuntu 22.04 LTS)          │
│  ┌──────────────────────────────────────────────┐ │
│  │  Docker Compose                              │ │
│  │  ┌─────────────┐   ┌───────────────────┐    │ │
│  │  │ Next.js App │   │  NestJS Backend   │    │ │
│  │  │ (Container) │   │  (Container)      │    │ │
│  │  │ Port 3000   │   │  Port 4000        │    │ │
│  │  └─────────────┘   └───────────────────┘    │ │
│  │                                              │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │  Nginx Reverse Proxy (Container)     │   │ │
│  │  │  - HTTPS (Let's Encrypt)             │   │ │
│  │  │  - Forwards /api → NestJS            │   │ │
│  │  │  - Forwards / → Next.js              │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────┐
│  DigitalOcean Managed PostgreSQL                   │
│  - Automated backups                               │
│  - Connection pooling                              │
│  - High availability (Phase 2+)                    │
└────────────────────────────────────────────────────┘
```

**Post-MVP: AWS Migration** (Phase 2+):
- **EC2**: Auto-scaling instances for app server
- **RDS PostgreSQL**: Managed database with read replicas
- **S3**: Object storage for bill uploads, exports
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **ALB**: Application Load Balancer for HTTPS termination
- **Estimated Cost**: $100-200/month for 1,000-5,000 users

### CI/CD Pipeline

**GitHub Actions Workflow**:
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
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DO_HOST }}
          username: ${{ secrets.DO_USERNAME }}
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            cd /app
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

**Deployment Steps**:
1. **Push to GitHub**: Trigger CI/CD pipeline
2. **Run Tests**: Unit tests, integration tests, linting
3. **Build Docker Images**: Build frontend and backend containers
4. **Deploy to DigitalOcean**: SSH, pull latest code, rebuild containers
5. **Health Check**: Verify app is running (HTTP 200 response)
6. **Rollback**: Revert to previous version if health check fails

### Monitoring & Logging

**MVP: Basic Logging**:
- **Winston**: Structured logging library
- **Log Levels**: error, warn, info, debug
- **Log Storage**: Log files on server, rotated daily
- **Error Tracking**: Console errors, logged to file

**Example Logging**:
```typescript
// Logger service
import { Logger } from '@nestjs/common';

export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);

  async create(dto: CreateReadingDto) {
    this.logger.log(`Creating reading for property ${dto.propertyId}`);
    try {
      // ... business logic
      this.logger.log(`Reading created successfully: ${reading.id}`);
    } catch (error) {
      this.logger.error(`Failed to create reading: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

**Phase 2+: Advanced Observability**:
- **Sentry**: Error tracking, performance monitoring
- **New Relic** or **Datadog**: APM (Application Performance Monitoring)
- **ELK Stack** (Elasticsearch, Logstash, Kibana): Centralized logging
- **Uptime Monitoring**: UptimeRobot, Pingdom

### Scaling Strategy

**Vertical Scaling** (MVP → 1,000 users):
- Upgrade DigitalOcean droplet (4GB RAM, 2 vCPUs → 8GB RAM, 4 vCPUs)
- Upgrade PostgreSQL managed database (2GB RAM, 25GB storage)
- Cost: ~$50-80/month

**Horizontal Scaling** (5,000+ users, Phase 2+):
- **Load Balancer**: Distribute traffic across multiple app servers
- **Database Read Replicas**: Offload read queries to replicas
- **Caching**: Redis for session storage, query results, dashboard data
- **CDN**: CloudFront for static assets (images, CSS, JS)
- Cost: ~$200-300/month

**Database Optimization**:
- **Indexing**: Add indexes on frequently queried columns (user_id, property_id, date)
- **Query Optimization**: Use Prisma's `select` to fetch only needed fields
- **Pagination**: Implement cursor-based pagination for large result sets
- **Archiving**: Move old data (3+ years) to separate archive tables (Phase 3+)

---

## Data Architecture

### Database Schema (Prisma)

**Core Tables**:

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  properties Property[]
}

// Property model (house, apartment, etc.)
model Property {
  id        String   @id @default(cuid())
  userId    String
  name      String   // e.g., "Main Home", "Rental Property"
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  utilities Utility[]
  
  @@index([userId])
}

// Utility model (electricity, water, gas, heating)
model Utility {
  id         String   @id @default(cuid())
  propertyId String
  type       UtilityType // electricity, water, gas, heating
  unit       String   // kWh, gallons, therms, etc.
  createdAt  DateTime @default(now())
  
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  readings   Reading[]
  bills      Bill[]
  budgets    Budget[]
  
  @@unique([propertyId, type])
  @@index([propertyId])
}

enum UtilityType {
  electricity
  water
  gas
  heating
}

// Meter reading model
model Reading {
  id        String   @id @default(cuid())
  utilityId String
  reading   Float    // Current meter reading
  usage     Float    // Calculated usage (current - previous)
  date      DateTime
  createdAt DateTime @default(now())
  
  utility   Utility  @relation(fields: [utilityId], references: [id], onDelete: Cascade)
  
  @@index([utilityId, date])
}

// Bill model
model Bill {
  id        String   @id @default(cuid())
  utilityId String
  amount    Float    // Bill amount in dollars
  dueDate   DateTime
  month     DateTime // First day of billing month
  paid      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  utility   Utility  @relation(fields: [utilityId], references: [id], onDelete: Cascade)
  
  @@index([utilityId, month])
}

// Budget model
model Budget {
  id        String   @id @default(cuid())
  utilityId String
  limit     Float    // Budget limit in dollars
  period    BudgetPeriod
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  utility   Utility  @relation(fields: [utilityId], references: [id], onDelete: Cascade)
  alerts    Alert[]
  
  @@unique([utilityId, period])
}

enum BudgetPeriod {
  monthly
  quarterly
  yearly
}

// Alert model
model Alert {
  id        String   @id @default(cuid())
  budgetId  String
  triggered Boolean  @default(false)
  message   String
  sentAt    DateTime?
  createdAt DateTime @default(now())
  
  budget    Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  
  @@index([budgetId, triggered])
}
```

### Database Relationships

- **User → Property**: One-to-many (user can have multiple properties)
- **Property → Utility**: One-to-many (property has multiple utilities)
- **Utility → Reading**: One-to-many (utility has multiple readings over time)
- **Utility → Bill**: One-to-many (utility has multiple bills)
- **Utility → Budget**: One-to-many (utility can have monthly, quarterly, yearly budgets)
- **Budget → Alert**: One-to-many (budget can trigger multiple alerts)

### Data Models

**User**:
```typescript
interface User {
  id: string;
  email: string;
  password: string; // bcrypt hashed
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Property**:
```typescript
interface Property {
  id: string;
  userId: string;
  name: string; // "Main Home", "Rental Property"
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Utility**:
```typescript
enum UtilityType {
  Electricity = 'electricity',
  Water = 'water',
  Gas = 'gas',
  Heating = 'heating',
}

interface Utility {
  id: string;
  propertyId: string;
  type: UtilityType;
  unit: string; // kWh, gallons, therms, etc.
  createdAt: Date;
}
```

**Reading**:
```typescript
interface Reading {
  id: string;
  utilityId: string;
  reading: number; // Current meter reading
  usage: number; // Calculated usage (current - previous)
  date: Date;
  createdAt: Date;
}
```

**Budget**:
```typescript
enum BudgetPeriod {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Yearly = 'yearly',
}

interface Budget {
  id: string;
  utilityId: string;
  limit: number; // Budget limit in dollars
  period: BudgetPeriod;
  createdAt: Date;
  updatedAt: Date;
}
```

### Data Flow

**Example: Creating a Meter Reading**:
```typescript
// 1. User submits reading form (Next.js frontend)
const formData = {
  utilityId: 'util_123',
  reading: 1150, // Current meter reading
  date: '2026-01-20',
};

// 2. Frontend sends POST request to backend
const response = await fetch('/api/readings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});

// 3. Backend validates request, authenticates user
// 4. Backend fetches previous reading from database
const previousReading = await prisma.reading.findFirst({
  where: { utilityId: formData.utilityId },
  orderBy: { date: 'desc' },
});

// 5. Backend calculates usage
const usage = formData.reading - (previousReading?.reading || 0);

// 6. Backend creates reading in database
const reading = await prisma.reading.create({
  data: {
    utilityId: formData.utilityId,
    reading: formData.reading,
    usage,
    date: new Date(formData.date),
  },
});

// 7. Backend checks if budget exceeded
const budget = await prisma.budget.findFirst({
  where: { utilityId: formData.utilityId, period: 'monthly' },
});

const monthlyBills = await prisma.bill.findMany({
  where: {
    utilityId: formData.utilityId,
    month: { gte: startOfMonth(new Date()) },
  },
});

const totalCost = monthlyBills.reduce((sum, bill) => sum + bill.amount, 0);

if (budget && totalCost >= budget.limit * 0.8) {
  // 8. Trigger budget alert
  await prisma.alert.create({
    data: {
      budgetId: budget.id,
      triggered: true,
      message: `Budget alert: ${utility.type} cost is ${totalCost} (80% of ${budget.limit} limit)`,
      sentAt: new Date(),
    },
  });
  
  // 9. Send email notification
  await emailService.sendBudgetAlert(user, property, utility, totalCost, budget.limit);
}

// 10. Return success response
return { success: true, data: reading };
```

---

## Security Architecture

### Authentication Flow

**Registration**:
```
1. User submits registration form (email, password, name)
2. Frontend validates input (email format, password strength)
3. Frontend sends POST /api/auth/register to backend
4. Backend validates input (DTO validation)
5. Backend checks if email already exists
6. Backend hashes password with bcrypt (10 rounds)
7. Backend creates user in database
8. Backend generates JWT token (7-day expiration)
9. Backend returns JWT token to frontend
10. Frontend stores token in localStorage
11. Frontend redirects to dashboard
```

**Login**:
```
1. User submits login form (email, password)
2. Frontend sends POST /api/auth/login to backend
3. Backend finds user by email
4. Backend compares submitted password with hashed password (bcrypt)
5. Backend generates JWT token if password matches
6. Backend returns JWT token to frontend
7. Frontend stores token in localStorage
8. Frontend redirects to dashboard
```

**Authenticated Requests**:
```
1. Frontend includes JWT token in Authorization header: Bearer <token>
2. Backend JWT Guard extracts token from header
3. Backend verifies token signature and expiration
4. Backend extracts user ID from token payload
5. Backend injects user context into request
6. Controller handler receives @CurrentUser() decorator with user
```

### Authorization Model

**MVP: Simple User Ownership**:
- Users can only access their own data (properties, readings, budgets)
- Enforced in service layer: Filter by userId
- Example: `prisma.property.findMany({ where: { userId: currentUser.id } })`

**Phase 2+: Role-Based Access Control (RBAC)**:
- Roles: Owner, Family Member, Read-Only
- Owner: Full access (CRUD)
- Family Member: Can log readings, view data
- Read-Only: View only
- Implemented via Prisma schema: `UserProperty` join table with role field

### Data Encryption

**At Rest**:
- **Database**: PostgreSQL encryption at rest (DigitalOcean managed database)
- **Passwords**: bcrypt hashing (10 rounds, salted)
- **Future (Phase 2+)**: Encrypt sensitive fields (bill amounts, addresses) with AES-256

**In Transit**:
- **HTTPS**: TLS 1.2/1.3 for all API requests
- **Let's Encrypt**: Free SSL certificates, auto-renewal via Certbot
- **HSTS**: HTTP Strict Transport Security header to enforce HTTPS

### Security Best Practices

**Input Validation**:
- **Frontend**: React Hook Form + Zod validation (email format, password strength, meter reading range)
- **Backend**: NestJS class-validator DTOs (double validation)
- **SQL Injection Prevention**: Prisma ORM parameterized queries

**Password Security**:
- **Minimum Requirements**: 8 characters, mix of letters and numbers
- **Hashing**: bcrypt with 10 rounds (secure, performant)
- **No Password Storage**: Never log or store plaintext passwords

**Rate Limiting** (Phase 2+):
- **API Rate Limiting**: 100 requests per 15 minutes per IP (prevents brute force)
- **Login Attempts**: 5 failed attempts → 15-minute lockout
- **Implemented with**: `express-rate-limit` or NestJS Throttler

**CORS** (Cross-Origin Resource Sharing):
- **MVP**: No CORS needed (Next.js proxies API requests)
- **Post-MVP**: Allow only frontend domain (CORS whitelist)

**Environment Variables**:
- **Never commit secrets**: Use `.env` file (gitignored)
- **Production Secrets**: Stored in DigitalOcean secrets, GitHub Secrets
- **Key Rotation**: Rotate JWT secret, database passwords periodically (quarterly)

---

## Integration Architecture

### External APIs

**MVP: Email Service (SendGrid or AWS SES)**:
- **Purpose**: Send budget alerts, bill reminders
- **Integration**: Nodemailer with SendGrid/SES SMTP
- **Template**: Handlebars templates for email HTML
- **Rate Limiting**: SendGrid Free: 100 emails/day, Essentials: 40K emails/month

**Email Configuration**:
```typescript
// Nodemailer + SendGrid
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Send budget alert email
async function sendBudgetAlert(user: User, property: Property, budget: Budget) {
  await transporter.sendMail({
    from: 'alerts@energywise.com',
    to: user.email,
    subject: `Budget Alert: ${property.name}`,
    html: `
      <h1>Budget Alert</h1>
      <p>Your ${budget.utility.type} usage is at 80% of your ${budget.limit} budget.</p>
      <a href="https://energywise.com/dashboard">View Dashboard</a>
    `,
  });
}
```

**Phase 2+: OCR Service (Bill Parsing)**:
- **Options**: 
  - **Google Cloud Vision API**: $1.50 per 1,000 requests, high accuracy
  - **AWS Textract**: $1.50 per 1,000 pages, form extraction
  - **Tesseract.js**: Open-source, free, lower accuracy
- **Integration**: Upload bill image/PDF → OCR service → Parse text → Extract data (amount, due date, usage)

**Phase 3+: Utility Provider APIs**:
- **Availability**: Limited, varies by utility provider (most don't offer public APIs)
- **Integration**: OAuth 2.0 authentication → Fetch usage data → Sync to database
- **Examples**: Smart meter APIs (Nest, Ecobee), utility portals (where APIs exist)

### Third-Party Services

**Payment Processing** (Premium tier, Phase 2+):
- **Stripe**: Subscription billing, payment processing
- **Integration**: Stripe Elements (payment form), Stripe Checkout (hosted page)
- **Webhook**: Handle subscription events (created, renewed, cancelled)

**Analytics** (Phase 2+):
- **Google Analytics**: Page views, user behavior
- **Mixpanel**: Event tracking, user funnels
- **Integration**: JavaScript snippet, track custom events (reading logged, budget set)

**Error Tracking** (Phase 2+):
- **Sentry**: Error monitoring, performance tracking
- **Integration**: Sentry SDK for Next.js and NestJS
- **Alerts**: Email, Slack notifications for critical errors

---

## Testing Strategy

### Unit Tests

**Backend (NestJS)**:
- **Framework**: Jest (default with NestJS)
- **Coverage**: 80%+ target for services, controllers
- **Example**:
```typescript
// readings.service.spec.ts
describe('ReadingsService', () => {
  let service: ReadingsService;
  let prisma: PrismaService;

  beforeEach(() => {
    // Set up test module
  });

  it('should calculate usage correctly', () => {
    const usage = service.calculateUsage(1150, 1000);
    expect(usage).toBe(150);
  });

  it('should throw error if current reading < previous reading', () => {
    expect(() => service.calculateUsage(1000, 1150)).toThrow();
  });
});
```

**Frontend (Next.js)**:
- **Framework**: Jest + React Testing Library
- **Coverage**: 70%+ target for components, utilities
- **Example**:
```typescript
// ReadingForm.test.tsx
describe('ReadingForm', () => {
  it('should validate meter reading input', () => {
    render(<ReadingForm />);
    const input = screen.getByLabelText('Meter Reading');
    fireEvent.change(input, { target: { value: '1150' } });
    expect(input).toHaveValue('1150');
  });

  it('should display error if reading < previous reading', () => {
    render(<ReadingForm previousReading={1150} />);
    const input = screen.getByLabelText('Meter Reading');
    fireEvent.change(input, { target: { value: '1000' } });
    expect(screen.getByText(/must be greater than previous/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

**API Tests**:
- **Framework**: Supertest + Jest
- **Coverage**: All API endpoints
- **Example**:
```typescript
// readings.e2e.spec.ts
describe('Readings API', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    // Set up test app, authenticate
  });

  it('POST /api/readings should create reading', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/readings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        utilityId: 'util_123',
        reading: 1150,
        date: '2026-01-20',
      })
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.usage).toBe(150);
  });
});
```

### End-to-End Tests

**E2E Tests**:
- **Framework**: Playwright or Cypress
- **Coverage**: Critical user flows (registration, login, log reading, set budget)
- **Example**:
```typescript
// e2e/dashboard.spec.ts
test('should log meter reading and see updated dashboard', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Navigate to readings page
  await page.click('text=Meter Readings');
  
  // Log new reading
  await page.fill('input[name="reading"]', '1150');
  await page.click('button[type="submit"]');
  
  // Verify success message
  await expect(page.locator('text=Reading logged successfully')).toBeVisible();
  
  // Go to dashboard
  await page.click('text=Dashboard');
  
  // Verify usage updated
  await expect(page.locator('text=150 kWh')).toBeVisible();
});
```

### Test Coverage Targets

- **Backend Unit Tests**: 80%+ coverage (services, controllers)
- **Frontend Unit Tests**: 70%+ coverage (components, utilities)
- **Integration Tests**: 100% API endpoint coverage
- **E2E Tests**: Critical user flows (5-10 tests)

---

## Performance Optimization

### Frontend Performance

**Code Splitting**:
- **Next.js Automatic Code Splitting**: Each route is a separate bundle
- **Dynamic Imports**: Lazy load heavy components (charts, forms)
- **Example**: `const Chart = dynamic(() => import('@/components/UsageChart'))`

**Image Optimization**:
- **Next.js Image Component**: Automatic WebP conversion, lazy loading, responsive images
- **Example**: `<Image src="/logo.png" width={200} height={50} alt="Logo" />`

**Caching**:
- **Browser Caching**: Cache static assets (CSS, JS, images) for 1 year
- **SWR/React Query** (Phase 2+): Cache API responses, stale-while-revalidate

**Bundle Size**:
- **Tree Shaking**: Remove unused code via Webpack
- **Production Build**: Minification, compression (Gzip/Brotli)
- **Target**: <200KB initial bundle size

### Backend Performance

**Database Query Optimization**:
- **Indexing**: Add indexes on frequently queried columns (user_id, property_id, date)
- **Selective Fetching**: Use Prisma's `select` to fetch only needed fields
- **Pagination**: Implement cursor-based pagination for large result sets
- **Example**:
```typescript
// Fetch only needed fields
const readings = await prisma.reading.findMany({
  where: { utilityId: 'util_123' },
  select: { id: true, reading: true, usage: true, date: true },
  orderBy: { date: 'desc' },
  take: 10, // Pagination
});
```

**Caching** (Phase 2+):
- **Redis**: Cache dashboard data, usage summaries (5-minute TTL)
- **In-Memory Cache**: Cache frequently accessed static data (utility types, units)

**Response Time Targets**:
- **Dashboard Load**: <2 seconds (p95)
- **API Response**: <200ms (p95)
- **Database Queries**: <50ms (p95)

### Database Performance

**Indexing Strategy**:
```sql
-- Index on foreign keys
CREATE INDEX idx_readings_utility_id ON readings(utility_id);
CREATE INDEX idx_readings_date ON readings(utility_id, date);

-- Index on queries with WHERE clauses
CREATE INDEX idx_bills_month ON bills(utility_id, month);
CREATE INDEX idx_budgets_period ON budgets(utility_id, period);
```

**Connection Pooling**:
- **Prisma Connection Pool**: Max 10 connections (MVP), 20-30 (production)
- **PgBouncer** (Phase 3+): Connection pooler for PostgreSQL (reduces connection overhead)

**Query Monitoring**:
- **Prisma Query Logging**: Log slow queries (>1 second)
- **PostgreSQL `pg_stat_statements`**: Analyze query performance
- **Optimization**: Add indexes, rewrite queries, cache results

---

## Scalability Plan

### Phase 1 (MVP → 1,000 users)

**Infrastructure**:
- Single DigitalOcean Droplet (4GB RAM, 2 vCPUs)
- PostgreSQL Managed Database (2GB RAM, 25GB storage)
- No caching, no load balancer

**Cost**: ~$50-80/month

### Phase 2 (1,000 → 5,000 users)

**Infrastructure**:
- 2-3 DigitalOcean Droplets (8GB RAM, 4 vCPUs each)
- Load Balancer (distribute traffic)
- PostgreSQL with Read Replica (offload read queries)
- Redis for caching (dashboard data, session storage)

**Cost**: ~$200-300/month

### Phase 3 (5,000 → 20,000 users)

**Infrastructure**:
- Migrate to AWS: EC2 Auto Scaling Group (5-10 instances)
- RDS PostgreSQL with Multi-AZ (high availability), Read Replicas (3-5)
- ElastiCache Redis Cluster (caching, session storage)
- S3 for bill uploads, exports
- CloudFront CDN for static assets

**Cost**: ~$500-800/month

### Phase 4 (20,000+ users)

**Infrastructure**:
- Kubernetes Cluster (AWS EKS or GKE) for container orchestration
- Microservices Architecture: Split into Auth, Usage, Insights, Notifications services
- Serverless Functions (AWS Lambda) for background jobs (alert processing, report generation)
- DynamoDB (NoSQL) for high-throughput data (real-time usage events)
- Data Warehouse (Redshift, BigQuery) for analytics

**Cost**: $1,000-2,000/month

---

## Disaster Recovery

### Backup Strategy

**Database Backups**:
- **DigitalOcean Managed PostgreSQL**: Automated daily backups, 7-day retention
- **Backup Schedule**: Daily at 2 AM UTC
- **Backup Storage**: DigitalOcean Spaces (S3-compatible), encrypted

**Recovery Time Objective (RTO)**: 4 hours (time to restore service)
**Recovery Point Objective (RPO)**: 24 hours (acceptable data loss)

### Backup Testing

**Quarterly Backup Restoration Tests**:
- Restore backup to test database
- Verify data integrity
- Test application against restored database
- Document restoration procedure

### High Availability (Phase 2+)

**Multi-AZ Deployment**:
- Run app servers in multiple availability zones (AWS regions)
- Use load balancer to distribute traffic
- Database failover to standby instance (RDS Multi-AZ)

**Failover Plan**:
1. Monitor health checks (HTTP 200 response)
2. Detect failure (3 consecutive failed health checks)
3. Remove failed instance from load balancer
4. Route traffic to healthy instances
5. Alert DevOps team
6. Investigate and fix failed instance

---

## Migration Plan

### Phase 1 → Phase 2 Migration

**Data Migration**:
- No schema changes required
- Add new tables for OCR results, payment subscriptions
- Run Prisma migrations: `npx prisma migrate deploy`

**Infrastructure Migration**:
- Set up new DigitalOcean droplets
- Deploy app to new droplets
- Test thoroughly in staging environment
- Blue-green deployment: Switch traffic to new droplets, keep old as backup
- Monitor for 24 hours, shut down old droplets if stable

### DigitalOcean → AWS Migration (Phase 3)

**Migration Steps**:
1. **Set Up AWS Infrastructure**: EC2, RDS, S3, CloudFront, ALB
2. **Database Migration**: 
   - Create RDS PostgreSQL instance
   - Use `pg_dump` to export DigitalOcean database
   - Import to RDS using `pg_restore`
   - Verify data integrity
3. **Application Deployment**:
   - Deploy app to EC2 instances
   - Configure environment variables
   - Test application against new RDS database
4. **DNS Cutover**:
   - Update DNS records to point to AWS ALB
   - Monitor for issues
   - Keep DigitalOcean as backup for 7 days
5. **Decommission DigitalOcean**:
   - After 7 days of stable operation, shut down DigitalOcean resources

**Downtime**: <1 hour (during DNS cutover)

---

## Technology Decisions

### Why Next.js?

- **Server-Side Rendering (SSR)**: Better SEO, faster initial page load
- **File-Based Routing**: Intuitive, reduces boilerplate
- **API Routes**: Built-in backend API support (proxy to NestJS)
- **Image Optimization**: Automatic WebP conversion, lazy loading
- **Production-Ready**: Used by Vercel, Netflix, Hulu (battle-tested)

### Why NestJS?

- **Modular Architecture**: Clear separation of concerns (modules, controllers, services)
- **TypeScript-First**: Type safety, better maintainability
- **Dependency Injection**: Testability, loose coupling
- **Decorators**: Clean, expressive syntax (similar to Spring Boot, Angular)
- **Production-Ready**: Used by Adidas, Roche, Capgemini

### Why PostgreSQL?

- **Relational Data**: User, properties, readings, budgets (natural fit for relational model)
- **ACID Compliance**: Data integrity, transactions
- **JSON Support**: Flexible for storing metadata (future: bill data, insights)
- **Full-Text Search**: Search utility bills, properties (Phase 2+)
- **Mature Ecosystem**: Proven reliability, extensive tooling (Prisma, pg-admin)

### Why Prisma?

- **Type-Safe ORM**: Compile-time type checking, prevents runtime errors
- **Auto-Generated Client**: No manual SQL queries, reduces boilerplate
- **Migration System**: Version-controlled schema changes
- **Developer Experience**: Excellent VS Code integration, auto-completion

### Why Docker?

- **Consistency**: Same environment in development, staging, production
- **Isolation**: Each service (Next.js, NestJS, PostgreSQL) in separate container
- **Easy Deployment**: Single `docker-compose up` command

---

## Appendix

### Technical Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 (React 18) | Server-side rendering, file-based routing |
| **Frontend UI** | Tailwind CSS, shadcn/ui | Styling, UI components |
| **Frontend Charts** | Recharts | Usage visualization |
| **Frontend Forms** | React Hook Form, Zod | Form management, validation |
| **Backend** | NestJS (Node.js 20 LTS) | API server, business logic |
| **Database** | PostgreSQL 16 | Relational database |
| **ORM** | Prisma | Type-safe database client |
| **Authentication** | JWT, bcrypt | Stateless auth, password hashing |
| **Email** | Nodemailer, SendGrid/AWS SES | Budget alerts, reminders |
| **Hosting (MVP)** | DigitalOcean | Droplet, managed PostgreSQL |
| **Hosting (Post-MVP)** | AWS | EC2, RDS, S3, CloudFront |
| **CI/CD** | GitHub Actions | Automated testing, deployment |
| **Monitoring (MVP)** | Winston | Logging |
| **Monitoring (Post-MVP)** | Sentry, New Relic | Error tracking, APM |

### Architecture Decisions

**Decision 1: Monolithic Architecture (MVP)**:
- **Why**: Simpler to develop, deploy, maintain for MVP
- **Alternative**: Microservices (too complex for MVP, adds overhead)
- **Future**: Migrate to microservices in Phase 3+ if scaling demands

**Decision 2: RESTful API (not GraphQL)**:
- **Why**: Simpler, well-understood, sufficient for MVP use cases
- **Alternative**: GraphQL (more complex, over-fetching not a problem for MVP)
- **Future**: Consider GraphQL in Phase 3+ if frontend needs more flexibility

**Decision 3: PostgreSQL (not NoSQL)**:
- **Why**: Relational data (users, properties, readings), ACID compliance
- **Alternative**: MongoDB (less suitable for relational data, eventual consistency)
- **Future**: Consider NoSQL for high-throughput data (real-time usage events) in Phase 4+

**Decision 4: DigitalOcean (MVP), AWS (Post-MVP)**:
- **Why**: DigitalOcean is cost-effective for MVP ($32-44/month vs AWS $100+/month)
- **Alternative**: AWS from start (higher cost, more complex for MVP)
- **Future**: Migrate to AWS for scalability (auto-scaling, global infrastructure)

---

**Last Updated**: 2026-01-20 by AI Planning Command  
**Version**: 1.0 (Comprehensive Architecture Document)  
**Status**: Ready for Expert Review
