# Feature: Session Management

## Overview

Manages user sessions using JWT access tokens and refresh tokens, enabling secure anchorage state across applications.

## User Stories

- As a developer, I want to validate sessions so only authenticated users access protected resources.
- As a user, I want to see and revoke my active sessions.

## Functional Requirements

- Issue access + refresh tokens on login
- Refresh tokens to extend sessions
- Validate access tokens
- Revoke sessions on logout
- List active sessions for a user

## API Endpoints

- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/validate`
- `GET /api/v1/sessions`
- `DELETE /api/v1/sessions/:id`

## Security Requirements

- Access tokens expire in 15 minutes
- Refresh tokens expire in 30 days
- Refresh tokens rotated on use
- Revoked tokens blacklisted in Redis

## Acceptance Criteria

- Token validation succeeds for valid tokens and fails for revoked tokens
- Users can revoke a specific session from the admin panel
