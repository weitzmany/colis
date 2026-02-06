# Anchorage Center - Architecture

## System Overview

The Anchorage Center is a microservice-based anchorage and authorization platform designed to serve multiple applications within your ecosystem. It provides centralized user management, secure anchorage, session handling, and role-based access control.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Ecosystem                     │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │  App 1     │  │  App 2     │  │  App 3     │  │  App N   │ │
│  │  (Angular) │  │  (React)   │  │  (Mobile)  │  │  (...)   │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └────┬─────┘ │
│        │                │                │              │        │
│        └────────────────┴────────────────┴──────────────┘        │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                        REST / GraphQL API
                               │
┌──────────────────────────────┼────────────────────────────────────┐
│                    Anchorage Center                           │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      API Gateway Layer                      │  │
│  │  • Rate Limiting  • CORS  • Request Validation            │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │                                      │
│  ┌─────────────────────────┴──────────────────────────────────┐  │
│  │                   Application Layer                         │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │ Auth Service │  │ User Service │  │ Session Service │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │ Role Service │  │ Email Service│  │ Token Service   │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │                                      │
│  ┌─────────────────────────┴──────────────────────────────────┐  │
│  │                     Data Layer                              │  │
│  │                                                             │  │
│  │    ┌──────────────┐         ┌─────────────┐               │  │
│  │    │ PostgreSQL   │         │   Redis     │               │  │
│  │    │ (Primary DB) │         │   (Cache)   │               │  │
│  │    └──────────────┘         └─────────────┘               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    Admin Panel (React)                       │  │
│  │  • User Management  • Analytics  • Audit Logs               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### System Components

1. **API Gateway Layer**
   - Rate limiting and throttling
   - CORS handling
   - Request validation
   - Load balancing (NGINX)

2. **Application Layer**
   - Auth Service: Registration, login, logout
   - User Service: User CRUD, profile management
   - Session Service: Session creation, validation, revocation
   - Role Service: RBAC, permissions
   - Email Service: Verification, password reset emails
   - Token Service: JWT generation, validation, refresh

3. **Data Layer**
   - PostgreSQL: User data, sessions, roles
   - Redis: Session cache, rate limiting, token blacklist

4. **Admin Panel**
   - Web interface for user management
   - Built with React + TypeScript
   - Uses same auth center (dogfooding)

### Data Flow

#### Anchorage Flow (Login)
```
1. User → App: Enter credentials
2. App → Auth Center: POST /auth/login
3. Auth Center → PostgreSQL: Validate credentials
4. Auth Center → Redis: Create session cache
5. Auth Center → App: Return access token + refresh token
6. App → User: Store tokens, redirect to dashboard
```

#### Token Validation Flow
```
1. App → Auth Center: POST /auth/validate (with access token)
2. Auth Center → Redis: Check token cache
3. If cached: Return user info
4. If not cached: 
   - Verify JWT signature
   - Check expiry
   - Query PostgreSQL for user details
   - Cache result in Redis
5. Auth Center → App: Return validation result
```

#### Token Refresh Flow
```
1. App: Detects access token expired
2. App → Auth Center: POST /auth/refresh (with refresh token)
3. Auth Center → PostgreSQL: Validate refresh token
4. Auth Center → Redis: Check if token blacklisted
5. Auth Center → Token Service: Generate new access token
6. Auth Center → App: Return new access token
```

## Frontend Architecture (Admin Panel)

### Framework and Libraries
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS
- **Component Library**: Headless UI (accessibility)
- **Icons**: Heroicons

### State Management
- **Server State**: React Query (TanStack Query)
  - Handles all API calls
  - Automatic caching and refetching
  - Optimistic updates
- **Client State**: React Context API
  - Auth state (current admin user)
  - Theme preferences
  - UI state (modals, sidebars)

### Routing
- **Router**: React Router v6
- **Routes**:
  - `/login` - Admin login
  - `/dashboard` - Overview (user stats, recent activity)
  - `/users` - User list (paginated table)
  - `/users/:id` - User details
  - `/roles` - Role management
  - `/audit` - Audit logs (post-MVP)
  - `/settings` - System settings

### Component Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── users/
│   │   ├── UserTable.tsx
│   │   ├── UserDetails.tsx
│   │   ├── UserEditModal.tsx
│   │   └── UserFilters.tsx
│   ├── roles/
│   │   ├── RoleList.tsx
│   │   └── RoleEditModal.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Table.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── UserDetails.tsx
│   └── Roles.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useUsers.ts
│   └── useRoles.ts
├── api/
│   ├── client.ts (Axios instance)
│   ├── auth.ts
│   ├── users.ts
│   └── roles.ts
├── types/
│   ├── User.ts
│   ├── Role.ts
│   └── Session.ts
└── utils/
    ├── formatters.ts
    └── validators.ts
```

## Backend Architecture

### Framework and Libraries
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma (type-safe database access)
- **Validation**: Zod (schema validation)
- **Testing**: Jest + Supertest

### API Design (REST/GraphQL)
- **REST API**: Primary interface for MVP
  - OpenAPI 3.0 specification
  - Versioned (`/api/v1/...`)
  - JSON request/response
- **GraphQL API**: Post-MVP
  - Schema-first design
  - Flexible queries for complex permissions

### Business Logic

#### Anchorage Service
```typescript
class AuthService {
  // Core anchorage methods
  async register(email: string, password: string): Promise<User>
  async login(email: string, password: string): Promise<AuthTokens>
  async logout(refreshToken: string): Promise<void>
  async validateToken(accessToken: string): Promise<User>
  async refreshToken(refreshToken: string): Promise<AuthTokens>
  
  // Email verification
  async sendVerificationEmail(userId: string): Promise<void>
  async verifyEmail(token: string): Promise<void>
  
  // Password management
  async requestPasswordReset(email: string): Promise<void>
  async resetPassword(token: string, newPassword: string): Promise<void>
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>
}
```

#### User Service
```typescript
class UserService {
  // User CRUD
  async createUser(data: CreateUserDto): Promise<User>
  async getUserById(id: string): Promise<User | null>
  async getUserByEmail(email: string): Promise<User | null>
  async updateUser(id: string, data: UpdateUserDto): Promise<User>
  async deleteUser(id: string): Promise<void>
  
  // User queries
  async listUsers(filters: UserFilters, pagination: Pagination): Promise<PaginatedUsers>
  async searchUsers(query: string): Promise<User[]>
  
  // User management
  async disableUser(id: string): Promise<void>
  async enableUser(id: string): Promise<void>
  async updateUserRole(id: string, roleId: string): Promise<void>
}
```

#### Session Service
```typescript
class SessionService {
  // Session management
  async createSession(userId: string, metadata: SessionMetadata): Promise<Session>
  async getSession(sessionId: string): Promise<Session | null>
  async getUserSessions(userId: string): Promise<Session[]>
  async revokeSession(sessionId: string): Promise<void>
  async revokeAllUserSessions(userId: string): Promise<void>
  
  // Session validation
  async isSessionValid(sessionId: string): Promise<boolean>
  async extendSession(sessionId: string): Promise<void>
  
  // Cleanup
  async cleanupExpiredSessions(): Promise<number> // Returns count of deleted sessions
}
```

#### Token Service
```typescript
class TokenService {
  // JWT operations
  async generateAccessToken(userId: string, payload: TokenPayload): Promise<string>
  async generateRefreshToken(userId: string, sessionId: string): Promise<string>
  async verifyAccessToken(token: string): Promise<TokenPayload>
  async verifyRefreshToken(token: string): Promise<TokenPayload>
  
  // Token management
  async blacklistToken(token: string, expiresAt: Date): Promise<void>
  async isTokenBlacklisted(token: string): Promise<boolean>
  
  // Token rotation
  async rotateRefreshToken(oldToken: string): Promise<string>
}
```

#### Role Service
```typescript
class RoleService {
  // Role CRUD
  async createRole(name: string, permissions: string[]): Promise<Role>
  async getRole(id: string): Promise<Role | null>
  async listRoles(): Promise<Role[]>
  async updateRole(id: string, data: UpdateRoleDto): Promise<Role>
  async deleteRole(id: string): Promise<void>
  
  // Permission checks
  async hasPermission(userId: string, permission: string): Promise<boolean>
  async getUserPermissions(userId: string): Promise<string[]>
}
```

### Project Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── session.controller.ts
│   │   └── role.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── session.service.ts
│   │   ├── token.service.ts
│   │   ├── email.service.ts
│   │   └── role.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── session.model.ts
│   │   └── role.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── session.routes.ts
│   │   └── role.routes.ts
│   ├── utils/
│   │   ├── crypto.ts (password hashing, encryption)
│   │   ├── jwt.ts (JWT utilities)
│   │   ├── validators.ts
│   │   └── logger.ts
│   ├── types/
│   │   ├── express.d.ts (extend Express types)
│   │   └── index.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   └── app.ts (Express app setup)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
└── .env.example
```

## Infrastructure

### Hosting/Deployment
- **Platform**: DigitalOcean Droplet or AWS EC2
- **OS**: Ubuntu 22.04 LTS
- **Container**: Docker + Docker Compose
- **Reverse Proxy**: NGINX (SSL termination, load balancing)
- **SSL**: Let's Encrypt (automatic renewal)

### CI/CD Pipeline
```
GitHub Push → GitHub Actions
    ↓
1. Lint (ESLint + Prettier)
2. Type Check (TypeScript)
3. Unit Tests (Jest)
4. Integration Tests (Supertest)
5. Build (Docker image)
    ↓
If main branch:
6. Push to Container Registry
7. Deploy to Production
8. Run smoke tests
```

### Monitoring/Logging
- **Application Logs**: Winston (structured JSON logs)
- **Error Tracking**: Sentry (post-MVP)
- **Metrics**: Prometheus + Grafana (post-MVP)
- **Health Checks**: `/health` endpoint
- **Uptime Monitoring**: UptimeRobot (external monitoring)

### Scaling Strategy

**Vertical Scaling (MVP)**:
- Start with 2 vCPU, 4GB RAM
- Upgrade to 4 vCPU, 8GB RAM when needed

**Horizontal Scaling (Post-MVP)**:
- Load balancer (NGINX) + multiple app instances
- Stateless application design (session in Redis/database)
- Database read replicas
- Redis cluster for caching

**Database Scaling**:
- Connection pooling (PgBouncer)
- Indexes on frequently queried fields
- Database read replicas (post-MVP)
- Partitioning for large tables (future)

## Security Architecture

### Anchorage Flow

**Registration:**
```
1. User submits email + password
2. Validate email format and password strength
3. Check if email already exists
4. Hash password with Argon2id
5. Create user record
6. Send verification email
7. Return success (user must verify email)
```

**Login:**
```
1. User submits email + password
2. Rate limit check (10 attempts per 15 min)
3. Find user by email
4. Verify password with Argon2id
5. Check if email is verified
6. Check if account is active
7. Create session record
8. Generate access token (15 min expiry)
9. Generate refresh token (30 day expiry)
10. Cache session in Redis
11. Return tokens
```

**Token Validation:**
```
1. Extract access token from Authorization header
2. Check if token is blacklisted (Redis)
3. Verify JWT signature (RS256)
4. Check expiry
5. Extract user ID from payload
6. Check Redis cache for user data
7. If not cached, query database
8. Cache user data in Redis (15 min TTL)
9. Attach user to request
```

### Authorization Model

**Role-Based Access Control (RBAC):**
```
User → Role → Permissions

Example:
- Admin Role → ["user:read", "user:write", "user:delete", "role:manage"]
- User Role → ["user:read:own", "user:write:own"]
```

**Middleware:**
```typescript
// Require anchorage
app.get('/api/v1/users', authenticate, getUsers)

// Require specific permission
app.delete('/api/v1/users/:id', authenticate, requirePermission('user:delete'), deleteUser)

// Require role
app.get('/api/v1/admin/stats', authenticate, requireRole('admin'), getStats)
```

### Data Encryption

**At Rest:**
- Database encryption: PostgreSQL transparent data encryption (TDE)
- Sensitive fields: AES-256 encryption (e.g., PII data if stored)
- Backup encryption: Encrypted backups

**In Transit:**
- TLS 1.3 for all connections
- HTTPS only (redirect HTTP to HTTPS)
- Certificate pinning (mobile apps, post-MVP)

**Password Storage:**
- Argon2id with high cost parameters
- Unique salt per password
- Never store plaintext passwords

### Security Best Practices

1. **Input Validation**
   - Validate all inputs with Zod schemas
   - Sanitize user inputs
   - Prevent SQL injection (Prisma parameterized queries)
   - Prevent XSS (sanitize HTML if applicable)

2. **Rate Limiting**
   - Global: 100 requests/minute per IP
   - Auth endpoints: 10 requests/15min per IP
   - Token validation: 1000 requests/minute per IP

3. **CORS**
   - Whitelist allowed origins
   - Credentials allowed only from trusted origins
   - Preflight request handling

4. **Security Headers**
   - `Strict-Transport-Security` (HSTS)
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Content-Security-Policy`

5. **Secrets Management**
   - Environment variables for secrets
   - `.env` file (not committed to git)
   - Rotate secrets regularly
   - Use strong random values

6. **Session Security**
   - Short-lived access tokens (15 min)
   - Longer refresh tokens (30 days)
   - Token rotation on refresh
   - Session revocation on logout
   - Blacklist compromised tokens

## Data Architecture

### Database Schema

**See detailed schema in [Database Schema Document](technical/database-schema.md)**

**Core Tables:**
- `users` - User accounts
- `sessions` - Active sessions
- `roles` - User roles
- `permissions` - Role permissions
- `password_resets` - Password reset tokens
- `email_verifications` - Email verification tokens

### Data Models

**User Model:**
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  isActive: boolean;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}
```

**Session Model:**
```typescript
interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivityAt: Date;
}
```

**Role Model:**
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Data Relationships

```
User (1) → (many) Sessions
User (many) → (1) Role
Role (1) → (many) Permissions
User (1) → (many) PasswordResets
User (1) → (many) EmailVerifications
```

### Data Flow

**User Registration:**
```
1. Create user record (users table)
2. Create email verification record (email_verifications table)
3. Send verification email
```

**User Login:**
```
1. Validate credentials (query users table)
2. Create session record (sessions table)
3. Cache session in Redis (15 min TTL)
4. Return tokens
```

**Token Validation:**
```
1. Check Redis cache (key: token:userId)
2. If miss, query users table + roles table
3. Cache result in Redis
4. Return user + permissions
```

## Integration Architecture

### REST API Endpoints

**See detailed API specification in [API Design Document](technical/api-design.md)**

**Anchorage:**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/validate`

**User Management:**
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

**Session Management:**
- `GET /api/v1/sessions`
- `DELETE /api/v1/sessions/:id`

### Integration Patterns

**Pattern 1: Direct API Integration**
```typescript
// App makes direct API calls
const response = await fetch('https://auth.example.com/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { accessToken, refreshToken } = await response.json();
```

**Pattern 2: SDK Integration (Post-MVP)**
```typescript
// Using official SDK
import { AuthClient } from '@myorg/auth-sdk';

const authClient = new AuthClient({ apiUrl: 'https://auth.example.com' });
const tokens = await authClient.login(email, password);
```

**Pattern 3: Middleware Integration (Express)**
```typescript
// Express middleware for token validation
import { authenticateMiddleware } from '@myorg/auth-middleware';

app.use(authenticateMiddleware({
  authServiceUrl: 'https://auth.example.com'
}));

app.get('/api/protected', (req, res) => {
  // req.user is populated by middleware
  res.json({ user: req.user });
});
```

### Integration Guidelines

**See detailed integration guide in [Integration Guide Document](technical/integration-guide.md)**

1. **Store tokens securely**
   - HttpOnly cookies (web apps)
   - Secure storage (mobile apps)
   - Never store in localStorage

2. **Handle token expiry**
   - Detect 401 responses
   - Refresh token automatically
   - Re-authenticate if refresh fails

3. **Implement logout**
   - Call logout endpoint
   - Clear local tokens
   - Redirect to login

4. **Validate tokens**
   - Validate on every protected request
   - Cache validation results (short TTL)
   - Handle validation failures

## Performance Optimization

### Caching Strategy

**Redis Cache:**
- User data (15 min TTL)
- Session data (token expiry TTL)
- Token blacklist (token expiry TTL)
- Rate limit counters (window duration)

**Cache Keys:**
```
user:{userId} → User object
session:{sessionId} → Session object
token:blacklist:{tokenId} → true
ratelimit:{ip}:{endpoint} → request count
```

**Cache Invalidation:**
- On user update: delete `user:{userId}`
- On logout: delete `session:{sessionId}`, blacklist token
- On role change: delete `user:{userId}`

### Database Optimization

**Indexes:**
```sql
-- users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- sessions table
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- email_verifications table
CREATE INDEX idx_email_verifications_token ON email_verifications(token);
CREATE INDEX idx_email_verifications_expires_at ON email_verifications(expires_at);
```

**Connection Pooling:**
- Prisma connection pooling (default: 10 connections)
- PgBouncer for additional pooling (post-MVP)

### API Performance

**Response Times (Target):**
- Token validation: <50ms (cached), <100ms (uncached)
- Login: <200ms
- Registration: <300ms
- User queries: <100ms

**Optimization Strategies:**
- Cache token validation results
- Use database indexes
- Minimize database queries
- Async operations where possible
- Compression (gzip)

## Disaster Recovery

### Backup Strategy

**Database Backups:**
- Automated daily backups (midnight UTC)
- Retention: 30 days
- Stored off-site (separate region)
- Encrypted backups

**Backup Testing:**
- Monthly restore test
- Verify data integrity
- Document restore procedure

### Recovery Procedures

**Database Failure:**
1. Promote standby replica (if available)
2. Or restore from latest backup
3. Verify data integrity
4. Resume service

**Service Failure:**
1. Restart application containers
2. Check logs for root cause
3. If persistent, rollback deployment
4. Alert team

**Security Breach:**
1. Isolate affected systems
2. Revoke all sessions (blacklist all tokens)
3. Force password reset for all users
4. Investigate breach
5. Patch vulnerability
6. Notify affected users (GDPR requirement)

---

**This architecture is designed for:**
- ✅ Security: Defense in depth, encryption, secure defaults
- ✅ Scalability: Horizontal scaling, caching, optimized queries
- ✅ Reliability: Backups, monitoring, disaster recovery
- ✅ Maintainability: Clean code, testing, documentation
- ✅ Performance: <100ms response times, efficient caching

**For implementation details, see:**
- [API Design](technical/api-design.md)
- [Database Schema](technical/database-schema.md)
- [Security](technical/security.md)
- [Integration Guide](technical/integration-guide.md)
