# Feature: Unified Timeline

## Overview
A single chronological view showing all packages ordered by delivery date and grouped by time windows.

## MVP Scope
- Timeline sections: Today, Tomorrow, This Week, Later, Delivered
- Status badges and icons
- Package card with summary details

## User Stories
- As a user, I want to see all packages in one timeline so I know what arrives when.
- As a user, I want clear status indicators so I can scan delivery progress quickly.

## Functional Requirements
1. **Timeline Grouping**
   - Group by delivery date ranges.
   - Sort packages by estimated delivery date.

2. **Package Card**
   - Show carrier, tracking number, status, estimated delivery, and note.
   - Provide quick actions (view details, refresh).

3. **Status Indicators**
   - Color + icon for: pre-transit, in transit, out for delivery, delivered, exception.

4. **Empty State**
   - Display helpful guidance when there are no packages.

## Acceptance Criteria
- Timeline renders correctly on mobile and desktop.
- Status indicators pass WCAG AA contrast requirements.
- Empty state prompts user to add a package.

## UI Notes
- Use semantic headings for timeline sections.
- Status badges must include text labels for screen readers.

## Dependencies
- Package data API (see [API Design](../technical/api-design.md)).
- Status history storage (see [Database Schema](../technical/database-schema.md)).
