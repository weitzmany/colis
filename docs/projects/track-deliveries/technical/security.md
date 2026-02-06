# Technical: Security

## Authentication
- JWT access tokens (7 days)
- Refresh tokens (30 days)
- Password hashing with bcrypt (10 rounds)
- Email verification required

## API Protection
- Rate limiting for auth and data endpoints
- Input validation using schema validation
- CSRF protection if using cookies

## Data Security
- TLS 1.2+ for all traffic
- Encryption at rest where provider supports it
- PII stored minimally (email only)

## Compliance
- GDPR/CCPA data export and deletion
- Consent for notifications
- PCI compliance handled by payment processor (no card storage)

## Monitoring
- Audit logs for authentication events
- Alerting on suspicious login activity
