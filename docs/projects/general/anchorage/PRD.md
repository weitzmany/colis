# General Feature: Anchorage System

**Formerly**: authentication

## Overview

A centralized anchorage system providing user registration, login, session management, and basic RBAC for all applications in the ecosystem.

## Usage Tracking

- **Minimum Projects**: 3 (threshold met)
- **Migrated to General**: 2026-01-25
- **Current Project Count**: 8+

## Generality Assessment

### Classification

- **General Feature Type**: Architectural Override

### Architectural Override Justification

- **Central Deployment**: Shared anchorage service used by all apps
- **Security Critical**: Anchorage vulnerabilities impact all projects
- **Compliance Required**: GDPR/CCPA consistency needed across apps
- **Single Source of Truth**: Centralized user identities and sessions
- **Synchronized Updates**: Security patches must deploy once

## Projects Using This Feature

- [Anchorage Center](../../anchorage-center/INDEX.md) - Reference implementation
- [Chore Allowance Manager](../../chore-allowance-manager/INDEX.md)
- [Vehicle Maintenance Tracker](../../vehicle-maintenance-tracker/INDEX.md)
- [Learning Games Platform](../../learning-games-platform/INDEX.md)
- [Home Maintenance Tracker](../../home-maintenance-tracker/INDEX.md)
- [Financial Goal Saver](../../financial-goal-saver/INDEX.md)
- [Habit Tracker](../../habit-tracker/INDEX.md)
- [Energy Usage Tracker](../../energy-usage-tracker/INDEX.md)
- [Meal Planner Grocery](../../meal-planner-grocery/INDEX.md)

## Requirements

### Functional Requirements

- User registration and login
- Session management with refresh tokens
- Role-based access control (Admin/User)
- Password reset and email verification
- Admin user management interface

### Non-Functional Requirements

- 99.9% uptime
- <100ms average API response time
- Encryption at rest and in transit
- Rate limiting and lockout policies

## Project-Specific Customization

- Token expiry configuration
- Allowed origins and CORS policy
- Role mapping and permissions
- Branding for email templates

## Integration Guidelines

See [Anchorage Center Integration Guide](../../anchorage-center/technical/integration-guide.md).

## Implementation Status

- **Planning**: 2026-01-25
- **Implementation**: Pending
- **Available for use**: TBD
