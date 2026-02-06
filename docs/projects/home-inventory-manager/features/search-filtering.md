# Feature: Search and Filtering

## Overview
Help users quickly find items using search and filter controls across rooms, categories, tags, and value ranges.

## User Stories
- As a user, I want to search by item name so that I can locate items fast.
- As a user, I want to filter by room and category so that I can narrow results.

## Requirements
### Functional Requirements
- Full-text search on item names and brands
- Filters by room, category, tag, purchase date, and value range
- Saved filters for premium users (Phase 2)

### Non-Functional Requirements
- Search results returned within 500ms for 5,000 items
- Filters must be consistent across web and mobile

## User Interface
- Search bar with recent queries
- Filter drawer with clear/reset controls

## API Specification
- `GET /items?query=&room=&category=&tag=&minValue=&maxValue=`

## Database Schema
- Indexes on `items.name`, `items.brand`, `items.room_id`, `items.category_id`

## Testing Strategy
- Unit tests for query parsing
- Integration tests for search endpoints
- E2E tests for filter combinations

## Success Metrics
- 70% of active users use search or filters weekly
