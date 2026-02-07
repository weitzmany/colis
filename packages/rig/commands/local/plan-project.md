# Plan Project Command

**Trigger**: `/local/plan-project <project-identifier>`

**Purpose**: Automatically build, expand, update, or upgrade Product Requirements Documents (PRDs) for a project with intelligent structure management and expert contributions.

---

## Command Parameters

**Required**: `<project-identifier>` - Project name, ID, or unambiguous description

**Examples**:
- `/local/plan-project chore-allowance-manager`
- `/local/plan-project vehicle-maintenance`
- `/local/plan-project "learning games platform"`

---

## Execution Flow

### Phase 1: Project Discovery & Validation

1. **Search for Project**
   ```
   - Check `docs/projects/<project-name>/` directory
   - Check `docs/reference/PROJECTS_LIST.md` for project entry
   ```

2. **Validation Logic**
   ```
   IF project exists in NEITHER location:
     → STOP with error code
     → Message: "Project '<name>' not found. Create project first."
   
   IF project exists in ONLY ONE location:
     → CREATE the missing entry/directory
     → Sync information between both
   
   IF project exists in BOTH locations:
     → PROCEED to planning phase
   ```

3. **Consistency Check**
   ```
   - Verify project info matches between directory and list
   - Update PROJECTS_LIST.md if directory has more recent info
   - Create missing subdirectories if needed
   ```

### Phase 2: Project Understanding & Documentation Rebuild

**IMPORTANT**: If existing documentation exists, USE it to understand the project, but REBUILD the documentation with the new organized structure.

1. **Check for General Features**
   ```
   - Identify if project uses shared/general features
   - Check if docs/projects/general/ exists
   - Check if project needs general features (auth, i18n, staff, etc.)
   - Verify feature is used by 3+ projects before making it general
   - Reference existing general features in INDEX.md
   - Create new general features only if 3+ projects need them
   - Keep project-specific if only 1-2 projects use it
   ```

2. **Read Existing Documentation**
   ```
   - Read all existing PRD files in project directory
   - Read project entry in PROJECTS_LIST.md
   - Extract all project information, requirements, features
   - Understand current scope, features, and status
   - Identify gaps and areas needing expansion
   - Capture all decisions, rationale, and context
   ```

3. **Project Context Analysis**
   ```
   - Identify project type (web app, mobile, backend, full-stack)
   - Identify target users and use cases
   - Identify technical stack and constraints
   - Identify business goals and success metrics
   - Extract existing feature definitions
   - Understand existing architecture decisions
   - Note any expert reviews or contributions
   - Identify which features are general vs project-specific
   ```

4. **Documentation Rebuild Strategy**
   ```
   PROCESS:
   1. Extract ALL information from existing docs
   2. Organize information into new structure
   3. Identify general vs project-specific features
   4. Reference or create general features as needed
   5. Fill gaps with expanded planning
   6. Create new organized file structure
   7. Preserve all existing content (reorganized)
   8. Add new planning where needed
   
   PRESERVE:
   - All existing requirements
   - All feature definitions
   - All technical decisions
   - All business logic
   - All expert contributions
   
   REBUILD:
   - File organization (INDEX.md, subdirectories)
   - Structure (split by feature/technical/business/general)
   - Navigation (clear cross-references, including to general/)
   - File sizes (max 500 lines per file)
   - Expert tracking (EXPERTS.md)
   - General feature references
   ```

5. **Scope Assessment**
   ```
   - What's documented vs what's missing
   - What needs expansion or clarification
   - What's outdated and needs updating
   - What new features/areas should be planned
   - Which features should be general vs project-specific
   - How to best organize the information
   ```

### Phase 3: Expert Team Assembly

**Automatically select relevant experts based on project needs:**

1. **Core Experts** (Always Involved)
   - **Patricia Martinez** (Product Manager) - Overall planning, prioritization, business decisions
   - **Dorothy Clark** (Documentation) - PRD structure, clarity, completeness

2. **Technical Experts** (Based on Stack)
   - **Samuel Rodriguez** (Backend) - API design, database, server logic
   - **Daisy Thompson** (UI/UX) - User interface, user experience, design
   - **Rachel Kim** (GraphQL) - If GraphQL is used
   - **Michael Brown** (Mobile) - If mobile app is involved
   - **Thomas Anderson** (Frontend) - Frontend architecture, state management

3. **Specialized Experts** (Based on Features)
   - **Allison Foster** (Accessibility) - If user-facing features
   - **Ryan Kim** (Security) - Authentication, data protection
   - **James Martinez** (Performance) - If performance-critical
   - **Constance White** (Compliance) - If handling user data, especially for educational platforms
   - **Lisa Garcia** (i18n) - If multi-language support needed
   - **Carol Williams** (Educational Content) - If educational platform
   - **Gary Wilson** (Business Intelligence) - If analytics/reporting features
   - **Benjamin Lee** (Database) - Complex data modeling
   - **David Cooper** (DevOps) - Deployment, CI/CD, infrastructure
   - **Emily Chen** (API Design) - RESTful API design
   - **Marcus Johnson** (Architecture) - System architecture, scalability
   - **Andrew Mitchell** (Learning Analytics) - If learning/education features
   - **Laura Phillips** (Market Research) - Market fit, competitive analysis
   - **Sarah Kim** (Cloud Infrastructure) - Cloud architecture, services
   - **Jessica Taylor** (Code Quality) - Code standards, review processes
   - **Robert Brown** (Testing) - Testing strategy, TDD
   - **Kevin Martinez** (Observability) - Monitoring, logging, tracing
   - **Amanda Davis** (SEO) - Search optimization
   - **Olivia Martinez** (Copywriter) - App naming, content, messaging

### Phase 4: PRD Structure Planning

**Create/Update PRD files with smart organization:**

#### Global vs Project-Specific Features

**General Features Directory** (`docs/projects/general/`):
- Features shared across multiple projects
- Common infrastructure (auth, translations, staff management)
- Reusable components and systems
- Single source of truth for shared features
- Avoids duplication across project PRDs

**When to use General Features:**

**Standard Criteria** (all must apply):
- ✅ Feature is used by 3+ projects (threshold for general feature)
- ✅ Feature is a common infrastructure need (auth, i18n, admin, notifications)
- ✅ Feature has project-agnostic requirements
- ✅ Feature works with **minimal configuration** across projects (5-10 options)
- ✅ Feature has consistent behavior and interface across projects
- ✅ Feature benefits from centralized planning and consistency

**OR Architectural Override Criteria** (any one applies):
- ✅ Feature is **centrally deployed** (microservice, shared backend service)
- ✅ Feature requires **security updates across all projects simultaneously**
- ✅ Feature handles **compliance requirements** that must be consistent
- ✅ Feature is **infrastructure-level** (logging, monitoring, error tracking)
- ✅ Feature requires **single source of truth** (user accounts, permissions)
- ✅ Feature has **critical security implications** (authentication, encryption, PII handling)
- ✅ Feature requires **synchronized upgrades** for compatibility or security

**Note**: Architectural Override means the feature MUST be general even if highly configured, because operational/security requirements demand centralization.

**When to use Project-Specific Features:**
- ✅ Feature is unique to 1-2 projects
- ✅ Feature has project-specific requirements
- ✅ Feature is closely tied to a project's core purpose
- ✅ Feature requires **extensive configuration or adjustments** per project
- ✅ Feature behavior varies significantly between projects
- ✅ Feature is still evolving and not yet standardized

**⚠️ Warning Signs: Feature is NOT Generic Enough**
- ❌ Requires many configuration options per project
- ❌ Needs project-specific code changes for each implementation
- ❌ Has different behavior requirements across projects
- ❌ Requires extensive customization per project
- ❌ More configuration than actual core functionality
- ❌ Each project uses it differently

**Rule of Thumb**: If the feature needs more than 5-10 configuration options or requires custom code per project, it's NOT general enough. Keep it project-specific.

**Examples:**

**✅ Good General Features - Standard Criteria** (3+ projects, minimal config):
- **Authentication system**: Same login flow, minimal config (OAuth providers, session timeout)
- **Translation/i18n**: Same interface, config is just language files
- **Staff management**: Standard admin CRUD, minimal project differences
- **Email system**: Standard send/template, config is SMTP settings
- **Notifications**: Standard push/email/SMS, config is preferences

**✅ Good General Features - Architectural Override** (even if highly configured):
- **User permission system**: Centrally managed, security-critical, needs synchronized updates
- **Audit logging**: Compliance requirement, must be consistent, centrally stored
- **SSO/Authentication gateway**: Security-critical, centrally deployed, must upgrade together
- **Data encryption service**: Security-critical, centralized, must patch vulnerabilities together
- **Rate limiting service**: Centrally deployed microservice, security/abuse prevention
- **PII handling service**: Compliance-critical, must maintain consistent standards
- **Monitoring/observability**: Infrastructure-level, centrally deployed, needs consistent data

**❌ NOT General Enough** (too much customization AND no architectural reason):
- **Dashboard layouts**: Each project needs completely different layouts and widgets
- **Reporting system**: Each project has different reports, metrics, and visualizations
- **Workflow engine**: Each project has different workflow steps and business rules
- **Content management**: Each project has different content types and relationships
- **Form builder**: Each project has vastly different form requirements and validation

**✅ Good Project-Specific** (1-2 projects or too customized without architectural reason):
- **Chore assignment**: Specific to Chore Allowance Manager's domain logic
- **Maintenance logs**: Specific to Vehicle Maintenance's tracking needs
- **Learning games**: Specific game mechanics and educational content
- **Custom analytics dashboard**: Each project's metrics are too different (and not compliance-required)

**Note**: A feature used by only 1-2 projects should remain project-specific. When a 3rd project needs it, **re-evaluate if it's truly general** (minimal config OR architectural override) before migrating.

## Real-World Example: Permission System

**Scenario**: 5 projects need user permissions, but each project has different permission models:
- Project A: Simple role-based (Admin, User)
- Project B: Complex hierarchy with custom permissions
- Project C: Resource-based permissions
- Project D: Team-based permissions
- Project E: Time-limited permissions

**Analysis**:
- ❌ **Standard Criteria**: NOT met (highly configured, different models)
- ✅ **Architectural Override**: YES - Security-critical, single source of truth, must upgrade together

**Decision**: Make it GENERAL because:
1. **Security-Critical**: Permission vulnerabilities affect all projects
2. **Central Management**: User accounts and permissions must be centralized
3. **Synchronized Updates**: Security patches must deploy to all projects together
4. **Compliance**: Audit trail must be consistent across projects

**Implementation**: 
- Deploy as central authentication/authorization service
- Each project configures its permission model
- All projects use same secure backend
- Security updates deploy once, affect all projects

1. **Directory Structure Template**
   ```
   docs/projects/
   ├── general/                    # Global/shared features across projects
   │   ├── INDEX.md                # Overview of all general features
   │   ├── authentication/
   │   │   ├── PRD.md
   │   │   └── ARCHITECTURE.md
   │   ├── translations/
   │   │   ├── PRD.md
   │   │   └── ARCHITECTURE.md
   │   ├── staff-management/
   │   │   ├── PRD.md
   │   │   └── ARCHITECTURE.md
   │   └── [other-shared-features]/
   │
   └── <project-name>/
       ├── INDEX.md                # Master overview and navigation (references general/)
       ├── PRD_OVERVIEW.md         # High-level project requirements (main PRD)
       ├── ARCHITECTURE.md         # System architecture and technical design
       ├── EXPERTS.md              # Expert contributions and sign-offs
       ├── features/               # Project-specific features (if needed)
       │   ├── user-dashboard.md
       │   └── analytics.md
       ├── technical/              # Technical specifications (if needed)
       │   ├── api-design.md
       │   ├── database-schema.md
       │   └── security.md
       ├── business/               # Business requirements (if needed)
       │   ├── revenue-model.md
       │   ├── user-personas.md
       │   └── success-metrics.md
       └── compliance/             # Compliance and legal (if needed)
           ├── privacy-policy.md
           ├── data-protection.md
           └── accessibility.md
   ```

2. **File Size Management**
   ```
   RULE: Maximum 500 lines per file
   
   IF file exceeds 500 lines:
     → Identify logical split points (features, sections, subsystems)
     → Create subdirectory or split into multiple files
     → Update INDEX.md with navigation structure
     → Maintain cross-references between files
   ```

3. **INDEX.md Template**
   ```markdown
   # <Project Name> - Documentation Index
   
   ## Overview
   Brief project description and purpose.
   
   ## Documentation Structure
   - [PRD Overview](PRD_OVERVIEW.md) - Main requirements document
   - [Architecture](ARCHITECTURE.md) - Technical architecture
   - [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs
   
   ### Global/Shared Features
   This project uses the following general features (documented in [../general/](../general/INDEX.md)):
   - [Authentication System](../general/authentication/PRD.md) - User authentication and authorization
   - [Translation System](../general/translations/PRD.md) - Multi-language support (i18n)
   - [Staff Management](../general/staff-management/PRD.md) - Admin/staff user management
   - [Other Global Features](../general/INDEX.md) - See complete list
   
   ### Project-Specific Features
   - [User Dashboard](features/user-dashboard.md)
   - [Analytics](features/analytics.md)
   
   ### Technical
   - [API Design](technical/api-design.md)
   - [Database Schema](technical/database-schema.md)
   
   ### Business
   - [Revenue Model](business/revenue-model.md)
   - [Success Metrics](business/success-metrics.md)
   
   ## Project Status
   - Current Phase: [Planning/Development/Testing/Production]
   - Last Updated: [Date]
   - Priority: [High/Medium/Low]
   ```

### Phase 5: PRD Content Generation

**Generate comprehensive PRD content with expert input:**

1. **PRD_OVERVIEW.md Structure**
   ```markdown
   # <Project Name> - Product Requirements Document
   
   ## Executive Summary
   - Project vision and goals
   - Target users
   - Key value propositions
   - Success metrics
   
   ## Problem Statement
   - What problem does this solve?
   - Who experiences this problem?
   - Current solutions and their limitations
   
   ## Solution Overview
   - Proposed solution
   - How it addresses the problem
   - Key differentiators
   
   ## User Personas
   - Primary users
   - Secondary users
   - User needs and pain points
   
   ## MVP (Minimum Viable Product) Definition ⚠️ REQUIRED
   
   ### MVP Scope
   - **Core Problem**: The ONE problem the MVP solves
   - **Core User**: The ONE primary user type for MVP
   - **Core Value**: The ONE key benefit users get
   
   ### MVP Features (Must-Have)
   1. **Feature 1**: [Essential feature description]
      - Why it's in MVP: [Business/user justification]
      - User story: As a [user], I want to [action] so that [benefit]
   
   2. **Feature 2**: [Essential feature description]
      - Why it's in MVP: [Business/user justification]
      - User story: As a [user], I want to [action] so that [benefit]
   
   3. **Feature 3**: [Essential feature description]
      - Why it's in MVP: [Business/user justification]
      - User story: As a [user], I want to [action] so that [benefit]
   
   ### MVP Success Criteria
   - **User Adoption**: [Metric, e.g., "100 active users in first month"]
   - **User Engagement**: [Metric, e.g., "50% weekly return rate"]
   - **Core Functionality**: [Metric, e.g., "Users can complete main task in <5 min"]
   - **Technical Stability**: [Metric, e.g., "99% uptime"]
   
   ### MVP Timeline
   - **Development**: [Duration, e.g., "8 weeks"]
   - **Testing**: [Duration, e.g., "2 weeks"]
   - **Launch**: [Target date]
   
   ### MVP Tech Stack
   - Frontend: [Framework]
   - Backend: [Technology]
   - Database: [Database]
   - Hosting: [Platform]
   
   ### What's NOT in MVP (Future Features)
   - Feature X: [Why it's post-MVP]
   - Feature Y: [Why it's post-MVP]
   - Feature Z: [Why it's post-MVP]
   
   ## Post-MVP Features (Phase 2+)
   - Feature 1: Brief description [Priority: High/Medium/Low]
   - Feature 2: Brief description [Priority: High/Medium/Low]
   - [Link to detailed feature PRDs]
   
   ## Technical Requirements (High-Level)
   - Tech stack
   - Infrastructure
   - Integrations
   - [Link to technical PRDs]
   
   ## Business Requirements (High-Level)
   - Revenue model
   - Pricing strategy
   - Go-to-market
   - [Link to business PRDs]
   
   ## Timeline & Milestones
   - Phase 1: MVP (see MVP section above)
   - Phase 2: Core features (features, timeline)
   - Phase 3: Enhancement features (features, timeline)
   
   ## Success Criteria
   - Quantitative metrics
   - Qualitative metrics
   - Business goals
   
   ## Risks & Mitigation
   - Technical risks
   - Business risks
   - Compliance risks
   - Mitigation strategies
   ```

2. **ARCHITECTURE.md Structure**
   ```markdown
   # <Project Name> - Architecture
   
   ## System Overview
   - High-level architecture diagram
   - System components
   - Data flow
   
   ## Frontend Architecture
   - Framework and libraries
   - State management
   - Routing
   - Component structure
   
   ## Backend Architecture
   - API design (REST/GraphQL)
   - Database design
   - Authentication/Authorization
   - Business logic
   
   ## Infrastructure
   - Hosting/deployment
   - CI/CD pipeline
   - Monitoring/logging
   - Scaling strategy
   
   ## Security Architecture
   - Authentication flow
   - Authorization model
   - Data encryption
   - Security best practices
   
   ## Data Architecture
   - Database schema
   - Data models
   - Data relationships
   - Data flow
   
   ## Integration Architecture
   - External APIs
   - Third-party services
   - Webhooks
   - Event-driven architecture
   ```

3. **Feature PRD Template** (features/*.md)
   ```markdown
   # Feature: <Feature Name>
   
   ## Overview
   - Feature description
   - User benefit
   - Business value
   
   ## User Stories
   - As a [user], I want to [action] so that [benefit]
   
   ## Requirements
   ### Functional Requirements
   - Requirement 1
   - Requirement 2
   
   ### Non-Functional Requirements
   - Performance requirements
   - Security requirements
   - Accessibility requirements
   
   ## User Interface
   - UI mockups/wireframes
   - User flow
   - Interaction design
   
   ## API Specification
   - Endpoints
   - Request/response formats
   - Error handling
   
   ## Database Schema
   - Tables/collections
   - Fields
   - Relationships
   
   ## Testing Strategy
   - Unit tests
   - Integration tests
   - E2E tests
   - User acceptance criteria
   
   ## Success Metrics
   - KPIs for this feature
   - Tracking plan
   ```

4. **EXPERTS.md Structure**
   ```markdown
   # <Project Name> - Expert Contributions
   
   ## Expert Team
   
   ### Product Management
   **Patricia Martinez** - Product Manager
   - Role: Overall planning, prioritization, business decisions
   - Contributions: [List key decisions and planning work]
   - Sign-off: [Date]
   
   ### Technical Architecture
   **Marcus Johnson** - Architecture Expert
   - Role: System architecture, scalability planning
   - Contributions: [List architecture decisions]
   - Sign-off: [Date]
   
   ### [Continue for each expert involved]
   
   ## Expert Reviews
   
   ### [Feature/Section Name] Review
   **Expert**: [Name]
   **Date**: [Date]
   **Status**: [Approved/Changes Requested/Rejected]
   **Comments**: [Expert feedback]
   
   ## Sign-off Summary
   | Expert | Role | Sign-off Date | Status |
   |--------|------|---------------|--------|
   | Patricia Martinez | Product Manager | 2026-01-20 | ✅ Approved |
   | Marcus Johnson | Architecture | 2026-01-20 | ✅ Approved |
   ```

5. **General Features Structure** (docs/projects/general/)
   ```markdown
   # General/Shared Features - Index
   
   ## Overview
   This directory contains planning for features shared across multiple projects.
   These features are planned centrally to avoid duplication and ensure consistency.
   
   ## Available General Features
   
   ### Authentication System
   - [PRD](authentication/PRD.md)
   - [Architecture](authentication/ARCHITECTURE.md)
   - Used by: [List of projects]
   - Status: [Planning/Ready/Implemented]
   
   ### Translation System (i18n)
   - [PRD](translations/PRD.md)
   - [Architecture](translations/ARCHITECTURE.md)
   - Used by: [List of projects]
   - Status: [Planning/Ready/Implemented]
   
   ### Staff Management
   - [PRD](staff-management/PRD.md)
   - [Architecture](staff-management/ARCHITECTURE.md)
   - Used by: [List of projects]
   - Status: [Planning/Ready/Implemented]
   
   ### [Other General Features]
   - [PRD](feature-name/PRD.md)
   - [Architecture](feature-name/ARCHITECTURE.md)
   - Used by: [List of projects]
   - Status: [Planning/Ready/Implemented]
   
   ## How to Use General Features
   
   1. Check if a general feature already exists for your need
   2. Evaluate if the general feature works with minimal configuration for your project
   3. Reference the general feature in your project's INDEX.md
   4. Update the general feature's "Used by" list
   
   ## When to Create New General Features
   
   ### Path A: Standard Criteria (all must apply)
   1. Feature is needed by 3+ projects
   2. **AND** feature works with minimal configuration (5-10 options max)
   3. **AND** core behavior is identical across projects
   4. **AND** no custom code needed per project
   5. Then: Create in this directory and document configuration options
   
   ### Path B: Architectural Override (any must apply)
   1. Feature is centrally deployed (microservice, shared service)
   2. **OR** feature is security-critical (auth, encryption, PII)
   3. **OR** feature requires compliance consistency (audit, GDPR, PCI)
   4. **OR** feature is infrastructure-level (logging, monitoring)
   5. **OR** feature requires single source of truth
   6. **OR** feature needs synchronized security updates
   7. Then: Create as general even if highly configured
   
   ## When NOT to Create General Features
   
   1. Feature needs extensive customization per project
   2. **AND** feature is NOT centrally deployed
   3. **AND** feature is NOT security-critical
   4. **AND** feature has NO compliance requirements
   5. **AND** feature is NOT infrastructure-level
   6. Then: Keep as project-specific, accept duplication
   
   **Key**: Architectural requirements (security, compliance, central deployment) override configuration complexity concerns.
   
   ## Creating New General Features
   
   Create a new general feature when **EITHER** of these apply:
   
   ### Path A: Standard Criteria (ALL must be met)
   1. **Usage**: Feature will be used by 3+ projects
   2. **Common Infrastructure**: Feature is standard infrastructure (auth, notifications, etc.)
   3. **Project-Agnostic**: Feature has project-agnostic requirements
   4. **Minimal Configuration**: Feature works with 5-10 config options max
   5. **Consistent Behavior**: Feature behaves the same way across projects
   6. **Centralized Benefit**: Feature benefits from centralized planning and consistency
   
   ### Path B: Architectural Override (ANY must be met)
   1. **Central Deployment**: Feature is deployed as shared service/microservice
   2. **Security Critical**: Feature requires security updates across all projects together
   3. **Compliance Required**: Feature must maintain consistent compliance standards
   4. **Infrastructure Level**: Feature is infrastructure (logging, monitoring, error tracking)
   5. **Single Source of Truth**: Feature requires centralized data management
   6. **Synchronized Upgrades**: Feature compatibility/security requires synchronized updates
   
   **Note**: Path B features can be highly configured because architectural requirements demand centralization.
   
   ## Do NOT Create General Features When:
   
   **Avoid unless Architectural Override applies:**
   - ❌ Feature needs extensive configuration per project
   - ❌ Feature requires custom code for each project
   - ❌ Feature behavior varies significantly between projects
   - ❌ Feature has more configuration than core functionality
   - ❌ Feature is really "multiple features" disguised as one
   - ❌ "General" version would be more complex than project-specific versions
   
   **Exception**: If feature meets Architectural Override criteria (security-critical, centrally deployed, compliance-required, etc.), create as general even if highly configured.
   
   **Better Solution (when no architectural reason)**: Keep as project-specific features, accept some duplication
   
   ## Feature Migration
   
   If a project-specific feature is adopted by 3+ projects:
   
   **Step 1: Check for Architectural Override**
   Ask: Does this feature meet ANY architectural override criteria?
   - ✅ Centrally deployed (microservice, shared backend)?
   - ✅ Security-critical (auth, encryption, PII handling)?
   - ✅ Compliance-required (audit, GDPR, PCI, HIPAA)?
   - ✅ Infrastructure-level (logging, monitoring, observability)?
   - ✅ Single source of truth requirement?
   - ✅ Must upgrade together for security/compatibility?
   
   **If YES** → Migrate to general/ regardless of configuration complexity
   
   **If NO** → Proceed to Step 2
   
   **Step 2: Evaluate if it's minimally configured**
   - ✅ Does it work with minimal configuration across all projects (5-10 options)?
   - ✅ Is the core functionality the same in all projects?
   - ✅ Would a single implementation serve all projects well?
   - ❌ Does each project need significant customization?
   - ❌ Are there more than 10 configuration options needed?
   
   **Step 3: Decide**
   
   **If Standard Criteria met OR Architectural Override met:**
   1. Create feature in general/ directory
   2. Update all project INDEX.md files to reference general feature
   3. Add "Used by" list to general feature PRD
   4. Document why it's general (Standard Criteria or Architectural Override)
   5. Archive old project-specific versions
   
   **If NOT general enough and NO architectural reason:**
   - Keep as project-specific features
   - Accept duplication (it's better than over-abstraction)
   - Document similarities for reference, but don't force generalization
   ```

   **General Feature PRD Template** (general/[feature-name]/PRD.md)
   ```markdown
   # General Feature: [Feature Name]
   
   ## Overview
   - Feature description
   - Purpose and benefits
   - Intended use across projects
   
   ## Usage Tracking
   - **Minimum Projects**: 3 (threshold met)
   - **Migrated to General**: [Date when 3rd project adopted it]
   - **Current Project Count**: [Number]
   
   ## Generality Assessment
   
   ### Classification
   - **General Feature Type**: [Standard Criteria | Architectural Override]
   
   ### Standard Criteria Assessment (if applicable)
   - **Core Functionality**: [Describe the core behavior that's identical across projects]
   - **Configuration Count**: [Number of config options needed] (Target: 5-10 max)
   - **Custom Code Required**: No (should be zero per project)
   - **Behavior Consistency**: [How consistent is behavior across projects]
   
   ### Architectural Override Justification (if applicable)
   - **Central Deployment**: [Yes/No] - [Explain how it's centrally deployed]
   - **Security Critical**: [Yes/No] - [Explain security implications]
   - **Compliance Required**: [Yes/No] - [List compliance requirements: GDPR, PCI, HIPAA, etc.]
   - **Infrastructure Level**: [Yes/No] - [Explain infrastructure role]
   - **Single Source of Truth**: [Yes/No] - [Explain data centralization needs]
   - **Synchronized Updates Required**: [Yes/No] - [Explain why synchronization is needed]
   
   **Note**: Features meeting Architectural Override criteria can have extensive configuration because centralization is architecturally required.
   
   ## Projects Using This Feature
   - [Project Name 1](../../project-name-1/INDEX.md) - Since [Date]
     - Config: [Brief description of what's configured]
   - [Project Name 2](../../project-name-2/INDEX.md) - Since [Date]
     - Config: [Brief description of what's configured]
   - [Project Name 3](../../project-name-3/INDEX.md) - Since [Date]
     - Config: [Brief description of what's configured]
   - [Additional Projects...] - Since [Date]
   
   ## Requirements
   
   ### Functional Requirements
   - General requirement 1
   - General requirement 2
   - Customization points for projects
   
   ### Non-Functional Requirements
   - Performance requirements
   - Security requirements
   - Scalability requirements
   
   ## Project-Specific Customization
   
   ### Customization Options
   - Configuration option 1
   - Configuration option 2
   - Project-specific extensions
   
   ### Integration Guidelines
   - How projects should integrate this feature
   - Configuration requirements
   - API/interface contracts
   
   ## Technical Specifications
   - See [Architecture Document](ARCHITECTURE.md)
   
   ## Implementation Status
   - Planning: [Date]
   - Implementation: [Date]
   - Available for use: [Date]
   ```

### Phase 6: PROJECTS_LIST.md Update

**Update project entry with comprehensive information:**

```markdown
## <Project Name>

**Status**: [Planning/In Progress/Complete/On Hold]
**Priority**: [High/Medium/Low]
**Category**: [Web App/Mobile App/Backend Service/Full-Stack/Tool/Package]

### Overview
[Brief 2-3 sentence description]

### Key Features
- Feature 1
- Feature 2
- Feature 3

### Tech Stack
- Frontend: [Framework]
- Backend: [Technology]
- Database: [Database]
- Infrastructure: [Hosting]

### Documentation
- [PRD Overview](projects/<project-name>/PRD_OVERVIEW.md)
- [Architecture](projects/<project-name>/ARCHITECTURE.md)
- [Documentation Index](projects/<project-name>/INDEX.md)

### Timeline
- Started: [Date]
- Target Completion: [Date]
- Current Phase: [Phase]

### Business Value
- [Revenue potential/user value/strategic importance]

### Expert Team
- Product: Patricia Martinez
- Architecture: Marcus Johnson
- [Other experts]
```

---

## Command Workflow Summary

1. **Validate** project exists in docs/projects/ or PROJECTS_LIST.md
2. **Sync** project information between directory and list
3. **Check General Features** - Identify if project uses shared features
4. **Read & Extract** all information from existing documentation
5. **Analyze** project scope, features, requirements, gaps
6. **Identify** which features are general vs project-specific
7. **Assemble** expert team based on project needs
8. **Plan** new organized directory structure and file organization
9. **Reference/Create** general features as needed
10. **Rebuild** documentation with new structure, preserving all content
11. **Generate** comprehensive PRD content (new + reorganized existing)
12. **Create** INDEX.md for navigation (with general feature references)
13. **Create** EXPERTS.md with all expert contributions
14. **Update** PROJECTS_LIST.md with current information
15. **Update** general features index with project references
16. **Review** all files for completeness and consistency

### Key Principle: Read to Understand, Rebuild to Organize

```
Existing Docs → Extract Content → Identify General Features → Organize into New Structure → Fill Gaps → Complete PRDs
     ↓              ↓                       ↓                          ↓                       ↓            ↓
   PRD.md    Requirements        Auth, i18n, Staff        INDEX.md (+ general refs)     New sections    EXPERTS.md
              Features            Reference or Create       Subdirectories               Expanded       Updated list
              Decisions           in general/              Split files                   planning       General index
```

---

## File Size Management Rules

### Automatic Splitting Logic

**IF any PRD file exceeds 500 lines:**

1. **Identify Split Points**
   - By feature (e.g., authentication vs dashboard)
   - By layer (e.g., frontend vs backend vs database)
   - By topic (e.g., requirements vs design vs testing)
   - By phase (e.g., MVP vs future features)

2. **Create Subdirectory Structure**
   ```
   features/           # For feature-specific PRDs
   technical/          # For technical specifications
   business/           # For business requirements
   compliance/         # For compliance and legal
   ```

3. **Update Cross-References**
   - Update INDEX.md with new structure
   - Add cross-references between related documents
   - Maintain navigation links

4. **Maintain Consistency**
   - Use consistent formatting across all files
   - Use consistent naming conventions
   - Keep related information together

---

## Expert Selection Logic

**Automatic expert selection based on project characteristics:**

```
IF project has authentication:
  → Include Ryan Kim (Security Expert)

IF project has user-facing UI:
  → Include Daisy Thompson (UI/UX Expert)
  → Include Allison Foster (Accessibility Expert)

IF project uses GraphQL:
  → Include Rachel Kim (GraphQL Expert)

IF project is mobile app:
  → Include Michael Brown (Mobile Expert)

IF project handles user data:
  → Include Constance White (Compliance Expert)
  → Include Ryan Kim (Security Expert)

IF project is educational:
  → Include Carol Williams (Educational Content Expert)
  → Include Andrew Mitchell (Learning Analytics Expert)

IF project needs analytics:
  → Include Gary Wilson (Business Intelligence Expert)

IF project is multi-language:
  → Include Lisa Garcia (i18n Expert)

IF project has complex data model:
  → Include Benjamin Lee (Database Expert)

IF project needs deployment:
  → Include David Cooper (DevOps Expert)

IF project has performance requirements:
  → Include James Martinez (Performance Expert)

IF project has API:
  → Include Emily Chen (API Design Expert)
  → IF REST: Emily Chen
  → IF GraphQL: Rachel Kim

IF project needs naming/content:
  → Include Olivia Martinez (Copywriter Expert)

IF project needs market research:
  → Include Laura Phillips (Market Research Expert)
```

---

## Output Format

### Success Output

```
✅ Project Plan Generated: <project-name>

📁 Documentation Structure:
  ├── INDEX.md (Navigation guide)
  ├── PRD_OVERVIEW.md (Main PRD - 450 lines)
  │   └── ✅ MVP Definition included (Lines 45-120)
  ├── ARCHITECTURE.md (Technical design - 380 lines)
  ├── EXPERTS.md (Expert contributions)
  ├── features/ (3 project-specific feature PRDs)
  ├── technical/ (2 technical specs)
  └── business/ (1 business doc)

🌐 General Features Referenced:
  ✓ Authentication System (../general/authentication/)
  ✓ Translation System (../general/translations/)
  ✓ Staff Management (../general/staff-management/)
  → All referenced in INDEX.md

🎯 MVP Definition:
  ✓ Core Problem: Defined
  ✓ Core User: Identified
  ✓ Core Value: Articulated
  ✓ MVP Features: 5 must-have features
  ✓ Success Criteria: 4 measurable metrics
  ✓ Timeline: 8 weeks development + 2 weeks testing
  ✓ Tech Stack: Defined
  ✓ Post-MVP Features: 8 features identified for Phase 2+

👥 Expert Team (8 experts):
  ✓ Patricia Martinez (Product Manager) - MVP prioritization
  ✓ Marcus Johnson (Architecture) - MVP tech stack
  ✓ Samuel Rodriguez (Backend)
  ✓ Daisy Thompson (UI/UX)
  ✓ Ryan Kim (Security)
  ✓ Allison Foster (Accessibility)
  ✓ Dorothy Clark (Documentation)
  ✓ Emily Chen (API Design)

📊 Documentation Stats:
  - Total files: 10
  - Total lines: 3,240
  - Largest file: PRD_OVERVIEW.md (450 lines)
  - Smallest file: INDEX.md (85 lines)
  - MVP section: 75 lines
  - General features referenced: 3

🔗 Quick Links:
  - [Project Index](docs/projects/<project-name>/INDEX.md)
  - [PRD Overview](docs/projects/<project-name>/PRD_OVERVIEW.md)
  - [MVP Definition](docs/projects/<project-name>/PRD_OVERVIEW.md#mvp-minimum-viable-product-definition)
  - [General Features](docs/projects/general/INDEX.md)
  - [Projects List Entry](docs/reference/PROJECTS_LIST.md#<project-name>)
```

### Error Outputs

```
❌ Error: Project Not Found

Project '<project-name>' not found in:
  - docs/projects/<project-name>/ (directory)
  - docs/reference/PROJECTS_LIST.md (list)

Create the project first using one of these methods:
  1. Create project directory: docs/projects/<project-name>/
  2. Add project entry to PROJECTS_LIST.md
  3. Use project creation command (if available)
```

---

## Best Practices

1. **MVP First**: Every project MUST define MVP clearly before expanding scope
2. **General Features First**: Check for existing general features before creating project-specific ones
3. **3+ Projects Rule**: Only create general features when 3+ projects need them
4. **Minimal Configuration Rule**: General features should work with 5-10 config options max (unless Architectural Override)
5. **Architectural Override Exception**: Security-critical, centrally-deployed, or compliance-required features MUST be general even if highly configured
6. **Avoid Over-Abstraction**: If a feature needs extensive customization AND has no architectural reason, keep it project-specific
7. **Duplication > Complexity**: Better to duplicate simple code than create complex general features (unless security/compliance requires centralization)
7. **Preserve Content**: Never lose existing project information when rebuilding
8. **Extract Thoroughly**: Read all existing docs to understand the full context
9. **Organize Smart**: Use new structure to make information easier to find
10. **Separate Concerns**: Keep general features in general/, project-specific in project directories
11. **Keep Files Focused**: Each file should have a clear, single purpose
12. **Use INDEX.md**: Always create a navigation guide with general feature references
13. **Cross-Reference**: Link related documents together, including general features
14. **Expert Sign-offs**: Track which experts reviewed which sections
15. **Version Control**: Document when major changes are made
16. **Consistency**: Use consistent formatting and terminology across all projects
17. **Completeness**: Ensure all aspects of the project are documented
18. **Clarity**: Write for clarity, not just completeness
19. **Navigation**: Make it easy to find information across projects and general features
20. **Maintenance**: Keep documentation up-to-date with implementation
21. **Update General Index**: When referencing general features, update their "Used by" lists
22. **Feature Migration**: Move features to general/ when 3rd project adopts them (if minimal config)
23. **Evaluate Before Generalizing**: Don't force generalization if customization requirements are high

## MVP Definition Requirements ⚠️ CRITICAL

**Every project plan MUST include a comprehensive MVP definition.**

### MVP Components (All Required)

1. **Core Problem** - The ONE problem the MVP solves
2. **Core User** - The ONE primary user type
3. **Core Value** - The ONE key benefit
4. **MVP Features** - 3-7 essential features (no more!)
5. **Success Criteria** - Measurable MVP goals
6. **MVP Timeline** - Development + testing duration
7. **MVP Tech Stack** - Technologies for initial version
8. **What's NOT in MVP** - Explicitly list future features

### MVP Definition Template

```markdown
## MVP (Minimum Viable Product) Definition

### Core Problem
[The ONE problem this MVP solves in 1-2 sentences]

### Core User
[The ONE primary user type, e.g., "University physics students"]

### Core Value Proposition
[The ONE key benefit users get, e.g., "Practice physics problems and get instant feedback"]

### MVP Features (Must-Have Only)
1. **[Feature Name]**: [Description]
   - Why in MVP: [Justification]
   - User story: As a [user], I want to [action] so that [benefit]

2. **[Feature Name]**: [Description]
   - Why in MVP: [Justification]
   - User story: As a [user], I want to [action] so that [benefit]

[Continue for 3-7 essential features]

### MVP Success Criteria
- User Adoption: [Metric]
- User Engagement: [Metric]
- Core Functionality: [Metric]
- Technical Stability: [Metric]

### MVP Timeline
- Development: [Duration]
- Testing: [Duration]
- Launch: [Target date]

### MVP Tech Stack
- Frontend: [Framework]
- Backend: [Technology]
- Database: [Database]
- Hosting: [Platform]

### What's NOT in MVP (Future Features)
- [Feature]: [Why it's post-MVP]
- [Feature]: [Why it's post-MVP]
- [Feature]: [Why it's post-MVP]
```

### MVP vs Post-MVP Decision Framework

**In MVP if:**
- ✅ Solves the core problem
- ✅ Essential for core user experience
- ✅ Provides immediate value
- ✅ Simple to implement
- ✅ Low technical risk

**Post-MVP if:**
- ❌ Nice-to-have, not essential
- ❌ Solves secondary problem
- ❌ Complex implementation
- ❌ High technical risk
- ❌ Can be added later without breaking existing features

### Example: Chore Allowance Manager MVP

```markdown
## MVP Definition

### Core Problem
Parents struggle to track chores and manage allowance fairly for their children.

### Core User
Parents with 2-4 children aged 6-14.

### Core Value Proposition
Simple chore tracking and automatic allowance calculation based on completed tasks.

### MVP Features (Must-Have)
1. **Chore Creation**: Parents can create and assign chores to children
   - Why in MVP: Core functionality to solve the problem
   - User story: As a parent, I want to create chores so that I can assign them to my children

2. **Chore Completion Tracking**: Children can mark chores as complete
   - Why in MVP: Essential for allowance calculation
   - User story: As a child, I want to mark chores as complete so that I can earn allowance

3. **Allowance Calculation**: Automatic allowance calculation based on completed chores
   - Why in MVP: Core value proposition
   - User story: As a parent, I want automatic allowance calculation so that I don't have to do math

4. **Simple Dashboard**: View chores and allowance at a glance
   - Why in MVP: Necessary for usability
   - User story: As a parent, I want to see all chores and allowance status so that I can manage my family

### MVP Success Criteria
- User Adoption: 50 families using the app within first month
- User Engagement: 70% of families log in at least 3x per week
- Core Functionality: Parents can set up chores in <5 minutes
- Technical Stability: 99% uptime during first month

### MVP Timeline
- Development: 6 weeks
- Testing: 2 weeks
- Launch: March 1, 2026

### MVP Tech Stack
- Frontend: Angular 18
- Backend: Slim PHP 4
- Database: SQLite
- Hosting: DigitalOcean

### What's NOT in MVP (Future Features)
- Rewards System: Can be added after basic tracking is proven
- Photo Verification: Complex feature, not essential for launch
- Gamification: Nice-to-have, adds complexity
- Multi-Family Management: Solves advanced use case
- Mobile App: Can start with responsive web app
```

## Documentation Rebuild Process

### Step-by-Step Rebuild

1. **Backup Understanding**
   ```
   - Read existing PRD.md completely
   - Extract all requirements
   - Extract all features
   - Extract all technical decisions
   - Note any gaps or unclear areas
   ```

2. **Create New Structure**
   ```
   - Create INDEX.md
   - Create PRD_OVERVIEW.md with extracted info
   - Create ARCHITECTURE.md with technical info
   - Create feature subdirectory if needed
   - Create technical subdirectory if needed
   - Create EXPERTS.md
   ```

3. **Reorganize Content**
   ```
   - Move requirements to appropriate sections
   - Split large content into logical files
   - Ensure nothing is lost
   - Add new sections where gaps exist
   - Expand planning where needed
   ```

4. **Enhance & Complete**
   ```
   - Add missing sections
   - Expand brief areas
   - Add expert perspectives
   - Create cross-references
   - Ensure completeness
   ```

5. **Final Review**
   ```
   - Verify all original content preserved
   - Check file sizes (max 500 lines)
   - Verify navigation works
   - Ensure consistency
   - Update PROJECTS_LIST.md
   ```

---

**End of Command Definition**
