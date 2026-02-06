# Feature: Tasks and Responsibilities

## Overview
Task assignment with due dates, checklists, and completion tracking for daily care responsibilities.

## User Stories
- As a caregiver, I want assigned tasks so I know what to complete today.
- As a family organizer, I want to track task completion to ensure coverage.

## Requirements
### Functional Requirements
- Assign tasks to caregivers and dependents
- Due dates, reminders, and recurring tasks
- Task checklists with completion timestamps

### Non-Functional Requirements
- Role-based permissions for editing and assignment
- Mobile-first task entry flow

## User Interface
- Task list by day and by assignee
- Quick complete and add note flow

## API Specification
- `GET /families/{familyId}/tasks`
- `POST /families/{familyId}/tasks`
- `PATCH /families/{familyId}/tasks/{taskId}`
- `POST /families/{familyId}/tasks/{taskId}/complete`

## Database Schema
- `tasks` and `task_assignments` tables with status and audit metadata

## Testing Strategy
- Permission tests by role
- Notification tests for reminders

## Success Metrics
- Task completion rate by week
- Percentage of tasks completed on time
