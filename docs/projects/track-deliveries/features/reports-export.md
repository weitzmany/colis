# Feature: Reports and Export

## Overview
Reports provide delivery history summaries and enable export for power users.

## Phase 3 Scope
- Delivery history report (PDF/CSV)
- Carrier performance summary
- Monthly delivery totals

## User Stories
- As a user, I want a delivery summary so I can review my history.
- As a user, I want to export my tracking history for my records.

## Functional Requirements
1. **Export Formats**
   - CSV and PDF export.
   - Include tracking number, carrier, status history, delivery date.

2. **Reports**
   - Monthly delivery summary.
   - On-time vs delayed stats by carrier.

## Acceptance Criteria
- Export completes in < 30 seconds for typical usage.
- Reports match data in timeline and status history.

## Dependencies
- Aggregation queries (see [Database Schema](../technical/database-schema.md)).
- PDF generation service (to be selected in Phase 3).
