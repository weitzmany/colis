# Project Structure Patterns Review

This document lists useful project structure patterns found in other projects that could be helpful for organizing new projects.

**Last Updated**: 2025-01-05

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
  ├── docs/              # Documentation
  ├── scripts/           # Build/deployment scripts
  └── docker-compose.yml
  ```
- **Description**: Full-stack application with clear backend/frontend separation
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for full-stack projects
- **Notes**: 
  - Clear separation: backend and frontend in separate directories
  - Shared scripts directory at root
  - Documentation organized separately
  - Docker configuration at root
  - Each part has its own dependency management (composer.json, package.json)

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

### ✅ Angular Library Package Structure (sandbox/keel/packages/core)

- **Location**: `/Users/yoavweitzman/Documents/sandbox/keel/packages/core/src/`
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
   - Shared `scripts/` and `docs/` at root
   - Docker configuration at root
   - Clear separation of concerns

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
1. **Clear separation**: Backend/frontend, packages, features
2. **Documentation**: `docs/` directory at root
3. **Scripts**: `scripts/` directory for automation
4. **Configuration**: Config files at appropriate levels (root, package, etc.)
5. **Testing**: Tests co-located with source or in `tests/` directory

### Directory Naming:
- Use lowercase, kebab-case for directories
- Descriptive names (backend, frontend, packages, scripts)
- Feature-based organization for libraries

### File Organization:
- Public API exports via `index.ts`/`index.js`
- README files in feature/package directories
- Config files at appropriate levels

## Notes

- Structure patterns are highly reusable across projects
- Choose pattern based on project type (library, full-stack, etc.)
- Consistency within a project is key
- Documentation structure should match code structure
- Scripts and configs should be at appropriate levels

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

---

## Review/Contribution

**Expert**: James Wilson  
**Expertise**: Cloud Infrastructure (Cloud Platform Architecture, Deployment, Operations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this project structure review document by adding comprehensive "Cloud Infrastructure Project Structure Considerations" section covering cloud infrastructure directory structure (Infrastructure as Code organization with Terraform/CloudFormation/Pulumi, cloud deployment configuration with CI/CD workflows and Kubernetes/Docker configs, cloud environment structure with staging/production configurations), multi-cloud project structure (cloud provider abstraction with AWS/Azure/GCP-specific directories, cloud-specific configurations with environment-based configs), cloud monitoring and observability structure (monitoring configuration with dashboards and alerts, observability structure with logging/tracing/metrics), cloud security structure (security configuration with IAM policies and network security, secrets management with templates and gitignore), cloud cost management structure (cost optimization with budgets and reports), recommended cloud infrastructure structure patterns (Infrastructure as Code first with version control and reusable modules, cloud-native organization with provider separation and environment isolation, monitoring and observability with centralized configurations), and comprehensive cloud infrastructure project structure checklist covering IaC structure, deployment configuration, environment structure, multi-cloud support, monitoring, security, secrets management, cost management, CI/CD workflows, and documentation. This addition ensures that project structure patterns incorporate cloud infrastructure best practices, enabling scalable, reliable, and maintainable cloud infrastructure organization with proper separation of concerns, security, and observability.

---