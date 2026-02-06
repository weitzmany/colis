# Feature: User Management

## Overview

Provides centralized user CRUD, profile updates, search, and account status management across all applications.

## User Stories

- As an admin, I want to search for users by email so I can support accounts quickly.
- As a developer, I want to fetch user profiles so I can display account data in my app.

## Functional Requirements

- Create, read, update, and delete users
- Search users by email
- Enable/disable user accounts
- View user status and recent login activity

## Non-Functional Requirements

- Pagination for list endpoints
- Response time <100ms for search queries (cached)
- Consistent error format

## API Endpoints

- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

## Admin Panel Capabilities

- Paginated user list
- Search by email
- View profile and role
- Disable/enable accounts

## Acceptance Criteria

- Admin can view and manage users without direct DB access
- Developers can fetch user profiles reliably
