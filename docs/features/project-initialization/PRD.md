# Project Initialization - PRD

**Feature Name**: Project Initialization  
**Type**: Core Feature (part of `@your-org/core` package)  
**Status**: Planning  
**Priority**: P1 (High)  
**Created**: 2026-01-05  
**Package Architecture**: Core Package Feature

## Package Context

Project Initialization is a **core feature** within the `@your-org/core` package. The core package contains:

- **Features**: Port Manager, Project Initialization, Authentication, Database Tools, and more
- **Rules**: Cursor rules, expert personas, user rules
- **Commands**: Cursor commands for common tasks
- **Shared Utilities**: Database abstractions, configuration utilities

This feature automates the setup of new projects by copying rules and commands from the core package and initializing Port Manager.

See [Package Architecture Strategy](../../architecture/PACKAGE_ARCHITECTURE.md) for details.

## Overview

Project Initialization is a core feature in `@your-org/core` that automates the setup of new projects. It automatically copies Cursor rules and commands from the core package to the project's `.cursor/` directory and initializes Port Manager (mandatory).

**Installation**:
```bash
# Install core package (includes Project Initialization and other features)
npm install @your-org/core

# Initialize project (one command does everything)
npx @your-org/core init
```

## Problem Statement

### Current Issues

1. **Manual Setup Required**: Developers must manually copy rules and commands from the core package
2. **Error-Prone Process**: Manual copying can lead to missing files or incorrect paths
3. **Inconsistent Setup**: Different developers may copy different files or versions
4. **Port Manager Not Mandatory**: Port Manager initialization is optional, leading to port conflicts
5. **Multiple Steps**: Setup requires multiple manual steps (install, copy rules, copy commands, init port manager)
6. **Local vs Project Confusion**: Developers may accidentally copy "local" commands meant only for the packages repo

### Pain Points

- **Time Wasted**: Manual setup takes 5-10 minutes per project
- **Setup Errors**: Missing files or incorrect paths cause setup failures
- **Inconsistent Projects**: Different projects have different rules/commands versions
- **Port Conflicts**: Projects without Port Manager cause port conflicts
- **Onboarding Friction**: New developers struggle with manual setup process

## Solution

Project Initialization solves these problems with a single command that:

1. **Automatically Copies Rules**: Copies all expert personas and user rules to `.cursor/rules/`
2. **Automatically Copies Commands**: Copies general commands (excludes local commands for packages repo)
3. **Initializes Port Manager**: Automatically initializes Port Manager (mandatory)
4. **Validates Setup**: Verifies all files were copied correctly
5. **Single Command**: One command (`npx @your-org/core init`) does everything
6. **Smart Filtering**: Automatically excludes "local" commands/rules meant only for the packages repo

## Goals

### Primary Goals

1. **Automate Project Setup**: Eliminate manual copying of rules and commands
2. **Ensure Consistency**: All projects have the same rules and commands
3. **Mandatory Port Manager**: Ensure Port Manager is initialized in all projects
4. **Single Command Setup**: One command initializes everything
5. **Error Prevention**: Prevent setup errors through automation

### Success Metrics

#### Quantitative Metrics

- **Setup Time**: Project setup time reduced from 5-10 minutes to < 30 seconds (target: 95% reduction)
- **Setup Success Rate**: 100% of projects successfully initialized (target: 100%)
- **Port Manager Adoption**: 100% of projects have Port Manager initialized (target: 100%)
- **Consistency Rate**: 100% of projects have identical rules/commands (target: 100%)
- **Error Rate**: Zero setup errors (target: 0%)

#### Qualitative Metrics

- **Developer Experience**: Seamless, one-command project setup
- **Onboarding Time**: Reduced time for new developers to set up projects
- **Error Reduction**: Elimination of setup-related issues
- **Team Consistency**: Uniform project setup across team

## Target Users

### Primary Users

- **Developers**: Setting up new projects
  - **Pain Points**: Manual setup, missing files, inconsistent configurations
  - **Goals**: Fast, automated, consistent project setup
  - **Usage Frequency**: Per new project (weekly/monthly)

- **Team Leads**: Ensuring consistency across team projects
  - **Pain Points**: Different developers using different setups
  - **Goals**: Team-wide consistency, reduced onboarding friction
  - **Usage Frequency**: During team onboarding, project reviews

## User Stories

### Story 1: New Project Setup
**As a** developer  
**I want to** initialize a new project with one command  
**So that** I can start developing immediately without manual setup

**Acceptance Criteria**:
- Single command initializes everything
- Rules and commands are automatically copied
- Port Manager is automatically initialized
- Setup completes in < 30 seconds
- All files are verified after copying

### Story 2: Consistent Project Setup
**As a** team lead  
**I want to** ensure all projects have the same setup  
**So that** team members have consistent development environments

**Acceptance Criteria**:
- All projects have identical rules and commands
- Port Manager is mandatory in all projects
- Setup process is identical for all developers
- No manual steps required

### Story 3: Port Manager Integration
**As a** developer  
**I want** Port Manager to be automatically initialized  
**So that** I don't have to remember to set it up separately

**Acceptance Criteria**:
- Port Manager initialization is automatic
- Port is automatically allocated
- Project files are automatically configured with port
- No separate Port Manager init command needed

## Core Features

### Feature 1: Automatic Rules Copying

**Description**: Automatically copies all expert personas and user rules from the core package to the project's `.cursor/rules/` directory.

**What Gets Copied**:
- All expert personas from `packages/core/rules/experts/` → `.cursor/rules/experts/`
- All user rules from `packages/core/rules/user/` → `.cursor/rules/user/`

**What Gets Excluded**:
- Nothing (all rules are project-usable)

**Implementation**:
- Copy files from `node_modules/@your-org/core/rules/` to `.cursor/rules/`
- Preserve directory structure
- Verify all files were copied successfully
- Handle file conflicts (ask user or overwrite)

### Feature 2: Automatic Commands Copying

**Description**: Automatically copies general commands from the core package to the project's `.cursor/commands/` directory, excluding local commands meant only for the packages repo.

**What Gets Copied**:
- All general commands from `packages/core/commands/general/` → `.cursor/commands/general/`

**What Gets Excluded**:
- **Local commands** from `packages/core/commands/local/` (these are for the packages repo only)
  - `/local/review` - Expert review workflow for packages repo
  - `/local/update-tracker` - Expert reviews tracker for packages repo
  - `/local/expert` - Expert management for packages repo
  - `/local/file` - File management for packages repo
  - `/local/full-review` - Full review workflow for packages repo
  - `/local/sort` - Tracker sorting for packages repo
  - `/local/statistics` - Tracker statistics for packages repo

**Implementation**:
- Copy files from `node_modules/@your-org/core/commands/general/` to `.cursor/commands/general/`
- Skip `node_modules/@your-org/core/commands/local/` directory entirely
- Preserve directory structure
- Verify all files were copied successfully
- Handle file conflicts (ask user or overwrite)

### Feature 3: Mandatory Port Manager Initialization

**Description**: Automatically initializes Port Manager in the project (mandatory, cannot be skipped).

**Implementation**:
- Call Port Manager's `initCommand` automatically
- Detect project name and app type automatically
- Allocate port automatically
- Configure project files with allocated port
- If Port Manager is already initialized, verify it's working

**Options**:
- `--skip-port-manager`: Skip Port Manager initialization (not recommended, but available for edge cases)
- Default: Port Manager is always initialized

### Feature 4: Setup Validation

**Description**: Validates that all files were copied correctly and Port Manager is initialized.

**Checks**:
- All expert personas exist in `.cursor/rules/experts/`
- All user rules exist in `.cursor/rules/user/`
- All general commands exist in `.cursor/commands/general/`
- No local commands were copied
- Port Manager is initialized and working
- Port is allocated and configured

**Error Handling**:
- Report missing files
- Report incorrectly copied files
- Report Port Manager initialization failures
- Provide clear error messages with solutions

### Feature 5: Conflict Resolution

**Description**: Handles conflicts when files already exist in the project.

**Strategies**:
1. **Skip Existing**: Skip files that already exist (default)
2. **Overwrite**: Overwrite existing files with core package versions
3. **Interactive**: Ask user for each conflict

**Options**:
- `--overwrite`: Overwrite existing files
- `--skip-existing`: Skip existing files (default)
- `--interactive`: Ask user for each conflict

## Technical Architecture

### Command Structure

```bash
npx @your-org/core init [options]
```

### Options

- `--project-name <name>`: Specify project name (auto-detected if not provided)
- `--app-type <type>`: Specify app type (auto-detected if not provided)
- `--overwrite`: Overwrite existing files
- `--skip-existing`: Skip existing files (default)
- `--interactive`: Ask user for each conflict
- `--skip-port-manager`: Skip Port Manager initialization (not recommended)
- `--skip-rules`: Skip copying rules
- `--skip-commands`: Skip copying commands
- `--dry-run`: Show what would be done without making changes

### Implementation Structure

```
packages/core/src/features/project-initialization/
├── project-initializer.ts      # Main initialization logic
├── rules-copier.ts             # Rules copying logic
├── commands-copier.ts          # Commands copying logic
├── setup-validator.ts          # Setup validation logic
├── conflict-resolver.ts        # Conflict resolution logic
└── cli/
    └── commands/
        └── init.ts             # CLI command implementation
```

### Data Flow

```
User runs: npx @your-org/core init
    ↓
CLI Command (init.ts)
    ↓
Project Initializer
    ├── Rules Copier → Copy rules to .cursor/rules/
    ├── Commands Copier → Copy commands to .cursor/commands/
    ├── Port Manager Init → Initialize Port Manager
    └── Setup Validator → Validate setup
    ↓
Report Results
```

## Usage Examples

### Basic Usage

```bash
# Install core package
npm install @your-org/core

# Initialize project (one command does everything)
npx @your-org/core init
```

**Output**:
```
✓ Copying rules...
  ✓ Copied 26 expert personas
  ✓ Copied 3 user rules
✓ Copying commands...
  ✓ Copied 0 general commands (none available)
  ✓ Skipped 7 local commands (packages repo only)
✓ Initializing Port Manager...
  ✓ Detected project: my-new-project
  ✓ Detected app type: nextjs
  ✓ Allocated port: 3000
  ✓ Configured project files
✓ Validating setup...
  ✓ All rules copied successfully
  ✓ All commands copied successfully
  ✓ Port Manager initialized successfully

✅ Project initialized successfully!
```

### With Options

```bash
# Overwrite existing files
npx @your-org/core init --overwrite

# Skip Port Manager (not recommended)
npx @your-org/core init --skip-port-manager

# Dry run (see what would be done)
npx @your-org/core init --dry-run
```

## Integration with Port Manager

Project Initialization integrates with Port Manager by:

1. **Automatic Initialization**: Calls Port Manager's `initCommand` automatically
2. **Mandatory Requirement**: Port Manager initialization cannot be skipped (unless `--skip-port-manager` is used)
3. **Error Handling**: If Port Manager initialization fails, project initialization fails
4. **Validation**: Verifies Port Manager is working after initialization

## Error Handling

### File Copy Errors

- **Missing Source Files**: Report error, suggest reinstalling core package
- **Permission Errors**: Report error, suggest checking file permissions
- **Disk Space Errors**: Report error, suggest freeing disk space

### Port Manager Errors

- **Database Connection Errors**: Report error, suggest checking database configuration
- **Port Allocation Errors**: Report error, suggest manual port allocation
- **Configuration Errors**: Report error, suggest manual configuration

### Validation Errors

- **Missing Files**: Report which files are missing, suggest re-running init
- **Incorrect Files**: Report which files are incorrect, suggest checking core package version

## Future Enhancements

### Phase 2: Template Support

- Support project templates
- Initialize project structure from templates
- Configure project-specific settings

### Phase 3: Update Mechanism

- Update existing projects with new rules/commands
- Version management for rules/commands
- Migration support for breaking changes

### Phase 4: Customization

- Allow projects to customize which rules/commands to copy
- Support project-specific rule/command additions
- Configuration file for initialization options

## Dependencies

- **Port Manager**: Required (mandatory initialization)
- **fs-extra**: For file operations
- **chalk**: For colored output
- **inquirer**: For interactive prompts (if interactive mode)

## Testing Strategy

### Unit Tests

- Test rules copying logic
- Test commands copying logic
- Test conflict resolution
- Test validation logic

### Integration Tests

- Test full initialization flow
- Test Port Manager integration
- Test error handling
- Test conflict resolution strategies

### E2E Tests

- Test initialization in real project
- Test with different project types
- Test with existing files
- Test error scenarios

## Documentation

### User Documentation

- Getting started guide
- Command reference
- Troubleshooting guide
- Examples and use cases

### Developer Documentation

- Architecture documentation
- API documentation
- Contributing guide
- Testing guide

## Success Criteria

### Must Have

- ✅ Automatically copy rules to `.cursor/rules/`
- ✅ Automatically copy general commands to `.cursor/commands/`
- ✅ Exclude local commands (packages repo only)
- ✅ Automatically initialize Port Manager (mandatory)
- ✅ Validate setup after initialization
- ✅ Handle file conflicts
- ✅ Single command setup

### Should Have

- ⏳ Interactive conflict resolution
- ⏳ Dry run mode
- ⏳ Detailed progress output
- ⏳ Error recovery suggestions

### Nice to Have

- ⏳ Update mechanism for existing projects
- ⏳ Customization options
- ⏳ Template support

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive PRD for Project Initialization feature that automates project setup by copying rules and commands from core package and initializing Port Manager. This feature eliminates manual setup steps, ensures consistency across projects, and makes Port Manager initialization mandatory. The PRD includes detailed problem statement, solution design, technical architecture, usage examples, error handling, and success criteria. Key features: automatic rules copying (all expert personas and user rules), automatic commands copying (general commands only, excludes local commands for packages repo), mandatory Port Manager initialization, setup validation, and conflict resolution strategies.

---
