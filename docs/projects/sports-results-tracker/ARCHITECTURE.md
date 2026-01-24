# Sports Results Tracker - Architecture Overview

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Documents](#architecture-documents)
- [Technology Stack](#technology-stack)
- [Data Flow](#data-flow)
- [Performance Targets](#performance-targets)

## System Overview

The Sports Results Tracker is a modern, scalable web application built with a React frontend, Node.js backend, and PostgreSQL database. The system follows a three-tier architecture with clear separation of concerns and is optimized for real-time sports data delivery.

### High-Level Architecture

```
┌─────────────────┐
│   Users/Fans    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│        Frontend (React PWA)              │
│  ┌──────────┐  ┌──────────┐            │
│  │   Home   │  │  Scores  │            │
│  │  Page    │  │  Page    │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Standings│  │Following │            │
│  │  Page    │  │  Page    │            │
│  └──────────┘  └──────────┘            │
└───────────────────┬─────────────────────┘
                    │ HTTPS/REST
                    ▼
┌─────────────────────────────────────────┐
│      Backend API (Node.js/Express)      │
│  ┌──────────┐  ┌──────────┐            │
│  │  Scores  │  │ Standings│            │
│  │   API    │  │   API    │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Fixtures │  │  Teams   │            │
│  │   API    │  │   API    │            │
│  └──────────┘  └──────────┘            │
└──────┬────────────┬─────────────────────┘
       │            │
       ▼            ▼
┌──────────┐  ┌──────────────┐
│PostgreSQL│  │    Redis     │
│ Database │  │    Cache     │
└──────────┘  └──────────────┘
       ▲
       │
┌──────┴────────────┐
│   API-Football    │
│  (External Data)  │
└───────────────────┘
```

### System Components

1. **Frontend (React PWA)**
   - Single-page application
   - Progressive Web App capabilities
   - Responsive design (mobile-first)
   - Client-side routing
   - State management with Zustand
   - Data fetching with React Query

2. **Backend API (Node.js + Express)**
   - RESTful API
   - Data aggregation and transformation
   - Caching layer
   - Rate limiting
   - Authentication (Phase 2)

3. **Database (PostgreSQL)**
   - Match data storage
   - Team and league information
   - User data (Phase 2)
   - Historical records

4. **Cache (Redis)**
   - Live score caching (30-second TTL)
   - API response caching
   - Session storage (Phase 2)

5. **External Data (API-Football)**
   - Sports data provider
   - Live scores, fixtures, standings
   - Team and player information

### Data Flow

**Live Score Updates (MVP - Polling)**:
```
1. Frontend requests scores every 30 seconds
2. Backend checks Redis cache
3. If cache miss or expired:
   a. Backend fetches from API-Football
   b. Backend stores in Redis (30s TTL)
   c. Backend stores in PostgreSQL (permanent)
4. Backend returns data to frontend
5. Frontend updates UI
```

**Real-Time Updates (Phase 2 - WebSockets)**:
```
1. Frontend establishes WebSocket connection
2. Backend polls API-Football every 10-30 seconds
3. On score change:
   a. Backend updates Redis + PostgreSQL
   b. Backend broadcasts to all connected clients
4. Frontend receives push update
5. Frontend updates UI instantly
```

## Architecture Documents

This architecture is documented in detail across multiple specialized documents:

### Frontend Architecture
📄 **[Frontend Architecture](technical/frontend-architecture.md)**
- React 18 + TypeScript component architecture
- State management (Zustand + React Query)
- Routing and navigation structure
- Performance optimization strategies
- Progressive Web App (PWA) implementation
- Mobile optimization

### Backend Architecture
📄 **[Backend Architecture](technical/backend-architecture.md)**
- RESTful API design and endpoints
- Database schema (PostgreSQL)
- Caching strategy (Redis)
- Authentication & authorization (Phase 2)
- Data ingestion pipeline
- Security best practices

### Infrastructure & Deployment
📄 **[Infrastructure & Deployment](technical/infrastructure-deployment.md)**
- Hosting architecture (Vercel + Railway)
- CI/CD pipeline (GitHub Actions)
- Monitoring & observability (Sentry, UptimeRobot)
- Scaling strategy
- Backup & disaster recovery
- Cost management

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5.3 | Type safety |
| Vite | 5.0 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Zustand | 4.5 | State management |
| React Query | 5.17 | Server state |
| React Router | 6.21 | Routing |
| Zod | 3.22 | Validation |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | Runtime |
| Express | 4.18 | Web framework |
| PostgreSQL | 16 | Database |
| Redis | 7.2 | Cache |
| Prisma | 5.8 | ORM (Phase 2) |
| bcrypt | 5.1 | Password hashing |
| jsonwebtoken | 9.0 | JWT auth (Phase 2) |

### Infrastructure

| Service | Purpose | Cost (MVP) |
|---------|---------|------------|
| Vercel | Frontend hosting | Free |
| Railway | Backend + DB + Redis | $10-15/month |
| API-Football | Sports data | Free tier |
| Sentry | Error tracking | Free tier |
| UptimeRobot | Monitoring | Free tier |

**Total Infrastructure Cost (MVP)**: ~$10-15/month

## Performance Targets

### Frontend Performance

- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.0s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Bundle Size**: <200KB initial load

### Backend Performance

- **API Response Time (p95)**: <200ms
- **Database Query Time (p95)**: <50ms
- **Cache Hit Rate**: >90%
- **Uptime**: 99%+ (MVP), 99.5%+ (Phase 2)

### Data Performance

- **Live Score Update Latency**: <30s (MVP), <1s (Phase 2)
- **Data Accuracy**: 99.9%+ correct scores
- **API Rate Limit**: 100 calls/day (MVP free tier)

## Security Architecture

### Authentication (Phase 2)

- **Method**: JWT (JSON Web Tokens)
- **Token Storage**: httpOnly cookies
- **Token Expiry**: 24 hours
- **Password Hashing**: bcrypt (cost factor: 12)

### Data Protection

- **In Transit**: HTTPS/TLS 1.3
- **At Rest**: Database encryption (Railway managed)
- **Secrets**: Environment variables (never committed)

### API Security

- **Rate Limiting**: 100 requests/minute per IP
- **Input Validation**: Zod schemas
- **SQL Injection Prevention**: Parameterized queries
- **CORS**: Whitelist specific domains

## Scalability

### Vertical Scaling (MVP - Phase 2)

**Current Capacity**:
- 1,000 concurrent users
- 100,000 API requests/day
- Single Railway instance (auto-scales CPU/memory)

**Scaling Triggers**:
- CPU usage > 80% → Scale to 2 vCPUs
- Memory usage > 80% → Scale to 1GB

### Horizontal Scaling (Phase 3+)

**When Needed**:
- 5,000+ concurrent users
- 500,000+ API requests/day

**Scaling Strategy**:
- Multiple backend instances (load balanced)
- PostgreSQL read replicas
- Redis cluster
- CDN edge caching

## Data Architecture

### Data Sources

**Primary**: API-Football
- Coverage: 1000+ leagues, 100,000+ matches
- Update frequency: Real-time
- Rate limits: 100 calls/day (free), 3000/day (paid)

**Backup**: SportMonks or TheSportsDB
- Fallback if primary fails

### Data Retention

**Hot Data** (PostgreSQL + Redis):
- Current season matches: All data
- Live scores: Last 24 hours in Redis
- Fixtures: Next 30 days

**Warm Data** (PostgreSQL):
- Previous 2 seasons: Full match data
- Historical standings: All seasons

**Cold Data** (Archive - Phase 3):
- Seasons 3+ years old: Archive to S3

## Integration Points

### External APIs

1. **API-Football** (Primary sports data)
   - Live scores
   - Fixtures
   - Standings
   - Team/player details

2. **Email** (Phase 2): Resend
   - Transactional emails
   - Password reset
   - Notifications

3. **Push Notifications** (Phase 2): OneSignal
   - Browser push notifications
   - Match alerts

4. **Analytics**: Vercel Analytics
   - Page views
   - Core Web Vitals
   - User sessions

5. **Error Tracking**: Sentry
   - Frontend errors
   - Backend errors
   - Performance monitoring

## Development Workflow

### Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev        # Start dev server (http://localhost:5173)

# Backend
cd backend
npm install
npm run dev        # Start dev server (http://localhost:3000)

# Database (Docker)
docker-compose up -d postgres redis
```

### Testing

```bash
# Frontend
npm run test       # Unit tests (Vitest)
npm run test:e2e   # E2E tests (Playwright)

# Backend
npm run test       # Unit tests (Jest)
npm run test:int   # Integration tests
```

### Deployment

```bash
# Automatic deployments via Git push
git push origin main

# Vercel (frontend): Auto-deploys
# Railway (backend): Auto-deploys

# Database migrations
npm run migrate:deploy
```

## Monitoring & Observability

### Error Tracking (Sentry)
- Frontend JavaScript errors
- Backend API errors
- Database connection errors
- External API failures

### Uptime Monitoring (UptimeRobot)
- Frontend: https://sportsresults.app
- Backend: https://api.sportsresults.app/health
- Check interval: 5 minutes

### Performance Monitoring
- Vercel Analytics (Core Web Vitals)
- Backend response times
- Database query performance
- Cache hit rates

### Logging
- Winston logger (backend)
- Log levels: ERROR, WARN, INFO, DEBUG
- Railway logs (7-day retention)

## Future Enhancements

### Phase 2 (Weeks 11-14)
- WebSocket real-time updates (<1s latency)
- User accounts and authentication
- Push notifications
- Player statistics
- Match history

### Phase 3 (Weeks 15-20)
- Additional sports (basketball, football)
- Custom leagues
- Social features (predictions, comments)
- Developer API access

### Phase 4 (Weeks 21-28)
- Native mobile apps (iOS, Android)
- Premium subscriptions
- Fantasy league integration
- Video highlights (if licensing permits)

---

**Document Version**: 2.0  
**Last Updated**: 2026-01-25  
**Status**: Planning - Architecture Complete  
**Changes**: Split architecture into specialized documents for better organization and maintainability

## Related Documentation

- [PRD Overview](PRD_OVERVIEW.md) - Product requirements and MVP definition
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs
- [Frontend Architecture](technical/frontend-architecture.md) - Detailed frontend specs
- [Backend Architecture](technical/backend-architecture.md) - Detailed backend specs
- [Infrastructure & Deployment](technical/infrastructure-deployment.md) - Infrastructure specs
