# Feature: Search and Organization

## Overview
Search and organization tools help users find packages quickly and declutter their timeline.

## Phase 2 Scope
- Search by tracking number, carrier, retailer, status
- Filters by date range and status
- Archive delivered packages

## User Stories
- As a user, I want to find a package quickly by search.
- As a user, I want to archive delivered packages to keep my timeline clean.

## Functional Requirements
1. **Search**
   - Keyword search across tracking number and notes.
   - Carrier and status filters.

2. **Archive**
   - Auto-archive delivered packages after 7 days (configurable).
   - Manual archive and unarchive actions.

3. **Sorting**
   - Sort by delivery date, date added, status.

## Acceptance Criteria
- Search results return in < 500ms for typical datasets.
- Archived packages are excluded from the default timeline.

## Dependencies
- Indexed queries (see [Database Schema](../technical/database-schema.md)).
- Timeline view integration (see [Unified Timeline](unified-timeline.md)).
