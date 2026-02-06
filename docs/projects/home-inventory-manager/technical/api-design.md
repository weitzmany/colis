# Technical: API Design

## API Style
- RESTful JSON API
- Versioned under `/v1`
- JWT authentication with refresh tokens

## Core Endpoints
- **Auth**: `POST /v1/auth/login`, `POST /v1/auth/refresh`, `POST /v1/auth/logout`
- **Items**: `GET /v1/items`, `POST /v1/items`, `GET /v1/items/:id`, `PATCH /v1/items/:id`, `DELETE /v1/items/:id`
- **Rooms**: `GET /v1/rooms`, `POST /v1/rooms`, `PATCH /v1/rooms/:id`, `DELETE /v1/rooms/:id`
- **Media**: `POST /v1/items/:id/photos`, `DELETE /v1/items/:id/photos/:photoId`
- **Reports**: `POST /v1/reports`, `GET /v1/reports/:id`
- **Analytics**: `GET /v1/analytics/summary`

## Error Handling
- Standard error response format: `{ "error": { "code": "", "message": "" } }`
- 401 for unauthorized, 403 for forbidden, 404 for not found

## Pagination
- Cursor-based pagination for item lists
- Default page size: 50 (max 200)

## Rate Limiting
- 60 requests/minute per user for write endpoints
- 300 requests/minute per user for read endpoints

## Review/Contribution

_API design aligns with planned features and will be refined during implementation._
