# Track Deliveries - Documentation Index

## Overview

**Track Deliveries** is a customer-facing full-stack web and mobile application that tracks deliveries across multiple retailers and carriers (AliExpress, Shein, Amazon, etc.). Users can add tracking numbers, see a unified delivery timeline, get status alerts, and manage all packages in one centralized location.

**Status**: Planning / Proposal  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)  
**Last Updated**: 2026-01-25

## Quick Links

- [PRD Overview](PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](ARCHITECTURE.md) - Technical architecture and design decisions
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs

## Documentation Structure

### Core Documentation
- **[PRD Overview](PRD_OVERVIEW.md)** - Executive summary, problem statement, MVP definition, and high-level requirements
- **[Architecture](ARCHITECTURE.md)** - System architecture overview with references to technical details
- **[Expert Contributions](EXPERTS.md)** - Expert team contributions, reviews, and sign-offs

### Project-Specific Features
- **[Tracking Management](features/tracking-management.md)** - Add/manage tracking numbers, auto-detect carriers, package notes
- **[Unified Timeline](features/unified-timeline.md)** - Single timeline view, status history, delivery windows
- **[Alerts & Notifications](features/alerts-notifications.md)** - Status change alerts, delivery notifications, delay warnings
- **[Carrier Integrations](features/carrier-integrations.md)** - Multi-carrier API integrations, polling strategy
- **[Search & Organization](features/search-organization.md)** - Search, filter, archive packages
- **[Reports & Export](features/reports-export.md)** - Delivery history, statistics, export functionality

### Technical Documentation
- **[Frontend Architecture](technical/frontend-architecture.md)** - Next.js structure, components, routing
- **[Backend Architecture](technical/backend-architecture.md)** - Services, jobs, modules, runtime
- **[API Design](technical/api-design.md)** - RESTful endpoints, request/response formats
- **[Database Schema](technical/database-schema.md)** - Data models, relationships, migrations
- **[Security](technical/security.md)** - Authentication, authorization, data protection
- **[Mobile Architecture](technical/mobile-architecture.md)** - Responsive web MVP, native app Phase 2
- **[Third-Party Integrations](technical/third-party-integrations.md)** - Carrier APIs, email provider
- **[Infrastructure Architecture](technical/infrastructure-architecture.md)** - Hosting, CI/CD, deployment
- **[Performance & Scalability](technical/performance-scalability.md)** - Caching, scaling, targets
- **[Observability](technical/observability.md)** - Monitoring, logging, alerting

### Business Documentation
- **[Business Model](business/business-model.md)** - Free vs premium tiers, pricing strategy, revenue model
- **[User Personas](business/user-personas.md)** - Target users, needs, pain points
- **[Success Metrics](business/success-metrics.md)** - KPIs, tracking plan, analytics requirements
- **[Go-to-Market Strategy](business/go-to-market.md)** - Launch plan, marketing, user acquisition

## General/Shared Features

This project may use the following general features (if they meet extraction criteria):

### Potential General Features
- **Authentication System** (Candidate) - User registration, login, JWT authentication, password reset
  - *Status*: Not yet extracted to general/
  - *Rationale*: 7 projects use similar authentication - evaluating for extraction
  
- **Notification System** (Candidate) - Email, push notifications, SMS alerts, notification preferences
  - *Status*: Not yet extracted to general/
  - *Rationale*: 5 projects use similar notifications - evaluating for extraction
  
- **Mobile App Foundation** (Candidate) - React Native + Expo setup, offline-first, push notifications
  - *Status*: Not yet extracted to general/
  - *Rationale*: 5 projects use similar mobile architecture - evaluating for extraction

**Note**: These features are currently project-specific. If they meet general feature criteria (3+ projects with minimal configuration OR architectural override), they will be extracted to `docs/projects/general/`.

See [General Features Index](../general/INDEX.md) for more information.

## Project Status

### Current Phase
**Phase**: Planning / Proposal  
**Started**: 2026-01-05  
**Target MVP Completion**: TBD (8 weeks development + 2 weeks testing)

### Development Timeline
- **Phase 1: MVP** - Manual tracking, unified timeline, basic alerts (8 weeks)
- **Phase 2: Core Features** - Retailer grouping, advanced alerts, mobile app (6 weeks)
- **Phase 3: Advanced Features** - Retailer integrations, reports, analytics (8 weeks)

### Priority Rationale
**Business Value**: Medium - Reduces delivery uncertainty, improves customer experience  
**User Value**: High - Solves real pain point for online shoppers  
**Technical Complexity**: Medium - Requires carrier integrations, real-time updates  
**Strategic Fit**: Complementary to subscription management and budget tracking apps

## Target Audience

### Primary Users
- **Frequent Online Shoppers** - People who order from multiple retailers regularly
- **Multi-Household Managers** - Families coordinating deliveries for multiple people
- **E-commerce Power Users** - Users managing many simultaneous orders

### Secondary Users
- **Gift Senders** - People tracking gifts sent to others
- **Small Business Owners** - Tracking supplies and inventory deliveries

## Key Value Propositions

1. **Single Dashboard** - Track all deliveries from all retailers in one place
2. **Proactive Alerts** - Get notified of status changes before packages arrive
3. **Peace of Mind** - Never miss a delivery or wonder where your package is
4. **Organization** - Keep delivery history, notes, and archives in one place
5. **Mobile Access** - Check package status on the go with mobile app

## Related Documentation

- [Projects List Entry](../../reference/PROJECTS_LIST.md#track-deliveries) - Project entry in main projects list
- [General Features](../general/INDEX.md) - Shared features across projects

## Notes

- **Customer-Facing**: Built for end users, not developers
- **High Value**: Reduces delivery uncertainty and missed packages
- **Complementary**: Fits with subscription/bill manager and budget manager projects
- **Privacy First**: User tracking data is private and never shared
- **Carrier Agnostic**: Support for multiple carriers (USPS, UPS, FedEx, DHL, etc.)
- **International Support**: Support for international carriers (AliExpress, Shein, etc.)
- **Legacy**: The original `PRD.md` is kept for historical reference; use `PRD_OVERVIEW.md` for current planning

---

**Track Deliveries provides a single place to manage deliveries across retailers and carriers, giving customers visibility and peace of mind about their online orders.**
