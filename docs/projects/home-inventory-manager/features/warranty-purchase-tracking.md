# Feature: Warranty and Purchase Tracking

## Overview
Track purchase details and warranty dates so users can manage coverage and plan replacements.

## User Stories
- As a user, I want to store warranty dates so that I can track coverage.
- As a user, I want to see purchase history so that I can validate item value.

## Requirements
### Functional Requirements
- Store purchase date, price, store, and receipt
- Store warranty start/end dates
- Display warranty status in item detail

### Non-Functional Requirements
- Date calculations must be timezone safe
- Warranty data must be exportable in reports

## User Interface
- Warranty section on item detail
- Purchase history summary

## API Specification
- `PATCH /items/:id` (purchase + warranty fields)
- `GET /items/:id/warranty`

## Database Schema
- `items.purchase_date`, `items.purchase_price`, `items.purchase_store`
- `warranties` table linked to items

## Testing Strategy
- Unit tests for warranty status calculations
- Integration tests for receipt upload associations

## Success Metrics
- 50% of premium users add warranty data for high-value items
