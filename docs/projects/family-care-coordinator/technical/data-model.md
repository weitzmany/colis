# Technical: Data Model

## Overview
The data model is centered around families, dependents, and caregivers. Each feature links back to a family and dependent where relevant.

## Core Tables
- `families`: household account and settings
- `family_members`: user membership and role
- `dependents`: profiles for children or elders
- `calendar_events`: scheduled care events
- `tasks`: tasks and checklists
- `medications`: medication schedule definitions
- `medication_logs`: recorded dose events
- `routine_logs`: daily care logs
- `documents`: document metadata and storage keys
- `notification_preferences`: user notification settings
- `audit_logs`: sensitive action tracking

## Key Relationships
- `families` to `family_members` (one-to-many)
- `families` to `dependents` (one-to-many)
- `dependents` to `tasks`, `calendar_events`, `medications`, `documents` (one-to-many)

## Data Retention
- Audit logs retained for 2 years
- Document metadata retained until deletion by admin
