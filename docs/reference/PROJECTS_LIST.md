# Projects List

This document lists all projects found in `~/Documents/` directory, categorized and analyzed from an academic and educational perspective.

**Last Updated**: 2026-01-05

## Code Projects

Projects are categorized by academic discipline and educational value.

### 1. `ulvonix/`
- **Type**: Social Media Bots Platform
- **Technology**: Node.js/JavaScript, SQLite/MySQL (TBD)
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
- **Type**: Full-stack Learning Game/Quiz Application
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
- **Location**: `~/Documents/learning-games/`
- **Description**: Learning game/quiz application with authentication, questions, and staff management
- **Structure**:
  - `backend/` - PHP backend with API
  - `frontend/` - Angular frontend
  - `docs/` - Comprehensive documentation
  - Docker setup
- **Key Files**: `composer.json`, `package.json`, `docker-compose.yml`, `docs/`
- **Status**: Active project
- **Academic Classification**: Computer Science - Full-Stack Development, Educational Technology, Human-Computer Interaction
- **Educational Value**:
  - **Primary Educational Application**: This is an educational technology project designed for learning
  - Demonstrates full-stack architecture (frontend, backend, database)
  - Illustrates RESTful API design and implementation
  - Shows authentication and authorization patterns
  - Exemplifies containerization with Docker
  - Demonstrates educational content management (questions, quizzes, learning materials)
- **Subject Matter Areas**:
- **Educational Technology**: Learning management, quiz systems, educational content delivery
  - **Computer Science**: Full-stack development, API design, database systems, containerization
  - **Mathematics/Logic**: Question generation algorithms, scoring systems, probability (if applicable)
  - **Software Engineering**: MVC architecture, separation of concerns, testing strategies
- **Research Opportunities**:
  - Educational effectiveness of gamified learning
  - Adaptive learning algorithms
  - Question difficulty assessment
  - Learning analytics and progress tracking
- **Database Considerations**:
  - **Database Type**: MySQL (relational database, suitable for structured educational data)
  - **Schema Design**: User authentication schema, question/quiz schema, staff management schema, learning progress schema
  - **Migration Strategy**: Database migrations for schema versioning and evolution
  - **Data Persistence**: Dockerized MySQL database with persistent volumes
  - **Backup Strategy**: Database backup and restore procedures for educational data
  - **Query Optimization**: Optimized queries for question retrieval, user progress tracking, quiz scoring
  - **Data Integrity**: Foreign key constraints, data validation, transaction management
  - **Scalability**: Database indexing for performance, connection pooling for concurrent users
  - **Security**: Secure credential management, SQL injection prevention, access control

### 4. `games-mirror/`
- **Type**: Documentation/Backup Mirror
- **Technology**: Markdown files (appears to be a documentation copy)
- **Location**: `~/Documents/games-mirror/`
- **Description**: Appears to be a mirror/backup of the learning-games project with all files converted to markdown format
- **Structure**: Mirrors `learning-games/` project structure but all files are `.md` format
- **Status**: Documentation/backup mirror
- **Academic Classification**: Information Science - Documentation Management, Version Control
- **Educational Value**:
  - Demonstrates documentation preservation strategies
  - Illustrates format conversion and standardization
  - Shows knowledge management practices
- **Subject Matter Areas**:
  - Information Science: Documentation management, knowledge preservation, format conversion
  - Software Engineering: Version control, backup strategies, documentation practices

### 5. `sandbox/keel/`
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

### 6. `spoon-me/`
- **Type**: E-commerce Web Application
- **Technology**: Next.js, TypeScript, React
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

### 7. `track-deliveries/`
- **Type**: Delivery Tracking Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/track-deliveries/`
- **Description**: Track deliveries across multiple retailers (AliExpress, Shein, Amazon, etc.)
- **Structure**:
  - `backend/` - API for shipment tracking and integrations
  - `frontend/` - Web dashboard for tracking and alerts
  - `mobile/` - Mobile app for on-the-go tracking
  - `docs/` - Project documentation
- **Key Features**:
  - Multi-carrier tracking
  - Unified delivery timeline
  - Delivery status alerts
  - Tracking number management
  - Carrier/retailer integrations
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Distributed Systems, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates API integration with third-party carriers
  - Illustrates event-driven status updates and notifications
  - Shows full-stack architecture with web + mobile
- **Subject Matter Areas**:
  - Computer Science: API integration, event-driven systems, data aggregation
  - Software Engineering: Integration patterns, reliability, observability
  - Business/Logistics: Delivery tracking workflows, carrier coordination

### 8. `personal-budget-manager/`
- **Type**: Personal Finance Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/personal-budget-manager/`
- **Description**: Personal budget app for tracking income, expenses, budgets, and financial goals
- **Structure**:
  - `backend/` - Budget and analytics API services
  - `frontend/` - Web dashboard and reports
  - `mobile/` - Mobile app for on-the-go tracking
  - `docs/` - Project documentation
- **Key Features**:
  - Expense and income tracking
  - Budget planning and alerts
  - Financial reports and insights
  - Goals and savings tracking
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Business Information Systems, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates financial analytics and reporting
  - Illustrates budget management workflows
  - Shows full-stack architecture with web + mobile
- **Subject Matter Areas**:
  - Computer Science: Data visualization, analytics systems, API design
  - Business/Mathematics: Budgeting, financial metrics, trend analysis
  - Software Engineering: Data pipelines, reporting, UX for finance tools

### 9. `project-health-dashboard/`
- **Type**: Project Health Dashboard
- **Technology**: Full-stack web dashboard
- **Location**: `~/Documents/project-health-dashboard/`
- **Description**: Customer-facing dashboard for monitoring project health, status, and key metrics across a portfolio
- **Structure**:
  - `backend/` - Data aggregation and API services
  - `frontend/` - Dashboard UI and visualizations
  - `docs/` - Project documentation
- **Key Features**:
  - Health scores and status indicators
  - Metrics and trend analysis
  - Alerting and notifications
  - Portfolio-level reporting
- **Status**: Planned
- **Academic Classification**: Computer Science - Software Engineering, Data Visualization, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates dashboard design and data visualization
  - Illustrates metrics aggregation and reporting pipelines
  - Shows full-stack architecture for analytics apps
- **Subject Matter Areas**:
  - Computer Science: Data visualization, analytics systems, API design
  - Software Engineering: Monitoring patterns, reporting pipelines, UX for dashboards

### 10. `api-gateway-platform/`
- **Type**: API Gateway Platform
- **Technology**: Full-stack web platform
- **Location**: `~/Documents/api-gateway-platform/`
- **Description**: Central API management platform for routing, monitoring, and documenting APIs across services
- **Structure**:
  - `backend/` - Gateway services and routing middleware
  - `frontend/` - Admin dashboard and API documentation UI
  - `docs/` - Platform documentation
- **Key Features**:
  - API routing and policy management
  - Authentication and rate limiting
  - Monitoring and analytics dashboards
  - Auto-generated API documentation
- **Status**: Planned
- **Academic Classification**: Computer Science - Distributed Systems, API Design, Security
- **Educational Value**:
  - Demonstrates API gateway patterns and routing
  - Illustrates security policies and rate limiting
  - Shows monitoring and API documentation workflows
- **Subject Matter Areas**:
  - Computer Science: API design, distributed systems, security
  - Software Engineering: Service routing, observability, platform tooling

### 11. `developer-cli-suite/`
- **Type**: Developer Tools CLI Suite
- **Technology**: Node.js/TypeScript or Go
- **Location**: `~/Documents/developer-cli-suite/`
- **Description**: Local developer CLI tools for scaffolding, testing, documentation, and automation
- **Structure**:
  - `src/` - CLI commands and utilities
  - `bin/` - CLI entrypoints
  - `docs/` - Tooling documentation
- **Key Features**:
  - Code scaffolding
  - Database/schema utilities
  - API docs generation
  - Dependency analysis
- **Status**: Planned
- **Academic Classification**: Computer Science - Software Engineering, Developer Tooling
- **Educational Value**:
  - Demonstrates CLI tooling and automation patterns
  - Illustrates developer productivity workflows
- **Subject Matter Areas**:
  - Computer Science: CLI design, automation, tooling
  - Software Engineering: DX workflows, code generation

### 12. `habit-tracker/`
- **Type**: Habit Tracking Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/habit-tracker/`
- **Description**: Habit tracking app with streaks, reminders, and progress analytics
- **Structure**:
  - `backend/` - Habit data and analytics API
  - `frontend/` - Web dashboard
  - `mobile/` - Mobile app
  - `docs/` - Project documentation
- **Key Features**:
  - Habit tracking and streaks
  - Reminders and notifications
  - Analytics and insights
  - Goals and challenges
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates behavior tracking and analytics
  - Illustrates engagement and retention mechanics
- **Subject Matter Areas**:
  - Computer Science: Data visualization, analytics systems, API design
  - Software Engineering: UX for behavior change, mobile workflows

### 13. `home-inventory-manager/`
- **Type**: Home Inventory Application
- **Technology**: Full-stack web + mobile
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

### 14. `home-maintenance-tracker/`
- **Type**: Home Maintenance Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/home-maintenance-tracker/`
- **Description**: Home maintenance scheduling with service history, reminders, and cost tracking
- **Structure**:
  - `backend/` - Maintenance schedules and service API
  - `frontend/` - Maintenance dashboard
  - `mobile/` - Mobile reminders and task updates
  - `docs/` - Project documentation
- **Key Features**:
  - Recurring maintenance schedules
  - Service history and invoices
  - Reminders and alerts
  - Asset/system tracking
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates workflow scheduling and reminders
  - Illustrates service history tracking
- **Subject Matter Areas**:
  - Computer Science: Event scheduling, notifications, API design
  - Software Engineering: UX for maintenance workflows

### 15. `medical-records-manager/`
- **Type**: Medical Records Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/medical-records-manager/`
- **Description**: Medical records vault with appointments, medications, and secure sharing
- **Structure**:
  - `backend/` - Records, appointments, and sharing API
  - `frontend/` - Records dashboard
  - `mobile/` - Mobile access and reminders
  - `docs/` - Project documentation
- **Key Features**:
  - Records vault and search
  - Appointment tracking and reminders
  - Medication tracking
  - Secure sharing and access logs
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Security, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates secure document management
  - Illustrates scheduling and reminder workflows
- **Subject Matter Areas**:
  - Computer Science: Access control, data security, API design
  - Software Engineering: UX for sensitive data

### 16. `family-care-coordinator/`
- **Type**: Family Care Coordination Application
- **Technology**: Full-stack web + mobile
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

### 17. `meal-planner-grocery/`
- **Type**: Meal Planning Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/meal-planner-grocery/`
- **Description**: Meal planning with grocery list generation, pantry tracking, and recipe integration
- **Structure**:
  - `backend/` - Meal planning and list API
  - `frontend/` - Planning dashboard
  - `mobile/` - Grocery list app
  - `docs/` - Project documentation
- **Key Features**:
  - Meal planning calendar
  - Auto-generated grocery lists
  - Pantry inventory
  - Recipe integration
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates planning workflows and list generation
  - Illustrates data aggregation and personalization
- **Subject Matter Areas**:
  - Computer Science: Data aggregation, UX, API design
  - Software Engineering: Workflow design, mobile-first UX

### 18. `mobile-learning-companion/`
- **Type**: Learning Companion Mobile App
- **Technology**: Mobile-first app
- **Location**: `~/Documents/mobile-learning-companion/`
- **Description**: Mobile companion app for learning, practice, and progress tracking
- **Structure**:
  - `mobile/` - Mobile app
  - `docs/` - Project documentation
- **Key Features**:
  - Offline practice
  - Notifications and reminders
  - Progress tracking
- **Status**: Planned
- **Academic Classification**: Computer Science - Mobile Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates mobile-first learning workflows
  - Illustrates offline-first architecture
- **Subject Matter Areas**:
  - Computer Science: Mobile UX, offline data sync
  - Software Engineering: Performance and reliability

### 19. `price-drop-tracker/`
- **Type**: Price Tracking Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/price-drop-tracker/`
- **Description**: Track product prices and alert users when prices drop
- **Structure**:
  - `backend/` - Price monitoring and alerts
  - `frontend/` - Watchlists and charts
  - `mobile/` - Mobile alerts
  - `docs/` - Project documentation
- **Key Features**:
  - Price history tracking
  - Target price alerts
  - Deal notifications
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates monitoring and alerting systems
  - Illustrates price history analytics
- **Subject Matter Areas**:
  - Computer Science: Data monitoring, analytics, notifications
  - Software Engineering: Alerting workflows, UX for deals

### 20. `returns-warranty-tracker/`
- **Type**: Returns & Warranty Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/returns-warranty-tracker/`
- **Description**: Track return windows, warranties, and refunds across purchases
- **Structure**:
  - `backend/` - Return and warranty API
  - `frontend/` - Dashboard and reminders
  - `mobile/` - Mobile reminders
  - `docs/` - Project documentation
- **Key Features**:
  - Return deadline tracking
  - Warranty reminders
  - Refund tracking
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Human-Computer Interaction
- **Educational Value**:
  - Demonstrates reminder systems and lifecycle tracking
  - Illustrates purchase lifecycle workflows
- **Subject Matter Areas**:
  - Computer Science: Event tracking, notifications
  - Software Engineering: UX for lifecycle management

### 21. `subscription-bill-manager/`
- **Type**: Subscription & Bills Application
- **Technology**: Full-stack web + mobile
- **Location**: `~/Documents/subscription-bill-manager/`
- **Description**: Track subscriptions, renewal dates, price changes, and recurring costs
- **Structure**:
  - `backend/` - Subscription tracking API
  - `frontend/` - Dashboard and analytics
  - `mobile/` - Mobile alerts
  - `docs/` - Project documentation
- **Key Features**:
  - Renewal reminders
  - Price change alerts
  - Cancellation guidance
- **Status**: Planned
- **Academic Classification**: Computer Science - Web Development, Business Information Systems
- **Educational Value**:
  - Demonstrates recurring cost analytics
  - Illustrates alerting and reporting workflows
- **Subject Matter Areas**:
  - Computer Science: Analytics, notifications, API design
  - Business/Mathematics: Budgeting, recurring costs

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

**Computer Science Projects** (21 projects):
- Software Engineering: All 21 projects
- Database Systems: `ulvonix/`, `learning-games/`, `spoon-me/`, `personal-budget-manager/`, `subscription-bill-manager/`, `price-drop-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `returns-warranty-tracker/`
- Web Development: `learning-games/`, `spoon-me/`, `sandbox/keel/`, `track-deliveries/`, `personal-budget-manager/`, `project-health-dashboard/`, `api-gateway-platform/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `price-drop-tracker/`, `returns-warranty-tracker/`, `subscription-bill-manager/`
- Distributed Systems: `ulvonix/`, `api-gateway-platform/`
- Human-Computer Interaction: `ulvonix/`, `learning-games/`, `spoon-me/`, `personal-budget-manager/`, `project-health-dashboard/`, `habit-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `price-drop-tracker/`, `returns-warranty-tracker/`, `subscription-bill-manager/`, `track-deliveries/`

**Educational Technology** (1 primary project):
- `learning-games/` - Learning/quiz application (primary educational focus)

**Information Science** (2 projects):
- `games-mirror/` - Documentation management
- `packages/` - Knowledge management system

### By Educational Value

**High Educational Value**:
- `learning-games/` - Direct educational application (learning/quiz system)
- `packages/` - Knowledge management and documentation (supports learning)
- `sandbox/keel/` - Component library (demonstrates software architecture)

**Moderate Educational Value**:
- `ulvonix/` - Distributed bot orchestration and automation
- `spoon-me/` - Business logic and e-commerce patterns
- `personal-budget-manager/` - Financial tracking and analytics
- `subscription-bill-manager/` - Recurring cost tracking
- `price-drop-tracker/` - Price monitoring and alerts
- `home-inventory-manager/` - Inventory management workflows
- `home-maintenance-tracker/` - Maintenance scheduling and reminders
- `medical-records-manager/` - Secure records and reminders
- `family-care-coordinator/` - Care coordination workflows
- `meal-planner-grocery/` - Planning and list generation
- `habit-tracker/` - Behavior tracking and engagement

**Supporting/Infrastructure**:
- `find-hidden-files/` - Plugin development patterns
- `games-mirror/` - Documentation preservation
- `project-health-dashboard/` - Portfolio monitoring and reporting
- `api-gateway-platform/` - API management infrastructure
- `developer-cli-suite/` - Developer tooling and automation

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

3. **Database Systems Research** (`ulvonix/`, `learning-games/`, `spoon-me/`, `track-deliveries/`, `personal-budget-manager/`, `subscription-bill-manager/`, `price-drop-tracker/`, `home-inventory-manager/`, `home-maintenance-tracker/`, `medical-records-manager/`, `family-care-coordinator/`, `meal-planner-grocery/`, `returns-warranty-tracker/`):
   - Migration strategies and schema evolution
   - Distributed data management
   - Multi-bot coordination
   - Educational data management and learning analytics
   - E-commerce database design and transaction management
   - Query optimization and performance tuning
   - Database security and access control

4. **Knowledge Management Research** (`packages/`):
   - Documentation structure effectiveness
   - Information architecture patterns
   - Knowledge preservation strategies

## Summary

**Total Code Projects**: 21 active projects + 1 documentation mirror

1. `ulvonix/` - Social Media Bots Platform (CS: distributed systems, automation)
2. `find-hidden-files/` - Obsidian Plugin (CS: Plugin architecture, file systems)
3. `learning-games/` - Full-stack Game/Quiz App (Educational Technology, CS: Full-stack development)
4. `games-mirror/` - Documentation Mirror (Information Science: Documentation management)
5. `sandbox/keel/` - Angular Library (CS: Software architecture, component design)
6. `spoon-me/` - Next.js E-commerce App (CS: Web development, business systems)
7. `track-deliveries/` - Delivery Tracking App (CS: Web development, integrations)
8. `personal-budget-manager/` - Personal Budget Manager (CS: finance analytics)
9. `project-health-dashboard/` - Project Health Dashboard (CS: analytics, visualization)
10. `api-gateway-platform/` - API Gateway Platform (CS: distributed systems, security)
11. `developer-cli-suite/` - Developer Tools CLI Suite (CS: tooling, automation)
12. `habit-tracker/` - Habit Tracking App (CS: engagement, analytics)
13. `home-inventory-manager/` - Home Inventory App (CS: organization, reporting)
14. `home-maintenance-tracker/` - Home Maintenance Tracker (CS: scheduling, reminders)
15. `medical-records-manager/` - Medical Records Manager (CS: security, scheduling)
16. `family-care-coordinator/` - Family Care Coordinator (CS: collaboration, access)
17. `meal-planner-grocery/` - Meal Planner & Grocery (CS: planning, UX)
18. `mobile-learning-companion/` - Learning Companion Mobile App (CS: mobile UX)
19. `price-drop-tracker/` - Price Drop Tracker (CS: monitoring, alerts)
20. `returns-warranty-tracker/` - Returns & Warranty Tracker (CS: lifecycle tracking)
21. `subscription-bill-manager/` - Subscriptions & Bills Manager (CS: finance analytics)
22. `packages/` - Knowledge Base (Information Science: Knowledge management)

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

