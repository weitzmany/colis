# Technical: API Design

## Overview
RESTful API with JSON responses and URL versioning (`/api/v1`).

## Authentication
- JWT access tokens (7 days)
- Refresh tokens (30 days)
- Authorization header: `Bearer <token>`

## Endpoint Summary

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |
| POST | `/api/v1/auth/refresh` | Refresh token | Yes |
| POST | `/api/v1/auth/forgot-password` | Request reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password | No |

### Packages
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/packages` | List packages | Yes |
| GET | `/api/v1/packages/:id` | Package detail | Yes |
| POST | `/api/v1/packages` | Create package | Yes |
| PUT | `/api/v1/packages/:id` | Update package | Yes |
| DELETE | `/api/v1/packages/:id` | Delete package | Yes |
| POST | `/api/v1/packages/:id/refresh` | Refresh status | Yes |
| GET | `/api/v1/packages/:id/history` | Status history | Yes |

### User Preferences
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/me` | Current user | Yes |
| PUT | `/api/v1/users/me` | Update profile | Yes |
| GET | `/api/v1/users/me/preferences` | Notification prefs | Yes |
| PUT | `/api/v1/users/me/preferences` | Update prefs | Yes |

## Response Format
```
{
  "success": true,
  "data": { ... }
}
```

## Error Format
```
{
  "success": false,
  "error": {
    "code": "INVALID_TRACKING_NUMBER",
    "message": "Tracking number format is invalid",
    "details": "Tracking number must be 8-30 characters"
  }
}
```

## Versioning
- URL-based versioning (`/api/v1`)
- Backward-compatible changes within a version

## Rate Limits
- Authenticated: 100 requests/minute/user
- Unauthenticated: 20 requests/minute/IP
