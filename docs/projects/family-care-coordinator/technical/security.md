# Technical: Security

## Security Goals
- Protect sensitive care data and documents
- Enforce least-privilege access
- Maintain auditability for changes

## Authentication and Authorization
- JWT-based auth with refresh tokens
- Role-based permissions enforced on every API route
- Session invalidation on password resets and role changes

## Data Protection
- TLS for all data in transit
- Encryption at rest for documents and sensitive fields
- Secure storage for tokens and secrets

## Audit Logging
- Log role changes, document access, medication edits
- Reviewable by family admins only

## Incident Response
- Alert on failed login spikes and suspicious access
- Run quarterly access reviews
