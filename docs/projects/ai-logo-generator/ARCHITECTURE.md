# AI Logo Generator - Technical Architecture

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Angular 18 SPA (TypeScript + Tailwind CSS)        │  │
│  │   - Logo Generation UI                                   │  │
│  │   - Customization Interface                              │  │
│  │   - User Dashboard                                       │  │
│  │   - Payment Flow                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Slim PHP 4 RESTful API (JSON responses)           │  │
│  │   - Authentication (JWT)                                 │  │
│  │   - Rate Limiting                                        │  │
│  │   - Request Validation                                   │  │
│  │   - Error Handling                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   Database   │    │  AI Generation   │    │   Payment    │
│    Layer     │    │     Service      │    │  Processing  │
│              │    │                  │    │              │
│   MySQL/     │    │  OpenAI DALL-E 3 │    │    Stripe    │
│  PostgreSQL  │    │  Stability AI    │    │     API      │
│              │    │  (fallback)      │    │              │
└──────────────┘    └──────────────────┘    └──────────────┘
        │                     │
        │                     ▼
        │            ┌──────────────────┐
        │            │  File Storage    │
        │            │   AWS S3/CDN     │
        │            │  (Logo Images)   │
        └────────────┴──────────────────┘
```

### System Components

**Client Layer**:
- Angular 18 single-page application
- Responsive design (mobile, tablet, desktop)
- Real-time logo preview
- Intuitive customization interface

**API Gateway**:
- Slim PHP 4 RESTful API
- JWT authentication
- Rate limiting and request throttling
- Comprehensive error handling

**Database Layer**:
- MySQL 8 or PostgreSQL 15
- User data, logo generations, payments
- Optimized for read-heavy workloads

**AI Generation Service**:
- OpenAI DALL-E 3 (primary)
- Stability AI (fallback/alternative)
- Prompt optimization engine
- Queue system for high load

**File Storage**:
- AWS S3 for generated logo files
- CloudFlare CDN for fast delivery
- Automatic image optimization

**Payment Processing**:
- Stripe payment gateway
- Webhook handling for payment events
- Subscription management (post-MVP)

### Data Flow

**Logo Generation Flow**:
```
1. User submits description → Frontend (Angular)
2. Frontend sends API request → Backend (Slim PHP)
3. Backend validates & authenticates → JWT verification
4. Backend optimizes prompt → Prompt engineering
5. Backend calls AI API → OpenAI DALL-E 3
6. AI generates images → Returns 4 variations
7. Backend saves to S3 → Stores image URLs
8. Backend saves to DB → Records generation
9. Backend returns URLs → Frontend receives response
10. Frontend displays logos → User sees results
```

---

## Frontend Architecture

### Framework & Libraries

**Core**:
- **Angular 18** (TypeScript 5.x)
- **Angular Material** (UI components)
- **Tailwind CSS** (utility-first styling)
- **RxJS** (reactive programming)

**Additional Libraries**:
- **ngx-color-picker** (color customization)
- **fabric.js** (canvas manipulation for preview)
- **ng2-file-upload** (file handling)
- **ngx-stripe** (payment integration)

### State Management

**Approach**: Service-based state management with RxJS
- **UserService**: User authentication state
- **LogoService**: Logo generation and history
- **CustomizationService**: Logo customization state
- **PaymentService**: Payment flow state

**Example**:
```typescript
// logo.service.ts
@Injectable({ providedIn: 'root' })
export class LogoService {
  private logosSubject = new BehaviorSubject<Logo[]>([]);
  public logos$ = this.logosSubject.asObservable();
  
  private generatingSubject = new BehaviorSubject<boolean>(false);
  public generating$ = this.generatingSubject.asObservable();

  generateLogo(description: LogoDescription): Observable<Logo[]> {
    this.generatingSubject.next(true);
    return this.http.post<Logo[]>('/api/logos/generate', description)
      .pipe(
        tap(logos => {
          this.logosSubject.next([...this.logosSubject.value, ...logos]);
          this.generatingSubject.next(false);
        }),
        catchError(error => {
          this.generatingSubject.next(false);
          return throwError(error);
        })
      );
  }
}
```

### Routing Structure

```
/                         → Landing page
/auth/login               → Login page
/auth/signup              → Sign up page
/dashboard                → User dashboard (protected)
/generate                 → Logo generation page (protected)
/customize/:id            → Logo customization page (protected)
/history                  → Generation history (protected)
/checkout/:logoId         → Payment checkout (protected)
/settings                 → User settings (protected)
```

### Component Structure

```
src/app/
├── core/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── logo.service.ts
│   │   ├── payment.service.ts
│   │   └── api.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/
│       └── jwt.interceptor.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   └── signup/
│   ├── logo-generation/
│   │   ├── description-form/
│   │   ├── logo-preview/
│   │   └── generation-results/
│   ├── customization/
│   │   ├── color-picker/
│   │   ├── font-selector/
│   │   └── layout-selector/
│   ├── dashboard/
│   └── payment/
├── shared/
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   └── loading-spinner/
│   └── models/
│       ├── logo.model.ts
│       ├── user.model.ts
│       └── payment.model.ts
└── app.component.ts
```

### Performance Optimizations

1. **Lazy Loading**: Route-based code splitting
2. **OnPush Change Detection**: For performance-critical components
3. **Image Optimization**: Lazy loading, srcset for responsive images
4. **Bundle Size**: Tree-shaking, minimize dependencies
5. **Caching**: Service worker for offline capability (post-MVP)

---

## Backend Architecture

### Framework & Libraries

**Core**:
- **Slim PHP 4** (micro-framework)
- **PHP 8.2+** (latest stable version)
- **Composer** (dependency management)

**Key Dependencies**:
- **firebase/php-jwt** (JWT authentication)
- **guzzlehttp/guzzle** (HTTP client for AI APIs)
- **stripe/stripe-php** (payment processing)
- **vlucas/phpdotenv** (environment configuration)
- **monolog/monolog** (logging)

### API Design

**RESTful API Endpoints**:

**Authentication**:
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user (returns JWT)
POST   /api/auth/refresh        - Refresh JWT token
POST   /api/auth/logout         - Logout user
```

**Logo Generation**:
```
POST   /api/logos/generate      - Generate new logos
GET    /api/logos               - Get user's logo history
GET    /api/logos/:id           - Get specific logo details
DELETE /api/logos/:id           - Delete logo
```

**Customization**:
```
PUT    /api/logos/:id/customize - Update logo customization
POST   /api/logos/:id/variations - Generate variations
```

**Payment**:
```
POST   /api/payments/create-intent     - Create Stripe payment intent
POST   /api/payments/confirm           - Confirm payment
GET    /api/payments/history           - Get payment history
```

**User**:
```
GET    /api/user/profile        - Get user profile
PUT    /api/user/profile        - Update user profile
GET    /api/user/usage          - Get usage statistics
```

### Authentication Flow

**JWT Token-Based Authentication**:

```php
// Middleware: JwtAuthMiddleware.php
class JwtAuthMiddleware {
  public function __invoke($request, $handler) {
    $token = $this->extractToken($request);
    
    if (!$token) {
      return $this->unauthorizedResponse();
    }
    
    try {
      $decoded = JWT::decode($token, $this->getPublicKey(), ['RS256']);
      $request = $request->withAttribute('userId', $decoded->userId);
      return $handler->handle($request);
    } catch (Exception $e) {
      return $this->unauthorizedResponse();
    }
  }
}
```

**JWT Payload**:
```json
{
  "userId": "uuid-here",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Business Logic Layer

**Service Pattern**:
```
src/
├── Controllers/
│   ├── AuthController.php
│   ├── LogoController.php
│   ├── PaymentController.php
│   └── UserController.php
├── Services/
│   ├── AuthService.php
│   ├── LogoGenerationService.php
│   ├── AIPromptService.php
│   ├── PaymentService.php
│   └── StorageService.php
├── Repositories/
│   ├── UserRepository.php
│   ├── LogoRepository.php
│   └── PaymentRepository.php
├── Models/
│   ├── User.php
│   ├── Logo.php
│   └── Payment.php
└── Middleware/
    ├── JwtAuthMiddleware.php
    ├── RateLimitMiddleware.php
    └── ValidationMiddleware.php
```

**Example Service**:
```php
// LogoGenerationService.php
class LogoGenerationService {
  private $aiClient;
  private $promptService;
  private $storageService;
  private $logoRepository;
  
  public function generateLogos(array $description, string $userId): array {
    // 1. Optimize prompt for AI
    $optimizedPrompt = $this->promptService->optimize($description);
    
    // 2. Call AI API
    $images = $this->aiClient->generate($optimizedPrompt, 4);
    
    // 3. Upload to S3
    $urls = [];
    foreach ($images as $image) {
      $urls[] = $this->storageService->upload($image);
    }
    
    // 4. Save to database
    $logos = [];
    foreach ($urls as $url) {
      $logos[] = $this->logoRepository->create([
        'user_id' => $userId,
        'prompt' => $description,
        'image_url' => $url,
        'status' => 'generated'
      ]);
    }
    
    return $logos;
  }
}
```

---

## Infrastructure

### Hosting & Deployment

**Option 1: AWS** (Recommended for scale)
- **EC2**: Application servers (t3.medium instances)
- **RDS**: MySQL/PostgreSQL database (managed)
- **S3**: Logo file storage
- **CloudFront**: CDN for fast image delivery
- **Route 53**: DNS management
- **Load Balancer**: Distribute traffic across instances
- **Auto Scaling**: Handle traffic spikes

**Option 2: DigitalOcean** (Cost-effective for MVP)
- **Droplets**: Application servers ($20-40/mo)
- **Managed Database**: MySQL/PostgreSQL ($15-30/mo)
- **Spaces**: Object storage (S3-compatible, $5/mo)
- **CloudFlare**: CDN (free tier)
- **Load Balancer**: $10/mo (add when scaling)

**Recommended for MVP**: DigitalOcean (lower cost, easier setup)

### CI/CD Pipeline

**Tools**: GitHub Actions + Docker

**Workflow**:
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
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build:prod
      
      - name: Build backend Docker image
        run: |
          cd backend
          docker build -t logo-generator-api .
      
      - name: Deploy to server
        run: |
          ssh deploy@server 'cd /app && docker-compose pull && docker-compose up -d'
```

**Deployment Process**:
1. Push to `main` branch
2. GitHub Actions triggered
3. Frontend build (Angular production build)
4. Backend Docker image build
5. Deploy to server via SSH
6. Health check
7. Rollback if failures

### Monitoring & Logging

**Monitoring**:
- **AWS CloudWatch** or **New Relic** (application performance)
- **Uptime Robot** (uptime monitoring, free)
- **Sentry** (error tracking)

**Logging**:
- **Application Logs**: Monolog (PHP) → CloudWatch or file
- **Access Logs**: Nginx access logs
- **Error Logs**: Sentry for real-time error tracking

**Key Metrics**:
- API response time (P50, P95, P99)
- Error rate (4xx, 5xx errors)
- Logo generation time
- AI API latency
- Database query performance

### Scaling Strategy

**Horizontal Scaling**:
- Load balancer distributes traffic
- Multiple application server instances
- Stateless API design (JWT tokens)
- Database read replicas for heavy read workloads

**Vertical Scaling**:
- Upgrade server instances (more CPU/RAM)
- Upgrade database instance size
- Optimize database queries

**Caching Strategy**:
- **Redis** for session storage (post-MVP)
- **CloudFlare CDN** for image delivery
- **API response caching** for public endpoints

---

## Security Architecture

### Authentication Flow

**User Registration**:
1. User submits email + password
2. Backend hashes password (bcrypt, cost 12)
3. Create user record in database
4. Generate JWT token
5. Return token to frontend
6. Frontend stores token (localStorage or memory)

**User Login**:
1. User submits email + password
2. Backend verifies credentials
3. Generate JWT token (RS256, 1-hour expiry)
4. Return token to frontend
5. Frontend includes token in Authorization header

**Token Refresh**:
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (30 days)
- Refresh endpoint for new access tokens

### Authorization Model

**Role-Based Access Control (RBAC)**:
- **Free User**: 1 free generation, watermarked downloads
- **Paid User**: Purchased logos, high-res downloads
- **Subscriber** (post-MVP): Subscription benefits
- **Admin** (internal): User management, analytics

### Data Encryption

**In Transit**:
- HTTPS/TLS 1.3 only
- SSL certificate (Let's Encrypt)
- HSTS header enabled

**At Rest**:
- Encrypted database fields (user email, payment info)
- Encrypted S3 buckets (AES-256)
- Secure environment variables (.env files, not in git)

### API Security

**Rate Limiting**:
```php
// RateLimitMiddleware.php
class RateLimitMiddleware {
  // Free users: 10 requests per minute
  // Paid users: 100 requests per minute
  // Prevent abuse and DoS attacks
}
```

**Request Validation**:
- Input sanitization (XSS prevention)
- SQL injection prevention (prepared statements)
- CSRF protection (token-based)

**API Key Management**:
- OpenAI API keys stored in environment variables
- Stripe keys (public/secret) separated
- Never expose keys in frontend code

---

## Data Architecture

### Database Schema

**Users Table**:
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscription_tier ENUM('free', 'paid', 'subscriber') DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

**Logo Generations Table**:
```sql
CREATE TABLE logo_generations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  prompt_data JSON NOT NULL,
  optimized_prompt TEXT,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  status ENUM('generating', 'completed', 'failed') DEFAULT 'generating',
  ai_model VARCHAR(50) DEFAULT 'dalle3',
  generation_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at DESC)
);
```

**Payments Table**:
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  logo_id VARCHAR(36),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount_cents INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (logo_id) REFERENCES logo_generations(id) ON DELETE SET NULL,
  INDEX idx_user_status (user_id, status),
  INDEX idx_stripe_id (stripe_payment_intent_id)
);
```

**Subscription Plans Table** (Post-MVP):
```sql
CREATE TABLE subscription_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_cents INT NOT NULL,
  billing_interval ENUM('monthly', 'yearly') NOT NULL,
  logo_limit INT,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Relationships

```
users (1) ─────────< (M) logo_generations
  │
  └──────────────────< (M) payments
  │
  └──────────────────< (1) user_subscriptions (post-MVP)
```

### Data Flow

**Logo Generation Data Flow**:
1. User submits description (frontend)
2. API receives request, validates (backend)
3. Optimize prompt, call AI API (backend)
4. Save images to S3 (backend → S3)
5. Save generation record to DB (backend → database)
6. Return URLs to frontend (backend → frontend)
7. Frontend displays logos (frontend)

**Payment Data Flow**:
1. User clicks "Purchase" (frontend)
2. API creates Stripe payment intent (backend → Stripe)
3. Frontend displays Stripe checkout (frontend → Stripe)
4. User completes payment (Stripe)
5. Stripe webhook notifies backend (Stripe → backend)
6. Backend updates payment status (backend → database)
7. Backend grants access to high-res download (backend)

---

## Integration Architecture

### External APIs

**OpenAI DALL-E 3 API**:
- **Purpose**: Primary AI logo generation
- **Endpoint**: `https://api.openai.com/v1/images/generations`
- **Authentication**: Bearer token (API key)
- **Request Format**: JSON (prompt, n=4, size=1024x1024)
- **Response**: Array of image URLs
- **Rate Limits**: 50 requests per minute (tier-dependent)
- **Cost**: $0.04 per image (1024x1024)

**Stability AI** (Fallback):
- **Purpose**: Alternative AI model if OpenAI fails
- **Endpoint**: `https://api.stability.ai/v1/generation/stable-diffusion-xl`
- **Lower cost**: $0.02 per image

**Stripe Payment API**:
- **Purpose**: Payment processing
- **Endpoint**: `https://api.stripe.com/v1/`
- **Authentication**: API key (secret)
- **Webhooks**: Payment success/failure notifications
- **PCI Compliance**: Handled by Stripe

**AWS S3** (or DigitalOcean Spaces):
- **Purpose**: Logo file storage
- **SDK**: AWS SDK for PHP
- **Operations**: Upload, download, delete
- **Access Control**: Private buckets, signed URLs

### Third-Party Services

**Email (SendGrid or AWS SES)**:
- Transactional emails (welcome, receipt, password reset)
- Cost: Free tier → 100 emails/day (SendGrid)

**Analytics (Google Analytics 4)**:
- User behavior tracking
- Conversion tracking (free → paid)
- Custom events (logo generation, purchases)

**Error Tracking (Sentry)**:
- Real-time error notifications
- Stack traces for debugging
- Free tier → 5,000 events/month

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Lazy load routes
2. **Image Optimization**: WebP format, lazy loading
3. **Minification**: Uglify JS, CSS minification
4. **Bundle Size**: <500KB initial load
5. **Caching**: Service worker (post-MVP)

### Backend Optimization

1. **Database Query Optimization**:
   - Indexes on frequently queried columns
   - Avoid N+1 queries
   - Use SELECT only needed columns

2. **API Response Caching**:
   - Cache logo URLs (1 hour TTL)
   - Cache user profile data (5 minutes TTL)

3. **Async Processing**:
   - Queue logo generation requests
   - Background job for email sending

### AI Generation Optimization

1. **Prompt Caching**: Cache similar prompts
2. **Batch Requests**: Generate multiple variations in one call
3. **Timeout Handling**: Fallback to alternative model if slow

---

## Testing Strategy

### Unit Tests
- **Frontend**: Jasmine + Karma (Angular services, components)
- **Backend**: PHPUnit (services, repositories)
- **Coverage Target**: 80%+

### Integration Tests
- **API Tests**: Postman/Newman (API endpoint testing)
- **Database Tests**: Test database operations

### E2E Tests
- **Tool**: Cypress (frontend flows)
- **Critical Flows**:
  - User registration → logo generation → payment → download

### User Acceptance Tests
- Beta users test full flows
- Feedback collection
- Bug reporting

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Document Owner**: Marcus Johnson (Architecture Expert)  
**Status**: Ready for Expert Review
