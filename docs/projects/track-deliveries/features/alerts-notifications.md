# Feature: Alerts and Notifications

## Overview
Email alerts notify users when package statuses change, with preferences to opt in/out of specific alerts.

## MVP Scope
- Email alerts for out-for-delivery and delivered
- Notification preferences in settings
- Delivery delay notification template (optional)

## User Stories
- As a user, I want email alerts for delivery milestones so I do not miss a package.
- As a user, I want to control which alerts I receive.

## Functional Requirements
1. **Status-Based Alerts**
   - Trigger emails on status change to out-for-delivery and delivered.
   - Optional delay alert when estimated delivery changes.

2. **Preferences**
   - Toggle email alerts on/off.
   - Persist preferences per user.

3. **Templates**
   - Mobile-friendly HTML + plain text fallback.
   - Include carrier, tracking number, delivery estimate.

## Acceptance Criteria
- Alerts are sent only when user preferences allow.
- Users can disable alerts and no email is sent thereafter.
- Templates render correctly on mobile devices.

## Job Triggers
- Notification job enqueued after status update job detects a change.

## Future Enhancements (Post-MVP)
- Push notifications (Phase 2)
- SMS alerts (Phase 3)

## Dependencies
- Email provider setup (see [Third-Party Integrations](../technical/third-party-integrations.md)).
- Notification preferences table (see [Database Schema](../technical/database-schema.md)).
