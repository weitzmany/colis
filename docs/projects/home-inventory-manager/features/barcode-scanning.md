# Feature: Barcode Scanning

## Overview
Provide fast item capture through barcode scanning on mobile devices, with optional product lookup to prefill details.

## User Stories
- As a user, I want to scan a barcode to add an item faster.
- As a user, I want to edit the scanned result so that it matches my item.

## Requirements
### Functional Requirements
- Scan common UPC/EAN barcodes
- Prefill item name and brand when lookup succeeds
- Allow manual override if lookup fails

### Non-Functional Requirements
- Scan success rate above 90% in normal lighting
- Offline capture with deferred lookup

## User Interface
- Camera scanner view with torch toggle
- Quick add flow with editable fields

## API Specification
- `POST /barcodes/lookup`
- `POST /items` (with barcode payload)

## Database Schema
- `items.barcode` field
- `barcode_cache` table for lookup results (Phase 2)

## Testing Strategy
- Unit tests for lookup normalization
- Integration tests for scanner-to-item flow
- Device tests on iOS and Android

## Success Metrics
- 40% of items created via barcode scan
