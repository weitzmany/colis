# Mobile Learning Companion - Architecture

## System Overview

The Mobile Learning Companion follows an **offline-first architecture** with a clean separation between mobile client and backend API. The system is designed to enable practice sessions entirely offline, syncing progress when connectivity returns.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Mobile App (iOS/Android)                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          Angular 18 + Capacitor 6 + Ionic              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Components  │  │   Services   │  │   Guards    │  │  │
│  │  │  (UI Layer)  │  │ (Business    │  │  (Auth)     │  │  │
│  │  │              │  │  Logic)      │  │             │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │           Offline Storage (SQLite)                │  │  │
│  │  │  - Practice questions                              │  │  │
│  │  │  - User progress                                   │  │  │
│  │  │  - Pending sync queue                              │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS (REST API)
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Backend API (DigitalOcean)                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           PHP 8.2 + Slim Framework 4                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  Controllers │  │  Middleware  │  │   Models    │  │  │
│  │  │  (Endpoints) │  │   (Auth,     │  │ (Database)  │  │  │
│  │  │              │  │    CORS)     │  │             │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                            │                                  │
│                            │ PDO/MySQLi                       │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               MySQL 8.0 Database                       │  │
│  │  - users                                                │  │
│  │  - practice_sets                                        │  │
│  │  - questions                                            │  │
│  │  - user_progress                                        │  │
│  │  - user_answers                                         │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### System Components

1. **Mobile App (Client)**: Angular-based progressive web app wrapped with Capacitor for iOS/Android
2. **Backend API (Server)**: PHP/Slim RESTful API for authentication, content delivery, and progress sync
3. **Database**: MySQL relational database for structured data storage
4. **Push Notifications**: APNS (iOS) and FCM (Android) for reminders and alerts
5. **CI/CD Pipeline**: GitHub Actions for automated builds and deployments

### Technology Stack

**Frontend (Mobile)**:
- **Framework**: Angular 18 (with standalone components)
- **Mobile Wrapper**: Capacitor 6 (iOS & Android native capabilities)
- **UI Library**: Ionic Framework 7 (mobile-optimized components)
- **State Management**: RxJS + Angular Services (reactive programming)
- **HTTP Client**: Angular HttpClient with retry and caching strategies
- **Offline Storage**: Capacitor Storage Plugin (SQLite on mobile, IndexedDB on web)

**Backend (API)**:
- **Language**: PHP 8.2
- **Framework**: Slim Framework 4 (lightweight RESTful API framework)
- **Authentication**: JWT (JSON Web Tokens) using `firebase/php-jwt` library
- **Database Access**: PDO (PHP Data Objects) with prepared statements
- **Dependency Management**: Composer

**Database**:
- **DBMS**: MySQL 8.0 (or MariaDB 10.6+)
- **Schema Design**: Normalized relational schema (3NF)
- **Indexes**: Optimized indexes for common queries
- **Backups**: Daily automated backups (DigitalOcean snapshots)

**Infrastructure**:
- **Backend Hosting**: DigitalOcean Droplet (Ubuntu 22.04 LTS)
- **Web Server**: Nginx (reverse proxy to PHP-FPM)
- **PHP Runtime**: PHP-FPM 8.2
- **Database Hosting**: DigitalOcean Managed MySQL Database (or same droplet for MVP)
- **App Distribution**: Apple App Store (iOS), Google Play Store (Android)

**DevOps & CI/CD**:
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions (build, test, deploy)
- **Containerization**: Docker (for local development and testing)
- **Monitoring**: Basic server monitoring (DigitalOcean dashboards)

## Frontend Architecture

### Angular Application Structure

```
mobile-learning-companion/
├── src/
│   ├── app/
│   │   ├── core/                  # Core services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts         # Authentication logic
│   │   │   │   ├── api.service.ts          # HTTP API client
│   │   │   │   ├── offline.service.ts      # Offline storage management
│   │   │   │   ├── sync.service.ts         # Background sync logic
│   │   │   │   └── notification.service.ts # Push notification handling
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts           # Route protection
│   │   │   │   └── offline.guard.ts        # Offline mode handling
│   │   │   └── interceptors/
│   │   │       ├── auth.interceptor.ts     # JWT token injection
│   │   │       └── cache.interceptor.ts    # HTTP response caching
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Login, registration, password reset
│   │   │   ├── practice/          # Practice session flow
│   │   │   ├── dashboard/         # Progress dashboard
│   │   │   ├── library/           # Content library browsing
│   │   │   └── settings/          # App settings and preferences
│   │   ├── shared/                # Shared components, pipes, directives
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   └── app.component.ts
│   ├── assets/                    # Images, fonts, static files
│   └── environments/              # Environment configuration
│       ├── environment.ts         # Development config
│       └── environment.prod.ts    # Production config
└── capacitor.config.ts            # Capacitor configuration
```

### State Management Strategy

**Reactive Programming with RxJS**:
- Services expose `Observable` streams for reactive data flow
- Components subscribe to observables and unsubscribe on destroy
- Use `BehaviorSubject` for state that needs initial value
- Use `ReplaySubject` for caching multiple values

**Example: Auth Service State**
```typescript
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
}
```

### Offline-First Architecture

**Key Principles**:
1. **Local-First**: All reads happen from local storage first
2. **Background Sync**: Writes are queued and synced when online
3. **Conflict Resolution**: Last-Write-Wins (LWW) with timestamps
4. **User Control**: Manual sync trigger available

**Offline Storage Schema (SQLite)**:

```sql
-- Downloaded practice sets
CREATE TABLE practice_sets (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  topic TEXT,
  question_count INTEGER,
  downloaded_at INTEGER, -- Unix timestamp
  synced_at INTEGER      -- Last sync timestamp
);

-- Downloaded questions
CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  practice_set_id INTEGER,
  question_type TEXT,    -- 'multiple_choice', 'true_false', 'fill_blank', 'short_answer'
  question_text TEXT NOT NULL,
  correct_answer TEXT,
  options TEXT,          -- JSON array for multiple choice
  explanation TEXT,
  difficulty INTEGER,
  FOREIGN KEY (practice_set_id) REFERENCES practice_sets(id)
);

-- User progress (offline answers)
CREATE TABLE user_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER,
  user_answer TEXT,
  is_correct INTEGER,
  answered_at INTEGER,   -- Unix timestamp
  synced INTEGER DEFAULT 0, -- 0 = pending sync, 1 = synced
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Sync queue for pending operations
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation_type TEXT,   -- 'answer_submit', 'progress_update'
  payload TEXT,          -- JSON data to sync
  created_at INTEGER,
  retry_count INTEGER DEFAULT 0
);
```

**Sync Process Flow**:

```
1. User completes practice question
   ↓
2. Save answer to local SQLite (user_answers table)
   ↓
3. Add to sync queue (sync_queue table)
   ↓
4. Check network connectivity
   ↓
5a. ONLINE: Sync immediately in background
   ↓
   - POST /api/progress/submit
   - Mark as synced on success
   - Remove from sync queue

5b. OFFLINE: Wait for connectivity
   ↓
   - Display "Pending Sync" indicator
   - Background service monitors network
   - Auto-sync when connectivity returns
```

### Component Architecture

**Smart Components** (Container components):
- Manage state and business logic
- Subscribe to services
- Pass data to dumb components
- Handle user interactions

**Dumb Components** (Presentational components):
- Receive data via `@Input()`
- Emit events via `@Output()`
- Pure presentation logic
- Reusable and testable

**Example Structure**:
```
practice/
├── practice.component.ts        # Smart component (container)
├── components/
│   ├── question-card/           # Dumb component
│   ├── answer-input/            # Dumb component
│   └── feedback-modal/          # Dumb component
```

### Routing Strategy

**Route Configuration**:
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { 
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'practice',
    loadChildren: () => import('./features/practice/practice.module').then(m => m.PracticeModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'library',
    loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
```

**Route Guards**:
- `AuthGuard`: Protect authenticated routes
- `OfflineGuard`: Handle offline-only features

## Backend Architecture

### API Structure

```
backend/
├── public/
│   └── index.php              # Entry point
├── src/
│   ├── Controllers/
│   │   ├── AuthController.php       # /api/auth/*
│   │   ├── PracticeSetsController.php  # /api/practice-sets/*
│   │   ├── QuestionsController.php     # /api/questions/*
│   │   └── ProgressController.php      # /api/progress/*
│   ├── Middleware/
│   │   ├── JwtMiddleware.php        # JWT authentication
│   │   ├── CorsMiddleware.php       # CORS headers
│   │   └── ValidationMiddleware.php # Input validation
│   ├── Models/
│   │   ├── User.php
│   │   ├── PracticeSet.php
│   │   ├── Question.php
│   │   └── UserProgress.php
│   ├── Services/
│   │   ├── AuthService.php          # Authentication logic
│   │   ├── JwtService.php           # JWT generation/validation
│   │   └── ProgressService.php      # Progress calculation
│   └── Database/
│       ├── Connection.php           # PDO connection
│       └── migrations/              # Database migrations
├── config/
│   ├── database.php              # DB config
│   ├── jwt.php                   # JWT secret
│   └── app.php                   # App config
├── vendor/                       # Composer dependencies
├── composer.json
└── .env                          # Environment variables
```

### RESTful API Endpoints

**Authentication** (`/api/auth`):
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (requires JWT)

**Practice Sets** (`/api/practice-sets`):
- `GET /api/practice-sets` - List all available practice sets
- `GET /api/practice-sets/:id` - Get practice set details
- `GET /api/practice-sets/:id/questions` - Get all questions for a practice set (for offline download)
- `POST /api/practice-sets` - Create new practice set (admin only)

**Questions** (`/api/questions`):
- `GET /api/questions/:id` - Get single question details
- `POST /api/questions` - Create new question (admin only)

**User Progress** (`/api/progress`):
- `GET /api/progress` - Get user's overall progress summary
- `GET /api/progress/practice-set/:id` - Get progress for specific practice set
- `POST /api/progress/submit` - Submit answer(s) for syncing
- `GET /api/progress/stats` - Get detailed analytics (streak, trends)

**Example Response Format**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "message": "Login successful",
  "timestamp": 1705939200
}
```

### Authentication Flow

**JWT-Based Authentication**:

```
1. User Login:
   POST /api/auth/login
   { "email": "user@example.com", "password": "***" }
   
   ↓
   
2. Backend validates credentials
   - Check email exists
   - Verify password (bcrypt hash)
   
   ↓
   
3. Generate JWT token:
   {
     "user_id": 123,
     "email": "user@example.com",
     "exp": 1705939200  // Expires in 7 days
   }
   
   ↓
   
4. Return JWT to client:
   {
     "status": "success",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": { ... }
     }
   }
   
   ↓
   
5. Client stores JWT in secure storage
   - iOS: Keychain
   - Android: EncryptedSharedPreferences
   
   ↓
   
6. Client includes JWT in all subsequent requests:
   Authorization: Bearer <JWT_TOKEN>
```

**Password Reset Flow**:

```
1. User requests password reset:
   POST /api/auth/forgot-password
   { "email": "user@example.com" }
   
   ↓
   
2. Backend generates reset token (random, expires in 1 hour)
   - Store in `password_reset_tokens` table
   
   ↓
   
3. Send email with reset link:
   https://app.example.com/reset-password?token=ABC123
   
   ↓
   
4. User clicks link, enters new password:
   POST /api/auth/reset-password
   { "token": "ABC123", "new_password": "***" }
   
   ↓
   
5. Backend validates token, updates password
```

### Database Schema Design

**Users Table**:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

**Practice Sets Table**:
```sql
CREATE TABLE practice_sets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  topic VARCHAR(100),
  difficulty_level TINYINT,  -- 1-5
  is_published BOOLEAN DEFAULT FALSE,
  created_by INT,  -- admin user ID
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_subject (subject),
  INDEX idx_topic (topic),
  INDEX idx_published (is_published)
);
```

**Questions Table**:
```sql
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  practice_set_id INT NOT NULL,
  question_type ENUM('multiple_choice', 'true_false', 'fill_blank', 'short_answer') NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  options JSON,  -- For multiple choice: ["Option A", "Option B", "Option C", "Option D"]
  explanation TEXT,
  difficulty TINYINT,  -- 1-5
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (practice_set_id) REFERENCES practice_sets(id) ON DELETE CASCADE,
  INDEX idx_practice_set (practice_set_id),
  INDEX idx_type (question_type)
);
```

**User Progress Table** (aggregated stats):
```sql
CREATE TABLE user_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  practice_set_id INT NOT NULL,
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  last_practiced_at TIMESTAMP,
  mastery_level TINYINT,  -- 0-100 (percentage)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_practice_set (user_id, practice_set_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (practice_set_id) REFERENCES practice_sets(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_last_practiced (last_practiced_at)
);
```

**User Answers Table** (detailed attempt history):
```sql
CREATE TABLE user_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_question (question_id),
  INDEX idx_answered_at (answered_at)
);
```

**Password Reset Tokens Table**:
```sql
CREATE TABLE password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);
```

### Data Flow Architecture

**Practice Session Data Flow**:

```
Mobile App                    Backend API                  Database
    │                              │                           │
    │  1. Download practice set    │                           │
    ├─────────────────────────────>│                           │
    │  GET /api/practice-sets/1/   │                           │
    │       questions               │                           │
    │                              │  2. Query questions        │
    │                              ├──────────────────────────>│
    │                              │                           │
    │                              │  3. Return questions       │
    │                              │<──────────────────────────┤
    │  4. Return JSON (questions)  │                           │
    │<─────────────────────────────┤                           │
    │                              │                           │
    │  5. Save to SQLite (offline) │                           │
    ├─┐                            │                           │
    │ │                            │                           │
    │<┘                            │                           │
    │                              │                           │
    │  6. User answers question    │                           │
    │     (offline)                │                           │
    ├─┐                            │                           │
    │ │ Save to local SQLite       │                           │
    │<┘                            │                           │
    │                              │                           │
    │  7. Sync answers (when online)                           │
    ├─────────────────────────────>│                           │
    │  POST /api/progress/submit   │                           │
    │  { answers: [...] }          │                           │
    │                              │  8. Insert answers         │
    │                              ├──────────────────────────>│
    │                              │                           │
    │                              │  9. Update progress        │
    │                              ├──────────────────────────>│
    │                              │                           │
    │                              │  10. Acknowledge           │
    │                              │<──────────────────────────┤
    │  11. Return success          │                           │
    │<─────────────────────────────┤                           │
    │                              │                           │
    │  12. Mark as synced locally  │                           │
    ├─┐                            │                           │
    │ │                            │                           │
    │<┘                            │                           │
```

## Security Architecture

### Authentication & Authorization

**JWT Token Structure**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 123,
    "email": "user@example.com",
    "iat": 1705939200,  // Issued at
    "exp": 1706544000   // Expires (7 days)
  },
  "signature": "..."
}
```

**Token Storage**:
- **iOS**: Store in Keychain (encrypted by OS)
- **Android**: Store in EncryptedSharedPreferences
- **Web**: Store in HttpOnly cookie (future web version)

**Token Refresh Strategy** (Post-MVP):
- Access token: 7 days expiration
- Refresh token: 30 days expiration (Post-MVP feature)
- Auto-refresh 1 day before expiration

### Data Encryption

**In Transit**:
- All API calls use HTTPS (TLS 1.3)
- Certificate pinning (Post-MVP) to prevent MITM attacks

**At Rest**:
- User passwords: bcrypt hashing (cost factor 12)
- JWT secret: Environment variable (not in codebase)
- Database credentials: Environment variables
- Sensitive local data: Encrypted using OS-provided encryption (iOS Keychain, Android Keystore)

### API Security

**Rate Limiting**:
- Login endpoint: 5 attempts per 15 minutes per IP
- Registration: 3 accounts per hour per IP
- API calls: 100 requests per minute per user (authenticated)

**Input Validation**:
- Sanitize all user inputs
- Validate email format, password strength
- SQL injection prevention (use prepared statements)
- XSS prevention (escape HTML output)

**CORS Configuration**:
```php
// Allow only mobile app origins
$allowedOrigins = [
  'capacitor://localhost',  // iOS
  'http://localhost',       // Android
];

if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
  header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
  header('Access-Control-Allow-Credentials: true');
}
```

### Compliance & Privacy

**COPPA Compliance** (if users <13):
- Age verification on signup
- Parental consent flow
- Minimal data collection for minors
- No behavioral advertising for <13 users

**GDPR Compliance** (EU users):
- Data export: GET /api/user/export-data
- Data deletion: DELETE /api/user/delete-account
- Consent management for tracking
- Privacy policy and terms of service

**App Store Privacy**:
- Transparent privacy nutrition labels
- Request permissions with context
- Minimal data collection
- User control over data sharing

## Infrastructure

### Hosting Architecture

**DigitalOcean Droplet** (MVP):
- **Type**: Basic Droplet (2 GB RAM, 1 vCPU, 50 GB SSD)
- **OS**: Ubuntu 22.04 LTS
- **Region**: US East (or closest to target users)
- **Cost**: ~$12/month

**Server Stack**:
- **Web Server**: Nginx (reverse proxy)
- **PHP Runtime**: PHP-FPM 8.2
- **Database**: MySQL 8.0 (local on droplet for MVP)
- **SSL**: Let's Encrypt (free SSL certificate)

**Scaling Plan** (Post-MVP):
- Separate database to managed MySQL (DigitalOcean Database)
- Add load balancer for multiple API servers
- Use Redis for session caching and rate limiting
- CDN for static assets (DigitalOcean Spaces + CDN)

### CI/CD Pipeline

**GitHub Actions Workflow**:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd mobile
          npm ci
      
      - name: Build Angular app
        run: |
          cd mobile
          npm run build:prod
      
      - name: Build iOS app
        run: |
          cd mobile
          npx cap sync ios
          # Xcode build (on macOS runner)
      
      - name: Build Android app
        run: |
          cd mobile
          npx cap sync android
          cd android
          ./gradlew assembleRelease
      
      - name: Deploy Backend API
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/api
            git pull origin main
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
```

### Monitoring & Logging

**MVP Monitoring**:
- Server uptime monitoring (UptimeRobot or DigitalOcean monitoring)
- PHP error logs (`/var/log/php8.2-fpm.log`)
- Nginx access/error logs (`/var/log/nginx/`)
- Database slow query log

**Post-MVP Monitoring**:
- Application Performance Monitoring (APM): New Relic or Datadog
- Error tracking: Sentry (frontend + backend)
- User analytics: Mixpanel or Amplitude
- Crash reporting: Firebase Crashlytics (mobile)

### Backup Strategy

**MVP Backups**:
- Database: Daily automated backups (DigitalOcean snapshots)
- Retention: 7 days rolling backups
- Manual backup before major deployments

**Post-MVP Backups**:
- Database: Hourly automated backups (DigitalOcean Managed Database)
- Retention: 30 days rolling backups
- Point-in-time recovery capability
- Geo-redundant backups

## Performance Optimization

### Frontend Performance

**Optimization Strategies**:
1. **Lazy Loading**: Feature modules loaded on-demand
2. **Code Splitting**: Webpack splits bundles by route
3. **Image Optimization**: Compress images, use WebP format
4. **Virtual Scrolling**: For long lists (question library)
5. **OnPush Change Detection**: Reduce change detection cycles
6. **Service Workers**: Cache static assets for faster load (PWA)

**Performance Targets**:
- **First Contentful Paint (FCP)**: <2 seconds
- **Time to Interactive (TTI)**: <4 seconds
- **App Launch**: <3 seconds (cold start)
- **Frame Rate**: 60 FPS (smooth animations)

### Backend Performance

**Optimization Strategies**:
1. **Database Indexes**: Optimize common queries
2. **Query Optimization**: Avoid N+1 queries, use joins
3. **Response Caching**: Cache GET responses (Redis, Post-MVP)
4. **Connection Pooling**: Reuse database connections
5. **Pagination**: Limit large result sets (20-50 items per page)

**Performance Targets**:
- **API Response Time**: <500ms (average)
- **Database Query Time**: <100ms (average)
- **Concurrent Users**: 100+ simultaneous users (MVP)
- **Throughput**: 1000+ requests/minute

### Offline Performance

**Optimization Strategies**:
1. **IndexedDB/SQLite**: Fast local storage for questions/progress
2. **Background Sync**: Non-blocking sync process
3. **Incremental Sync**: Sync only changed data (delta sync, Post-MVP)
4. **Compression**: Compress large JSON payloads before storage

**Performance Targets**:
- **Offline Question Load**: <100ms
- **Answer Submission**: <50ms (local save)
- **Sync Duration**: <5 seconds for 50 answers
- **Storage Efficiency**: <50 MB for 500 questions

## Scalability Architecture

### Horizontal Scaling Plan (Future)

**Phase 1: Single Server** (MVP):
- 1 DigitalOcean droplet (Nginx + PHP-FPM + MySQL)
- Capacity: ~1,000 concurrent users

**Phase 2: Separated Database** (Q3 2026):
- API server: 1 droplet (Nginx + PHP-FPM)
- Database: DigitalOcean Managed MySQL
- Capacity: ~5,000 concurrent users

**Phase 3: Load Balanced** (Q4 2026):
- API servers: 2+ droplets behind load balancer
- Database: DigitalOcean Managed MySQL (read replicas)
- Cache: Redis cluster (session + response caching)
- Capacity: ~25,000 concurrent users

**Phase 4: Microservices** (Q1 2027):
- Auth service: Dedicated authentication microservice
- Content service: Practice sets and questions API
- Progress service: User progress and analytics API
- Notification service: Push notification delivery
- Database: Sharded MySQL (by user ID)
- Capacity: 100,000+ concurrent users

### Database Scaling Strategies

**Vertical Scaling**:
- Upgrade to larger database instance (more RAM, CPU)

**Horizontal Scaling**:
- **Read Replicas**: Separate read and write databases
- **Sharding**: Partition data by user ID or region
- **Caching**: Redis for frequently accessed data

**Query Optimization**:
- Composite indexes for common query patterns
- Denormalization for read-heavy tables (e.g., user_progress)
- Archiving old data (move old user_answers to archive table)

## Testing Strategy

### Frontend Testing

**Unit Tests** (Jest + Angular Testing Library):
- Test services (auth, offline, sync)
- Test components (smart + dumb)
- Test pipes and directives
- Target: 80% code coverage

**Integration Tests** (Cypress):
- Test feature workflows (login, practice session, sync)
- Test offline mode behavior
- Test navigation and routing
- Target: Cover all critical user paths

**E2E Tests** (Appium or Detox):
- Test on real iOS/Android devices
- Test native features (push notifications, storage)
- Test offline/online transitions
- Target: Cover MVP features

### Backend Testing

**Unit Tests** (PHPUnit):
- Test controllers and services
- Test authentication logic
- Test progress calculation
- Target: 80% code coverage

**Integration Tests** (PHPUnit + Database):
- Test API endpoints with real database
- Test JWT authentication flow
- Test sync logic
- Target: Cover all API endpoints

**Load Testing** (Apache JMeter or k6):
- Test API performance under load
- Simulate concurrent users
- Identify bottlenecks
- Target: 100 concurrent users (MVP)

### Testing Environment

**Development**: Local MySQL + PHP built-in server
**Staging**: Separate DigitalOcean droplet (mirror of production)
**Production**: Production droplet

## Deployment Strategy

### Deployment Process

**Backend Deployment**:
1. Push code to GitHub (main branch)
2. GitHub Actions builds and tests
3. SSH to server and pull latest code
4. Run `composer install --no-dev`
5. Run database migrations (`php migrate.php`)
6. Reload PHP-FPM and Nginx
7. Verify health check endpoint

**Mobile Deployment**:
1. Build production Angular app (`npm run build:prod`)
2. Sync with Capacitor (`npx cap sync`)
3. Build iOS app (Xcode or `xcodebuild`)
4. Build Android app (`./gradlew assembleRelease`)
5. Submit to App Store (iOS) and Play Store (Android)
6. Wait for review approval (~1-3 days for iOS, <1 day for Android)

**Rollback Strategy**:
- Git revert to previous commit
- Database rollback (restore from backup if schema changed)
- Redeploy previous version

### Blue-Green Deployment (Post-MVP)

**Process**:
1. Deploy new version to "green" environment
2. Test green environment
3. Switch load balancer traffic from "blue" to "green"
4. Monitor for errors
5. Keep "blue" as rollback option for 24 hours

## Migration Strategy

### Database Migrations

**Migration Files** (PHP scripts):

```php
// migrations/001_create_users_table.php
function up($pdo) {
  $pdo->exec("
    CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  ");
}

function down($pdo) {
  $pdo->exec("DROP TABLE users");
}
```

**Migration Runner**:
```bash
# Run all pending migrations
php migrate.php up

# Rollback last migration
php migrate.php down

# Check migration status
php migrate.php status
```

### Data Migration (Future)

**User Data Export/Import**:
- Export user progress to JSON
- Import to new schema version
- Validate data integrity

**Zero-Downtime Migration** (Post-MVP):
- Dual-write to old and new schema
- Backfill new schema
- Switch reads to new schema
- Remove old schema

---

## Appendix

### Technology Decision Rationale

**Why Angular over React/Vue?**
- Strong TypeScript support
- Built-in dependency injection
- Comprehensive framework (router, HTTP client, forms)
- Ionic integration for mobile UI

**Why Capacitor over React Native?**
- Leverage existing Angular codebase
- Single codebase for web + iOS + Android
- Easy access to native APIs
- Simpler learning curve

**Why PHP/Slim over Node.js/Express?**
- Mature ecosystem for RESTful APIs
- Lower hosting costs (shared hosting friendly)
- Simple deployment (no process manager needed)
- Good performance for CRUD operations

**Why MySQL over PostgreSQL?**
- Widespread hosting support
- Sufficient for relational data needs
- DigitalOcean managed MySQL available
- Simpler for MVP development

### Architectural Principles

1. **Offline-First**: Core functionality works without internet
2. **Mobile-Native**: Optimize for mobile devices, not desktop
3. **Simplicity**: Use proven technologies, avoid over-engineering
4. **Scalability**: Design for growth but don't prematurely optimize
5. **Security**: Encrypt sensitive data, validate all inputs
6. **Performance**: Fast app launch, smooth UI, quick sync
7. **Testability**: Write testable code, achieve 80% coverage

### Future Architecture Enhancements

1. **GraphQL API** (Post-MVP): Replace REST with GraphQL for flexible queries
2. **WebSockets** (Post-MVP): Real-time sync for collaborative features
3. **Server-Side Rendering** (Post-MVP): Improve SEO for web version
4. **CDN** (Post-MVP): Serve static assets globally via CDN
5. **Microservices** (Q1 2027): Split backend into microservices for scalability

---

**Document Status**: ✅ Complete  
**Last Updated**: 2026-01-22  
**Next Review**: 2026-03-22 (2 months)  
**Owner**: Marcus Johnson (Architecture Expert)
