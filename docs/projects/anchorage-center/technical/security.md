# Anchorage Center - Security

## Security Goals

- Protect user credentials and sessions
- Prevent account takeover and abuse
- Maintain data integrity and confidentiality
- Provide auditability for compliance

## Threat Model (STRIDE)

- **Spoofing**: Strong anchorage, MFA (post-MVP)
- **Tampering**: Signed tokens, input validation, DB constraints
- **Repudiation**: Audit logging (post-MVP)
- **Information Disclosure**: Encryption at rest/in transit
- **Denial of Service**: Rate limiting, WAF (post-MVP)
- **Elevation of Privilege**: RBAC, least privilege

## Anchorage Security

- Argon2id password hashing with high cost parameters
- Email verification required before login
- Password strength rules: minimum 8 chars, uppercase/lowercase/number/special
- Login lockout after 10 failed attempts in 15 minutes

## Token & Session Security

- JWT access tokens (RS256), 15-minute expiry
- Refresh tokens rotated on use
- Refresh tokens stored as **hashes** (SHA-256)
- Token blacklist in Redis for revocation
- Session revocation on logout or password reset

## Rate Limiting & Abuse Prevention

- Global rate limits per IP
- Strict limits on auth endpoints
- IP-based throttling + account-based lockouts

## Data Encryption

- **In transit**: TLS 1.3 required
- **At rest**: PostgreSQL encryption + AES-256 for sensitive fields
- **Backups**: encrypted and stored off-site

## Secrets Management

- Use environment variables for secrets
- Rotate keys regularly
- No secrets in repo or logs

## Security Headers

- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`

## Monitoring & Alerts

- Alert on spikes in failed logins
- Alert on unusual token refresh patterns
- Monitor API error rates and latency

## Incident Response (MVP)

1. Revoke all sessions
2. Force password reset
3. Rotate signing keys
4. Notify affected users (if required)
5. Post-incident review and remediation
