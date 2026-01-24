# Sports Results Tracker - Infrastructure & Deployment

## Hosting Architecture

### Multi-Service Deployment

```
┌─────────────────────────────────────────────────────┐
│                   Vercel Edge Network                │
│           (Frontend CDN + Edge Functions)            │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│             Railway Platform (Backend)               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Node.js    │  │ PostgreSQL   │  │   Redis   │ │
│  │   Express    │  │   Database   │  │   Cache   │ │
│  │     API      │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└────────────┬────────────────────────────────────────┘
             │
             │ HTTPS
             ▼
┌─────────────────────────────────────────────────────┐
│              External Services                       │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │API-Football │  │  Sentry  │  │ UptimeRobot  │  │
│  │ Sports Data │  │  Errors  │  │  Monitoring  │  │
│  └─────────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Frontend Hosting (Vercel)

**Features**:
- Automatic Git deployments
- Global CDN (Edge Network)
- Preview deployments for pull requests
- Environment variable management
- Serverless functions (if needed)
- Built-in analytics

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Environment Variables** (Vercel Dashboard):
```
VITE_API_URL=https://api.sportsresults.app
VITE_SENTRY_DSN=https://...
VITE_ENV=production
```

### Backend Hosting (Railway)

**Features**:
- Automatic Git deployments
- Built-in PostgreSQL database
- Redis add-on
- Auto-scaling (vertical)
- Environment variable management
- One-click deployments

**Configuration** (`railway.toml`):
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
```

**Resources** (Railway):
- CPU: 1 vCPU (auto-scales to 2)
- Memory: 512MB (auto-scales to 1GB)
- PostgreSQL: 1GB storage (scales as needed)
- Redis: 256MB memory (scales as needed)

**Cost Estimate**:
- Base: $5/month (starter plan)
- PostgreSQL: $5/month (included in starter)
- Redis: $5/month (add-on)
- **Total**: ~$10-15/month for MVP

## CI/CD Pipeline

### GitHub Actions Workflow

**Continuous Integration** (`.github/workflows/ci.yml`):
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Check bundle size
        run: npm run build && npm run analyze

  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

**Continuous Deployment** (Automatic):
- **Vercel**: Auto-deploys on push to `main` branch
- **Railway**: Auto-deploys on push to `main` branch
- **Preview Deployments**: Auto-created for all pull requests

### Deployment Workflow

```
┌──────────────────────────────────────────────────────┐
│              Developer Workflow                       │
└──────────────────────────────────────────────────────┘
                       │
                       │ 1. git push origin feature-branch
                       ▼
┌──────────────────────────────────────────────────────┐
│              GitHub Pull Request                      │
│  - CI runs (lint, test, type-check)                  │
│  - Preview deployment created (Vercel)               │
│  - Code review required                              │
└──────────────────────────────────────────────────────┘
                       │
                       │ 2. Merge to main
                       ▼
┌──────────────────────────────────────────────────────┐
│              Production Deployment                    │
│  ┌────────────────────────────────────────────────┐ │
│  │ Vercel: Frontend deployed to production        │ │
│  │ Railway: Backend deployed to production        │ │
│  │ Database migrations run automatically          │ │
│  │ Cache cleared (Redis)                          │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
                       │
                       │ 3. Verification
                       ▼
┌──────────────────────────────────────────────────────┐
│              Health Checks & Monitoring               │
│  - API health check: GET /health                     │
│  - Uptime monitoring (UptimeRobot)                   │
│  - Error tracking (Sentry)                           │
│  - Performance monitoring (Vercel Analytics)         │
└──────────────────────────────────────────────────────┘
```

## Monitoring & Observability

### Error Tracking (Sentry)

**Setup** (Frontend):
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Setup** (Backend):
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Attach to Express
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler (must be last)
app.use(Sentry.Handlers.errorHandler());
```

**Monitored Errors**:
- Frontend JavaScript errors
- Backend API errors
- Database connection errors
- External API failures (API-Football)
- Authentication failures
- Rate limit violations

### Uptime Monitoring (UptimeRobot)

**Monitored Endpoints**:
```
https://sportsresults.app/           # Frontend (every 5 minutes)
https://api.sportsresults.app/health # Backend (every 5 minutes)
```

**Health Check Endpoint**:
```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();
    
    // Check external API
    const apiStatus = await checkApiFoodballStatus();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        redis: 'up',
        apiFoodball: apiStatus ? 'up' : 'degraded',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});
```

**Alert Configuration**:
- Email alerts on downtime
- SMS alerts for critical failures (optional)
- Slack notifications (Phase 2)

### Analytics (Vercel Analytics)

**Tracked Metrics**:
- Page views by route
- Core Web Vitals (LCP, FID, CLS)
- User sessions
- Geographic distribution
- Device types (mobile vs desktop)

**Custom Events** (Phase 2):
```typescript
import { track } from '@vercel/analytics';

// Track user actions
track('team_followed', { teamId: team.id, teamName: team.name });
track('score_refreshed', { matchesCount: matches.length });
track('premium_upgrade', { userId: user.id });
```

### Application Logging

**Log Levels**:
- `ERROR`: Critical errors requiring immediate attention
- `WARN`: Warning conditions
- `INFO`: Informational messages
- `DEBUG`: Debug-level messages (development only)

**Logging Setup**:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sports-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Usage
logger.info('Live scores updated', { matchCount: 15 });
logger.error('API-Football request failed', { error: error.message });
logger.warn('Rate limit approaching', { requestCount: 95 });
```

**Log Retention**:
- Railway logs: 7 days (free tier)
- File logs: 30 days (local backup)
- Sentry errors: 90 days (free tier)

## Scaling Strategy

### Phase 1: MVP (Vertical Scaling)

**Current Setup**:
- Single Railway instance (auto-scales CPU/memory)
- Single PostgreSQL database
- Single Redis instance
- Vercel Edge Network (global CDN)

**Scaling Triggers**:
- CPU usage > 80% → Scale to 2 vCPUs
- Memory usage > 80% → Scale to 1GB
- Database connections > 80 → Increase connection pool

**Estimated Capacity**:
- 1,000 concurrent users
- 100,000 API requests/day
- 10,000 live score updates/day

### Phase 2: Growth (Horizontal Scaling)

**When to Scale Horizontally**:
- 5,000+ concurrent users during major games
- 500,000+ API requests/day
- Single instance CPU consistently > 80%

**Scaling Plan**:
```
┌────────────────────────────────────────────┐
│         Load Balancer (Railway)            │
└────────────┬───────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ Backend  │  │ Backend  │
│Instance 1│  │Instance 2│
└─────┬────┘  └─────┬────┘
      │             │
      └──────┬──────┘
             │
             ▼
┌──────────────────────────────┐
│   PostgreSQL (Primary)       │
│   + Read Replica             │
└──────────────────────────────┘
             │
             ▼
┌──────────────────────────────┐
│   Redis Cluster (3 nodes)    │
└──────────────────────────────┘
```

**Horizontal Scaling Features**:
- Multiple backend instances (2-4)
- PostgreSQL read replicas for read-heavy queries
- Redis cluster for distributed caching
- Load balancer for traffic distribution

### Phase 3: Enterprise Scale

**Advanced Scaling** (10,000+ concurrent users):
- Microservices architecture (separate score service, standings service)
- Database sharding by league
- CDN caching for API responses
- WebSocket connection pooling
- Message queue for async tasks (RabbitMQ/Redis Pub/Sub)

## Performance Targets

### Response Time Targets

| Endpoint | Target (p95) | Critical? |
|----------|--------------|-----------|
| GET /scores/live | <200ms | Yes |
| GET /standings/:league | <150ms | Yes |
| GET /fixtures | <150ms | No |
| GET /teams/:teamId | <100ms | No |
| POST /auth/login | <300ms | No |

### Availability Targets

- **Overall Uptime**: 99.0% (MVP), 99.5% (Phase 2+)
- **Uptime During Major Games**: 99.5% (critical)
- **Maximum Downtime**: 7 hours/month (MVP), 3.5 hours/month (Phase 2+)

### Performance Monitoring

**Key Metrics**:
- Average response time (p50, p95, p99)
- Error rate (percentage)
- Request rate (requests/second)
- Cache hit rate (percentage)
- Database query time (p95)

**Performance Alerts**:
- Response time p95 > 500ms
- Error rate > 1%
- Cache hit rate < 85%
- Database query time > 100ms

## Backup & Disaster Recovery

### Database Backups

**Automated Backups** (Railway):
- Daily automated backups (retained for 7 days)
- Manual backups before major deployments
- Point-in-time recovery available

**Backup Schedule**:
- Daily: 3:00 AM UTC (automatic)
- Weekly: Sunday 3:00 AM UTC (long-term retention)
- Before deployments: Manual trigger

### Redis Persistence

**RDB Snapshots**:
- Snapshot every hour (if data changed)
- Snapshot on Railway restart

**AOF (Append-Only File)**:
- Disabled for MVP (RDB sufficient)
- Enable in Phase 2 for critical data

### Disaster Recovery Plan

**Recovery Time Objectives**:
- **Database**: Restore from backup within 1 hour
- **Redis**: Rebuild cache from database within 30 minutes
- **Application**: Redeploy from Git within 15 minutes

**Recovery Scenarios**:

1. **Database Failure**:
   - Restore from latest backup
   - Rebuild Redis cache
   - Verify data integrity
   - Resume operations

2. **Redis Failure**:
   - Clear failed instance
   - Restart Redis
   - Warm cache from database
   - Monitor performance

3. **API-Football Outage**:
   - Switch to fallback API (SportMonks)
   - Serve cached data (up to 5 minutes old)
   - Display service degradation notice
   - Monitor primary API status

4. **Complete Outage**:
   - Deploy to new Railway environment
   - Restore database from backup
   - Update DNS to new environment
   - Verify all services operational

## Security

### SSL/TLS Configuration

**HTTPS Enforcement**:
- Automatic Let's Encrypt certificates (Vercel & Railway)
- TLS 1.3 minimum
- HTTPS redirect (301) for all HTTP requests
- HSTS header: `max-age=31536000; includeSubDomains`

### Environment Variables

**Sensitive Data**:
- Database credentials (Railway managed)
- Redis credentials (Railway managed)
- JWT secret (manually configured)
- API-Football API key (manually configured)
- Sentry DSN (manually configured)

**Never Commit**:
- `.env` files (gitignored)
- API keys
- Database passwords
- JWT secrets

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: [
    'https://sportsresults.app',
    'https://www.sportsresults.app',
    /\.vercel\.app$/, // Preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

## Cost Management

### MVP Cost Breakdown

| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Vercel (Frontend) | $0 | Free tier (100GB bandwidth) |
| Railway (Backend + DB + Redis) | $10-15 | Starter plan + Redis add-on |
| API-Football | $0 | Free tier (100 calls/day) |
| Sentry | $0 | Free tier (5K errors/month) |
| UptimeRobot | $0 | Free tier (50 monitors) |
| **Total** | **$10-15/month** | MVP |

### Growth Cost Estimates

**Phase 2** (1,000-5,000 users):
- Railway: $20-30/month (increased usage)
- API-Football: $15/month (paid tier for 3K calls/day)
- Total: ~$35-45/month

**Phase 3** (5,000-10,000 users):
- Railway: $50-75/month (multiple instances)
- API-Football: $15/month
- Vercel: $20/month (Pro plan for analytics)
- Total: ~$85-110/month

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Status**: Planning - Infrastructure Specification  
**Related**: [Frontend Architecture](frontend-architecture.md), [Backend Architecture](backend-architecture.md)
