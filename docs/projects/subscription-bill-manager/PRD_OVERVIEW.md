# Subscription & Bills Manager - Product Requirements Document

## Executive Summary

### Project Vision

**Subscription & Bills Manager** (working name: BillGuard) is a customer-facing web and mobile application that transforms the overwhelming task of managing recurring expenses into an organized, actionable system. The platform helps users discover hidden subscriptions, track renewal dates, detect price increases, and reduce monthly costs through intelligent alerts and cancellation assistance.

### Target Users

- **Primary Users**: Budget-conscious consumers (ages 25-45) with multiple subscriptions
- **Secondary Users**: Families managing household expenses, students with limited budgets
- **User Pain Points**: 
  - Forgotten subscriptions billing monthly
  - Surprise price increases
  - Difficulty canceling unused services
  - No centralized view of recurring costs
  - Free trials converting to paid unexpectedly

### Key Value Propositions

1. **Cost Savings**: Reduce monthly recurring expenses by identifying and canceling unused subscriptions
2. **Financial Visibility**: Centralized view of all recurring costs and spending patterns
3. **Proactive Alerts**: Never miss a renewal or price increase again
4. **Cancellation Assistance**: Step-by-step guidance for canceling unwanted subscriptions
5. **Time Savings**: Manage all subscriptions from one dashboard instead of multiple websites

### Success Metrics

- **User Adoption**: 500 users in first 2 months, 2,000 by Month 6
- **User Engagement**: 60% weekly active users, 40% daily active users
- **Subscriptions Tracked**: Average 5+ subscriptions per user (MVP), 10+ (post-MVP)
- **Savings Achieved**: Users save average $50/month from cancellations and price change avoidance
- **Free-to-Premium Conversion**: 8-12% conversion rate
- **Revenue Target**: $10K MRR by Month 6, $50K MRR by Month 12

## Problem Statement

### What Problem Does This Solve?

**Problem**: Consumers lose an average of $240/year on unused or forgotten subscriptions, and 84% of people underestimate their monthly subscription spending. Price increases happen silently, free trials convert unexpectedly, and canceling services is deliberately made difficult by companies.

**Current Solutions**: 
- Manual tracking in spreadsheets (time-consuming, error-prone)
- Bank statements (scattered, no alerts)
- Credit card apps (limited subscription detection)
- Generic budget apps (not subscription-focused)

**Limitations of Current Solutions**:
- No centralized subscription-specific tracking
- No proactive price increase alerts
- No cancellation assistance
- No trial tracking
- Poor user experience for subscription management

### Who Experiences This Problem?

- **85% of consumers** have at least one subscription (streaming, utilities, insurance, etc.)
- **Average household** has 12 subscriptions costing $240-600/month
- **42% of consumers** forget about subscriptions they're paying for
- **84% of people** underestimate their monthly subscription spending by 2-3x

### Business Opportunity

- **Market Size**: 130 million US households with subscriptions
- **Market Gap**: No dominant player in subscription management (fragmented market)
- **Revenue Potential**: Freemium SaaS model targeting $10K MRR by Month 6
- **User Demand**: High willingness-to-pay for cost savings tools ($9.99/month is cheaper than one forgotten subscription)

## Solution Overview

### Proposed Solution

A dedicated subscription and bill tracking platform that:
1. **Centralizes** all recurring expenses in one dashboard
2. **Alerts** users about upcoming renewals, price increases, and trial conversions
3. **Analyzes** spending patterns and identifies savings opportunities
4. **Assists** with cancellation through step-by-step guidance and contact information
5. **Tracks** savings achieved from cancellations and price change avoidance

### How It Addresses the Problem

- **Discovery**: Helps users find forgotten or hidden subscriptions
- **Visibility**: Centralized dashboard shows all recurring costs at a glance
- **Proactive Monitoring**: Automatic alerts prevent surprise charges
- **Actionable Insights**: Identifies which subscriptions to cancel or negotiate
- **Cancellation Support**: Makes canceling easy with guidance and contact info
- **Savings Tracking**: Shows tangible cost savings achieved

### Key Differentiators

1. **Subscription-Focused**: Purpose-built for subscription management, not general budgeting
2. **Price Change Alerts**: Proactive notifications when services increase prices
3. **Cancellation Assistant**: Step-by-step cancellation guidance with contact info library
4. **Trial Tracking**: Prevent free trials from converting to paid unexpectedly
5. **Savings Calculation**: Show real dollar savings from cancellations
6. **Simple UX**: Clean, intuitive interface designed for quick subscription management

## User Personas

### Persona 1: Sarah - Budget-Conscious Professional

- **Age**: 32
- **Occupation**: Marketing Manager
- **Income**: $75K/year
- **Subscriptions**: Netflix, Spotify, Adobe Creative Cloud, gym membership, meal kit service (10+ subscriptions)
- **Pain Points**: 
  - Pays for gym membership she hasn't used in 6 months
  - Forgot about meal kit subscription charging $120/month
  - Adobe increased price from $54.99 to $59.99 without notice
  - No centralized view of recurring costs
- **Goals**: 
  - Identify unused subscriptions to cancel
  - Get alerts before renewals to decide if she still needs them
  - Track total recurring spend and reduce by 20%
- **User Story**: "As a budget-conscious professional, I want to see all my subscriptions in one place so that I can identify which ones I'm not using and cancel them to save money."

### Persona 2: Mike - Family Budget Manager

- **Age**: 41
- **Occupation**: Software Engineer
- **Income**: $120K/year
- **Family**: Married with 2 kids
- **Subscriptions**: Multiple streaming services (Netflix, Disney+, Hulu), utilities, insurance, school fees, kids' activities (15+ subscriptions)
- **Pain Points**: 
  - Subscriptions scattered across multiple credit cards
  - Wife and kids sign up for services he doesn't track
  - Streaming services increased prices by $3-5/month
  - Difficult to see total household recurring costs
- **Goals**: 
  - Centralize all family subscriptions
  - Get alerts for all household renewals
  - Identify duplicate or unused subscriptions
  - Share subscription management with wife
- **User Story**: "As a family budget manager, I want to track all household subscriptions so that my family and I can avoid paying for services we don't use and stay within our monthly budget."

### Persona 3: Emily - Student on Tight Budget

- **Age**: 21
- **Occupation**: College Student
- **Income**: $20K/year (part-time job + financial aid)
- **Subscriptions**: Spotify (student plan), Netflix (shared), Adobe (for design class), gym, phone plan (6 subscriptions)
- **Pain Points**: 
  - Limited budget, every dollar counts
  - Free trials convert to paid and she doesn't notice until charged
  - Doesn't remember which subscriptions she has
  - Scared to cancel because cancellation process is confusing
- **Goals**: 
  - Track all subscriptions on tight budget
  - Get alerts before free trials convert to paid
  - Easy cancellation guidance when she no longer needs services
  - See how much she's spending on subscriptions vs other expenses
- **User Story**: "As a student on a tight budget, I want to get alerts before my free trials convert to paid so that I don't get charged for services I can't afford."

## MVP (Minimum Viable Product) Definition ⚠️ REQUIRED

### MVP Scope

- **Core Problem**: Consumers lose money on forgotten subscriptions and surprise renewals
- **Core User**: Budget-conscious adults (ages 25-45) managing 5-15 subscriptions
- **Core Value**: Track subscriptions, get renewal alerts, identify savings opportunities

### MVP Features (Must-Have)

1. **Manual Subscription Entry**
   - **Why in MVP**: Core functionality - users must be able to add their subscriptions
   - **Description**: Add subscriptions with name, cost, billing cycle, renewal date, category, payment method
   - **User Story**: As a user, I want to add my subscriptions manually so that I can track them in one place
   - **Acceptance Criteria**: 
     - Form with required fields (name, cost, billing cycle, renewal date)
     - Optional fields (category, payment method, notes)
     - Save subscription to database
     - Display in dashboard list
   - **Implementation Notes**: Simple form with validation, support monthly/yearly billing cycles

2. **Renewal Tracking & Calendar View**
   - **Why in MVP**: Essential for preventing surprise charges - the core value proposition
   - **Description**: View all subscriptions with upcoming renewal dates in chronological order
   - **User Story**: As a user, I want to see when my subscriptions renew so that I can decide whether to keep or cancel them
   - **Acceptance Criteria**: 
     - Dashboard showing next 30 days of renewals
     - List view of all subscriptions sorted by renewal date
     - Visual indicators for renewals within 7 days
     - Total monthly/yearly recurring cost display
   - **Implementation Notes**: Query subscriptions ordered by renewal_date, calculate next renewal based on billing cycle

3. **Email Renewal Alerts**
   - **Why in MVP**: Core value - proactive notifications prevent forgotten renewals
   - **Description**: Automated email alerts 7 days before subscription renewals
   - **User Story**: As a user, I want to receive email alerts before my subscriptions renew so that I don't forget about them
   - **Acceptance Criteria**: 
     - Email sent 7 days before renewal date
     - Email includes subscription name, cost, renewal date
     - Option to view details, cancel, or snooze reminder
     - Email preferences in settings
   - **Implementation Notes**: Background job (Bull + Redis) checks daily for upcoming renewals, queues email jobs

4. **Simple Dashboard**
   - **Why in MVP**: Users need a clean, at-a-glance view of their subscriptions
   - **Description**: Dashboard showing total monthly spend, upcoming renewals, all subscriptions
   - **User Story**: As a user, I want to see all my subscriptions and total costs at a glance so that I can understand my recurring expenses
   - **Acceptance Criteria**: 
     - Total monthly recurring cost (prominent display)
     - Total yearly projected cost
     - Upcoming renewals (next 30 days)
     - All subscriptions list (with edit/delete options)
     - Quick stats: number of subscriptions, most expensive subscription
   - **Implementation Notes**: React dashboard with cards for stats, table for subscriptions list, recharts for simple visualizations

5. **User Authentication (JWT-Based)**
   - **Why in MVP**: Required to save user data and enable personalized alerts
   - **Description**: User registration, login, password reset, JWT token-based authentication
   - **User Story**: As a user, I want to create an account so that I can access my subscription data from any device
   - **Acceptance Criteria**: 
     - Registration form (email, password, name)
     - Login form (email, password)
     - Password reset via email
     - JWT token stored in httpOnly cookies
     - Protected routes for authenticated users only
   - **Implementation Notes**: NestJS auth module, bcrypt password hashing, JWT tokens (7-day expiry), Nodemailer for password reset emails

6. **Basic Analytics**
   - **Why in MVP**: Users need to see spending patterns and identify savings opportunities
   - **Description**: Simple analytics showing monthly spend, category breakdown, subscription count
   - **User Story**: As a user, I want to see how much I'm spending on subscriptions by category so that I can identify areas to reduce costs
   - **Acceptance Criteria**: 
     - Monthly recurring cost chart (bar chart by category)
     - Category breakdown (pie chart or bar chart)
     - Subscription count by category
     - Total spend over time (simple line chart)
   - **Implementation Notes**: Recharts for visualization, aggregate queries for category totals, monthly spend calculation

### MVP Success Criteria

- **User Adoption**: 500 users in first 2 months (250/month signup rate)
- **User Engagement**: 60% weekly active users (users log in at least once per week)
- **Core Functionality**: Users can add subscriptions in <2 minutes
- **Alert Effectiveness**: 40% of users act on renewal alerts (view details, cancel, or acknowledge)
- **Data Accuracy**: Users track average 5+ subscriptions per account
- **Technical Stability**: 99% uptime during first 2 months, <500ms average response time

### MVP Timeline

- **Development**: 10 weeks (8 weeks core development + 2 weeks polish)
  - Week 1-2: Project setup, authentication, database schema
  - Week 3-4: Subscription CRUD operations, dashboard UI
  - Week 5-6: Renewal tracking, alert system (background jobs)
  - Week 7-8: Email alerts, analytics, testing
  - Week 9-10: Polish, bug fixes, performance optimization

- **Testing**: 2 weeks (beta testing with 50 users)
  - Week 11: Internal testing, bug fixes
  - Week 12: Beta user testing, final polish

- **Launch**: Week 13 (April 2026)
  - Soft launch to beta users
  - Public launch with marketing push

### MVP Tech Stack

- **Frontend**: Next.js 15 (React) with TypeScript, Tailwind CSS, shadcn/ui, SWR (data fetching), Recharts (analytics)
- **Backend**: Node.js 20 LTS with NestJS framework, RESTful API, Prisma ORM (PostgreSQL)
- **Database**: PostgreSQL 16 (relational database for structured subscription data)
- **Background Jobs**: Bull (job queue) + Redis 7 (in-memory store for job queue)
- **Email**: Nodemailer with SendGrid/Mailgun SMTP (for renewal alerts and auth emails)
- **Hosting**: DigitalOcean (Droplet for backend, App Platform for frontend, Managed PostgreSQL, Managed Redis)
- **CI/CD**: GitHub Actions (automated testing, linting, deployment)

### What's NOT in MVP (Future Features)

- **Mobile App**: React Native mobile app → Phase 2 (Months 3-6)
  - Why post-MVP: Web app validates core features first, mobile adds complexity
  
- **Price Change Detection**: Automatic price increase alerts → Phase 2 (Months 3-6)
  - Why post-MVP: Requires manual monitoring or scraping, complex to implement accurately
  
- **Trial Tracking**: Track free trials and prevent conversions → Phase 3 (Months 7-12)
  - Why post-MVP: Nice-to-have, not essential for core value proposition
  
- **Cancellation Assistant**: Step-by-step cancellation guidance → Phase 2 (Months 3-6)
  - Why post-MVP: Content-heavy (requires database of cancellation processes), manual data entry
  
- **Advanced Analytics**: Spending forecasts, savings impact over time → Phase 3 (Months 7-12)
  - Why post-MVP: Requires historical data, more useful after users have used platform for months
  
- **Household Sharing**: Family accounts, shared bill management → Phase 3 (Months 7-12)
  - Why post-MVP: Adds complexity with permissions, roles, access control
  
- **Email Scanning**: Parse email receipts to detect subscriptions → Phase 4 (Year 2+)
  - Why post-MVP: Complex (IMAP/Gmail API), privacy concerns, requires email permissions
  
- **Transaction Import**: Bank/credit card integration (Plaid) → Phase 4 (Year 2+)
  - Why post-MVP: High complexity, Plaid fees, compliance requirements (PCI DSS)

## Post-MVP Features (Phase 2+)

### Phase 2: Core Features (Months 3-6)

1. **Mobile App (React Native)** - Priority: High
   - Push notifications for renewal alerts
   - Quick add subscription from mobile
   - Offline access to subscription list
   - Home screen widgets showing upcoming renewals

2. **Price Change Detection** - Priority: High
   - Manual price change logging
   - Price history tracking
   - Price increase alerts (email/push)
   - Savings from price change avoidance

3. **Cancellation Assistant** - Priority: Medium
   - Step-by-step cancellation instructions
   - Contact info library (phone, email, website)
   - Cancellation confirmation tracking
   - Savings calculator (potential savings from cancellation)

4. **Advanced Analytics** - Priority: Medium
   - Category breakdown (detailed pie/bar charts)
   - Spending trends over time (line charts)
   - Yearly cost projections
   - Most expensive subscriptions
   - Average cost per subscription

### Phase 3: Advanced Features (Months 7-12)

5. **Trial Tracking** - Priority: Medium
   - Add free trials with trial end date
   - Alerts before trial converts to paid
   - Trial-to-paid conversion tracking
   - Savings from canceled trials

6. **Household Sharing** - Priority: Medium
   - Family accounts (invite members)
   - Shared subscriptions and bills
   - Role-based permissions (admin, viewer)
   - Family recurring cost overview

7. **Negotiation Scripts** - Priority: Low
   - Scripts for negotiating lower bills
   - Success rate tracking
   - Community-contributed scripts

### Phase 4: Premium Features (Year 2+)

8. **Email Scanning (IMAP/Gmail API)** - Priority: Low
   - Connect email account
   - Parse receipts for subscriptions
   - Automatic subscription detection
   - Privacy controls

9. **Transaction Import (Plaid)** - Priority: Low
   - Connect bank/credit card accounts
   - Automatic subscription detection from transactions
   - Recurring charge pattern detection
   - Transaction categorization

10. **Predictive Analytics** - Priority: Low
    - Predict future spending based on trends
    - Recommend subscriptions to cancel
    - Identify savings opportunities
    - Budget forecasting

## Technical Requirements (High-Level)

### Frontend Requirements

- **Framework**: Next.js 15 (React) with TypeScript
- **UI Library**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context + SWR for server state
- **Data Visualization**: Recharts for analytics charts
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first, fully responsive

### Backend Requirements

- **Framework**: NestJS (Node.js) with TypeScript
- **API**: RESTful API with OpenAPI documentation
- **ORM**: Prisma for database operations
- **Authentication**: JWT tokens, bcrypt password hashing
- **Background Jobs**: Bull job queue with Redis
- **Email**: Nodemailer with SendGrid/Mailgun

### Database Requirements

- **Primary Database**: PostgreSQL 16
- **Schema**: Users, subscriptions, categories, alerts, settings
- **Indexes**: user_id, renewal_date, created_at
- **Constraints**: Foreign keys, unique constraints, check constraints
- **Migrations**: Prisma migrations for schema evolution

### Infrastructure Requirements

- **Hosting**: DigitalOcean (MVP), AWS (post-MVP)
- **Containerization**: Docker for backend
- **CI/CD**: GitHub Actions (testing, linting, deployment)
- **Monitoring**: Sentry for error tracking, CloudWatch for logs
- **Backup**: Automated daily backups for PostgreSQL

## Business Requirements (High-Level)

### Revenue Model

**Freemium SaaS Model**:

- **Free Tier**:
  - Track up to 10 subscriptions
  - Basic renewal alerts (email only)
  - Simple dashboard
  - No advanced analytics
  
- **Premium Tier** ($9.99/month):
  - Unlimited subscriptions
  - Price change alerts
  - Advanced analytics
  - Mobile app access (Phase 2+)
  - Cancellation assistant
  - Household sharing (Phase 3+)
  - Priority support

### Pricing Strategy

- **Price Point**: $9.99/month (or $99/year with 2 months free)
- **Positioning**: Cheaper than one forgotten subscription
- **Value Proposition**: Save $50+/month, pay $9.99/month = $40+ net savings
- **Free Tier**: Generous free tier to drive adoption, convert 8-12% to premium

### Go-to-Market Strategy

1. **Beta Launch** (Week 13): 
   - Invite 50 beta testers
   - Gather feedback, iterate
   - Build testimonials and case studies

2. **Public Launch** (Week 15):
   - Product Hunt launch
   - Social media marketing (Reddit, Twitter, TikTok)
   - Content marketing (blog posts on subscription management)
   - SEO optimization (target "subscription tracker", "bill manager")

3. **Growth Phase** (Months 3-6):
   - Referral program (give 1 month free, get 1 month free)
   - Partnerships with personal finance influencers
   - Paid advertising (Google Ads, Facebook Ads)
   - App store optimization (when mobile app launches)

### Success Metrics

- **User Acquisition**: 500 users (Month 2), 2,000 users (Month 6), 10,000 users (Month 12)
- **Revenue**: $10K MRR (Month 6), $50K MRR (Month 12)
- **Engagement**: 60% weekly active users, 40% daily active users
- **Conversion**: 8-12% free-to-premium conversion rate
- **Churn**: <5% monthly churn
- **User Savings**: Average $50/month per user

## Timeline & Milestones

### Phase 1: MVP (Weeks 1-12)

**Goal**: Launch functional web app with core subscription tracking and alerts

**Features**:
- Manual subscription entry
- Renewal tracking & calendar view
- Email renewal alerts
- Simple dashboard
- User authentication (JWT)
- Basic analytics

**Success Criteria**: 
- 500 users in first 2 months
- 60% weekly active users
- Users track average 5+ subscriptions

**Timeline**: 10 weeks development + 2 weeks testing = 12 weeks total

### Phase 2: Core Features (Months 3-6)

**Goal**: Enhance platform with mobile app, price alerts, cancellation assistance

**Features**:
- Mobile app (React Native)
- Price change detection
- Cancellation assistant
- Advanced analytics

**Success Criteria**: 
- 2,000 total users
- 25% mobile app adoption
- $10K MRR
- 10% free-to-premium conversion

### Phase 3: Advanced Features (Months 7-12)

**Goal**: Add advanced features for power users and families

**Features**:
- Trial tracking
- Household sharing
- Negotiation scripts
- Advanced reports

**Success Criteria**: 
- 10,000 total users
- $50K MRR
- 15% free-to-premium conversion
- 65% 6-month retention

### Phase 4: Premium Features (Year 2+)

**Goal**: Enterprise features and advanced integrations

**Features**:
- Email scanning (IMAP/Gmail API)
- Transaction import (Plaid)
- Predictive analytics
- Business accounts

**Success Criteria**: 
- 50,000 total users
- $200K+ MRR
- Profitability achieved

## Risks & Mitigation

### Risk 1: Low User Adoption

- **Description**: Users don't sign up or abandon after initial trial
- **Likelihood**: Medium
- **Impact**: High (no users = no revenue)
- **Mitigation**: 
  - Strong value proposition (save money immediately)
  - Generous free tier to lower signup barrier
  - Simple onboarding (add subscriptions in <2 minutes)
  - Clear savings tracking (show dollar savings)
  - Referral program to incentivize sharing

### Risk 2: Low Free-to-Premium Conversion

- **Description**: Users stay on free tier, don't upgrade to premium
- **Likelihood**: Medium
- **Impact**: High (no revenue)
- **Mitigation**: 
  - Limit free tier to 10 subscriptions (power users need premium)
  - Premium features provide clear value (price alerts, mobile app)
  - Show savings achieved vs premium cost (ROI calculation)
  - Trial premium for 7 days to demonstrate value

### Risk 3: Manual Data Entry Friction

- **Description**: Users don't want to manually enter all their subscriptions
- **Likelihood**: High
- **Impact**: Medium (reduces engagement)
- **Mitigation**: 
  - Simple, fast input form (< 30 seconds per subscription)
  - Import templates (common subscriptions pre-filled)
  - Onboarding wizard (guide users through setup)
  - Gradual entry (add subscriptions over time)
  - Future: Email scanning, transaction import (Phase 4)

### Risk 4: Price Change Detection Inaccuracy

- **Description**: Difficult to automatically detect price changes without scraping
- **Likelihood**: High
- **Impact**: Medium (reduces trust)
- **Mitigation**: 
  - Start with manual price change logging (MVP excludes this)
  - Phase 2: User-reported price changes
  - Phase 3: Email scanning for price increase notifications
  - Community-contributed price change database

### Risk 5: Competition from Established Players

- **Description**: Existing budget apps or banks add subscription management features
- **Likelihood**: Medium
- **Impact**: Medium (market share)
- **Mitigation**: 
  - Subscription-focused UX (better than generic budget apps)
  - Fast iteration (add features based on user feedback)
  - Community and content (become go-to resource for subscription management)
  - Differentiation (cancellation assistant, price alerts)

### Risk 6: Privacy Concerns

- **Description**: Users worried about storing financial data
- **Likelihood**: Low
- **Impact**: High (trust issue)
- **Mitigation**: 
  - Clear privacy policy
  - No bank account connections in MVP (optional in Phase 4)
  - Encryption at rest and in transit
  - SOC 2 compliance (post-MVP)
  - Transparent data practices

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-22  
**Status**: Comprehensive PRD with MVP Definition Complete
