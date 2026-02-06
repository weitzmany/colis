# Technical: Security and Privacy

## Security Objectives
- Protect sensitive inventory data and media
- Prevent unauthorized access to user items
- Ensure secure media delivery

## Authentication
- JWT access tokens with refresh tokens
- Password hashing using bcrypt or argon2
- Optional MFA in Phase 3

## Authorization
- Per-user ownership checks for all item access
- Admin-only endpoints for system monitoring (internal)

## Data Protection
- TLS 1.3 for all traffic
- AES-256 encryption at rest for database and media
- Signed URLs for media access (short TTL)

## Privacy Controls
- User data export and deletion (GDPR-aligned)
- Clear retention policies for deleted items

## Audit and Logging
- Track item changes (Phase 2)
- Log authentication events

## Review/Contribution

_Security plan addresses privacy-critical home inventory data and will be refined during implementation._
