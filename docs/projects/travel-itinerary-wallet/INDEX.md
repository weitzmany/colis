# Travel Itinerary & Document Wallet - Documentation Index

## Overview

**Travel Itinerary & Document Wallet (TripVault)** is a customer-facing full-stack web and mobile application that centralizes travel plans, reservations, and critical travel documents. Users can build comprehensive itineraries, store tickets and documents, receive automated alerts for schedule changes and expirations, and access everything offline while traveling.

**Target Audience**: Frequent travelers, families, business travelers, international travelers  
**Business Model**: Freemium (Free tier: 1 active trip; Premium: $9.99/month for unlimited trips and features)

## Documentation Structure

- [PRD Overview](PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs

### Global/Shared Features

This project uses the following general features (recommended for creation in [../general/](../general/) if 3+ projects adopt):
- **Authentication System** - User registration, login, JWT authentication (Used by 10+ projects - RECOMMENDED for general/)
- **Note**: Once 3+ projects confirm authentication needs, move to `../general/authentication/PRD.md`

### Project-Specific Features

All features are documented in the main PRD for now:
- Itinerary Builder
- Reservation & Ticket Vault
- Document Wallet
- Alerts & Notifications
- Sharing & Collaboration
- Mobile App with Offline Access

### Technical

Technical specifications are included in [Architecture](ARCHITECTURE.md):
- API Design
- Database Schema
- File Storage Architecture
- Offline Sync Architecture
- Security Architecture

### Business

Business requirements are included in [PRD Overview](PRD_OVERVIEW.md):
- Business Model (Freemium)
- User Personas
- Success Metrics
- Revenue Model

## Project Status

- **Current Phase**: Planning
- **Last Updated**: 2026-01-21
- **Priority**: Medium

## Quick Links

- [Main PRD](PRD_OVERVIEW.md) - Start here for project overview
- [MVP Definition](PRD_OVERVIEW.md#mvp-minimum-viable-product-definition) - MVP scope and features
- [Architecture](ARCHITECTURE.md) - Technical design
- [Expert Team](EXPERTS.md) - Expert contributions
- [Projects List Entry](../../reference/PROJECTS_LIST.md#15-travel-itinerary-wallet) - Project summary

## Navigation

**New to the project?** Start with [PRD Overview](PRD_OVERVIEW.md) to understand the project vision and MVP.

**Need technical details?** See [Architecture](ARCHITECTURE.md) for system design and tech stack.

**Want to contribute?** See [Expert Contributions](EXPERTS.md) for expert team and review status.

---

*Last Updated: 2026-01-21*
