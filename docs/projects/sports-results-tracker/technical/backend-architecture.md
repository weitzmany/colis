# Sports Results Tracker - Backend Architecture

## API Design (REST)

### Base URL

`https://api.sportsresults.app/v1`

### Core Endpoints (MVP)

```
GET  /scores/live                       # Live scores for all ongoing matches
GET  /scores/finished?date=YYYY-MM-DD   # Finished matches for specific date
GET  /standings/:leagueId               # League standings for specific league
GET  /fixtures?date=YYYY-MM-DD          # Upcoming fixtures for date range
GET  /fixtures?from=YYYY-MM-DD&to=YYYY-MM-DD  # Fixtures in date range
GET  /teams/:teamId                     # Team details
GET  /leagues                           # List of available leagues
GET  /health                            # Health check endpoint
```

### Phase 2 Endpoints

```
GET  /matches/:matchId                  # Detailed match information
GET  /matches/:matchId/events           # Match events (goals, cards, etc.)
GET  /players/:playerId                 # Player details and statistics
GET  /players/:playerId/stats           # Detailed player statistics
GET  /teams/:teamId/matches             # Team's match history
GET  /teams/:teamId/players             # Team's player roster
POST /auth/register                     # User registration
POST /auth/login                        # User login
POST /auth/logout                       # User logout
GET  /auth/me                           # Get current user
GET  /users/me/following                # User's followed teams
POST /users/me/following/:teamId        # Follow team
DELETE /users/me/following/:teamId      # Unfollow team
```

### API Response Format

**Standard Success Response**:
```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "meta": {
    "timestamp": "2026-01-25T10:30:00Z",
    "cached": true,
    "cacheAge": 15,
    "requestId": "req_abc123xyz"
  }
}
```

**Paginated Response**:
```json
{
  "success": true,
  "data": [
    /* array of items */
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "totalPages": 5,
    "totalItems": 100,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": "Try again in 60 seconds",
    "timestamp": "2026-01-25T10:30:00Z",
    "requestId": "req_abc123xyz"
  }
}
```

### Error Codes

```
400 BAD_REQUEST             # Invalid request parameters
401 UNAUTHORIZED            # Authentication required
403 FORBIDDEN               # Insufficient permissions
404 NOT_FOUND               # Resource not found
429 RATE_LIMIT_EXCEEDED     # Too many requests
500 INTERNAL_SERVER_ERROR   # Server error
502 BAD_GATEWAY             # External API error
503 SERVICE_UNAVAILABLE     # Service temporarily down
```

### Rate Limiting

**Limits**:
- Anonymous users: 100 requests/minute per IP
- Authenticated users (free): 200 requests/minute
- Premium users: 500 requests/minute
- API access (premium+): 1000 requests/minute

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643097600
```

## Database Design

### Schema Overview

```sql
-- Core tables
- leagues        # Soccer leagues (Premier League, La Liga, etc.)
- teams          # Teams in leagues
- matches        # Individual matches/games
- standings      # League standings/tables

-- Phase 2 tables
- users          # User accounts
- user_following # User-team relationships
- players        # Individual players (Phase 2)
- match_events   # Goals, cards, substitutions (Phase 2)
```

### Leagues Table

```sql
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id INT UNIQUE NOT NULL,           -- API-Football league ID
  name VARCHAR(255) NOT NULL,                 -- "Premier League"
  country VARCHAR(100),                       -- "England"
  logo_url TEXT,                              -- CDN URL to league logo
  season INT NOT NULL,                        -- 2025, 2026, etc.
  is_active BOOLEAN DEFAULT true,             -- Currently tracked?
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_external_id (external_id),
  INDEX idx_season (season),
  INDEX idx_is_active (is_active)
);
```

### Teams Table

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id INT UNIQUE NOT NULL,           -- API-Football team ID
  name VARCHAR(255) NOT NULL,                 -- "Manchester United"
  short_name VARCHAR(50),                     -- "Man Utd"
  code VARCHAR(10),                           -- "MUN"
  logo_url TEXT,                              -- CDN URL to team logo
  founded INT,                                -- Year founded
  venue_name VARCHAR(255),                    -- "Old Trafford"
  venue_capacity INT,                         -- Stadium capacity
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_external_id (external_id),
  INDEX idx_name (name)
);
```

### Matches Table

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id INT UNIQUE NOT NULL,           -- API-Football fixture ID
  league_id UUID REFERENCES leagues(id),
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  match_date TIMESTAMP NOT NULL,             -- Scheduled start time
  status VARCHAR(50) NOT NULL,               -- 'scheduled', 'live', 'finished', 'postponed', 'cancelled'
  minute INT,                                -- Current minute (if live)
  home_score INT,                            -- Home team score
  away_score INT,                            -- Away team score
  venue VARCHAR(255),                        -- Stadium name
  referee VARCHAR(255),                      -- Referee name
  round VARCHAR(50),                         -- "Matchday 20", "Round of 16"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_external_id (external_id),
  INDEX idx_match_date (match_date),
  INDEX idx_league_id (league_id),
  INDEX idx_status (status),
  INDEX idx_home_team (home_team_id),
  INDEX idx_away_team (away_team_id),
  INDEX idx_league_date (league_id, match_date)
);
```

### Standings Table

```sql
CREATE TABLE standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES leagues(id),
  team_id UUID REFERENCES teams(id),
  season INT NOT NULL,                       -- 2025, 2026
  position INT NOT NULL,                     -- League position (1-20)
  played INT DEFAULT 0,                      -- Matches played
  won INT DEFAULT 0,                         -- Matches won
  drawn INT DEFAULT 0,                       -- Matches drawn
  lost INT DEFAULT 0,                        -- Matches lost
  goals_for INT DEFAULT 0,                   -- Goals scored
  goals_against INT DEFAULT 0,               -- Goals conceded
  goal_difference INT DEFAULT 0,             -- Goal difference
  points INT DEFAULT 0,                      -- Total points
  form VARCHAR(10),                          -- Last 5 matches: "WWDLL"
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(league_id, team_id, season),
  INDEX idx_league_season (league_id, season),
  INDEX idx_position (position),
  INDEX idx_team_id (team_id)
);
```

### Users Table (Phase 2)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,       -- bcrypt hash
  name VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_is_premium (is_premium)
);
```

### User Following Table (Phase 2)

```sql
CREATE TABLE user_following (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  PRIMARY KEY (user_id, team_id),
  INDEX idx_user_id (user_id),
  INDEX idx_team_id (team_id)
);
```

## Caching Strategy

### Redis Cache Keys

```
scores:live                          # All live scores (TTL: 30s)
standings:{league_id}                # League standings (TTL: 1 hour)
fixtures:{date}                      # Fixtures for date (TTL: 1 hour)
team:{team_id}                       # Team details (TTL: 24 hours)
match:{match_id}                     # Match details (TTL: 5 minutes if live, 24 hours if finished)
```

### Cache TTL Strategy

| Data Type | TTL | Reasoning |
|-----------|-----|-----------|
| Live scores | 30 seconds | Fast updates during games |
| Finished scores | 24 hours | Permanent data, rarely changes |
| Standings | 1 hour | Updated after each match day |
| Fixtures | 1 hour | Schedule changes infrequent |
| Team details | 24 hours | Static data |
| Match details (live) | 5 minutes | Dynamic during game |
| Match details (finished) | 24 hours | Static after game |

### Cache Invalidation

**Automatic Expiration**:
- Redis TTL handles most cases
- Expired keys automatically removed

**Manual Invalidation**:
- Clear `scores:live` when match finishes
- Clear `standings:{league_id}` when match in league finishes
- Clear `match:{match_id}` when match status changes
- No manual clearing needed for team/league data (long TTL)

**Cache-Aside Pattern**:
```typescript
async function getStandings(leagueId: string): Promise<Standing[]> {
  // 1. Try cache first
  const cached = await redis.get(`standings:${leagueId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. Cache miss - fetch from database
  const standings = await db.standings.findMany({
    where: { leagueId },
    orderBy: { position: 'asc' },
  });
  
  // 3. Store in cache for 1 hour
  await redis.setex(
    `standings:${leagueId}`,
    3600,
    JSON.stringify(standings)
  );
  
  return standings;
}
```

## Authentication & Authorization (Phase 2)

### JWT Authentication Flow

```
┌────────┐                 ┌────────┐                ┌──────────┐
│ Client │                 │  API   │                │ Database │
└───┬────┘                 └───┬────┘                └────┬─────┘
    │                          │                          │
    │ POST /auth/login         │                          │
    │ {email, password}        │                          │
    ├─────────────────────────>│                          │
    │                          │                          │
    │                          │ SELECT user WHERE email  │
    │                          ├─────────────────────────>│
    │                          │                          │
    │                          │<─────────────────────────┤
    │                          │ {userId, password_hash}  │
    │                          │                          │
    │                          │ bcrypt.compare(password, │
    │                          │ password_hash)           │
    │                          │                          │
    │ {token, user}            │                          │
    │<─────────────────────────┤                          │
    │ Set-Cookie: token=...    │                          │
    │ (httpOnly, secure)       │                          │
    │                          │                          │
    │ GET /users/me/following  │                          │
    │ Cookie: token=...        │                          │
    ├─────────────────────────>│                          │
    │                          │                          │
    │                          │ jwt.verify(token)        │
    │                          │ Extract userId           │
    │                          │                          │
    │                          │ SELECT following         │
    │                          │ WHERE user_id = userId   │
    │                          ├─────────────────────────>│
    │                          │                          │
    │ {following: [...]}       │<─────────────────────────┤
    │<─────────────────────────┤                          │
```

### JWT Token Structure

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "isPremium": false,
  "iat": 1643097600,
  "exp": 1643184000
}
```

**Token Expiry**: 24 hours (configurable)

### Authorization Middleware

```typescript
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    isPremium: boolean;
  };
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
};

const requirePremium = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isPremium) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'PREMIUM_REQUIRED',
        message: 'This feature requires a premium subscription',
      },
    });
  }
  next();
};
```

## Data Ingestion Pipeline

### Cron Jobs

Using **node-cron** or **Railway Cron** to schedule data updates:

```typescript
import cron from 'node-cron';

// Fetch live scores every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  try {
    await updateLiveScores();
    logger.info('Live scores updated');
  } catch (error) {
    logger.error('Failed to update live scores', error);
  }
});

// Fetch upcoming fixtures every hour
cron.schedule('0 * * * *', async () => {
  try {
    await updateFixtures();
    logger.info('Fixtures updated');
  } catch (error) {
    logger.error('Failed to update fixtures', error);
  }
});

// Fetch league standings every 4 hours
cron.schedule('0 */4 * * *', async () => {
  try {
    await updateStandings();
    logger.info('Standings updated');
  } catch (error) {
    logger.error('Failed to update standings', error);
  }
});

// Daily cleanup at 3 AM
cron.schedule('0 3 * * *', async () => {
  try {
    await cleanupOldData();
    await updateTeamInformation();
    logger.info('Daily maintenance complete');
  } catch (error) {
    logger.error('Failed daily maintenance', error);
  }
});
```

### Data Transformation

**API-Football → Internal Format**:

```typescript
function transformMatch(apiMatch: APIFootballMatch): Match {
  return {
    id: generateUUID(),
    externalId: apiMatch.fixture.id,
    leagueId: await findLeagueByExternalId(apiMatch.league.id),
    homeTeamId: await findTeamByExternalId(apiMatch.teams.home.id),
    awayTeamId: await findTeamByExternalId(apiMatch.teams.away.id),
    matchDate: new Date(apiMatch.fixture.date),
    status: mapStatus(apiMatch.fixture.status.short),
    minute: apiMatch.fixture.status.elapsed,
    homeScore: apiMatch.goals.home,
    awayScore: apiMatch.goals.away,
    venue: apiMatch.fixture.venue.name,
    referee: apiMatch.fixture.referee,
    round: apiMatch.league.round,
    updatedAt: new Date(),
  };
}

function mapStatus(apiStatus: string): string {
  const statusMap = {
    'NS': 'scheduled',   // Not Started
    '1H': 'live',        // First Half
    'HT': 'live',        // Half Time
    '2H': 'live',        // Second Half
    'ET': 'live',        // Extra Time
    'P': 'live',         // Penalty Shootout
    'FT': 'finished',    // Full Time
    'AET': 'finished',   // After Extra Time
    'PEN': 'finished',   // Penalty Shootout Finished
    'PST': 'postponed',  // Postponed
    'CANC': 'cancelled', // Cancelled
    'ABD': 'cancelled',  // Abandoned
  };
  
  return statusMap[apiStatus] || 'scheduled';
}
```

### Error Handling & Retry Logic

```typescript
class SportDataService {
  async fetchWithRetry<T>(
    fetcher: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fetcher();
      } catch (error) {
        lastError = error;
        logger.warn(`Attempt ${attempt}/${maxRetries} failed`, error);
        
        if (attempt < maxRetries) {
          await sleep(delayMs * attempt); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }
  
  async fetchLiveScores(): Promise<Match[]> {
    return this.fetchWithRetry(async () => {
      try {
        // Try primary API
        return await apiFoodball.getLiveMatches();
      } catch (error) {
        // Fallback to secondary API
        logger.warn('Primary API failed, using fallback', error);
        return await sportMonks.getLiveMatches();
      }
    });
  }
}
```

## Security

### Password Hashing

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Input Validation

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Usage in route handler
app.post('/auth/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    // Proceed with registration
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors,
        },
      });
    }
  }
});
```

### SQL Injection Prevention

Using **parameterized queries** (Prisma ORM or pg-promise):

```typescript
// ✅ SAFE: Parameterized query
const standings = await db.query(
  'SELECT * FROM standings WHERE league_id = $1 ORDER BY position ASC',
  [leagueId]
);

// ❌ UNSAFE: String concatenation
const standings = await db.query(
  `SELECT * FROM standings WHERE league_id = '${leagueId}' ORDER BY position ASC`
);
```

### Rate Limiting Implementation

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests',
      details: 'Please try again in 60 seconds',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        details: 'Please try again in 60 seconds',
      },
    });
  },
});

app.use('/api', limiter);
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Status**: Planning - Technical Specification  
**Related**: [Frontend Architecture](frontend-architecture.md), [Database Schema](database-schema.md), [Real-Time Architecture](realtime-architecture.md)
