# Feature: Low Stock Alerts

## Overview
Track consumable household items and notify users when items are running low.

## User Stories
- As a user, I want to flag consumables so that I can restock on time.
- As a user, I want low stock alerts so that I do not run out of essentials.

## Requirements
### Functional Requirements
- Mark items as consumable with threshold levels
- Generate low stock list
- Optional shopping list export

### Non-Functional Requirements
- Alerts delivered within 24 hours of threshold
- Notifications respect user preferences

## User Interface
- Consumable toggle in item detail
- Low stock list with restock actions

## API Specification
- `GET /items?lowStock=true`
- `PATCH /items/:id` (consumable settings)

## Database Schema
- `items.is_consumable`, `items.stock_level`, `items.reorder_level`

## Testing Strategy
- Unit tests for threshold logic
- Integration tests for low stock queries

## Success Metrics
- 20% of active users enable low stock tracking
