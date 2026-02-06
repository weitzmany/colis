# Feature: OAuth & SSO (Post-MVP)

## Overview

Adds OAuth 2.0 / OpenID Connect support for third-party identity providers (Google, GitHub, Facebook) and enterprise SSO.

## User Stories

- As a user, I want to log in with Google so I don't create another password.
- As an admin, I want to enable SSO for my organization.

## Functional Requirements

- OAuth provider configuration per application
- Standard OIDC flows (Authorization Code + PKCE)
- Account linking for existing users
- SSO login and logout flows

## Planned Endpoints (Draft)

- `GET /api/v1/auth/oauth/:provider`
- `GET /api/v1/auth/oauth/:provider/callback`
- `POST /api/v1/auth/sso/login`
- `POST /api/v1/auth/sso/logout`

## Acceptance Criteria

- Users can authenticate via a configured provider
- Provider identities map to existing user records when linked
