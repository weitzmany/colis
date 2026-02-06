# Home Inventory Manager - Architecture

## System Overview
The system consists of a web app, a mobile app, a REST API, and shared storage services. Web and mobile clients connect to the API for item management, search, and reporting. Photos and receipts are stored in an object storage service with signed URL access.

## Frontend Architecture
- **Framework**: Next.js with TypeScript
- **State Management**: React Query + local cache for offline-tolerant reads
- **UI**: Mobile-first responsive layout, accessibility-first components
- **File Uploads**: Direct upload to object storage with signed URLs
- **Reporting**: Client requests report generation and downloads results

## Mobile Architecture
- **Framework**: React Native
- **Capture**: Camera integration for photos and receipts, barcode scanning
- **Offline Mode**: Local SQLite storage with background sync
- **Sync Strategy**: Delta sync with conflict resolution on edits

## Backend Architecture
- **Framework**: Node.js with NestJS (REST)
- **Authentication**: JWT-based sessions with refresh tokens
- **Services**:
  - Item service (CRUD, metadata)
  - Media service (signed URLs, metadata)
  - Reporting service (PDF/CSV generation)
  - Warranty service (dates, alerts in Phase 2)
- **Jobs**: Background workers for report generation and media processing

## Infrastructure
- **Hosting**: Docker containers on cloud VM (MVP)
- **Storage**: S3-compatible object storage + CDN for media
- **CI/CD**: GitHub Actions with staging and production pipelines
- **Observability**: Structured logs, request tracing, error alerts

## Security Architecture
- **Data Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Access Control**: Per-user ownership validation on all items
- **Media Access**: Signed URLs with expiration
- **Audit Trail**: Change history for item edits (Phase 2)

## Data Architecture
- **Primary DB**: PostgreSQL
- **Core Tables**:
  - users
  - items
  - item_photos
  - receipts
  - rooms
  - categories
  - tags
  - warranties
  - reports

## Integration Architecture
- **Barcode Lookup**: Third-party UPC database (Phase 2) with caching
- **Notifications**: Email/push for warranty alerts (Phase 2)
- **Export**: PDF/CSV via internal reporting service

## Scalability Considerations
- Separate media metadata from binary storage
- Use read replicas for heavy report export loads
- Queue report generation to avoid blocking requests

## Review/Contribution

_Architecture reflects the planned stack and will be updated after technical validation._
