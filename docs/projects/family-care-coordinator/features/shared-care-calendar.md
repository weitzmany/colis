# Feature: Shared Care Calendar

## Overview
A shared calendar for appointments, routines, and coverage schedules with recurring events and availability coordination.

## User Stories
- As a family organizer, I want a shared calendar so everyone sees care commitments.
- As a caregiver, I want reminders before appointments so I can prepare.

## Requirements
### Functional Requirements
- Create, edit, and delete events with recurrence
- Assign events to dependents and caregivers
- View availability by caregiver

### Non-Functional Requirements
- Sync updates within 5 seconds
- Accessible calendar views with keyboard navigation

## User Interface
- Month, week, and agenda views
- Event detail drawer with reminders and assignees

## API Specification
- `GET /calendars/{familyId}/events`
- `POST /calendars/{familyId}/events`
- `PATCH /calendars/{familyId}/events/{eventId}`
- `DELETE /calendars/{familyId}/events/{eventId}`

## Database Schema
- `calendar_events` table with recurrence rules, time zones, and participants

## Testing Strategy
- Unit tests for recurrence rules
- Integration tests for event permissions
- UI tests for view switching

## Success Metrics
- Weekly calendar active users
- Percentage of events with reminders enabled
