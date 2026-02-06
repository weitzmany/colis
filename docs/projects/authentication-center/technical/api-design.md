# Authentication Center - API Design

## Overview

The Authentication Center exposes a versioned REST API as the primary integration surface for all applications. The API prioritizes secure defaults, consistent error formats, and predictable versioning to make integration fast and safe.

## Design Principles

- **REST-first** for MVP; GraphQL planned post-MVP
- **Versioned endpoints** (`/api/v1/...`) for backward compatibility
- **JSON-only** request/response payloads
- **Consistent error model** across endpoints
- **Secure by default** (TLS required, strict CORS, rate limiting)

## Base URL & Versioning

- **Base URL**: `https://auth.example.com/api/v1`
- **Versioning**: Path-based (`/api/v1/`) for MVP
- **Deprecation policy**: 90-day notice for breaking changes

## Authentication & Session Model

- **Access token**: JWT (RS256), 15-minute expiry
- **Refresh token**: 30-day expiry, rotation on use
- **Authorization header**: `Authorization: Bearer <accessToken>`

## Standard Error Format

```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Email or password is incorrect.",
    "details": {
      "field": "password"
    }
  }
}
```

- **HTTP status codes** follow REST conventions
- **error.code** is stable and machine-readable
- **error.details** is optional and field-specific

## Rate Limiting (MVP Defaults)

- **Global**: 100 requests/minute per IP
- **Auth endpoints**: 10 requests/15 minutes per IP
- **Token validation**: 1000 requests/minute per IP

## Endpoint Groups

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/validate`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`

### Password Management
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`

### User Management
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `PATCH /users/:id/role`

### Session Management
- `GET /sessions`
- `DELETE /sessions/:id`

### Roles & Permissions
- `GET /roles`
- `POST /roles`
- `PATCH /roles/:id`
- `DELETE /roles/:id`

### System
- `GET /health`
- `GET /version`

## Request Validation

- All inputs validated with Zod schemas
- Reject unknown fields by default
- Return `400` with field-level details

## CORS Policy

- Allow only whitelisted origins
- Credentials allowed only for trusted web apps
- Preflight caching for 10 minutes

## OpenAPI Specification

- **Format**: OpenAPI 3.0
- **Location**: `technical/api-design.md` (summary) + generated `openapi.yaml` (implementation)
- **Documentation**: Swagger UI hosted at `/docs`

## Post-MVP API Additions

- GraphQL endpoint (`/graphql`) for flexible queries
- OAuth 2.0 / OpenID Connect endpoints
- Webhooks for auth events
- Admin analytics endpoints
