# Feature: Insurance Claims Reporting

## Overview
Generate insurance-ready reports that list items, values, and supporting photos for claims.

## User Stories
- As a user, I want to generate an insurance report so that I can submit a claim quickly.
- As a user, I want to include photos and receipts in my report so that my claim is supported.

## Requirements
### Functional Requirements
- Generate PDF and CSV reports by room and category
- Include item photos and receipts
- Show total value summaries

### Non-Functional Requirements
- Report generation must complete within 60 seconds for 2,000 items
- Reports must be downloadable and shareable

## User Interface
- Report builder with filters
- Download history list

## API Specification
- `POST /reports` (create)
- `GET /reports/:id` (status/download)

## Database Schema
- `reports` table with filters, status, file reference

## Testing Strategy
- Integration tests for report generation pipeline
- E2E tests for report download

## Success Metrics
- 25% of users generate at least one report per quarter
