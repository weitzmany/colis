# Subscription & Bills Manager - PRD

**Status**: Planning / Proposal  
**Last Updated**: 2026-01-05

## Project Name

**Subscription & Bills Manager** or **BillGuard**

## Project Type

Full-Stack Web & Mobile Application (Customer-Facing)

## Main Idea

A customer-facing application that helps users discover, track, and optimize recurring expenses (subscriptions, utilities, phone, insurance, memberships). Users can detect hidden subscriptions, manage renewal dates, get price‑increase alerts, negotiate bills, and reduce monthly expenses. This provides immediate financial value to customers and complements the Budget Manager.

## Target Audience

- Anyone paying recurring bills/subscriptions
- Families managing household expenses
- People who want to reduce monthly costs
- Users with multiple streaming/services memberships
- Budget-conscious consumers

## Technology Stack

**Frontend:**
- Next.js (React) with TypeScript
- Responsive design (mobile-first)
- Data visualization (Chart.js, Recharts)

**Backend:**
- Node.js with Express or NestJS
- Database: PostgreSQL or MySQL
- Secure integrations for transaction parsing (future)

**Mobile:**
- React Native (iOS & Android)
- Push notifications for renewals
- Offline support for bill lists

**Infrastructure:**
- Docker containerization
- CI/CD integration

## Core Features

### 1. Subscription Discovery
- **Manual Add**: Add subscriptions manually
- **Email Scan (Optional)**: Parse receipt emails to detect subscriptions
- **Transaction Import (Future)**: Import bank/credit card transactions
- **Hidden Subscriptions**: Detect rarely used subscriptions
- **Trial Tracking**: Track free trials before they convert to paid

### 2. Bill & Subscription Tracking
- **Renewal Dates**: Track renewal/cycle dates
- **Price Changes**: Detect and alert on price increases
- **Billing Frequency**: Monthly, yearly, weekly, custom
- **Category Organization**: Streaming, utilities, insurance, etc.
- **Payment Method Tracking**: Track payment method per bill

### 3. Alerts & Reminders
- **Renewal Alerts**: Remind before renewals
- **Trial Ending Alerts**: Alert before trials convert
- **Price Increase Alerts**: Notify about increases
- **Overdue Alerts**: Remind about overdue bills
- **Budget Threshold Alerts**: Warn when recurring costs exceed budget

### 4. Cancellation & Negotiation Assistant
- **Cancellation Guidance**: Step-by-step cancellation instructions
- **Contact Info Library**: Support numbers/emails
- **Negotiation Scripts**: Scripts for lowering bills
- **Savings Calculator**: Show potential savings
- **Cancellation Confirmation**: Track cancellation status

### 5. Reports & Analytics
- **Recurring Spend Overview**: Monthly recurring spend
- **Category Breakdown**: Spend by category
- **Yearly Cost Projection**: Annualized cost estimate
- **Savings Impact**: Track savings from cancellations
- **Price Trend Analysis**: Track price changes over time

### 6. Shared Household Accounts
- **Family Sharing**: Share subscriptions among family
- **Shared Bills**: Split bills and track responsibilities
- **Access Permissions**: Control who can edit/see
- **Household Budget**: Track household recurring costs

### 7. Payment Safety & Security
- **Secure Storage**: Encrypt sensitive data
- **Privacy Controls**: Control data sharing
- **Audit Logs**: Track subscription changes
- **Two‑Factor Auth**: Optional 2FA

## User Experience

### Dashboard
- **Total Monthly Spend**: Current recurring spend
- **Upcoming Renewals**: Next 30 days
- **Trial Conversions**: Trials ending soon
- **Savings Opportunities**: Suggestions to cancel/negotiate

### Subscription Detail
- **Billing History**: Past charges
- **Price Change Log**: Increases over time
- **Cancellation Steps**: Direct links/instructions
- **Contact Support**: One‑tap call/email

### Alerts Center
- **All Alerts**: Renewals, trials, price changes
- **Action Buttons**: Cancel, remind later, view details

## Mobile App Features

### Core Mobile Features
- **Push Notifications**: Renewal and trial alerts
- **Quick Add**: Add subscription in seconds
- **Offline Access**: View list without internet
- **Widgets**: Home screen widgets for upcoming bills

## Business Model

### Free Tier
- Track up to 10 subscriptions
- Basic alerts
- Limited analytics

### Premium Tier ($X/month)
- Unlimited subscriptions
- Price‑increase alerts
- Advanced analytics
- Cancellation assistance
- Household sharing
- Priority support

## Success Metrics

### User Engagement
- **Monthly Active Users**: Target 50%+
- **Subscriptions Tracked**: Average 8+ per user
- **Alert Action Rate**: Users act on alerts

### Value Metrics
- **Savings per User**: Monthly savings from cancellations
- **Price‑Increase Avoidance**: Users avoid higher bills
- **Trial Conversion Avoidance**: Users cancel trials on time

## Development Phases

### Phase 1: MVP
- Manual subscription tracking
- Renewal reminders
- Basic dashboard

### Phase 2: Core Features
- Price change alerts
- Reports & analytics
- Mobile app

### Phase 3: Advanced Features
- Trial tracking
- Cancellation assistance
- Household sharing

### Phase 4: Premium Features
- Email scanning
- Transaction import
- Negotiation assistance

## Benefits

### For Customers
- **Save Money**: Reduce monthly spend
- **Avoid Surprises**: Prevent unexpected renewals
- **Stay Organized**: Centralize bills and subscriptions
- **Better Decisions**: See true recurring costs

### Business Value
- **High Demand**: Everyone has subscriptions
- **Recurring Revenue**: Subscription‑based model
- **Immediate Value**: Savings are tangible
- **Complementary**: Aligns with Budget Manager

## Notes

- **Customer‑Facing**: Built for end users, not developers
- **High Value**: Direct, measurable savings for customers
- **Complementary**: Works with Budget Manager and Track Deliveries
- **Privacy‑Critical**: Must securely handle sensitive financial data

---

**This Subscription & Bills Manager is a high‑value customer project that helps users reduce recurring expenses and avoid surprise renewals, delivering immediate financial benefits.**

---

## Review/Contribution

_This PRD will be reviewed and refined before implementation._
