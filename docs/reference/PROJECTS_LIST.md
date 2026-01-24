# Projects List

This document lists all projects found in `~/Documents/` directory, categorized and analyzed from an academic and educational perspective.

**Last Updated**: 2026-01-23

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
  - `packages/core/` - Core package
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

### 9. `api-gateway-platform/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: High  
**Category**: Backend Platform / Infrastructure

#### Overview

The API Gateway Platform is an enterprise-grade, centralized API management solution designed to route, monitor, secure, and document APIs across microservices and distributed systems. It provides a unified entry point for all API traffic, handling cross-cutting concerns like authentication, authorization, rate limiting, request transformation, monitoring, and auto-generated documentation.

**Target Audience**: Platform engineers, DevOps teams, backend developers, API consumers, technical leads  
**Business Model**: Internal platform (MVP), potential enterprise SaaS offering (future)

#### Key Features

1. **API Routing Engine**: Dynamic routing rules, path/host/header-based routing, load balancing, health checks
2. **Multi-Method Authentication**: JWT (RS256, HS256), API keys, OAuth2 (Phase 2), custom auth providers (Phase 4)
3. **Flexible Authorization**: RBAC, policy-based authorization, attribute-based access control (Phase 4)
4. **Advanced Rate Limiting**: Per-IP, per-user, per-API rate limiting with Redis-backed counters, burst limits
5. **Comprehensive Monitoring**: Real-time metrics (Prometheus), request logging (ELK Stack), distributed tracing (Phase 3), Grafana dashboards

#### Tech Stack

- **Backend**: PHP (Slim framework) with Composer, gateway middleware
- **Frontend**: Angular with TypeScript (admin dashboard)
- **Database**: MySQL 8.0 (via Docker, for configuration, API keys)
- **Monitoring**: Prometheus, Grafana, ELK Stack (Elasticsearch, Logstash, Kibana)
- **Infrastructure**: Docker (containerization), Kubernetes (Phase 2), AWS (EC2, RDS, ElastiCache, CloudWatch), Nginx (reverse proxy)
- **CI/CD**: GitHub Actions, automated testing, blue-green deployments (MVP), Kubernetes rolling updates (Phase 2)

#### Documentation

- [Documentation Index](projects/api-gateway-platform/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/api-gateway-platform/PRD_OVERVIEW.md) - Main requirements document (500 lines)
- [Architecture](projects/api-gateway-platform/ARCHITECTURE.md) - Technical architecture (500 lines)
- [Expert Contributions](projects/api-gateway-platform/EXPERTS.md) - 10 expert sign-offs (400 lines)

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-12): Basic routing, JWT/API key authentication, rate limiting, request logging, basic monitoring dashboard
- **Phase 2 (Months 3-6)**: OAuth2 authentication, request transformation, advanced rate limiting, OpenAPI documentation generation
- **Phase 3 (Months 7-12)**: Distributed tracing, response caching, advanced analytics, alerting system, WebSocket support
- **Phase 4 (Year 2)**: Multi-tenancy, plugin system, developer portal, SDK generation, advanced RBAC, audit logs

**Target Launch**: June 2026 (MVP internal release to 5 pilot teams)

#### Business Value

- **Centralized Control**: Single entry point for all API traffic with unified security policies and observability
- **Enhanced Security**: Multi-method authentication, authorization, rate limiting prevent API abuse and security breaches
- **Complete Observability**: Real-time monitoring, logging, tracing enable proactive monitoring and fast debugging
- **Developer Experience**: Auto-generated documentation, interactive API explorer, reduced development time for cross-cutting concerns
- **Cost Savings**: 50% reduction in development time for auth, rate limiting, monitoring (no repetitive implementation)
- **Performance**: <5ms gateway overhead latency at 99th percentile, support for 10,000 requests/second per gateway instance

#### Expert Team (10 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, prioritization, business decisions
- **Architecture**: Marcus Johnson (Architecture) - System architecture, scalability planning
- **Backend**: Samuel Rodriguez (Backend) - Gateway services, routing engine, authentication/authorization
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint design, OpenAPI integration
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization, Redis data structures
- **Security**: Ryan Kim (Security) - JWT/API key authentication, RBAC, encryption, OWASP compliance
- **Performance**: James Martinez (Performance) - Gateway performance optimization, caching strategies, load balancing
- **Observability**: Kevin Martinez (Observability) - Prometheus metrics, ELK Stack logging, Grafana dashboards, distributed tracing
- **DevOps**: David Cooper (DevOps) - CI/CD pipeline, Kubernetes deployment, infrastructure automation, disaster recovery
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, clarity, completeness

**All experts approved and signed off on 2026-01-20**

#### Academic Classification

**Primary**: Computer Science - Distributed Systems, API Design, Infrastructure

**Educational Value**:
- Demonstrates API gateway architecture patterns (reverse proxy, request routing, load balancing, circuit breaker)
- Illustrates distributed system design (stateless services, shared state management with Redis, horizontal scaling)
- Shows enterprise security patterns (multi-method authentication, RBAC, rate limiting, encryption at rest/transit)
- Exemplifies observability best practices (structured logging, metrics collection, distributed tracing, dashboards)
- Demonstrates DevOps practices (CI/CD pipelines, blue-green deployments, infrastructure as code, disaster recovery)

**Subject Matter Areas**:
- **Computer Science**: API design, distributed systems, gateway architecture, authentication/authorization, rate limiting algorithms
- **Software Engineering**: Microservices patterns, middleware architecture, request processing pipelines, configuration management, plugin systems
- **Infrastructure**: Load balancing, caching strategies (Redis), database design (PostgreSQL), container orchestration (Kubernetes)
- **Security**: OWASP Top 10 mitigations, JWT authentication, API key management, encryption, audit logging, penetration testing
- **Observability**: Prometheus metrics, structured logging, distributed tracing (OpenTelemetry), Grafana dashboards, alerting

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for configuration, API keys, policies), Redis 7 (in-memory store for rate limiting, caching)
- **Schema Design**: Routes table (routing rules), api_keys table (API key storage with SHA-256 hashing), policies table (authorization policies), configuration table (gateway configuration)
- **Migration Strategy**: TypeORM migrations for PostgreSQL schema versioning, rollback support, seed data for development
- **Data Persistence**: PostgreSQL RDS with automated backups, point-in-time recovery; Redis ElastiCache with persistence enabled
- **Backup Strategy**: Automated daily backups for PostgreSQL, S3 backups for logs and configuration, RTO/RPO targets (1 hour RTO, 5 minutes RPO)
- **Query Optimization**: Indexes on frequently queried columns (routes.path_pattern, api_keys.key_hash), connection pooling with pg-pool, query result caching in Redis
- **Data Integrity**: Foreign key constraints, unique constraints, check constraints, transaction management for atomic operations
- **Scalability**: Connection pooling for PostgreSQL, read replicas for read-heavy workloads (Phase 2), Redis cluster for distributed caching (Phase 3)
- **Security**: Encryption at rest (AES-256), encryption in transit (TLS 1.2/1.3), AWS Secrets Manager for sensitive configuration, SHA-256 hashing for API keys

**Type**: API Gateway Platform  
**Technology**: Full-stack backend platform with admin dashboard  
**Location**: `~/Documents/packages/docs/projects/api-gateway-platform/`

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
- **Type**: Home Inventory Application
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
  - Mobile: Capacitor (iOS & Android)
- **Location**: `~/Documents/home-inventory-manager/`
- **Description**: Home inventory tracking with photos, warranties, and insurance reports
- **Structure**:
  - `backend/` - Inventory and reporting API
  - `frontend/` - Web dashboard
  - `mobile/` - Mobile app
  - `docs/` - Project documentation
- **Key Features**:
  - Item tracking and categorization
  - Warranty and receipt storage
  - Insurance reports
  - Barcode scanning
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates inventory management workflows
  - Illustrates document storage and reporting
- **Subject Matter Areas**:
  - Computer Science: Data modeling, search/filtering, API design
  - Software Engineering: UX for organization tools

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
- **Type**: Family Care Coordination Application
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
  - Mobile: Capacitor (iOS & Android)
- **Location**: `~/Documents/family-care-coordinator/`
- **Description**: Shared care schedules, tasks, and reminders for families and caregivers
- **Structure**:
  - `backend/` - Care coordination and task API
  - `frontend/` - Shared calendar and tasks
  - `mobile/` - Mobile reminders and updates
  - `docs/` - Project documentation
- **Key Features**:
  - Shared care calendar
  - Task assignments and checklists
  - Medication and routine tracking
  - Role-based access
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates collaborative scheduling workflows
  - Illustrates role-based permissions
- **Subject Matter Areas**:
  - Computer Science: Collaboration systems, access control
  - Software Engineering: UX for coordination tools

### 15. `travel-itinerary-wallet/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Travel Itinerary & Document Wallet (TripVault) is a customer-facing full-stack web and mobile application that centralizes travel plans, reservations, and critical travel documents. Users can build comprehensive itineraries, store tickets and documents securely, receive automated alerts for schedule changes and expirations, and access everything offline while traveling.

**Target Audience**: Frequent travelers, families, business travelers, international travelers (150M US travelers)  
**Business Model**: Freemium (Free tier: 1 active trip; Premium: $9.99/month for unlimited trips and features)

#### Key Features

1. **Itinerary Builder**: Day-by-day trip planning with flights, hotels, activities
2. **Reservation & Ticket Vault**: Store flight/hotel confirmations with QR code access
3. **Document Wallet**: Secure storage for passports, visas, insurance with expiration tracking (AES-256 encryption)
4. **Automated Alerts**: Push notifications and email for departures, check-ins, document expirations
5. **Offline-First Mobile App**: React Native app with full offline access to itineraries and documents
6. **User Authentication**: JWT-based secure authentication with bcrypt password hashing

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

### 16. `energy-usage-tracker/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)

#### Overview

Energy Usage Tracker (EnergyWise) is a customer-facing full-stack web and mobile application that helps households track utility usage (electricity, water, gas), monitor costs, and reduce bills through actionable insights. Users can log meter readings, import bills, receive high-usage alerts, and compare monthly trends to optimize their energy consumption and reduce expenses.

**Target Audience**: Homeowners, renters, families managing utility bills (130M US households)  
**Business Model**: Freemium SaaS (Free: 1 property, basic tracking; Premium: $9.99/month for multiple properties and advanced features)

#### Key Features

1. **Usage Tracking**: Manual meter readings, bill uploads, monthly usage summaries
2. **Cost Monitoring**: Total monthly costs, per-utility breakdown, budget thresholds and alerts
3. **Insights & Optimization**: Usage trend analysis, peak usage detection, saving recommendations
4. **Alerts & Reminders**: High-usage alerts, bill due reminders, budget overage warnings
5. **Multi-Property Support** (Premium): Track multiple homes, property-specific dashboards, exportable reports

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker)
- **Mobile** (Phase 2): Capacitor (iOS & Android), push notifications, offline-first architecture
- **Infrastructure**: Docker containerization, GitHub Actions CI/CD, DigitalOcean (MVP), AWS (post-MVP)

#### Documentation

- [Documentation Index](projects/energy-usage-tracker/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/energy-usage-tracker/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](projects/energy-usage-tracker/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/energy-usage-tracker/EXPERTS.md) - 16 expert sign-offs

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-10): Manual meter readings, cost monitoring, basic insights, budget alerts, monthly reports
- **Phase 2 (Months 4-6)**: Bill parsing/OCR, multi-property management, mobile app (React Native), advanced insights, CSV/PDF export
- **Phase 3 (Months 7-12)**: Utility provider integrations, optimization recommendations engine, historical analysis, family collaboration
- **Phase 4 (Year 2+)**: Smart home integrations, social features, advanced reporting

**Target Launch**: Q2 2026 (April-June 2026)

#### Business Value

- **Market Opportunity**: 130M US households with average utility costs $300-500/month ($4,200-6,000/year)
- **User Value**: Save 10-20% on utility bills ($400-800/year) through usage insights, budget alerts, optimization recommendations
- **Revenue Model**: Freemium SaaS targeting $6K ARR Year 1, $24K ARR Year 2, $72K ARR Year 3
- **Time Savings**: Reduce manual bill tracking from 30+ min/month to <5 min with quick meter logging
- **Success Metrics**: 60% weekly engagement, 8-12% free-to-premium conversion, <5% monthly churn

#### Expert Team (16 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, business model, prioritization
- **Architecture**: Marcus Johnson (Architecture) - System design, scalability planning, technology stack
- **Backend**: Samuel Rodriguez (Backend) - NestJS architecture, API design, business logic, bill parsing
- **Frontend**: Thomas Anderson (Frontend) - Next.js dashboard, state management, UI implementation
- **Mobile**: Michael Brown (Mobile) - React Native app, push notifications, offline-first architecture
- **UI/UX**: Daisy Thompson (UI/UX) - User personas, user flows, dashboard design, mobile-first UX
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation, screen reader support
- **Database**: Benjamin Lee (Database) - PostgreSQL schema, query optimization, indexing strategy
- **API Design**: Emily Chen (API Design) - RESTful API patterns, endpoint structure, OpenAPI documentation
- **Security**: Ryan Kim (Security) - JWT authentication, data encryption, GDPR/CCPA compliance
- **Performance**: James Martinez (Performance) - Dashboard optimization, caching strategies, response time targets
- **Business Intelligence**: Gary Wilson (BI) - Insights engine, analytics architecture, KPIs, optimization recommendations
- **DevOps**: David Cooper (DevOps) - Docker, CI/CD pipeline, infrastructure setup, AWS migration planning
- **Observability**: Kevin Martinez (Observability) - Logging (Winston), monitoring, error tracking (Sentry)
- **Copywriter**: Olivia Martinez (Copywriter) - App naming (EnergyWise), value proposition, UI copy
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, documentation completeness

**All experts approved and signed off on 2026-01-20**

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, Human-Computer Interaction

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates usage monitoring and analytics systems
- Shows budget alert systems and notification architecture
- Exemplifies freemium SaaS business model
- Demonstrates optimization recommendations engine
- Illustrates mobile-first responsive design and React Native development

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, API design, data visualization, mobile UX, push notifications, real-time alerts
- **Software Engineering**: Modular architecture (NestJS modules), RESTful API design, data modeling, background jobs (Bull + Redis)
- **Database Systems**: PostgreSQL schema design, query optimization, indexing strategies, connection pooling, read replicas
- **Security**: JWT authentication, bcrypt password hashing, data encryption (at rest/in transit), GDPR/CCPA compliance
- **Business**: Freemium SaaS model, subscription management, user acquisition, retention strategies, cost optimization

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured utility data)
- **Schema Design**: Users, properties, utilities, meter readings, bills, budgets, alerts
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for readings, bills, budgets, alerts with automated daily backups
- **Backup Strategy**: DigitalOcean managed database automated backups (7-day retention), RTO 4 hours, RPO 24 hours
- **Query Optimization**: Indexes on user_id, property_id, date fields; selective fetching; pagination; caching (Phase 2+)
- **Data Integrity**: Foreign key constraints, unique constraints, check constraints for data validation
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling (10 connections MVP, 20-30 production)
- **Security**: Encryption at rest (managed database), encryption in transit (TLS 1.2/1.3), GDPR/CCPA compliance

**Type**: Energy & Utilities Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/energy-usage-tracker/`

### 17. `appointment-queue-manager/`
- **Type**: Appointment & Queue Application
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
  - Mobile: Capacitor (iOS & Android)
- **Location**: `~/Documents/appointment-queue-manager/`
- **Description**: Appointment scheduling with live queue updates and wait‑time alerts
- **Structure**:
  - `backend/` - Scheduling and queue API
  - `frontend/` - Booking and staff dashboard
  - `mobile/` - Customer updates and reminders
  - `docs/` - Project documentation
- **Key Features**:
  - Appointment booking
  - Live queue management
  - Wait time notifications
  - Staff scheduling
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates real‑time queue systems
  - Illustrates scheduling workflows and notifications
- **Subject Matter Areas**:
  - Computer Science: Real‑time systems, scheduling, API design
  - Software Engineering: UX for booking and wait times

### 18. `vehicle-maintenance-tracker/`
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

### 19. `meal-planner-grocery/`

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

### 20. `recipes/`

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

### 21. `chore-allowance-manager/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Chore & Allowance Manager (ChoreFlow) is a customer-facing full-stack web and mobile application that helps families manage household chores, rewards, and allowances. Parents can assign tasks, set rewards, and track completion. Kids can see their chores, earn points, and learn responsibility through clear, gamified progress.

**Target Audience**: Families with kids (ages 6-18)  
**Business Model**: Freemium (Free tier up to 2 family members, Premium $9.99/month for unlimited)

#### Key Features

1. **Chore Assignment & Management**: Create, assign, and track recurring and one-time chores with due dates
2. **Rewards & Allowance Tracking**: Points, rewards, and automatic allowance calculation based on completed chores
3. **Family Dashboard**: Household overview with progress tracking and completion summaries
4. **Notifications & Reminders**: Automatic push notifications for chore reminders, completion, and missed chores
5. **Gamification System**: Streaks, badges, levels, and progress charts to increase kid engagement

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, responsive/mobile-first design
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker)
- **Mobile**: Capacitor (iOS & Android), push notifications, offline-first architecture
- **Infrastructure**: Docker containerization, CI/CD (GitHub Actions), AWS (CloudFront, ECS, RDS)

#### Documentation

- [Documentation Index](projects/chore-allowance-manager/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/chore-allowance-manager/PRD_OVERVIEW.md) - Main requirements document (458 lines)
- [Architecture](projects/chore-allowance-manager/ARCHITECTURE.md) - Technical architecture (488 lines)
- [Expert Contributions](projects/chore-allowance-manager/EXPERTS.md) - 15 expert sign-offs (342 lines)
- [Feature PRDs](projects/chore-allowance-manager/features/) - Detailed feature specifications

#### Timeline

- **Phase 1 (MVP)** (Months 1-3): Chore lists, assignments, reminders, basic rewards, web dashboard, basic mobile app
- **Phase 2 (Core)** (Months 4-6): Family dashboard, allowance tracking, full mobile app, push notifications, analytics
- **Phase 3 (Advanced)** (Months 7-12): Full gamification system, advanced analytics, multi-household support, custom rewards

**Target**: 2,000 active families by end of year 1

#### Business Value

- **Revenue Potential**: Freemium SaaS model with $9.99/month Premium tier targeting 40M US families with kids
- **Market Gap**: Family-specific chore management (vs generic to-do apps), allowance integration, COPPA-compliant gamification
- **User Value**: Reduces household friction around chores, teaches responsibility and financial literacy
- **Success Metrics**: 60% weekly active families, 40% 3-month retention, 8% free-to-premium conversion, 70% chore completion rate

#### Expert Team (15 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager)
- **Architecture**: Marcus Johnson (Architecture)
- **Backend**: Samuel Rodriguez (Backend)
- **Frontend**: Thomas Anderson (Frontend)
- **Mobile**: Michael Brown (Mobile)
- **UI/UX**: Daisy Thompson (UI/UX)
- **Database**: Benjamin Lee (Database)
- **Security**: Ryan Kim (Security)
- **Accessibility**: Allison Foster (Accessibility)
- **Compliance**: Constance White (Compliance - COPPA)
- **API Design**: Emily Chen (API Design)
- **DevOps**: David Cooper (DevOps)
- **Testing**: Robert Brown (Testing)
- **Code Quality**: Jessica Taylor (Code Quality)
- **Documentation**: Dorothy Clark (Documentation)

**All experts approved and signed off on 2026-01-20**

#### Academic Classification

**Primary**: Computer Science - Web Development, Human-Computer Interaction, Family Coordination Systems

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates offline-first mobile architecture with background sync
- Shows RBAC (Role-Based Access Control) for family applications
- Exemplifies COPPA compliance for kids under 13
- Demonstrates gamification mechanics for behavior change
- Illustrates freemium SaaS business model

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, mobile UX, offline data sync, real-time notifications, API design
- **Software Engineering**: Microservices architecture (future), CI/CD pipelines, Docker containerization, scalability planning
- **Database Systems**: PostgreSQL schema design, query optimization, data relationships (many-to-many user-family relationships)
- **Security**: JWT authentication, RBAC, COPPA compliance, data encryption (at rest and in transit)
- **Business**: Freemium SaaS model, user retention strategies, family productivity market

### 22. `mobile-learning-companion/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Mobile Learning Application (iOS & Android)

#### Overview

The **Mobile Learning Companion** is an offline-first educational mobile application that enables learners to practice skills, track progress, and maintain consistent learning habits through intelligent reminders. Built with Capacitor for cross-platform deployment, the app solves the connectivity barrier problem by allowing practice sessions entirely offline, with automatic background sync when connectivity returns.

**Target Users**: Self-directed learners (ages 13+), students (K-12, university), professional learners  
**Core Problem**: Learners struggle to practice consistently without internet access and lack progress visibility  
**Core Solution**: Offline-capable practice with visual progress tracking and adaptive reminders

#### Technology Stack

- **Frontend/Mobile**: Angular 18, Capacitor 6, Ionic Framework 7
- **Backend**: PHP 8.2, Slim Framework 4
- **Database**: MySQL 8.0
- **State Management**: RxJS + Angular Services
- **Offline Storage**: Capacitor Storage Plugin (SQLite)
- **Infrastructure**: DigitalOcean Droplet, GitHub Actions (CI/CD)
- **Push Notifications**: APNS (iOS), FCM (Android)
- **Location**: `~/Documents/mobile-learning-companion/`

#### Key Features

**MVP Features** (Phase 1 - 12 weeks):
- Offline practice mode (download up to 50 questions)
- 4 question types (multiple choice, true/false, fill-blank, short answer)
- Progress dashboard (stats, streaks, recent activity)
- Smart notifications (customizable daily reminders, streak protection)
- Practice session flow with immediate feedback
- User authentication (email/password, JWT-based)
- Content library (browse, search, download practice sets)

**Post-MVP Features**:
- **Phase 2**: Spaced repetition system, advanced analytics, content creation tools
- **Phase 3**: Gamification (points, badges, levels), social features (leaderboards, groups)
- **Phase 4**: AI-powered adaptive learning, multimedia content, internationalization (i18n)

#### Architecture Highlights

- **Offline-First**: Core functionality works 100% offline with background sync
- **Sync Strategy**: Last-Write-Wins (LWW) conflict resolution with timestamps
- **Database Schema**: Normalized (3NF) with optimized indexes
- **API Design**: RESTful with JWT authentication
- **Performance Targets**: <3s app launch, <500ms API response, 60 FPS UI
- **Security**: bcrypt password hashing, JWT tokens, HTTPS/TLS, secure storage (Keychain/EncryptedSharedPreferences)
- **Scalability**: Single server (MVP) → Load balanced (Phase 3) → Microservices (Phase 4)

#### Business Model

- **Freemium Model**: 
  - Free Tier: 50 offline questions, basic dashboard, standard question types, 1 device
  - Premium Tier: $4.99/month or $39.99/year (unlimited offline, advanced analytics, spaced repetition, 3 devices, ad-free)
- **Target Conversion**: 5-8% free-to-premium
- **Revenue Target**: $2,500 MRR by Q3 2026, $15,000 MRR by Q1 2027

#### Documentation

- [PRD Overview](projects/mobile-learning-companion/PRD_OVERVIEW.md) - Comprehensive product requirements with MVP definition
- [Architecture](projects/mobile-learning-companion/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/mobile-learning-companion/EXPERTS.md) - Expert reviews and sign-offs
- [Documentation Index](projects/mobile-learning-companion/INDEX.md) - Navigation guide

#### Timeline

- **Phase 1 (MVP)** (Q2 2026 - 12 weeks): Foundation, core features, polish & launch
  - Month 1-2: Backend API, authentication, database, mobile scaffolding, offline storage
  - Month 2-3: Practice questions, offline sync, progress dashboard, content library, notifications
  - Month 3: Beta testing (50 users), bug fixes, app store submission, public launch
- **Phase 2 (Enhanced Learning)** (Q3 2026 - 12 weeks): Spaced repetition, advanced analytics, content creation, premium launch
- **Phase 3 (Social & Gamification)** (Q4 2026 - 12 weeks): Gamification, leaderboards, study groups, referral program
- **Phase 4 (Advanced Features)** (Q1 2027 - 12 weeks): Adaptive learning, multimedia, i18n, institution partnerships

**Target**: 1,000 users (MVP launch), 5,000 users (Q3 2026), 25,000 users (Q1 2027)

#### Business Value

- **Market Opportunity**: $80B mobile learning market, 10M+ active mobile learners addressable
- **Competitive Advantage**: Offline-first + cross-subject + mobile-native + smart reminders (competitors lack one or more)
- **Revenue Potential**: Freemium SaaS targeting 50M+ US students and 100M+ global self-learners
- **User Value**: Enables learning in low-connectivity environments, increases practice consistency, provides progress visibility
- **Success Metrics**: 60% WAU, 40% D30 retention, 5-8% premium conversion, 30% offline usage, NPS 50+

#### Expert Team (17 Experts - All Approved)

- **Product**: Patricia Martinez (Product Manager)
- **Architecture**: Marcus Johnson (Architecture)
- **Mobile**: Michael Brown (Mobile)
- **Educational Content**: Carol Williams (Educational Content)
- **Backend**: Samuel Rodriguez (Backend)
- **Frontend**: Thomas Anderson (Frontend)
- **Database**: Benjamin Lee (Database)
- **UI/UX**: Daisy Thompson (UI/UX)
- **Accessibility**: Allison Foster (Accessibility)
- **Security**: Ryan Kim (Security)
- **API Design**: Emily Chen (API Design)
- **Performance**: James Martinez (Performance)
- **Learning Analytics**: Andrew Mitchell (Learning Analytics)
- **Compliance**: Constance White (Compliance)
- **Testing**: Robert Brown (Testing)
- **DevOps**: David Cooper (DevOps)
- **Documentation**: Dorothy Clark (Documentation)

**All experts approved and signed off on 2026-01-22**

#### Academic Classification

**Primary**: Computer Science - Mobile Development, Human-Computer Interaction, Educational Technology

**Educational Value**:
- Demonstrates offline-first mobile architecture with background sync
- Illustrates cross-platform mobile development (Capacitor for iOS/Android)
- Shows educational technology principles (spaced repetition, progress tracking, adaptive learning)
- Exemplifies mobile-native UX patterns and performance optimization
- Demonstrates freemium SaaS business model for educational apps
- Shows JWT authentication and secure offline storage strategies

**Subject Matter Areas**:
- **Computer Science**: Mobile development, offline data sync, cross-platform development, background sync, push notifications
- **Software Engineering**: RESTful API design, database schema design, scalability planning, CI/CD pipelines
- **Database Systems**: MySQL schema design, query optimization, data normalization, indexing strategies
- **Security**: JWT authentication, password hashing (bcrypt), secure storage (Keychain/EncryptedSharedPreferences), HTTPS/TLS
- **Human-Computer Interaction**: Mobile UX patterns, progress visualization, notification design, accessibility (WCAG 2.1)
- **Educational Technology**: Learning analytics, spaced repetition, adaptive learning, progress tracking, gamification
- **Business**: Freemium pricing models, app store distribution, user acquisition strategies, mobile app monetization

### 23. `subscription-bill-manager/`

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

### 25. `pet-care-manager/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: High  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Pet Care Manager is a comprehensive, customer-facing full-stack web and mobile application that helps pet owners manage all aspects of pet care. It centralizes health records, vet appointments, medications, vaccinations, grooming schedules, feeding routines, and expenses into one convenient platform. Pet owners gain peace of mind through automated reminders, proactive health tracking, and complete visibility into their pet's care history.

**Target Audience**: Pet owners (67 million US households with 143 million pets)  
**Business Model**: Freemium (Free tier for 1 pet, Premium $7.99/month for unlimited pets + advanced features)

#### Key Features

1. **Pet Profiles**: Create profiles with photos, basic info, species/breed information
2. **Medication Tracking & Reminders**: Schedule medications with automatic reminders, dose logging, medication history
3. **Vet Appointment Management**: Schedule appointments, vet contact info, appointment reminders, visit history
4. **Vaccination Tracking**: Track vaccination dates, automatic booster reminders, vaccination records export
5. **Health Records Vault**: Store vet notes, lab results, x-rays, health documents with quick emergency access

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, for structured pet data)
- **Mobile**: Capacitor (iOS & Android), push notifications
- **Infrastructure**: Docker containerization, DigitalOcean (MVP), GitHub Actions (CI/CD)

#### Documentation

- [PRD](projects/pet-care-manager/PRD.md) - Complete product requirements document

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

### 26. `financial-goal-saver/`

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

### 27. `price-drop-tracker/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

**Price Drop Tracker** (working names: DealWatch, PriceWatch, SaveSmart) is a customer-facing full-stack web and mobile application that helps online shoppers save money by automatically tracking product prices across multiple retailers (Amazon, AliExpress, Shein, eBay, Walmart), sending intelligent alerts when prices drop below target thresholds, and providing actionable price history insights to inform purchasing decisions.

**Target Audience**: Online shoppers (ages 25-45), price-conscious consumers, deal hunters, families managing shopping budgets (230M US online shoppers)  
**Business Model**: Freemium (Free: 10 items, basic alerts; Premium: $9.99/month for unlimited items + advanced features)

#### Key Features

1. **Item Tracking**: Add items via URL, barcode scan (mobile), or search with automatic data extraction
2. **Automated Price Monitoring**: Scheduled background jobs check prices daily (hourly for premium), store price history
3. **Smart Alerts**: Email/push/SMS notifications for price drops (>10% threshold), target price hits, deal expirations
4. **Price History & Insights**: Interactive charts, volatility analysis, best time to buy indicators, savings analytics
5. **Multi-Retailer Support**: Amazon, AliExpress, Shein (MVP), eBay, Walmart, Target (Phase 3)
6. **Mobile App**: React Native with Expo, barcode scanning, push notifications, offline access
7. **Watchlists**: Organize items by category, share with family, collaborative shopping lists
8. **Savings Tracking**: Total savings dashboard, per-item savings, monthly reports

#### Tech Stack

- **Frontend**: Angular with TypeScript, Tailwind CSS, shadcn/ui, Recharts (price charts)
- **Backend**: PHP (Slim framework) with Composer, RESTful API
- **Database**: MySQL 8.0 (via Docker, for items, prices, users, alerts, watchlists)
- **Background Jobs**: Cron jobs for scheduled price monitoring
- **Web Scraping**: PHP libraries (Goutte, simple_html_dom) for HTML parsing
- **Mobile**: Capacitor (iOS & Android), barcode scanner, push notifications
- **Infrastructure**: Docker, DigitalOcean (MVP), AWS (post-MVP), GitHub Actions CI/CD
- **Integrations**: SendGrid (email), push notifications, Twilio (SMS - Phase 3), Stripe (payments)

#### Documentation

- [Documentation Index](projects/price-drop-tracker/INDEX.md) - Complete navigation guide
- [PRD Overview](projects/price-drop-tracker/PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](projects/price-drop-tracker/ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](projects/price-drop-tracker/EXPERTS.md) - 16 expert contributions (pending review)

#### Timeline

- **Phase 1 (MVP)** (Weeks 1-12): Item tracking (URL), daily price monitoring, email alerts, simple dashboard, JWT authentication
- **Phase 2 (Months 4-6)**: Price history charts, target price alerts, React Native mobile app, barcode scanning, push notifications, watchlist organization
- **Phase 3 (Months 7-12)**: Coupon detection, savings analytics, additional retailers (eBay, Walmart, Target), best time to buy indicators, family collaboration
- **Phase 4 (Year 2+)**: Price prediction (ML), browser extension (Chrome/Firefox), deal sharing, social features

**Target Launch**: April 15, 2026 (Week 13) - MVP Soft Launch (100 beta users)

#### Business Value

- **Market Opportunity**: 230M US online shoppers who track prices manually, multi-billion dollar e-commerce savings market
- **User Value**: Save $300-500/year through automated tracking, 5-10 hours/month time savings, data-driven purchasing decisions
- **Revenue Model**: Freemium SaaS targeting $10K MRR by Month 12 (1,000 premium users @ $9.99/month)
- **Competitive Advantage**: Multi-retailer support (not Amazon-only), mobile barcode scanning, family collaboration, comprehensive analytics
- **Success Metrics**: 100 users (Month 1), 1,000 (Month 6), 10,000 (Month 12), 60% weekly engagement, 10-12% free-to-premium conversion

#### Expert Team (16 Experts - All Pending Review)

- **Product**: Patricia Martinez (Product Manager) - MVP definition, business model, prioritization, go-to-market
- **Documentation**: Dorothy Clark (Documentation) - PRD structure, completeness, clarity
- **Backend**: Samuel Rodriguez (Backend) - Price monitoring jobs, API design, web scraping, scheduled tasks
- **Frontend**: Thomas Anderson (Frontend) - Next.js dashboard, price charts, state management
- **Mobile**: Michael Brown (Mobile) - React Native, barcode scanning, push notifications, offline support
- **Database**: Benjamin Lee (Database) - PostgreSQL schema (5 tables), query optimization, indexing
- **API Design**: Emily Chen (API Design) - RESTful patterns, retailer integrations, endpoint structure
- **UI/UX**: Daisy Thompson (UI/UX) - Dashboard design, user flows, mobile UX
- **Security**: Ryan Kim (Security) - JWT authentication, data encryption, payment security (Stripe)
- **Business Intelligence**: Gary Wilson (BI) - Price analytics, savings reports, KPIs
- **DevOps**: David Cooper (DevOps) - CI/CD (GitHub Actions), Docker, scheduled job infrastructure
- **Performance**: James Martinez (Performance) - Job optimization, caching (Redis), query performance
- **Observability**: Kevin Martinez (Observability) - Sentry (error tracking), Winston (logging), monitoring dashboards
- **Accessibility**: Allison Foster (Accessibility) - WCAG compliance, keyboard navigation, screen readers
- **Copywriter**: Olivia Martinez (Copywriter) - App naming (DealWatch/PriceWatch/SaveSmart), UI copy, email templates
- **SEO**: Amanda Davis (SEO) - Product search optimization, keyword research, content strategy

**All experts pending review as of 2026-01-22**

#### Academic Classification

**Primary**: Computer Science - Web Development, Mobile Development, E-Commerce Technology

**Educational Value**:
- Demonstrates full-stack architecture (Next.js, NestJS, React Native, PostgreSQL)
- Illustrates scheduled background jobs (Bull + Redis) for automated price monitoring
- Shows web scraping techniques (Cheerio, Puppeteer) for data extraction
- Exemplifies freemium SaaS business model with conversion strategies
- Demonstrates push notification systems (Firebase Cloud Messaging)
- Illustrates data visualization (Recharts) for price history and trends
- Shows mobile barcode scanning implementation (Expo Barcode Scanner)

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, API design, mobile UX, web scraping, background job processing, data visualization
- **Software Engineering**: Scheduled task architecture, NestJS module design, CI/CD pipelines, Docker containerization
- **Database Systems**: PostgreSQL schema design (5 tables with complex relationships), query optimization, price history storage
- **Security**: JWT authentication, data encryption (at rest/transit), payment processing (Stripe PCI compliance)
- **Business**: Freemium SaaS model, subscription management, e-commerce savings market, competitive analysis

#### Database Considerations

- **Database Type**: PostgreSQL (relational database for structured price tracking data)
- **Schema Design**: Users, Items, Prices (price history), Alerts, Watchlists, WatchlistItems (many-to-many)
- **Migration Strategy**: Prisma migrations for schema versioning and evolution
- **Data Persistence**: Persistent storage for items, price history (30-90 days), alerts, watchlists
- **Backup Strategy**: Automated daily backups, point-in-time recovery, 7-day retention
- **Query Optimization**: Indexes on user_id, item_id, timestamp; connection pooling; pagination for large datasets
- **Data Integrity**: Foreign key constraints, unique constraints, cascade deletes, timestamps
- **Scalability**: Read replicas for read-heavy workloads (Phase 2+), connection pooling (10-20 connections MVP)
- **Security**: Encryption at rest (AES-256), encryption in transit (TLS 1.3), GDPR/CCPA compliance

**Type**: Price Tracking and Deal Alert Application  
**Technology**: Full-stack web + mobile  
**Location**: `~/Documents/packages/docs/projects/price-drop-tracker/`

### 28. `packages/`
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

### 29. `workspace-documentation-hub/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: High  
**Category**: Internal Tool / Developer Documentation Portal

#### Overview

**Workspace Documentation Hub** is a visual, interactive documentation portal that serves as the central hub for navigating and understanding the entire workspace ecosystem. This tool helps developers quickly discover packages, CLI tools, Cursor commands, and workflows without digging through files, acting as a comprehensive knowledge base and navigation system for the monorepo workspace.

**Target Audience**: Developers working in the monorepo, new team members onboarding, project managers reviewing capabilities  
**Business Value**: 70% reduction in documentation lookup time, 50% faster onboarding, improved developer productivity

#### Key Features

1. **Package Catalog**: Comprehensive, searchable directory of all workspace packages (core, git-workflow, task-manager, template-project, etc.) with metadata, capabilities, usage examples
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

### 30. `tai-chi-lessons/`

**Status**: Planning (Comprehensive PRD Complete)  
**Priority**: Medium  
**Category**: Full-Stack Web + Mobile Application (Customer-Facing)

#### Overview

Tai Chi Lessons Platform is an online platform for learning and practicing tai chi through video lessons, guided practice sessions, and progress tracking. The platform makes this ancient martial art accessible to students of all levels, addressing barriers like limited access to qualified instructors, inflexible class schedules, and lack of structured learning paths.

**Target Audience**: Adults aged 30-70 seeking stress relief, gentle exercise, or mindfulness practice; martial arts practitioners; seniors  
**Business Model**: Freemium (Free tier with 5 beginner lessons; Premium: $19.99/month or $149.99/year; Premium+: $39.99/month)

#### Key Features

1. **Video Lesson Library**: 8-week beginner course, Yang style content, HD streaming with multi-angle views
2. **User Accounts & Progress Tracking**: Personal dashboard, progress tracking, bookmarking, practice history and streaks
3. **Practice Sessions**: Guided practice, solo practice mode, form practice at different speeds, breathing exercises
4. **Search & Navigation**: Browse by level, search by keyword/duration/instructor, featured content recommendations
5. **Interactive Features** (Phase 2): AI form analysis, live classes, Q&A sessions, progress assessments
6. **Community Features** (Phase 2): Discussion forums, social sharing, practice groups, challenges
7. **Advanced Content** (Phase 3): Multiple styles (Chen, Wu, Sun), weapons forms, push hands, martial applications, qigong
8. **Personalization**: Learning paths based on goals, adaptive recommendations, customizable routines, offline downloads

#### Tech Stack

- **Frontend**: React/Next.js for web, React Native for mobile apps (Phase 2)
- **Backend**: Node.js/Express or Python/Django, RESTful API
- **Database**: PostgreSQL or MongoDB
- **Video Streaming**: AWS S3 + CloudFront or Vimeo API
- **Authentication**: OAuth 2.0, JWT tokens
- **Payment**: Stripe integration
- **Infrastructure**: Cloud-based (AWS), Docker containerization

#### Documentation

- [PRD](projects/tai-chi-lessons/PRD.md) - Complete product requirements document with MVP definition

#### Timeline

- **Phase 1 (MVP)** (Months 1-3): Beginner Yang-style content (50 hours), user accounts, video player, progress tracking, payment integration, basic marketing website
- **Phase 2 (Launch & Growth)** (Months 4-6): Public launch, user feedback iteration, intermediate content expansion, onboarding improvements
- **Phase 3 (Scale & Expand)** (Months 7-12): Additional tai chi style (Chen/Wu), live classes, community features, mobile apps
- **Phase 4 (Advanced)** (Year 2): AI form analysis, weapons forms, international expansion, corporate wellness partnerships

**Target Launch**: Month 4 (Public Launch)

#### Business Value

- **Market Opportunity**: Growing wellness and mindfulness market, aging population seeking low-impact exercise
- **User Value**: Accessible tai chi instruction regardless of location, flexible scheduling, structured learning paths, progress tracking
- **Revenue Model**: Freemium SaaS targeting $2K MRR (Month 3), $9K MRR (Month 6), $30K MRR (Month 12)
- **User Retention**: Habit formation through practice streaks, gamification, community engagement
- **Success Metrics**: 1,000 users (Month 3), 3,000 (Month 6), 10,000 (Month 12), 10-15% free-to-paid conversion

#### Expert Team (Needed)

- **Product**: Patricia Martinez (Product Manager) - PRD creation, MVP definition, prioritization
- **Market Research**: Dr. Sarah Johnson (Market Research) - Competitive analysis, pricing strategy, target audience validation
- **Architecture**: Marcus Johnson (Architecture) - System architecture, video streaming infrastructure, scalability
- **Backend**: Samuel Rodriguez (Backend) - API design, authentication, video delivery, database operations
- **Frontend**: Thomas Anderson (Frontend) - React/Next.js, video player UI, dashboard implementation
- **Mobile**: Michael Brown (Mobile) - React Native apps (Phase 2), offline content, push notifications
- **UI/UX**: Daisy Thompson (UI/UX) - User flows, video player UX, practice session design
- **Database**: Benjamin Lee (Database) - Schema design, query optimization, content metadata management
- **API Design**: Emily Chen (API Design) - RESTful patterns, video streaming API, progress tracking endpoints
- **Security**: Ryan Kim (Security) - Authentication, payment security, content protection (DRM)
- **Performance**: James Martinez (Performance) - Video streaming optimization, CDN configuration, adaptive bitrate
- **DevOps**: David Cooper (DevOps) - CI/CD, video hosting infrastructure, deployment automation
- **Observability**: Kevin Martinez (Observability) - Logging, monitoring, video analytics
- **Copywriter**: Olivia Martinez (Copywriter) - Platform naming, marketing copy, value proposition
- **Documentation**: Dorothy Clark (Documentation) - Documentation structure, completeness

#### Academic Classification

**Primary**: Computer Science - Web Development, Video Streaming Technology, Health & Wellness Technology

**Educational Value**:
- Demonstrates full-stack architecture with video streaming (Next.js, Node.js/Django, React Native, PostgreSQL)
- Illustrates video delivery optimization (CDN, adaptive bitrate, multi-angle views)
- Shows progress tracking and gamification mechanics for behavior change
- Exemplifies freemium SaaS business model in wellness sector
- Demonstrates content management system for educational video content
- Illustrates community features and social engagement patterns

**Subject Matter Areas**:
- **Computer Science**: Full-stack development, video streaming, CDN optimization, API design, mobile UX, content delivery
- **Software Engineering**: Video player implementation, progress tracking systems, modular architecture, microservices patterns
- **Database Systems**: Content metadata management, user progress storage, query optimization for video content
- **Security**: OAuth 2.0 authentication, payment processing (Stripe PCI compliance), content protection (DRM), data encryption
- **Business**: Freemium SaaS model, wellness market positioning, subscription management, content monetization
- **Health & Wellness**: Mindfulness practice platforms, exercise instruction systems, senior-friendly UX design

#### Database Considerations

- **Database Type**: PostgreSQL 16 (relational database for structured content and user data) or MongoDB (flexible schema for content metadata)
- **Schema Design**: Users, lessons (videos), courses, progress tracking, practice sessions, bookmarks, subscriptions, instructors
- **Migration Strategy**: Database migrations for schema evolution, content updates, new feature additions
- **Data Persistence**: Persistent storage for user data, progress tracking, video metadata with automated backups
- **Backup Strategy**: Automated daily backups for user data, separate backup for video content metadata, RTO 4 hours, RPO 24 hours
- **Query Optimization**: Indexes on user_id, lesson_id, course_id, completion status; caching for frequently accessed content; pagination for lesson libraries
- **Data Integrity**: Foreign key constraints, unique constraints for user progress records, timestamps for tracking
- **Scalability**: Read replicas for read-heavy video browsing, connection pooling, CDN for video content delivery
- **Security**: Encryption at rest (user data, payment info), encryption in transit (TLS 1.3), GDPR compliance, secure video content delivery (pre-signed URLs or DRM)

**Type**: Online Learning Platform (Wellness & Mindfulness)  
**Technology**: Full-stack web + mobile + video streaming  
**Location**: `~/Documents/packages/docs/projects/tai-chi-lessons/`

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

**Computer Science Projects** (27 projects):
- Software Engineering: All 27 projects
- Database Systems: `ulvonix/`, `learning-games/`, `spoon-me/`, `personal-budget-manager/`, `subscription-bill-manager/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `pet-care-manager/`, `tai-chi-lessons/`
- Web Development: `learning-games/`, `spoon-me/`, `sandbox/keel/`, `track-deliveries/`, `personal-budget-manager/`, `project-health-dashboard/`, `api-gateway-platform/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `subscription-bill-manager/`, `pet-care-manager/`, `tai-chi-lessons/`
- Mobile Development: `track-deliveries/`, `personal-budget-manager/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `subscription-bill-manager/`, `mobile-learning-companion/`, `pet-care-manager/`, `tai-chi-lessons/`
- Distributed Systems: `ulvonix/`, `api-gateway-platform/`
- Human-Computer Interaction: `ulvonix/`, `learning-games/`, `spoon-me/`, `personal-budget-manager/`, `project-health-dashboard/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`, `subscription-bill-manager/`, `track-deliveries/`, `pet-care-manager/`, `tai-chi-lessons/`
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
- `travel-itinerary-wallet/` - Travel planning and document management
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

**Supporting/Infrastructure**:
- `find-hidden-files/` - Plugin development patterns
- `project-health-dashboard/` - Portfolio monitoring and reporting
- `api-gateway-platform/` - API management infrastructure

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

3. **Database Systems Research** (`ulvonix/`, `learning-games/`, `spoon-me/`, `track-deliveries/`, `personal-budget-manager/`, `subscription-bill-manager/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `travel-itinerary-wallet/`, `energy-usage-tracker/`, `appointment-queue-manager/`, `vehicle-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `recipes/`, `chore-allowance-manager/`):
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

## Summary

**Total Code Projects**: 29 active projects

1. `ulvonix/` - Social Media Bots Platform (CS: distributed systems, automation)
2. `find-hidden-files/` - Obsidian Plugin (CS: Plugin architecture, file systems)
3. `learning-games/` - Full-stack Game/Quiz App (Educational Technology, CS: Full-stack development)
4. `sandbox/keel/` - Angular Library (CS: Software architecture, component design)
5. `spoon-me/` - Next.js E-commerce App (CS: Web development, business systems)
6. `track-deliveries/` - Delivery Tracking App (CS: Web development, integrations)
7. `personal-budget-manager/` - Personal Budget Manager (CS: finance analytics)
8. `project-health-dashboard/` - Project Health Dashboard (CS: analytics, visualization)
9. `api-gateway-platform/` - API Gateway Platform (CS: distributed systems, security)
10. `habit-tracker/` - Habit Tracking App (CS: engagement, analytics)
11. `home-inventory-manager/` - Home Inventory App (CS: organization, reporting)
12. `home-maintenance-tracker/` - Home Maintenance Tracker (CS: scheduling, reminders)
13. `medical-records-manager/` - Medical Records Manager (CS: security, scheduling)
14. `family-care-coordinator/` - Family Care Coordinator (CS: collaboration, access)
15. `travel-itinerary-wallet/` - Travel Itinerary & Document Wallet (CS: planning, alerts)
16. `energy-usage-tracker/` - Energy Usage & Utility Optimizer (CS: analytics, alerts)
17. `appointment-queue-manager/` - Appointment & Queue Manager (CS: scheduling, real‑time)
18. `vehicle-maintenance-tracker/` - Vehicle Maintenance Tracker (CS: scheduling, expenses)
19. `meal-planner-grocery/` - Meal Planner & Grocery (CS: planning, UX)
20. `recipes/` - Recipes Platform (CS: content discovery, UX)
21. `chore-allowance-manager/` - Chore & Allowance Manager (CS: routines, rewards)
22. `mobile-learning-companion/` - Learning Companion Mobile App (CS: mobile UX)
23. `subscription-bill-manager/` - Subscriptions & Bills Manager (CS: finance analytics)
24. `pet-care-manager/` - Pet Care Manager (CS: health information systems, mobile, reminders)
25. `financial-goal-saver/` - Financial Goal Tracker & Automated Savings (CS: FinTech, automated savings)
26. `price-drop-tracker/` - Price Drop & Deal Tracker (CS: web scraping, scheduled jobs, e-commerce)
27. `packages/` - Knowledge Base (Information Science: Knowledge management)
28. `workspace-documentation-hub/` - Workspace Documentation Portal (CS: documentation systems, knowledge management)
29. `tai-chi-lessons/` - Tai Chi Online Learning Platform (CS: video streaming, wellness technology)

**Academic Focus Areas**:
- **Primary**: Educational Technology (`learning-games/`)
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

