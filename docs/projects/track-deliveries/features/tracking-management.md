# Feature: Tracking Management

## Overview
Tracking Management enables users to add packages, auto-detect carriers, and store package context (notes, retailer hints) to drive the unified timeline.

## MVP Scope
- Manual tracking number entry
- Auto-detect carrier (regex-based)
- Optional package notes
- Fallback manual carrier selection

## User Stories
- As a user, I want to add tracking numbers so I can track packages in one place.
- As a user, I want the system to detect the carrier so I do not have to select it manually.
- As a user, I want to add a note so I can remember what the package is.

## Functional Requirements
1. **Manual Entry**
   - Accept alphanumeric tracking numbers (8-30 characters).
   - Validate format client-side and server-side.
   - Confirm successful add.

2. **Auto-Detect Carrier**
   - Support USPS, UPS, FedEx, DHL, Amazon Logistics.
   - Provide a manual fallback when detection fails.
   - Display carrier logo and name in package list.

3. **Package Notes**
   - Optional note field (up to 140 characters).
   - Visible in package detail and timeline cards.

## Acceptance Criteria
- Tracking numbers are validated and saved with carrier detection.
- Invalid formats return a clear error message.
- Carrier fallback selection is available if detection fails.
- Notes are saved and displayed on the package card.

## Data Model Fields
- `tracking_number` (string)
- `carrier` (string)
- `status` (enum)
- `estimated_delivery` (date)
- `note` (string, optional)

## API Endpoints
- `POST /api/v1/packages` - Create package
- `GET /api/v1/packages` - List packages

## Non-Functional Requirements
- Add package flow completes in < 5 seconds.
- Input validation errors are accessible and screen-reader friendly.

## Dependencies
- Carrier detection logic (see [Carrier Integrations](carrier-integrations.md)).
- Authentication and authorization (see [Security](../technical/security.md)).
