# Financial Goal Saver - Documentation Index

## Overview

**Financial Goal Saver** is a customer-facing full-stack web and mobile application that helps people achieve financial goals through automated savings, intelligent spending analysis, and gamified progress tracking. The platform connects to users' bank accounts via Plaid API, analyzes spending patterns, and automatically transfers money to goal-specific accounts.

**Target Audience**: Working adults (ages 25-45) saving for specific financial goals (vacation, emergency fund, home down payment, etc.)  
**Business Model**: Freemium SaaS (Free tier: 1 goal; Premium: $9.99/month for unlimited goals and advanced features)

---

## Documentation Structure

### Core Documentation

- **[PRD Overview](PRD_OVERVIEW.md)** - Main product requirements document with MVP definition, features, business model
- **[Architecture](ARCHITECTURE.md)** - Technical architecture, system design, infrastructure, and tech stack
- **[Expert Contributions](EXPERTS.md)** - Expert reviews, sign-offs, and feedback

---

## Key Features

### MVP Features (Must-Have)

1. **Bank Account Connection** (Plaid Integration)
   - Secure OAuth flow for connecting bank accounts
   - Real-time transaction syncing
   - Support for 500+ US banks

2. **Financial Goal Creation & Management**
   - Create goals with target amounts and deadlines
   - Goal categories (vacation, emergency fund, home, car, education)
   - Priority levels and goal images

3. **Automated Savings Engine**
   - AI-powered algorithm analyzes spending patterns
   - Calculates optimal savings amounts per goal
   - Schedules automatic ACH transfers
   - Safety buffer to prevent overdrafts

4. **Progress Dashboard**
   - Visual progress bars for each goal
   - Percentage complete, amount saved, time remaining
   - Projected completion dates
   - "On track" or "Behind schedule" indicators

5. **Basic Spending Insights**
   - Monthly spending by category
   - Top 5 spending categories
   - Recurring subscriptions identification
   - Potential savings opportunities

### Post-MVP Features (Phase 2+)

#### Phase 2 (Months 4-6):
- Mobile app (React Native for iOS/Android)
- Shared family goals (multi-user contributions)
- Investment account integration
- Advanced AI spending insights
- Milestone push notifications

#### Phase 3 (Months 7-12):
- Gamification system (badges, levels, streaks)
- Custom automation rules (round-up purchases, save extra on payday)
- Debt payoff integration
- Financial coaching content

---

## Tech Stack

- **Frontend**: Next.js 15 (React), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with NestJS, RESTful API, Prisma ORM
- **Database**: PostgreSQL 16
- **Bank Integration**: Plaid API (Link SDK, Transactions API, Auth API)
- **Infrastructure**: Docker, DigitalOcean (MVP), GitHub Actions CI/CD
- **Monitoring**: Sentry (errors), Winston (logging), UptimeRobot (uptime)

---

## Project Status

- **Current Phase**: Planning - Ready for Expert Review
- **Last Updated**: 2026-01-21
- **Priority**: High
- **Target Launch**: April 15, 2026 (Week 13)

---

## Business Value

### Value Proposition

- **Saves Money**: Users save $300+/month through automated savings and spending insights
- **Saves Time**: 5+ hours/month saved vs manual savings tracking
- **Increases Success**: 60% of users reach at least one goal within 6 months
- **Builds Habits**: Learn financial literacy through AI-powered insights

### Revenue Model

**Freemium SaaS**:
- **Free Tier**: 1 active goal, basic automation, basic insights, web dashboard
- **Premium Tier**: $9.99/month or $99/year - Unlimited goals, advanced insights, mobile app, family goals

**Revenue Projections**:
- Year 1: $100K ARR (10,000 users, 12% conversion)
- Year 2: $900K ARR (50,000 users, 15% conversion)
- Year 3: $3.2M ARR (150,000 users, 18% conversion)

---

## Target Metrics

### MVP Success Criteria

- **User Adoption**: 1,000 users within first month
- **Engagement**: 60% weekly active users
- **Automation**: 70% of users enable automated savings
- **Goal Creation**: 2.5 average goals per user
- **Savings Impact**: $250/month average savings per user
- **Technical**: 99.5% uptime, <3% error rate

### Long-term Goals

- **6-Month Retention**: 65%
- **Free-to-Premium Conversion**: 12%
- **Goal Achievement Rate**: 60% reach at least one goal in 6 months
- **NPS Score**: 50+ (industry average: 30-40)

---

## Timeline

### MVP Development (Weeks 1-12)
- **Weeks 1-2**: Plaid integration, bank connection
- **Weeks 3-4**: Goal creation, management, database
- **Weeks 5-7**: Automated savings engine
- **Weeks 8-9**: Progress dashboard, spending insights
- **Week 10**: Polish, bug fixes, security audit
- **Weeks 11-12**: Testing, beta with 50 users
- **Week 13**: Launch (April 15, 2026)

### Post-MVP (Months 4-12)
- **Months 4-6**: Mobile app, shared goals, investment integration
- **Months 7-12**: Gamification, custom rules, debt payoff, financial coaching

---

## Expert Team (Needed)

This project requires reviews and contributions from the following experts:

### Core Team (Always Involved)
- **Patricia Martinez** (Product Manager) - MVP definition, prioritization, business model
- **Dorothy Clark** (Documentation) - PRD structure, clarity, completeness

### Technical Team
- **Marcus Johnson** (Architecture) - System architecture, scalability planning
- **Samuel Rodriguez** (Backend) - NestJS API, Plaid integration, automated savings engine
- **Thomas Anderson** (Frontend) - Next.js dashboard, state management, UI
- **Benjamin Lee** (Database) - PostgreSQL schema, query optimization, indexing
- **Emily Chen** (API Design) - RESTful API patterns, endpoint design

### Specialized Team
- **Ryan Kim** (Security) - JWT authentication, data encryption, compliance (GDPR/CCPA)
- **Daisy Thompson** (UI/UX) - User flows, dashboard design, goal creation UX
- **Allison Foster** (Accessibility) - WCAG compliance, keyboard navigation
- **Michael Brown** (Mobile) - React Native app (Phase 2), push notifications
- **James Martinez** (Performance) - Dashboard optimization, caching strategies
- **David Cooper** (DevOps) - CI/CD pipeline, Docker, infrastructure
- **Kevin Martinez** (Observability) - Logging, monitoring, error tracking
- **Gary Wilson** (Business Intelligence) - Spending insights, analytics architecture
- **Constance White** (Compliance) - Financial regulations, consumer protection, ACH compliance
- **Olivia Martinez** (Copywriter) - App naming, UI copy, value proposition messaging

---

## Quick Links

- [PRD Overview](PRD_OVERVIEW.md) - Complete product requirements
- [MVP Definition](PRD_OVERVIEW.md#mvp-minimum-viable-product-definition) - MVP features and scope
- [Architecture](ARCHITECTURE.md) - Technical design (to be created)
- [Expert Contributions](EXPERTS.md) - Expert sign-offs (to be created)
- [Projects List Entry](../../reference/PROJECTS_LIST.md) - Project summary in main list

---

## Related Projects

**Similar/Complementary Projects**:
- [Personal Budget Manager](../personal-budget-manager/) - Budget tracking (different focus: budgets vs goals)
- [Subscription Bill Manager](../subscription-bill-manager/) - Recurring expense tracking
- [Energy Usage Tracker](../energy-usage-tracker/) - Utility cost tracking and savings

**Key Differentiation**: Financial Goal Saver is goal-centric (saving FOR something) rather than budget-centric (managing spending) or expense-centric (tracking bills). The automated savings engine and goal progress tracking are unique features.

---

**Last Updated**: 2026-01-21  
**Status**: Planning - Ready for Expert Review
