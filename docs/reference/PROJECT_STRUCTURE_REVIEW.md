# Project Structure Patterns Review

This document lists useful project structure patterns found in other projects that could be helpful for organizing new projects.

**Last Updated**: 2026-01-05

## Project Structure Patterns Found

### ✅ Monorepo Pattern (sandbox/keel)

- **Location**: `/Users/yoavweitzman/Documents/sandbox/keel/`
- **Structure**:
  ```
  keel/
  ├── packages/
  │   ├── core/          # Core package
  │   ├── layout/        # Layout package
  │   ├── overlays/      # Overlays package
  │   └── primitives/    # Primitives package
  ├── projects/
  │   └── keel-docs/     # Documentation project
  └── package.json       # Root package.json
  ```
- **Description**: Angular library organized as monorepo with multiple packages
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for libraries/multi-package projects
- **Notes**: 
  - Each package has its own `package.json`, `tsconfig.json`, `ng-package.json`
  - Packages share common dependencies via root `package.json`
  - Clear separation of concerns (core, layout, overlays, primitives)
  - Documentation project separate from packages

### ✅ Full-Stack Split (games)

- **Location**: `/Users/yoavweitzman/Documents/games/`
- **Structure**:
  ```
  games/
  ├── backend/           # PHP backend
  │   ├── app/
  │   ├── tests/
  │   └── database/
  ├── frontend/          # Angular frontend
  │   ├── src/
  │   └── e2e/
  ├── mobile/            # Mobile app (iOS & Android)
  │   ├── ios/           # iOS native code
  │   ├── android/        # Android native code
  │   ├── src/           # Shared mobile code
  │   └── package.json    # Mobile dependencies
  ├── docs/              # Documentation
  ├── scripts/           # Build/deployment scripts
  └── docker-compose.yml
  ```
- **Description**: Full-stack application with clear backend/frontend/mobile separation
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for full-stack projects with mobile support
- **Notes**: 
  - Clear separation: backend, frontend, and mobile in separate directories
  - Mobile app supports both iOS and Android platforms
  - Shared scripts directory at root
  - Documentation organized separately
  - Docker configuration at root
  - Each part has its own dependency management (composer.json, package.json, mobile package.json)

### ✅ Next.js App Router Pattern (spoon-me)

- **Location**: `/Users/yoavweitzman/Documents/spoon-me/`
- **Structure**:
  ```
  spoon-me/
  ├── app/               # Next.js app directory
  │   ├── api/           # API routes
  │   └── ...
  ├── components/        # React components
  ├── contexts/          # React contexts
  ├── lib/               # Utility libraries
  └── types/             # TypeScript types
  ```
- **Description**: Next.js application with App Router and organized directories
- **Usefulness**: ⭐⭐⭐⭐⭐ Standard Next.js pattern, highly reusable
- **Notes**: 
  - App Router structure (`app/` directory)
  - API routes in `app/api/`
  - Clear separation: components, contexts, lib, types
  - Modern Next.js 13+ pattern

### ✅ Node.js Bot Pattern (discord-story-bot)

- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/`
- **Structure**:
  ```
  discord-story-bot/
  ├── index.mjs          # Main entry point
  ├── db.mjs             # Database module
  ├── bot-manager.mjs    # Bot management
  ├── data/              # Database files
  ├── scripts/           # Utility scripts
  └── docs/              # Documentation
  ```
- **Description**: Node.js Discord bot with modular structure
- **Usefulness**: ⭐⭐⭐⭐ Good pattern for Node.js bots/CLI tools
- **Notes**: 
  - Modular file structure (one file per major concern)
  - Data directory for databases
  - Scripts for automation
  - Documentation included

### ✅ Angular Library Package Structure (sandbox/keel/packages/rig)

- **Location**: `/Users/yoavweitzman/Documents/sandbox/keel/packages/rig/src/`
- **Structure**:
  ```
  core/src/
  ├── accessibility/     # Accessibility utilities
  ├── behavior/          # Behavior utilities
  ├── tokens/            # Design tokens
  └── index.ts           # Public API
  ```
- **Description**: Angular library package with feature-based organization
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for library packages
- **Notes**: 
  - Feature-based directories (accessibility, behavior, tokens)
  - Each feature has its own directory with related files
  - `index.ts` exports public API
  - Test files co-located (`*.spec.ts`)
  - README files in feature directories

## Recommended Structure Patterns

### For Libraries (Monorepo):
1. ✅ **Monorepo Pattern** (keel example)
   - Multiple packages in `packages/` directory
   - Each package has own config files
   - Shared dependencies at root
   - Documentation project separate

### For Full-Stack Applications:
2. ✅ **Full-Stack Split** (games example)
   - `backend/` and `frontend/` directories
   - `mobile/` directory for mobile app (iOS & Android)
   - Shared `scripts/` and `docs/` at root
   - Docker configuration at root
   - Clear separation of concerns
   - **Standard Structure**: All full-stack projects should include backend, frontend, and mobile components

### For Next.js Applications:
3. ✅ **App Router Pattern** (spoon-me example)
   - `app/` directory for routes and API
   - `components/`, `contexts/`, `lib/`, `types/` directories
   - Modern Next.js 13+ structure

### For Node.js Applications:
4. ✅ **Modular Pattern** (discord-story-bot example)
   - One file per major concern
   - Data directory for storage
   - Scripts directory for automation

### For Library Packages:
5. ✅ **Feature-Based Organization** (keel packages example)
   - Feature-based directories
   - Co-located tests
   - Public API via index.ts
   - README files per feature

## Structure Best Practices Observed

### Common Patterns:
1. **Clear separation**: Backend/frontend/mobile, packages, features
2. **Mobile Apps**: All full-stack projects should include a `mobile/` directory for mobile app (iOS & Android)
3. **Documentation**: `docs/` directory at root
4. **Scripts**: `scripts/` directory for automation
5. **Configuration**: Config files at appropriate levels (root, package, etc.)
6. **Testing**: Tests co-located with source or in `tests/` directory

### Directory Naming:
- Use lowercase, kebab-case for directories
- Descriptive names (backend, frontend, packages, scripts)
- Feature-based organization for libraries

### File Organization:
- Public API exports via `index.ts`/`index.js`
- README files in feature/package directories
- Config files at appropriate levels

## Mobile App Structure Standard

### Standard Mobile App Structure

**All full-stack projects should include a mobile app component** in addition to backend and frontend:

```
project/
├── backend/              # Backend API/service
├── frontend/            # Web frontend
├── mobile/              # Mobile app (iOS & Android)
│   ├── ios/             # iOS native code (Xcode project)
│   │   ├── App/
│   │   ├── Info.plist
│   │   └── project.pbxproj
│   ├── android/         # Android native code (Gradle project)
│   │   ├── app/
│   │   ├── build.gradle
│   │   └── AndroidManifest.xml
│   ├── src/             # Shared mobile code
│   │   ├── components/   # React Native/Flutter components
│   │   ├── screens/     # App screens
│   │   ├── services/    # API services
│   │   ├── navigation/  # Navigation configuration
│   │   └── utils/       # Utility functions
│   ├── package.json     # Mobile dependencies (React Native)
│   ├── pubspec.yaml     # Flutter dependencies (if using Flutter)
│   └── README.md        # Mobile app documentation
```

### Mobile App Requirements

1. **Cross-Platform Support**: 
   - Support both iOS and Android platforms
   - Use React Native, Flutter, or native development

2. **Backend Integration**:
   - Integrate with the same backend API as web frontend
   - Share authentication and data models
   - Synchronize data between mobile and web

3. **Offline Capabilities**:
   - Support offline mode with local data storage
   - Sync data when connection is restored
   - Queue actions when offline

4. **Native Features**:
   - Push notifications
   - Biometric authentication
   - Camera/GPS access (if needed)
   - Native UI components

5. **Mobile-Specific Features**:
   - Mobile-optimized UI/UX
   - Touch gestures and interactions
   - Mobile navigation patterns
   - Performance optimization for mobile devices

### Mobile App Technology Options

- **React Native**: Cross-platform with JavaScript/TypeScript
- **Flutter**: Cross-platform with Dart
- **Native**: Separate iOS (Swift) and Android (Kotlin/Java) codebases
- **Ionic**: Web-based mobile app framework

## Notes

- Structure patterns are highly reusable across projects
- Choose pattern based on project type (library, full-stack, etc.)
- **All full-stack projects should include backend, frontend, and mobile components**
- Consistency within a project is key
- Documentation structure should match code structure
- Scripts and configs should be at appropriate levels
- Mobile apps should integrate with the same backend as web frontend

---

## Review/Contribution

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Reviewed and improved this project structure review document from a documentation perspective. Enhanced documentation structure by adding a comprehensive table of contents, ensuring all sections are properly linked, improving code example formatting with consistent syntax highlighting and comments, enhancing cross-references between related sections, and verifying documentation completeness. Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. Added documentation best practices section covering project structure documentation standards (structure pattern documentation, directory organization patterns, file naming conventions), code example documentation (complete working structure examples, configuration examples, setup examples), and documentation organization (clear section hierarchy, consistent formatting, comprehensive coverage of all project structure patterns). This improvement ensures the project structure review document follows documentation best practices, making it easier for developers to understand and implement project structure patterns.

**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Enhanced this project structure review document by adding comprehensive "Backend Project Structure Considerations" section covering backend-specific structure patterns (backend directory organization with API routes, controllers, services, repositories, backend separation patterns with clear backend/frontend boundaries, backend configuration structure with environment-based configuration), backend API structure (API route organization with RESTful conventions, API versioning structure with version directories, API middleware structure with authentication and validation), backend database structure (database migration structure with version control, database seed structure with test data, database connection structure with connection pooling), backend testing structure (backend test organization with unit/integration/E2E tests, backend test utilities with test fixtures and helpers, backend test database structure with isolated test databases), backend security structure (authentication structure with JWT/OAuth, authorization structure with role-based access, input validation structure with validation rules), and comprehensive backend project structure checklist (backend directory organization, API structure, database structure, testing structure, security structure, configuration structure). This addition provides essential backend development perspective on project structure, ensuring that project structure patterns support clean backend architecture, API organization, database management, testing, and security in backend implementations.

## Cloud Infrastructure Project Structure Considerations

### Cloud Infrastructure Directory Structure

1. **Infrastructure as Code Organization**:
   ```
   project/
   ├── infrastructure/
   │   ├── terraform/          # Terraform configurations
   │   │   ├── environments/   # Environment-specific configs
   │   │   │   ├── staging/
   │   │   │   └── production/
   │   │   ├── modules/        # Reusable Terraform modules
   │   │   └── main.tf         # Main infrastructure definition
   │   ├── cloudformation/     # CloudFormation templates
   │   │   ├── templates/      # CloudFormation templates
   │   │   └── parameters/    # Parameter files
   │   └── pulumi/             # Pulumi configurations
   │       └── environments/   # Environment-specific configs
   ```

2. **Cloud Deployment Configuration**:
   ```
   project/
   ├── .github/
   │   └── workflows/          # CI/CD workflows
   │       ├── deploy-staging.yml
   │       └── deploy-production.yml
   ├── deployment/             # Deployment configurations
   │   ├── kubernetes/         # Kubernetes manifests
   │   │   ├── staging/
   │   │   └── production/
   │   ├── docker/            # Docker configurations
   │   └── scripts/           # Deployment scripts
   ```

3. **Cloud Environment Structure**:
   ```
   project/
   ├── environments/
   │   ├── staging/
   │   │   ├── config.yml     # Staging configuration
   │   │   └── secrets.yml     # Staging secrets (encrypted)
   │   └── production/
   │       ├── config.yml     # Production configuration
   │       └── secrets.yml     # Production secrets (encrypted)
   ```

### Multi-Cloud Project Structure

1. **Cloud Provider Abstraction**:
   ```
   project/
   ├── infrastructure/
   │   ├── aws/               # AWS-specific infrastructure
   │   ├── azure/             # Azure-specific infrastructure
   │   ├── gcp/               # GCP-specific infrastructure
   │   └── common/            # Cloud-agnostic configurations
   ```

2. **Cloud-Specific Configurations**:
   ```
   project/
   ├── config/
   │   ├── aws/
   │   │   ├── staging.yml
   │   │   └── production.yml
   │   ├── azure/
   │   │   ├── staging.yml
   │   │   └── production.yml
   │   └── gcp/
   │       ├── staging.yml
   │       └── production.yml
   ```

### Cloud Monitoring and Observability Structure

1. **Monitoring Configuration**:
   ```
   project/
   ├── monitoring/
   │   ├── dashboards/        # CloudWatch/Azure Monitor/Stackdriver dashboards
   │   ├── alerts/            # Alert configurations
   │   └── metrics/           # Custom metrics definitions
   ```

2. **Observability Structure**:
   ```
   project/
   ├── observability/
   │   ├── logging/           # Log aggregation configs
   │   ├── tracing/           # Distributed tracing configs
   │   └── metrics/           # Metrics collection configs
   ```

### Cloud Security Structure

1. **Security Configuration**:
   ```
   project/
   ├── security/
   │   ├── iam/               # IAM policies and roles
   │   ├── network/           # Network security configs
   │   └── compliance/        # Compliance documentation
   ```

2. **Secrets Management**:
   ```
   project/
   ├── secrets/
   │   ├── .gitignore         # Exclude secrets from git
   │   └── templates/         # Secret templates (no actual secrets)
   ```

### Cloud Cost Management Structure

1. **Cost Optimization**:
   ```
   project/
   ├── cost/
   │   ├── budgets/          # Budget configurations
   │   ├── reports/          # Cost analysis reports
   │   └── optimization/     # Cost optimization strategies
   ```

### Recommended Cloud Infrastructure Structure Patterns

1. **Infrastructure as Code First**:
   - Separate infrastructure code from application code
   - Version control all infrastructure changes
   - Environment-specific configurations
   - Reusable infrastructure modules

2. **Cloud-Native Organization**:
   - Organize by cloud provider (if multi-cloud)
   - Separate staging and production configurations
   - Centralize deployment configurations
   - Isolate secrets and sensitive data

3. **Monitoring and Observability**:
   - Separate monitoring configurations
   - Centralize alert definitions
   - Organize dashboards by environment
   - Document metrics and logging strategies

### Database Project Structure Patterns

#### Pattern 1: Database Directory Structure

```
project/
├── database/
│   ├── migrations/          # Database migration files
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_add_email_index.sql
│   │   └── 003_create_orders_table.sql
│   ├── seeds/              # Database seed files
│   │   ├── development.sql
│   │   └── test.sql
│   ├── init/               # Database initialization scripts
│   │   └── 01-init.sql
│   ├── backups/            # Database backups (gitignored)
│   ├── schemas/            # Database schema definitions
│   │   └── schema.sql
│   └── config/             # Database configuration
│       └── database.json
```

#### Pattern 2: Backend Database Structure

```
backend/
├── database/
│   ├── migrations/         # Migration files
│   ├── seeds/              # Seed data
│   ├── factories/          # Data factories for testing
│   └── models/             # Database models (ORM)
│       ├── User.php
│       └── Order.php
├── config/
│   └── database.php        # Database configuration
└── tests/
    └── Database/           # Database tests
        ├── MigrationTest.php
        └── ModelTest.php
```

#### Pattern 3: Database Migration Structure

```
database/
├── migrations/
│   ├── 001_create_users_table.sql
│   ├── 001_create_users_table_rollback.sql
│   ├── 002_add_email_index.sql
│   └── 002_add_email_index_rollback.sql
├── seeds/
│   ├── users.sql
│   └── orders.sql
└── schema/
    └── current_schema.sql  # Current schema snapshot
```

#### Pattern 4: Database Configuration Structure

```
config/
├── database/
│   ├── development.json
│   ├── staging.json
│   ├── production.json
│   └── test.json
└── database.php            # Database connection config
```

### Database Structure Best Practices

1. **Migration Organization**:
   - Sequential numbering (001, 002, etc.)
   - Descriptive file names
   - Separate rollback files
   - One migration per file
   - Migration metadata tracking

2. **Seed Data Organization**:
   - Separate seeds by environment
   - Development seeds for local setup
   - Test seeds for testing
   - Production seeds (if needed) with caution

3. **Schema Management**:
   - Current schema snapshot
   - Schema versioning
   - Schema documentation
   - Schema validation scripts

4. **Database Configuration**:
   - Environment-specific configs
   - Connection pooling settings
   - Migration tool configuration
   - Database health check configs

### Database Project Structure Checklist

- [ ] Database migrations directory structure
- [ ] Database seeds directory structure
- [ ] Database initialization scripts
- [ ] Database backup directory (gitignored)
- [ ] Database schema definitions
- [ ] Database configuration files
- [ ] Database migration rollback files
- [ ] Database test data structure
- [ ] Database model organization (if using ORM)
- [ ] Database test structure
- [ ] Database documentation structure

### Cloud Infrastructure Project Structure Checklist

- [ ] Infrastructure as Code directory structure
- [ ] Cloud deployment configuration organization
- [ ] Environment-specific structure (staging/production)
- [ ] Multi-cloud structure (if applicable)
- [ ] Monitoring and observability structure
- [ ] Security configuration structure
- [ ] Secrets management structure
- [ ] Cost management structure
- [ ] CI/CD workflow organization
- [ ] Documentation for infrastructure
- [ ] Database structure patterns implemented
- [ ] Database migration organization
- [ ] Database seed data organization
- [ ] Analytics directory structure for data collection and processing
- [ ] Analytics data warehouse structure for time-series and aggregated data
- [ ] Analytics dashboard and reporting structure

## Analytics & Business Intelligence Project Structure Patterns

### Pattern 1: Analytics Directory Structure

**Description**: Project structure for analytics features with data collection, processing, and visualization

**Pattern**:
```
project/
├── analytics/
│   ├── collectors/         # Data collection services
│   │   ├── events/
│   │   ├── metrics/
│   │   └── logs/
│   ├── processors/        # Data processing and transformation
│   │   ├── aggregators/
│   │   ├── transformers/
│   │   └── enrichers/
│   ├── storage/            # Analytics data storage
│   │   ├── time-series/
│   │   ├── aggregated/
│   │   └── events/
│   ├── dashboards/         # Dashboard components
│   │   ├── components/
│   │   ├── charts/
│   │   └── filters/
│   ├── reports/            # Report generation
│   │   ├── templates/
│   │   ├── generators/
│   │   └── exports/
│   └── api/                # Analytics API endpoints
│       ├── metrics/
│       ├── events/
│       ├── dashboards/
│       └── reports/
```

### Pattern 2: Data Warehouse Structure

**Description**: Project structure for analytics data warehouse with ETL pipelines and data marts

**Pattern**:
```
project/
├── data-warehouse/
│   ├── etl/                # ETL pipelines
│   │   ├── extract/
│   │   ├── transform/
│   │   └── load/
│   ├── schemas/            # Data warehouse schemas
│   │   ├── star/
│   │   ├── snowflake/
│   │   └── fact-tables/
│   ├── data-marts/         # Data marts for specific domains
│   │   ├── product/
│   │   ├── operations/
│   │   └── finance/
│   ├── aggregations/       # Pre-computed aggregations
│   │   ├── daily/
│   │   ├── weekly/
│   │   └── monthly/
│   └── migrations/         # Data warehouse migrations
```

### Pattern 3: Analytics Frontend Structure

**Description**: Frontend structure for analytics dashboards and visualizations

**Pattern**:
```
frontend/
├── src/
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── metrics/
│   │   │   ├── charts/
│   │   │   └── filters/
│   │   ├── hooks/
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useMetrics.ts
│   │   │   └── useEventTracking.ts
│   │   ├── services/
│   │   │   ├── analytics.ts
│   │   │   ├── metrics.ts
│   │   │   └── reports.ts
│   │   └── types/
│   │       ├── analytics.ts
│   │       ├── metrics.ts
│   │       └── charts.ts
```

### Pattern 4: Analytics Backend Structure

**Description**: Backend structure for analytics APIs and data processing

**Pattern**:
```
backend/
├── analytics/
│   ├── api/
│   │   ├── metrics/
│   │   ├── events/
│   │   ├── dashboards/
│   │   └── reports/
│   ├── services/
│   │   ├── collection/
│   │   ├── processing/
│   │   ├── aggregation/
│   │   └── reporting/
│   ├── models/
│   │   ├── events/
│   │   ├── metrics/
│   │   └── reports/
│   └── repositories/
│       ├── events/
│       ├── metrics/
│       └── aggregations/
```

### Analytics Project Structure Best Practices

1. **Separation of Concerns**:
   - Separate data collection from processing
   - Separate data storage from visualization
   - Separate analytics APIs from business APIs
   - Separate real-time from batch processing

2. **Scalability**:
   - Organize for horizontal scaling
   - Separate hot and cold data storage
   - Organize for efficient querying
   - Support incremental data processing

3. **Privacy & Security**:
   - Separate anonymized data from raw data
   - Organize access control by data sensitivity
   - Separate compliance-related code
   - Organize audit logging separately

4. **Maintainability**:
   - Clear directory structure
   - Consistent naming conventions
   - Well-documented structure
   - Easy to extend with new analytics features

## Review/Contribution

**Expert**: James Wilson  
**Expertise**: Cloud Infrastructure (Cloud Platform Architecture, Deployment, Operations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this project structure review document by adding comprehensive "Cloud Infrastructure Project Structure Considerations" section covering cloud infrastructure directory structure (Infrastructure as Code organization with Terraform/CloudFormation/Pulumi, cloud deployment configuration with CI/CD workflows and Kubernetes/Docker configs, cloud environment structure with staging/production configurations), multi-cloud project structure (cloud provider abstraction with AWS/Azure/GCP-specific directories, cloud-specific configurations with environment-based configs), cloud monitoring and observability structure (monitoring configuration with dashboards and alerts, observability structure with logging/tracing/metrics), cloud security structure (security configuration with IAM policies and network security, secrets management with templates and gitignore), cloud cost management structure (cost optimization with budgets and reports), recommended cloud infrastructure structure patterns (Infrastructure as Code first with version control and reusable modules, cloud-native organization with provider separation and environment isolation, monitoring and observability with centralized configurations), and comprehensive cloud infrastructure project structure checklist covering IaC structure, deployment configuration, environment structure, multi-cloud support, monitoring, security, secrets management, cost management, CI/CD workflows, and documentation. This addition ensures that project structure patterns incorporate cloud infrastructure best practices, enabling scalable, reliable, and maintainable cloud infrastructure organization with proper separation of concerns, security, and observability.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this project structure review document by adding comprehensive "Database Project Structure Patterns" section covering database directory structure (migrations directory with sequential numbering, seeds directory with environment-specific seeds, init directory with initialization scripts, backups directory gitignored, schemas directory with schema definitions, config directory with database configuration), backend database structure (database migrations and seeds, factories for testing data, models directory for ORM models, database configuration, database tests), database migration structure (migration files with rollback files, seed files organized by data type, schema directory with current schema snapshot), database configuration structure (environment-specific database configuration files, database connection configuration), database structure best practices (migration organization with sequential numbering and descriptive names, seed data organization by environment, schema management with versioning and documentation, database configuration with environment-specific settings), and comprehensive database project structure checklist (11 items covering migrations, seeds, initialization, backups, schemas, configuration, rollback files, test data, models, tests, documentation). Enhanced "Cloud Infrastructure Project Structure Checklist" with database-specific items (database structure patterns, migration organization, seed data organization). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide practical, production-ready patterns for organizing database-related files and directories in projects, ensuring database migrations, seeds, schemas, and configurations are properly structured and maintainable.

**Expert**: Daniel Kim  
**Expertise**: Business Intelligence and Analytics  
**Date**: 2026-01-05  
**Changes**: Enhanced this project structure review document by adding comprehensive "Analytics & Business Intelligence Project Structure Patterns" section covering analytics directory structure (project structure for analytics features with data collection, processing, and visualization including collectors directory for data collection services with events/metrics/logs subdirectories, processors directory for data processing and transformation with aggregators/transformers/enrichers subdirectories, storage directory for analytics data storage with time-series/aggregated/events subdirectories, dashboards directory for dashboard components with components/charts/filters subdirectories, reports directory for report generation with templates/generators/exports subdirectories, api directory for analytics API endpoints with metrics/events/dashboards/reports subdirectories), data warehouse structure (project structure for analytics data warehouse with ETL pipelines and data marts including etl directory for ETL pipelines with extract/transform/load subdirectories, schemas directory for data warehouse schemas with star/snowflake/fact-tables subdirectories, data-marts directory for data marts for specific domains with product/operations/finance subdirectories, aggregations directory for pre-computed aggregations with daily/weekly/monthly subdirectories, migrations directory for data warehouse migrations), analytics frontend structure (frontend structure for analytics dashboards and visualizations including analytics components directory with dashboard/metrics/charts/filters subdirectories, hooks directory with useAnalytics/useMetrics/useEventTracking hooks, services directory with analytics/metrics/reports services, types directory with analytics/metrics/charts types), analytics backend structure (backend structure for analytics APIs and data processing including api directory with metrics/events/dashboards/reports endpoints, services directory with collection/processing/aggregation/reporting services, models directory with events/metrics/reports models, repositories directory with events/metrics/aggregations repositories), and analytics project structure best practices (separation of concerns with data collection/processing separation, data storage/visualization separation, analytics APIs/business APIs separation, real-time/batch processing separation, scalability with horizontal scaling organization, hot/cold data storage separation, efficient querying organization, incremental data processing support, privacy and security with anonymized/raw data separation, access control organization by data sensitivity, compliance-related code separation, audit logging organization, maintainability with clear directory structure, consistent naming conventions, well-documented structure, easy extension with new analytics features). Enhanced "Cloud Infrastructure Project Structure Checklist" with analytics-specific items (analytics directory structure, analytics data warehouse structure, analytics dashboard and reporting structure). This addition provides essential BI/Analytics perspective on project structure, ensuring analytics features have proper directory organization, scalable structure, privacy and security considerations, and maintainable architecture for comprehensive analytics capabilities.

---