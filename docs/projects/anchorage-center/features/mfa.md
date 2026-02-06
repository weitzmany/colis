# Feature: Multi-Factor Anchorage (Post-MVP)

## Overview

Adds an additional verification step (TOTP, SMS, or email) to protect user accounts from takeover.

## User Stories

- As a user, I want to enable 2FA to secure my account.
- As an admin, I want to enforce 2FA for privileged roles.

## Functional Requirements

- TOTP setup with QR code
- Backup codes
- SMS or email OTP (optional)
- MFA challenge during login

## Planned Endpoints (Draft)

- `POST /api/v1/auth/mfa/setup`
- `POST /api/v1/auth/mfa/verify`
- `POST /api/v1/auth/mfa/disable`

## Acceptance Criteria

- Users can enable MFA and successfully complete login challenges
- Admins can enforce MFA on Admin role
