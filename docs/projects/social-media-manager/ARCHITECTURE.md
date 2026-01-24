# Social Media Manager - Technical Architecture

## System Overview

Social Media Manager is a full-stack web application built as a **Single Page Application (SPA)** with a RESTful API backend. The system integrates with multiple social media platforms via OAuth 2.0 and their respective APIs to enable unified management, scheduling, and analytics.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Angular 18 SPA (TypeScript)                  │    │
│  │  - Dashboard UI       - Post Creation                  │    │
│  │  - Content Calendar   - Analytics Dashboard            │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/TLS
                         │ JWT Authentication
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN (CloudFlare)                           │
│  Static Assets (Images, CSS, JS, Fonts)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Web Server (Nginx)                            │
│  - HTTPS/TLS Termination    - Reverse Proxy                    │
│  - Static File Serving      - Load Balancing (future)          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Application Server (PHP 8.2+ / Slim 4)            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   RESTful API                            │  │
│  │  - Authentication     - Post Management                  │  │
│  │  - Account Management - Analytics Aggregation            │  │
│  │  - Calendar Endpoints - OAuth Flow Handler               │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────┬────────────────────────┬──────────────────────┬────────┘
         │                        │                      │
         ▼                        ▼                      ▼
┌─────────────────┐    ┌──────────────────┐   ┌──────────────────┐
│  MySQL 8.0      │    │  Redis 7.x       │   │  Background Job  │
│  Database       │    │  Cache + Queue   │   │  Worker          │
│                 │    │                  │   │  (PHP CLI)       │
│  - Users        │    │  - Sessions      │   │                  │
│  - Accounts     │    │  - Job Queue     │   │  - Process Jobs  │
│  - Posts        │    │  - Analytics     │   │  - Publish Posts │
│  - Analytics    │    │    Cache         │   │  - Fetch Stats   │
│  - OAuth Tokens │    └──────────────────┘   └──────────────────┘
└─────────────────┘              │                      │
         │                       │                      │
         └───────────────────────┴──────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Social Media Platform APIs                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ Instagram  │  │ Facebook   │  │ Twitter    │               │
│  │ Graph API  │  │ Graph API  │  │ API v2     │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│  OAuth 2.0 Authentication + Platform-Specific APIs              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Frontend (Angular SPA)**: User interface, state management, API communication
2. **Backend API (PHP/Slim)**: RESTful API, business logic, OAuth handling
3. **Database (MySQL)**: Persistent data storage
4. **Cache/Queue (Redis)**: Job queue, session cache, analytics cache
5. **Background Worker**: Scheduled post publishing, analytics fetching
6. **Web Server (Nginx)**: HTTP/HTTPS handling, reverse proxy
7. **CDN (CloudFlare)**: Static asset delivery, DDoS protection
8. **Social Platform APIs**: Instagram, Facebook, Twitter integrations

---

## Frontend Architecture

### Technology Stack

- **Framework**: Angular 18 (TypeScript)
- **UI Library**: Angular Material (components, theming)
- **State Management**: RxJS + Services (no NgRx for MVP simplicity)
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router (lazy loading for performance)
- **Forms**: Reactive Forms (validation, error handling)
- **Charts**: Chart.js or D3.js (analytics visualizations)
- **Date/Time**: Luxon or date-fns (date manipulation)
- **Calendar**: FullCalendar or custom implementation (drag-and-drop)

### Application Structure

```
src/
├── app/
│   ├── core/                      # Singleton services, guards, interceptors
│   │   ├── auth/
│   │   │   ├── auth.service.ts   # Authentication logic, JWT handling
│   │   │   ├── auth.guard.ts     # Route protection
│   │   │   └── auth.interceptor.ts  # JWT token injection
│   │   ├── api/
│   │   │   └── api.service.ts    # Base API service (HTTP wrapper)
│   │   └── error/
│   │       └── error-handler.service.ts  # Global error handling
│   │
│   ├── shared/                    # Shared components, pipes, directives
│   │   ├── components/
│   │   │   ├── header/           # App header
│   │   │   ├── sidebar/          # App sidebar
│   │   │   └── loader/           # Loading spinner
│   │   ├── pipes/
│   │   │   └── time-ago.pipe.ts  # "2 hours ago" formatting
│   │   └── directives/
│   │
│   ├── features/                  # Feature modules (lazy loaded)
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.service.ts
│   │   ├── accounts/
│   │   │   ├── account-list.component.ts
│   │   │   ├── connect-account.component.ts
│   │   │   └── accounts.service.ts
│   │   ├── posts/
│   │   │   ├── post-list.component.ts
│   │   │   ├── post-form.component.ts  # Create/edit post
│   │   │   └── posts.service.ts
│   │   ├── calendar/
│   │   │   ├── calendar.component.ts   # Main calendar view
│   │   │   ├── calendar.service.ts
│   │   │   └── drag-drop.directive.ts
│   │   ├── analytics/
│   │   │   ├── analytics-dashboard.component.ts
│   │   │   ├── analytics-chart.component.ts
│   │   │   └── analytics.service.ts
│   │   └── settings/
│   │       ├── settings.component.ts
│   │       └── settings.service.ts
│   │
│   ├── app.component.ts           # Root component
│   ├── app.module.ts              # Root module
│   └── app-routing.module.ts      # App-level routes
│
├── assets/                         # Static assets
│   ├── images/
│   ├── icons/
│   └── styles/
│
└── environments/
    ├── environment.ts              # Dev environment
    └── environment.prod.ts         # Production environment
```

### State Management Strategy

**Approach**: RxJS + Services (no NgRx for MVP simplicity)

**Rationale**:
- MVP doesn't require complex state management
- RxJS Subjects + Services provide sufficient state sharing
- Reduces bundle size and learning curve
- Can migrate to NgRx in future if needed

**Example: PostsService State**

```typescript
@Injectable({ providedIn: 'root' })
export class PostsService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  public posts$ = this.postsSubject.asObservable();

  constructor(private api: ApiService) {}

  loadPosts(): Observable<Post[]> {
    return this.api.get<Post[]>('/posts').pipe(
      tap(posts => this.postsSubject.next(posts))
    );
  }

  createPost(post: CreatePostDto): Observable<Post> {
    return this.api.post<Post>('/posts', post).pipe(
      tap(newPost => {
        const current = this.postsSubject.value;
        this.postsSubject.next([...current, newPost]);
      })
    );
  }
}
```

### Component Communication

- **Parent → Child**: `@Input()` properties
- **Child → Parent**: `@Output()` EventEmitters
- **Sibling Components**: Shared services with RxJS Subjects
- **Global State**: Core services (AuthService, PostsService, etc.)

### Routing Strategy

- **Lazy Loading**: Load feature modules on demand
- **Guards**: AuthGuard for protected routes
- **Resolvers**: Pre-fetch data before route activation (when needed)

**Route Structure**:
```
/                     → Dashboard (redirect if not logged in)
/auth/login           → Login page
/auth/register        → Registration page
/dashboard            → Main dashboard (protected)
/accounts             → Connected accounts (protected)
/posts                → Post list (protected)
/posts/create         → Create post (protected)
/calendar             → Content calendar (protected)
/analytics            → Analytics dashboard (protected)
/settings             → User settings (protected)
```

---

## Backend Architecture

### Technology Stack

- **Language**: PHP 8.2+
- **Framework**: Slim 4 (micro-framework, RESTful API)
- **Database**: MySQL 8.0
- **ORM/Query Builder**: PDO with custom query builder or Eloquent (if needed)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Respect\Validation or similar
- **Logging**: Monolog
- **Environment**: dotenv for configuration
- **Testing**: PHPUnit (unit and integration tests)

### Application Structure

```
backend/
├── public/
│   └── index.php                  # Application entry point
│
├── src/
│   ├── Application/
│   │   ├── Middleware/
│   │   │   ├── AuthMiddleware.php      # JWT validation
│   │   │   ├── CorsMiddleware.php      # CORS headers
│   │   │   └── RateLimitMiddleware.php # Rate limiting
│   │   ├── Actions/                     # Endpoint handlers
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterAction.php
│   │   │   │   ├── LoginAction.php
│   │   │   │   └── RefreshTokenAction.php
│   │   │   ├── Accounts/
│   │   │   │   ├── ListAccountsAction.php
│   │   │   │   ├── ConnectAccountAction.php
│   │   │   │   └── DisconnectAccountAction.php
│   │   │   ├── Posts/
│   │   │   │   ├── CreatePostAction.php
│   │   │   │   ├── ListPostsAction.php
│   │   │   │   ├── UpdatePostAction.php
│   │   │   │   └── DeletePostAction.php
│   │   │   ├── Calendar/
│   │   │   │   └── GetCalendarAction.php
│   │   │   └── Analytics/
│   │   │       └── GetAnalyticsAction.php
│   │   └── Handlers/
│   │       └── HttpErrorHandler.php     # Error handling
│   │
│   ├── Domain/                          # Business logic
│   │   ├── User/
│   │   │   ├── User.php                # User entity
│   │   │   ├── UserRepository.php      # User data access
│   │   │   └── UserService.php         # User business logic
│   │   ├── Account/
│   │   │   ├── SocialAccount.php
│   │   │   ├── SocialAccountRepository.php
│   │   │   └── SocialAccountService.php
│   │   ├── Post/
│   │   │   ├── Post.php
│   │   │   ├── PostRepository.php
│   │   │   └── PostService.php
│   │   └── Analytics/
│   │       ├── AnalyticsData.php
│   │       └── AnalyticsService.php
│   │
│   ├── Infrastructure/                  # External integrations
│   │   ├── OAuth/
│   │   │   ├── OAuthProviderInterface.php
│   │   │   ├── InstagramOAuthProvider.php
│   │   │   ├── FacebookOAuthProvider.php
│   │   │   └── TwitterOAuthProvider.php
│   │   ├── Platform/
│   │   │   ├── PlatformApiInterface.php
│   │   │   ├── InstagramApi.php
│   │   │   ├── FacebookApi.php
│   │   │   └── TwitterApi.php
│   │   ├── Queue/
│   │   │   ├── RedisQueue.php
│   │   │   └── Job.php
│   │   └── Database/
│   │       ├── Connection.php
│   │       └── Migrations/
│   │
│   └── Support/                         # Utilities
│       ├── Jwt/
│       │   └── JwtHelper.php
│       ├── Encryption/
│       │   └── TokenEncryption.php     # AES-256 for OAuth tokens
│       └── Validation/
│           └── Validator.php
│
├── config/
│   ├── database.php                    # Database configuration
│   ├── routes.php                      # API routes
│   ├── middleware.php                  # Middleware configuration
│   └── dependencies.php                # DI container bindings
│
├── storage/
│   └── logs/                           # Application logs
│
├── tests/
│   ├── Unit/
│   └── Integration/
│
├── .env.example                        # Environment variables template
├── composer.json                       # PHP dependencies
└── README.md
```

### RESTful API Design

**Base URL**: `https://api.socialmediamanager.com/v1`

**Authentication**: Bearer token (JWT) in `Authorization` header

**Response Format**: JSON

**Error Format**:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  }
}
```

### Key API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns JWT)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Invalidate refresh token

#### Social Accounts
- `GET /accounts` - List connected accounts
- `POST /accounts/connect` - Initiate OAuth flow
- `GET /accounts/callback` - OAuth callback handler
- `DELETE /accounts/:id` - Disconnect account

#### Posts
- `POST /posts` - Create and schedule a post
- `GET /posts` - List all posts (with filters: status, platform, date range)
- `GET /posts/:id` - Get post details
- `PUT /posts/:id` - Update post (reschedule, edit content)
- `DELETE /posts/:id` - Delete post

#### Calendar
- `GET /calendar` - Get posts for calendar view
  - Query params: `start_date`, `end_date`, `platform`, `status`

#### Analytics
- `GET /analytics` - Get analytics data
  - Query params: `platform`, `start_date`, `end_date`, `account_id`

*See [technical/api-design.md](technical/api-design.md) for complete API specification.*

---

## Database Architecture

### Database Choice: MySQL 8.0

**Rationale**:
- **Relational Data**: Clear relationships (users, accounts, posts)
- **ACID Compliance**: Critical for scheduled posts and analytics
- **Strong Consistency**: Ensures data integrity
- **Mature Ecosystem**: Well-documented, reliable, widely supported
- **JSON Support**: Native JSON type for flexible fields (post platforms, metadata)

### Schema Design

#### **users** Table
```sql
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan ENUM('free', 'premium', 'premium_plus') DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;
```

#### **social_accounts** Table
```sql
CREATE TABLE social_accounts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  platform ENUM('instagram', 'facebook', 'twitter') NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_platform_account (user_id, platform, platform_user_id),
  INDEX idx_user_platform (user_id, platform)
) ENGINE=InnoDB;
```

#### **oauth_tokens** Table
```sql
CREATE TABLE oauth_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account_id INT UNSIGNED NOT NULL,
  access_token TEXT NOT NULL,          # AES-256 encrypted
  refresh_token TEXT,                   # AES-256 encrypted
  expires_at TIMESTAMP,
  scope TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE,
  INDEX idx_account_id (account_id)
) ENGINE=InnoDB;
```

#### **posts** Table
```sql
CREATE TABLE posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  platforms JSON NOT NULL,              # ["instagram", "facebook"]
  scheduled_at TIMESTAMP NOT NULL,
  published_at TIMESTAMP NULL,
  status ENUM('draft', 'scheduled', 'publishing', 'published', 'failed') DEFAULT 'draft',
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_scheduled (user_id, scheduled_at),
  INDEX idx_status_scheduled (status, scheduled_at)
) ENGINE=InnoDB;
```

#### **post_publications** Table
```sql
CREATE TABLE post_publications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id INT UNSIGNED NOT NULL,
  account_id INT UNSIGNED NOT NULL,
  platform ENUM('instagram', 'facebook', 'twitter') NOT NULL,
  platform_post_id VARCHAR(255),        # ID from platform (for analytics)
  published_at TIMESTAMP NULL,
  status ENUM('pending', 'published', 'failed') DEFAULT 'pending',
  error_message TEXT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_account_id (account_id)
) ENGINE=InnoDB;
```

#### **analytics_cache** Table
```sql
CREATE TABLE analytics_cache (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  impressions INT UNSIGNED DEFAULT 0,
  engagement INT UNSIGNED DEFAULT 0,
  clicks INT UNSIGNED DEFAULT 0,
  followers INT UNSIGNED DEFAULT 0,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_account_date (account_id, date),
  INDEX idx_account_date (account_id, date)
) ENGINE=InnoDB;
```

### Database Migrations

**Strategy**: Version-controlled migrations using custom migration system or Phinx

**Migration Workflow**:
1. Create migration file: `YYYYMMDDHHMMSS_create_users_table.php`
2. Define `up()` and `down()` methods
3. Run migrations: `php migrate.php up`
4. Rollback if needed: `php migrate.php down`

---

## Infrastructure Architecture

### Hosting: DigitalOcean or AWS

**MVP Hosting: DigitalOcean** (cost-effective, simple)

**Configuration**:
- **Droplet**: 2 vCPUs, 4 GB RAM, 80 GB SSD ($24/month)
- **Database**: Managed MySQL (2 GB RAM, $15/month)
- **Redis**: Managed Redis (1 GB RAM, $15/month)
- **CDN**: CloudFlare (free tier)
- **Total Cost**: ~$54/month

**Future Scalability: AWS** (when user base grows)

**Configuration**:
- **EC2**: t3.medium instances (2 vCPUs, 4 GB RAM) with Auto Scaling
- **RDS**: MySQL db.t3.medium with Multi-AZ
- **ElastiCache**: Redis cache cluster
- **CloudFront**: CDN for static assets
- **Load Balancer**: Application Load Balancer (ALB)

### Web Server: Nginx

**Configuration**:
```nginx
server {
    listen 80;
    server_name api.socialmediamanager.com;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.socialmediamanager.com;

    ssl_certificate /etc/ssl/certs/socialmediamanager.crt;
    ssl_certificate_key /etc/ssl/private/socialmediamanager.key;

    root /var/www/backend/public;
    index index.php;

    # API requests
    location / {
        try_files $uri /index.php$is_args$args;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

### CDN: CloudFlare

**Purpose**: 
- Static asset delivery (images, CSS, JS)
- DDoS protection
- Edge caching
- SSL/TLS termination

**Configuration**:
- Cache static assets (images, CSS, JS): 1 month TTL
- Cache HTML: 1 hour TTL
- API endpoints: No cache (bypass CDN)

---

## OAuth 2.0 Integration

### OAuth Flow

```
User → Frontend → Backend → Platform → Backend → Frontend → User
  │        │         │          │          │          │        │
  │     (1)│      (2)│       (3)│       (4)│       (5)│     (6)│
  │        │         │          │          │          │        │
  └────────┴─────────┴──────────┴──────────┴──────────┴────────┘

(1) Click "Connect Instagram"
(2) Redirect to backend OAuth initiation endpoint
(3) Backend redirects to Instagram authorization page
(4) User authorizes, Instagram redirects to callback
(5) Backend exchanges code for access token, saves encrypted
(6) Redirect to frontend with success message
```

**OAuth Initiation**: `POST /accounts/connect?platform=instagram`

**OAuth Callback**: `GET /accounts/callback?code=AUTH_CODE&state=RANDOM_STATE`

### Token Storage

**Security**: OAuth tokens (access and refresh) are encrypted using **AES-256** before storage.

**Implementation**:
```php
class TokenEncryption {
    private string $encryptionKey;

    public function __construct(string $key) {
        $this->encryptionKey = $key; // From environment variable
    }

    public function encrypt(string $token): string {
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt(
            $token,
            'aes-256-cbc',
            $this->encryptionKey,
            0,
            $iv
        );
        return base64_encode($iv . $encrypted);
    }

    public function decrypt(string $encryptedToken): string {
        $data = base64_decode($encryptedToken);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        return openssl_decrypt(
            $encrypted,
            'aes-256-cbc',
            $this->encryptionKey,
            0,
            $iv
        );
    }
}
```

### Token Refresh

**Strategy**: Refresh tokens automatically when they're about to expire (within 1 hour of expiration).

**Implementation**: Background job checks for expiring tokens and refreshes them proactively.

---

## Job Queue System

### Purpose

- **Scheduled Post Publishing**: Publish posts at scheduled times
- **Analytics Fetching**: Fetch analytics data from platforms periodically
- **Token Refresh**: Refresh OAuth tokens before expiration

### Technology: Redis-Based Queue

**Queue Structure**:
```
jobs:pending         # List of job IDs waiting to be processed
jobs:processing      # Set of job IDs currently being processed
jobs:failed          # List of failed job IDs
job:{id}             # Hash containing job data
```

**Job Data Structure**:
```json
{
  "id": "uuid",
  "type": "publish_post",
  "payload": {
    "post_id": 123,
    "account_id": 456
  },
  "attempts": 0,
  "max_attempts": 3,
  "created_at": "2026-01-24T10:00:00Z",
  "scheduled_at": "2026-01-24T12:00:00Z"
}
```

### Background Worker

**Implementation**: PHP CLI script running continuously (supervised by systemd or supervisord)

```php
// worker.php
while (true) {
    $job = $queue->pop(); // Pop job from Redis queue

    if ($job) {
        try {
            $this->processJob($job);
            $queue->complete($job);
        } catch (Exception $e) {
            $job->attempts++;
            if ($job->attempts >= $job->max_attempts) {
                $queue->fail($job);
            } else {
                $queue->retry($job);
            }
        }
    } else {
        sleep(5); // No jobs, wait 5 seconds
    }
}
```

**Job Types**:

1. **publish_post**: Publish scheduled post to platform
2. **fetch_analytics**: Fetch analytics data from platform
3. **refresh_token**: Refresh OAuth token

---

## Security Architecture

### Authentication: JWT

**Token Types**:
- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

**JWT Payload**:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1706097600,
  "exp": 1706101200,
  "type": "access"
}
```

### OAuth Token Encryption

**Encryption**: AES-256-CBC  
**Key Storage**: Environment variable (`ENCRYPTION_KEY`)  
**Key Rotation**: Plan for key rotation (future enhancement)

### HTTPS/TLS

**Requirements**:
- All API requests over HTTPS
- TLS 1.2+ only
- HTTP → HTTPS redirect

### Rate Limiting

**Limits**:
- **Authentication endpoints**: 10 requests/minute per IP
- **General API**: 100 requests/minute per user
- **Post publishing**: 50 posts/hour per user (prevent spam)

**Implementation**: Redis-based rate limiter

---

## Monitoring & Observability

### Error Tracking: Sentry

**Integration**: PHP Sentry SDK, Angular Sentry SDK

**Tracked Errors**:
- API errors (500, 400, 401, 403)
- OAuth failures
- Job processing failures
- Frontend errors (uncaught exceptions)

### Uptime Monitoring: UptimeRobot

**Monitored Endpoints**:
- `GET /health` (health check endpoint)
- `GET /` (frontend)

**Alerts**: Email/SMS when downtime detected

### Application Logs: Monolog

**Log Levels**:
- **DEBUG**: Development debugging
- **INFO**: Normal operations (post published, token refreshed)
- **WARNING**: Non-critical issues (rate limit approaching)
- **ERROR**: Failures (OAuth error, job failed)
- **CRITICAL**: System failures (database down, Redis down)

---

## Performance Optimization

### Caching Strategy

**Redis Caching**:
- **Sessions**: User sessions (1 hour TTL)
- **Analytics**: Platform analytics data (1 hour TTL)
- **Rate Limits**: Request counters (1 minute TTL)

**CDN Caching**:
- Static assets (images, CSS, JS): 1 month
- HTML: 1 hour

### Database Optimization

**Indexes**:
- `users(email)` - Login queries
- `posts(user_id, scheduled_at)` - User posts with date filter
- `posts(status, scheduled_at)` - Job queue queries
- `social_accounts(user_id, platform)` - Account lookups
- `analytics_cache(account_id, date)` - Analytics queries

**Query Optimization**:
- Use prepared statements (prevent SQL injection + performance)
- Avoid N+1 queries (eager load relationships)
- Limit result sets (pagination)

### Frontend Optimization

**Strategies**:
- Lazy loading (feature modules)
- Code splitting (Webpack)
- Image optimization (WebP format, compression)
- Tree shaking (remove unused code)
- AOT compilation (Ahead-of-Time)

---

## Scalability Strategy

### MVP (Phase 1): Vertical Scaling

**Approach**: Increase server resources (CPU, RAM) as needed

**Limits**: Single server can handle ~5,000-10,000 users

### Future (Phase 2+): Horizontal Scaling

**Approach**: Multiple application servers behind load balancer

**Components**:
- **Load Balancer**: AWS ALB or DigitalOcean Load Balancer
- **App Servers**: Multiple instances (auto-scaling)
- **Database**: Read replicas for read-heavy queries
- **Redis**: Redis Cluster for distributed caching

---

*This architecture document will be updated as the system evolves.*

**Last Updated**: 2026-01-24  
**Version**: 1.0 (MVP Architecture)
