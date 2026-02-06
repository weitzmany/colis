# Feature: Carrier Integrations

## Overview
Carrier integrations retrieve tracking status updates using carrier APIs and normalize them into a unified status model.

## MVP Scope
- USPS, UPS, FedEx, DHL, Amazon Logistics
- Polling every 2-4 hours
- Manual refresh per package

## User Stories
- As a user, I want status updates to stay current without manual checking.
- As a user, I want consistent status labels regardless of carrier.

## Functional Requirements
1. **Carrier Detection**
   - Regex-based detection (see tracking management).

2. **Polling Strategy**
   - Scheduled polling every 2-4 hours.
   - Only active (non-delivered) packages are polled.
   - Manual refresh endpoint for immediate status.

3. **Status Normalization**
   - Map carrier-specific statuses to: pre_transit, in_transit, out_for_delivery, delivered, exception.

4. **Caching**
   - Cache carrier API responses for 15 minutes.

5. **Error Handling**
   - Retry with exponential backoff on transient errors.
   - Flag failed integrations and alert observability channel.

## Acceptance Criteria
- Status updates are stored with timestamps.
- Rate limits are respected and logged.
- Manual refresh updates status within 30 seconds under normal conditions.

## Future Enhancements
- Webhook integrations where available
- Retailer auto-import (Phase 3)

## Dependencies
- Background job queue (see [Backend Architecture](../technical/backend-architecture.md)).
- Carrier credentials and endpoints (see [Third-Party Integrations](../technical/third-party-integrations.md)).
