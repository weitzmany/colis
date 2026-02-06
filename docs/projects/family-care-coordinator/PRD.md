# Family Care Coordinator - PRD (Legacy)

**Note**: This original PRD has been superseded by [PRD_OVERVIEW.md](PRD_OVERVIEW.md). It is kept for historical context.

**Status**: Planning / Proposal  
**Last Updated**: 2026-01-05

## Project Name

**Family Care Coordinator** or **CareLink**

## Project Type

Full-Stack Web & Mobile Application (Customer-Facing)

## Main Idea

A customer-facing app that helps families coordinate care responsibilities, schedules, and critical information across parents, caregivers, and relatives. Users can manage shared calendars, tasks, medications, and emergency info with role-based access.

## Target Audience

- Families coordinating childcare or elder care
- Caregivers managing schedules and tasks
- Households sharing responsibilities
- Individuals coordinating care for multiple people

## Technology Stack

**Frontend:**
- Next.js (React) with TypeScript
- Responsive design (mobile-first)

**Backend:**
- Node.js with Express or NestJS
- Database: PostgreSQL or MySQL
- Secure file storage for documents

**Mobile:**
- React Native (iOS & Android)
- Push notifications

**Infrastructure:**
- Docker containerization
- CI/CD integration

## Core Features

### 1. Shared Care Calendar
- Shared schedules for appointments and tasks
- Recurring events and reminders
- Availability coordination

### 2. Task & Responsibility Tracking
- Assign tasks to caregivers
- Due dates and completion tracking
- Weekly care checklists

### 3. Medication & Routine Tracking
- Medication schedules and reminders
- Routine logs (meals, activities, etc.)
- Notes and handoff updates

### 4. Profiles & Permissions
- Profiles for family members or dependents
- Role-based access (viewer, editor, admin)
- Emergency contact info

### 5. Document Vault
- Store care plans, medical notes, and ID docs
- Secure sharing with caregivers
- Expiring access links

### 6. Alerts & Notifications
- Task reminders
- Missed task alerts
- Schedule changes

## Mobile App Features

### Core Mobile Features
- Quick task updates
- Push notifications
- Offline access to schedules

## Business Model

### Free Tier
- 1 dependent profile
- Basic scheduling and tasks
- Limited document storage

### Premium Tier ($X/month)
- Multiple profiles
- Advanced reminders
- Unlimited storage
- Care team roles

## Success Metrics

- Monthly active families
- Task completion rate
- Reminder engagement rate
- 3‑month retention rate

## Development Phases

### Phase 1: MVP
- Shared calendar
- Task assignments
- Basic profiles

### Phase 2: Core Features
- Medication tracking
- Document vault
- Mobile app

### Phase 3: Advanced Features
- Role-based permissions
- Reporting and exports
- Care analytics

## Notes

- **Customer-Facing**: Built for families and caregivers
- **High Value**: Reduces missed tasks and improves care coordination
- **Privacy-Critical**: Requires strong access controls

---

**Family Care Coordinator makes caregiving collaboration simple, organized, and reliable.**

---

## Review/Contribution

_This PRD will be reviewed and refined before implementation._
