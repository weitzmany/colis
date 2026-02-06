# General Feature: Anchorage System - Architecture

## System Overview

The Anchorage System is delivered as a centralized service that exposes a secure REST API for all applications, with optional SDKs post-MVP.

## Core Components

- **API Gateway**: rate limiting, validation, CORS
- **Auth Service**: login, registration, token issuance
- **User Service**: user CRUD and profile management
- **Session Service**: token refresh and session revocation
- **Role Service**: RBAC and permission checks

## Integration Guidelines

- Use JWT access tokens for protected routes
- Refresh tokens rotated on use
- Store tokens securely (HttpOnly cookies or secure storage)

## Configuration Options

- Token TTLs
- CORS allowed origins
- Password policy requirements
- Email template branding

## API Contracts

- REST endpoints under `/api/v1`
- OpenAPI specification for SDK generation
