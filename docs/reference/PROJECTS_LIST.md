# Projects List

This document lists all projects found in `~/Documents/` directory, categorized and analyzed from an academic and educational perspective.

**Last Updated**: 2026-01-25

## Code Projects

Projects are categorized by academic discipline and educational value.

### 1. `ulvonix/`
- **Type**: Social Media Bots Platform
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
- **Location**: `~/Documents/ulvonix/`
- **Description**: Unified platform for creating, managing, and automating social media bots across multiple platforms, with scheduling, moderation, and analytics
- **Structure**:
  - `backend/` - Bot orchestration and API services
  - `frontend/` - Web dashboard for bot management
  - `bots/` - Bot modules and integrations
  - `docs/` - Platform documentation
- **Key Features**:
  - Multi-bot orchestration
  - Social platform integrations
  - Automated content workflows
  - Centralized bot management UI
  - Scheduling and moderation tools
- **Status**: Planned
- **Academic Classification**: Computer Science - Distributed Systems, Software Architecture, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates distributed bot orchestration
  - Illustrates API integration and automation pipelines
  - Shows modular system architecture and management dashboards
- **Subject Matter Areas**:
  - Computer Science: Distributed systems, API integration, event-driven systems
  - Software Engineering: Modular architecture, automation workflows, reliability
  - Data Management: Bot state persistence, scheduling data
- **Database Considerations**:
  - **Database Type**: SQLite or MySQL (depending on scale)
  - **Schema Design**: Bot configuration, task scheduling, user/role management
  - **Migration Strategy**: Version-controlled migrations for schema evolution
  - **Data Persistence**: Persistent storage for bot state and logs
  - **Backup Strategy**: Automated backups for bot configuration and history

### 2. `find-hidden-files/`
- **Type**: Obsidian Plugin
- **Technology**: TypeScript
- **Location**: `~/Documents/find-hidden-files/`
- **Description**: Obsidian plugin for showing hidden files
- **Key Files**: `main.ts`, `manifest.json`, `package.json`, `src/`
- **Status**: Active project
- **Academic Classification**: Computer Science - Software Development, Plugin Architecture
- **Educational Value**:
  - Demonstrates plugin development patterns
  - Illustrates file system interaction concepts
  - Shows TypeScript application in real-world projects
- **Subject Matter Areas**:
  - Computer Science: Plugin architecture, file system APIs, extension development
  - Software Engineering: Modular design, API integration, configuration management

### 3. `learning-games/`
- **Type**: Full-stack Learning Game/Quiz Application (Educational Technology)
- **Technology**: 
  - Backend: PHP 8.2+ (Slim 4 framework), Composer
  - Frontend: Angular 18 (TypeScript), Angular Material
  - Database: MySQL 8.0 (via Docker)
  - Mobile: React Native + Expo (Phase 2)
- **Location**: `~/Documents/learning-games/`
- **Description**: Interactive, game-based learning platform for STEM subjects (Physics 1, Calculus 1) with adaptive difficulty, instant feedback, exam preparation, and comprehensive progress tracking
- **Status**: Planning (MVP Definition Complete)
- **Priority**: High (Educational Technology Focus)
- **Documentation**: 
  - [Documentation Index](../projects/learning-games/INDEX.md) - Complete navigation guide
  - [PRD Overview](../projects/learning-games/PRD_OVERVIEW.md) - Product requirements with comprehensive MVP definition
  - [Architecture](../projects/learning-games/ARCHITECTURE.md) - Technical architecture and system design
  - [Expert Contributions](../projects/learning-games/EXPERTS.md) - 16 expert reviews and sign-offs
- **Key Features**:
  - **MVP Features**: User authentication, question bank (200 Physics 1 questions), interactive practice mode, progress tracking dashboard, adaptive difficulty
  - **Phase 2**: Calculus 1 content, exam preparation modes, advanced analytics, gamification (points, levels, badges)
  - **Phase 3**: React Native mobile app (iOS/Android), offline mode, push notifications, social features
  - **Phase 4**: Teacher dashboard, content creator tools, AI-powered features
- **Business Model**: Freemium (Free tier: 10 questions/day, Premium: $9.99/month unlimited, Premium+: $19.99/month with AI tutor)
- **Target Users**:
  - Primary: University students (Physics 1, Calculus 1)
  - Secondary: High school students (AP Physics, AP Calculus)
  - Tertiary: Lifelong learners (STEM knowledge improvement)
- **MVP Timeline**: 13 weeks (10 weeks development + 3 weeks testing)
- **Academic Classification**: Computer Science - Full-Stack Development, Educational Technology, Human-Computer Interaction, Learning Analytics
- **Educational Value**:
  - **Primary Educational Application**: Educational technology platform for STEM learning
  - Demonstrates full-stack architecture (Angular frontend, PHP/Slim backend, MySQL database)
  - Illustrates adaptive learning algorithms and educational data analytics
  - Exemplifies RESTful API design with JWT authentication
  - Shows educational content management and delivery systems
  - Demonstrates containerization with Docker and Docker Compose
  - Illustrates accessibility compliance (WCAG 2.1 AA)
  - Shows COPPA and FERPA compliance for educational platforms
- **Subject Matter Areas**:
  - **Educational Technology**: Adaptive learning, gamified learning, learning analytics, progress tracking
  - **Computer Science**: Full-stack development, RESTful API design, JWT authentication, state management, database design
  - **Learning Analytics**: Progress tracking, concept mastery, adaptive difficulty algorithms, learning outcome measurement
  - **Software Engineering**: MVC architecture, service layer pattern, repository pattern, CI/CD
  - **Data Science**: Adaptive difficulty algorithms, learning curve analysis, performance analytics
- **Research Opportunities**:
  - **Educational Technology Research**:
    - Effectiveness of gamified learning in STEM education
    - Adaptive difficulty algorithms for optimal learning outcomes
    - Impact of immediate feedback on concept mastery
    - Spaced repetition and learning retention
  - **Learning Analytics Research**:
    - Predictive analytics for exam readiness
    - Concept mastery measurement and visualization
    - Learning curve analysis and time-to-mastery
    - Student engagement patterns and retention
  - **User Experience Research**:
    - Mobile vs web learning effectiveness
    - Gamification impact on motivation and engagement
    - Accessibility features for inclusive learning
  - **Data Science Research**:
    - Machine learning for adaptive difficulty
    - Natural language processing for question generation
    - Predictive modeling for learning outcomes
- **Database Considerations**:
  - **Database Type**: MySQL 8.0 (relational database, ideal for structured educational data)
  - **Schema Design**: 
    - Users table (authentication, profile, roles)
    - Questions table (subject, topic, difficulty, options, correct answer, explanation, concept tags)
    - User progress table (question attempts, accuracy, time spent, timestamps)
    - User sessions table (session tracking, duration, topic focus)
  - **Migration Strategy**: Versioned PHP migration scripts for schema evolution (up/down migrations)
  - **Data Persistence**: Dockerized MySQL with persistent volumes (prevents data loss)
  - **Backup Strategy**: Daily automated backups, 7-day daily retention, 4-week weekly retention, 3-month monthly retention
  - **Query Optimization**: 
    - Indexed columns: `email` (unique), `(subject, topic, difficulty)`, `(user_id, created_at)`, `(user_id, is_correct)`
    - Prepared statements (SQL injection prevention)
    - EXPLAIN for slow query analysis
    - Avoid N+1 queries (Eloquent eager loading)
  - **Data Integrity**: Foreign key constraints (CASCADE DELETE), NOT NULL constraints, transaction management
  - **Scalability**: 
    - Horizontal scaling: stateless API with JWT (no server-side sessions)
    - Database read replicas (Phase 3)
    - Query caching with Redis (Phase 2)
    - Connection pooling for concurrent users
  - **Security**: 
    - Bcrypt password hashing (cost factor 12)
    - Prepared statements (SQL injection prevention)
    - Input validation and sanitization
    - HTTPS only (TLS 1.2+)
    - COPPA and FERPA compliance
- **Expert Team** (16 experts):
  - Product: Patricia Martinez (MVP, business model, prioritization)
  - Educational: Carol Williams (content design), Andrew Mitchell (learning analytics)
  - Architecture: Marcus Johnson (system design, scalability)
  - Backend: Samuel Rodriguez (API, services), Emily Chen (API design), Benjamin Lee (database)
  - Frontend: Thomas Anderson (Angular), Daisy Thompson (UI/UX), Allison Foster (accessibility)
  - Security: Ryan Kim (security), Constance White (compliance)
  - Infrastructure: David Cooper (DevOps), Michael Brown (mobile)
  - Analytics: Gary Wilson (business intelligence)
  - Documentation: Dorothy Clark (documentation structure)

### 4. `sandbox/keel/`
- **Type**: Angular Library (Monorepo)
- **Technology**: Angular, TypeScript
- **Location**: `~/Documents/sandbox/keel/`
- **Description**: Angular component library organized as a monorepo with multiple packages
- **Structure**:
  - `packages/rig/` - Core package
  - `packages/layout/` - Layout package
  - `packages/overlays/` - Overlays package
  - `packages/primitives/` - Primitives package
  - `projects/keel-docs/` - Documentation project (Angular app + NestJS server)
- **Key Files**: `package.json`, `angular.json`, `packages/`
- **Status**: Active project
- **Academic Classification**: Computer Science - Software Architecture, Library Design, Component-Based Development
- **Educational Value**:
  - Demonstrates monorepo architecture and package management
  - Illustrates component library design patterns
  - Shows modular software design principles
  - Exemplifies documentation-driven development
- **Subject Matter Areas**:
  - Computer Science: Software architecture, design patterns, modular programming
  - Software Engineering: Monorepo management, package design, API design, documentation
  - Mathematics: Graph theory (dependency graphs), set theory (package relationships)

### 4a. `packages/keel` (`@colis/keel`)
- **Type**: Angular Component Library Package
- **Technology**: Angular (≥17), TypeScript, CSS Custom Properties
- **Location**: `~/Documents/packages/packages/keel/`
- **npm Package**: `@colis/keel`
- **Description**: Official Angular component library for the `@colis` ecosystem. Provides standalone Angular components (buttons, inputs, modals, etc.) that consume CSS custom properties via the `--keel-*` token namespace. Works without `@colis/hull` using built-in CSS variable fallback defaults.
- **Phase 1 Status**: Foundation MVP — empty installable package with CSS token contract. No components yet.
- **Dependencies**: Peer deps on `@angular/core` and `@angular/common` (≥17). No dependency on `@colis/hull`.
- **Key Files**:
  - `package.json` — Package metadata and peer deps
  - `src/index.ts` — Public API entry point
  - `src/tokens/defaults.css` — CSS variable defaults (all `--keel-*` tokens with fallback values)
  - `README.md` — Usage documentation
- **Related Docs**:
  - [`docs/features/keel/PRD.md`](../features/keel/PRD.md)
  - [`docs/features/keel/TASKS.md`](../features/keel/TASKS.md)
  - [`docs/reference/KEEL_HULL_TOKEN_CONTRACT.md`](./KEEL_HULL_TOKEN_CONTRACT.md)
- **Academic Classification**: Computer Science - Software Architecture, Component Design, Design Systems
- **Educational Value**:
  - Demonstrates CSS custom property (token) system for design systems
  - Illustrates standalone Angular component architecture
  - Shows separation of concerns between component logic and styling

### 4b. `packages/hull` (`@colis/hull`)
- **Type**: Design System and Theming Package
- **Technology**: CSS Custom Properties, TypeScript, Tailwind-sourced tokens
- **Location**: `~/Documents/packages/packages/hull/`
- **npm Package**: `@colis/hull`
- **Description**: Official design system and theming package for `@colis/keel`. Implements a three-layer CSS token architecture: (1) Tailwind-first base token values, (2) built-in light/dark themes, (3) project override mechanism. Assigns concrete values to the `--keel-*` CSS custom properties that keel components consume.
- **Phase 1 Status**: Foundation MVP — three-layer directory structure scaffolded. No theme values yet.
- **Dependencies**: Peer dependency on `@colis/keel` (≥0.1.0). No Tailwind CSS runtime dependency.
- **Key Files**:
  - `package.json` — Package metadata and keel peer dep
  - `src/index.ts` — Public JS API entry point
  - `src/styles.css` — Main CSS entry (imports all layers; empty in Phase 1)
  - `src/base/` — Layer 1: Tailwind-sourced token value mapping
  - `src/themes/light/` — Layer 2: Light mode theme
  - `src/themes/dark/` — Layer 2: Dark mode theme
  - `src/project/` — Layer 3: Project override convention and helpers
  - `README.md` — Architecture documentation
- **Related Docs**:
  - [`docs/features/hull/PRD.md`](../features/hull/PRD.md)
  - [`docs/features/hull/TASKS.md`](../features/hull/TASKS.md)
  - [`docs/reference/KEEL_HULL_TOKEN_CONTRACT.md`](./KEEL_HULL_TOKEN_CONTRACT.md)
- **Academic Classification**: Computer Science - Design Systems, CSS Architecture, Software Layering
- **Educational Value**:
  - Demonstrates three-layer CSS architecture for scalable theming
  - Illustrates how design tokens bridge design and engineering
  - Shows CSS cascade as an architectural mechanism

### 5. `spoon-me/`
- **Type**: E-commerce Web Application
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular with TypeScript
  - Database: MySQL (via Docker)
- **Location**: `~/Documents/spoon-me/`
- **Description**: E-commerce application for ordering soups/products with admin panel
- **Structure**:
  - `app/` - Next.js app directory with API routes
  - `components/` - React components
  - `contexts/` - React contexts (Cart, User)
  - `lib/` - Utility libraries
  - `types/` - TypeScript types
- **Key Features**:
  - Product catalog
  - Shopping cart
  - User authentication
  - Admin panel
  - Order management
  - Coupon system
- **Key Files**: `package.json`, `next.config.js`, `app/`, `components/`
- **Status**: Active project
- **Academic Classification**: Computer Science - Web Development, Business Information Systems, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates e-commerce system architecture
  - Illustrates state management patterns (React Context)
  - Shows business logic implementation (cart, orders, coupons)
  - Exemplifies full-stack Next.js development
- **Subject Matter Areas**:
  - Computer Science: Web development, state management, API design, authentication
  - Business/Mathematics: Pricing algorithms, discount calculations, inventory management
  - Software Engineering: Component architecture, type safety (TypeScript), testing strategies
- **Database Considerations**:
  - **Database Type**: Likely PostgreSQL or MySQL (relational database for e-commerce data)
  - **Schema Design**: Product catalog schema, user/authentication schema, order management schema, coupon/discount schema, inventory schema
  - **Migration Strategy**: Database migrations for schema versioning and product/order data management
  - **Data Persistence**: Persistent database storage for products, orders, users, inventory
  - **Backup Strategy**: Database backup and restore procedures for business-critical data
  - **Query Optimization**: Optimized queries for product search, order retrieval, inventory checks, coupon validation
  - **Data Integrity**: Foreign key constraints, inventory constraints, order data consistency, transaction management for orders
  - **Scalability**: Database indexing for product search, order queries, connection pooling for high traffic
  - **Security**: Secure credential management, SQL injection prevention, PCI compliance considerations for payment data

### 6. `track-deliveries/`

**Status**: Planning / Proposal  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)

#### Overview
Customer-facing web and mobile application that tracks deliveries across multiple retailers and carriers (Amazon, AliExpress, Shein, Target, etc.). Users can add tracking numbers, see a unified delivery timeline, get status alerts, and manage all packages in one centralized location.

#### Key Features
- Manual tracking number entry with auto-carrier detection
- Unified delivery timeline (all packages in one chronological view)
- Proactive email notifications (out for delivery, delivered, delayed)
- Multi-carrier support (USPS, UPS, FedEx, DHL, Amazon Logistics)
- Package organization (notes, search, filter, archive)
- Mobile-responsive web app (MVP), native mobile app (Phase 2)
- Freemium business model (10 free packages, unlimited premium)

#### Tech Stack
- **Frontend**: Next.js 14 (React 18) with TypeScript, Tailwind CSS
- **Backend**: Node.js 20 with Express 4 (or NestJS 10), TypeScript
- **Database**: PostgreSQL 15 with Prisma 5 ORM
- **Cache**: Redis 7 (API cache, job queue)
- **Mobile**: React Native with Expo (Phase 2)
- **Infrastructure**: Vercel (frontend), DigitalOcean (backend), Docker
- **Integrations**: USPS, UPS, FedEx, DHL APIs, SendGrid (email)

#### Documentation
- [Project Index](../projects/track-deliveries/INDEX.md) - Documentation navigation
- [PRD Overview](../projects/track-deliveries/PRD_OVERVIEW.md) - Product requirements with MVP definition
- [Architecture](../projects/track-deliveries/ARCHITECTURE.md) - Technical architecture and design
- [Expert Contributions](../projects/track-deliveries/EXPERTS.md) - Expert reviews and sign-offs

#### Timeline
- **Phase 1: MVP** (8 weeks development + 2 weeks testing)
  - Manual tracking, unified timeline, email alerts, user authentication
- **Phase 2: Core Features** (6 weeks)
  - Retailer grouping, search & filter, archive, native mobile app with push notifications
- **Phase 3: Advanced Features** (8 weeks)
  - Retailer integrations (auto-import), reports & export, analytics dashboard

#### Business Value
**User Value**: High - Solves real pain point for frequent online shoppers (delivery anxiety, missed packages, fragmented tracking)  
**Revenue Potential**: Medium - Freemium model ($4.99/month premium), estimated 5-10% conversion rate  
**Strategic Fit**: Complementary to subscription management and budget tracking projects

#### Expert Team
- **Product**: Patricia Martinez - MVP prioritization, business decisions, pricing strategy
- **Backend**: Samuel Rodriguez - API design, carrier integrations, background jobs
- **Frontend**: Thomas Anderson - Next.js architecture, React components, state management
- **Mobile**: Michael Brown - Mobile-responsive web (MVP), React Native app (Phase 2)
- **Database**: Benjamin Lee - PostgreSQL schema, indexing, optimization
- **API Design**: Emily Chen - RESTful API, carrier API integrations
- **Security**: Ryan Kim - JWT authentication, HTTPS, GDPR compliance
- **Performance**: James Martinez - Caching strategy, scalability planning
- **UI/UX**: Daisy Thompson - Timeline interface, onboarding flow
- **Accessibility**: Allison Foster - WCAG 2.1 AA compliance
- **DevOps**: David Cooper - Docker deployment, CI/CD, monitoring
- **Observability**: Kevin Martinez - Sentry error tracking, structured logging
- **Copywriter**: Olivia Martinez - App messaging, value proposition

#### Academic Classification
**Computer Science** - Web Development, Distributed Systems, Human-Computer Interaction

#### Educational Value
- **API Integration**: Demonstrates integration with multiple third-party carrier APIs (USPS, UPS, FedEx, DHL)
- **Background Jobs**: Illustrates asynchronous task processing (Bull queue, cron jobs for carrier polling)
- **Real-Time Updates**: Shows event-driven architecture with status change notifications
- **Full-Stack Architecture**: Complete web application with frontend, backend, database, and external integrations
- **Freemium Business Model**: Practical example of free vs premium tier implementation
- **Mobile-First Design**: Responsive web app with progressive enhancement

#### Subject Matter Areas
- **Computer Science**: API integration patterns, event-driven systems, data aggregation, caching strategies
- **Software Engineering**: Integration patterns, reliability, observability, background job processing
- **Business/Logistics**: Delivery tracking workflows, carrier coordination, customer-facing applications
- **Product Management**: MVP prioritization, freemium pricing, user acquisition strategies
- **User Experience**: Timeline visualization, proactive notifications, mobile-first design

### 7. `personal-budget-manager/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Personal Budget Manager (BudgetFlow) is a customer-facing full-stack web and mobile application that helps individuals and families track income, expenses, budgets, and financial goals. The platform transforms overwhelming personal finance management into an organized, insightful system that provides actionable insights, reduces financial stress, and helps users achieve their financial goals through intelligent expense tracking, budget planning, and goal achievement features.

**Target Audience**: Individuals and families managing personal finances, budget-conscious consumers, people working towards financial goals  
**Business Model**: Freemium (Free tier with basic features, Premium $9.99/month for advanced features)

#### Key Features

1. **Quick Expense Entry**: Fast expense tracking with categorization, recurring expense support
2. **Monthly Budget Setup**: Set budgets per category with visual progress tracking and alerts
3. **Simple Dashboard**: Overview of spending vs. budget, recent expenses, quick actions
4. **Budget Alerts**: Email notifications when approaching budget limits (80%, 100%, over budget)
5. **Expense History**: View and filter expense history with search functionality
6. **User Authentication**: Secure JWT-based authentication with encrypted password storage
7. **Financial Reports** (Phase 2): Monthly/yearly reports with trends and insights
8. **Savings Goals** (Phase 2): Track progress towards financial goals with milestones
9. **Mobile App** (Phase 2): React Native app with offline mode, receipt scanning, push notifications
10. **Bank Integration** (Phase 3): Plaid integration for automatic transaction import

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, for structured financial data)
- **Background Jobs**: Cron jobs for email queue and scheduled tasks
- **Mobile** (Phase 2): Capacitor (iOS & Android), push notifications
- **Infrastructure**: Docker containerization, DigitalOcean (MVP), GitHub Actions CI/CD

#### Documentation

- [Documentation Index](projects/personal-budget-manager/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/personal-budget-manager/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](projects/personal-budget-manager/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/personal-budget-manager/EXPERTS.md) - 16 expert reviews and sign-offs

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-10): Core expense tracking, budgets, basic reports, user auth, email alerts
- **Testing Phase** (Weeks 11-12): Internal testing, beta testing (50 users), bug fixes
- **Phase 2 (Core)** (Months 3-6): Recurring expenses, income tracking, savings goals, advanced reports, mobile app
- **Phase 3 (Advanced)** (Months 7-12): Bank integration (Plaid), predictive analytics, family collaboration, investment tracking

**Target Launch**: Q2 2026 (Week 13) - MVP Soft Launch

#### Business Value

- **Market Demand**: Large market for personal finance management (78% of Americans live paycheck to paycheck)
- **User Value**: Financial clarity, budget control, goal achievement, stress reduction, actionable insights
- **Revenue Model**: Freemium SaaS targeting $5K MRR by month 6, $25K MRR by month 12
- **User Retention**: Daily use leads to high user retention rates (40%+ DAU target)
- **Scalability**: Cloud-based architecture supports millions of users

#### Expert Team (16 Experts)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, business model, prioritization ✅ Approved
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, completeness ✅ Approved
- **Architecture**: Marcus Johnson (Architecture) - System architecture, scalability planning ⏳ Pending
- **Backend**: Samuel Rodriguez (Backend) - NestJS API, authentication, business logic ⏳ Pending
- **Frontend**: Thomas Anderson (Frontend) - Next.js, React, dashboard UI ⏳ Pending
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization ⏳ Pending
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint design ⏳ Pending
- **UI/UX**: Daisy Thompson (UI/UX) - Dashboard design, user flows, mobile-first UX ⏳ Pending
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation ⏳ Pending
- **Mobile**: Michael Brown (Mobile) - React Native (Phase 2), offline mode, push notifications ⏳ Pending
- **Security**: Ryan Kim (Security) - JWT auth, data encryption, financial data security ⏳ Pending
- **Performance**: James Martinez (Performance) - Optimization, caching, response times ⏳ Pending
- **DevOps**: David Cooper (DevOps) - CI/CD, Docker, infrastructure setup ⏳ Pending
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring, error tracking ⏳ Pending
- **Business Intelligence**: Gary Wilson (BI) - Analytics architecture, KPIs, data visualization ✅ Approved (PRD Contribution 2026-01-05)
- **Compliance**: Constance White (Compliance) - GDPR, CCPA, PCI DSS compliance ⏳ Pending
- **Copywriter**: Olivia Martinez (Copywriter) - App naming (BudgetFlow), UI copy ⏳ Pending

**Expert Sign-offs**: 3 approved (Patricia Martinez, Dorothy Clark, Gary Wilson), 13 pending review

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Business Information Systems, Human-Computer Interaction

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates financial analytics and budget management workflows
- Shows RESTful API design and JWT authentication patterns
- Exemplifies freemium SaaS business model with conversion strategies
- Demonstrates mobile-first responsive design and React Native development
- Illustrates offline-first mobile architecture (Phase 2)

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, API design, mobile UX, data visualization, background job processing
- **Software Engineering**: Modular architecture (NestJS modules), RESTful API design, CI/CD pipelines, Docker containerization
- **Database Systems**: PostgreSQL schema design, query optimization, indexing strategies, Prisma ORM, connection pooling
- **Security**: JWT authentication, bcrypt password hashing, data encryption (at rest/in transit), GDPR/CCPA compliance, PCI DSS
- **Business/Mathematics**: Budgeting, financial metrics, trend analysis, spending forecasts, savings rate calculation
- **Data Visualization**: Dashboard design, interactive charts (Recharts), spending analysis, budget progress visualization

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured financial data)
- **Schema Design**: Users, Categories, Expenses, Budgets with proper relationships and constraints
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for expenses, budgets, user data with automated backups
- **Backup Strategy**: DigitalOcean managed database automated backups (7-day retention), RTO 4 hours, RPO 24 hours
- **Query Optimization**: Indexes on user_id, date, category_id; composite index on (user_id, date); pagination for large datasets; connection pooling
- **Data Integrity**: Foreign key constraints, unique constraints, check constraints for data validation, transaction management
- **Scalability**: Connection pooling (10-20 connections MVP), read replicas for read-heavy workloads (post-MVP), horizontal scaling with load balancing
- **Security**: Encryption at rest (AES-256 for database), encryption in transit (TLS 1.3), GDPR/CCPA compliance, PCI DSS compliance for payment processing

**Type**: Personal Finance Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/personal-budget-manager/`

### 8. `project-health-dashboard/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: High  
**Category**: Full-Stack Dashboard Application (Customer-Facing)

#### Overview

Project Health Dashboard is a centralized, customer-facing web-based dashboard application that monitors, tracks, and provides actionable insights into all projects within a portfolio. It aggregates data from Git repositories, CI/CD systems, package registries, and documentation sites to provide a unified, real-time view of project health, status, dependencies, and coordination needs.

**Target Audience**: Portfolio managers, development teams, technical leads, decision-makers  
**Business Model**: Internal tool (MVP), potential SaaS offering (future)

#### Key Features

1. **Project List Dashboard**: Visual grid of all projects with health scores and status indicators
2. **Automated Health Scoring**: Objective health scores (0-100) based on code quality (40%), dependencies (30%), build status (30%)
3. **Git Integration**: Automatic data collection from GitHub and GitLab APIs
4. **Project Detail View**: Drill-down view with detailed metrics, trends, and activity
5. **Critical Alerts**: Dashboard notifications for failing builds and security vulnerabilities

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, primary)
- **Infrastructure**: Docker containerization, CI/CD (GitHub Actions), DigitalOcean (MVP)
- **Integrations**: GitHub API, GitLab API, npm Registry API

#### Documentation

- [Documentation Index](projects/project-health-dashboard/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/project-health-dashboard/PRD_OVERVIEW.md) - Main requirements document (500 lines)
- [Architecture](projects/project-health-dashboard/ARCHITECTURE.md) - Technical architecture (500 lines)
- [Expert Contributions](projects/project-health-dashboard/EXPERTS.md) - 13 expert sign-offs (400 lines)
- [Feature PRDs](projects/project-health-dashboard/features/) - Detailed feature specifications

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-10): Project list dashboard, health scoring, Git integration, project detail view, critical alerts
- **Phase 2 (Months 3-6)**: Advanced analytics, custom dashboards, additional CI/CD integrations, mobile responsiveness
- **Phase 3 (Months 7-12)**: Predictive analytics, automated actions, team collaboration features
- **Phase 4 (Year 2)**: AI-powered insights, mobile apps, enterprise features (SSO, RBAC, multi-org)

**Target Launch**: April 2026 (MVP soft launch)

#### Business Value

- **Time Savings**: Reduce project health review time from 8 hours to <1 hour weekly (85% reduction)
- **Proactive Monitoring**: Identify 80% of critical issues before they impact production
- **Centralized Visibility**: Single dashboard for all portfolio projects (replacing manual tracking across GitHub, CI/CD, npm)
- **Data-Driven Decisions**: Make informed technology and resource allocation decisions based on real portfolio data
- **ROI Target**: 10x return on investment through early issue detection and time savings

#### Expert Team (13 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, prioritization
- **Architecture**: Marcus Johnson (Architecture) - System design, scalability
- **Backend**: Samuel Rodriguez (Backend) - API design, data collection, health scoring
- **Frontend**: Thomas Anderson (Frontend) - Dashboard UI, state management
- **Database**: Benjamin Lee (Database) - Schema design, query optimization
- **API Design**: Emily Chen (API Design) - RESTful API conventions
- **Business Intelligence**: Gary Wilson (BI) - Analytics architecture, KPIs (original contributor to PRD 2026-01-05)
- **UI/UX**: Daisy Thompson (UI/UX) - Dashboard layout, interaction patterns
- **DevOps**: David Cooper (DevOps) - CI/CD, deployment, infrastructure
- **Performance**: James Martinez (Performance) - Caching, query optimization
- **Security**: Ryan Kim (Security) - OAuth, JWT, data encryption
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring, metrics
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, completeness

**All experts approved and signed off on 2026-01-20**

#### Academic Classification

**Primary**: Computer Science - Software Engineering, Data Visualization, Dashboard Design, Portfolio Management

**Educational Value**:
- Demonstrates full-stack dashboard architecture (Next.js, NestJS, PostgreSQL, Redis)
- Illustrates real-time data visualization and SSE (Server-Sent Events)
- Shows RESTful API design and integration patterns (GitHub, GitLab, npm APIs)
- Exemplifies automated data collection and aggregation pipelines
- Demonstrates health scoring algorithms and metrics calculation
- Illustrates caching strategies (multi-layer: browser, Redis, database)
- Shows OAuth 2.0 authentication flow and JWT session management

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, data visualization, real-time updates, API integration, background job processing
- **Software Engineering**: Dashboard UX patterns, health monitoring systems, metrics aggregation, CI/CD integration
- **Database Systems**: PostgreSQL schema design, time-series data storage, query optimization, indexing strategies
- **Security**: OAuth 2.0, JWT authentication, data encryption (at rest and in transit), RBAC
- **Business Intelligence**: KPI definition, analytics architecture, ETL pipelines, data warehouse design, predictive analytics

### 9. `anchorage-center/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Critical (Foundation for all apps)  
**Category**: Backend Service / Microservice / Infrastructure

#### Overview

The Authentication Center is a production-ready, centralized authentication and authorization service that acts as the single source of truth for user identities across all applications in your ecosystem. It provides secure, scalable authentication with Single Sign-On (SSO), role-based access control, and compliance-ready audit logging.

**Target Audience**: App developers integrating authentication, end users of applications, system administrators  
**Business Model**: Internal infrastructure service (free for all your apps)

#### Key Features

**MVP Features (Phase 1)**:
1. **User Registration & Login**: Email/password authentication with Argon2id hashing, email verification, rate limiting
2. **Session Management**: JWT-based sessions with access tokens (15 min) + refresh tokens (30 days), token validation, session revocation
3. **Basic RBAC**: Role-based access control with Admin and User roles, role assignment, permission checking
4. **REST API**: Clean, documented REST API with OpenAPI spec, versioned endpoints, CORS support
5. **Password Reset**: Secure email-based password reset flow with time-limited tokens
6. **Basic Admin Panel**: Web interface for user management, user search, role assignment, session management

**Post-MVP Features (Phase 2+)**:
- OAuth 2.0 / OpenID Connect (Google, GitHub, Facebook login)
- Multi-Factor Authentication (2FA with TOTP)
- Advanced permission system (resource-based permissions)
- GraphQL API
- Audit logging and compliance reports
- Mobile SDK (iOS, Android)
- SSO for Enterprise (SAML, LDAP)
- User profile management

#### Tech Stack

- **Backend**: Node.js 20 LTS with TypeScript, Express.js framework, Prisma ORM
- **Database**: PostgreSQL 16 (user data, sessions, roles), Redis 7 (session cache, rate limiting)
- **Security**: Argon2id (password hashing), JWT with RS256 (RSA signatures), AES-256 (encryption), TLS 1.3
- **Frontend**: React 18 with TypeScript (admin panel), Vite, Tailwind CSS, React Query
- **Infrastructure**: Docker, NGINX (reverse proxy, SSL termination), Let's Encrypt (SSL), DigitalOcean or AWS EC2
- **Monitoring**: Winston (structured logging), health checks, UptimeRobot

#### Documentation

- [Documentation Index](projects/anchorage-center/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/anchorage-center/PRD_OVERVIEW.md) - Main requirements document with comprehensive MVP definition
- [Architecture](projects/anchorage-center/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/anchorage-center/EXPERTS.md) - 15 expert contributions
- Additional docs: `features/`, `technical/`, `business/`, `compliance/`

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-11): Core authentication, password management, RBAC, admin panel, security testing, integration testing
  - Weeks 1-2: Core auth (registration, login, sessions)
  - Weeks 3-4: Password management (reset, change, validation)
  - Weeks 5-6: RBAC system, admin panel
  - Weeks 7-8: API documentation, integration guides
  - Weeks 9-10: Security testing, integration testing
  - Week 11: Launch with 2-3 pilot apps
- **Phase 2** (Weeks 12-16): OAuth 2.0, Multi-Factor Authentication, audit logging, user profile management
- **Phase 3** (Weeks 17-20): GraphQL API, advanced permissions, mobile SDK, webhook system
- **Phase 4** (Weeks 21-28): Enterprise SSO (SAML, LDAP), team/organization support, custom branding

**Target Launch**: March 2026 (MVP launch with 3 pilot apps)

#### Business Value

**Problems Solved**:
- **Eliminates Duplication**: Every app rebuilds auth from scratch (2-4 weeks per app)
- **Enhances Security**: Centralized security expertise, automatic security patch deployment
- **Improves UX**: Single sign-on (SSO) across all apps, one account for all services
- **Simplifies Compliance**: GDPR, CCPA compliance in one place, centralized audit logging
- **Reduces Maintenance**: One system to monitor and maintain, centralized user management

**Quantitative Value**:
- **Time Savings**: Save 2-4 weeks development per app × 10 apps = 20-40 weeks saved
- **Cost Savings**: Avoid $1,000-$2,000/month in Auth0 fees (for 10 apps @ $100-$200/month each)
- **Integration Speed**: <4 hours to integrate authentication (vs 2-4 weeks building from scratch)
- **Security**: Zero critical vulnerabilities (regular security audits, centralized patching)
- **Performance**: <100ms average API response time, 99.9% uptime

**Architectural Justification**:

This authentication center meets multiple **Architectural Override criteria**, making it REQUIRED to be centralized:

✅ **Centrally Deployed**: Single authentication service that all apps connect to  
✅ **Security-Critical**: Authentication vulnerabilities affect all applications  
✅ **Single Source of Truth**: User accounts, sessions, permissions managed centrally  
✅ **Synchronized Updates Required**: Security patches must deploy to all apps together  
✅ **Compliance Required**: GDPR, CCPA compliance must be consistent across all apps

**Conclusion**: This MUST be a centralized service for security and compliance reasons.

#### Applications Using This Service

**Current Projects (Planned Integration)**:
- Chore Allowance Manager
- Vehicle Maintenance Tracker
- Learning Games Platform
- Home Maintenance Tracker
- Financial Goal Saver
- Habit Tracker
- Energy Usage Tracker
- Meal Planner Grocery
- [20+ other projects will integrate]

**Benefits for Each App**:
- ✅ No need to build authentication from scratch
- ✅ Single sign-on across all apps
- ✅ Consistent security model
- ✅ Easy user management
- ✅ Reduced development time
- ✅ Centralized compliance

#### Expert Team (15 Experts)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, prioritization, business decisions, feature roadmap
- **Architecture**: Marcus Johnson (Architecture) - System architecture, scalability planning, technology stack
- **Backend**: Samuel Rodriguez (Backend) - Service layer, business logic, API design
- **Security**: Ryan Kim (Security) - Authentication security, threat modeling, encryption, STRIDE analysis
- **Database**: Benjamin Lee (Database) - Schema design, optimization, data modeling
- **API Design**: Emily Chen (API Design) - REST API structure, OpenAPI spec, developer experience
- **Compliance**: Constance White (Compliance) - GDPR, CCPA, data protection, legal compliance
- **Performance**: James Martinez (Performance) - Caching strategy, query optimization, response time targets
- **DevOps**: David Cooper (DevOps) - Docker, CI/CD, deployment, monitoring, disaster recovery
- **UI/UX**: Daisy Thompson (UI/UX) - Admin panel interface and user experience
- **Accessibility**: Allison Foster (Accessibility) - WCAG 2.1 AA compliance for admin panel
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, clarity, completeness
- **Testing**: Robert Brown (Testing) - Testing strategy, security testing, penetration testing
- **Cloud Infrastructure**: Sarah Kim (Cloud Infrastructure) - Cloud platform, infrastructure recommendations
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring, metrics, health checks

**All experts contributed to initial planning**

#### Academic Classification

**Primary**: Computer Science - Security, Authentication Systems, Distributed Systems, Backend Infrastructure

**Educational Value**:
- Demonstrates modern authentication patterns (JWT with RS256, refresh tokens, session management)
- Illustrates password security best practices (Argon2id hashing, rate limiting, password reset flows)
- Shows role-based access control (RBAC) implementation
- Exemplifies RESTful API design with security in mind (authentication, authorization, validation)
- Demonstrates caching strategies (Redis for session cache, rate limiting, token blacklist)
- Shows microservice architecture (centralized authentication service consumed by multiple apps)
- Illustrates security-first development (encryption at rest/transit, secure defaults, defense in depth)

**Subject Matter Areas**:
- **Computer Science**: Authentication protocols, session management, token-based authentication, cryptographic hashing
- **Security**: Password security (Argon2id), JWT security (RS256 signatures), encryption (AES-256, TLS 1.3), OWASP Top 10
- **Software Engineering**: Microservice architecture, API design, middleware patterns, rate limiting algorithms
- **Infrastructure**: Docker containerization, NGINX reverse proxy, SSL/TLS configuration, load balancing
- **Compliance**: GDPR compliance (data protection, user rights), CCPA compliance (data deletion, export)

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for user data, sessions, roles), Redis 7 (in-memory cache for session cache, rate limiting)
- **Schema Design**: 
  - `users` table (user accounts, email, password hash, email verification, active status, role)
  - `sessions` table (active sessions, refresh tokens, expiry, IP address, user agent)
  - `roles` table (user roles, permissions)
  - `permissions` table (role permissions)
  - `password_resets` table (password reset tokens, expiry)
  - `email_verifications` table (email verification tokens, expiry)
- **Migration Strategy**: Prisma migrations for schema versioning, rollback support, automated migrations in CI/CD
- **Data Persistence**: PostgreSQL with automated daily backups, 30-day retention, encrypted backups, off-site storage
- **Backup Strategy**: Automated daily backups (midnight UTC), point-in-time recovery, monthly restore tests, disaster recovery plan
- **Query Optimization**: 
  - Indexes on frequently queried fields (`users.email`, `users.role_id`, `sessions.user_id`, `sessions.refresh_token`)
  - Connection pooling (Prisma default: 10 connections, PgBouncer for additional pooling post-MVP)
  - Redis caching for token validation (15 min TTL), session data caching
- **Data Integrity**: Foreign key constraints, unique constraints on email, check constraints for data validation, transaction management
- **Scalability**: 
  - Connection pooling for PostgreSQL
  - Read replicas for read-heavy workloads (post-MVP)
  - Redis cluster for distributed caching (post-MVP)
  - Horizontal scaling with multiple app instances + load balancer
- **Security**: 
  - Argon2id password hashing (OWASP recommended, high cost parameters)
  - Encryption at rest (PostgreSQL TDE, AES-256 for sensitive fields)
  - Encryption in transit (TLS 1.3)
  - Token blacklist in Redis (revoked tokens)
  - Secrets management (environment variables, secure secret storage)

#### Success Criteria

**MVP Success Criteria**:
- **User Adoption**: 3+ apps integrated within first month, 100+ end users
- **Performance**: <100ms average API response time, 99.9% uptime
- **Security**: Zero critical vulnerabilities, passed security audit
- **Integration Time**: Developers integrate basic auth in <4 hours
- **User Experience**: Users can register, login, reset password without issues

**Post-MVP Goals**:
- 10+ apps integrated within 6 months
- 1000+ end users within first year
- <50ms token validation (cached)
- Support OAuth 2.0 login (Google, GitHub, Facebook)
- Multi-Factor Authentication (2FA) available

**Technology**: Backend service (Node.js + TypeScript + Express) with React admin panel  
**Location**: `~/Documents/packages/docs/projects/anchorage-center/`

### 10. `habit-tracker/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Habit Tracker (HabitFlow) is a customer-facing full-stack web and mobile application that helps users build positive habits, break bad habits, and achieve personal goals through daily tracking, streak mechanics, gamification, and social accountability.

**Target Audience**: Individuals aged 18-45 building positive habits, self-improvement enthusiasts  
**Business Model**: Freemium SaaS (Free tier: 5 habits; Premium: $9.99/month - unlimited habits, advanced analytics)

#### Key Features

1. **Habit Management**: Create, edit, delete habits with frequency settings (daily, weekly, custom)
2. **Daily Tracking**: One-tap check-in, quantity tracking, time tracking, notes
3. **Streaks**: Current streak, longest streak, streak calendar, milestone celebrations
4. **Reminders**: Custom reminder times, push notifications, email reminders, streak alerts
5. **Basic Analytics**: Completion rate, progress trends, best days analysis
6. **User Authentication**: JWT-based secure authentication with refresh tokens

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, Recharts
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, relational database for structured habit data)
- **Mobile** (Phase 2): Capacitor (iOS & Android), offline-first, push notifications
- **Infrastructure**: Docker containerization, DigitalOcean (MVP), GitHub Actions CI/CD

#### Documentation

- [Documentation Index](projects/habit-tracker/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/habit-tracker/PRD_OVERVIEW.md) - Main requirements with MVP definition
- [Architecture](projects/habit-tracker/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/habit-tracker/EXPERTS.md) - 15 expert reviews (pending)

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-11): Core habit tracking, streaks, reminders, basic analytics, user authentication
- **Phase 2 (Core)** (Months 4-6): Mobile app (React Native), advanced analytics, gamification (badges, levels, points)
- **Phase 3 (Advanced)** (Months 7-12): Social features (accountability partners, friends), habit library, premium features
- **Phase 4 (Integrations)** (Year 2+): Health integrations (Fitbit, Apple Health, Google Fit), wearables

**Target Launch**: April 15, 2026 (MVP - 11 weeks)

#### Business Value

- **Market Opportunity**: 200M+ potential users worldwide interested in habit tracking
- **User Value**: Build lasting habits (66-day average), improve consistency by 300%+, measurable progress
- **Revenue Model**: Freemium SaaS targeting $5K MRR by Month 6, $20K MRR by Month 12
- **High Retention**: Habit formation leads to daily engagement and long-term retention (60% weekly active users)
- **Success Metrics**: 10,000 users by Month 6, 60% WAU, 8-10% free-to-premium conversion

#### Expert Team (15 Experts - All Pending Review)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, prioritization, business model
- **Architecture**: Marcus Johnson (Architecture) - System architecture, scalability planning
- **Backend**: Samuel Rodriguez (Backend) - NestJS API, streak calculation, notifications
- **Frontend**: Thomas Anderson (Frontend) - Next.js dashboard, state management (Context + SWR)
- **Mobile**: Michael Brown (Mobile) - React Native app, offline-first, push notifications
- **UI/UX**: Daisy Thompson (UI/UX) - User flows, dashboard design, onboarding
- **Accessibility**: Allison Foster (Accessibility) - WCAG 2.1 AA compliance, keyboard navigation
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization, indexing
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint design
- **Security**: Ryan Kim (Security) - JWT authentication (RS256), data encryption, GDPR/CCPA
- **Performance**: James Martinez (Performance) - Optimization, caching (Redis), response times
- **DevOps**: David Cooper (DevOps) - CI/CD (GitHub Actions), Docker, deployment (DigitalOcean)
- **Observability**: Kevin Martinez (Observability) - Logging (Winston), monitoring, error tracking (Sentry)
- **Business Intelligence**: Gary Wilson (BI) - Analytics architecture, KPIs, data visualization
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, completeness

**All experts pending review as of 2026-01-22**

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Human-Computer Interaction

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates gamification mechanics for behavior change (streaks, badges, levels)
- Shows habit tracking algorithms and streak calculations
- Exemplifies freemium SaaS business model with conversion strategies
- Demonstrates mobile-first architecture with offline capabilities

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, mobile UX, gamification, API design, push notifications
- **Software Engineering**: System architecture, CI/CD pipelines, Docker containerization, modular design
- **Database Systems**: PostgreSQL schema design, query optimization, indexing strategies, Prisma ORM
- **Psychology**: Habit formation science, behavior change, motivation systems, gamification psychology
- **Security**: JWT authentication, data encryption (at rest/in transit), GDPR/CCPA compliance
- **Business**: Freemium SaaS model, subscription management, user retention strategies

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured habit data)
- **Schema Design**: Users, Habits, HabitEntries (unique constraint on habit_id + date), Reminders
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for habits, entries, streaks, reminders
- **Backup Strategy**: Automated daily backups (7-day retention), point-in-time recovery, RTO 4 hours
- **Query Optimization**: Indexes on user_id, habit_id, date; composite indexes for common query patterns
- **Data Integrity**: Foreign key constraints, unique constraints, cascade deletes
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling (10-20 connections)
- **Security**: Encryption at rest (AES-256), encryption in transit (TLS 1.3), GDPR/CCPA compliance

**Type**: Habit Tracking Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/habit-tracker/`

### 11. `home-inventory-manager/`

**Status**: Planning  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application

#### Overview
Home Inventory Manager helps homeowners and renters catalog belongings with photos, receipts, and room organization to support insurance claims and moving preparation.

#### Key Features
- Item capture with photos and barcode scanning
- Room-based organization and search
- Warranty and purchase tracking
- Insurance-ready reports

#### Tech Stack
- **Frontend**: Next.js with TypeScript
- **Backend**: Node.js (NestJS) REST API
- **Database**: PostgreSQL
- **Mobile**: React Native
- **Infrastructure**: Docker, S3-compatible storage

#### Documentation
- [PRD Overview](../projects/home-inventory-manager/PRD_OVERVIEW.md) - Product requirements and MVP definition
- [Architecture](../projects/home-inventory-manager/ARCHITECTURE.md) - System architecture and technical design
- [Documentation Index](../projects/home-inventory-manager/INDEX.md) - Navigation to all project docs
- [Expert Contributions](../projects/home-inventory-manager/EXPERTS.md) - Expert reviews and sign-offs

#### Timeline
- **MVP Development**: 10 weeks (estimated Q2 2026)
- **MVP Testing**: 2 weeks
- **Target Launch**: Q2 2026
- **Current Phase**: Planning & Documentation

#### Business Value
- **Target Market**: Homeowners and renters with insurance needs
- **Revenue Model**: Freemium with premium reporting and warranty features
- **Success Metrics**: 200 users in 60 days, 5% conversion

#### Expert Team
- **Product**: Patricia Martinez
- **Architecture**: Marcus Johnson
- **Backend**: Samuel Rodriguez
- **Frontend**: Thomas Anderson
- **Mobile**: Michael Brown
- **UI/UX**: Daisy Thompson
- **Accessibility**: Allison Foster
- **Database**: Benjamin Lee
- **API Design**: Emily Chen
- **Security**: Ryan Kim
- **Compliance**: Constance White
- **Performance**: James Martinez
- **DevOps**: David Cooper
- **Observability**: Kevin Martinez
- **Copywriting**: Olivia Martinez

### 12. `home-maintenance-tracker/`

**Status**: Planning  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application

#### Overview
Home Maintenance Tracker helps homeowners and renters proactively manage property maintenance through automated scheduling, service history tracking, and cost analysis. The platform transforms reactive repair management into proactive maintenance planning, helping users prevent costly repairs and maintain complete service records.

#### Key Features
- **Maintenance Scheduler**: Recurring tasks with pre-built templates (HVAC, plumbing, roof, appliances)
- **Automated Reminders**: Multi-channel notifications (email, push, SMS) for upcoming tasks
- **Service History**: Centralized storage for invoices, photos, warranties, and service logs
- **Asset Tracking**: Monitor home systems with purchase dates, warranties, and lifespans
- **Cost Analytics**: Track maintenance spending, forecast budgets, export reports
- **Vendor Directory**: Trusted contractor management with ratings and contact info
- **Mobile App**: Complete tasks, capture receipts, view reminders on-the-go

#### Tech Stack
- **Frontend**: Angular with TypeScript, Tailwind CSS
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker)
- **Mobile**: Capacitor (iOS & Android)
- **Infrastructure**: Docker, DigitalOcean (MVP), GitHub Actions CI/CD

#### Documentation
- [PRD Overview](../projects/home-maintenance-tracker/PRD_OVERVIEW.md) - Comprehensive product requirements with MVP definition
- [Architecture](../projects/home-maintenance-tracker/ARCHITECTURE.md) - System architecture and technical design
- [Documentation Index](../projects/home-maintenance-tracker/INDEX.md) - Navigation to all project docs
- [Expert Contributions](../projects/home-maintenance-tracker/EXPERTS.md) - Expert reviews and sign-offs

#### Timeline
- **MVP Development**: 10 weeks (estimated Q2 2026)
- **MVP Testing**: 2 weeks
- **Target Launch**: Q2 2026
- **Current Phase**: Planning & Documentation

#### Business Value
- **Target Market**: Homeowners (ages 28-50), property managers
- **Revenue Model**: Freemium - Free (1 property), Premium ($9.99/month, 5 properties), Property Manager ($29.99/month, unlimited)
- **Market Opportunity**: Prevent costly repairs through proactive maintenance, comprehensive service history
- **Success Metrics**: 500 users in 2 months, 60% weekly retention, 30% free-to-paid conversion

#### Expert Team
- **Product**: Patricia Martinez (MVP definition, business model, prioritization)
- **Architecture**: Marcus Johnson (system design, technology stack, scalability)
- **Backend**: Samuel Rodriguez (API design, database schema, NestJS)
- **Frontend**: Thomas Anderson (Next.js, React, state management)
- **Mobile**: Michael Brown (React Native, push notifications, offline support)
- **UI/UX**: Daisy Thompson (user flows, responsive design, onboarding)
- **Accessibility**: Allison Foster (WCAG compliance, keyboard navigation)
- **Database**: Benjamin Lee (schema optimization, query performance)
- **API Design**: Emily Chen (RESTful API, endpoint structure)
- **Security**: Ryan Kim (JWT authentication, OAuth, data protection)
- **Performance**: James Martinez (optimization, response times, caching)
- **Observability**: Kevin Martinez (monitoring, logging, alerting)
- **DevOps**: David Cooper (CI/CD, Docker, deployment)
- **Business Intelligence**: Gary Wilson (cost tracking, analytics, reporting)
- **Copywriter**: Olivia Martinez (app naming, UI text, brand voice)
- **Documentation**: Dorothy Clark (PRD structure, documentation quality)

#### Academic Classification
- **Primary**: Computer Science - Web Development, Mobile Development, Human-Computer Interaction
- **Secondary**: Software Engineering - API Design, Database Systems, System Architecture

#### Educational Value
- Demonstrates real-world scheduling and reminder systems
- Illustrates service history tracking and data persistence
- Showcases mobile-first design and cross-platform development
- Example of freemium business model implementation

#### Subject Matter Areas
- **Computer Science**: Event scheduling, notification systems, API design, database design, mobile development
- **Software Engineering**: UX for maintenance workflows, cross-platform development, CI/CD pipelines
- **Business**: Freemium business models, user retention strategies, SaaS pricing

### 13. `medical-records-manager/`

**Status**: Planning  
**Priority**: High  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)  
**Also Known As**: HealthVault

#### Overview

**Medical Records Manager** is a secure, HIPAA-compliant application for organizing personal and family medical records, appointments, prescriptions, and test results. Users can store encrypted documents, track appointment history, receive smart reminders, and share records securely with healthcare providers using temporary access links with full audit logging.

**Vision**: Empower individuals and families to take control of their health information with a secure, easy-to-use platform that simplifies medical record management and improves care coordination.

#### Key Features

**MVP (Phase 1)**:
- Medical Records Vault with encrypted storage (AES-256), categorization, and search
- Appointment Tracking with email reminders (24 hours before)
- Basic Profile Management with emergency contact information
- HIPAA-Compliant Security (encryption at rest and in transit, audit logging)
- Mobile-Responsive Web App (mobile-first design, touch-friendly interface)

**Phase 2 (Months 4-6)**:
- Family Profile Management with role-based access (admin, view-only)
- Medication Tracking with reminders and refill alerts
- Native Mobile App (React Native) with document scanning and push notifications
- Secure Sharing with temporary links, expiration dates, and audit logging

**Phase 3 (Months 7-12)**:
- Reports & Export (PDF export, emergency medical summaries, insurance-ready reports)
- Advanced Search with OCR (optical character recognition for full-text search)
- Provider Integration (healthcare provider directory, EHR integration if partnerships secured)

#### Tech Stack

**Frontend**:
- Framework: Next.js 14 with React 18 and TypeScript
- Styling: Tailwind CSS with custom design system
- Forms: React Hook Form with Zod validation
- State Management: React Query (server state) + Context API (client state)
- Mobile: Responsive web app (MVP), React Native with Expo (Phase 2)

**Backend**:
- Runtime: Node.js 20 with NestJS framework
- Language: TypeScript
- API: RESTful API with OpenAPI/Swagger documentation
- Authentication: JWT tokens with refresh tokens, bcrypt password hashing
- Background Jobs: Bull queue with Redis for email/SMS notifications

**Database**:
- Primary: PostgreSQL 16 with encryption at rest (AES-256)
- Caching: Redis for sessions, rate limiting, and job queues
- File Storage: AWS S3 with server-side encryption (SSE-S3)

**Infrastructure**:
- Cloud: AWS (EC2, RDS, S3, CloudFront, CloudWatch)
- Containerization: Docker with Docker Compose (MVP), Kubernetes (Phase 3)
- CI/CD: GitHub Actions for automated testing and deployment
- Monitoring: CloudWatch, Sentry for error tracking

**Third-Party Services**:
- SendGrid (email notifications)
- Twilio (SMS notifications - Phase 2)
- Stripe (subscription payments)
- Firebase Cloud Messaging (push notifications - Phase 2)

#### Documentation

- [PRD Overview](../projects/medical-records-manager/PRD_OVERVIEW.md) - Comprehensive requirements with MVP definition
- [Architecture](../projects/medical-records-manager/ARCHITECTURE.md) - Technical architecture and system design
- [Documentation Index](../projects/medical-records-manager/INDEX.md) - Complete documentation overview
- [Expert Contributions](../projects/medical-records-manager/EXPERTS.md) - Expert reviews and sign-offs

#### Timeline

- **Phase 1 (MVP)**: Months 1-4
  - Development: 12 weeks (authentication, records vault, appointments, mobile-responsive design)
  - Testing: 4 weeks (security audit, HIPAA compliance, beta testing)
  - Launch: Week 17 (Target: Q2 2026)
- **Phase 2**: Months 5-7 (family profiles, medications, mobile app, secure sharing)
- **Phase 3**: Months 8-12 (reports, OCR, provider integration, international expansion)

#### Business Value

**Revenue Model**: Freemium with premium subscription tiers
- **Free Tier**: 1 profile, 50 documents (500 MB), basic features
- **Pro Tier**: $9.99/month ($99/year) - 3 profiles, unlimited documents, medication tracking, secure sharing
- **Premium Tier**: $19.99/month ($199/year) - Unlimited profiles, unlimited storage, premium support

**Success Metrics**:
- **User Adoption**: 10,000 active users within 6 months
- **Engagement**: 75% weekly active user rate
- **Premium Conversion**: 15% conversion from free to premium
- **Revenue**: $50K MRR by month 12
- **Retention**: 70% retention rate after 3 months

**Market Opportunity**: Large addressable market (families, chronic condition patients, caregivers) with high pain points (scattered records, missed appointments, fragmented care coordination) and high value (privacy-critical health information management).

#### Expert Team

- **Patricia Martinez** - Product Manager (Prioritization, Business Decisions)
- **Ryan Kim** - Security Expert (HIPAA, PHI Protection, Encryption)
- **Constance White** - Compliance Expert (HIPAA, Medical Regulations)
- **Samuel Rodriguez** - Backend Expert (API Design, Data Storage)
- **Daisy Thompson** - UI/UX Expert (User Interface, User Experience)
- **Allison Foster** - Accessibility Expert (WCAG Compliance, Screen Readers)
- **Benjamin Lee** - Database Expert (Medical Data Modeling)
- **Emily Chen** - API Design Expert (RESTful API, Security)
- **Kevin Martinez** - Observability Expert (Audit Logging, Monitoring)
- **David Cooper** - DevOps Expert (Deployment, CI/CD, Backups)
- **Michael Brown** - Mobile Expert (React Native, Document Scanning)
- **Dorothy Clark** - Documentation Expert (PRD Structure, Clarity)

#### Key Priorities

1. **HIPAA Compliance** (Non-Negotiable): Must meet all HIPAA Privacy Rule and Security Rule requirements from day one
2. **Security**: Encryption at rest (AES-256) and in transit (TLS 1.3), secure authentication (JWT, bcrypt), audit logging
3. **User Privacy**: Clear privacy controls, secure sharing with temporary links, user data ownership
4. **Accessibility**: WCAG AA compliance (color contrast, touch targets, screen reader support)
5. **Mobile-First**: Document scanning (Phase 2), quick access to emergency information, reminders

#### Risks & Mitigation

**Critical Risks**:
- **HIPAA Compliance Failure**: Hire compliance consultant, regular security audits, BAA with AWS
- **Data Breach**: Security-first development, penetration testing, bug bounty program, incident response plan
- **Low User Adoption**: Extensive user research, beta testing, clear value proposition, content marketing

**Business Risks**:
- **High CAC**: Focus on organic growth (SEO, content), optimize paid ads, referral program
- **Low Premium Conversion**: Carefully designed free tier limits, in-app upgrade prompts, limited-time offers

#### Current Status

- **Phase**: Planning
- **Last Updated**: 2026-01-24
- **Next Steps**: 
  - Conduct HIPAA compliance consultation
  - Finalize AWS infrastructure design
  - Begin MVP development (authentication and profile management)
  - Set up security and monitoring infrastructure
  - Prepare for HIPAA compliance audit before launch
- **Academic Classification**: Computer Science - Web Development, Security, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates secure document management
  - Illustrates scheduling and reminder workflows
- **Subject Matter Areas**:
  - Computer Science: Access control, data security, API design
  - Software Engineering: UX for sensitive data

### 14. `family-care-coordinator/`

**Status**: Planning  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview
Family Care Coordinator is a customer-facing app that helps families coordinate care responsibilities, schedules, and critical information across parents, caregivers, and relatives. It provides shared calendars, task assignments, medication routines, and secure document access with role-based permissions.

**Target Audience**: Families coordinating childcare or elder care, caregivers managing schedules, extended family supporters  
**Business Model**: Freemium (Free: 1 dependent, limited storage; Premium: multiple profiles, advanced reminders, unlimited storage)

#### Key Features
1. **Shared Care Calendar**: Appointments, routines, and coverage schedules
2. **Task Assignments**: Checklists with ownership and completion tracking
3. **Medication & Routine Tracking**: Reminders and adherence logs
4. **Profiles & Permissions**: Role-based access and emergency contacts
5. **Document Vault**: Secure storage for care plans and IDs
6. **Notifications**: Task reminders and schedule change alerts

#### Tech Stack
- **Frontend**: Angular with TypeScript
- **Backend**: PHP (Slim framework) REST API
- **Database**: MySQL (via Docker)
- **Mobile**: Capacitor (iOS & Android)
- **Storage**: S3-compatible object storage

#### Documentation
- [Documentation Index](projects/family-care-coordinator/INDEX.md)
- [PRD Overview](projects/family-care-coordinator/PRD_OVERVIEW.md)
- [Architecture](projects/family-care-coordinator/ARCHITECTURE.md)
- [Expert Contributions](projects/family-care-coordinator/EXPERTS.md)

#### Academic Classification
- Computer Science: Web Development, Human-Computer Interaction
- Software Engineering: Collaboration tools, access control

### 15. `travel-itinerary-wallet/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium-High  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

**Note**: This project now incorporates AI-powered itinerary generation features from Smart Travel Planner (project merged 2026-02-09), creating a comprehensive all-in-one travel management platform.

#### Overview

Travel Itinerary & Document Wallet (TripVault) is a customer-facing full-stack web and mobile application that centralizes travel plans, reservations, and critical travel documents with AI-powered planning assistance. Users can generate personalized itineraries with AI, store tickets and documents securely, receive automated alerts for schedule changes and expirations, and access everything offline while traveling.

**Target Audience**: Frequent travelers, families, business travelers, international travelers (150M US travelers)  
**Business Model**: Freemium (Free tier: 1 active trip; Premium: $9.99/month for unlimited trips and AI features)

#### Key Features

**MVP Features**:
1. **Itinerary Builder**: Day-by-day trip planning with flights, hotels, activities
2. **Reservation & Ticket Vault**: Store flight/hotel confirmations with QR code access
3. **Document Wallet**: Secure storage for passports, visas, insurance with expiration tracking (AES-256 encryption)
4. **Automated Alerts**: Push notifications and email for departures, check-ins, document expirations
5. **Offline-First Mobile App**: React Native app with full offline access to itineraries and documents
6. **User Authentication**: JWT-based secure authentication with bcrypt password hashing

**Phase 2 Features** (Merged from Smart Travel Planner):
- **AI-Powered Itinerary Generation**: Generate personalized day-by-day itineraries from simple inputs
- Email parsing and auto-import of flight/hotel confirmations
- Family collaboration with role-based access

**Phase 3 Features**:
- **Budget Management with AI**: Track expenses, AI-powered budget recommendations
- **Smart Packing Lists**: Auto-generated based on destination, weather, activities
- Multi-trip dashboard and calendar view

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, for trips, users, documents metadata)
- **File Storage**: AWS S3 or DigitalOcean Spaces (AES-256 encrypted documents)
- **Mobile**: Capacitor (iOS & Android), push notifications, offline storage
- **Infrastructure**: Docker containerization, DigitalOcean, GitHub Actions CI/CD

#### Documentation

- [Documentation Index](projects/travel-itinerary-wallet/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/travel-itinerary-wallet/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](projects/travel-itinerary-wallet/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/travel-itinerary-wallet/EXPERTS.md) - 17 expert team

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-14): Itinerary builder, reservation vault, document wallet, automated alerts, user authentication, mobile app (offline-first)
- **Phase 2 (Core)** (Months 4-6): Email parsing & auto-import, family collaboration, advanced alerts, trip export
- **Phase 3 (Advanced)** (Months 7-12): Multi-trip dashboard, expense tracking, social features, API integrations

**Target Launch**: Q2 2026 (Week 15 - MVP Soft Launch)

#### Business Value

- **Market Opportunity**: 150M US travelers, frequent business/leisure travelers, international travelers
- **User Value**: Centralized organization, offline access, automated alerts, secure document storage, peace of mind
- **Revenue Model**: Freemium SaaS targeting $5K MRR by Month 6, $15K MRR by Month 12
- **Time Savings**: Reduce travel stress, quick access to confirmations/documents, automated reminders
- **Success Metrics**: 1,000 users (Month 1), 5,000 (Month 3), 20,000 (Month 12), 8-12% free-to-premium conversion

#### Expert Team (17 Experts)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, business model ✅ Approved
- **Architecture**: Marcus Johnson (Architecture) - System design, tech stack ✅ Approved
- **Backend**: Samuel Rodriguez (Backend) - NestJS API, Prisma ORM, background jobs ⏳ Pending
- **Frontend**: Thomas Anderson (Frontend) - Next.js, SSR/CSR, SWR ⏳ Pending
- **Mobile**: Michael Brown (Mobile) - React Native, offline-first, push notifications ⏳ Pending
- **UI/UX**: Daisy Thompson (UI/UX) - Travel itinerary UX, document management ⏳ Pending
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization ⏳ Pending
- **API Design**: Emily Chen (API Design) - RESTful API patterns ⏳ Pending
- **Security**: Ryan Kim (Security) - JWT auth, AES-256 encryption, OWASP compliance ⏳ Pending
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance ⏳ Pending
- **Performance**: James Martinez (Performance) - Caching, offline sync ⏳ Pending
- **DevOps**: David Cooper (DevOps) - Docker, CI/CD, DigitalOcean ⏳ Pending
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring ⏳ Pending
- **i18n**: Lisa Garcia (i18n) - Multi-language support (Phase 2+) ⏳ Pending
- **Copywriter**: Olivia Martinez (Copywriter) - App naming (TripVault), UI copy ⏳ Pending
- **Compliance**: Constance White (Compliance) - GDPR/CCPA for document storage ⏳ Pending
- **Documentation**: Dorothy Clark (Documentation) - PRD structure ✅ Approved

**Expert Sign-offs**: 3 approved (Patricia Martinez, Marcus Johnson, Dorothy Clark), 14 pending

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Human-Computer Interaction

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates offline-first mobile architecture with AsyncStorage and background sync
- Shows secure document storage with AES-256 encryption and pre-signed URLs
- Exemplifies background job processing (Bull + Redis) for automated alerts
- Demonstrates freemium SaaS business model with conversion strategies
- Illustrates JWT authentication and bcrypt password hashing

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, mobile UX, offline sync, push notifications, background jobs, file encryption
- **Software Engineering**: API design, offline-first architecture, document storage, alert systems
- **Database Systems**: PostgreSQL schema design, query optimization, Prisma ORM
- **Security**: JWT authentication, AES-256 encryption, OWASP Top 10 compliance, secure file storage
- **Business**: Freemium SaaS model, subscription management, go-to-market strategy

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for trips, users, documents metadata)
- **Schema Design**: Users, trips, itinerary entries, reservations, documents, alert settings
- **Migration Strategy**: Prisma migrations for schema versioning
- **Data Persistence**: Persistent storage for trips, documents metadata, reservations with automated backups
- **Backup Strategy**: DigitalOcean managed database automated backups (7-day retention)
- **Query Optimization**: Indexes on userId, tripId, startDate, expirationDate for fast queries
- **Data Integrity**: Foreign key constraints, cascade deletes, check constraints
- **Scalability**: Connection pooling (10 connections MVP), read replicas (post-MVP)
- **Security**: Encryption at rest (managed database), encryption in transit (TLS 1.2/1.3), GDPR/CCPA compliance

**Type**: Travel Planning Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/travel-itinerary-wallet/`

### 16. `vehicle-maintenance-tracker/`
- **Type**: Vehicle Maintenance Application (AutoCare)
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
  - Mobile: Capacitor (iOS & Android)
- **Location**: `~/Documents/vehicle-maintenance-tracker/`
- **Description**: Customer-facing application for vehicle maintenance scheduling, service history tracking, and total ownership cost analysis
- **Documentation**:
  - [Documentation Index](../projects/vehicle-maintenance-tracker/INDEX.md)
  - [PRD Overview](../projects/vehicle-maintenance-tracker/PRD_OVERVIEW.md)
  - [Architecture](../projects/vehicle-maintenance-tracker/ARCHITECTURE.md)
  - [Expert Contributions](../projects/vehicle-maintenance-tracker/EXPERTS.md)
- **MVP Features**:
  - Vehicle profile creation (VIN, make, model, mileage)
  - Maintenance schedule setup (time and mileage-based)
  - Service history logging (date, cost, notes)
  - Email reminders for upcoming maintenance
  - Simple dashboard with vehicle status
- **Post-MVP Features**:
  - Expense tracking (fuel, insurance, repairs)
  - Document storage (invoices, receipts)
  - Multi-vehicle support
  - React Native mobile apps (iOS/Android)
  - Advanced reports and analytics
  - Premium tier ($9.99/mo)
- **Status**: Planning - Ready for Development
- **Priority**: Medium
- **Timeline**: 10 weeks MVP (8 weeks dev + 2 weeks testing), Launch: March 15, 2026
- **Target Users**: Car owners (1-2 vehicles), families (3+ vehicles), used-car owners
- **Business Model**: Freemium (Free tier + Premium $9.99/mo)
- **Success Metrics**: 200 users (Month 1), 1,000 (Month 6), 10% premium conversion
- **Expert Team**: 14 experts (Product, Architecture, Backend, Frontend, Database, Mobile, UI/UX, Accessibility, Security, API Design, DevOps, Performance, Documentation, Copywriter)
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction, Database Systems
- **Educational Value**:
  - Demonstrates full-stack web + mobile development
  - Illustrates maintenance scheduling algorithms and reminder systems
  - Shows real-world business model (freemium SaaS)
- **Subject Matter Areas**:
  - Computer Science: Event scheduling, data modeling, API design, notification systems
  - Software Engineering: System architecture, CI/CD, deployment strategies
  - Business: Freemium model, pricing strategy, go-to-market planning

### 17. `meal-planner-grocery/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)

#### Overview

Meal Planner & Grocery List (MealFlow) is a comprehensive meal planning and grocery list application that helps individuals and families plan meals, manage recipes, generate smart grocery lists, track pantry inventory, and reduce food waste. The platform transforms the stressful "what's for dinner" question into an organized, efficient system that saves time, money, and reduces food waste.

**Target Audience**: Busy families (ages 28-45), home cooks, health-conscious individuals, budget-conscious shoppers  
**Business Model**: Freemium (Free tier with basic features, Premium $9.99/month for unlimited access)

#### Key Features

1. **Meal Planning Calendar**: Visual weekly/monthly calendar with drag-and-drop meal assignment
2. **Auto-Generated Grocery Lists**: Smart grocery lists from meal plans, organized by store section
3. **Recipe Collection**: Save, organize, and share recipes with family
4. **Pantry Tracking**: Track pantry inventory, expiration dates, low-stock alerts
5. **Food Waste Reduction**: Expiration alerts and use-it-up meal suggestions
6. **Nutrition Tracking** (Phase 3): Track calories, macros, health goals
7. **Mobile App** (Phase 2): React Native with offline grocery lists, barcode scanning
8. **Family Collaboration**: Shared meal plans and grocery lists

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, Angular CDK (drag-and-drop)
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker)
- **Mobile** (Phase 2+): Capacitor (iOS & Android), push notifications
- **Infrastructure**: Docker containerization, DigitalOcean (MVP), GitHub Actions CI/CD

#### Documentation

- [Documentation Index](projects/meal-planner-grocery/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/meal-planner-grocery/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](projects/meal-planner-grocery/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/meal-planner-grocery/EXPERTS.md) - 15 expert sign-offs

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-12): Meal planning calendar, recipe collection, auto-generated grocery lists, simple pantry tracking, user authentication
- **Phase 2 (Core)** (Months 4-6): React Native mobile app, recipe import from URLs, barcode scanning, family accounts, expiration alerts
- **Phase 3 (Advanced)** (Months 7-12): AI meal suggestions, nutrition tracking, budget tracking, recipe integration with recipes project

**Target Launch**: May 2026 (MVP - 10 weeks development + 2 weeks testing)

#### Business Value

- **Market Opportunity**: 130 million US households who eat at home regularly
- **User Value**: Save 2+ hours/week on meal planning, reduce food waste by 30%, save 15% on grocery spending
- **Revenue Model**: Freemium SaaS targeting $20K MRR by Month 12
- **Time Savings**: Reduce meal planning from 2+ hours/week to <15 minutes
- **Success Metrics**: 500 users (Month 1), 2,000 (Month 3), 10,000 (Month 12), 8-12% free-to-premium conversion

#### Expert Team (15 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, business model, prioritization
- **Architecture**: Marcus Johnson (Architecture) - System architecture, scalability planning
- **Backend**: Samuel Rodriguez (Backend) - API design, grocery list generation algorithm
- **Frontend**: Thomas Anderson (Frontend) - Next.js, React DnD, state management
- **Mobile**: Michael Brown (Mobile) - React Native, offline grocery lists, barcode scanning
- **UI/UX**: Daisy Thompson (UI/UX) - User flows, meal planner calendar UX
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint design
- **Security**: Ryan Kim (Security) - JWT authentication, data encryption, GDPR compliance
- **Performance**: James Martinez (Performance) - Caching, response time targets
- **DevOps**: David Cooper (DevOps) - Docker, CI/CD, deployment strategy
- **Business Intelligence**: Gary Wilson (BI) - Analytics architecture, KPI definition
- **Copywriter**: Olivia Martinez (Copywriter) - App naming (MealFlow), value proposition
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, completeness

**All experts approved and signed off on 2026-01-21**

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Human-Computer Interaction

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates grocery list auto-generation algorithm (ingredient consolidation, grouping, sorting)
- Shows drag-and-drop UI patterns (React DnD) for intuitive meal planning
- Exemplifies freemium SaaS business model with conversion strategies
- Demonstrates offline-first mobile architecture (AsyncStorage, background sync)
- Illustrates food waste reduction through expiration tracking and smart suggestions

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, mobile UX, drag-and-drop interfaces, offline-first architecture, RESTful API design
- **Software Engineering**: System architecture, business logic (grocery list generation), CI/CD pipelines, Docker containerization
- **Database Systems**: PostgreSQL schema design, query optimization, data relationships (recipes, meal plans, grocery lists)
- **Security**: JWT authentication, row-level security, data encryption (at rest and in transit), GDPR/CCPA compliance
- **Business**: Freemium SaaS model, subscription management, user acquisition, retention strategies

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured meal planning data)
- **Schema Design**: Users, Recipes, Ingredients, MealPlans, GroceryLists, GroceryListItems, PantryItems
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for recipes, meal plans, grocery lists, pantry inventory
- **Backup Strategy**: Automated daily backups, point-in-time recovery
- **Query Optimization**: Indexes on `user_id`, `meal_date`, `expiration_date` for fast queries, connection pooling
- **Data Integrity**: Foreign key constraints, unique constraints, timestamps (`created_at`, `updated_at`)
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling (10 MVP, 20-30 production)
- **Security**: Encryption at rest (PostgreSQL disk encryption), encryption in transit (TLS 1.2/1.3), GDPR/CCPA compliance

**Type**: Meal Planning Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/meal-planner-grocery/`

### 18. `recipes/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)

#### Overview

Recipes is a full-stack web and mobile application designed to help home cooks and families discover, save, organize, and execute recipes with confidence. The platform provides a mobile-first experience with intelligent meal planning, automated grocery lists, and an optimized cooking mode that guides users through recipes step-by-step.

**Target Audience**: Home cooks and families (25-55 years old), meal planners, diet-conscious users, cooking enthusiasts  
**Business Model**: Freemium (Free tier: 100 recipes, Premium $7.99/month for unlimited recipes and advanced features)

#### Key Features

1. **Recipe Library**: Save and organize recipes with powerful search, tags, and collections
2. **Cooking Mode** (MVP): Mobile-optimized step-by-step cooking interface with built-in timers and hands-free navigation
3. **Basic Meal Planning** (MVP): 7-day meal planner with drag-and-drop simplicity
4. **Recipe Collections** (MVP): Organize recipes into custom collections
5. **Recipe Import from URLs** (Phase 2): Import recipes from any website automatically
6. **Auto-Generated Grocery Lists** (Phase 2): Smart grocery lists from meal plans
7. **Native Mobile App** (Phase 2): React Native iOS and Android apps with offline access
8. **Nutrition Insights** (Phase 3): Calorie, protein, carb, and fat tracking
9. **Dietary Filters** (Phase 3): Filter by diet (vegan, gluten-free, etc.) and allergies

#### Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js 20+ with NestJS framework, Prisma ORM
- **Database**: PostgreSQL 16 with full-text search (pg_trgm, tsvector)
- **Mobile** (Phase 2): React Native + Expo with offline-first architecture, SQLite, push notifications
- **Infrastructure**: Vercel (frontend), Railway/DigitalOcean (backend), GitHub Actions CI/CD, Docker

#### Documentation

- [Documentation Index](../projects/recipes/INDEX.md) - Complete navigation guide with general feature references
- [PRD Overview](../projects/recipes/PRD_OVERVIEW.md) - Main requirements document with comprehensive MVP definition
- [Architecture](../projects/recipes/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](../projects/recipes/EXPERTS.md) - 16 expert sign-offs
- [Cooking Mode Feature](../projects/recipes/features/cooking-mode.md) - Detailed cooking mode specification
- [Database Schema](../projects/recipes/technical/database-schema.md) - PostgreSQL schema with Prisma
- [Revenue Model](../projects/recipes/business/revenue-model.md) - Business model and financial projections
- [Data Privacy](../projects/recipes/compliance/data-privacy.md) - GDPR/CCPA compliance

#### MVP Features (Phase 1 - 11 weeks)

1. **Recipe Library**: Save up to 100 recipes (free tier), manual entry, search, tags, favorites
2. **Recipe Collections**: Create up to 3 collections (free tier) to organize recipes
3. **Basic Meal Planner**: 7-day meal planning calendar, schedule recipes to days
4. **Cooking Mode**: Step-by-step mobile-optimized cooking interface with built-in timers, large text, hands-free navigation
5. **Mobile-Responsive Web App (PWA)**: Works on all devices, offline recipe access via service workers

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-11): Recipe library (manual entry), collections, basic meal planner (7 days), cooking mode, PWA (8 weeks dev + 2 weeks testing + 1 week launch)
- **Phase 2 (Core)** (Months 4-6): Recipe import from URLs, auto-generated grocery lists, React Native mobile app (iOS/Android), recipe sharing
- **Phase 3 (Advanced)** (Months 7-9): Nutrition insights, dietary preferences and allergy warnings, smart recommendations, voice commands

**Target MVP Launch**: April 2026

#### Business Value

- **Market Opportunity**: 130 million US households, meal planning market growing 8-10% annually
- **User Value**: Organize scattered recipes, save 30+ minutes/week on meal planning, mobile-optimized cooking experience
- **Revenue Model**: Freemium SaaS targeting $6,400 MRR by Month 12, $20K MRR by Month 24
- **Time Savings**: Reduce meal planning from 45+ minutes to <5 minutes, organize recipes in <2 minutes
- **Success Metrics**: 10,000 users (Month 12), 8% free-to-premium conversion, 65% weekly return rate, 70% mobile usage, 5% monthly churn

#### Expert Team (16 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, freemium model, prioritization
- **Architecture**: Marcus Johnson (Architecture) - Three-tier architecture, scalability
- **Backend**: Samuel Rodriguez (Backend) - NestJS API, JWT authentication
- **Frontend**: Thomas Anderson (Frontend) - Next.js 14 App Router, PWA
- **Mobile**: Michael Brown (Mobile) - React Native offline-first architecture
- **UI/UX**: Daisy Thompson (UI/UX) - Cooking mode UX, meal planner design
- **Accessibility**: Allison Foster (Accessibility) - WCAG 2.1 AA compliance
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, full-text search
- **API Design**: Emily Chen (API Design) - RESTful API patterns
- **Security**: Ryan Kim (Security) - JWT authentication, data protection
- **Performance**: James Martinez (Performance) - Query optimization, caching
- **DevOps**: David Cooper (DevOps) - CI/CD, Vercel/Railway deployment
- **Compliance**: Constance White (Compliance) - GDPR/CCPA compliance
- **Copywriter**: Olivia Martinez (Copywriter) - App naming, value proposition messaging
- **SEO**: Amanda Davis (SEO) - Recipe schema markup, SEO strategy
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, completeness

**All experts approved and signed off on 2026-01-23**

#### Academic Classification

**Primary**: Computer Science - Full-Stack Development, Mobile Development, Human-Computer Interaction

**Educational Value**:
- Demonstrates full-stack architecture (Next.js 14 App Router, NestJS, React Native, PostgreSQL)
- Illustrates mobile-first design principles and PWA implementation
- Shows PostgreSQL full-text search implementation (tsvector, pg_trgm)
- Exemplifies freemium SaaS business model with conversion strategies
- Demonstrates offline-first mobile architecture with SQLite and sync queue
- Illustrates JWT authentication with refresh token rotation
- Shows cooking-specific UX patterns (step-by-step navigation, timers, hands-free)

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, mobile-first UX, offline-first architecture, full-text search, RESTful API design
- **Software Engineering**: Three-tier architecture, microservices-ready design, CI/CD pipelines, Docker containerization
- **Database Systems**: PostgreSQL schema design, full-text search indexes (GIN), query optimization, JSONB for flexible metadata
- **Security**: JWT authentication with refresh tokens, bcrypt password hashing, HTTPS/TLS encryption, rate limiting
- **Business**: Freemium SaaS model ($7.99/month premium), subscription management, conversion optimization, LTV:CAC analysis

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database with full-text search capabilities)
- **Schema Design**: Users, Recipes, Ingredients, Instructions, Tags, RecipeTags, Collections, RecipeCollections, MealPlans
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for recipes, meal plans, collections, user data
- **Backup Strategy**: Automated daily backups managed by hosting provider (Railway/DigitalOcean)
- **Query Optimization**: 
  - GIN index on `search_vector` for full-text search
  - Indexes on `user_id`, `is_favorite`, `scheduled_date` for fast queries
  - Connection pooling with Prisma
- **Full-Text Search**: PostgreSQL tsvector with pg_trgm extension, weighted search (title: weight A, description: weight B)
- **Data Integrity**: Foreign key constraints, unique constraints (email), cascade deletes, timestamps (`created_at`, `updated_at`)
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling, horizontal scaling of API servers
- **Security**: Encryption at rest (managed by hosting provider), encryption in transit (TLS 1.2/1.3), GDPR/CCPA compliance

**Type**: Recipe Management Platform  
**Technology**: Full-stack web + mobile (Next.js, NestJS, React Native, PostgreSQL)  
**Location**: `~/Documents/packages/docs/projects/recipes/`

### 19. `subscription-bill-manager/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Subscription & Bills Manager (working name: BillGuard) is a customer-facing full-stack web and mobile application that helps users discover, track, and optimize recurring expenses. The platform centralizes subscriptions, utilities, insurance, and memberships, providing price change alerts, renewal reminders, cancellation assistance, and spending analytics to help users reduce monthly costs and avoid surprise charges.

**Target Audience**: Budget-conscious consumers (ages 25-45), families managing household expenses, anyone with multiple subscriptions  
**Business Model**: Freemium (Free tier: up to 10 subscriptions; Premium: $9.99/month for unlimited)

#### Key Features

1. **Manual Subscription Entry**: Add subscriptions with billing details (name, cost, cycle, renewal date)
2. **Renewal Tracking & Calendar View**: View upcoming renewals in chronological order
3. **Email Renewal Alerts**: Automated email notifications 7 days before renewals
4. **Simple Dashboard**: Total monthly spend, upcoming renewals, subscription list
5. **User Authentication (JWT)**: Secure registration, login, password reset
6. **Basic Analytics**: Monthly spend chart, category breakdown, subscription count
7. **Price Change Detection** (Phase 2): Automatic price increase alerts
8. **Cancellation Assistant** (Phase 2): Step-by-step cancellation guidance
9. **Mobile App** (Phase 2): React Native with push notifications, offline access
10. **Trial Tracking** (Phase 3): Track free trials, prevent unwanted conversions

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, for structured subscription data)
- **Background Jobs**: Cron jobs (email queue, scheduled alerts)
- **Email**: PHPMailer with SendGrid/Mailgun (renewal alerts, auth emails)
- **Mobile** (Phase 2+): Capacitor (iOS & Android), push notifications
- **Infrastructure**: Docker containerization, DigitalOcean (MVP), GitHub Actions CI/CD

#### Documentation

- [Documentation Index](projects/subscription-bill-manager/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/subscription-bill-manager/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Expert Contributions](projects/subscription-bill-manager/EXPERTS.md) - 17 expert team members (pending review)

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-10): Manual subscription entry, renewal tracking, email alerts, simple dashboard, user auth, basic analytics
- **Testing Phase** (Weeks 11-12): Internal testing, beta testing (50 users), bug fixes
- **Phase 2 (Core)** (Months 3-6): Mobile app (React Native), price change detection, cancellation assistant, advanced analytics
- **Phase 3 (Advanced)** (Months 7-12): Trial tracking, household sharing, negotiation scripts

**Target Launch**: April 2026 (Week 13) - MVP Soft Launch

#### Business Value

- **Market Demand**: 85% of consumers have subscriptions, average 12 per household costing $240-600/month
- **User Value**: Save average $50/month from cancellations and price change avoidance
- **Revenue Model**: Freemium SaaS targeting $10K MRR by Month 6, $50K MRR by Month 12
- **Market Gap**: No dominant player in subscription management space
- **Complementary**: Works with personal-budget-manager, financial-goal-saver

#### Expert Team (17 Experts - All Pending Review)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, prioritization
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, completeness
- **Architecture**: Marcus Johnson (Architecture) - System design, scalability
- **Backend**: Samuel Rodriguez (Backend) - API design, subscription tracking logic
- **Frontend**: Thomas Anderson (Frontend) - Next.js, React, dashboard UI
- **Mobile**: Michael Brown (Mobile) - React Native app (Phase 2+), push notifications
- **UI/UX**: Daisy Thompson (UI/UX) - Dashboard design, user flows
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint structure
- **Business Intelligence**: Gary Wilson (BI) - Analytics architecture, KPI definition
- **Security**: Ryan Kim (Security) - JWT authentication, data encryption
- **Compliance**: Constance White (Compliance) - GDPR, CCPA, PCI DSS compliance
- **Performance**: James Martinez (Performance) - Optimization, caching strategies
- **DevOps**: David Cooper (DevOps) - CI/CD, Docker, deployment
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring, error tracking
- **Copywriter**: Olivia Martinez (Copywriter) - App naming (BillGuard), UI copy

**All experts pending review as of 2026-01-22**

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Business Information Systems

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates recurring expense tracking and analytics systems
- Shows notification and alert architecture (email, push notifications, background jobs)
- Exemplifies freemium SaaS business model
- Demonstrates background job processing (Bull + Redis) for scheduled tasks
- Illustrates date/time calculations for renewal tracking

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, API design, mobile UX, notification systems, background jobs, scheduled tasks
- **Software Engineering**: Modular architecture (NestJS modules), RESTful API design, CI/CD pipelines, Docker containerization
- **Database Systems**: PostgreSQL schema design, query optimization, indexing strategies (renewal_date), Prisma ORM, connection pooling
- **Security**: JWT authentication, bcrypt password hashing, data encryption (at rest/in transit), GDPR/CCPA compliance
- **Business**: Freemium SaaS model, subscription management, financial analytics, user retention strategies

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured subscription data)
- **Schema Design**: Users, subscriptions, categories, alerts, settings with proper relationships
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for subscriptions, alerts, user settings
- **Backup Strategy**: Automated daily backups (DigitalOcean managed), point-in-time recovery, 7-day retention
- **Query Optimization**: Indexes on user_id, renewal_date, created_at; connection pooling (10 connections MVP)
- **Data Integrity**: Foreign key constraints, unique constraints, check constraints for data validation
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling, horizontal scaling
- **Security**: Encryption at rest (AES-256 for database), encryption in transit (TLS 1.3), GDPR/CCPA compliance

**Type**: Subscription & Bills Management Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/subscription-bill-manager/`

### 20. `pet-care-manager/`

**Status**: Planning (PRD + Architecture Complete)  
**Priority**: High  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Pet Care Manager is a comprehensive, customer-facing full-stack web and mobile application that helps pet owners manage all aspects of pet care. It centralizes health records, vet appointments, medications, vaccinations, grooming schedules, feeding routines, and expenses into one convenient platform. Pet owners gain peace of mind through automated reminders, proactive health tracking, and complete visibility into their pet's care history.

**Target Audience**: Pet owners (67 million US households with 143 million pets)  
**Business Model**: Freemium (Free tier for 1 pet, Premium $7.99/month for unlimited pets + advanced features)

#### Key Features

**MVP Features**:
1. **Pet Profiles**: Create profiles with photos, basic info, species/breed information
2. **Medication Tracking & Reminders**: Schedule medications with automatic reminders, dose logging, medication history
3. **Vet Appointment Management**: Schedule appointments, vet contact info, appointment reminders, visit history
4. **Vaccination Tracking**: Track vaccination dates, automatic booster reminders, vaccination records export
5. **Health Records Vault**: Store vet notes, lab results, x-rays, health documents with quick emergency access

**Post-MVP** (Phase 2+): Expense tracking & budgeting, family collaboration, grooming schedules, feeding schedules, weight & health monitoring, social features (Phase 3), vet clinic integration (Phase 4)

#### Tech Stack

- **Frontend**: Next.js 15 (React) with TypeScript, Tailwind CSS, shadcn/ui components, Zustand (state management)
- **Backend**: NestJS (Node.js) with TypeScript, RESTful API, Prisma ORM, JWT authentication
- **Database**: PostgreSQL 16 (primary), Redis 7 (caching, sessions)
- **Mobile**: React Native with Expo (iOS & Android), Firebase Cloud Messaging (push notifications)
- **Infrastructure**: Docker containerization, DigitalOcean (MVP hosting), GitHub Actions (CI/CD)
- **External Services**: SendGrid (email), Twilio (SMS - Phase 2), Stripe (payments - Phase 2)

#### Documentation

- [Documentation Index](projects/pet-care-manager/INDEX.md) - Master documentation navigation
- [PRD Overview](projects/pet-care-manager/PRD_OVERVIEW.md) - Complete product requirements document
- [Architecture](projects/pet-care-manager/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/pet-care-manager/EXPERTS.md) - Expert reviews and sign-offs

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-12): Pet profiles, medication tracking, vet appointments, vaccination tracking, health records vault
- **Phase 2 (Months 4-6)**: Expense tracking, family collaboration, grooming schedules, weight/health monitoring
- **Phase 3 (Months 7-12)**: Social features, advanced analytics, calendar sync, emergency features
- **Phase 4 (Year 2+)**: Vet clinic integrations, pet insurance integration, AI-powered health insights

**Target Launch**: April 2026 (MVP - 12 weeks development + 2 weeks testing)

#### Business Value

- **Market Opportunity**: 67 million US pet-owning households, 143 million pets (85M dogs, 58M cats)
- **Revenue Potential**: Freemium SaaS model ($7.99/month Premium tier) targeting $50K MRR by Month 12
- **User Value**: Save $500-2000/year per pet through prevented emergency vet visits, medication compliance, proactive health tracking
- **Time Savings**: 5+ hours/month saved from centralized records, automated reminders, eliminated manual tracking
- **Success Metrics**: 50,000 users by Year 1, 10% free-to-premium conversion, 65% 3-month retention, 90% improved medication compliance

#### Expert Team (Needed)

- **Product**: Patricia Martinez (Product Manager) - PRD creation, MVP definition, prioritization
- **Architecture**: Marcus Johnson (Architecture) - System architecture, scalability planning
- **Backend**: Samuel Rodriguez (Backend) - API design, notification system, database operations
- **Frontend**: Thomas Anderson (Frontend) - Next.js dashboard, state management, UI implementation
- **Mobile**: Michael Brown (Mobile) - React Native app, offline-first architecture, push notifications
- **UI/UX**: Daisy Thompson (UI/UX) - User flows, dashboard layout, mobile UX patterns
- **Database**: Benjamin Lee (Database) - PostgreSQL schema design, query optimization
- **Security**: Ryan Kim (Security) - Authentication, data encryption, privacy compliance
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint design
- **DevOps**: David Cooper (DevOps) - CI/CD pipeline, Docker deployment, infrastructure
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, completeness

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Health Information Systems

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates notification systems (multi-channel: push, email, SMS)
- Shows health data management and CRUD operations
- Exemplifies freemium SaaS business model
- Demonstrates mobile-first architecture with offline capabilities
- Illustrates reminder/scheduling systems and time-based automation

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, mobile UX, push notifications, RESTful API design, offline-first architecture
- **Software Engineering**: Health data systems, reminder systems, family collaboration features, document storage
- **Database Systems**: PostgreSQL schema design for health records, query optimization, data relationships (pets, users, appointments)
- **Security**: GDPR/CCPA compliance, data encryption (health records), secure document storage
- **Business**: Freemium SaaS model, subscription management, pet care industry

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured pet health data)
- **Schema Design**: Pet profiles, medication schedules, appointments, vaccinations, health documents, user accounts, family relationships
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for health records, medication history, appointment logs
- **Backup Strategy**: Automated daily backups, point-in-time recovery, user-initiated exports
- **Query Optimization**: Indexes on frequently queried fields (upcoming appointments, medication reminders), connection pooling
- **Data Integrity**: Foreign key constraints, unique constraints, check constraints for data validation
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling for concurrent users
- **Security**: Encryption at rest (AES-256), encryption in transit (TLS 1.2/1.3), GDPR/CCPA compliance for health data

### 21. `financial-goal-saver/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: High  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Financial Goal Saver is a customer-facing full-stack web and mobile application that transforms financial goal achievement through automated savings, intelligent spending analysis, and gamified progress tracking. The platform connects to users' bank accounts via Plaid API, analyzes spending patterns, and automatically transfers money to goal-specific accounts using smart algorithms.

**Target Audience**: Working adults (ages 25-45) saving for specific financial goals (vacation, emergency fund, home down payment)  
**Business Model**: Freemium SaaS (Free tier: 1 goal; Premium: $9.99/month for unlimited goals and advanced features)

#### Key Features

1. **Bank Account Connection** (Plaid Integration): Secure OAuth flow, real-time transaction syncing, 500+ US banks
2. **Financial Goal Creation & Management**: Create goals with target amounts, deadlines, categories, priority levels
3. **Automated Savings Engine**: AI-powered algorithm analyzes spending, calculates optimal savings, schedules ACH transfers
4. **Progress Dashboard**: Visual progress bars, percentage complete, projected completion dates, on-track indicators
5. **Basic Spending Insights**: Monthly spending by category, recurring subscriptions, savings opportunities

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker)
- **Bank Integration**: Plaid API (Link SDK, Transactions API, Auth API)
- **Infrastructure**: Docker, DigitalOcean (MVP), GitHub Actions CI/CD
- **Mobile** (Phase 2): Capacitor (iOS & Android), push notifications

#### Documentation

- [Documentation Index](projects/financial-goal-saver/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/financial-goal-saver/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](projects/financial-goal-saver/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/financial-goal-saver/EXPERTS.md) - 17 expert reviews (pending)

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-12): Bank connection, goal management, automated savings, progress dashboard, spending insights
- **Phase 2 (Months 4-6)**: Mobile app (React Native), shared family goals, investment integration, advanced AI insights
- **Phase 3 (Months 7-12)**: Gamification, custom automation rules, debt payoff, financial coaching

**Target Launch**: April 15, 2026 (Week 13)

#### Business Value

- **Market Opportunity**: 50M US adults actively saving for financial goals
- **User Value**: Save $300+/month through automated savings and spending insights, 60% reach goals within 6 months
- **Revenue Model**: Freemium SaaS targeting $100K ARR Year 1, $900K ARR Year 2, $3.2M ARR Year 3
- **Time Savings**: 5+ hours/month saved vs manual savings tracking
- **Success Metrics**: 70% weekly engagement, 12% free-to-premium conversion, 65% 6-month retention

#### Expert Team (17 Experts - All Pending Review)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, business model, prioritization
- **Architecture**: Marcus Johnson (Architecture) - System design, scalability planning
- **Backend**: Samuel Rodriguez (Backend) - NestJS API, Plaid integration, automated savings engine
- **Frontend**: Thomas Anderson (Frontend) - Next.js dashboard, state management
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint structure
- **Security**: Ryan Kim (Security) - JWT auth, encryption, GDPR/CCPA compliance
- **UI/UX**: Daisy Thompson (UI/UX) - User flows, dashboard design, responsive design
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation
- **Mobile**: Michael Brown (Mobile) - React Native app (Phase 2), push notifications
- **Performance**: James Martinez (Performance) - Optimization, caching strategies
- **DevOps**: David Cooper (DevOps) - CI/CD, Docker, infrastructure
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring, error tracking
- **Business Intelligence**: Gary Wilson (BI) - Spending insights, analytics architecture
- **Compliance**: Constance White (Compliance) - Financial regulations, ACH compliance
- **Copywriter**: Olivia Martinez (Copywriter) - App naming, UI copy, messaging
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, completeness

**All experts pending review as of 2026-01-21**

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Financial Technology (FinTech)

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates third-party API integration (Plaid for bank connectivity)
- Shows automated financial algorithms (savings engine, spending analysis)
- Exemplifies freemium SaaS business model
- Demonstrates security best practices (encryption, JWT authentication, OWASP compliance)
- Illustrates gamification for behavior change

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, API design, mobile UX, real-time data syncing, background jobs
- **Software Engineering**: Modular architecture (NestJS modules), RESTful API design, CI/CD pipelines
- **Database Systems**: PostgreSQL schema design, query optimization, indexing strategies, Prisma ORM
- **Security**: JWT authentication, data encryption (at rest/in transit), GDPR/CCPA compliance, OWASP Top 10
- **Financial Technology**: Bank account integration, ACH transfers, automated savings algorithms, spending analytics
- **Business**: Freemium SaaS model, subscription management, go-to-market strategy, financial goal achievement

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured financial data)
- **Schema Design**: Users, plaid_items, accounts, goals, transactions, savings_rules, transfers, notifications
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for goals, transactions, savings rules, transfer history
- **Backup Strategy**: Automated daily backups (DigitalOcean managed), point-in-time recovery, 7-day retention
- **Query Optimization**: Indexes on user_id, date, account_id, status fields; pagination for large datasets
- **Data Integrity**: Foreign key constraints, unique constraints, check constraints for data validation
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling (10-20 connections)
- **Security**: Encryption at rest (AES-256 for Plaid tokens), encryption in transit (TLS 1.3), GDPR/CCPA compliance

**Type**: Financial Goal Tracking and Automated Savings Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/financial-goal-saver/`

### 22. `packages/`
- **Type**: Documentation/Knowledge Base (Current Workspace)
- **Technology**: Markdown documentation
- **Location**: `~/Documents/packages/`
- **Description**: Knowledge base and documentation structure for managing projects and ideas
- **Structure**:
  - `docs/` - Documentation following structured format
  - `docs/guides/` - Guides and workflows
  - `docs/reference/` - Reference materials
  - `docs/features/` - Feature documentation (to be added)
- **Key Files**: `docs/README.md`, `docs/.PLANNING_MODE`
- **Status**: Active (in planning mode)
- **Academic Classification**: Information Science - Knowledge Management, Documentation Systems, Information Architecture
- **Educational Value**:
  - Demonstrates knowledge management principles
  - Illustrates documentation structure and organization
  - Shows information architecture patterns
  - Exemplifies planning and design documentation practices
- **Subject Matter Areas**:
  - Information Science: Knowledge management, information architecture, documentation systems
  - Computer Science: Project management, software documentation, design patterns
  - Education: Learning resource organization, curriculum design (if applicable)

### 23. `workspace-documentation-hub/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: High  
**Category**: Internal Tool / Developer Documentation Portal

#### Overview

**Workspace Documentation Hub** is a visual, interactive documentation portal that serves as the central hub for navigating and understanding the entire workspace ecosystem. This tool helps developers quickly discover packages, CLI tools, Cursor commands, and workflows without digging through files, acting as a comprehensive knowledge base and navigation system for the monorepo workspace.

**Target Audience**: Developers working in the monorepo, new team members onboarding, project managers reviewing capabilities  
**Business Value**: 70% reduction in documentation lookup time, 50% faster onboarding, improved developer productivity

#### Key Features

1. **Package Catalog**: Comprehensive, searchable directory of all workspace packages (core, logbook, deck, embark, etc.) with metadata, capabilities, usage examples
2. **CLI Command Reference**: Complete documentation for all CLI tools (cursor-init, task-master, etc.) with syntax, examples, and use cases
3. **Cursor Command Browser**: Visual interface for discovering and using `/expert` and other Cursor commands from `.cursor/commands/`
4. **Workflow Documentation**: Interactive guides and visual diagrams for workspace workflows (git workflow, task management, project setup)
5. **Unified Search**: Fast, intelligent search across all workspace documentation with filters, autocomplete, and fuzzy matching
6. **Dashboard**: Overview showing workspace stats, recent updates, getting started guides, popular resources

#### Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion
- **UI Components**: Radix UI primitives, Lucide React icons, Prism.js/Shiki (code highlighting)
- **Search**: MiniSearch (local search) or Algolia (if external)
- **Data Sources**: Automated extraction from `package.json` files, CLI bin files, `.cursor/commands/` markdown, `docs/` directory
- **Build**: Static site generation with incremental updates on documentation changes

#### Documentation

- [PRD](projects/workspace-documentation-hub/PRD.md) - Complete product requirements document with MVP definition

#### Timeline

- **Phase 1 (Foundation)** (Weeks 1-2): Project setup, data extraction scripts, basic UI components, dashboard
- **Phase 2 (Core Features)** (Weeks 3-4): Package catalog, CLI reference, Cursor command browser, filtering and search
- **Phase 3 (Advanced Features)** (Weeks 5-6): Workflow documentation with diagrams, unified search, animations, mobile optimization
- **Phase 4 (Enhancement & Launch)** (Weeks 7-8): Final polish, dark mode, testing, deployment, monitoring

**Target Launch**: 8 weeks from start (production-ready)

#### Business Value

- **Developer Productivity**: Reduce documentation lookup time from 5+ minutes to <30 seconds (70% reduction)
- **Onboarding Efficiency**: Reduce onboarding time by 50% through comprehensive, discoverable documentation
- **Knowledge Management**: Centralize workspace knowledge, eliminate "where is the documentation?" questions
- **Workflow Consistency**: Ensure all team members use the right tools and follow the same workflows
- **User Adoption**: 80%+ daily active users, 90%+ return rate week over week
- **Success Metrics**: <1s page load time, <100ms search speed, <2min full rebuild time

#### Expert Team (Needed)

- **Product**: Patricia Martinez (Product Manager) - PRD creation, feature prioritization, business value
- **Frontend**: Thomas Anderson (Frontend) - Next.js, React components, state management
- **UI/UX**: Daisy Thompson (UI/UX) - Visual design, user flows, component design
- **Architecture**: Marcus Johnson (Architecture) - Data extraction system, search indexer, build pipeline
- **Backend**: Samuel Rodriguez (Backend) - Data parsers, search indexing, build scripts
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, content organization
- **Performance**: James Martinez (Performance) - Build optimization, search performance, page load optimization
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation, screen readers
- **Mobile**: Michael Brown (Mobile) - Mobile responsiveness, touch optimization
- **DevOps**: David Cooper (DevOps) - Deployment pipeline, auto-rebuild on changes, hosting setup
- **Copywriter**: Olivia Martinez (Copywriter) - Section naming, UI copy, descriptions
- **SEO**: Amanda Davis (SEO) - Search optimization, metadata, content structure

#### Academic Classification

**Primary**: Computer Science - Web Development, Documentation Systems, Knowledge Management

**Educational Value**:
- Demonstrates static site generation with Next.js
- Illustrates automated data extraction and indexing
- Shows knowledge management principles for technical documentation
- Exemplifies search implementation and optimization
- Demonstrates component-based architecture with React
- Shows information architecture for developer tools
- Illustrates build automation and incremental updates

**Subject Matter Areas**:
- **Computer Science**: Full-stack web development, data extraction, search algorithms, static site generation, API design
- **Information Science**: Knowledge management, documentation systems, information architecture, content organization
- **Software Engineering**: Build automation, data parsing, incremental updates, component architecture
- **UI/UX Design**: Developer tool design, visual hierarchy, information design, search UX
- **Performance**: Search optimization, page load optimization, build performance

**Type**: Internal Developer Tool / Documentation Portal  
**Technology**: Next.js + TypeScript + Automated Data Extraction  
**Location**: `~/Documents/packages/docs/projects/workspace-documentation-hub/`

### 24. `tai-chi-lessons/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: AI Video Generation Web Application

#### Overview

Tai Chi Lessons is an **AI-powered video generation engine** that creates beginner-level Tai Chi lessons with Hebrew narration on demand. Unlike traditional video platforms with pre-recorded content, this system generates fresh video lessons by breaking them into short scenes (5-10 seconds each), using AI video providers, and stitching them together with synchronized Hebrew audio narration.

**Target Audience**: Hebrew-speaking individuals with no prior Tai Chi experience  
**Business Model**: Free for MVP (proof-of-concept); Post-MVP freemium (Free: 1 video/week, Premium: $9.99/month unlimited)

**Key Differentiator**: Hebrew-first design with separate TTS generation (not relying on video providers for Hebrew speech)

#### Key Features (MVP)

1. **Simple Video Generation UI**: One-button interface ("Generate Tai Chi Lesson"), progress indicator, video player
2. **Scene-Based Video Generation**: Break 5-minute lesson into 5 short scenes (5-10s each), generate clips using AI video providers
3. **Hebrew TTS Narration**: Separate Hebrew audio generation (Google Cloud TTS or Azure TTS), synchronized audio overlay using ffmpeg
4. **Async Job Processing**: Background job queue processes generation (5-10 minutes), progress tracking (0-100%), job status API
5. **Video Stitching Pipeline**: ffmpeg-based clip concatenation, audio overlay, single MP4 output to object storage (S3/R2)

**Post-MVP Features** (Phase 2+):
- User authentication and video history
- Multiple lesson types (Lessons 2-5)
- Video customization (duration, pace, environment)
- Difficulty levels (beginner, intermediate, advanced)
- Download and save videos
- Additional languages (English, Arabic, Russian)

#### Tech Stack

- **Frontend**: Angular 18, TypeScript, RxJS (polling), Video.js (player)
- **Backend**: PHP 8.2+ (Slim Framework 4), REST API, async job queue (Redis-backed)
- **Database**: MySQL 8+ or PostgreSQL 14+ (video_jobs, video_clips, audio_narrations)
- **Video Processing**: ffmpeg 6+ (clip stitching, audio overlay)
- **AI Services**: 
  - Video generation provider (abstracted interface with fallback)
  - Hebrew TTS (Google Cloud TTS or Azure TTS)
- **Object Storage**: S3-compatible (AWS S3, Cloudflare R2, MinIO)
- **Infrastructure**: DigitalOcean/AWS/Hetzner (4+ CPU, 8+ GB RAM, 50+ GB disk)

#### Documentation

- [Documentation Index](../projects/tai-chi-lessons/INDEX.md) - Complete navigation guide
- [PRD Overview](../projects/tai-chi-lessons/PRD_OVERVIEW.md) - Product requirements with comprehensive MVP definition
- [Architecture](../projects/tai-chi-lessons/ARCHITECTURE.md) - System architecture and video pipeline design
- [Expert Contributions](../projects/tai-chi-lessons/EXPERTS.md) - 15 expert reviews and sign-offs

**Key Documentation**:
- [Video Generation Pipeline](../projects/tai-chi-lessons/features/video-generation-pipeline.md) - Scene-based generation, lesson structure, prompt engineering
- [Hebrew TTS Integration](../projects/tai-chi-lessons/features/hebrew-tts-integration.md) - Separate audio generation strategy
- [API Design](../projects/tai-chi-lessons/technical/api-design.md) - REST endpoints, job lifecycle
- [FFmpeg Pipeline](../projects/tai-chi-lessons/technical/ffmpeg-pipeline.md) - Video stitching, audio overlay

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-11): 
  - Week 1-2: Backend API, job queue, database schema
  - Week 3-4: Video provider integration, scene generation
  - Week 5-6: Hebrew TTS integration, ffmpeg pipeline
  - Week 7: Frontend UI, job polling
  - Week 8: End-to-end testing, bug fixes
  - Week 9-10: Internal testing (10+ video generations)
  - Week 11: Alpha launch (internal)
- **Phase 2 (Enhancement)** (Weeks 12-20): User authentication, multiple lesson types, video customization
- **Phase 3 (Advanced)** (Weeks 21-30): Difficulty levels, download/save, cost optimization (caching), analytics dashboard
- **Phase 4 (Expansion)**: Additional languages, mobile app, public API, instructor customization

**Target Launch**: Week 11 (Internal Alpha)

#### Business Value

- **Market Opportunity**: Hebrew-speaking market with no existing Hebrew Tai Chi content, on-demand video generation (not static library)
- **User Value**: Clear Hebrew narration for learning, slow beginner-safe movements, on-demand generation, accessible from home
- **Revenue Model** (Post-MVP): Freemium (Free: 1 video/week, Premium: $9.99/month unlimited, Premium+: $19.99/month with customization)
- **Cost Control**: Scene-based generation (<$5 per video), prompt caching (Phase 3 reduces to <$2), provider fallback for reliability
- **Success Metrics** (MVP): 
  - Generation success: 99% job completion rate
  - Quality: 90% user satisfaction with movement clarity, 85% Hebrew comprehension rate
  - Performance: <10 minute generation time, <$5 average cost per video
  - User adoption: 10 successful generations in first week

#### Expert Team

- **Product**: Patricia Martinez (Product Manager) - MVP definition, cost-aware prioritization, Hebrew-first strategy
- **Architecture**: Marcus Johnson (Architecture) - Scene-based video pipeline, provider abstraction, ffmpeg orchestration
- **Backend**: Samuel Rodriguez (Backend) - PHP/Slim API, job lifecycle, provider interface, error handling
- **Frontend**: Thomas Anderson (Frontend) - Angular UI, RxJS polling, video player integration
- **Database**: Benjamin Lee (Database) - Schema design (video_jobs, video_clips, audio_narrations), indexes
- **DevOps**: David Cooper (DevOps) - ffmpeg installation, object storage, worker deployment, temp file management
- **API Design**: Emily Chen (API Design) - REST endpoints, job status API, signed URLs
- **i18n**: Lisa Garcia (i18n) - Hebrew TTS strategy, narration text, multi-language planning
- **Performance**: James Martinez (Performance) - Generation time optimization, caching strategy (Phase 3)
- **Security**: Ryan Kim (Security) - API key security, rate limiting, HTTPS enforcement
- **UI/UX**: Daisy Thompson (UI/UX) - Simple one-button UI, progress indicator, video player
- **Accessibility**: Allison Foster (Accessibility) - Video player accessibility, keyboard navigation, WCAG compliance
- **Observability**: Kevin Martinez (Observability) - Job tracking, error monitoring, logging strategy
- **Copywriter**: Olivia Martinez (Copywriter) - Hebrew narration text, beginner-friendly content
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, documentation organization

#### Academic Classification

**Primary**: Computer Science - AI Video Generation, Asynchronous Processing, Multimedia Systems, Internationalization

**Educational Value**:
- Demonstrates AI video generation pipeline (scene-based approach overcomes provider limitations)
- Illustrates async job processing with worker queues and progress tracking
- Shows provider abstraction pattern (swappable AI video providers with fallback)
- Exemplifies ffmpeg-based multimedia processing (clip stitching, audio overlay)
- Demonstrates separate TTS strategy for internationalization (Hebrew-first design)
- Shows cost-aware architecture (scene-based generation controls costs, caching reduces costs)

**Subject Matter Areas**:
- **Computer Science**: AI video generation, async job processing, provider abstraction, REST API design, polling patterns
- **Software Engineering**: Video pipeline orchestration, scene-based generation, error handling with retries, modular provider interface
- **Database Systems**: Job state management, scene-level tracking, progress calculation, status transitions
- **Multimedia Processing**: ffmpeg video stitching, audio overlay, format conversion, temp file management
- **Internationalization**: Separate Hebrew TTS generation, language-agnostic video generation, multi-language support planning
- **Performance Optimization**: Prompt caching, provider selection, parallel generation (Phase 4), cost optimization
- **Security**: API key management, rate limiting, HTTPS/TLS, input validation

#### Database Considerations

- **Database Type**: MySQL 8+ or PostgreSQL 14+ (relational database for job state, scene tracking)
- **Schema Design**: 
  - `video_jobs`: Job state (queued → generating_clips → generating_audio → stitching → completed/failed)
  - `video_clips`: Scene-level clip tracking (5 clips per job, provider task IDs, clip URLs, prompts)
  - `audio_narrations`: Hebrew TTS audio tracking (narration text, audio URLs, duration)
- **Migration Strategy**: Version-controlled migrations for schema evolution, new providers, additional languages
- **Data Persistence**: Job state persistence, scene status transitions, provider metadata (JSON), retry tracking
- **Backup Strategy**: Automated backups for job history, error logs; temporary files deleted after stitching
- **Query Optimization**: Indexes on job_id + scene_index, status fields (frequent queries), created_at for history
- **Data Integrity**: Foreign key constraints (clips/audio → jobs), ENUM status types for safety, timestamps for tracking
- **Scalability**: Single server MVP (10 concurrent jobs), dedicated worker Phase 2, worker pool Phase 3
- **Security**: API keys in environment variables (not database), rate limiting per IP, HTTPS for all API requests

**Type**: AI Video Generation Engine (Educational Wellness)  
**Technology**: PHP backend + Angular frontend + AI providers + ffmpeg  
**Location**: `~/Documents/packages/docs/projects/tai-chi-lessons/`

### 25. `sports-results-tracker/`

**Status**: Planning (MVP Definition Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web Application (Progressive Web App)

#### Overview

Sports Results Tracker is a fast, mobile-first platform for tracking soccer results (and potentially other sports) in real-time. The platform provides live scores, league standings, match fixtures, and personalized team following without the clutter and slow loading times of existing sports websites.

**Target Audience**: Soccer fans (18-45), fantasy soccer players, amateur coaches, casual viewers  
**Business Model**: Freemium (Free tier with basic features + minimal ads; Premium: $4.99/month for unlimited follows, ad-free, push notifications; Premium+: $9.99/month with API access)

#### Key Features

1. **Live Score Tracking**: Real-time score updates (30s polling in MVP, WebSockets in Phase 2), match status display
2. **League Standings**: Top 5 leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1), position tracking, points/goals data
3. **Team Following**: Follow up to 5 favorite teams (MVP), personalized views, followed teams appear first
4. **Match Schedule (Fixtures)**: Next 7 days of fixtures, filter by followed teams, date/time display
5. **Mobile-Responsive Interface**: Mobile-first design, <2 second load times, touch-optimized controls
6. **User Accounts** (Phase 2): Full authentication, cloud sync, unlimited team following
7. **Push Notifications** (Phase 2): Goal alerts, match start reminders, score updates
8. **Player Statistics** (Phase 2): Goals, assists, cards, form indicators
9. **Match History** (Phase 2): Historical results, head-to-head records
10. **Multiple Sports** (Phase 3): Basketball, American football, tennis expansion
11. **Native Mobile Apps** (Phase 4): iOS and Android native applications

#### Tech Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, Zustand (state), React Query (server state), Vite build tool
- **Backend**: Node.js 20 + Express, RESTful API
- **Database**: PostgreSQL 16 (matches, standings, teams), Redis 7.2 (live score caching)
- **Infrastructure**: Vercel (frontend), Railway (backend + DB + Redis)
- **Data Source**: API-Football (sports data API)
- **Monitoring**: Sentry (error tracking), Vercel Analytics, UptimeRobot

#### Documentation

- [Documentation Index](../projects/sports-results-tracker/INDEX.md) - Complete navigation guide
- [PRD Overview](../projects/sports-results-tracker/PRD_OVERVIEW.md) - Product requirements with comprehensive MVP definition
- [Architecture](../projects/sports-results-tracker/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](../projects/sports-results-tracker/EXPERTS.md) - 14 expert reviews and sign-offs

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-10): Live scores, standings, fixtures, following (max 5 teams), mobile-responsive UI
  - Week 1-2: Data ingestion and API setup
  - Week 3-4: Core UI and live scores
  - Week 5-6: Standings and fixtures
  - Week 7: Following/personalization
  - Week 8: Polish and bug fixes
  - Week 9-10: Testing and beta launch
- **Phase 2 (Enhancement)** (Weeks 11-14): User accounts, push notifications, WebSocket real-time, player stats, match history
- **Phase 3 (Expansion)** (Weeks 15-20): Additional sports (basketball, football), custom leagues, social features, API access
- **Phase 4 (Mobile & Monetization)** (Weeks 21-28): Native mobile apps (iOS, Android), premium subscriptions, fantasy integration

**Target Launch**: April 15, 2026 (MVP)

#### Business Value

- **Market Opportunity**: Sports fans frustrated with slow, ad-heavy websites; mobile-first users seeking clean, fast experience
- **User Value**: Real-time scores without delays, clean interface without clutter, personalized team tracking, <2 second load times
- **Revenue Model**: Freemium targeting 1,000 users (Month 1), 10,000 (Month 6), 5% premium conversion
- **Differentiation**: Speed (<2s loads, <1s updates), simplicity (clean UI), mobile-first (touch-optimized)
- **Success Metrics**: 
  - User Adoption: 1,000 users in first month
  - User Engagement: 50% weekly active, 60% monthly retention
  - Technical: 99% uptime, <2s page loads, 99.9% data accuracy
  - Business: 5% free-to-premium conversion (Phase 2+)

#### Expert Team

- **Product**: Patricia Martinez (Product Manager) - MVP definition, prioritization, roadmap
- **Market Research**: Laura Phillips (Market Research) - Competitive analysis, user personas, differentiation strategy
- **Architecture**: Marcus Johnson (Architecture) - System design, caching strategy, scalability
- **Backend**: Samuel Rodriguez (Backend) - API design, database schema, data ingestion
- **Frontend**: Thomas Anderson (Frontend) - React architecture, state management, PWA
- **UI/UX**: Daisy Thompson (UI/UX) - Mobile-first design, user flows, clean interface
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, indexes, query optimization
- **API Design**: Emily Chen (API Design) - RESTful endpoints, response formats, rate limiting
- **Performance**: James Martinez (Performance) - Caching (Redis + React Query), CDN, bundle optimization
- **Security**: Ryan Kim (Security) - JWT authentication (Phase 2), rate limiting, HTTPS/TLS
- **DevOps**: David Cooper (DevOps) - CI/CD, Vercel + Railway deployment, monitoring
- **Accessibility**: Allison Foster (Accessibility) - WCAG 2.1 AA compliance, keyboard navigation, screen readers
- **Mobile**: Michael Brown (Mobile) - PWA implementation, offline capability, native apps (Phase 4)
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, architecture docs, API documentation

#### Academic Classification

**Primary**: Computer Science - Web Development, Real-Time Systems, Sports Technology

**Educational Value**:
- Demonstrates real-time data delivery and caching strategies (polling → WebSockets evolution)
- Illustrates mobile-first progressive web app (PWA) development
- Shows effective use of caching layers (Redis + React Query + CDN)
- Exemplifies clean, performance-focused architecture (<2s load times)
- Demonstrates external API integration with rate limit management
- Illustrates freemium SaaS business model in sports/media sector
- Shows scalable architecture design (vertical → horizontal scaling)

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, real-time systems, caching strategies, PWA implementation, API integration, mobile-first design
- **Software Engineering**: Performance optimization, data ingestion pipelines, RESTful API design, state management (Zustand + React Query)
- **Database Systems**: Time-series data modeling (match results), query optimization, Redis caching, PostgreSQL for relational data
- **Security**: JWT authentication, rate limiting, API security, HTTPS/TLS configuration, input validation
- **Business**: Freemium SaaS model, sports/media market positioning, user acquisition strategies, ad revenue vs subscription tradeoffs
- **Sports Technology**: Live score delivery, data accuracy requirements, multi-league tracking, sports data API integration

#### Database Considerations

- **Database Type**: PostgreSQL 16 (primary relational database), Redis 7.2 (caching layer)
- **Schema Design**: Leagues (name, country, season), Teams (name, logo, venue), Matches (scores, status, date/time), Standings (position, points, wins/draws/losses), Users (Phase 2 - accounts, following)
- **Migration Strategy**: Database migrations for schema evolution, new sport additions, feature expansions
- **Data Persistence**: PostgreSQL for permanent match data (2 seasons hot data), Redis for live scores (30s TTL)
- **Backup Strategy**: Automated Railway backups, 2-season data retention, archive old seasons to cold storage (Phase 3)
- **Query Optimization**: 
  - Indexes on match_date, league_id, status for fast match lookups
  - Indexes on league_id, season, position for standings queries
  - Connection pooling for concurrent requests
  - Redis caching for live scores (90%+ cache hit rate target)
- **Data Integrity**: Foreign key constraints (teams → leagues, matches → teams), unique constraints on external API IDs, timestamps for audit
- **Scalability**: Connection pooling, read replicas for read-heavy queries (Phase 3), Redis cluster for distributed caching (Phase 3)
- **Security**: Encryption at rest (Railway managed), encryption in transit (TLS 1.3), parameterized queries (SQL injection prevention), rate limiting (100 req/min)

**Type**: Real-Time Sports Tracking Platform (Web + PWA)  
**Technology**: React 18 + TypeScript + Node.js + PostgreSQL + Redis  
**Location**: `~/Documents/packages/docs/projects/sports-results-tracker/`

### 26. `social-media-manager/`

**Status**: Planning (Initial Concept)  
**Priority**: Medium  
**Category**: Full-Stack Web Application (SaaS Platform)

#### Overview

Social Media Manager is a comprehensive platform to help users manage multiple social media accounts from a single unified dashboard. The platform enables post scheduling, content management, engagement monitoring, and analytics across multiple social platforms (Twitter/X, Instagram, Facebook, LinkedIn, etc.).

**Target Audience**: Small business owners, entrepreneurs, social media managers, content creators  
**Business Model**: To be determined (freemium, subscription tiers, or one-time purchase)

#### Key Features (Initial Ideas)

1. **Unified Dashboard**: Single interface for all social media accounts
2. **Post Scheduling**: Schedule and publish posts across multiple platforms
3. **Content Calendar**: Visual calendar for planning content strategy
4. **Analytics Dashboard**: Track performance metrics across platforms
5. **Engagement Monitoring**: Monitor comments, mentions, and messages
6. **Content Library**: Centralized media and content management
7. **Team Collaboration**: Multi-user support for teams and clients
8. **Multi-Account Posting**: Post to multiple platforms simultaneously

#### Value Proposition

Save time and increase efficiency by managing all social media accounts from one centralized platform, eliminating the need to switch between multiple apps and websites.

#### Documentation

- [Initial Concept](../projects/social-media-manager/INITIAL_CONCEPT.md) - Initial project concept and ideas

#### Next Steps

Run comprehensive planning (`/local/plan-project social-media-manager`) to develop:
- Full PRD with MVP definition
- Technical architecture
- Expert team contributions
- Detailed feature specifications

#### Academic Classification

**Primary**: Computer Science - Full-Stack Web Development, SaaS Platform Development, API Integration

**Educational Value** (To be determined after comprehensive planning):
- Demonstrates OAuth integration with multiple social platforms
- Illustrates multi-tenant SaaS architecture
- Shows content scheduling and queue management systems
- Exemplifies API rate limiting and quota management

**Subject Matter Areas** (To be expanded):
- **Computer Science**: Full-stack development, API integration, authentication systems, real-time updates
- **Software Engineering**: SaaS architecture, multi-tenancy, job queuing, cron scheduling
- **Business**: SaaS business models, social media marketing, user management

**Type**: Social Media Management SaaS Platform (Web Application)  
**Technology**: To be determined (likely full-stack with PHP/Node.js backend)  
**Location**: `~/Documents/packages/docs/projects/social-media-manager/`

### 27. `colis-company-showcase/`

**Status**: Planning  
**Priority**: High  
**Category**: Full-Stack Web Application (Marketing Website + CMS)

#### Overview

Colis Company Showcase is a professional marketing and portfolio website designed to present the company's services, projects, team, and expertise to potential clients. The platform serves as the primary digital presence for client acquisition and business development, featuring a custom CMS for content management.

**Target Users**: Business decision-makers, potential clients seeking software development services  
**Business Model**: Marketing/lead generation platform (not revenue-generating itself, but drives client acquisition)

#### Key Features

1. **Company Overview**: Professional company presentation with history, mission, and values
2. **Project Portfolio Showcase**: Dynamic project grid with all company projects, integrated with `docs/projects/` directory
3. **Team/Staff Profiles**: Staff member profiles with expertise, roles, and photos
4. **Services Pages**: Detailed service offerings and technical capabilities
5. **Blog/News System** (Post-MVP): Content management for insights and updates
6. **Client Testimonials** (Post-MVP): Social proof and success stories
7. **Custom CMS**: Content management system for easy updates without developer intervention
8. **Contact Form**: Lead capture with email notifications
9. **SEO Optimization**: Search-optimized for client discovery

#### MVP Definition

**Core Problem**: Potential clients cannot discover, evaluate, or contact the company for development services.

**Core User**: Business decision-makers seeking software development partners.

**Core Value**: Professional showcase that builds trust and captures qualified leads.

**MVP Features** (6 essential features):
1. Company Overview Page
2. Project Portfolio Showcase (integrated with `docs/projects/`)
3. Services Page
4. Team Profiles Page
5. Contact Form & Information
6. Basic CMS for Content Management

**MVP Timeline**: 8 weeks development + 1 week testing = 9 weeks total

**Success Metrics**:
- 500+ unique visitors per month
- 20+ contact form submissions per month
- 5% conversion rate (visitors to leads)
- <2s page load time
- Top 10 ranking for target keywords (6 months)

#### Value Proposition

- Professional showcase of company expertise and capabilities
- Transparent portfolio demonstrating successful project delivery
- Easy-to-navigate presentation of services and team
- SEO-optimized for client discovery
- CMS-powered for easy content updates without developer dependency

#### Tech Stack

**Frontend**: Angular 18 (TypeScript)  
**Backend**: Slim PHP 4 (RESTful API)  
**Database**: MySQL 8.0+ (production), SQLite (development)  
**CMS**: Custom Angular-based admin panel with WYSIWYG editor  
**Hosting**: DigitalOcean / AWS  
**Web Server**: Nginx  
**SSL**: Let's Encrypt  
**CI/CD**: GitHub Actions

#### Documentation

- [Documentation Index](../projects/colis-company-showcase/INDEX.md) - Master overview and navigation
- [PRD Overview](../projects/colis-company-showcase/PRD_OVERVIEW.md) - Complete product requirements with MVP definition
- [Architecture](../projects/colis-company-showcase/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](../projects/colis-company-showcase/EXPERTS.md) - Expert reviews and sign-offs (14 experts)

#### Timeline & Phases

**Phase 1: MVP** (8 weeks) - Core showcase + basic CMS  
**Phase 2: Content & Social Proof** (Weeks 10-14) - Blog system, testimonials, case studies, newsletter  
**Phase 3: Enhancement** (Weeks 15-20) - Advanced features, i18n, analytics dashboard  
**Phase 4: Advanced Features** (Weeks 21+) - Live chat, social media integration, client portal

#### Expert Team (14 Experts)

- **Product**: Patricia Martinez (Product Manager) - MVP prioritization, business strategy
- **Architecture**: Marcus Johnson (Architecture) - System design, scalability
- **Backend**: Samuel Rodriguez (Backend) - API design, PHP implementation
- **Frontend**: Thomas Anderson (Frontend) - Angular architecture, CMS UI
- **UI/UX**: Daisy Thompson (UI/UX) - User experience, portfolio presentation
- **Database**: Benjamin Lee (Database) - MySQL schema, data modeling
- **API Design**: Emily Chen (API Design) - RESTful API structure
- **Security**: Ryan Kim (Security) - JWT auth, CMS security
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance
- **Copywriting**: Olivia Martinez (Copywriter) - Company messaging, content strategy
- **SEO**: Amanda Davis (SEO) - Search optimization, organic traffic
- **DevOps**: David Cooper (DevOps) - Deployment, CI/CD, hosting
- **Code Quality**: Jessica Taylor (Code Quality) - Code standards, testing
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, clarity

#### Academic Classification

**Primary**: Computer Science - Full-Stack Web Development, Content Management Systems, Marketing Technology

**Educational Value**:
- Demonstrates custom CMS development with WYSIWYG editing
- Illustrates integration between documentation (`docs/projects/`) and dynamic web application
- Shows JWT-based authentication for admin access control
- Exemplifies SEO optimization and client acquisition strategies
- Demonstrates separation of public API and CMS API endpoints
- Illustrates responsive, mobile-first web design principles

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, RESTful API design, CMS architecture, authentication systems
- **Software Engineering**: Angular + Slim PHP integration, JWT authentication, file upload handling, image optimization
- **Database Systems**: MySQL schema design, JSON fields for flexible data, full-text search, migration strategies
- **Security**: JWT authentication, bcrypt password hashing, SQL injection prevention, XSS prevention, CSRF protection, file upload security
- **Business**: Client acquisition strategies, lead generation, portfolio presentation, marketing website design
- **SEO**: Search engine optimization, meta tags, structured data (Schema.org), sitemap generation
- **DevOps**: CI/CD with GitHub Actions, Nginx configuration, SSL/TLS setup, automated deployment

#### Database Considerations

- **Database Type**: MySQL 8.0+ (production relational database), SQLite (development)
- **Schema Design**: 
  - `projects` table: title, description, technologies (JSON), thumbnail, status, display_order, full-text search
  - `team_members` table: name, role, bio, expertise (JSON), photo, social links, display_order
  - `services` table: title, description, technologies (JSON), icon, display_order
  - `contact_submissions` table: name, email, company, project_type, message, status, timestamps
  - `users` table: username, email, password_hash (bcrypt), role, last_login
  - `blog_posts` table (Phase 2): title, slug, content, author, category, tags (JSON), published_at
  - `testimonials` table (Phase 2): client, position, company, testimonial, project_id, rating, photo
- **Migration Strategy**: Version-controlled SQL migration scripts for schema evolution
- **Data Persistence**: MySQL persistent storage, daily automated backups
- **Backup Strategy**: Daily database backups with 30-day retention, off-server storage (S3, Dropbox)
- **Query Optimization**: 
  - Indexes on: slug (unique), category, status, featured, display_order for fast lookups
  - Full-text indexes on title, description, long_description for search
  - Prepared statements (SQL injection prevention)
  - Connection pooling for concurrent requests
- **Data Integrity**: Foreign key constraints, unique constraints on slugs, NOT NULL constraints
- **Scalability**: Vertical scaling initially, horizontal scaling with load balancer (Phase 3)
- **Security**: 
  - Bcrypt password hashing (cost factor 12)
  - Prepared statements (SQL injection prevention)
  - Input validation and sanitization
  - File upload security (type whitelist, size limits, filename sanitization)
  - HTTPS only (TLS 1.2+)

#### Integration Strategy

**docs/projects/ Integration**: 
- Database sync approach (PHP script reads `docs/projects/` directory)
- Parses INDEX.md files for project metadata
- Inserts/updates projects in database
- Run via cron job (daily sync) or manual trigger
- Performance: Better than dynamic read, enables querying and filtering

**Email Integration**: 
- SendGrid or Mailgun API for contact form submissions
- SMTP fallback option
- Email notifications to company email on form submission

**Google Analytics Integration**: 
- GA4 tracking for web analytics
- Custom events for conversion tracking (contact form submissions)
- Goal tracking for lead generation

#### Performance Targets

- **Page Load**: <2s desktop, <3s mobile
- **Time to Interactive**: <3s
- **First Contentful Paint**: <1.5s
- **Lighthouse Score**: 90+
- **Uptime**: 99%+

#### Business Value

- **Generate qualified leads**: 20+ contact form submissions per month (MVP), 50+ per month (6 months)
- **Professional brand presence**: Trust-building through professional design and portfolio
- **Showcase technical expertise**: Demonstrate capabilities through project showcase
- **Build client trust**: Transparency through real projects and team profiles
- **Demonstrate successful delivery**: Portfolio of completed projects

**ROI**: Very high (ongoing lead generation with minimal direct cost - internal development)

**Expected Impact**: 3-5 qualified leads per month → 20% conversion → 1 new client every 2 months → Average project value $20K-$100K+

**Type**: Marketing Website + CMS (Full-Stack Web Application)  
**Technology**: Angular 18 + Slim PHP 4 + MySQL 8.0  
**Location**: `~/Documents/packages/docs/projects/colis-company-showcase/`

### 28. `ai-logo-generator/`

**Status**: Planning  
**Priority**: High  
**Category**: Web Application + AI Service

#### Overview

An AI-powered logo generation platform that creates professional, ready-to-use logos based on client descriptions. Clients describe their business, industry, and brand vision, and receive high-quality logo designs instantly. Leverages advanced AI models (OpenAI DALL-E 3, Stability AI) to democratize professional logo design, making it accessible and affordable for small businesses, startups, and entrepreneurs.

**Target Users**: Small business owners, startups, freelancers, entrepreneurs  
**Business Model**: Freemium + Subscription (Pay-per-logo: $19-49, Subscriptions: $29-99/mo)

#### Key Features

1. **AI Logo Generation**: Generate professional logos from text descriptions in <30 seconds
2. **Basic Customization**: Color picker, font selector, layout options with real-time preview
3. **High-Resolution Export**: PNG downloads (multiple sizes: 512x512, 1024x1024, 2048x2048)
4. **User Account & History**: Save generated logos, access generation history
5. **Payment Processing**: Stripe integration for pay-per-logo purchases
6. **Brand Profile Builder** (Post-MVP): Save brand preferences for consistent designs
7. **Vector Export (SVG)** (Post-MVP): Scalable vector graphics for professional use
8. **Brand Kit Creation** (Post-MVP): Color palettes, font pairings, brand guidelines
9. **Team Collaboration** (Post-MVP): Shared workspaces, commenting, approval workflows
10. **Multi-Language Support** (Post-MVP): i18n for global market expansion

#### MVP Definition

**Core Problem**: Small businesses need professional logos but can't afford designers ($500-5,000) or time-consuming design processes.

**Core User**: Small business owners and entrepreneurs launching new businesses or rebranding.

**Core Value**: Generate professional, unique logos instantly from simple text descriptions at a fraction of designer costs.

**MVP Features** (5 essential features):
1. Simple Logo Generation from Text Description
2. Basic Customization Interface (colors, fonts, layouts)
3. High-Resolution Download (PNG, transparent background)
4. User Account & Generation History
5. Pay-Per-Logo Payment Processing (Stripe)

**MVP Timeline**: 10 weeks (8 weeks development + 2 weeks testing)

**Success Metrics**:
- 500 sign-ups in first month
- 100 paid logo purchases in first month
- 20% conversion rate (sign-up → paid)
- 90%+ users successfully customize and download
- <30 seconds logo generation time
- 99% uptime

#### Value Proposition

- **Instant Professional Logos**: Generate high-quality logos in 20-30 seconds, not days
- **Affordable**: Fraction of the cost of hiring a designer ($19-49 vs $500-5,000)
- **No Design Skills Needed**: Simple text description creates professional results
- **Customizable**: Adjust colors, fonts, layouts to match brand vision
- **Immediate Download**: High-resolution files ready for use on websites, social media, marketing

#### Tech Stack

**Frontend**: Angular 18 (TypeScript), Angular Material, Tailwind CSS  
**Backend**: Slim PHP 4 (RESTful API), JWT authentication  
**Database**: MySQL 8 or PostgreSQL 15  
**AI Integration**: OpenAI DALL-E 3 API (primary), Stability AI (fallback)  
**Payment**: Stripe PHP SDK  
**Hosting**: AWS EC2 or DigitalOcean  
**File Storage**: AWS S3 (generated logo files)  
**CDN**: CloudFlare (fast image delivery)

#### Documentation

- [Documentation Index](../projects/ai-logo-generator/INDEX.md) - Master overview and navigation
- [PRD Overview](../projects/ai-logo-generator/PRD_OVERVIEW.md) - Complete product requirements with MVP definition
- [Architecture](../projects/ai-logo-generator/ARCHITECTURE.md) - Technical architecture and system design
- [MVP Features](../projects/ai-logo-generator/features/mvp-features.md) - MVP feature scope and implementation details
- [Pricing and Revenue Model](../projects/ai-logo-generator/business/pricing-and-revenue.md) - Monetization and pricing strategy
- [API Design](../projects/ai-logo-generator/technical/api-design.md) - REST API endpoint design
- [Expert Contributions](../projects/ai-logo-generator/EXPERTS.md) - Expert reviews and sign-offs (12 experts)

#### Timeline & Phases

**Phase 1: MVP** (10 weeks) - Simple generation, basic customization, pay-per-logo  
**Phase 2: Enhanced Customization** (Months 3-4) - Vector export, multiple AI models, advanced colors  
**Phase 3: Brand Kit & Collaboration** (Months 5-7) - Brand kits, team workspaces, analytics  
**Phase 4: Enterprise & Scale** (Months 8-12) - Mobile app, API access, white-label, i18n

#### Expert Team (12 Experts)

- **Product**: Patricia Martinez (Product Manager) - MVP prioritization, business strategy, revenue model
- **Architecture**: Marcus Johnson (Architecture) - System scalability, microservices design
- **Backend**: Samuel Rodriguez (Backend) - API design, AI integration, payment processing
- **Frontend**: Thomas Anderson (Frontend) - Angular architecture, state management
- **UI/UX**: Daisy Thompson (UI/UX) - User interface, logo customization interface
- **Database**: Benjamin Lee (Database) - Schema design (users, logos, subscriptions)
- **API Design**: Emily Chen (API Design) - RESTful API, AI service integration
- **Security**: Ryan Kim (Security) - Payment security, API key management, user data protection
- **Performance**: James Martinez (Performance) - Image processing optimization, fast generation
- **Copywriting**: Olivia Martinez (Copywriter) - App naming, marketing copy, user messaging
- **Market Research**: Laura Phillips (Market Research) - Market analysis, competitive positioning
- **Accessibility**: Allison Foster (Accessibility) - UI accessibility for diverse users
- **DevOps**: David Cooper (DevOps) - Deployment, CI/CD, infrastructure management
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, clarity

#### User Personas

**Primary: Sarah - Small Business Owner**
- Age: 32, Founder of boutique skincare brand
- Needs: Professional logo quickly, affordable solution, easy to use
- Pain Points: Can't afford designer, Fiverr inconsistent quality, DIY tools frustrating
- How We Help: Professional logos in seconds, affordable ($29 vs $500+), no design skills required

**Secondary: Marcus - Freelance Consultant**
- Age: 28, Marketing consultant, solo freelancer
- Needs: Personal brand logo, quick turnaround, professional appearance, low cost
- Pain Points: Busy with client work, limited budget, wants to look professional
- How We Help: Instant generation, extremely affordable, professional quality without time investment

#### AI Technology

**Primary AI Model**: OpenAI DALL-E 3 API
- Latest AI image generation technology
- High-quality, professional logo outputs
- Natural language understanding for descriptions
- Prompt optimization for best results

**Fallback Model**: Stability AI
- Cost-effective alternative
- Good quality for budget-conscious users
- Reduces dependency on single provider

**AI Cost Management**:
- Negotiate volume pricing with OpenAI
- Implement caching for similar prompts
- Quality filtering (reject low-quality outputs)
- Tiered pricing based on AI model used

#### Revenue Model

**Free Tier**:
- 1 free logo generation (with watermark)
- Basic customization
- Low-resolution download (512x512 PNG)

**Pay-Per-Logo** (MVP):
- $19-49 per logo (price testing needed)
- High-resolution download (2048x2048 PNG)
- Full customization access
- No watermark
- Lifetime access to purchased logos

**Subscription Plans** (Post-MVP):
- Basic ($29/mo): 10 logos per month
- Pro ($59/mo): 50 logos per month + vector export
- Business ($99/mo): Unlimited logos + brand kit + priority support

#### Performance Targets

- **Logo Generation**: <30 seconds
- **Page Load Time**: <2 seconds
- **API Response Time**: <200ms (excluding AI generation)
- **Image Delivery**: <1 second via CDN
- **Uptime**: 99%+

#### Business Value

- **Revenue Potential**: High - Large market (millions of small businesses), recurring revenue model
- **Market Size**: Multi-billion dollar logo design market
- **Competitive Advantage**: Latest AI technology, ease of use, affordable pricing
- **Growth Opportunity**: Subscription model enables predictable revenue growth
- **Scalability**: Digital product with low marginal costs

**Target Revenue**:
- Month 1: $2,000
- Month 3: $10,000 MRR
- Month 6: $25,000 MRR

**Expected Impact**: Democratize professional logo design, enable thousands of small businesses to access affordable branding

**Type**: Web Application + AI Service (SaaS)  
**Technology**: Angular 18 + Slim PHP 4 + MySQL/PostgreSQL + OpenAI DALL-E 3  
**Location**: `~/Documents/packages/docs/projects/ai-logo-generator/`

### Sports Results Tracker

**Status**: Planning Complete - Ready for Development  
**Priority**: Medium  
**Category**: Web Application (Full-Stack SaaS)

#### Overview

A comprehensive sports results tracking platform for soccer fans, coaches, and analysts. Fast, clean, mobile-first interface for real-time score updates, league standings, match fixtures, and team following. Designed to solve the problem of slow, cluttered sports websites with delayed updates and poor mobile experience.

**Target Users**: Soccer fans (18-45), fantasy soccer players, amateur coaches, casual viewers

#### Key Features

**MVP Features** (Phase 1):
- Live Score Tracking (30-second updates via polling)
- League Standings (Top 5 leagues: Premier League, La Liga, Serie A, Bundesliga, Ligue 1)
- Team Following (follow up to 5 favorite teams, localStorage-based)
- Match Fixtures (next 7 days, filtered by followed teams)
- Mobile-Responsive Interface (mobile-first design, <2 second load times)

**Phase 2 Features** (Weeks 11-14):
- User Accounts & Authentication (JWT)
- Push Notifications (goal alerts, match start reminders)
- WebSocket Real-Time Updates (<1 second latency)
- Player Statistics (goals, assists, cards per player)
- Match History (historical results, head-to-head records)

**Phase 3 Features** (Weeks 15-20):
- Additional Sports (basketball, American football, tennis)
- Custom Leagues (amateur and custom competitions)
- Social Features (match predictions, commenting)
- Developer API Access (premium tier)

**Phase 4 Features** (Weeks 21-28):
- Native Mobile Apps (iOS and Android)
- Premium Subscriptions (ad-free, advanced stats, API access)
- Fantasy League Integration
- Video Highlights (licensing dependent)

#### Tech Stack

**Frontend**:
- Framework: React 18 + TypeScript
- Build Tool: Vite 5.0
- Styling: Tailwind CSS 3.4
- State Management: Zustand 4.5 (UI state), React Query 5.17 (server state)
- Routing: React Router 6.21
- PWA: Vite PWA Plugin + Workbox

**Backend**:
- Runtime: Node.js 20 LTS
- Framework: Express 4.18
- Database: PostgreSQL 16
- Cache: Redis 7.2
- ORM: Prisma 5.8 (Phase 2)
- Auth: JWT + bcrypt (Phase 2)

**Infrastructure**:
- Frontend Hosting: Vercel (Free tier)
- Backend Hosting: Railway ($10-15/month)
- Data Source: API-Football (Free tier, 100 calls/day)
- Monitoring: Sentry + UptimeRobot (Free tiers)
- CI/CD: GitHub Actions

**Total MVP Cost**: ~$10-15/month

#### Documentation

- [Documentation Index](../projects/sports-results-tracker/INDEX.md) - Master overview and navigation
- [PRD Overview](../projects/sports-results-tracker/PRD_OVERVIEW.md) - Product requirements with comprehensive MVP definition
- [Architecture Overview](../projects/sports-results-tracker/ARCHITECTURE.md) - System architecture and technology stack
- [Frontend Architecture](../projects/sports-results-tracker/technical/frontend-architecture.md) - React architecture, state management, PWA
- [Backend Architecture](../projects/sports-results-tracker/technical/backend-architecture.md) - API design, database schema, caching
- [Infrastructure & Deployment](../projects/sports-results-tracker/technical/infrastructure-deployment.md) - Hosting, CI/CD, monitoring
- [Expert Contributions](../projects/sports-results-tracker/EXPERTS.md) - 14 expert reviews and sign-offs

#### Timeline

- **Phase 1 (MVP)**: Weeks 1-10 (8 weeks development + 2 weeks testing)
  - Target Launch: April 15, 2026
  - Development: Data ingestion, Core UI, Live scores, Standings, Fixtures, Following
  - Testing: Beta testing (50 users), Load testing, Cross-device testing
  
- **Phase 2 (Enhancement)**: Weeks 11-14 (4 weeks)
  - Target: June 1, 2026
  - Features: User accounts, Push notifications, WebSockets, Player stats, Match history
  
- **Phase 3 (Expansion)**: Weeks 15-20 (6 weeks)
  - Target: August 1, 2026
  - Features: Additional sports, Custom leagues, Social features, API access
  
- **Phase 4 (Mobile & Monetization)**: Weeks 21-28 (8 weeks)
  - Target: November 1, 2026
  - Features: Native mobile apps, Premium subscriptions, Fantasy integration, Video highlights

**Total Timeline**: 28 weeks (MVP + 3 enhancement phases)

#### Business Value

**Revenue Model**:
- **Phase 1 (MVP)**: Free with minimal ads (Google AdSense)
- **Phase 2**: Freemium model
  - Free Tier: Basic scores, standings, 3 followed teams, ads
  - Premium Tier ($4.99/month): Unlimited teams, ad-free, push notifications, player stats
- **Phase 3**: Premium+ Tier ($9.99/month): API access, advanced analytics, custom leagues

**Market Opportunity**:
- **Target Market**: Soccer fans worldwide (billions), growing fantasy soccer market
- **Differentiation**: Speed (<2s load times, <1s updates in Phase 2), simplicity (clean interface), mobile-first (80% mobile users)
- **Competitive Advantage**: Faster than ESPN/Fox Sports, cleaner than FlashScore, more comprehensive than official league apps

**Revenue Targets**:
- **Month 1**: 1,000 active users
- **Month 3**: 5,000 monthly active users
- **Month 6**: 10,000 monthly active users, $10,000 MRR (Phase 2)
- **Year 1**: 50,000 monthly active users, $50,000+ MRR

**Success Metrics**:
- User Adoption: 1,000 active users in first month
- User Engagement: 50% weekly return rate, 60% monthly retention
- Technical Performance: <2s page loads, 99% uptime, 99.9% data accuracy
- Business (Phase 2+): 5%+ free-to-premium conversion, <5% monthly churn

#### Expert Team (14 Experts - All Approved ✅)

**Core Team**:
- Patricia Martinez (Product Manager) - MVP definition, roadmap, prioritization
- Dorothy Clark (Documentation) - PRD structure, clarity, completeness

**Technical Team**:
- Marcus Johnson (Architecture) - System design, scalability
- Samuel Rodriguez (Backend) - API, database, data ingestion
- Thomas Anderson (Frontend) - React, state management, PWA
- Benjamin Lee (Database) - PostgreSQL schema, optimization
- Emily Chen (API Design) - RESTful endpoints, rate limiting
- James Martinez (Performance) - Caching, optimization, CDN
- David Cooper (DevOps) - CI/CD, deployment, monitoring

**Specialized Team**:
- Daisy Thompson (UI/UX) - Mobile-first design, user flows
- Ryan Kim (Security) - JWT auth, rate limiting, HTTPS
- Allison Foster (Accessibility) - WCAG 2.1 AA compliance
- Michael Brown (Mobile) - PWA, offline capability, native apps (Phase 4)
- Laura Phillips (Market Research) - Competitive analysis, user personas

#### Academic Classification

**Primary**: Computer Science - Full-Stack Web Development, Real-Time Systems, Mobile-First Design  
**Secondary**: Software Engineering - RESTful API Design, Progressive Web Apps, Caching Strategies

#### Educational Value

- **Full-Stack Architecture**: Demonstrates React frontend, Node.js/Express backend, PostgreSQL database
- **Real-Time Data**: Illustrates polling (MVP) and WebSocket (Phase 2) approaches for live updates
- **Caching Strategies**: Shows multi-layer caching (Redis, React Query, CDN) for performance
- **Mobile-First Design**: Exemplifies responsive design and Progressive Web App implementation
- **API Integration**: Demonstrates external API consumption (API-Football) and rate limit management
- **State Management**: Shows separation of UI state (Zustand) and server state (React Query)
- **Performance Optimization**: Illustrates code splitting, lazy loading, bundle optimization
- **DevOps Practices**: Shows CI/CD with GitHub Actions, monitoring with Sentry, auto-scaling

#### Subject Matter Areas

- **Computer Science**: Real-time systems, caching algorithms, API design, database optimization
- **Software Engineering**: Full-stack development, PWA implementation, state management patterns
- **Data Management**: Time-series data, caching strategies, data ingestion pipelines
- **User Experience**: Mobile-first design, accessibility (WCAG), performance optimization
- **DevOps**: Containerization, CI/CD, monitoring, auto-scaling

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational, excellent time-series support)
- **Schema Design**: Leagues, teams, matches, standings, fixtures with proper relationships
- **Indexing Strategy**: Indexes on match_date, league_id, team_id, status for query performance
- **Data Retention**: 2-season hot data (PostgreSQL + Redis), historical data archive (Phase 3)
- **Caching**: Redis for live scores (30-second TTL), React Query for client-side caching
- **Performance**: Connection pooling, query optimization, UUID primary keys for distributed scalability
- **Backup Strategy**: Railway-managed database backups, point-in-time recovery
- **Migration Strategy**: Version-controlled migrations with Prisma (Phase 2)

**Type**: Web Application (Full-Stack SaaS)  
**Technology**: React 18 + TypeScript + Node.js + Express + PostgreSQL + Redis  
**Location**: `~/Documents/packages/docs/projects/sports-results-tracker/`

## Non-Code Directories

The following directories exist in `~/Documents/` but are not code projects:

- `Adobe/` - Adobe application files
- `Electronic Arts/` - Game files
- `Library/` - System library
- `Obsidian Vault/` - Obsidian vault
- `Roblox/` - Roblox files
- `WebEx/` - WebEx files
- `Zoom/` - Zoom files
- `$RECYCLE.BIN/` - Recycle bin
- Various `.xlsx`, `.pdf`, `.jpg`, `.docx` files - Personal documents
- Hebrew-named directories and files - Personal documents

## Academic Classification Summary

### By Academic Discipline

**Computer Science Projects** (28 projects):
- Software Engineering: All 26 projects
- Database Systems: `ulvonix/`, `learning-games/`, `spoon-me/`, `personal-budget-manager/`, `subscription-bill-manager/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `pet-care-manager/`, `tai-chi-lessons/`, `ai-logo-generator/`
- Web Development: `learning-games/`, `spoon-me/`, `sandbox/keel/`, `track-deliveries/`, `personal-budget-manager/`, `project-health-dashboard/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `smart-travel-planner/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `subscription-bill-manager/`, `pet-care-manager/`, `tai-chi-lessons/`, `ai-logo-generator/`, `colis-company-showcase/`, `sports-results-tracker/`, `social-media-manager/`
- Mobile Development: `track-deliveries/`, `personal-budget-manager/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `smart-travel-planner/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `subscription-bill-manager/`, `mobile-learning-companion/`, `pet-care-manager/`, `tai-chi-lessons/`
- Distributed Systems: `ulvonix/`
- Human-Computer Interaction: `ulvonix/`, `learning-games/`, `spoon-me/`, `personal-budget-manager/`, `project-health-dashboard/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `smart-travel-planner/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `subscription-bill-manager/`, `track-deliveries/`, `pet-care-manager/`, `tai-chi-lessons/`, `ai-logo-generator/`
- Artificial Intelligence & Machine Learning: `smart-travel-planner/` - AI-powered itinerary generation, `ai-logo-generator/` - AI-powered logo generation using OpenAI DALL-E 3 and Stability AI
- Video Streaming Technology: `tai-chi-lessons/`
- Health & Wellness Technology: `tai-chi-lessons/`, `habit-tracker/`, `pet-care-manager/`, `medical-records-manager/`

**Educational Technology** (1 primary project):
- `learning-games/` - Learning/quiz application (primary educational focus)

**Information Science** (2 projects):
- `packages/` - Knowledge management system
- `workspace-documentation-hub/` - Documentation portal and knowledge discovery system

### By Educational Value

**High Educational Value**:
- `learning-games/` - Direct educational application (learning/quiz system)
- `packages/` - Knowledge management and documentation (supports learning)
- `workspace-documentation-hub/` - Documentation portal and knowledge discovery (developer tooling)
- `sandbox/keel/` - Component library (demonstrates software architecture)

**Moderate Educational Value**:
- `ulvonix/` - Distributed bot orchestration and automation
- `spoon-me/` - Business logic and e-commerce patterns
- `personal-budget-manager/` - Financial tracking and analytics
- `subscription-bill-manager/` - Recurring cost tracking
- `home-inventory-manager/` - Inventory management workflows
- `home-maintenance-tracker/` - Maintenance scheduling and reminders
- `smart-travel-planner/` - AI-powered travel planning with itinerary generation, budget tracking, collaborative features
- `energy-usage-tracker/` - Utility usage and cost tracking
- `appointment-queue-manager/` - Scheduling and queue workflows
- `vehicle-maintenance-tracker/` - Vehicle maintenance and expense tracking
- `medical-records-manager/` - Secure records and reminders
- `family-care-coordinator/` - Care coordination workflows
- `meal-planner-grocery/` - Planning and list generation
- `recipes/` - Recipe discovery and cooking workflows
- `chore-allowance-manager/` - Chore tracking and rewards
- `habit-tracker/` - Behavior tracking and engagement
- `pet-care-manager/` - Pet health tracking, medication reminders, notification systems
- `tai-chi-lessons/` - Video streaming, content management, wellness technology
- `ai-logo-generator/` - AI/ML integration, image generation, payment processing, SaaS business model

**Supporting/Infrastructure**:
- `find-hidden-files/` - Plugin development patterns
- `project-health-dashboard/` - Portfolio monitoring and reporting

### Research and Learning Opportunities

1. **Educational Technology Research** (`learning-games/`):
   - Gamification effectiveness
   - Adaptive learning algorithms
   - Question difficulty assessment
   - Learning analytics

2. **Software Architecture Research** (`sandbox/keel/`):
   - Component library design patterns
   - Monorepo management strategies
   - API design principles

3. **Database Systems Research** (`ulvonix/`, `learning-games/`, `spoon-me/`, `track-deliveries/`, `personal-budget-manager/`, `subscription-bill-manager/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `smart-travel-planner/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`):
   - Migration strategies and schema evolution
   - Distributed data management
   - Multi-bot coordination
   - Educational data management and learning analytics
   - E-commerce database design and transaction management
   - Query optimization and performance tuning
   - Database security and access control

4. **Knowledge Management Research** (`packages/`, `workspace-documentation-hub/`):
   - Documentation structure effectiveness
   - Information architecture patterns
   - Knowledge preservation strategies
   - Documentation discoverability and search
   - Visual documentation interfaces
   - Developer tool design patterns

5. **Video Streaming & Content Delivery Research** (`tai-chi-lessons/`):
   - Video streaming optimization (adaptive bitrate, CDN)
   - Content delivery networks and performance
   - Multi-angle video synchronization
   - Video player UX patterns
   - Offline video content access

6. **Wellness Technology Research** (`tai-chi-lessons/`, `habit-tracker/`, `pet-care-manager/`):
   - Gamification for behavior change in wellness applications
   - Progress tracking and motivation systems
   - Online learning effectiveness for physical practices
   - Community engagement in wellness platforms

7. **Artificial Intelligence & Machine Learning Research** (`travel-itinerary-wallet/`, `ai-logo-generator/`):
   - AI-powered itinerary generation (OpenAI GPT-4, Anthropic Claude) - merged from Smart Travel Planner
   - Prompt engineering for travel planning and recommendations
   - AI-powered image generation (OpenAI DALL-E 3, Stability AI)
   - Prompt engineering and optimization for AI models
   - AI API integration and cost management
   - AI quality filtering and output validation
   - Multi-model AI systems and fallback strategies
   - SaaS business models for AI-powered applications

## Summary

**Total Code Projects**: 27 active projects

1. `ulvonix/` - Social Media Bots Platform (CS: distributed systems, automation)
2. `find-hidden-files/` - Obsidian Plugin (CS: Plugin architecture, file systems)
3. `learning-games/` - Full-stack Game/Quiz App (Educational Technology, CS: Full-stack development)
4. `sandbox/keel/` - Angular Library (CS: Software architecture, component design)
5. `spoon-me/` - Next.js E-commerce App (CS: Web development, business systems)
6. `track-deliveries/` - Delivery Tracking App (CS: Web development, integrations)
7. `personal-budget-manager/` - Personal Budget Manager (CS: finance analytics)
8. `project-health-dashboard/` - Project Health Dashboard (CS: analytics, visualization)
9. `habit-tracker/` - Habit Tracking App (CS: engagement, analytics)
10. `home-inventory-manager/` - Home Inventory App (CS: organization, reporting)
11. `home-maintenance-tracker/` - Home Maintenance Tracker (CS: scheduling, reminders)
12. `medical-records-manager/` - Medical Records Manager (CS: security, scheduling)
13. `family-care-coordinator/` - Family Care Coordinator (CS: collaboration, access)
14. `travel-itinerary-wallet/` - Travel Itinerary & Document Wallet with AI Planning (CS: planning, alerts, AI integration) ⭐ MERGED
15. `vehicle-maintenance-tracker/` - Vehicle Maintenance Tracker (CS: scheduling, expenses)
16. `meal-planner-grocery/` - Meal Planner & Grocery (CS: planning, UX)
17. `recipes/` - Recipes Platform (CS: content discovery, UX)
18. `subscription-bill-manager/` - Subscriptions & Bills Manager (CS: finance analytics)
19. `pet-care-manager/` - Pet Care Manager (CS: health information systems, mobile, reminders)
20. `financial-goal-saver/` - Financial Goal Tracker & Automated Savings (CS: FinTech, automated savings)
21. `packages/` - Knowledge Base (Information Science: Knowledge management)
22. `workspace-documentation-hub/` - Workspace Documentation Portal (CS: documentation systems, knowledge management)
23. `tai-chi-lessons/` - Tai Chi Online Learning Platform (CS: video streaming, wellness technology)
24. `sports-results-tracker/` - Real-Time Sports Tracker (CS: real-time systems, PWA, sports technology)
25. `social-media-manager/` - Social Media Management Platform (CS: social technology, automation)
26. `colis-company-showcase/` - Company Portfolio & Marketing Website (CS: full-stack web, CMS, marketing technology)
27. `ai-logo-generator/` - AI-Powered Logo Generation Platform (CS: AI/ML, web development, SaaS, image generation)

**Academic Focus Areas**:
- **Primary**: Educational Technology (`learning-games/`), Artificial Intelligence & Machine Learning (`ai-logo-generator/`)
- **Secondary**: Software Engineering, Database Systems, Web Development
- **Supporting**: Information Science, Knowledge Management

---

**Note**: This list is based on directory structure and file analysis. Project status and details may need verification by examining each project more closely. Academic classifications are based on project descriptions and technology stacks, and may be refined with deeper analysis of each project's codebase and documentation.

---

## Review/Contribution

**Expert**: Dr. Robert Chen  
**Expertise**: Subject Matter (Physics, Math, CS, Academic Fields)  
**Date**: 2026-01-05  
**Changes**: Enhanced this projects list document by adding comprehensive academic classification and educational value assessment. For each project, added: academic classification (Computer Science, Information Science, Educational Technology), educational value assessment (high/moderate/supporting with specific learning opportunities), subject matter areas (detailed breakdown of CS topics, mathematics applications, software engineering concepts), and research opportunities (educational technology research, software architecture research, database systems research, knowledge management research). Added an "Academic Classification Summary" section organizing projects by academic discipline, educational value, and research opportunities. Also fixed the date from 2025-01-05 to 2026-01-05. This addition provides academic rigor and educational context to the project list, making it valuable for understanding the educational and research potential of each project, and helps identify learning opportunities and subject matter connections across the project portfolio.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this projects list document by adding comprehensive "Database Considerations" sections for database-using projects. Added detailed database considerations for `discord-story-bot/` (SQLite database with schema design, migration strategy, data persistence, backup strategy, query optimization, concurrency management), `learning-games/` (MySQL database with educational data schema, migration strategy, Docker persistence, backup strategy, query optimization, data integrity, scalability, security), and `spoon-me/` (PostgreSQL/MySQL database with e-commerce schema, migration strategy, data persistence, backup strategy, query optimization, data integrity, scalability, PCI compliance considerations). Enhanced the "Database Systems Research" section to include educational data management, e-commerce database design, query optimization, and database security research opportunities. This addition provides essential database perspective on projects, ensuring that database considerations are documented and understood for each project that uses databases, helping identify database design patterns, migration strategies, and optimization opportunities across the project portfolio.

---

