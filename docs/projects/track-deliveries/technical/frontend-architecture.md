# Technical: Frontend Architecture

## Overview
The frontend is a Next.js 14 application using the App Router and TypeScript. It provides the marketing site and authenticated package tracking experience.

## Stack
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Forms**: React Hook Form + Zod
- **Testing**: Jest (unit), Playwright (E2E)

## Directory Structure (Proposed)
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── packages/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── package/
│   ├── auth/
│   └── layout/
├── lib/
├── hooks/
├── types/
└── styles/
```

## Component Hierarchy
```
App
├── Layout (Header, Footer)
├── Dashboard
│   └── PackageTimeline
│       ├── TimelineSection
│       └── PackageCard
└── Modals
    ├── AddPackageModal
    └── PackageDetailModal
```

## State Management
- **MVP**: React Context API
- **Scale**: Migrate to Zustand if complexity grows

## Routing
- `/` landing page
- `/login`, `/register`, `/forgot-password`
- `/dashboard` main timeline
- `/packages/add`, `/packages/[id]`
- `/settings` notification preferences

## API Integration
- Axios with request/response interceptors
- Access token in Authorization header
- 401 handling triggers logout flow

## Performance Targets
- Lighthouse score 90+ on mobile
- Initial bundle < 200 KB gzipped
- < 2s load on 3G network

## Accessibility
- Semantic headings and landmarks
- Keyboard navigation for all actions
- WCAG 2.1 AA color contrast
