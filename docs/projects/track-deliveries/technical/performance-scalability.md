# Technical: Performance and Scalability

## Performance Targets
- Frontend page load < 2s on mobile
- API response time < 500ms (p95)
- Background jobs complete within 5 minutes

## Caching
- CDN cache for static assets
- Redis cache for carrier API responses (15 min TTL)
- Short-lived cache for user package lists

## Scalability
- Horizontal scaling for API servers
- Read replicas for database
- Queue workers scaled based on job volume
