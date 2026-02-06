# Technical: API Design

## Overview
The API is a RESTful service with versioned endpoints and role-based access control enforced on every request.

## Authentication
- JWT access tokens with refresh tokens
- Password reset and email verification flows
- Session revocation on role changes

## Core Resources
- Families
- Dependents
- Calendar events
- Tasks
- Medications and routines
- Documents
- Notifications

## Example Endpoints
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /families/{familyId}`
- `GET /dependents/{dependentId}`
- `GET /families/{familyId}/tasks`
- `POST /dependents/{dependentId}/documents`

## Error Handling
- Standard error envelope with code and message
- 401 for auth failures, 403 for permission failures
- 422 for validation errors

## Pagination and Filtering
- Cursor-based pagination for tasks and events
- Filters by dependent, assignee, and date range
