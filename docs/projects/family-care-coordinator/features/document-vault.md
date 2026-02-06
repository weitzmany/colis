# Feature: Document Vault

## Overview
Secure storage for care plans, medical notes, and identity documents with controlled sharing.

## User Stories
- As a family organizer, I want to store critical documents securely.
- As a caregiver, I want access to care plans with appropriate permissions.

## Requirements
### Functional Requirements
- Upload and categorize documents by dependent
- Set viewer-only or editor access per document
- Optional expiring access links (post-MVP)

### Non-Functional Requirements
- Encryption at rest and in transit
- Virus scanning for uploads

## User Interface
- Document list with tags and access status
- Upload flow with dependent selection

## API Specification
- `POST /dependents/{dependentId}/documents`
- `GET /dependents/{dependentId}/documents`
- `DELETE /documents/{documentId}`

## Database Schema
- `documents` metadata table with storage keys and access flags

## Testing Strategy
- Upload and download integrity tests
- Permission tests for restricted documents

## Success Metrics
- Document upload completion rate
- Active document access by week
