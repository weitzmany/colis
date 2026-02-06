# General/Shared Features - Index

## Overview

This directory contains planning for features shared across multiple projects. These features are planned centrally to avoid duplication and ensure consistency across the project portfolio.

**Purpose**: Maintain single source of truth for features used by 3+ projects, reducing duplication and ensuring consistent implementation.

## Available General Features

### Authentication System
- **[PRD](authentication/PRD.md)**
- **[Architecture](authentication/ARCHITECTURE.md)**
- **Used by**: chore-allowance-manager, vehicle-maintenance-tracker, learning-games-platform, home-maintenance-tracker, financial-goal-saver, habit-tracker, energy-usage-tracker, meal-planner-grocery, ai-logo-generator
- **Status**: Planning (reference implementation: Authentication Center)

## Potential Future General Features

The following features have been identified in various projects as potential candidates for extraction to general features. They will be moved to `general/` when they meet the criteria (3+ projects using them OR architectural override criteria):

### Authentication System
- **Status**: ✅ Extracted to general features (see above)

### Notification System
- **Currently**: Project-specific implementations
- **Potential**: Email notifications, push notifications, SMS alerts, notification preferences
- **Projects Using**: personal-budget-manager, chore-allowance-manager, home-maintenance-tracker, vehicle-maintenance-tracker, pet-care-manager (5 projects)
- **Status**: ⚠️ Candidate for extraction (5 projects use it)
- **Next Steps**: Evaluate if implementation is consistent enough (minimal configuration) to make general

### Mobile App Foundation
- **Currently**: Project-specific React Native implementations
- **Potential**: React Native + Expo setup, offline-first architecture, push notifications
- **Projects Using**: personal-budget-manager, chore-allowance-manager, home-maintenance-tracker, energy-usage-tracker, meal-planner-grocery (5 projects)
- **Status**: ⚠️ Candidate for extraction (5 projects use it)
- **Next Steps**: Evaluate if implementation is consistent enough (minimal configuration) to make general

## How to Use General Features

1. **Check if a general feature already exists** for your need
2. **Evaluate if the general feature works with minimal configuration** for your project (5-10 config options max)
3. **Reference the general feature** in your project's INDEX.md
4. **Update the general feature's "Used by" list**

## When to Create New General Features

### Path A: Standard Criteria (ALL must apply)

1. ✅ **Usage**: Feature will be used by 3+ projects
2. ✅ **Common Infrastructure**: Feature is standard infrastructure (auth, notifications, etc.)
3. ✅ **Project-Agnostic**: Feature has project-agnostic requirements
4. ✅ **Minimal Configuration**: Feature works with 5-10 config options max
5. ✅ **Consistent Behavior**: Feature behaves the same way across projects
6. ✅ **Centralized Benefit**: Feature benefits from centralized planning and consistency

### Path B: Architectural Override (ANY must apply)

1. ✅ **Central Deployment**: Feature is deployed as shared service/microservice
2. ✅ **Security Critical**: Feature requires security updates across all projects together
3. ✅ **Compliance Required**: Feature must maintain consistent compliance standards
4. ✅ **Infrastructure Level**: Feature is infrastructure (logging, monitoring, error tracking)
5. ✅ **Single Source of Truth**: Feature requires centralized data management
6. ✅ **Synchronized Upgrades**: Feature compatibility/security requires synchronized updates

**Note**: Path B features can be highly configured because architectural requirements demand centralization.

## When NOT to Create General Features

**Avoid unless Architectural Override applies:**
- ❌ Feature needs extensive configuration per project
- ❌ Feature requires custom code for each project
- ❌ Feature behavior varies significantly between projects
- ❌ Feature has more configuration than core functionality
- ❌ Feature is really "multiple features" disguised as one
- ❌ "General" version would be more complex than project-specific versions

**Exception**: If feature meets Architectural Override criteria (security-critical, centrally deployed, compliance-required, etc.), create as general even if highly configured.

**Better Solution (when no architectural reason)**: Keep as project-specific features, accept some duplication.

## Feature Migration Process

If a project-specific feature is adopted by 3+ projects:

### Step 1: Check for Architectural Override
Ask: Does this feature meet ANY architectural override criteria?
- ✅ Centrally deployed (microservice, shared backend)?
- ✅ Security-critical (auth, encryption, PII handling)?
- ✅ Compliance-required (audit, GDPR, PCI, HIPAA)?
- ✅ Infrastructure-level (logging, monitoring, observability)?
- ✅ Single source of truth requirement?
- ✅ Must upgrade together for security/compatibility?

**If YES** → Migrate to `general/` regardless of configuration complexity

**If NO** → Proceed to Step 2

### Step 2: Evaluate Configuration Complexity
- ✅ Does it work with minimal configuration across all projects (5-10 options)?
- ✅ Is the core functionality the same in all projects?
- ✅ Would a single implementation serve all projects well?
- ❌ Does each project need significant customization?
- ❌ Are there more than 10 configuration options needed?

### Step 3: Decide

**If Standard Criteria met OR Architectural Override met:**
1. Create feature in `general/[feature-name]/` directory
2. Create `PRD.md` and `ARCHITECTURE.md` for the feature
3. Update all project `INDEX.md` files to reference general feature
4. Add "Used by" list to general feature PRD
5. Document why it's general (Standard Criteria or Architectural Override)
6. Archive old project-specific versions

**If NOT general enough and NO architectural reason:**
- Keep as project-specific features
- Accept duplication (it's better than over-abstraction)
- Document similarities for reference, but don't force generalization

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

## Creating New General Features

When creating a new general feature:

1. **Create Directory**: `general/[feature-name]/`
2. **Create PRD**: `general/[feature-name]/PRD.md`
   - Include "Generality Assessment" section
   - Document why it's general (Standard or Architectural Override)
   - List all projects using the feature
   - Document configuration options
3. **Create Architecture**: `general/[feature-name]/ARCHITECTURE.md`
4. **Update This Index**: Add feature to "Available General Features" list
5. **Update Project INDEX Files**: Reference general feature in project docs
6. **Document Configuration**: Clearly document all configuration options

## Best Practices

1. **Start Project-Specific**: Always start with project-specific implementations
2. **Extract When Validated**: Only extract to general after 3+ projects validate the approach
3. **Minimal Configuration**: Keep configuration options to 5-10 max (unless Architectural Override)
4. **Clear Documentation**: Document usage, configuration, and integration guidelines
5. **Version Control**: Use semantic versioning for general features
6. **Avoid Over-Engineering**: Resist the urge to make everything general
7. **Accept Duplication**: Sometimes duplication is better than abstraction
8. **Architectural Override**: Security, compliance, and central deployment justify complexity

## Feature Lifecycle

1. **Project-Specific**: Feature exists in 1-2 projects
2. **Candidate**: Feature is adopted by 3rd project
3. **Evaluation**: Assess if it meets Standard Criteria OR Architectural Override
4. **Extraction** (if criteria met): Move to general/, create PRD and architecture docs
5. **Adoption**: More projects reference the general feature
6. **Maintenance**: Update general feature as needs evolve
7. **Deprecation** (if needed): Migrate projects away from general feature

## General Feature Template

See any existing general feature for structure, or use this template:

```
general/
└── [feature-name]/
    ├── PRD.md                 # Product requirements
    │   ├── Overview
    │   ├── Generality Assessment (Standard vs Architectural Override)
    │   ├── Projects Using This Feature
    │   ├── Requirements
    │   ├── Project-Specific Customization
    │   └── Implementation Status
    └── ARCHITECTURE.md        # Technical architecture
        ├── System Overview
        ├── Integration Guidelines
        ├── Configuration Options
        └── API/Interface Contracts
```

---

**Last Updated**: 2026-01-25  
**Status**: General Features Active - Authentication System Added  
**Next Steps**: Monitor projects for features meeting extraction criteria (3+ projects OR Architectural Override)
