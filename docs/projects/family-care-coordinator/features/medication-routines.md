# Feature: Medication and Routine Tracking

## Overview
Medication schedules with reminders and routine logs for meals, activities, and care check-ins.

## User Stories
- As a caregiver, I want medication reminders so doses are not missed.
- As a family organizer, I want to see routine logs to confirm care happened.

## Requirements
### Functional Requirements
- Medication schedules with dose, time, and instructions
- Routine log entries with notes and timestamps
- Missed dose alerts for overdue meds

### Non-Functional Requirements
- High reliability for reminder delivery
- Audit log for medication actions

## User Interface
- Daily medication checklist
- Routine log timeline for each dependent

## API Specification
- `GET /dependents/{dependentId}/medications`
- `POST /dependents/{dependentId}/medications`
- `POST /medications/{medicationId}/log`
- `GET /dependents/{dependentId}/routines`

## Database Schema
- `medications`, `medication_logs`, and `routine_logs` tables

## Testing Strategy
- Reminder scheduling tests
- Access control tests for sensitive routines

## Success Metrics
- Medication adherence rate
- Routine log completion rate
