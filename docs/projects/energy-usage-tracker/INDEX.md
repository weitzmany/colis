# Energy Usage Tracker - Documentation Index

## Overview

Energy Usage Tracker (EnergyWise) is a customer-facing full-stack web and mobile application that helps households track utility usage (electricity, water, gas), monitor costs, and reduce bills with actionable insights. Users can log meter readings, import bills, receive high-usage alerts, and compare monthly trends to optimize their energy consumption and reduce expenses.

**Target Audience**: Homeowners, renters, families managing utility bills  
**Business Model**: Freemium (Free: 1 property, Premium: Multiple properties, advanced features)  
**Current Phase**: Planning

## Documentation Structure

- [PRD Overview](PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs

## Global/Shared Features

This project may use the following general features (if they exist in [../general/](../general/INDEX.md)):
- [Authentication System](../general/authentication/PRD.md) - User authentication and authorization (if available)
- [Translation System](../general/translations/PRD.md) - Multi-language support (Phase 2+, if needed)
- [Notification System](../general/notifications/PRD.md) - Multi-channel notifications (if available)

**Note**: Authentication and notifications are likely project-specific for MVP, but may become general features if 3+ projects need them.

## Project-Specific Features

### Core Features (MVP)
- Usage tracking (manual meter readings, bill upload)
- Cost monitoring (monthly costs, budget alerts)
- Basic insights (usage trends, peak detection)
- Alerts & reminders (high-usage, bill due dates)
- Monthly reports

### Post-MVP Features
- Bill parsing & OCR (automatic data extraction)
- Advanced analytics (predictive insights, optimization recommendations)
- Multi-property management
- Mobile app (React Native)
- Utility provider integrations
- Export automation

## Tech Stack

- **Frontend**: Next.js 15 (React) with TypeScript, Tailwind CSS
- **Backend**: Node.js with NestJS, RESTful API
- **Database**: PostgreSQL
- **Mobile**: React Native (iOS & Android) - Phase 2
- **Infrastructure**: Docker, GitHub Actions CI/CD, DigitalOcean (MVP)

## Project Status

- **Current Phase**: Planning
- **Last Updated**: 2026-01-20
- **Priority**: Medium
- **Target MVP Launch**: Q2 2026

## Business Value

- **Market Opportunity**: Help 130M US households reduce utility costs (average $300+/month)
- **User Value**: Save 10-20% on utility bills through usage insights and optimization
- **Revenue Model**: Freemium SaaS ($9.99/month Premium tier)
- **Time Savings**: Reduce manual bill tracking time from 30+ min/month to <5 min

## Quick Links

- [Main PRD](PRD_OVERVIEW.md#executive-summary)
- [MVP Definition](PRD_OVERVIEW.md#mvp-minimum-viable-product-definition)
- [Architecture Overview](ARCHITECTURE.md#system-overview)
- [Expert Team](EXPERTS.md#expert-team)
- [Projects List Entry](../../reference/PROJECTS_LIST.md#energy-usage-tracker)

---

**Last Updated**: 2026-01-20 by AI Planning Command
