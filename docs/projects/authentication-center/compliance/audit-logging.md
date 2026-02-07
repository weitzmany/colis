# Authentication Center - Audit Logging

## Purpose

Provide a compliance-ready record of security-sensitive events for incident response and legal requirements.

## Events to Log

- User registration and login
- Failed login attempts
- Password reset requests
- Role changes
- User disable/enable events

## Log Fields

- Timestamp
- Actor (user/admin ID)
- Action type
- Target entity
- IP address
- User agent
- Result (success/failure)

## Retention

- MVP: 30-day log retention
- Post-MVP: 1-year retention for compliance

## Access Controls

- Logs accessible only to admin roles
- Separate storage from primary DB
- Immutable append-only logs
