# Feature: Room Organization

## Overview
Allow users to group items by room and view room-based summaries to reflect real household organization.

## User Stories
- As a user, I want to assign items to rooms so that I can find them quickly.
- As a user, I want to see a room summary so that I can understand where value is concentrated.

## Requirements
### Functional Requirements
- Create and manage room lists
- Assign items to a room
- View room inventories and totals

### Non-Functional Requirements
- Room view should load within 2 seconds for 500 items
- Support custom room naming

## User Interface
- Room list with item counts
- Room detail view with filters
- Quick assign to room from item edit

## API Specification
- `GET /rooms`
- `POST /rooms`
- `PATCH /rooms/:id`
- `DELETE /rooms/:id`
- `PATCH /items/:id` (room assignment)

## Database Schema
- `rooms` table
- `items.room_id` foreign key

## Testing Strategy
- Unit tests for room validation
- Integration tests for room assignment
- E2E tests for room browsing

## Success Metrics
- 60% of inventories have at least 3 rooms defined
