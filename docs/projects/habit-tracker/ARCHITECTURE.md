# Habit Tracker (HabitFlow) - Technical Architecture

**Status**: Planning  
**Last Updated**: 2026-01-22

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Mobile Architecture](#mobile-architecture)
5. [Database Architecture](#database-architecture)
6. [Infrastructure Architecture](#infrastructure-architecture)
7. [Security Architecture](#security-architecture)
8. [Integration Architecture](#integration-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  Web App (Next.js)              Mobile App (React Native)       │
│  - Responsive UI                - Offline Mode                  │
│  - Real-time Updates            - Push Notifications            │
│  - Progressive Web App          - Native Features               │
└────────────────┬────────────────────────────┬───────────────────┘
                 │                            │
                 ▼                            ▼
         ┌───────────────────────────────────────────────┐
         │         API Gateway (NestJS)                  │
         │  - RESTful API                                │
         │  - Authentication (JWT)                       │
         │  - Input Validation                           │
         │  - Rate Limiting                              │
         └───────────────┬───────────────────────────────┘
                         │
         ┌───────────────┼───────────────────────────────┐
         ▼               ▼                               ▼
┌─────────────┐  ┌─────────────┐              ┌─────────────┐
│  Database   │  │   Redis     │              │  External   │
│ PostgreSQL  │  │  (Cache &   │              │  Services   │
│             │  │   Queue)    │              │             │
│ - Habits    │  │             │              │ - SendGrid  │
│ - Users     │  │ - Sessions  │              │ - FCM       │
│ - Entries   │  │ - Jobs      │              │ - Analytics │
│ - Streaks   │  │ - Cache     │              │             │
└─────────────┘  └─────────────┘              └─────────────┘
```

### System Components

1. **Frontend (Next.js)**: Web application, responsive design, PWA
2. **Mobile (React Native)**: iOS/Android apps, offline-first, push notifications
3. **Backend (NestJS)**: RESTful API, business logic, authentication
4. **Database (PostgreSQL)**: Relational data storage, transactional
5. **Cache (Redis)**: Session management, caching, job queue
6. **External Services**: Email (SendGrid), Push (FCM), Analytics

### Data Flow

```
User Action (Check-in Habit)
     ↓
Frontend/Mobile App
     ↓
API Request (POST /api/habits/:id/entries)
     ↓
Backend (NestJS)
     ├─ Validate Request
     ├─ Check Authentication (JWT)
     ├─ Business Logic (Create Entry, Update Streak)
     ├─ Database Write (PostgreSQL)
     ├─ Cache Update (Redis)
     └─ Response to Client
     ↓
Update UI
```

### Technology Decisions

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Frontend Framework** | Next.js 15 (React) | SSR/SSG support, SEO, fast page loads, TypeScript support |
| **Backend Framework** | NestJS | Enterprise-grade, TypeScript, modular architecture, built-in features |
| **Database** | PostgreSQL 16 | Relational data, ACID transactions, JSON support, mature ecosystem |
| **ORM** | Prisma | Type-safe, migrations, great TypeScript support, query builder |
| **Mobile Framework** | React Native + Expo | Code reuse (React), fast development, native features, OTA updates |
| **Cache/Queue** | Redis 7 | Fast in-memory storage, pub/sub, job queue (Bull) |
| **Authentication** | JWT (RS256) | Stateless, scalable, secure, standard |
| **Hosting** | DigitalOcean | Cost-effective, managed services, easy scaling |
| **CI/CD** | GitHub Actions | Integrated with GitHub, free for public repos, flexible workflows |

---

## Frontend Architecture

### Next.js Application Structure

```
frontend/
├── app/                      # Next.js 15 App Router
│   ├── (auth)/              # Auth pages (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Dashboard pages (authenticated)
│   │   ├── page.tsx         # Main dashboard
│   │   ├── habits/
│   │   │   ├── page.tsx     # Habits list
│   │   │   └── [id]/        # Habit detail
│   │   ├── analytics/
│   │   │   └── page.tsx     # Analytics dashboard
│   │   └── settings/
│   │       └── page.tsx     # User settings
│   ├── api/                 # API routes (if needed)
│   │   └── auth/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── habits/              # Habit-specific components
│   │   ├── HabitCard.tsx
│   │   ├── HabitList.tsx
│   │   ├── CheckInButton.tsx
│   │   └── StreakDisplay.tsx
│   ├── analytics/           # Analytics components
│   │   ├── CompletionChart.tsx
│   │   └── StreakCalendar.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/                     # Utility functions
│   ├── api.ts               # API client
│   ├── auth.ts              # Authentication helpers
│   └── utils.ts             # General utilities
├── hooks/                   # Custom React hooks
│   ├── useHabits.ts
│   ├── useAuth.ts
│   └── useAnalytics.ts
├── contexts/                # React contexts
│   └── AuthContext.tsx
├── types/                   # TypeScript types
│   ├── habit.ts
│   ├── user.ts
│   └── api.ts
└── styles/                  # Global styles
    └── globals.css          # Tailwind CSS
```

### State Management

**Approach**: React Context API + SWR for data fetching

**Why Not Redux/Zustand?**:
- Context API sufficient for MVP (auth state, user preferences)
- SWR handles server state elegantly (caching, revalidation)
- Reduces bundle size and complexity

**Context Structure**:

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
}

// Usage with SWR for data fetching
const { data: habits, mutate } = useSWR<Habit[]>(
  '/api/habits',
  fetcher,
  {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  }
);
```

### UI Component Library

**Primary**: Custom components + shadcn/ui
**Why**: Type-safe, customizable, Tailwind CSS-based, great DX

**Key Components**:
- `HabitCard`: Display habit with quick check-in button
- `StreakDisplay`: Visual streak counter with calendar
- `CompletionChart`: Line/bar chart for analytics
- `CheckInButton`: One-tap check-in with animation
- `ReminderSettings`: Configure reminder times

### Responsive Design

**Approach**: Mobile-first, responsive breakpoints

**Breakpoints** (Tailwind CSS defaults):
- **sm**: 640px (small devices)
- **md**: 768px (tablets)
- **lg**: 1024px (desktops)
- **xl**: 1280px (large desktops)

**Design Patterns**:
- Bottom navigation bar (mobile)
- Sidebar navigation (desktop)
- Collapsible cards on mobile
- Horizontal scroll for habit cards on mobile

### Performance Optimization

1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Next.js Image component
3. **Lazy Loading**: Dynamic imports for heavy components
4. **Caching**: SWR caching strategy
5. **Bundle Size**: Tree-shaking, minimize dependencies

**Performance Targets**:
- **First Contentful Paint (FCP)**: <1.5s
- **Time to Interactive (TTI)**: <3s
- **Largest Contentful Paint (LCP)**: <2.5s

---

## Backend Architecture

### NestJS Application Structure

```
backend/
├── src/
│   ├── app.module.ts        # Root module
│   ├── main.ts              # Application entry point
│   ├── auth/                # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts  # JWT logic, password hashing
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts  # JWT strategy
│   │   └── dto/             # DTOs for auth
│   ├── users/               # Users module
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   ├── habits/              # Habits module
│   │   ├── habits.module.ts
│   │   ├── habits.service.ts
│   │   ├── habits.controller.ts
│   │   ├── entities/
│   │   │   └── habit.entity.ts
│   │   └── dto/
│   ├── habit-entries/       # Habit entries module
│   │   ├── habit-entries.module.ts
│   │   ├── habit-entries.service.ts
│   │   ├── habit-entries.controller.ts
│   │   ├── entities/
│   │   │   └── habit-entry.entity.ts
│   │   └── dto/
│   ├── streaks/             # Streaks module
│   │   ├── streaks.module.ts
│   │   ├── streaks.service.ts
│   │   ├── streaks.controller.ts
│   │   └── entities/
│   ├── analytics/           # Analytics module
│   │   ├── analytics.module.ts
│   │   ├── analytics.service.ts
│   │   ├── analytics.controller.ts
│   │   └── dto/
│   ├── reminders/           # Reminders module
│   │   ├── reminders.module.ts
│   │   ├── reminders.service.ts
│   │   ├── reminders.controller.ts
│   │   └── entities/
│   ├── notifications/       # Notifications module
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts  # Email, push
│   │   └── dto/
│   ├── common/              # Shared code
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth guards
│   │   ├── interceptors/    # Logging, transform
│   │   ├── pipes/           # Validation pipes
│   │   └── filters/         # Exception filters
│   └── config/              # Configuration
│       ├── database.config.ts
│       └── jwt.config.ts
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── test/                    # Tests
│   ├── e2e/                 # End-to-end tests
│   └── unit/                # Unit tests
└── package.json
```

### API Design

**RESTful API Conventions**:

```
# Authentication
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login user
POST   /api/auth/refresh         # Refresh JWT token
POST   /api/auth/logout          # Logout user
POST   /api/auth/forgot-password # Request password reset
POST   /api/auth/reset-password  # Reset password

# Users
GET    /api/users/me             # Get current user
PUT    /api/users/me             # Update current user
DELETE /api/users/me             # Delete account

# Habits
GET    /api/habits               # List all habits
POST   /api/habits               # Create habit
GET    /api/habits/:id           # Get habit details
PUT    /api/habits/:id           # Update habit
DELETE /api/habits/:id           # Delete habit

# Habit Entries
GET    /api/habits/:id/entries   # Get habit entries
POST   /api/habits/:id/entries   # Check-in habit
GET    /api/entries/:id          # Get entry details
PUT    /api/entries/:id          # Update entry (notes)
DELETE /api/entries/:id          # Delete entry

# Streaks
GET    /api/habits/:id/streak    # Get habit streak
GET    /api/streaks              # Get all streaks

# Analytics
GET    /api/analytics            # Get analytics summary
GET    /api/analytics/trends     # Get trends over time
GET    /api/analytics/patterns   # Get pattern analysis

# Reminders
GET    /api/reminders            # Get all reminders
POST   /api/reminders            # Create reminder
PUT    /api/reminders/:id        # Update reminder
DELETE /api/reminders/:id        # Delete reminder
```

### Authentication Flow

```typescript
// JWT Authentication Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}

// Auth Guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Usage in Controllers
@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  @Get()
  async findAll(@Request() req) {
    return this.habitsService.findAll(req.user.userId);
  }
}
```

### Business Logic Examples

**Streak Calculation**:

```typescript
// services/streaks.service.ts
@Injectable()
export class StreaksService {
  async calculateStreak(habitId: string, userId: string): Promise<Streak> {
    const entries = await this.prisma.habitEntry.findMany({
      where: { habitId, userId },
      orderBy: { date: 'desc' },
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate streaks from entries
    const today = new Date();
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      const daysDiff = this.getDaysDifference(today, entryDate);

      if (daysDiff === i) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        if (i === 0) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }
    }

    return { currentStreak, longestStreak };
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### Background Jobs

**Bull Queue** for background tasks:

```typescript
// reminders/reminders.processor.ts
@Processor('reminders')
export class RemindersProcessor {
  @Process('send-daily-reminders')
  async handleSendReminders(job: Job) {
    const reminders = await this.remindersService.getDueReminders();
    
    for (const reminder of reminders) {
      await this.notificationsService.sendReminder(
        reminder.userId,
        reminder.habitId,
        reminder.type // 'email' | 'push'
      );
    }
  }

  @Process('send-streak-alerts')
  async handleStreakAlerts(job: Job) {
    const atRiskStreaks = await this.streaksService.getAtRiskStreaks();
    
    for (const streak of atRiskStreaks) {
      await this.notificationsService.sendStreakAlert(
        streak.userId,
        streak.habitId,
        streak.currentStreak
      );
    }
  }
}

// Schedule jobs with Cron
@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('reminders') private remindersQueue: Queue,
  ) {}

  @Cron('0 8 * * *') // Every day at 8 AM
  async scheduleDailyReminders() {
    await this.remindersQueue.add('send-daily-reminders', {});
  }

  @Cron('0 20 * * *') // Every day at 8 PM
  async scheduleStreakAlerts() {
    await this.remindersQueue.add('send-streak-alerts', {});
  }
}
```

---

## Mobile Architecture

### React Native Application Structure

```
mobile/
├── src/
│   ├── screens/             # Screen components
│   │   ├── AuthScreens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── MainScreens/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── HabitsScreen.tsx
│   │   │   ├── HabitDetailScreen.tsx
│   │   │   └── AnalyticsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/          # Reusable components
│   │   ├── HabitCard.tsx
│   │   ├── CheckInButton.tsx
│   │   └── StreakDisplay.tsx
│   ├── navigation/          # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── services/            # API services
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth service
│   │   └── storage.ts       # AsyncStorage
│   ├── hooks/               # Custom hooks
│   │   ├── useHabits.ts
│   │   └── useAuth.ts
│   ├── store/               # State management
│   │   └── authStore.ts     # Zustand store (lightweight)
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   └── types/               # TypeScript types
│       └── index.ts
├── assets/                  # Images, fonts
├── app.json                 # Expo config
└── package.json
```

### Offline-First Architecture

**Strategy**: Store data locally, sync when online

```typescript
// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineStorage {
  // Save check-in offline
  async saveCheckInOffline(habitId: string, date: Date): Promise<void> {
    const offlineCheckIns = await this.getOfflineCheckIns();
    offlineCheckIns.push({ habitId, date, timestamp: Date.now() });
    await AsyncStorage.setItem('offline_check_ins', JSON.stringify(offlineCheckIns));
  }

  // Sync offline check-ins when online
  async syncOfflineCheckIns(): Promise<void> {
    const offlineCheckIns = await this.getOfflineCheckIns();
    
    for (const checkIn of offlineCheckIns) {
      try {
        await api.post(`/habits/${checkIn.habitId}/entries`, {
          date: checkIn.date,
        });
        // Remove synced check-in from offline storage
        await this.removeOfflineCheckIn(checkIn);
      } catch (error) {
        console.error('Failed to sync check-in:', error);
      }
    }
  }

  private async getOfflineCheckIns(): Promise<OfflineCheckIn[]> {
    const stored = await AsyncStorage.getItem('offline_check_ins');
    return stored ? JSON.parse(stored) : [];
  }
}

// App.tsx - Setup sync on network change
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    offlineStorage.syncOfflineCheckIns();
  }
});
```

### Push Notifications

**Firebase Cloud Messaging (FCM)**:

```typescript
// services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export class NotificationService {
  async requestPermission(): Promise<void> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await this.getFCMToken();
    }
  }

  async getFCMToken(): Promise<string> {
    const token = await messaging().getToken();
    // Send token to backend
    await api.post('/users/fcm-token', { token });
    return token;
  }

  setupNotificationHandlers(): void {
    // Foreground messages
    messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body,
      });
    });

    // Background/quit state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
    });
  }
}
```

---

## Database Architecture

### Database Schema (Prisma)

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
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  habits        Habit[]
  habitEntries  HabitEntry[]
  reminders     Reminder[]
  
  @@index([email])
}

model Habit {
  id            String    @id @default(uuid())
  userId        String
  name          String
  description   String?
  category      String
  frequency     String    // 'daily', 'weekly', 'custom'
  icon          String?
  color         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  entries       HabitEntry[]
  reminders     Reminder[]
  
  @@index([userId])
  @@index([userId, isActive])
}

model HabitEntry {
  id            String    @id @default(uuid())
  habitId       String
  userId        String
  date          DateTime  @db.Date
  completed     Boolean   @default(true)
  quantity      Int?      // For quantity tracking (e.g., glasses of water)
  duration      Int?      // For time tracking (minutes)
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  habit         Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([habitId, date])
  @@index([userId, date])
  @@index([habitId, date])
}

model Reminder {
  id            String    @id @default(uuid())
  userId        String
  habitId       String
  time          String    // Time in HH:MM format
  enabled       Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  habit         Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([habitId])
}
```

### Indexing Strategy

**Key Indexes**:
1. `User.email` - Unique index for login lookups
2. `Habit.userId` - Find user's habits
3. `Habit.userId + isActive` - Find active habits only
4. `HabitEntry.userId + date` - Find entries by date range
5. `HabitEntry.habitId + date` - Unique constraint, find habit entries

**Query Optimization**:
- Use composite indexes for common query patterns
- Unique constraints prevent duplicate check-ins
- Cascade deletes maintain data integrity

### Data Migration Strategy

**Prisma Migrations**:

```bash
# Create migration
npx prisma migrate dev --name add_reminders_table

# Apply migration to production
npx prisma migrate deploy

# Rollback (manual)
# Prisma doesn't support automatic rollback
# Create new migration that reverts changes
```

### Backup Strategy

**Automated Backups** (DigitalOcean Managed Database):
- **Frequency**: Daily automated backups
- **Retention**: 7-day retention for daily backups
- **Point-in-Time Recovery**: 24-hour window
- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 24 hours

**Manual Backup**:

```bash
# Export database to SQL file
pg_dump -h <host> -U <user> -d habitflow_db > backup.sql

# Restore from backup
psql -h <host> -U <user> -d habitflow_db < backup.sql
```

---

## Infrastructure Architecture

### Hosting Architecture (DigitalOcean)

```
┌─────────────────────────────────────────────────────────────┐
│                   DigitalOcean Cloud                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          App Platform (Frontend & Backend)           │   │
│  │                                                      │   │
│  │  ┌─────────────────┐      ┌──────────────────┐     │   │
│  │  │  Frontend       │      │  Backend         │     │   │
│  │  │  (Next.js)      │      │  (NestJS)        │     │   │
│  │  │  Docker         │      │  Docker          │     │   │
│  │  │  Container      │      │  Container       │     │   │
│  │  └─────────────────┘      └──────────────────┘     │   │
│  │                                                      │   │
│  │  Auto-scaling: 1-3 containers                       │   │
│  │  Load Balancing: Automatic                          │   │
│  │  HTTPS: Automatic SSL                               │   │
│  └──────────────────┬───────────────────────────────────   │
│                     │                                       │
│  ┌──────────────────┼───────────────────────────────┐      │
│  │                  ▼                               │      │
│  │  ┌─────────────────┐      ┌──────────────────┐  │      │
│  │  │  PostgreSQL     │      │  Redis           │  │      │
│  │  │  (Managed)      │      │  (Managed)       │  │      │
│  │  │                 │      │                  │  │      │
│  │  │  - Automated    │      │  - Session Store │  │      │
│  │  │    Backups      │      │  - Job Queue     │  │      │
│  │  │  - High         │      │  - Cache         │  │      │
│  │  │    Availability │      │                  │  │      │
│  │  └─────────────────┘      └──────────────────┘  │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean

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
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to DigitalOcean App Platform
        uses: digitalocean/app_action@v1
        with:
          app_name: habitflow
          token: ${{ secrets.DIGITALOCEAN_TOKEN }}
```

### Docker Configuration

**Frontend Dockerfile**:

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

**Backend Dockerfile**:

```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start:prod"]
```

### Monitoring & Logging

**Logging Stack**:
- **Application Logs**: Winston (structured JSON logs)
- **HTTP Logs**: Morgan (HTTP request/response logs)
- **Error Tracking**: Sentry (error monitoring, alerting)

**Monitoring**:
- **DigitalOcean Monitoring**: CPU, memory, disk, network
- **Application Metrics**: Custom metrics via Prometheus
- **Uptime Monitoring**: UptimeRobot (external monitoring)

**Logging Configuration**:

```typescript
// backend/src/config/logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});
```

---

## Security Architecture

### Authentication & Authorization

**JWT Authentication**:
- **Algorithm**: RS256 (asymmetric encryption)
- **Token Expiry**: Access token (15 minutes), Refresh token (7 days)
- **Storage**: HttpOnly cookies (web), SecureStore (mobile)

**Password Security**:
- **Hashing**: bcrypt with salt rounds = 10
- **Validation**: Minimum 8 characters, uppercase, lowercase, number

**Security Flow**:

```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Generate JWT (Access + Refresh)
   ↓
4. Store Refresh Token (HttpOnly Cookie)
   ↓
5. Return Access Token
   ↓
6. Client Stores Access Token (Memory/SecureStore)
   ↓
7. Include Access Token in API Requests (Authorization: Bearer <token>)
   ↓
8. Backend Validates Token
   ↓
9. If Expired, Use Refresh Token to Get New Access Token
```

### Data Encryption

1. **Encryption at Rest**:
   - **Database**: DigitalOcean managed database with encryption
   - **Backups**: Encrypted database backups

2. **Encryption in Transit**:
   - **HTTPS/TLS 1.3**: All API communication
   - **Certificate**: Let's Encrypt SSL (automatic renewal)

3. **Sensitive Data**:
   - **Passwords**: bcrypt hashing
   - **JWT Secrets**: Environment variables, never hardcoded
   - **API Keys**: Environment variables, never committed to git

### Security Best Practices

1. **Input Validation**: Class-validator for DTO validation
2. **SQL Injection Prevention**: Prisma ORM (parameterized queries)
3. **XSS Prevention**: Content Security Policy headers
4. **CSRF Prevention**: SameSite cookies, CSRF tokens
5. **Rate Limiting**: Throttler module (100 requests per 15 minutes)
6. **CORS**: Strict CORS policy (whitelist origins)

**Rate Limiting Configuration**:

```typescript
// backend/src/app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // 100 requests per 60 seconds
    }),
  ],
})
export class AppModule {}
```

### GDPR/CCPA Compliance

1. **Data Privacy**:
   - User consent for data collection
   - Privacy policy and terms of service
   - Data retention policy

2. **User Rights**:
   - Right to access data (export endpoint)
   - Right to deletion (delete account endpoint)
   - Right to rectification (update user data)

3. **Data Export**:

```typescript
// users/users.controller.ts
@Get('export')
@UseGuards(JwtAuthGuard)
async exportUserData(@Request() req) {
  const userData = await this.usersService.exportUserData(req.user.userId);
  return {
    user: userData.user,
    habits: userData.habits,
    entries: userData.entries,
  };
}
```

---

## Integration Architecture

### Email Service (SendGrid)

**Purpose**: Reminder emails, password reset, welcome emails

```typescript
// notifications/notifications.service.ts
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendReminderEmail(userId: string, habitName: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    
    const msg = {
      to: user.email,
      from: 'reminders@habitflow.app',
      subject: `Don't forget: ${habitName}`,
      html: `<p>Hi ${user.name},</p>
             <p>This is a reminder to complete your habit: <strong>${habitName}</strong></p>
             <p><a href="https://habitflow.app/habits">Check it off now</a></p>`,
    };

    await sgMail.send(msg);
  }
}
```

### Push Notifications (Firebase Cloud Messaging)

**Purpose**: Mobile push notifications for reminders

```typescript
// notifications/notifications.service.ts
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
  }

  async sendPushNotification(
    fcmToken: string,
    title: string,
    body: string,
  ): Promise<void> {
    const message = {
      notification: { title, body },
      token: fcmToken,
    };

    await admin.messaging().send(message);
  }
}
```

### Future Integrations (Phase 4)

1. **Fitbit API**: Sync workout habits
2. **Apple Health**: Sync health data
3. **Google Fit**: Sync fitness data
4. **Calendar Integration**: Sync with Google Calendar, Apple Calendar

---

## Performance Considerations

### Caching Strategy

**Redis Caching**:

```typescript
// cache/cache.service.ts
@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getHabitsCached(userId: string): Promise<Habit[]> {
    const cacheKey = `habits:${userId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const habits = await this.prisma.habit.findMany({
      where: { userId },
    });

    await this.redis.set(cacheKey, JSON.stringify(habits), 'EX', 300); // 5 minutes
    return habits;
  }

  async invalidateHabitsCache(userId: string): Promise<void> {
    await this.redis.del(`habits:${userId}`);
  }
}
```

### Database Query Optimization

1. **Selective Fetching**: Only fetch needed columns
2. **Pagination**: Limit results with pagination
3. **Joins**: Use Prisma `include` for efficient joins
4. **Indexes**: Strategic indexes on frequently queried columns

**Example Optimized Query**:

```typescript
// Fetch habits with entries for last 30 days
const habits = await this.prisma.habit.findMany({
  where: { userId },
  select: {
    id: true,
    name: true,
    category: true,
    entries: {
      where: {
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'desc' },
    },
  },
});
```

### Response Time Targets

- **API Endpoints**: <300ms (95th percentile)
- **Database Queries**: <100ms (95th percentile)
- **Page Load**: <2s (First Contentful Paint)
- **Mobile App**: <1s (Screen transitions)

---

## Scalability Plan

### Phase 1 (MVP): 0-10K Users
- **Hosting**: Single DigitalOcean droplet
- **Database**: Managed PostgreSQL (1 GB RAM)
- **Redis**: Single instance
- **Scaling**: Vertical scaling (increase resources)

### Phase 2: 10K-100K Users
- **Hosting**: 2-3 app containers (auto-scaling)
- **Database**: Managed PostgreSQL (4 GB RAM)
- **Redis**: Redis cluster (2 nodes)
- **CDN**: CloudFlare for static assets
- **Scaling**: Horizontal scaling (more containers)

### Phase 3: 100K+ Users
- **Hosting**: Load balancer + multiple app containers
- **Database**: PostgreSQL read replicas (1 primary, 2 replicas)
- **Redis**: Redis cluster (3+ nodes)
- **CDN**: CloudFlare for static assets + API caching
- **Scaling**: Multi-region deployment

---

## Testing Strategy

### Unit Tests

```typescript
// habits/habits.service.spec.ts
describe('HabitsService', () => {
  let service: HabitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitsService, PrismaService],
    }).compile();

    service = module.get<HabitsService>(HabitsService);
  });

  it('should create a habit', async () => {
    const habitDto = { name: 'Exercise', category: 'Health' };
    const result = await service.create(userId, habitDto);
    expect(result.name).toBe('Exercise');
  });
});
```

### Integration Tests

```typescript
// habits/habits.e2e-spec.ts
describe('Habits (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    authToken = loginResponse.body.accessToken;
  });

  it('/habits (GET)', () => {
    return request(app.getHttpServer())
      .get('/habits')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

### Testing Coverage Targets

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main user journeys (signup, login, check-in habit)
- **Performance Tests**: Load testing (1000+ concurrent users)

---

## Deployment Strategy

### Environment Setup

1. **Development**: Local development (Docker Compose)
2. **Staging**: DigitalOcean staging environment (testing)
3. **Production**: DigitalOcean production environment (live)

### Deployment Process

1. **Code Push**: Push code to GitHub (main branch)
2. **CI/CD Trigger**: GitHub Actions runs tests
3. **Build**: Docker images built
4. **Deploy**: Deploy to DigitalOcean App Platform
5. **Migration**: Run database migrations
6. **Health Check**: Verify deployment success
7. **Rollback**: Automatic rollback on failure

### Blue-Green Deployment

```
┌─────────────┐
│  Load       │
│  Balancer   │
└─────┬───────┘
      │
      ├─────────► Blue (Current Production)
      │           - Version 1.0.0
      │           - Handles 100% traffic
      │
      └─────────► Green (New Version)
                  - Version 1.1.0
                  - No traffic initially
                  - Switch traffic after testing
```

---

**Last Updated**: 2026-01-22  
**Status**: Planning  
**Next Steps**: Expert reviews, refine architecture, begin implementation

---

## Review/Contribution

**Expert**: Marcus Johnson  
**Expertise**: System Architecture and Scalability  
**Date**: 2026-01-22  
**Status**: ⏳ Pending Review  
**Changes**: Created comprehensive technical architecture document covering system overview, frontend architecture (Next.js with app router, state management with React Context + SWR, responsive design, performance optimization), backend architecture (NestJS modular structure, RESTful API design, authentication flow, business logic examples, background jobs with Bull), mobile architecture (React Native structure, offline-first with AsyncStorage, push notifications with FCM), database architecture (Prisma schema, indexing strategy, migrations, backup strategy), infrastructure architecture (DigitalOcean hosting, CI/CD with GitHub Actions, Docker configuration, monitoring and logging), security architecture (JWT authentication, data encryption, security best practices, GDPR/CCPA compliance), integration architecture (SendGrid for email, FCM for push notifications, future integrations), performance considerations (caching with Redis, query optimization, response time targets), scalability plan (3 phases from MVP to 100K+ users), testing strategy (unit, integration, E2E tests with coverage targets), and deployment strategy (environment setup, CI/CD pipeline, blue-green deployment). This architecture provides a complete technical blueprint for building HabitFlow from MVP to scalable production system.

_All other experts pending initial review._
