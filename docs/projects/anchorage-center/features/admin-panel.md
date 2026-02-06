# Feature: Admin Panel

## Overview

A web interface for administrators to manage users, roles, and sessions without direct database access.

## User Stories

- As an admin, I want to search users and reset accounts quickly.
- As a support team, I want visibility into recent login activity.

## Functional Requirements

- User list with pagination
- Search by email
- View user details and roles
- Disable/enable accounts
- View recent login activity

## Tech Stack

- React 18 + TypeScript
- Vite build
- Tailwind CSS UI
- React Query for API calls

## Acceptance Criteria

- Admins can manage users through UI
- UI uses the same auth system (dogfooding)
