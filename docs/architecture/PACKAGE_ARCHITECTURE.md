# Package Architecture Strategy

This document defines the package architecture strategy for organizing all packages in this monorepo.

**Last Updated**: 2026-01-05  
**Status**: Planning

## Overview

The package architecture follows a **core + feature packages** model where:

1. **Core Package** (`@your-org/core`) - Contains foundational features, rules, experts, and commands
2. **Feature Packages** - Specialized packages that depend on core (e.g., `@your-org/task-manager`)

## Repository Strategy Decision (Projects)

**Context**: Small team (1–3 devs), mixed needs across frontend/backend/mobile, and a desire for consistent tooling and onboarding.

**Decision**: Use a **monorepo with clear app boundaries** as the default for new projects.

**Rationale**:
- Fast onboarding and one-command setup
- Shared tooling and consistent workflows
- Easier cross-cutting changes and dependency management
- Keeps optionality to split later if parts diverge

**Boundaries**:
- Separate app folders (e.g., `apps/frontend`, `apps/backend`, `apps/mobile`)
- Shared packages/utilities in `packages/`
- Independent build/deploy pipelines per app when needed

**Split Criteria (Revisit to multi-repo)**:
- Independent release cadence becomes a blocker
- Ownership splits into separate teams
- Security/compliance boundaries require isolation
- Tooling and dependency graphs become too complex in monorepo

## Architecture Model

### Core Package Structure

The core package (`@your-org/core`) is the foundation that contains:

```
@your-org/core/
├── features/              # Core features
│   ├── port-manager/      # Port management feature
│   ├── auth/              # Authentication feature (future)
│   ├── database/          # Database tools feature (future)
│   └── ...
├── rules/                 # Cursor rules
│   ├── experts/           # Expert personas
│   ├── user/              # User rules
│   └── ...
├── commands/              # Cursor commands
│   ├── local/             # Local commands
│   ├── general/           # General commands
│   └── ...
├── shared/                # Shared utilities
│   ├── database/          # Database abstractions
│   ├── config/            # Configuration utilities
│   └── ...
└── package.json
```

### Feature Packages Structure

Feature packages depend on core and extend its functionality:

```
@your-org/task-manager/
├── src/
│   ├── features/          # Task manager features
│   └── ...
├── package.json           # Depends on @your-org/core
└── README.md
```

## Package Dependencies

### Dependency Graph

```
@your-org/core
  ├── (no dependencies on other packages)
  └── Contains: features, rules, experts, commands

@your-org/task-manager
  └── Depends on: @your-org/core

@your-org/other-package
  └── Depends on: @your-org/core
```

### Core Package Responsibilities

**Core Package Provides**:
1. **Features**: Reusable features like port manager, authentication, database tools
2. **Rules**: Cursor rules, expert personas, user rules
3. **Commands**: Cursor commands for common tasks
4. **Shared Utilities**: Database abstractions, configuration utilities, common helpers
5. **Infrastructure**: Common infrastructure code used by all packages

**Core Package Does NOT**:
- Depend on other packages in this monorepo
- Contain application-specific logic
- Include business logic for specific domains

### Feature Package Responsibilities

**Feature Packages Provide**:
1. **Specialized Features**: Domain-specific functionality (e.g., task management)
2. **Extended Functionality**: Features that build on core capabilities
3. **Domain Logic**: Business logic for specific domains

**Feature Packages**:
- **MUST** depend on `@your-org/core`
- **CAN** depend on other feature packages if needed
- **SHOULD** use core's shared utilities and infrastructure

## Core Package Features

### Current Features

1. **Port Manager** (`features/port-manager/`)
   - Port assignment and conflict management
   - Framework integration
   - Database-backed registry

### Planned Features

2. **Authentication** (`features/auth/`)
   - Authentication utilities
   - Token management
   - User session handling

3. **Database Tools** (`features/database/`)
   - Migration tools
   - Query builders
   - Database utilities

4. **More Features** (as needed)
   - Additional core features will be added over time

## Package Installation Model

### Installing Core Package

```bash
npm install @your-org/core
```

**What You Get**:
- All core features (port manager, auth, database tools, etc.)
- All Cursor rules and experts
- All Cursor commands
- Shared utilities and infrastructure

### Installing Feature Packages

```bash
npm install @your-org/task-manager
```

**What You Get**:
- Task manager functionality
- Automatically includes `@your-org/core` as dependency
- Access to all core features, rules, commands

### Using Features

**From Core Package**:
```typescript
import { PortManager } from '@your-org/core/features/port-manager';
import { AuthManager } from '@your-org/core/features/auth';
```

**From Feature Packages**:
```typescript
import { TaskManager } from '@your-org/task-manager';
// Core features still available via core dependency
import { PortManager } from '@your-org/core/features/port-manager';
```

## Package Structure Details

### Core Package Structure

```
@your-org/core/
├── package.json
├── README.md
├── src/
│   ├── features/
│   │   ├── port-manager/
│   │   │   ├── index.ts
│   │   │   ├── registry.ts
│   │   │   ├── allocator.ts
│   │   │   └── ...
│   │   ├── auth/
│   │   │   └── ...
│   │   └── ...
│   ├── shared/
│   │   ├── database/
│   │   │   ├── repository.ts
│   │   │   ├── sqlite.ts
│   │   │   └── mysql.ts
│   │   ├── config/
│   │   │   └── ...
│   │   └── ...
│   └── index.ts
├── rules/
│   ├── experts/
│   │   └── ...
│   ├── user/
│   │   └── ...
│   └── ...
└── commands/
    ├── local/
    │   └── ...
    └── general/
        └── ...
```

### Feature Package Structure

```
@your-org/task-manager/
├── package.json
├── README.md
├── src/
│   ├── features/
│   │   └── task-management/
│   │       ├── index.ts
│   │       ├── task.ts
│   │       └── ...
│   └── index.ts
└── ...
```

## Package.json Structure

### Core Package.json

```json
{
  "name": "@your-org/core",
  "version": "1.0.0",
  "description": "Core package with features, rules, experts, and commands",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./features/port-manager": "./dist/features/port-manager/index.js",
    "./features/auth": "./dist/features/auth/index.js",
    "./rules": "./rules",
    "./commands": "./commands"
  },
  "files": [
    "dist",
    "rules",
    "commands",
    "README.md"
  ]
}
```

### Feature Package.json

```json
{
  "name": "@your-org/task-manager",
  "version": "1.0.0",
  "description": "Task management package",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@your-org/core": "^1.0.0"
  }
}
```

## Development Workflow

### Adding a New Feature to Core

1. Create feature directory: `src/features/new-feature/`
2. Implement feature code
3. Export from core: Add to `src/index.ts` and `package.json` exports
4. Update documentation
5. Version and publish

### Creating a New Feature Package

1. Create new package directory: `packages/task-manager/`
2. Set up package structure
3. Add dependency on `@your-org/core`
4. Implement feature package code
5. Update monorepo configuration
6. Version and publish

## Versioning Strategy

### Core Package Versioning

- **Major version**: Breaking changes to core API or shared utilities
- **Minor version**: New features added to core
- **Patch version**: Bug fixes, improvements

### Feature Package Versioning

- **Major version**: Breaking changes
- **Minor version**: New features
- **Patch version**: Bug fixes

### Synchronized Versioning (Optional)

- All packages can share the same version number
- Easier to track and manage
- Simpler for users (one version to track)

## Distribution Strategy

### npm Package Distribution

**Core Package**:
```bash
npm publish @your-org/core
```

**Feature Packages**:
```bash
npm publish @your-org/task-manager
```

### Installation

**Core Only**:
```bash
npm install @your-org/core
```

**Core + Feature Package**:
```bash
npm install @your-org/core @your-org/task-manager
# Or just:
npm install @your-org/task-manager  # Core included as dependency
```

## Benefits of This Architecture

### 1. Clear Separation of Concerns

- **Core**: Foundational features and infrastructure
- **Feature Packages**: Specialized, domain-specific functionality

### 2. Reusability

- Core features can be used by multiple feature packages
- Shared utilities reduce duplication
- Consistent patterns across packages

### 3. Maintainability

- Single source of truth for core functionality
- Easy to update core and benefit all packages
- Clear dependency graph

### 4. Scalability

- Easy to add new features to core
- Easy to create new feature packages
- Flexible architecture for growth

### 5. Developer Experience

- Simple installation (one package or multiple)
- Clear API boundaries
- Consistent patterns

## Migration Path

### Current State

- Port Manager PRD exists as standalone package concept
- Rules, experts, commands exist in `.cursor/` directory

### Target State

- Port Manager becomes a feature in `@your-org/core`
- Rules, experts, commands included in `@your-org/core`
- Feature packages depend on core

### Migration Steps

1. **Create Core Package Structure**
   - Set up `@your-org/core` package
   - Create `features/port-manager/` directory
   - Move rules, experts, commands to core

2. **Migrate Port Manager**
   - Move port manager code to `core/features/port-manager/`
   - Update exports and imports
   - Update documentation

3. **Create Feature Packages**
   - Set up `@your-org/task-manager` package
   - Add dependency on core
   - Implement task manager features

4. **Update Documentation**
   - Update all PRDs to reflect core package structure
   - Update installation instructions
   - Update usage examples

## Future Enhancements

1. **Plugin System**: Allow extending core with plugins
2. **Feature Flags**: Enable/disable features at runtime
3. **Lazy Loading**: Load features on demand
4. **Tree Shaking**: Optimize bundle size
5. **Workspace Support**: Better monorepo tooling

---

## Related Documentation

- [Port Manager PRD](../features/port-manager/PRD.md)
- [Project Vision](../guides/PROJECT_VISION.md)
- [Package Organization](../guides/NPM_PACKAGE_ORGANIZATION.md)

