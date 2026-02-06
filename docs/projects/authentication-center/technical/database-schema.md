# Authentication Center - Database Schema

## Overview

The Authentication Center stores user identities, sessions, roles, and security artifacts in PostgreSQL, with Redis used for caching and rate limiting. This document captures the logical schema and core relationships.

## Core Tables

### `users`
- `id` (UUID, PK)
- `email` (string, unique, indexed)
- `password_hash` (string)
- `email_verified` (boolean)
- `is_active` (boolean)
- `role_id` (UUID, FK → roles.id)
- `created_at`, `updated_at` (timestamps)
- `last_login_at` (timestamp, nullable)

### `sessions`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id)
- `refresh_token_hash` (string, indexed)
- `expires_at` (timestamp)
- `ip_address` (string)
- `user_agent` (string)
- `created_at`, `last_activity_at` (timestamps)

### `roles`
- `id` (UUID, PK)
- `name` (string, unique)
- `description` (string)
- `created_at`, `updated_at` (timestamps)

### `permissions`
- `id` (UUID, PK)
- `role_id` (UUID, FK → roles.id)
- `permission_key` (string)

### `email_verifications`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id)
- `token_hash` (string, indexed)
- `expires_at` (timestamp)
- `created_at` (timestamp)

### `password_resets`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id)
- `token_hash` (string, indexed)
- `expires_at` (timestamp)
- `created_at` (timestamp)

## Relationships

- **User → Sessions**: one-to-many
- **User → Role**: many-to-one
- **Role → Permissions**: one-to-many
- **User → Email Verifications**: one-to-many
- **User → Password Resets**: one-to-many

## Redis Data (Cache)

- `user:{userId}` → cached user profile (15 min TTL)
- `session:{sessionId}` → cached session (token TTL)
- `token:blacklist:{tokenId}` → revoked tokens
- `ratelimit:{ip}:{endpoint}` → rate limit counters

## Index Strategy (MVP)

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token_hash ON sessions(refresh_token_hash);
CREATE INDEX idx_email_verifications_token_hash ON email_verifications(token_hash);
CREATE INDEX idx_password_resets_token_hash ON password_resets(token_hash);
```

## Data Integrity & Constraints

- Unique constraint on `users.email`
- Foreign key constraints on all relationship fields
- Check constraints for status fields (`email_verified`, `is_active`)

## Migration Strategy

- Prisma migrations for schema versioning
- Rollback support for each migration
- Seed default roles (`Admin`, `User`) on first deploy

## Data Retention (MVP Defaults)

- **Sessions**: purge expired sessions daily
- **Email verifications**: 30-day retention
- **Password resets**: 24-hour retention
- **Audit logs**: post-MVP (see compliance docs)
