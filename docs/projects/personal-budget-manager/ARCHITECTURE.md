# Personal Budget Manager - Architecture

## System Overview

Personal Budget Manager (BudgetFlow) is a full-stack web and mobile application built with a modern, scalable architecture. The system follows a three-tier architecture pattern with clear separation between presentation (frontend), business logic (backend), and data persistence (database) layers.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────┬───────────────────────────────────────┤
│   Web Application   │        Mobile Application             │
│   (Next.js + React) │     (React Native + Expo)             │
│   • Dashboard UI    │     • Quick Expense Entry             │
│   • Budget Tracking │     • Offline Mode                     │
│   • Reports         │     • Push Notifications               │
│   • Settings        │     • Receipt Scanning                 │
└─────────────────────┴───────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway / Backend                    │
│                     (NestJS + Node.js)                       │
├─────────────────────────────────────────────────────────────┤
│   • Authentication (JWT)                                     │
│   • RESTful API Endpoints                                    │
│   • Business Logic Layer                                     │
│   • Background Job Processing (Bull + Redis)                 │
│   • Email Service (Nodemailer)                               │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │PostgreSQL│  │  Redis   │  │  S3      │
        │ Database │  │  Cache   │  │ Receipts │
        └──────────┘  └──────────┘  └──────────┘
```

### System Components

1. **Frontend Layer**:
   - **Web App**: Next.js (React) with TypeScript, responsive design
   - **Mobile App**: React Native (Expo) for iOS and Android

2. **Backend Layer**:
   - **API Server**: NestJS (Node.js) with TypeScript
   - **Authentication**: JWT tokens with bcrypt password hashing
   - **Background Jobs**: Bull + Redis for email queue and scheduled tasks

3. **Data Layer**:
   - **Database**: PostgreSQL 16 (primary data store)
   - **Cache**: Redis (session cache, job queue)
   - **Storage**: S3-compatible storage for receipts (future)

4. **External Services**:
   - **Email**: Nodemailer (dev), SendGrid/Mailgun (production)
   - **Bank Integration**: Plaid API (Phase 3)
   - **OCR**: Tesseract.js or Cloud OCR (Phase 2)

## Frontend Architecture

### Web Application (Next.js)

#### Technology Stack
- **Framework**: Next.js 15 (React 18) with App Router
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind)
- **Data Fetching**: SWR for client-side data fetching and caching
- **Charts**: Recharts for data visualization
- **Form Validation**: Zod for schema validation
- **State Management**: React Context + SWR (no Redux needed for MVP)

#### Component Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Authenticated routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── expenses/        # Expense management
│   │   ├── budgets/         # Budget management
│   │   ├── reports/         # Financial reports
│   │   └── settings/        # User settings
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # Reusable components
│   ├── ui/                 # UI primitives (shadcn/ui)
│   ├── dashboard/          # Dashboard-specific components
│   ├── expenses/           # Expense-related components
│   ├── budgets/            # Budget-related components
│   └── charts/             # Chart components
├── lib/                    # Utility libraries
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth utilities
│   ├── utils.ts           # Helper functions
│   └── validations.ts     # Zod schemas
├── hooks/                  # Custom React hooks
│   ├── useExpenses.ts     # Expense data hook
│   ├── useBudgets.ts      # Budget data hook
│   └── useAuth.ts         # Auth hook
└── types/                  # TypeScript types
    ├── expense.ts
    ├── budget.ts
    └── user.ts
```

#### Key Frontend Features

**1. Dashboard Component**
```typescript
// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useExpenses } from '@/hooks/useExpenses';
import { useBudgets } from '@/hooks/useBudgets';
import { ExpenseSummary } from '@/components/dashboard/expense-summary';
import { BudgetProgress } from '@/components/dashboard/budget-progress';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { QuickAddExpense } from '@/components/expenses/quick-add-expense';

export default function DashboardPage() {
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { budgets, isLoading: budgetsLoading } = useBudgets();

  if (expensesLoading || budgetsLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExpenseSummary expenses={expenses} />
        <BudgetProgress budgets={budgets} expenses={expenses} />
        <QuickAddExpense />
      </div>
      
      <RecentExpenses expenses={expenses.slice(0, 10)} />
    </div>
  );
}
```

**2. State Management Pattern**
```typescript
// src/hooks/useExpenses.ts
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Expense } from '@/types/expense';

export function useExpenses(filters?: { categoryId?: string; startDate?: Date; endDate?: Date }) {
  const { data, error, mutate } = useSWR<Expense[]>(
    ['/api/expenses', filters],
    ([url, filters]) => api.get(url, { params: filters })
  );

  return {
    expenses: data ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate, // For optimistic updates
  };
}
```

**3. API Client**
```typescript
// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### Responsive Design

- **Mobile-First Approach**: Design for mobile (320px+) first, scale up
- **Breakpoints**:
  - `sm`: 640px (tablets)
  - `md`: 768px (small laptops)
  - `lg`: 1024px (desktops)
  - `xl`: 1280px (large desktops)
- **Touch-Friendly**: 44x44px minimum touch target size (WCAG AA)
- **Accessibility**: WCAG 2.1 AA compliance (keyboard navigation, screen reader support)

### Mobile Application (React Native)

#### Technology Stack (Phase 2)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context + SWR
- **Offline Support**: AsyncStorage + background sync
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Camera**: expo-camera for receipt scanning

#### Mobile-Specific Features
- **Quick Expense Entry**: Optimized for one-handed use
- **Offline Mode**: Store expenses locally, sync when online
- **Receipt Scanning**: Camera-based receipt capture with OCR
- **Push Notifications**: Budget alerts, bill reminders
- **Biometric Auth**: Face ID, Touch ID, Fingerprint support

## Backend Architecture

### API Server (NestJS)

#### Technology Stack
- **Framework**: NestJS (Node.js) with TypeScript
- **API Type**: RESTful API with OpenAPI documentation
- **ORM**: Prisma for type-safe database access
- **Authentication**: JWT tokens with Passport.js
- **Validation**: class-validator and class-transformer
- **Logging**: Winston for structured logging
- **Error Tracking**: Sentry for production error monitoring

#### Module Structure

```
src/
├── main.ts                  # Application entry point
├── app.module.ts            # Root module
├── auth/                    # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── users/                   # User management
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── expenses/                # Expense management
│   ├── expenses.module.ts
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│   └── dto/
├── budgets/                 # Budget management
│   ├── budgets.module.ts
│   ├── budgets.controller.ts
│   ├── budgets.service.ts
│   └── dto/
├── categories/              # Category management
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── dto/
├── notifications/           # Notification service
│   ├── notifications.module.ts
│   ├── notifications.service.ts
│   ├── email.service.ts
│   └── queue/
├── common/                  # Shared utilities
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   └── decorators/
└── prisma/                  # Database client
    ├── prisma.module.ts
    └── prisma.service.ts
```

#### Key Backend Features

**1. Authentication Service**
```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return this.generateTokens(user.id);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  private generateTokens(userId: string) {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
```

**2. Expense Service**
```typescript
// src/expenses/expenses.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(userId: string, filters?: { categoryId?: string; startDate?: Date; endDate?: Date }) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        categoryId: filters?.categoryId,
        date: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    // Verify ownership
    const expense = await this.prisma.expense.findUnique({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expense.update({
      where: { id },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string, userId: string) {
    // Verify ownership
    const expense = await this.prisma.expense.findUnique({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expense.delete({
      where: { id },
    });
  }
}
```

**3. Budget Alert Service**
```typescript
// src/notifications/budget-alert.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class BudgetAlertService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async checkBudgetAlerts() {
    // Get all active budgets with current month spending
    const budgets = await this.prisma.budget.findMany({
      include: {
        user: true,
        category: true,
        expenses: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lte: new Date(),
            },
          },
        },
      },
    });

    for (const budget of budgets) {
      const totalSpent = budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = (totalSpent / budget.amount) * 100;

      // Check for alert thresholds
      if (percentage >= 100 && !budget.alert100Sent) {
        await this.sendBudgetAlert(budget, 'exceeded', percentage);
        await this.prisma.budget.update({
          where: { id: budget.id },
          data: { alert100Sent: true },
        });
      } else if (percentage >= 80 && !budget.alert80Sent) {
        await this.sendBudgetAlert(budget, 'warning', percentage);
        await this.prisma.budget.update({
          where: { id: budget.id },
          data: { alert80Sent: true },
        });
      }
    }
  }

  private async sendBudgetAlert(budget: any, type: 'warning' | 'exceeded', percentage: number) {
    const subject = type === 'warning' 
      ? `Budget Warning: ${budget.category.name}`
      : `Budget Exceeded: ${budget.category.name}`;

    const message = `
      You've spent ${percentage.toFixed(0)}% of your ${budget.category.name} budget.
      Budget: $${budget.amount}
      Spent: $${budget.expenses.reduce((sum, exp) => sum + exp.amount, 0)}
    `;

    await this.emailService.sendEmail({
      to: budget.user.email,
      subject,
      text: message,
    });
  }
}
```

### API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
POST   /api/auth/refresh        # Refresh access token
POST   /api/auth/logout         # Logout user
POST   /api/auth/forgot-password # Request password reset
POST   /api/auth/reset-password  # Reset password
```

#### Expense Endpoints
```
GET    /api/expenses            # Get all expenses (with filters)
GET    /api/expenses/:id        # Get expense by ID
POST   /api/expenses            # Create new expense
PUT    /api/expenses/:id        # Update expense
DELETE /api/expenses/:id        # Delete expense
```

#### Budget Endpoints
```
GET    /api/budgets             # Get all budgets
GET    /api/budgets/:id         # Get budget by ID
POST   /api/budgets             # Create new budget
PUT    /api/budgets/:id         # Update budget
DELETE /api/budgets/:id         # Delete budget
GET    /api/budgets/:id/status  # Get budget status (current spending vs. budget)
```

#### Category Endpoints
```
GET    /api/categories          # Get all categories
GET    /api/categories/:id      # Get category by ID
POST   /api/categories          # Create custom category
PUT    /api/categories/:id      # Update category
DELETE /api/categories/:id      # Delete category
```

#### User Endpoints
```
GET    /api/users/me            # Get current user profile
PUT    /api/users/me            # Update user profile
GET    /api/users/me/settings   # Get user settings
PUT    /api/users/me/settings   # Update user settings
```

## Data Architecture

### Database Schema (PostgreSQL)

#### Core Tables

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Categories Table**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
```

**Expenses Table**
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
```

**Budgets Table**
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly', -- monthly, weekly, yearly
  start_date DATE NOT NULL,
  end_date DATE,
  alert_80_sent BOOLEAN DEFAULT FALSE,
  alert_100_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
```

#### Prisma Schema

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
  id               String   @id @default(uuid())
  email            String   @unique
  password         String
  firstName        String?  @map("first_name")
  lastName         String?  @map("last_name")
  isPremium        Boolean  @default(false) @map("is_premium")
  premiumExpiresAt DateTime? @map("premium_expires_at")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  expenses   Expense[]
  budgets    Budget[]
  categories Category[]

  @@map("users")
}

model Category {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  name      String
  icon      String?
  color     String?
  isDefault Boolean  @default(false) @map("is_default")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses Expense[]
  budgets  Budget[]

  @@index([userId])
  @@map("categories")
}

model Expense {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  categoryId  String?  @map("category_id")
  amount      Decimal  @db.Decimal(10, 2)
  description String?
  date        DateTime
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([categoryId])
  @@index([date])
  @@index([userId, date])
  @@map("expenses")
}

model Budget {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  categoryId   String   @map("category_id")
  amount       Decimal  @db.Decimal(10, 2)
  period       String   @default("monthly")
  startDate    DateTime @map("start_date")
  endDate      DateTime? @map("end_date")
  alert80Sent  Boolean  @default(false) @map("alert_80_sent")
  alert100Sent Boolean  @default(false) @map("alert_100_sent")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([categoryId])
  @@map("budgets")
}
```

### Query Optimization

**1. Indexes for Performance**
- User ID indexes on all user-related tables
- Date indexes on expenses for time-range queries
- Composite index on (user_id, date) for user-specific date queries

**2. Connection Pooling**
```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
```

**3. Pagination**
```typescript
// Paginate large result sets
async findAll(userId: string, page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;
  
  const [expenses, total] = await Promise.all([
    this.prisma.expense.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    }),
    this.prisma.expense.count({ where: { userId } }),
  ]);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

## Security Architecture

### Authentication Flow

1. **User Registration**:
   - User submits email/password
   - Backend validates input
   - Password is hashed with bcrypt (10 rounds)
   - User record created in database
   - JWT access token and refresh token generated
   - Tokens returned to client

2. **User Login**:
   - User submits email/password
   - Backend validates credentials
   - Password compared with stored hash
   - JWT access token and refresh token generated
   - Tokens returned to client

3. **Authenticated Requests**:
   - Client includes JWT token in Authorization header
   - Backend validates JWT signature and expiration
   - User ID extracted from token payload
   - Request processed with user context

4. **Token Refresh**:
   - Client submits refresh token
   - Backend validates refresh token
   - New access token generated
   - New access token returned to client

### Authorization Model

**Role-Based Access Control (RBAC)**:
- **Free User**: Limited categories, 3-month history, basic reports
- **Premium User**: Unlimited categories, unlimited history, advanced features

**Data Access Control**:
- Users can only access their own data
- All queries filtered by user ID
- Ownership verification before updates/deletes

### Data Encryption

**Encryption at Rest**:
- Database encryption enabled (AES-256)
- Passwords hashed with bcrypt (never stored in plaintext)
- Sensitive data fields encrypted (if needed in future)

**Encryption in Transit**:
- TLS 1.3 for all API communication
- HTTPS only (HTTP redirect to HTTPS)
- Secure WebSocket connections (WSS) if needed

### Security Best Practices

1. **Input Validation**: All inputs validated with class-validator
2. **SQL Injection Prevention**: Prisma parameterized queries
3. **XSS Prevention**: React auto-escaping, CSP headers
4. **CSRF Protection**: CSRF tokens for state-changing requests
5. **Rate Limiting**: Prevent brute force attacks
6. **CORS Configuration**: Whitelist allowed origins
7. **Secure Headers**: Helmet.js for security headers
8. **Dependency Scanning**: Regular npm audit and Snyk scans

## Infrastructure Architecture

### MVP Infrastructure (DigitalOcean)

**Components**:
- **App Server**: DigitalOcean Droplet (2 vCPU, 4GB RAM)
- **Database**: DigitalOcean Managed PostgreSQL (1GB RAM, 10GB storage)
- **Redis**: DigitalOcean Managed Redis (1GB RAM)
- **CDN**: DigitalOcean Spaces CDN (for static assets)
- **Load Balancer**: DigitalOcean Load Balancer (when scaling)

**Estimated Costs**:
- App Server: $24/month
- Database: $15/month
- Redis: $15/month
- CDN: ~$5/month
- **Total**: ~$60/month

### Post-MVP Infrastructure (AWS)

**Components**:
- **Compute**: ECS Fargate (container orchestration)
- **Database**: RDS PostgreSQL with read replicas
- **Cache**: ElastiCache Redis
- **Storage**: S3 for receipts and static assets
- **CDN**: CloudFront for global content delivery
- **Email**: SES for transactional emails
- **Monitoring**: CloudWatch for logs and metrics

### CI/CD Pipeline

**GitHub Actions Workflow**:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Run tests
        run: npm run test
      - name: Run type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t budgetflow-api .
      - name: Push to registry
        run: docker push budgetflow-api

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deploy to DigitalOcean/AWS
```

### Monitoring & Logging

**Logging Strategy**:
- **Application Logs**: Winston structured logging
- **Access Logs**: HTTP request/response logging
- **Error Logs**: Sentry for error tracking and alerting
- **Audit Logs**: Track critical operations (user changes, financial transactions)

**Monitoring**:
- **Performance**: Response times, throughput, error rates
- **Infrastructure**: CPU, memory, disk usage
- **Database**: Query performance, connection pool status
- **Alerts**: Email/Slack alerts for critical issues

---

**Last Updated**: 2026-01-22  
**Status**: Planning - Ready for Expert Review  
**Next Steps**: Expert review, technology validation, MVP development
