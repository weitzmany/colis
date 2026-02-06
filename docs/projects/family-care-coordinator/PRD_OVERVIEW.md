# Family Care Coordinator - Product Requirements Document

## Executive Summary
Family Care Coordinator helps families coordinate care responsibilities, schedules, and critical information across parents, caregivers, and relatives. The platform provides shared calendars, task assignments, medication routines, and secure document access with role-based permissions and alerts.

## Problem Statement
Families coordinating childcare or elder care struggle to keep schedules, responsibilities, and critical information aligned across multiple caregivers. Missed tasks, incomplete handoffs, and inaccessible emergency information create stress and safety risks.

## Solution Overview
Provide a shared care workspace with a unified calendar, task tracking, medication routines, secure document vault, and role-based access. The system sends timely reminders, supports mobile-first updates, and keeps a reliable audit trail of care activity.

## Target Users
- Parents coordinating childcare or elder care
- Primary caregivers managing daily routines
- Extended family members supporting care responsibilities
- Professional caregivers granted limited access

## User Personas
1. **Primary Organizer**: Manages schedules, assigns tasks, oversees care plan
2. **Caregiver**: Executes tasks, logs routines, needs mobile reminders
3. **Family Supporter**: Reviews updates, steps in during coverage gaps
4. **Emergency Contact**: Needs fast access to critical info and documents

## MVP (Minimum Viable Product) Definition

### Core Problem
Care teams cannot reliably share schedules, responsibilities, and critical information, leading to missed care tasks and poor handoffs.

### Core User
Primary family organizer coordinating care across 2-5 caregivers.

### Core Value Proposition
Coordinate care in one shared workspace so every caregiver knows what to do and when to do it.

### MVP Features (Must-Have Only)
1. **Shared Care Calendar**: Shared schedules with appointments, recurring events, and availability
   - Why in MVP: Core coordination surface for all caregivers
   - User story: As a family organizer, I want a shared calendar so everyone sees care commitments
2. **Task Assignments**: Assign tasks with due dates, checklists, and completion status
   - Why in MVP: Reduces missed tasks and clarifies ownership
   - User story: As a caregiver, I want assigned tasks so I know what to complete today
3. **Dependent Profiles**: Profiles with routines, preferences, and emergency contacts
   - Why in MVP: Centralizes critical care information
   - User story: As a caregiver, I want quick access to care details so I can act confidently
4. **Medication and Routine Tracking**: Schedule meds and log routines with reminders
   - Why in MVP: High-risk tasks require clear tracking
   - User story: As a caregiver, I want medication reminders so doses are not missed
5. **Notifications and Alerts**: Task reminders and schedule change alerts
   - Why in MVP: Keeps the team aligned in real time
   - User story: As a family supporter, I want alerts so I can respond to changes quickly

### MVP Success Criteria
- User Adoption: 150 active families within 60 days of MVP launch
- User Engagement: 50 percent of active families complete 5+ tasks per week
- Core Functionality: 90 percent of care tasks marked complete by due date
- Technical Stability: 99 percent uptime and zero P1 security incidents

### MVP Timeline
- Development: 10 weeks
- Testing: 2 weeks
- Launch: Target in Q2 2026

### MVP Tech Stack
- Frontend: Angular + TypeScript
- Backend: PHP (Slim framework) REST API
- Database: MySQL (via Docker)
- Mobile: Capacitor (iOS and Android)
- Storage: S3-compatible object storage for documents

### What's NOT in MVP (Future Features)
- Advanced analytics and reporting
- Care team chat and live collaboration
- External calendar integrations (Google, Outlook)
- Automated document OCR and extraction
- Multi-family management and agency accounts

## Post-MVP Features (Phase 2+)
- Document vault with expiring access links and granular sharing
- Role-based permissions with custom roles
- Care analytics dashboards and exports
- Offline-first mobile workflows
- Integrations for calendar sync and EHR exports

## Technical Requirements (High-Level)
- Secure authentication with role-based access control
- Audit trail for task completion and document access
- Notification delivery via email and push
- Encryption in transit and at rest for sensitive data

## Business Requirements (High-Level)
- Freemium tier with single dependent profile
- Premium tier with multiple profiles and unlimited storage
- Clear upgrade path inside the product

## Timeline and Milestones
- Phase 1 (MVP): Calendar, tasks, profiles, routines, notifications
- Phase 2 (Core): Document vault, role permissions, mobile improvements
- Phase 3 (Advanced): Analytics, integrations, automation

## Success Criteria
- Monthly active families
- Task completion rate
- Reminder engagement rate
- 3-month retention rate

## Risks and Mitigations
- **Privacy/Compliance Risk**: Encrypt documents, least-privilege access, regular audits
- **Adoption Risk**: Fast onboarding, clear caregiver roles, strong reminders
- **Data Quality Risk**: Mandatory fields for critical routines and contacts
- **Notification Fatigue**: Configurable preferences and digest options

## Decision Notes
- **Tech stack alignment**: The earlier PRD proposed Next.js and Node.js. This plan aligns to the existing PHP + Angular + Capacitor stack used across related projects and listed in the project inventory for easier reuse and maintenance.

## Source Notes (Preserved from Original PRD)
- The original PRD listed: Shared care calendar, task tracking, medication routines, profiles and permissions, document vault, alerts and notifications.
- Business model included free and premium tiers with limited profiles and storage on free tier.
- Success metrics included monthly active families, task completion rate, reminder engagement rate, and 3-month retention rate.
