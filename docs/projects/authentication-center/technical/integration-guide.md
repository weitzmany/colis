# Authentication Center - Integration Guide

## Overview

This guide explains how applications integrate with the Authentication Center for registration, login, session management, and user authorization.

## Prerequisites

- Application registered with the Authentication Center
- Allowed origins configured for web apps
- API key issued for server-to-server integrations

## Step 1: Registration & Login

### Register a new user

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response**:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900
}
```

## Step 2: Store Tokens Securely

- **Web apps**: HttpOnly cookies + Secure + SameSite
- **Mobile apps**: Secure storage (Keychain/Keystore)
- **Never** store tokens in localStorage

## Step 3: Validate Tokens

```http
POST /api/v1/auth/validate
Authorization: Bearer <accessToken>
```

## Step 4: Refresh Tokens

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

## Step 5: Logout

```http
POST /api/v1/auth/logout
Content-Type: application/json

{
  "refreshToken": "..."
}
```

## Integration Checklist

- [ ] Register app and configure allowed origins
- [ ] Implement registration and login flows
- [ ] Store tokens securely
- [ ] Handle token refresh automatically
- [ ] Revoke tokens on logout
- [ ] Enforce RBAC on protected routes

## Common Pitfalls

- Storing tokens in localStorage
- Forgetting to rotate refresh tokens
- Not handling 401 responses properly

## Support

For integration issues, see `technical/api-design.md` or open a support request with the Auth Center team.
