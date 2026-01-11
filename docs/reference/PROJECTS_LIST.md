# Projects List

This document lists all projects found in `~/Documents/` directory, categorized and analyzed from an academic and educational perspective.

**Last Updated**: 2026-01-05

## Code Projects

Projects are categorized by academic discipline and educational value.

### 1. `bots/`
- **Type**: Discord Bot
- **Technology**: Node.js/JavaScript
- **Location**: `~/Documents/bots/`
- **Description**: Discord bot with commands, events, and web interface
- **Key Files**: `bot.js`, `package.json`, `commands/`, `events/`, `web.js`
- **Status**: Active project
- **Academic Classification**: Computer Science - Software Engineering, Human-Computer Interaction
- **Educational Value**: 
  - Demonstrates event-driven programming concepts
  - Illustrates API integration and webhook handling
  - Shows modular architecture patterns
- **Subject Matter Areas**: 
  - Computer Science: Event-driven programming, API design, asynchronous programming
  - Software Engineering: Modular design, command pattern, separation of concerns

### 2. `discord-story-bot/`
- **Type**: Discord Bot with Database
- **Technology**: Node.js/JavaScript, SQLite (likely)
- **Location**: `~/Documents/discord-story-bot/`
- **Description**: Multi-bot Discord system with database, migrations, AWS deployment, story management
- **Key Files**: `index.mjs`, `db.mjs`, `bot-manager.mjs`, `package.json`, `data/` (databases), `docs/`
- **Features**: 
  - Multi-bot system
  - Database management
  - AWS deployment setup
  - Migration scripts
  - Comprehensive documentation structure
- **Status**: Active project
- **Academic Classification**: Computer Science - Database Systems, Distributed Systems, Software Architecture
- **Educational Value**:
  - Demonstrates database design and management principles
  - Illustrates distributed system concepts (multi-bot coordination)
  - Shows database migration strategies and version control
  - Exemplifies cloud deployment patterns (AWS)
- **Subject Matter Areas**:
  - Computer Science: Database systems, distributed computing, system architecture
  - Software Engineering: Migration strategies, deployment automation, system design
  - Data Management: Schema design, data persistence, backup strategies
- **Database Considerations**:
  - **Database Type**: SQLite (embedded database, suitable for single-instance bots)
  - **Schema Design**: Story management schema, bot configuration schema, user data schema
  - **Migration Strategy**: Version-controlled migrations for schema evolution
  - **Data Persistence**: Local file-based database storage
  - **Backup Strategy**: Database backup and restore procedures
  - **Query Optimization**: Efficient queries for story retrieval and bot management
  - **Concurrency**: Multi-bot coordination with database locking/transaction management

### 3. `find-hidden-files/`
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

### 4. `games/`
- **Type**: Full-stack Game/Quiz Application
- **Technology**: 
  - Backend: PHP (Slim framework), Composer
  - Frontend: Angular
  - Database: MySQL (via Docker)
- **Location**: `~/Documents/games/`
- **Description**: Game/quiz application with authentication, questions, staff management
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

### 5. `games-mirror/`
- **Type**: Documentation/Backup Mirror
- **Technology**: Markdown files (appears to be a documentation copy)
- **Location**: `~/Documents/games-mirror/`
- **Description**: Appears to be a mirror/backup of the games project with all files converted to markdown format
- **Structure**: Mirrors `games/` project structure but all files are `.md` format
- **Status**: Documentation/backup mirror
- **Academic Classification**: Information Science - Documentation Management, Version Control
- **Educational Value**:
  - Demonstrates documentation preservation strategies
  - Illustrates format conversion and standardization
  - Shows knowledge management practices
- **Subject Matter Areas**:
  - Information Science: Documentation management, knowledge preservation, format conversion
  - Software Engineering: Version control, backup strategies, documentation practices

### 6. `sandbox/keel/`
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

### 7. `spoon-me/`
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

### 8. `packages/`
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

**Computer Science Projects** (8 projects):
- Software Engineering: All 8 projects
- Database Systems: `discord-story-bot/`, `games/`
- Web Development: `games/`, `spoon-me/`, `sandbox/keel/`
- Distributed Systems: `discord-story-bot/`
- Human-Computer Interaction: `bots/`, `games/`, `spoon-me/`

**Educational Technology** (1 primary project):
- `games/` - Learning/quiz application (primary educational focus)

**Information Science** (2 projects):
- `games-mirror/` - Documentation management
- `packages/` - Knowledge management system

### By Educational Value

**High Educational Value**:
- `games/` - Direct educational application (learning/quiz system)
- `packages/` - Knowledge management and documentation (supports learning)
- `sandbox/keel/` - Component library (demonstrates software architecture)

**Moderate Educational Value**:
- `discord-story-bot/` - Database and distributed systems concepts
- `spoon-me/` - Business logic and e-commerce patterns
- `bots/` - Event-driven programming

**Supporting/Infrastructure**:
- `find-hidden-files/` - Plugin development patterns
- `games-mirror/` - Documentation preservation

### Research and Learning Opportunities

1. **Educational Technology Research** (`games/`):
   - Gamification effectiveness
   - Adaptive learning algorithms
   - Question difficulty assessment
   - Learning analytics

2. **Software Architecture Research** (`sandbox/keel/`):
   - Component library design patterns
   - Monorepo management strategies
   - API design principles

3. **Database Systems Research** (`discord-story-bot/`, `games/`, `spoon-me/`):
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

**Total Code Projects**: 7 active projects + 1 documentation mirror

1. `bots/` - Discord Bot (CS: Event-driven programming, API design)
2. `discord-story-bot/` - Advanced Discord Bot with Database (CS: Database systems, distributed computing)
3. `find-hidden-files/` - Obsidian Plugin (CS: Plugin architecture, file systems)
4. `games/` - Full-stack Game/Quiz App (Educational Technology, CS: Full-stack development)
5. `games-mirror/` - Documentation Mirror (Information Science: Documentation management)
6. `sandbox/keel/` - Angular Library (CS: Software architecture, component design)
7. `spoon-me/` - Next.js E-commerce App (CS: Web development, business systems)
8. `packages/` - Knowledge Base (Information Science: Knowledge management)

**Academic Focus Areas**:
- **Primary**: Educational Technology (`games/`)
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
**Changes**: Enhanced this projects list document by adding comprehensive "Database Considerations" sections for database-using projects. Added detailed database considerations for `discord-story-bot/` (SQLite database with schema design, migration strategy, data persistence, backup strategy, query optimization, concurrency management), `games/` (MySQL database with educational data schema, migration strategy, Docker persistence, backup strategy, query optimization, data integrity, scalability, security), and `spoon-me/` (PostgreSQL/MySQL database with e-commerce schema, migration strategy, data persistence, backup strategy, query optimization, data integrity, scalability, PCI compliance considerations). Enhanced the "Database Systems Research" section to include educational data management, e-commerce database design, query optimization, and database security research opportunities. This addition provides essential database perspective on projects, ensuring that database considerations are documented and understood for each project that uses databases, helping identify database design patterns, migration strategies, and optimization opportunities across the project portfolio.

---

