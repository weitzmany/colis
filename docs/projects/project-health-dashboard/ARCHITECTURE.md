# Project Health Dashboard - Architecture

**Last Updated**: 2026-01-20  
**Status**: Planning  
**Architecture Version**: 1.0

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [Integration Architecture](#integration-architecture)
7. [Real-Time Updates Architecture](#real-time-updates-architecture)
8. [Security Architecture](#security-architecture)
9. [Performance & Scalability](#performance--scalability)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │        Next.js Frontend (React + TypeScript)               │ │
│  │  - Dashboard UI  - Charts  - Real-Time Updates (SSE)      │ │
│  └───────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / SSE
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Load Balancer (Nginx)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  API Server   │  │  API Server   │  │  API Server   │
│   (NestJS)    │  │   (NestJS)    │  │   (NestJS)    │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                   │
        └──────────────────┼───────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │  Redis       │  │ Data         │
│   Database   │  │  Cache       │  │ Collectors   │
│              │  │  Queue       │  │ (Background) │
└──────────────┘  └──────────────┘  └──────┬───────┘
                                           │
                      ┌────────────────────┼────────────────────┐
                      ▼                    ▼                    ▼
              ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
              │  GitHub API  │    │ GitLab API   │    │  npm API     │
              └──────────────┘    └──────────────┘    └──────────────┘
```

### System Components

1. **Frontend Layer**: Next.js application serving the dashboard UI
2. **API Layer**: NestJS REST API handling all business logic
3. **Data Layer**: PostgreSQL for persistent storage, Redis for caching
4. **Background Workers**: Data collection services running as scheduled jobs
5. **Integration Layer**: Connectors to external APIs (GitHub, GitLab, npm)

### Data Flow

**Dashboard View Flow**:
```
User → Frontend → API → Cache (Redis) → Database (PostgreSQL) → Frontend
```

**Data Collection Flow**:
```
Scheduler → Collector Worker → External API → Transform → Database → Cache Invalidation
```

**Real-Time Alert Flow**:
```
Collector → Detect Critical Issue → Event Queue → SSE Connection → Frontend Alert
```

---

## Technology Stack

### Frontend Technologies

**Framework**:
- **Next.js 15**: React framework with server-side rendering, App Router
- **React 19**: UI library with hooks, context
- **TypeScript 5.3**: Type safety, better DX

**UI & Styling**:
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **shadcn/ui**: Composable UI components (Radix UI + Tailwind)
- **Recharts**: Data visualization library for charts
- **Lucide Icons**: Icon library

**State Management**:
- **React Context API**: Global state for user, preferences
- **TanStack Query (React Query)**: Server state management, caching
- **Zustand**: Client state for UI interactions (if needed)

**Real-Time**:
- **EventSource API**: Server-Sent Events for real-time updates

### Backend Technologies

**Framework**:
- **Node.js 20 LTS**: JavaScript runtime
- **NestJS 10**: Progressive Node.js framework (TypeScript, modular architecture)
- **TypeScript 5.3**: Type safety

**API**:
- **REST API**: Standard HTTP endpoints
- **Express**: HTTP server (underneath NestJS)
- **class-validator**: Request validation
- **class-transformer**: Object transformation

**Database & Caching**:
- **PostgreSQL 16**: Primary relational database
- **Prisma 5**: TypeScript ORM for database access
- **Redis 7**: In-memory cache, job queue, pub/sub

**Background Jobs**:
- **Bull**: Redis-based job queue for background workers
- **Node-cron**: Scheduled job execution

**Authentication**:
- **Passport.js**: Authentication middleware
- **OAuth 2.0**: GitHub/GitLab OAuth integration
- **JWT**: JSON Web Tokens for session management

### Integration Libraries

**Git Integrations**:
- **Octokit**: GitHub API client (official)
- **GitLab SDK**: GitLab API client
- **Simple Git**: Git operations (if needed)

**Package Registry**:
- **npm-registry-fetch**: npm API client
- **semver**: Semantic version parsing

### Infrastructure

**Containerization**:
- **Docker**: Container runtime
- **Docker Compose**: Multi-container orchestration (development)

**CI/CD**:
- **GitHub Actions**: Continuous integration and deployment

**Hosting** (MVP):
- **DigitalOcean Droplet**: VPS hosting for simplicity

**Hosting** (Production/Scale):
- **AWS** (future): ECS (containers), RDS (PostgreSQL), ElastiCache (Redis)
- **Vercel** (future): Frontend hosting with CDN

### Monitoring & Observability

**Logging**:
- **Winston**: Structured logging
- **Morgan**: HTTP request logging

**Monitoring** (Future):
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Sentry**: Error tracking

---

## Frontend Architecture

### Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── page.tsx        # Dashboard home page
│   │   ├── projects/       # Projects routes
│   │   │   ├── page.tsx    # Projects list
│   │   │   └── [id]/       # Project detail
│   │   │       └── page.tsx
│   │   ├── analytics/      # Analytics routes
│   │   │   └── page.tsx
│   │   └── settings/       # Settings routes
│   │       └── page.tsx
│   ├── api/                # API routes (if needed)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── ProjectCard.tsx
│   │   ├── HealthScore.tsx
│   │   └── AlertBadge.tsx
│   ├── charts/             # Chart components
│   │   ├── HealthScoreTrend.tsx
│   │   └── TechnologyPieChart.tsx
│   └── layouts/            # Layout components
│       ├── DashboardLayout.tsx
│       └── Sidebar.tsx
├── lib/                    # Utilities
│   ├── api.ts              # API client
│   ├── utils.ts            # Helper functions
│   └── hooks/              # Custom React hooks
│       ├── useProjects.ts
│       ├── useHealthScore.ts
│       └── useRealTimeUpdates.ts
├── types/                  # TypeScript types
│   ├── project.ts
│   ├── health-score.ts
│   └── api.ts
└── styles/                 # Global styles
    └── globals.css
```

### State Management Strategy

**Server State** (TanStack Query):
- Project list
- Project details
- Health scores
- Analytics data

**Global State** (React Context):
- User authentication
- User preferences (theme, filters)
- Alert notifications

**Local State** (useState):
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific state

### Component Architecture

**Component Hierarchy**:
```
App (layout.tsx)
├── DashboardLayout
│   ├── Sidebar (navigation)
│   ├── Header (user, alerts)
│   └── Main Content
│       ├── Dashboard Page
│       │   ├── StatsOverview
│       │   ├── ProjectGrid
│       │   │   └── ProjectCard (repeated)
│       │   └── RecentActivity
│       ├── Project Detail Page
│       │   ├── ProjectHeader
│       │   ├── HealthScoreBreakdown
│       │   ├── MetricsCharts
│       │   └── ActivityFeed
│       └── Analytics Page
│           ├── TechnologyHeatmap
│           ├── DependencyMatrix
│           └── TrendCharts
```

### Real-Time Updates (SSE)

**Implementation**:
```typescript
// Custom hook for real-time updates
export function useRealTimeUpdates(projectId?: string) {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/events${projectId ? `?projectId=${projectId}` : ''}`
    );

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setUpdates((prev) => [update, ...prev]);
      
      // Update React Query cache
      queryClient.invalidateQueries(['projects', projectId]);
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect logic
    };

    return () => eventSource.close();
  }, [projectId]);

  return updates;
}
```

**Update Types**:
- `health_score_updated`: Health score changed
- `build_status_changed`: Build success/failure
- `dependency_vulnerability`: New vulnerability detected
- `critical_alert`: Critical issue detected

---

## Backend Architecture

### Project Structure

```
backend/
├── src/
│   ├── main.ts             # Application entry point
│   ├── app.module.ts       # Root module
│   ├── modules/            # Feature modules
│   │   ├── projects/       # Projects module
│   │   │   ├── projects.module.ts
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   └── entities/   # Database entities
│   │   ├── health/         # Health scoring module
│   │   ├── integrations/   # External integrations
│   │   │   ├── github/
│   │   │   ├── gitlab/
│   │   │   └── npm/
│   │   ├── collectors/     # Data collectors
│   │   ├── alerts/         # Alerting module
│   │   └── events/         # SSE events module
│   ├── common/             # Shared code
│   │   ├── guards/         # Auth guards
│   │   ├── interceptors/   # HTTP interceptors
│   │   ├── pipes/          # Validation pipes
│   │   └── decorators/     # Custom decorators
│   ├── config/             # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── integrations.config.ts
│   └── prisma/             # Prisma ORM
│       ├── schema.prisma
│       └── migrations/
├── test/                   # E2E tests
└── package.json
```

### API Architecture

**RESTful API Design**:
```
GET    /api/v1/projects                    # List all projects
GET    /api/v1/projects/:id                # Get project details
POST   /api/v1/projects                    # Create project (connect repo)
PUT    /api/v1/projects/:id                # Update project
DELETE /api/v1/projects/:id                # Delete project (disconnect)

GET    /api/v1/projects/:id/health         # Get health score
GET    /api/v1/projects/:id/metrics        # Get metrics
GET    /api/v1/projects/:id/activity       # Get recent activity

GET    /api/v1/analytics/portfolio         # Portfolio analytics
GET    /api/v1/analytics/technologies      # Technology trends
GET    /api/v1/analytics/dependencies      # Dependency analysis

GET    /api/v1/alerts                      # List alerts
POST   /api/v1/alerts/:id/acknowledge      # Acknowledge alert

GET    /api/v1/events                      # SSE endpoint for real-time updates
```

**Error Handling**:
```typescript
export class ApiError {
  statusCode: number;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}

// Example error response
{
  "statusCode": 404,
  "message": "Project not found",
  "details": { "projectId": "abc123" },
  "timestamp": "2026-01-20T10:30:00Z",
  "path": "/api/v1/projects/abc123"
}
```

### Data Collection Service

**Collection Flow**:
```
Scheduler (cron) → Queue Job → Collector Worker → External API → Transform → Save to DB → Cache Invalidation
```

**Collectors**:
1. **GitHub Collector**: Fetch commits, PRs, issues, branch status
2. **GitLab Collector**: Similar to GitHub
3. **npm Collector**: Fetch package info, dependencies, vulnerabilities
4. **CI/CD Collector**: Fetch build status (GitHub Actions)

**Collection Schedule**:
- **Health metrics**: Every hour
- **Critical alerts**: Real-time (webhook triggers)
- **Historical data**: Daily aggregation

**Collector Implementation**:
```typescript
@Injectable()
export class GitHubCollector {
  async collect(projectId: string): Promise<CollectedData> {
    const project = await this.projectsService.findOne(projectId);
    const octokit = new Octokit({ auth: project.githubToken });

    // Collect data
    const commits = await octokit.repos.listCommits({ ... });
    const prs = await octokit.pulls.list({ ... });
    const issues = await octokit.issues.listForRepo({ ... });
    
    // Transform and return
    return this.transform({ commits, prs, issues });
  }
}
```

### Health Scoring Engine

**Health Score Formula**:
```
Health Score (0-100) = 
  Code Quality (40%) +
  Dependency Health (30%) +
  Build Status (30%)
```

**Code Quality Score (0-100)**:
- Test Coverage: 40% (0-100% coverage → 0-40 points)
- Linting Status: 30% (0 errors = 30 points, >10 errors = 0 points)
- Code Complexity: 30% (low complexity = 30 points)

**Dependency Health Score (0-100)**:
- Outdated Dependencies: 50% (0% outdated = 50 points)
- Security Vulnerabilities: 50% (0 vulns = 50 points, critical vulns = 0 points)

**Build Status Score (0-100)**:
- Last 10 Builds Success Rate: 100% (10/10 = 100 points, 0/10 = 0 points)

**Implementation**:
```typescript
export class HealthScoringService {
  calculateHealthScore(metrics: ProjectMetrics): number {
    const codeQuality = this.calculateCodeQuality(metrics);
    const dependencyHealth = this.calculateDependencyHealth(metrics);
    const buildStatus = this.calculateBuildStatus(metrics);

    return (
      codeQuality * 0.4 +
      dependencyHealth * 0.3 +
      buildStatus * 0.3
    );
  }
}
```

---

## Database Architecture

### Data Models (Prisma Schema)

```prisma
model Project {
  id                String   @id @default(uuid())
  name              String
  description       String?
  repositoryUrl     String
  provider          Provider // GITHUB, GITLAB
  healthScore       Float    @default(0)
  status            Status   @default(ACTIVE)
  
  // Git Integration
  githubToken       String?  @db.VarChar(500)
  gitlabToken       String?  @db.VarChar(500)
  
  // Metadata
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastCollectedAt   DateTime?
  
  // Relations
  metrics           ProjectMetrics[]
  alerts            Alert[]
  events            Event[]
  
  @@index([status])
  @@index([healthScore])
}

model ProjectMetrics {
  id                String   @id @default(uuid())
  projectId         String
  
  // Code Quality
  testCoverage      Float?   // 0-100
  lintingErrors     Int      @default(0)
  complexity        Float?   // 0-100 (cyclomatic complexity)
  
  // Dependencies
  totalDependencies Int      @default(0)
  outdatedDeps      Int      @default(0)
  vulnerabilities   Int      @default(0)
  criticalVulns     Int      @default(0)
  
  // Build Status
  lastBuildStatus   BuildStatus // SUCCESS, FAILURE
  buildSuccessRate  Float    @default(100) // Last 10 builds
  
  // Activity
  commitCount       Int      @default(0)
  prCount           Int      @default(0)
  issueCount        Int      @default(0)
  
  // Timestamps
  timestamp         DateTime @default(now())
  
  // Relations
  project           Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId, timestamp])
}

model Alert {
  id                String      @id @default(uuid())
  projectId         String
  type              AlertType   // BUILD_FAILURE, VULNERABILITY, OUTDATED_DEPS
  severity          Severity    // CRITICAL, HIGH, MEDIUM, LOW
  title             String
  description       String
  acknowledged      Boolean     @default(false)
  acknowledgedAt    DateTime?
  createdAt         DateTime    @default(now())
  resolvedAt        DateTime?
  
  // Relations
  project           Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId, acknowledged])
  @@index([severity, acknowledged])
}

model Event {
  id          String     @id @default(uuid())
  projectId   String?    // Null for portfolio-level events
  type        EventType  // HEALTH_SCORE_UPDATED, BUILD_STATUS_CHANGED, etc.
  data        Json
  timestamp   DateTime   @default(now())
  
  // Relations
  project     Project?   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([timestamp])
  @@index([projectId, timestamp])
}

enum Provider {
  GITHUB
  GITLAB
}

enum Status {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum BuildStatus {
  SUCCESS
  FAILURE
  IN_PROGRESS
  UNKNOWN
}

enum AlertType {
  BUILD_FAILURE
  VULNERABILITY
  OUTDATED_DEPS
  DOCUMENTATION_GAP
}

enum Severity {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum EventType {
  HEALTH_SCORE_UPDATED
  BUILD_STATUS_CHANGED
  DEPENDENCY_VULNERABILITY
  CRITICAL_ALERT
  PROJECT_CREATED
  PROJECT_UPDATED
}
```

### Database Optimization

**Indexing Strategy**:
- Index on `projectId` for fast lookups
- Index on `timestamp` for time-series queries
- Composite index on `projectId + timestamp` for project metrics
- Index on `healthScore` for filtering/sorting
- Index on `acknowledged` for alert queries

**Query Optimization**:
- Use `SELECT` with specific columns (avoid `SELECT *`)
- Use pagination for large result sets
- Use database-level aggregations
- Implement query result caching (Redis)

**Data Retention**:
- **Events**: 90 days (raw events)
- **Metrics**: 2 years (aggregated daily)
- **Alerts**: Retain indefinitely (but can be archived)

---

## Integration Architecture

### Git Integration (GitHub)

**Authentication**:
- OAuth 2.0 flow for user authorization
- Personal Access Token (PAT) for API access
- Store encrypted tokens in database

**Data Collection**:
```typescript
// Collect repository data
const repoData = await octokit.repos.get({ owner, repo });
const commits = await octokit.repos.listCommits({ owner, repo });
const branches = await octokit.repos.listBranches({ owner, repo });
const pullRequests = await octokit.pulls.list({ owner, repo });
```

**Rate Limiting**:
- GitHub: 5,000 requests/hour (authenticated)
- Implement smart caching and conditional requests
- Use `If-Modified-Since` headers to avoid unnecessary requests

### CI/CD Integration (GitHub Actions)

**Data Collection**:
```typescript
const workflows = await octokit.actions.listRepoWorkflows({ owner, repo });
const runs = await octokit.actions.listWorkflowRuns({ owner, repo, workflow_id });
```

**Build Status Aggregation**:
- Collect last 10 workflow runs
- Calculate success rate
- Detect failing builds for alerts

### Package Registry Integration (npm)

**Data Collection**:
```typescript
// Fetch package info
const packageInfo = await fetch(`https://registry.npmjs.org/${packageName}`);
const vulnerabilities = await fetch(`https://registry.npmjs.org/-/npm/v1/security/audits`);
```

**Dependency Analysis**:
- Parse `package.json` from repository
- Check each dependency version against latest
- Flag outdated dependencies (>6 months old)
- Flag security vulnerabilities (via npm audit API)

---

## Real-Time Updates Architecture

### Server-Sent Events (SSE)

**SSE Endpoint**:
```typescript
@Controller('events')
export class EventsController {
  @Sse('stream')
  async streamEvents(@Req() req: Request): Promise<Observable<MessageEvent>> {
    const userId = req.user.id;
    
    return new Observable((observer) => {
      // Subscribe to Redis pub/sub
      this.redisSubscriber.subscribe(`events:${userId}`);
      
      this.redisSubscriber.on('message', (channel, message) => {
        const event = JSON.parse(message);
        observer.next({ data: event });
      });
      
      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        observer.next({ data: { type: 'heartbeat' } });
      }, 30000);
      
      return () => {
        clearInterval(heartbeat);
        this.redisSubscriber.unsubscribe(`events:${userId}`);
      };
    });
  }
}
```

**Event Publishing**:
```typescript
// When health score updates
await this.redis.publish(`events:${userId}`, JSON.stringify({
  type: 'health_score_updated',
  projectId: 'abc123',
  healthScore: 85,
  timestamp: new Date().toISOString(),
}));
```

**Frontend Connection**:
```typescript
const eventSource = new EventSource('/api/v1/events');

eventSource.addEventListener('health_score_updated', (event) => {
  const data = JSON.parse(event.data);
  // Update UI
});
```

---

## Security Architecture

### Authentication & Authorization

**OAuth 2.0 Flow**:
```
User → Authorize GitHub → GitHub Auth Callback → Exchange Code for Token → Store Token → Redirect to Dashboard
```

**JWT Session Management**:
- Access token (short-lived, 15 minutes)
- Refresh token (long-lived, 7 days)
- Store refresh token in httpOnly cookie

**Role-Based Access Control (RBAC)**:
- **Admin**: Full access, can connect/disconnect projects
- **User**: Read-only access to dashboard

### Data Security

**Encryption**:
- TLS/HTTPS for all connections
- Encrypt tokens at rest (AES-256)
- Encrypt sensitive data in database

**API Security**:
- Rate limiting (100 requests/minute per user)
- API key authentication for programmatic access
- CORS configuration (whitelist frontend domain)

**Secrets Management**:
- Environment variables for sensitive config
- Use secrets manager (AWS Secrets Manager future)
- Never log sensitive data

---

## Performance & Scalability

### Caching Strategy

**Cache Layers**:
1. **Browser Cache**: Static assets, service worker
2. **CDN Cache**: Frontend assets (future)
3. **Application Cache (Redis)**: API responses, health scores
4. **Database Cache**: Query result cache

**Cache Keys**:
```
projects:list                    # TTL: 5 minutes
project:{id}                     # TTL: 5 minutes
project:{id}:health              # TTL: 1 hour
project:{id}:metrics:{date}      # TTL: 24 hours
analytics:portfolio              # TTL: 1 hour
```

**Cache Invalidation**:
- Invalidate on data update (health score change, metrics update)
- TTL-based expiration for stale data

### Database Performance

**Connection Pooling**:
- PostgreSQL: 20 connection pool
- Redis: 10 connection pool

**Query Optimization**:
- Use indexes for frequently queried fields
- Implement pagination (limit/offset)
- Use aggregation at database level
- Avoid N+1 queries (use joins or batch loading)

### Scalability Plan

**MVP (50 projects, 20 users)**:
- Single DigitalOcean droplet (4 vCPU, 8 GB RAM)
- Single PostgreSQL instance
- Single Redis instance

**Phase 2 (200 projects, 100 users)**:
- Horizontal scaling: 3-5 API servers behind load balancer
- Managed PostgreSQL (DigitalOcean or AWS RDS)
- Managed Redis (AWS ElastiCache)
- CDN for frontend (Cloudflare)

**Phase 3 (1000+ projects, 500+ users)**:
- Auto-scaling API servers (Kubernetes or ECS)
- Read replicas for PostgreSQL
- Redis cluster for caching
- Separate job queue workers
- Distributed data collection (multiple collectors)

---

## Deployment Architecture

### MVP Deployment (DigitalOcean)

**Single Droplet Architecture**:
```
┌─────────────────────────────────────────┐
│         DigitalOcean Droplet            │
│  ┌─────────────────────────────────┐   │
│  │  Docker Compose                  │   │
│  │  ┌───────────┐  ┌────────────┐  │   │
│  │  │ Frontend  │  │  Backend   │  │   │
│  │  │ (Next.js) │  │  (NestJS)  │  │   │
│  │  └───────────┘  └────────────┘  │   │
│  │  ┌───────────┐  ┌────────────┐  │   │
│  │  │PostgreSQL │  │   Redis    │  │   │
│  │  └───────────┘  └────────────┘  │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  Nginx (Reverse Proxy)    │  │   │
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Docker Compose Configuration**:
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/dashboard
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=dashboard
      - POSTGRES_PASSWORD=password

  redis:
    image: redis:7
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Dashboard

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: deploy
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/dashboard
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

### Future Production Deployment (AWS)

**AWS Architecture**:
```
CloudFront (CDN) → S3 (Static Assets) → ECS (API) → RDS (PostgreSQL) + ElastiCache (Redis)
```

---

## Monitoring & Observability

### Logging Strategy

**Log Levels**:
- **ERROR**: Application errors, exceptions
- **WARN**: Warnings, rate limit approaching
- **INFO**: Important application events
- **DEBUG**: Detailed debugging information

**Structured Logging**:
```typescript
logger.info('Health score calculated', {
  projectId: 'abc123',
  healthScore: 85,
  previousScore: 78,
  timestamp: new Date().toISOString(),
});
```

### Metrics (Future)

**Application Metrics**:
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (errors/second)
- Health score distribution

**Business Metrics**:
- Active projects count
- Active users count
- Data collection success rate
- Alert resolution time

### Error Tracking (Future)

**Sentry Integration**:
- Frontend error tracking
- Backend error tracking
- Performance monitoring

---

## Appendices

### Technology Justifications

**Next.js over Create React App**:
- Built-in SSR for better performance
- App Router for modern React patterns
- Built-in API routes if needed
- Better SEO (if dashboard becomes public)

**NestJS over Express**:
- Built-in TypeScript support
- Modular architecture out of the box
- Dependency injection
- Better testability

**PostgreSQL over MySQL**:
- Better JSON support (for event data)
- Better performance for complex queries
- Better support for time-series data

**Prisma over TypeORM**:
- Better TypeScript support
- Type-safe queries
- Better migration system
- Better documentation

---

**Document Version**: 1.0  
**Last Reviewed**: 2026-01-20  
**Next Review**: 2026-02-20
