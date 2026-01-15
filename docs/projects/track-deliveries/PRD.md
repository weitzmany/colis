# Track Deliveries - PRD

**Status**: Planning / Proposal  
**Last Updated**: 2026-01-05

## Project Name

**Track Deliveries**

## Project Type

Full-Stack Web & Mobile Application (Customer-Facing)

## Main Idea

A customer-facing application that tracks deliveries across multiple retailers and carriers (AliExpress, Shein, Amazon, etc.). Users can add tracking numbers, see a unified delivery timeline, get status alerts, and manage all packages in one place.

## Target Audience

- Online shoppers using multiple retailers
- People managing frequent deliveries
- Families tracking household orders
- Users who want proactive delivery alerts

## Technology Stack

**Frontend:**
- Next.js (React) with TypeScript
- Responsive design (mobile-first)

**Backend:**
- Node.js with Express or NestJS
- Database: PostgreSQL or MySQL
- Carrier integrations (APIs, webhooks where available)

**Mobile:**
- React Native (iOS & Android)
- Push notifications for status updates

**Infrastructure:**
- Docker containerization
- CI/CD integration

## Core Features

### 1. Tracking Management
- Add tracking numbers manually
- Auto-detect carrier from tracking number
- Group shipments by retailer
- Notes per shipment (gift, urgent, etc.)

### 2. Unified Delivery Timeline
- Single timeline for all packages
- Status history per shipment
- Estimated delivery windows
- Delivery confirmation

### 3. Alerts & Notifications
- Status change alerts
- Out-for-delivery alerts
- Delivery delay alerts
- Delivery confirmation notifications

### 4. Carrier & Retailer Integrations
- Multi-carrier tracking support
- Retailer order linking (optional)
- Fallback scraping when APIs unavailable (future)

### 5. Search & Organization
- Search by tracking number, retailer, status
- Filter by status (in transit, delivered, delayed)
- Archive delivered packages

### 6. Reports & Export
- Delivery history report
- On-time vs delayed statistics
- Export tracking history (CSV/PDF)

## Mobile App Features

### Core Mobile Features
- Push notifications for updates
- Quick add tracking numbers
- Offline access to tracking history

## Business Model

### Free Tier
- Track up to 10 packages
- Basic alerts

### Premium Tier ($X/month)
- Unlimited packages
- Advanced alerts
- Export reports
- Priority support

## Success Metrics

- Monthly active users
- Average packages tracked per user
- Notification engagement rate
- Delivery status accuracy

## Development Phases

### Phase 1: MVP
- Manual tracking numbers
- Unified timeline
- Basic alerts

### Phase 2: Core Features
- Retailer grouping
- Advanced alerts
- Mobile app

### Phase 3: Advanced Features
- Retailer integrations
- Reports and exports
- Analytics dashboard

## Notes

- **Customer-Facing**: Built for end users, not developers
- **High Value**: Reduces delivery uncertainty and missed packages
- **Complementary**: Fits with Subscription & Bills Manager and Budget Manager

---

**Track Deliveries provides a single place to manage deliveries across retailers and carriers, giving customers visibility and peace of mind.**

---

## Review/Contribution

_This PRD will be reviewed and refined before implementation._
