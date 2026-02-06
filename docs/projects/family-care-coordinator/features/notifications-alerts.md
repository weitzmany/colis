# Feature: Notifications and Alerts

## Overview
Task reminders, schedule updates, and missed task alerts across email and push channels.

## User Stories
- As a caregiver, I want reminders so I do not miss care tasks.
- As a family organizer, I want alerts when tasks are overdue.

## Requirements
### Functional Requirements
- Reminders for tasks and medications
- Schedule change alerts
- Notification preferences per user

### Non-Functional Requirements
- Reliable delivery within 60 seconds of trigger
- Opt-out controls for non-critical alerts

## User Interface
- Notification preferences page
- In-app activity feed

## API Specification
- `GET /users/{userId}/notification-preferences`
- `PATCH /users/{userId}/notification-preferences`
- `POST /notifications/test`

## Database Schema
- `notification_preferences` table
- `notification_events` log table

## Testing Strategy
- Reminder scheduling tests
- Preference enforcement tests

## Success Metrics
- Reminder engagement rate
- Reduction in overdue tasks
