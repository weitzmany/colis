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
4. **Configures IDE Colors**: Sets up unique project colors with branch-based themes (automatic)
5. **Initializes Git Workflow**: Automatically sets up git configuration, hooks, templates (mandatory)
6. **Validates Setup**: Verifies all files were copied correctly
7. **Single Command**: One command (`npx @your-org/core init`) does everything
8. **Smart Filtering**: Automatically excludes "local" commands/rules meant only for the packages repo
9. **Lifecycle Management**: Provides ongoing verify, repair, and update capabilities

## Goals

### Primary Goals

1. **Automate Project Setup**: Eliminate manual copying of rules and commands
2. **Ensure Consistency**: All projects have the same rules, commands, and git workflows
3. **Mandatory Port Manager**: Ensure Port Manager is initialized in all projects
4. **Mandatory Git Workflow**: Ensure standardized git configuration in all projects
5. **Visual Project Distinction**: Provide unique IDE colors per project with branch-based themes
6. **Single Command Setup**: One command initializes everything
7. **Lifecycle Management**: Provide ongoing verify, repair, and update capabilities
8. **Error Prevention**: Prevent setup errors through automation

### Success Metrics

#### Quantitative Metrics

- **Setup Time**: Project setup time reduced from 5-10 minutes to < 30 seconds (target: 95% reduction)
- **Setup Success Rate**: 100% of projects successfully initialized (target: 100%)
- **Port Manager Adoption**: 100% of projects have Port Manager initialized (target: 100%)
- **IDE Color Adoption**: 100% of projects have IDE colors configured (target: 100%)
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

### Story 4: IDE Color Configuration
**As a** developer  
**I want** unique IDE colors for each project that change based on branch  
**So that** I can visually distinguish projects and know which branch I'm on

**Acceptance Criteria**:
- Each project gets a unique KEY_COLOR generated automatically
- Colors change automatically when switching git branches
- Main branch shows RED, dev branch shows ORANGE, feature branches show project color
- Colors are configured automatically during initialization
- Settings file is ignored by git to prevent conflicts

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

### Feature 4: IDE Color Manager

**Description**: Automatically configures unique IDE colors for each project with branch-based color themes. Generates a unique KEY_COLOR for each project and creates a git hook that updates IDE colors based on the current git branch.

**What Gets Configured**:
- **Unique Project KEY_COLOR**: Generated from project name using curated color palette
- **Post-Checkout Git Hook**: `.githooks/post-checkout` hook that updates colors on branch switch
- **VS Code Settings**: `.vscode/settings.json` with branch-specific color scheme
- **Git Configuration**: Git hooks path set to `.githooks`, `settings.json` added to `.gitignore`

**Color Scheme by Branch**:
- **Main/Master Branch**: 🔴 RED (`#ed3535`) - Production/main branch indicator
- **Development/Dev Branch**: 🟠 ORANGE (`#FF8C00`) - Development branch indicator
- **Other Branches**: 🎨 Project KEY_COLOR - Unique color per project for feature branches

**Color Generation Algorithm**:
1. **Project Name Hash**: Uses DJB2 hash algorithm for deterministic color generation
2. **Base Palette Selection**: Selects from curated 70's inspired color palette (9 colors)
3. **Hue Adjustment**: Applies -30 to +30 degree hue shift for uniqueness
4. **Saturation Adjustment**: Adjusts saturation by -15% to +15% for variation
5. **Uniqueness Check**: Ensures minimum color distance (30 units) from other project colors

**Base Color Palette**:
- Light Gray (`#DBDCE0`), Light Blue (`#8AB4F9`), Coral (`#F38B82`)
- Yellow (`#FDD664`), Green (`#80CA95`), Pink (`#FF8BCC`)
- Purple (`#C58AFA`), Cyan (`#78D9ED`), Orange (`#FCAD70`)

**Generated Color Palette**:
Each project gets a complete color palette derived from KEY_COLOR:
- `keyColor`: Unique project color
- `mainColor`: Dark text color for main branch (`#0b0b0b`)
- `mainBg`: Red background for main branch (`#ed3535`)
- `mainInactive`: Inactive state for main branch (`#ec7272cc`)
- `devColor`: Dark text color for dev branch (`#0b0b0b`)
- `devBg`: Orange background for dev branch (`#FF8C00`)
- `devInactive`: Inactive state for dev branch (`#FFA500cc`)
- `projectColor`: Darkened KEY_COLOR for text (70% darker)
- `projectBg`: KEY_COLOR for project branches
- `projectInactive`: KEY_COLOR with transparency (`cc` alpha)
- `border`: Lightened KEY_COLOR (15% lighter)
- `darkerBg`: Darkened KEY_COLOR (85% darker)
- `darkBg`: Darkened KEY_COLOR (90% darker)
- `activeColor`: White for contrast (`#ffffff`)

**IDE UI Elements Styled**:
- Title bar (active/inactive) - Uses branch color
- Status bar - Uses branch color
- Activity bar - Dark background with branch color accent
- Sidebar - Dark background with branch color border
- Editor borders - Branch color border
- Panel borders - Branch color border
- Focus border - Branch color
- Active tab border - Branch color
- Tab text - White for contrast

**Implementation**:
- Generate KEY_COLOR using `generateKeyColor(projectName)` function
- Generate complete color palette using `generateColorPalette(projectName, keyColor)` function
- Create `.githooks/post-checkout` hook with color variables
- Configure git hooks path: `git config core.hooksPath .githooks`
- Ensure `.vscode/settings.json` is in `.gitignore`
- Remove `settings.json` from git tracking if previously tracked
- Initialize `settings.json` with current branch colors
- Hook runs automatically on `git checkout` to update colors

**Options**:
- `--skip-colors`: Skip IDE color setup (default: colors are set up)
- Default: IDE colors are always configured during initialization

**Important Notes**:
- **Colors are only assigned during initialization** - Existing projects keep their current colors
- Colors update automatically when switching git branches via post-checkout hook
- Settings file is ignored by git to prevent conflicts
- Each project gets a unique color to visually distinguish projects

**See Also**:
- [IDE Colors Usage Guide](../../guides/IDE_COLORS_USAGE.md) - User guide for IDE colors
- [IDE Colors Reference](../../reference/IDE_COLORS_REFERENCE.md) - Complete color reference

### Feature 5: Git Workflow Initialization

**Description**: Automatically initializes git workflow using the `@your-org/git-workflow` package (mandatory).

**What Gets Configured**:
- **Git Repository**: Initializes git repository if not already initialized
- **Git Hooks**: Installs standardized hooks (pre-commit, commit-msg, pre-push, post-checkout, post-merge)
- **Commit Template**: Sets up `.gitmessage` with conventional commits format
- **PR Templates**: Creates `.github/PULL_REQUEST_TEMPLATE.md`
- **Issue Templates**: Creates bug report, feature request templates in `.github/ISSUE_TEMPLATE/`
- **`.gitignore`**: Copies appropriate `.gitignore` based on project type (nodejs, python, go, etc.)
- **`.gitattributes`**: Configures line endings, binary files, diff settings
- **Git Config**: Configures commit template path, default branch, etc.
- **GitHub CLI (`gh`)**: Installs if missing and validates authentication
- **Issue Routing**: Configures packages repo mapping for standardized issue workflows
- **Remote Repo**: Creates GitHub repo if missing and configures `origin`
- **Contributor Attribution**: Registers expert mailbox and configures git user.name/user.email

**Integration with Git Workflow Package**:
Core consumes the `@your-org/git-workflow` package for:
- Asset copying (hooks, templates, configs)
- Git initialization and configuration
- Project type detection for appropriate `.gitignore`
- Hook installation and permission setup
- GitHub CLI installation and authentication checks
- Packages repo issue workflows (open/read)
- Expert mailbox registration and attribution mapping

**Implementation**:
```typescript
import { GitWorkflow } from '@your-org/git-workflow';

// During project initialization
await GitWorkflow.init({
  projectRoot: process.cwd(),
  projectType: detectProjectType(), // 'nodejs', 'python', 'go', etc.
  options: {
    hooksEnabled: ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'],
    commitTemplate: true,
    prTemplate: true,
    issueTemplates: true
  }
});
```

**Options**:
- `--skip-git`: Skip git workflow initialization (not recommended)
- `--skip-gh`: Skip GitHub CLI installation/auth checks (not recommended)
- `--skip-remote`: Skip GitHub repo creation (not recommended)
- `--git-hooks <list>`: Specify which hooks to enable (default: all)
- Default: Git workflow is always initialized

**See Also**:
- [Git Workflow Package PRD](../git-workflow/PRD.md) - Complete git workflow specification

### Feature 6: Setup Validation

**Description**: Validates that all files were copied correctly, Port Manager is initialized, and Git Workflow is configured.

**Checks**:
- All expert personas exist in `.cursor/rules/experts/`
- All user rules exist in `.cursor/rules/user/`
- All general commands exist in `.cursor/commands/general/`
- No local commands were copied
- Port Manager is initialized and working
- Port is allocated and configured
- IDE color hook (`.githooks/post-checkout`) exists and is executable
- Git hooks path is configured correctly
- `.vscode/settings.json` is in `.gitignore`
- Color settings are initialized in `settings.json`
- Git repository is initialized
- Git hooks are installed and executable
- Commit template is configured
- `.gitignore` and `.gitattributes` exist
- PR and issue templates exist
- GitHub CLI (`gh`) is installed and authenticated
- Packages repo issue access verified (can list/view issues)
- GitHub remote repository exists and `origin` is configured
- Expert mailbox mapped and git user.name/user.email configured

**Error Handling**:
- Report missing files
- Report incorrectly copied files
- Report Port Manager initialization failures
- Report Git Workflow initialization failures
- Report GitHub CLI installation/auth failures
- Provide clear error messages with solutions

### Feature 6: Conflict Resolution

**Description**: Handles conflicts when files already exist in the project.

**Strategies**:
1. **Skip Existing**: Skip files that already exist (default)
2. **Overwrite**: Overwrite existing files with core package versions
3. **Interactive**: Ask user for each conflict

**Options**:
- `--overwrite`: Overwrite existing files
- `--skip-existing`: Skip existing files (default)
- `--interactive`: Ask user for each conflict

## Lifecycle Management

Beyond initial project setup, Project Initialization provides ongoing lifecycle management through verify, repair, and update commands.

### Feature 7: Project Health Check (`verify`)

**Description**: Verifies the health of project configuration, including rules, commands, Port Manager, IDE colors, and Git Workflow.

**What It Checks**:
- **Rules & Commands**: All expected files present and up-to-date
- **Port Manager**: Port allocated, database healthy, no conflicts
- **IDE Colors**: Hook exists, settings configured correctly
- **Git Workflow**: Repository initialized, hooks working, templates configured
- **Issue Access**: `gh` can list/view issues in the packages repo
- **Remote Repo**: `origin` points to existing GitHub repo
- **Contributor Attribution**: git user.name/user.email matches expert mapping

**Implementation**:
```typescript
// Core verify command
async function verifyProject() {
  const results = {
    rules: await verifyRulesAndCommands(),
    portManager: await PortManager.verify(),
    ideColors: await verifyIDEColors(),
    gitWorkflow: await GitWorkflow.verify({ projectRoot: process.cwd() })
  };
  
  return generateHealthReport(results);
}
```

**Usage**:
```bash
npx @your-org/core verify
```

**Output Example**:
```
Project Health Check
====================
✓ Rules and commands: Healthy
✓ Port Manager: Healthy (port 3000)
⚠ IDE Colors: Warning (settings.json outdated)
✗ Git Workflow: Error (pre-commit hook missing)

Issues Found:
- IDE Colors: settings.json doesn't match latest color scheme
- Git Workflow: pre-commit hook is missing or not executable

Recommendations:
- Run 'npx @your-org/core repair' to fix issues automatically
```

### Feature 8: Automated Repairs (`repair`)

**Description**: Automatically repairs common project configuration issues detected by the verify command.

**What It Repairs**:
- **Missing Files**: Restore missing rules, commands, hooks, templates
- **Broken Hooks**: Fix permissions, restore content
- **Port Conflicts**: Reallocate ports if conflicts detected
- **Outdated Configs**: Update configurations to latest standards
- **Git Issues**: Fix git configuration, hook permissions, template paths

**Implementation**:
```typescript
// Core repair command
async function repairProject() {
  const health = await verifyProject();
  
  const results = {
    rules: await repairRulesAndCommands(health.rules.issues),
    portManager: await PortManager.repair(health.portManager.issues),
    ideColors: await repairIDEColors(health.ideColors.issues),
    gitWorkflow: await GitWorkflow.repair({
      projectRoot: process.cwd(),
      issues: health.gitWorkflow.issues
    })
  };
  
  return generateRepairReport(results);
}
```

**Usage**:
```bash
npx @your-org/core repair
```

**Output Example**:
```
Repairing Project Configuration
================================
✓ Rules and commands: No repairs needed
✓ Port Manager: No repairs needed
✓ IDE Colors: Repaired settings.json
✓ Git Workflow: Restored pre-commit hook

Repairs Completed:
- IDE Colors: Updated settings.json to latest color scheme
- Git Workflow: Restored pre-commit hook with correct permissions

Run 'npx @your-org/core verify' to confirm all issues resolved.
```

### Feature 9: Configuration Updates (`update`)

**Description**: Updates project configuration to the latest core package standards, including rules, commands, and git workflow.

**What It Updates**:
- **Rules & Commands**: Update to latest versions from core
- **Git Workflow**: Update hooks, templates, configs to latest standards
- **IDE Colors**: Update color schemes if new versions available
- **Port Manager**: Update to latest version if schema changes

**Options**:
- `--force`: Force update even if user modifications detected
- `--backup`: Create backups before updating (default: true)
- `--interactive`: Prompt for each update (default: false)
- `--dry-run`: Show what would be updated without making changes

**Implementation**:
```typescript
// Core update command
async function updateProject(options: UpdateOptions) {
  const results = {
    rules: await updateRulesAndCommands(options),
    gitWorkflow: await GitWorkflow.update({
      projectRoot: process.cwd(),
      options
    }),
    ideColors: await updateIDEColors(options),
    portManager: await PortManager.update(options)
  };
  
  return generateUpdateReport(results);
}
```

**Usage**:
```bash
# Update all configurations
npx @your-org/core update

# Dry run to see what would be updated
npx @your-org/core update --dry-run

# Force update with backups
npx @your-org/core update --force --backup

# Interactive mode
npx @your-org/core update --interactive
```

**Output Example**:
```
Updating Project Configuration
===============================
✓ Rules and commands: Updated 3 files
✓ Git Workflow: Updated pre-commit and commit-msg hooks
✓ IDE Colors: No updates available
✓ Port Manager: No updates available

Updates Applied:
- Rules: Updated accessibility_expert.mdc, ui_ux_expert.mdc, security_expert.mdc
- Git Workflow: Updated pre-commit (v1.2 → v1.3), commit-msg (v1.1 → v1.2)

Backups Created:
- .cursor/rules/experts/.backup-2026-01-22/
- .git/hooks/.backup-2026-01-22/

Run 'npx @your-org/core verify' to confirm everything is working.
```

## Technical Architecture

### Command Structure

```bash
# Initialize new project
npx @your-org/core init [options]

# Verify project health
npx @your-org/core verify [options]

# Repair project issues
npx @your-org/core repair [options]

# Update project configuration
npx @your-org/core update [options]
```

### Options

**Init Command**:
- `--project-name <name>`: Specify project name (auto-detected if not provided)
- `--app-type <type>`: Specify app type (auto-detected if not provided)
- `--overwrite`: Overwrite existing files
- `--skip-existing`: Skip existing files (default)
- `--interactive`: Ask user for each conflict
- `--skip-port-manager`: Skip Port Manager initialization (not recommended)
- `--skip-git`: Skip Git Workflow initialization (not recommended)
- `--skip-gh`: Skip GitHub CLI installation/auth checks (not recommended)
- `--skip-colors`: Skip IDE color setup (default: colors are configured)
- `--skip-rules`: Skip copying rules
- `--skip-commands`: Skip copying commands
- `--dry-run`: Show what would be done without making changes

**Verify Command**:
- `--verbose`: Show detailed health check information
- `--json`: Output results as JSON

**Repair Command**:
- `--verbose`: Show detailed repair information
- `--dry-run`: Show what would be repaired without making changes

**Update Command**:
- `--force`: Force update even if user modifications detected
- `--backup`: Create backups before updating (default: true)
- `--interactive`: Prompt for each update
- `--dry-run`: Show what would be updated without making changes
- `--no-backup`: Skip creating backups (not recommended)

### Implementation Structure

```
packages/core/src/features/project-initialization/
├── project-initializer.ts      # Main initialization logic
├── rules-copier.ts             # Rules copying logic
├── commands-copier.ts          # Commands copying logic
├── color-manager.ts            # Color generation and palette management
├── hook-generator.ts           # Git hook generation for color updates
├── setup-validator.ts          # Setup validation logic
├── conflict-resolver.ts        # Conflict resolution logic
└── cli/
    └── commands/
        ├── init.ts             # CLI command implementation
        └── colors.ts           # Colors command for viewing color palettes
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
    ├── Color Manager → Generate KEY_COLOR and color palette
    ├── Hook Generator → Create post-checkout hook for color updates
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
✓ Setting up IDE colors...
  ✓ Generated KEY_COLOR: #81ca95
  ✓ Created post-checkout hook
  ✓ Configured git hooks path
  ✓ Initialized .vscode/settings.json with color scheme
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

# Skip IDE colors
npx @your-org/core init --skip-colors

# Dry run (see what would be done)
npx @your-org/core init --dry-run
```

## Integration with Port Manager

Project Initialization integrates with Port Manager by:

1. **Automatic Initialization**: Calls Port Manager's `initCommand` automatically
2. **Mandatory Requirement**: Port Manager initialization cannot be skipped (unless `--skip-port-manager` is used)
3. **Error Handling**: If Port Manager initialization fails, project initialization fails
4. **Validation**: Verifies Port Manager is working after initialization

## Integration with IDE Color Manager

Project Initialization integrates with IDE Color Manager by:

1. **Automatic Configuration**: Generates unique KEY_COLOR and configures IDE colors automatically
2. **Branch-Based Themes**: Creates git hook that updates colors based on current branch
3. **Project Uniqueness**: Ensures each project gets a unique color from curated palette
4. **Git Integration**: Configures git hooks path and ensures settings file is ignored
5. **Optional Feature**: Can be skipped with `--skip-colors` flag (default: enabled)

**Color Manager Functions**:
- `generateKeyColor(projectName)`: Generates unique KEY_COLOR from project name
- `generateColorPalette(projectName, keyColor?)`: Generates complete color palette
- `ensureUniqueColor(projectName, keyColor, existingColors)`: Ensures color uniqueness across projects

**See Also**:
- [IDE Colors Usage Guide](../../guides/IDE_COLORS_USAGE.md) - Complete user guide
- [IDE Colors Reference](../../reference/IDE_COLORS_REFERENCE.md) - Color reference documentation

## Integration with Git Workflow Package

Project Initialization integrates with Git Workflow Package (`@your-org/git-workflow`) by:

1. **Automatic Initialization**: Calls `GitWorkflow.init()` during project setup
2. **Mandatory Requirement**: Git workflow initialization is mandatory (unless `--skip-git` is used)
3. **Project Type Detection**: Automatically detects project type for appropriate `.gitignore`
4. **Lifecycle Integration**: Provides verify, repair, and update capabilities via Git Workflow APIs
5. **Health Monitoring**: Integrates git workflow health checks into unified project health reporting
6. **Automated Repairs**: Uses Git Workflow repair capabilities for fixing git configuration issues
7. **Version Management**: Coordinates git workflow updates with core package updates

**Git Workflow Functions Used**:
- `GitWorkflow.init(options)`: Initialize git workflow during project setup
- `GitWorkflow.verify(options)`: Check git configuration health
- `GitWorkflow.repair(options)`: Fix git configuration issues
- `GitWorkflow.update(options)`: Update git workflow to latest standards

**See Also**:
- [Git Workflow Package PRD](../git-workflow/PRD.md) - Complete git workflow specification

## Error Handling

### File Copy Errors

- **Missing Source Files**: Report error, suggest reinstalling core package
- **Permission Errors**: Report error, suggest checking file permissions
- **Disk Space Errors**: Report error, suggest freeing disk space

### Port Manager Errors

- **Database Connection Errors**: Report error, suggest checking database configuration
- **Port Allocation Errors**: Report error, suggest manual port allocation
- **Configuration Errors**: Report error, suggest manual configuration

### IDE Color Errors

- **Git Not Initialized**: Colors still configured, will apply when git is initialized
- **Hook Creation Errors**: Report error, suggest checking file permissions
- **Settings File Errors**: Report error, suggest checking `.vscode/` directory permissions
- **Color Generation Errors**: Report error, suggest using `--skip-colors` as workaround

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
- **Git Workflow Package** (`@your-org/git-workflow`): Required (mandatory initialization)
- **GitHub CLI (`gh`)**: Required for PR/issue workflows and repo management
- **Color Manager**: Built-in color generation and palette management
- **fs-extra**: For file operations
- **chalk**: For colored output
- **inquirer**: For interactive prompts (if interactive mode)
- **simple-git**: For git operations

## Testing Strategy

### Unit Tests

- Test rules copying logic
- Test commands copying logic
- Test color generation (KEY_COLOR uniqueness, palette generation)
- Test hook generation (post-checkout hook creation)
- Test conflict resolution
- Test validation logic

### Integration Tests

- Test full initialization flow
- Test Port Manager integration
- Test IDE color configuration and hook creation
- Test branch switching and color updates
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

### Must Have (Initialization)

- ✅ Automatically copy rules to `.cursor/rules/`
- ✅ Automatically copy general commands to `.cursor/commands/`
- ✅ Exclude local commands (packages repo only)
- ✅ Automatically initialize Port Manager (mandatory)
- ✅ Automatically initialize Git Workflow (mandatory)
- ✅ Ensure GitHub CLI (`gh`) is installed and authenticated
- ✅ Automatically configure IDE colors with unique KEY_COLOR
- ✅ Create post-checkout hook for branch-based color updates
- ✅ Validate setup after initialization
- ✅ Handle file conflicts
- ✅ Single command setup
- ✅ Create GitHub repo on init when missing
- ✅ Register expert mailbox and set git author identity

### Must Have (Lifecycle Management)

- ✅ Project health verification (verify command)
- ✅ Automated repairs for common issues (repair command)
- ✅ Configuration updates to latest standards (update command)
- ✅ Git workflow health checks
- ✅ Git workflow repairs (missing/broken hooks, templates)
- ✅ Git workflow updates to latest versions
- ✅ Issue workflow access checks (packages repo)
- ✅ Unified health reporting across all components

### Should Have

- ⏳ Interactive conflict resolution
- ⏳ Dry run mode for all commands
- ⏳ Detailed progress output
- ⏳ Error recovery suggestions
- ⏳ Backup/restore functionality for updates
- ⏳ Interactive update mode (prompt per file)
- ⏳ JSON output format for programmatic use

### Nice to Have

- ⏳ Scheduled automatic health checks
- ⏳ Customization options for workflows
- ⏳ Template support for different project types
- ⏳ Plugin system for extending lifecycle management
- ⏳ Dashboard for visualizing project health trends

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive PRD for Project Initialization feature that automates project setup by copying rules and commands from core package and initializing Port Manager. This feature eliminates manual setup steps, ensures consistency across projects, and makes Port Manager initialization mandatory. The PRD includes detailed problem statement, solution design, technical architecture, usage examples, error handling, and success criteria. Key features: automatic rules copying (all expert personas and user rules), automatic commands copying (general commands only, excludes local commands for packages repo), mandatory Port Manager initialization, setup validation, and conflict resolution strategies.

**Expert**: Documentation Expert  
**Date**: 2026-01-05  
**Changes**: Added comprehensive IDE Color Manager documentation to Project Initialization PRD. Added Feature 4: IDE Color Manager section covering color generation algorithm, base color palette, generated color palette structure, IDE UI elements styled, implementation details, options, and important notes. Updated overview, solution, goals, success metrics, user stories, technical architecture, usage examples, integration sections, error handling, dependencies, testing strategy, and success criteria to include IDE color management. Added references to IDE Colors Usage Guide and IDE Colors Reference documentation. This ensures the PRD comprehensively documents the complete project initialization feature including IDE color configuration.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Extended Project Initialization PRD to include Git Workflow integration and full lifecycle management capabilities. Added Feature 5: Git Workflow Initialization (mandatory git setup via @your-org/git-workflow package), updated Feature 6: Setup Validation to include git checks, and added comprehensive Lifecycle Management section with Feature 7: Project Health Check (verify command), Feature 8: Automated Repairs (repair command), and Feature 9: Configuration Updates (update command). Updated command structure to include verify/repair/update commands, expanded options for all commands, added git workflow integration documentation, updated dependencies to include git-workflow package, and revised success criteria to include lifecycle management must-haves. This extends Project Initialization from one-time setup to ongoing project configuration management, providing health monitoring, automated repairs, and configuration updates for rules, commands, Port Manager, IDE colors, and Git Workflow.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added GitHub CLI (`gh`) management to Project Initialization. Updated Git Workflow initialization to install and authenticate `gh`, expanded setup validation to verify `gh` readiness, added `--skip-gh` option, and updated dependencies and success criteria to require gh installation/authentication for standardized PR/issue workflows.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added packages repo issue workflow support to Project Initialization. Updated Git Workflow initialization to include issue routing, expanded setup validation and health checks to verify issue access via `gh`, and updated lifecycle success criteria to include packages repo issue checks.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added GitHub repo creation during init. Updated Git Workflow initialization to create a remote repo when missing and configure `origin`, added `--skip-remote` option, expanded setup validation and health checks to verify remote repo existence, and updated success criteria to include repo creation on init.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added expert mailbox registration for contributor attribution. Updated Git Workflow initialization to register expert mailbox mapping and configure git author identity, expanded setup validation and health checks to verify mapping and attribution, and updated success criteria to require author identity setup.

---
