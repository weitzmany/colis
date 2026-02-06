# Feature: Profiles and Permissions

## Overview
Dependent profiles and role-based access for caregivers, family members, and emergency contacts.

## User Stories
- As a family organizer, I want to control who can edit care information.
- As an emergency contact, I want access to critical details without seeing private notes.

## Requirements
### Functional Requirements
- Create dependent profiles with key care details
- Roles: viewer, caregiver, admin
- Permission matrix for documents, tasks, and routines

### Non-Functional Requirements
- Least-privilege default access
- Audit log for role changes

## User Interface
- Role assignment modal with permissions summary
- Profile detail pages with segmented sections

## API Specification
- `GET /families/{familyId}/members`
- `POST /families/{familyId}/members`
- `PATCH /families/{familyId}/members/{memberId}/role`

## Database Schema
- `family_members`, `roles`, and `role_permissions` tables

## Testing Strategy
- RBAC enforcement tests per role
- Audit log validation for role changes

## Success Metrics
- Percentage of families with 2+ caregivers assigned
- Time to add a new caregiver
