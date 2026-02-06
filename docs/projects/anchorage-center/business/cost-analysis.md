# Anchorage Center - Cost Analysis

## MVP Cost Targets

**Goal**: Keep infrastructure costs under $200–$350/month for MVP.

## Cost Drivers

- Application servers (2 vCPU, 4GB RAM)
- Managed PostgreSQL
- Redis cache
- Log storage + backups
- Bandwidth

## Estimated Monthly Costs (MVP)

- Compute: $40–$80
- PostgreSQL: $60–$120
- Redis: $20–$50
- Storage + backups: $10–$30
- Monitoring/logging: $0–$50
- Bandwidth: $10–$30

**Estimated Total**: $140–$360/month

## Cost Optimization Levers

- Use smaller instances in early MVP
- Reserve instances after usage stabilizes
- Limit log retention in MVP
- Scale horizontally only when needed

## Post-MVP Considerations

- Multi-region redundancy
- Dedicated Redis cluster
- Managed secrets + WAF
- Increased log retention for compliance
