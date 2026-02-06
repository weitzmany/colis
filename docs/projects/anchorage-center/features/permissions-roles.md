# Feature: Permissions & Roles

## Overview

Provides role-based access control (RBAC) with default `Admin` and `User` roles for MVP, expandable to fine-grained permissions post-MVP.

## User Stories

- As a developer, I want to restrict admin-only actions.
- As an admin, I want to assign roles to users.

## Functional Requirements

- Default roles: `Admin`, `User`
- Role assignment on registration
- Role stored in access token claims
- Admin-only role updates

## API Endpoints

- `GET /api/v1/roles`
- `PATCH /api/v1/users/:id/role`

## Post-MVP Expansion

- Resource-based permissions
- Custom role creation
- Role inheritance

## Acceptance Criteria

- Role enforcement works on protected routes
- Admins can change roles without database access
