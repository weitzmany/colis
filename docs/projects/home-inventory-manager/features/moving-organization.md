# Feature: Moving and Organization

## Overview
Support move preparation with packing lists, box tracking, and item status updates.

## User Stories
- As a user, I want a packing list so that I can plan my move.
- As a user, I want to track which box an item is in so that I can find it after moving.

## Requirements
### Functional Requirements
- Create move sessions with deadlines
- Generate packing lists by room
- Assign items to boxes with labels
- Track items for donation or sale

### Non-Functional Requirements
- Box assignment must be fast for bulk selection
- Exportable move summaries

## User Interface
- Move dashboard with progress
- Box list with item counts

## API Specification
- `POST /moves`
- `POST /moves/:id/boxes`
- `PATCH /items/:id` (box assignment)

## Database Schema
- `moves` table
- `move_boxes` table
- `items.move_box_id` foreign key

## Testing Strategy
- Integration tests for box assignment
- E2E tests for packing list generation

## Success Metrics
- 10% of users create a move session within 6 months
