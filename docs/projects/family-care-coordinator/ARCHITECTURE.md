# Family Care Coordinator - Architecture

## System Overview
The system consists of a web app, a mobile app, a REST API, and supporting services for storage, notifications, and monitoring. Data is stored in MySQL with documents in object storage. All access is protected by role-based permissions and audit logging.

## High-Level Components
- Web client (Angular)
- Mobile client (Capacitor)
- REST API (PHP Slim)
- MySQL database
- Object storage for documents
- Notification services (email and push)
- Observability stack (logging, metrics, tracing)

## Frontend Architecture (Web)
- Angular with TypeScript and modular feature areas
- Responsive layouts for caregiver workflows
- Role-aware UI rendering (viewer/editor/admin)
- Client-side caching for recent schedules and tasks

## Mobile Architecture
- Capacitor wrapper for a shared web UI
- Push notification integration
- Offline read support for calendar and tasks
- Secure local storage for cached data

## Backend Architecture
- RESTful API with versioned endpoints
- Authentication via JWT and refresh tokens
- Role-based access enforced at the API layer
- Validation and auditing for task updates and document access

## Data Architecture
- Relational schema for families, dependents, tasks, routines, and events
- Document metadata stored in MySQL; files stored in object storage
- Audit logs for sensitive actions

## Security Architecture
- TLS everywhere, JWT for session tokens
- Encryption at rest for sensitive fields and documents
- Least-privilege access on API and storage
- Audit log retention and review

## Notification Architecture
- Event-driven notifications for task reminders and schedule changes
- Email delivery via transactional provider
- Push notifications via APNs/FCM

## Infrastructure
- Dockerized services for local development and CI
- CI/CD pipeline for linting, tests, and deploys
- Environment-based configuration
- Monitoring and alerting for errors and latency

## Scalability Considerations
- Stateless API servers behind a load balancer
- Read replicas for MySQL as usage grows
- Background jobs for notifications and cleanup

## Integration Architecture
- Optional calendar sync integrations (post-MVP)
- Export to CSV/PDF for care summaries
