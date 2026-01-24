# Vehicle Maintenance Tracker - Product Requirements Document

**Status**: Planning  
**Last Updated**: 2026-01-21  
**Project Lead**: Patricia Martinez (Product Manager)

## Executive Summary

**Vehicle Maintenance Tracker** (working title: **AutoCare**) is a customer-facing application that helps drivers track vehicle maintenance schedules, service history, and total ownership costs. The platform reduces unexpected repair costs through proactive maintenance tracking and provides comprehensive expense insights.

### Key Value Propositions

1. **Never Miss Maintenance** - Automated reminders based on time and mileage
2. **Complete Service History** - All repairs, invoices, and warranties in one place
3. **Cost Transparency** - Full ownership cost tracking (fuel, insurance, repairs, tolls)
4. **Multi-Vehicle Support** - Manage entire family fleet from one account

### Success Metrics

- **User Adoption**: 1,000 active users within first 3 months
- **User Engagement**: 60% weekly active users
- **Maintenance Compliance**: 70% of users complete maintenance on time
- **3-Month Retention**: 50% retention rate

## Problem Statement

### What Problem Does This Solve?

Car owners struggle to:
- **Remember maintenance schedules** - Miss oil changes, tire rotations, inspections
- **Track service history** - Lose invoices, forget what was done when
- **Understand total costs** - Don't know true cost of vehicle ownership
- **Manage multiple vehicles** - Difficult to coordinate maintenance for family vehicles

### Who Experiences This Problem?

1. **Primary Users**: Individual car owners managing ongoing maintenance
2. **Secondary Users**: 
   - Families with 2-4 vehicles
   - Used-car owners tracking extensive repairs
   - Cost-conscious drivers optimizing expenses

### Current Solutions and Limitations

- **Paper logs**: Easy to lose, no reminders, manual calculations
- **Spreadsheets**: Require discipline, no notifications
- **Mechanic apps**: Focus on shops, not customer-facing
- **General note apps**: No maintenance-specific features

## Solution Overview

### Proposed Solution

A comprehensive vehicle maintenance platform combining:
- **Automated Scheduling** - Smart reminders based on time and mileage
- **Digital Service History** - Cloud-stored receipts, invoices, photos
- **Expense Analytics** - Real-time cost tracking and reporting
- **Mobile-First Design** - Quick logging on-the-go

### How It Addresses the Problem

1. **Automated Reminders** → Never miss maintenance
2. **Cloud Storage** → Never lose service records
3. **Expense Tracking** → Understand true ownership costs
4. **Multi-Vehicle Support** → Manage entire household

### Key Differentiators

- **Customer-focused** (not mechanic-focused)
- **Complete ownership cost tracking** (not just maintenance)
- **Mobile-first** with offline support
- **Simple, intuitive UI** for non-technical users

## User Personas

### Primary: Sarah - Busy Professional with 2 Cars

- **Age**: 35, working professional
- **Vehicles**: 2015 Honda Accord (commute), 2018 Toyota Highlander (family)
- **Pain Points**: 
  - Forgets oil changes
  - Loses service receipts
  - Doesn't know monthly vehicle costs
- **Goals**: 
  - Stay on top of maintenance
  - Reduce unexpected repair costs
  - Track expenses for budgeting

### Secondary: Mike - Used Car Owner

- **Age**: 28, recent college grad
- **Vehicle**: 2012 Ford Focus (used, 85K miles)
- **Pain Points**: 
  - Frequent repairs, hard to track
  - Wants to know if car is worth keeping
  - Needs warranty tracking
- **Goals**: 
  - Decide: keep fixing or sell?
  - Track all repairs and costs
  - Avoid repeat repairs

### Secondary: Johnson Family - Multi-Vehicle Household

- **Members**: Parents + 2 teenage drivers
- **Vehicles**: 3 cars (2016 Honda CR-V, 2019 Toyota Camry, 2014 Ford F-150)
- **Pain Points**: 
  - Coordinating maintenance for 3 vehicles
  - Teenagers forget to report issues
  - Insurance and registration renewals
- **Goals**: 
  - Centralized tracking for all vehicles
  - Reminders for all family members
  - Budget for total vehicle costs

## MVP (Minimum Viable Product) Definition ⚠️ REQUIRED

### MVP Scope

- **Core Problem**: Car owners forget maintenance schedules and lose service history
- **Core User**: Individual car owner managing 1-2 vehicles
- **Core Value**: Never miss maintenance + complete service history in one place

### MVP Features (Must-Have)

1. **Vehicle Profile Creation**
   - Why in MVP: Foundation for all features
   - User story: As a car owner, I want to add my vehicle details (VIN, make, model, mileage) so that I can start tracking maintenance

2. **Maintenance Schedule Setup**
   - Why in MVP: Core value proposition - reminders
   - User story: As a car owner, I want to set up maintenance schedules (oil change every 3 months/3K miles) so that I get reminders

3. **Service History Logging**
   - Why in MVP: Core value proposition - digital records
   - User story: As a car owner, I want to log completed services with date, mileage, cost, and notes so that I have a complete history

4. **Basic Reminders**
   - Why in MVP: Essential for user engagement
   - User story: As a car owner, I want to receive email reminders for upcoming maintenance so that I never miss a service

5. **Simple Dashboard**
   - Why in MVP: User needs to view status at a glance
   - User story: As a car owner, I want to see all my vehicles and upcoming maintenance on one screen so that I know what needs attention

### MVP Success Criteria

- **User Adoption**: 200 active users in first month
- **User Engagement**: 50% of users log in weekly
- **Core Functionality**: Users can set up a vehicle and maintenance schedule in under 5 minutes
- **Technical Stability**: 99% uptime during MVP phase
- **User Satisfaction**: 70% of users rate the app 4+ stars

### MVP Timeline

- **Development**: 8 weeks
  - Week 1-2: Vehicle profiles and database
  - Week 3-4: Maintenance scheduling engine
  - Week 5-6: Service history and reminders
  - Week 7-8: Dashboard and polish
- **Testing**: 2 weeks
  - Week 9: Beta testing with 20 users
  - Week 10: Bug fixes and refinement
- **Launch**: March 15, 2026

### MVP Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Hosting**: Vercel (frontend) + Railway (backend)
- **Email**: SendGrid for reminders

### What's NOT in MVP (Future Features)

- **Expense Tracking** - Complex feature, add after core tracking is proven (Phase 2)
- **Mobile App** - Start with responsive web, add native app later (Phase 3)
- **Receipt/Invoice Storage** - Document storage adds complexity (Phase 2)
- **Multi-Vehicle Dashboard** - Focus on single vehicle first (Phase 2)
- **Push Notifications** - Email reminders sufficient for MVP (Phase 3)
- **Mileage-Based Triggers** - Manual mileage entry first (Phase 2)
- **Reports & Analytics** - Basic history view sufficient for MVP (Phase 2)
- **Premium Features** - Launch with free tier, add premium later (Phase 4)

## Post-MVP Features (Phase 2+)

### Phase 2: Enhanced Tracking (Months 3-6)
- **Expense Tracking** - Track fuel, insurance, tolls, repairs [Priority: High]
- **Document Storage** - Upload and store service invoices and receipts [Priority: High]
- **Multi-Vehicle Support** - Manage up to 3 vehicles per account [Priority: High]
- **Monthly Reports** - Basic expense summaries [Priority: Medium]

### Phase 3: Mobile & Advanced Features (Months 7-12)
- **React Native Mobile App** - iOS and Android apps [Priority: High]
- **Push Notifications** - Mobile reminders [Priority: High]
- **Photo Capture** - Scan receipts with camera [Priority: Medium]
- **Mileage Auto-Tracking** - Automatic mileage updates [Priority: Medium]
- **Warranty Tracking** - Track warranty expiration dates [Priority: Medium]

### Phase 4: Premium Features (Months 13-18)
- **Premium Tier** - Unlimited vehicles, advanced reports, priority support [Priority: High]
- **Advanced Analytics** - Cost-per-mile, depreciation tracking [Priority: Medium]
- **Export to PDF/CSV** - Download reports [Priority: Medium]
- **Family Sharing** - Share vehicle access with family members [Priority: Low]

## Technical Requirements (High-Level)

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (email/password, Google OAuth)
- **Storage**: Cloud storage (AWS S3 or Cloudflare R2) for documents
- **Email**: SendGrid for reminders and notifications
- **Infrastructure**: Docker, CI/CD (GitHub Actions)

### Infrastructure
- **Hosting**: Vercel (frontend), Railway or DigitalOcean (backend)
- **Database Hosting**: Railway or Supabase
- **CDN**: Cloudflare for static assets
- **Monitoring**: Sentry for error tracking
- **Analytics**: Vercel Analytics + Plausible

### Integrations
- **Email Service**: SendGrid
- **Cloud Storage**: AWS S3 or Cloudflare R2
- **Payment Processing** (Phase 4): Stripe

[See detailed technical specifications in ARCHITECTURE.md]

## Business Requirements (High-Level)

### Revenue Model
- **Phase 1-2 (MVP)**: Free tier only (validate product-market fit)
- **Phase 3**: Introduce free tier with limitations
- **Phase 4**: Launch premium tier ($9.99/month or $89.99/year)

### Free Tier (Phase 3+)
- 1 vehicle
- Basic reminders (email only)
- 10 service history entries
- Limited storage (50MB)

### Premium Tier (Phase 4+)
- Unlimited vehicles
- Push notifications (mobile)
- Unlimited service history
- Unlimited document storage
- Advanced reports and analytics
- Priority support
- Export to PDF/CSV

### Pricing Strategy
- **Target**: $9.99/month or $89.99/year (25% discount)
- **Rationale**: Cheaper than one missed maintenance issue
- **Market Position**: Mid-range (between free apps and expensive fleet software)

### Go-to-Market
- **Phase 1**: Beta launch to friends/family (20 users)
- **Phase 2**: Product Hunt launch
- **Phase 3**: Reddit (r/cars, r/frugal), car forums
- **Phase 4**: Content marketing (blog about car maintenance)

[See detailed business requirements in business/revenue-model.md]

## Timeline & Milestones

### Phase 1: MVP (Weeks 1-10)
- **Goal**: Launch functional maintenance tracker
- **Duration**: 10 weeks (8 weeks dev + 2 weeks testing)
- **Features**: Vehicle profiles, maintenance schedules, service history, basic reminders, dashboard
- **Success Criteria**: 200 active users, 99% uptime, 4+ star ratings

### Phase 2: Enhanced Tracking (Months 3-6)
- **Goal**: Add expense tracking and document storage
- **Duration**: 3 months
- **Features**: Expense tracking, document storage, multi-vehicle support, reports
- **Success Criteria**: 1,000 active users, 60% weekly active users

### Phase 3: Mobile & Advanced Features (Months 7-12)
- **Goal**: Launch mobile apps and advanced features
- **Duration**: 6 months
- **Features**: React Native apps, push notifications, photo capture, mileage tracking
- **Success Criteria**: 5,000 active users, 50% mobile users

### Phase 4: Premium Features (Months 13-18)
- **Goal**: Monetize through premium tier
- **Duration**: 6 months
- **Features**: Premium tier, advanced analytics, export, family sharing
- **Success Criteria**: 10,000 users, 10% premium conversion

## Success Criteria

### Quantitative Metrics
- **User Adoption**: 200 users (Month 1), 1,000 (Month 3), 5,000 (Month 12)
- **User Engagement**: 50% weekly active users, 70% monthly active users
- **Maintenance Compliance**: 70% of scheduled maintenance completed on time
- **Retention**: 50% 3-month retention, 30% 12-month retention
- **Premium Conversion** (Phase 4): 10% free-to-paid conversion

### Qualitative Metrics
- **User Satisfaction**: 4+ star average rating
- **Feature Adoption**: 80% of users log at least 3 service entries
- **Support Quality**: <24hr response time, 90% satisfaction
- **Net Promoter Score**: NPS > 30

### Business Goals
- **Product-Market Fit**: Achieve before Phase 4 (premium launch)
- **Break-Even**: 1,000 premium users = $10K MRR = break-even
- **Growth**: 20% month-over-month user growth

## Risks & Mitigation

### Technical Risks

**Risk 1: Reminder Delivery Reliability**
- **Impact**: High - Core feature failure
- **Mitigation**: Use reliable email service (SendGrid), implement retry logic, log all reminders

**Risk 2: Data Loss/Corruption**
- **Impact**: Critical - Loss of user trust
- **Mitigation**: Daily database backups, data validation, audit logs

**Risk 3: Performance with Large Datasets**
- **Impact**: Medium - User experience degradation
- **Mitigation**: Database indexing, pagination, lazy loading

### Business Risks

**Risk 1: Low User Adoption**
- **Impact**: High - Product failure
- **Mitigation**: Beta testing, user feedback loops, iterative improvements

**Risk 2: Free-to-Paid Conversion Too Low**
- **Impact**: High - Revenue failure
- **Mitigation**: Validate free tier value, premium features research, A/B testing pricing

**Risk 3: Competition from Established Apps**
- **Impact**: Medium - Market saturation
- **Mitigation**: Focus on customer-facing (not mechanic-facing), better UX, unique features

### Compliance Risks

**Risk 1: Data Privacy Regulations (GDPR, CCPA)**
- **Impact**: High - Legal liability
- **Mitigation**: Privacy policy, data encryption, user data export/deletion, consent management

**Risk 2: Vehicle Data Accuracy**
- **Impact**: Medium - User trust
- **Mitigation**: Disclaimer about user-entered data, validation where possible

## Appendices

### Related Documents
- [Architecture](ARCHITECTURE.md) - System architecture and technical design
- [Database Schema](technical/database-schema.md) - PostgreSQL database design
- [API Design](technical/api-design.md) - RESTful API endpoints
- [Security](technical/security.md) - Authentication and data protection
- [Revenue Model](business/revenue-model.md) - Pricing and monetization
- [Success Metrics](business/success-metrics.md) - KPI tracking

### External References
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

**Vehicle Maintenance Tracker helps drivers stay on top of maintenance, lower costs, and keep complete service history.**
