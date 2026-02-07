# Git Workflow Package - PRD

**Feature Name**: Git Workflow  
**Type**: Asset Package (consumed by `@colis/rig`)  
**Status**: Planning  
**Priority**: P1 (High)  
**Created**: 2026-01-05  
**Last Updated**: 2026-01-22  
**Package Architecture**: Asset Package with Lifecycle Tools

## Package Context

Git Workflow is an **asset package** within the monorepo that provides git hooks, rules, templates, and configuration assets consumed by the `@colis/rig` package for full lifecycle git management in all new projects.

**Architecture Pattern**: Hybrid placement
- **Core package** (`@colis/rig`): Orchestrates initialization and ongoing lifecycle management
- **Git workflow package** (`@your-org/git-workflow`): Provides assets, templates, hooks, and lifecycle tooling

See [Package Architecture Strategy](../../architecture/PACKAGE_ARCHITECTURE.md) for details.

## Package Name

`@your-org/git-workflow`

## Overview

Git Workflow is an asset package that provides standardized git configuration, hooks, rules, templates, and lifecycle management tools for consistent git practices across all new projects. The package is consumed by `@colis/rig` during project initialization and provides ongoing lifecycle management capabilities (verify, repair, update).

**Installation** (via core):
```bash
# Install rig package (includes git workflow integration)
npm install @colis/rig

# Initialize project (automatically sets up git workflow)
npx @colis/rig init
```

## Problem Statement

### Current Issues

1. **Inconsistent Git Setup**: Different projects have different git configurations, hooks, and workflows
2. **Manual Configuration**: Developers must manually configure git hooks, commit templates, branch naming
3. **No Lifecycle Management**: Git configurations become stale, hooks break, no health checks or repairs
4. **Missing Best Practices**: Projects lack standardized commit conventions, branch strategies, PR templates
5. **Setup Friction**: New projects require manual git configuration, slowing onboarding
6. **Drift Over Time**: Git configurations drift from standards without ongoing management
7. **Nested Git Repositories**: Projects may contain nested `.git` directories from subprojects, breaking monorepo structure

### Pain Points

- **Time Wasted**: Manual git setup takes 10-15 minutes per project
- **Inconsistency**: Different projects have different git workflows, causing confusion
- **Broken Hooks**: Git hooks break or become outdated without detection
- **Poor Commit History**: Without commit templates, history is messy and inconsistent
- **No Automation**: Health checks, repairs, and updates are manual processes
- **Hooks Directory Conflict**: Different packages (git-workflow vs commissioning) installing hooks to different locations

## Solution

Git Workflow solves these problems by providing:

1. **Standardized Assets**: Git hooks, templates, rules, and configurations
2. **Monorepo Enforcement**: Automatically removes nested `.git` directories to maintain clean monorepo structure
3. **Hooks Directory Standardization**: Uses `.githooks/` directory (same as @colis/rig) to avoid conflicts
4. **GitHub CLI Management**: Ensure `gh` is installed, configured, and ready to use
5. **Issue Management Integration**: Standardized workflows for opening and tracking issues in the packages repo
6. **Core Integration**: Consumed by core for automatic setup during project initialization
7. **Full Lifecycle Management**: Init, verify, repair, and update capabilities
8. **Health Monitoring**: Detect broken hooks, outdated configs, missing files
9. **Automated Repairs**: Fix common git configuration issues automatically
10. **Update Mechanism**: Keep git configurations current with latest standards

## Goals

### Primary Goals

1. **Standardize Git Practices**: Ensure all projects follow consistent git workflows
2. **Automate Setup**: Eliminate manual git configuration during project initialization
3. **Lifecycle Management**: Provide verify, repair, and update capabilities
4. **Health Monitoring**: Detect and report git configuration issues
5. **GitHub CLI Readiness**: Ensure `gh` is installed and authenticated
6. **Issue Workflow Standardization**: Ensure all projects can open and track issues in the packages repo
7. **Easy Updates**: Enable projects to update to latest git workflow standards

### Success Metrics

#### Quantitative Metrics

- **Setup Time**: Git setup reduced from 10-15 minutes to < 10 seconds (target: 95% reduction)
- **Configuration Consistency**: 100% of projects have standardized git configurations (target: 100%)
- **Hook Health**: 100% of projects have working git hooks (target: 100%)
- **Update Adoption**: 80% of projects update to new standards within 1 month (target: 80%+)
- **GitHub CLI Readiness**: 100% of projects have `gh` installed and authenticated (target: 100%)

#### Qualitative Metrics

- **Developer Experience**: Seamless git setup with zero manual configuration
- **Commit Quality**: Improved commit message quality and consistency
- **Workflow Clarity**: Clear, documented git workflows for all team members
- **Issue Visibility**: Projects can reliably open issues and see maintainer responses
- **Contributor Attribution**: Clear visibility into who authored code and reviews

## Package Type

**Asset Package + Lifecycle Tools**

This package provides:
- **Assets**: Git hooks, templates, rules, configuration files
- **Lifecycle Tools**: CLI tools and programmatic APIs for verify, repair, update operations
- **Integration Points**: Consumed by rig package for orchestration

## Core Components (Assets)

### 1. Git Hooks

**Location**: `assets/hooks/`

**Hooks Provided**:
- `pre-commit`: Linting, type checking, format validation
- `commit-msg`: Commit message validation (conventional commits)
- `pre-push`: Run tests before push
- `post-checkout`: Branch-specific actions (e.g., IDE color updates)
- `post-merge`: Update dependencies, run migrations

**Features**:
- Configurable (enable/disable specific checks)
- Fast (cached results, incremental checks)
- Informative error messages

### 2. Git Templates

**Location**: `assets/templates/`

**Templates Provided**:
- **Commit message template** (`.gitmessage`)
  - Conventional commits format
  - Type options (feat, fix, docs, etc.)
  - Scope guidance
  - Breaking change indicators
  
- **PR template** (`.github/PULL_REQUEST_TEMPLATE.md`)
  - Description sections
  - Checklist (tests, docs, changelog)
  - Related issues linking
  
- **Issue templates** (`.github/ISSUE_TEMPLATE/`)
  - Bug report template
  - Feature request template
  - Documentation improvement template

### 3. GitHub CLI (gh) Management

**Purpose**: Ensure GitHub CLI (`gh`) is installed, authenticated, and ready for standardized workflows.

**Capabilities**:
- Detect whether `gh` is installed
- Install `gh` if missing (platform-aware)
- Validate authentication status (`gh auth status`)
- Configure recommended defaults (e.g., git protocol, browser auth)
- Provide wrapper commands for common workflows (PR create, PR view, issue create)
- Map all projects to the packages repo for standardized issue routing
- Provide standardized commands to open issues in the packages repo
- Provide standardized commands to read maintainer responses in the packages repo
- Create GitHub repositories on init if missing
- Register expert mailboxes with GitHub accounts (link email → username)
- Ensure contributor attribution is consistent across projects

**Assets**:
- `assets/config/gh-defaults.json`: Recommended gh defaults and settings
- `assets/docs/gh-usage.md`: Standard gh usage guidelines for the team
- `assets/config/gh-repo-map.json`: Repo mapping (project → packages repo)
- `assets/docs/gh-issues.md`: Issue workflow guide for packages repo
- `assets/docs/gh-repo-create.md`: Repo creation workflow guide
- `assets/config/experts-map.json`: Expert mailbox → GitHub username mapping
- `assets/docs/experts-github.md`: Expert mailbox registration workflow

### 4. Git Configuration Files

**Location**: `assets/config/`

**Configs Provided**:
- **`.gitignore` templates** (by project type)
  - Node.js projects
  - Python projects
  - Go projects
  - IDE-specific ignores
  
- **`.gitattributes`**
  - Line ending normalization
  - Binary file handling
  - Diff configurations

- **Git config snippets**
  - Author configuration
  - Default branch naming
  - Merge strategies
  - Rebase configurations

### 5. Workflow Rules

**Location**: `assets/rules/`

**Rules Provided**:
- **Branch naming conventions**
  - `main/master` for production
  - `develop/dev` for development
  - `feature/*` for features
  - `fix/*` for bug fixes
  - `hotfix/*` for urgent production fixes
  
- **Commit message standards**
  - Conventional commits format
  - Type and scope requirements
  - Subject line length limits
  - Body and footer formatting
  
- **PR workflow guidelines**
  - Required reviewers
  - Merge strategies
  - Branch protection rules
  - CI/CD requirements

### 6. Documentation

**Location**: `assets/docs/`

**Documentation Provided**:
- **Git workflow guide**: Branch strategies, commit conventions, PR process
- **Hook reference**: What each hook does, how to configure
- **Troubleshooting**: Common issues and solutions
- **Migration guide**: Updating from old workflows
- **Issue workflow guide**: How to open and track issues in the packages repo

## Lifecycle Management Tools

### 1. Initialize (`init`)

**Purpose**: Set up git workflow in a new project

**What it does**:
- **Enforce monorepo structure**: Scan for and remove any nested `.git` directories (not in project root)
- **Install git hooks to `.githooks/`**: Uses `.githooks/` directory (same as @colis/rig) to avoid conflicts
  - Skips existing hooks (preserves @colis/rig's post-checkout hook)
  - Installs: pre-commit, commit-msg, pre-push
- **Configure git hooks path**: Sets `git config core.hooksPath .githooks`
- Copy templates to `.github/`
- Create `.gitmessage` commit template
- Configure git to use commit template
- Set up `.gitignore` and `.gitattributes`
- Initialize git repository if not already initialized
- Ensure `gh` is installed (install if missing)
- Validate `gh` authentication status
- Apply recommended `gh` defaults (git protocol, browser auth)
- Create GitHub repo if missing (name derived from project)
- Configure `origin` remote to the created repo
- Register expert mailboxes and configure git user.name/user.email

**Usage** (via core):
```typescript
import { GitWorkflow } from '@your-org/git-workflow';

await GitWorkflow.init({
  projectRoot: '/path/to/project',
  projectType: 'nodejs', // or 'python', 'go', etc.
  options: {
    hooksEnabled: ['pre-commit', 'commit-msg', 'pre-push'],
    commitTemplate: true,
    prTemplate: true,
    createRemoteRepo: true
  }
});
```

### 2. Verify (`verify`)

**Purpose**: Check git configuration health

**What it checks**:
- Git repository initialized
- Hooks exist and are executable
- Hooks match package versions (not outdated/modified)
- Commit template configured
- `.gitignore` and `.gitattributes` exist
- Git config settings are correct
- `gh` installed and available on PATH
- `gh auth status` is healthy (authenticated)
- Expert mailbox mapped to GitHub username
- Git user.name/user.email configured for attribution

**Returns**:
- Health status (healthy, warnings, errors)
- List of issues found
- Recommendations for repairs

**Usage** (via core):
```typescript
const health = await GitWorkflow.verify({
  projectRoot: '/path/to/project'
});

console.log(health);
// {
//   status: 'warnings',
//   issues: [
//     { type: 'outdated', file: 'pre-commit', message: 'Hook is outdated' },
//     { type: 'missing', file: '.gitmessage', message: 'Commit template missing' }
//   ],
//   recommendations: ['run repair', 'run update']
// }
```

### 3. Repair (`repair`)

**Purpose**: Fix common git configuration issues

**What it repairs**:
- Missing hooks (copy from package)
- Broken hooks (fix permissions, restore content)
- Missing commit template (recreate)
- Incorrect git config (fix settings)
- Missing `.gitignore` or `.gitattributes` (recreate)
- Missing `gh` installation (install if possible)
- Missing `gh` auth (prompt or provide guided instructions)
- Missing expert mailbox mapping (prompt to register)
- Incorrect git user.name/user.email (repair from experts map)

**Usage** (via core):
```typescript
const result = await GitWorkflow.repair({
  projectRoot: '/path/to/project',
  issues: health.issues // From verify
});

console.log(result);
// {
//   repaired: ['pre-commit', '.gitmessage'],
//   failed: []
// }
```

### 4. Update (`update`)

**Purpose**: Update git workflow to latest package version

**What it updates**:
- Replace hooks with latest versions
- Update templates with latest formats
- Update `.gitignore` with new patterns
- Migrate configurations to new standards
- Preserve user customizations where possible

**Options**:
- `force`: Overwrite user modifications
- `backup`: Create backups before updating
- `interactive`: Prompt for each change

**Usage** (via core):
```typescript
const result = await GitWorkflow.update({
  projectRoot: '/path/to/project',
  options: {
    force: false,
    backup: true,
    interactive: false
  }
});

console.log(result);
// {
//   updated: ['pre-commit', 'commit-msg', '.gitmessage'],
//   skipped: ['pre-push'], // User modified
//   backed_up: ['pre-commit.backup', 'commit-msg.backup']
// }
```

### 5. Issues (`issues`)

**Purpose**: Provide standardized issue workflows in the packages repo for all projects.

**What it does**:
- Open issues in the packages repo with standardized labels and templates
- List and view issues in the packages repo
- Read maintainer responses and status updates
- Link issues to the originating project for traceability

**Usage** (via core or standalone):
```typescript
import { GitWorkflow } from '@your-org/git-workflow';

// Open a new issue in the packages repo
await GitWorkflow.issues.open({
  repo: 'your-org/packages',
  title: 'Port Manager: conflict on startup',
  body: 'Steps to reproduce...\nExpected...\nActual...',
  labels: ['bug', 'port-manager', 'project:my-app']
});

// List issues in the packages repo
const issues = await GitWorkflow.issues.list({
  repo: 'your-org/packages',
  labels: ['project:my-app'],
  state: 'open'
});

// View a specific issue and comments
const issue = await GitWorkflow.issues.view({
  repo: 'your-org/packages',
  number: 123
});
```

## Integration with Core

Git Workflow is consumed by `@colis/rig` for:

1. **Project Initialization** (`core init`):
   - Core calls `GitWorkflow.init()` during project setup
   - Automatically configures git workflow for all new projects
   - Integrated with other initialization steps (port manager, IDE colors, etc.)

2. **Health Checks** (`core verify` or `core health`):
   - Core calls `GitWorkflow.verify()` to check git configuration
   - Reports git workflow health alongside other project health checks
   - Provides unified health dashboard

3. **Repairs** (`core repair` or `core fix`):
   - Core calls `GitWorkflow.repair()` to fix git issues
   - Integrated with other repair operations
   - Unified repair command for all project issues

4. **Updates** (`core update`):
   - Core calls `GitWorkflow.update()` to update git workflow
   - Coordinated with rig package updates
   - Version-aware updates (only update if new version available)

5. **Issue Management** (`core issue`):
   - Core calls `GitWorkflow.issues.*` for standardized issue workflows
   - All projects open/read issues in the packages repo
   - Maintainer responses are visible via unified issue view

## Technical Architecture

### Package Structure

```
@your-org/git-workflow/
├── assets/
│   ├── hooks/
│   │   ├── pre-commit
│   │   ├── commit-msg
│   │   ├── pre-push
│   │   ├── post-checkout
│   │   └── post-merge
│   ├── templates/
│   │   ├── .gitmessage
│   │   ├── PULL_REQUEST_TEMPLATE.md
│   │   └── ISSUE_TEMPLATE/
│   │       ├── bug_report.md
│   │       ├── feature_request.md
│   │       └── docs_improvement.md
│   ├── config/
│   │   ├── gitignore/
│   │   │   ├── nodejs.gitignore
│   │   │   ├── python.gitignore
│   │   │   └── go.gitignore
│   │   ├── .gitattributes
│   │   └── git-config-snippets.txt
│   ├── rules/
│   │   ├── branch-naming.md
│   │   ├── commit-conventions.md
│   │   └── pr-workflow.md
│   └── docs/
│       ├── workflow-guide.md
│       ├── hook-reference.md
│       ├── troubleshooting.md
│       └── migration-guide.md
├── src/
│   ├── lifecycle/
│   │   ├── init.ts
│   │   ├── verify.ts
│   │   ├── repair.ts
│   │   └── update.ts
│   ├── utils/
│   │   ├── file-utils.ts
│   │   ├── git-utils.ts
│   │   └── version-utils.ts
│   └── index.ts
├── package.json
└── README.md
```

### Programmatic API

```typescript
// Main API surface
export class GitWorkflow {
  static async init(options: InitOptions): Promise<InitResult>;
  static async verify(options: VerifyOptions): Promise<HealthStatus>;
  static async repair(options: RepairOptions): Promise<RepairResult>;
  static async update(options: UpdateOptions): Promise<UpdateResult>;
  static issues: {
    open(options: IssueOpenOptions): Promise<IssueOpenResult>;
    list(options: IssueListOptions): Promise<IssueSummary[]>;
    view(options: IssueViewOptions): Promise<IssueDetails>;
  };
  static experts: {
    register(options: ExpertRegisterOptions): Promise<ExpertRegisterResult>;
    list(options: ExpertListOptions): Promise<ExpertInfo[]>;
  };
}

// Types
interface InitOptions {
  projectRoot: string;
  projectType: 'nodejs' | 'python' | 'go' | 'generic';
  options?: {
    hooksEnabled?: string[];
    commitTemplate?: boolean;
    prTemplate?: boolean;
    issueTemplates?: boolean;
    createRemoteRepo?: boolean;
    remoteRepoName?: string;
    remoteVisibility?: 'private' | 'public' | 'internal';
  };
}

interface VerifyOptions {
  projectRoot: string;
}

interface HealthStatus {
  status: 'healthy' | 'warnings' | 'errors';
  issues: Issue[];
  recommendations: string[];
}

interface Issue {
  type: 'missing' | 'outdated' | 'broken' | 'misconfigured';
  file: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface IssueOpenOptions {
  repo: string;
  title: string;
  body: string;
  labels?: string[];
}

interface IssueOpenResult {
  number: number;
  url: string;
}

interface IssueListOptions {
  repo: string;
  labels?: string[];
  state?: 'open' | 'closed' | 'all';
}

interface IssueViewOptions {
  repo: string;
  number: number;
}

interface IssueSummary {
  number: number;
  title: string;
  state: 'open' | 'closed';
  url: string;
}

interface IssueDetails extends IssueSummary {
  body: string;
  comments: Array<{
    author: string;
    body: string;
    createdAt: string;
  }>;
}

interface ExpertRegisterOptions {
  email: string;
  githubUsername: string;
  displayName?: string;
}

interface ExpertRegisterResult {
  email: string;
  githubUsername: string;
  status: 'registered' | 'updated';
}

interface ExpertListOptions {
  includeUnmapped?: boolean;
}

interface ExpertInfo {
  email: string;
  githubUsername?: string;
  displayName?: string;
}

interface RepairOptions {
  projectRoot: string;
  issues: Issue[];
}

interface RepairResult {
  repaired: string[];
  failed: string[];
}

interface UpdateOptions {
  projectRoot: string;
  options?: {
    force?: boolean;
    backup?: boolean;
    interactive?: boolean;
  };
}

interface UpdateResult {
  updated: string[];
  skipped: string[];
  backed_up: string[];
}
```

## CLI Commands (Optional)

While primarily consumed by core, the package can also provide standalone CLI commands:

```bash
# Initialize git workflow
npx @your-org/git-workflow init

# Verify git workflow health
npx @your-org/git-workflow verify

# Repair git workflow issues
npx @your-org/git-workflow repair

# Update git workflow to latest version
npx @your-org/git-workflow update
```

## Distribution Strategy

### As npm Package

```bash
# Core depends on git-workflow
npm install @your-org/git-workflow
```

**What's Published**:
- Compiled lifecycle tools (`dist/`)
- All assets (`assets/`)
- Documentation (`README.md`, `assets/docs/`)

### Within Monorepo

```
packages/
├── core/
│   ├── package.json  # Depends on @your-org/git-workflow
│   └── ...
└── git-workflow/
    ├── package.json
    └── ...
```

**Repo Strategy Decision**: Monorepo with clear app/package boundaries
- Shared tooling and standards across packages
- Consistent version management
- Easy cross-package refactoring
- Clear extraction path if needed (e.g., if git-workflow grows large)
- Optimizes for current team size (1-3 devs) and mixed infrastructure needs

See [Monorepo Strategy](../../architecture/PACKAGE_ARCHITECTURE.md#monorepo-strategy-decision) for details.

## Usage Examples

### Basic Usage (via Core)

```bash
# Install rig package
npm install @colis/rig

# Initialize project (git workflow automatically configured)
npx @colis/rig init

# Verify project health (includes git workflow check)
npx @colis/rig verify

# Repair project issues (includes git workflow repairs)
npx @colis/rig repair

# Update project to latest standards (includes git workflow updates)
npx @colis/rig update

# Open an issue in the packages repo
npx @colis/rig issue open --title "Port conflict" --label "port-manager"

# View maintainer responses
npx @colis/rig issue view 123
```

### Standalone Usage

```bash
# Install git-workflow package directly
npm install @your-org/git-workflow

# Initialize git workflow only
npx @your-org/git-workflow init

# Check git workflow health
npx @your-org/git-workflow verify

# Repair git workflow issues
npx @your-org/git-workflow repair

# Update git workflow
npx @your-org/git-workflow update

# Open an issue in the packages repo
npx @your-org/git-workflow issue open --title "Port conflict" --label "port-manager"

# View maintainer responses
npx @your-org/git-workflow issue view 123
```

### Programmatic Usage

```typescript
import { GitWorkflow } from '@your-org/git-workflow';

// Initialize
await GitWorkflow.init({
  projectRoot: process.cwd(),
  projectType: 'nodejs',
  options: {
    hooksEnabled: ['pre-commit', 'commit-msg'],
    commitTemplate: true,
    prTemplate: true
  }
});

// Verify
const health = await GitWorkflow.verify({
  projectRoot: process.cwd()
});

if (health.status !== 'healthy') {
  console.log('Issues found:', health.issues);
  
  // Repair
  await GitWorkflow.repair({
    projectRoot: process.cwd(),
    issues: health.issues
  });
}

// Update to latest version
await GitWorkflow.update({
  projectRoot: process.cwd(),
  options: {
    backup: true,
    force: false
  }
});
```

## Error Handling

### Initialization Errors

- **Git Not Available**: Report error, suggest installing git
- **GitHub CLI Not Available**: Report error, attempt install, suggest manual install if needed
- **GitHub CLI Auth Missing**: Report error, guide user through `gh auth login`
- **Repo Create Failed**: Report error, include repo name and gh output
- **Git Already Configured**: Warn if existing hooks/configs, offer merge or overwrite options
- **Permission Errors**: Report error, suggest checking file permissions
- **Invalid Project Type**: Report error, fallback to 'generic' type

### Verification Errors

- **Git Repository Not Found**: Report error, suggest running `git init`
- **Hook Execution Errors**: Report which hooks failed, suggest repair
- **Permission Errors**: Report files with incorrect permissions
- **GitHub CLI Not Authenticated**: Report error, suggest `gh auth login`
- **Packages Repo Access Denied**: Report missing access rights, suggest requesting access
- **Expert Not Registered**: Report missing email → GitHub mapping, suggest register

### Repair Errors

- **Cannot Write Files**: Report permission errors, suggest manual fixes
- **Backup Failed**: Report error, skip update to preserve existing files
- **Git Config Errors**: Report configuration issues, suggest manual git config
- **GitHub CLI Install Failed**: Report error, provide manual install steps
- **Expert Registration Failed**: Report error, include email and GitHub username

### Issue Workflow Errors

- **Issue Create Failed**: Report error, include gh output and repo name
- **Issue View Failed**: Report error, suggest checking issue number or permissions
- **Rate Limited**: Report error, suggest retry later

### Update Errors

- **User Modifications**: Detect user-modified files, skip or merge carefully
- **Version Incompatibility**: Report version mismatches, suggest force update or manual migration
- **Backup Failed**: Abort update to prevent data loss

## Future Enhancements

### Phase 2: Advanced Features

- **Custom Hook Templates**: Allow projects to define custom hooks
- **Workflow Presets**: Pre-configured workflows for different team sizes/styles
- **CI/CD Integration**: Validate git workflow in CI pipelines
- **Metrics & Analytics**: Track commit quality, workflow adherence

### Phase 3: Team Features

- **Team Sync**: Sync git workflow configurations across team members
- **Policy Enforcement**: Enforce git workflow policies (required hooks, commit formats)
- **Workflow Governance**: Central management of allowed workflows

### Phase 4: AI-Powered Features

- **Smart Commit Messages**: AI-assisted commit message generation
- **Workflow Recommendations**: Suggest workflow improvements based on project patterns
- **Anomaly Detection**: Detect unusual commit patterns, potential issues

## Dependencies

- **Core package** (`@colis/rig`): For integration and orchestration
- **Git**: Required system dependency
- **GitHub CLI (`gh`)**: Required for PR/issue workflows and repo management
- **Node.js**: For running lifecycle tools
- **fs-extra**: For file operations
- **chalk**: For colored CLI output
- **simple-git**: For programmatic git operations

## Testing Strategy

### Unit Tests

- Test lifecycle functions (init, verify, repair, update) in isolation
- Test asset copying logic
- Test git configuration utilities
- Test version detection and comparison
- Test issue detection algorithms

### Integration Tests

- Test full initialization flow in temporary projects
- Test verify → repair flow
- Test update flow with version changes
- Test interaction with git commands
- Test hook execution
- Test gh issue open/list/view against packages repo (mocked)
- Test expert registration and git attribution config (mocked)

### E2E Tests

- Test via rig package integration
- Test in real project scenarios
- Test with different project types (nodejs, python, go)
- Test error scenarios and recovery
- Test issue creation and maintainer response visibility
- Test contributor attribution (user.name/user.email) applied on init

## Documentation

### User Documentation

- Getting started guide (via core)
- Standalone usage guide
- Git workflow conventions guide
- Hook reference documentation
- Troubleshooting guide

### Developer Documentation

- Package architecture documentation
- Lifecycle API documentation
- Asset structure documentation
- Contributing guide
- Testing guide

## Success Criteria

### Must Have

- ✅ Standardized git hooks (pre-commit, commit-msg, pre-push)
- ✅ Commit message template with conventional commits
- ✅ PR and issue templates
- ✅ `.gitignore` templates for common project types
- ✅ Lifecycle management (init, verify, repair, update)
- ✅ Core package integration
- ✅ Health monitoring and reporting
- ✅ Automated repairs for common issues
- ✅ GitHub CLI installation and authentication management
- ✅ Standardized issue open/read workflows in packages repo
- ✅ GitHub repo creation on init when missing
- ✅ Expert mailbox registration and GitHub attribution mapping

### Should Have

- ⏳ CLI commands for standalone usage
- ⏳ Interactive update mode
- ⏳ Customizable hook configurations
- ⏳ Backup/restore functionality
- ⏳ Migration guides for existing projects

### Nice to Have

- ⏳ Workflow presets for different team styles
- ⏳ CI/CD integration for validation
- ⏳ Custom hook template support
- ⏳ Team sync capabilities
- ⏳ Metrics and analytics

## SEO Considerations for Package Documentation

When documenting this package for web publication:

1. **Package Documentation SEO**
   - Use descriptive, keyword-rich titles and descriptions
   - Include relevant keywords naturally (git workflow, version control, git hooks, commit standards)
   - Structure documentation with proper heading hierarchy (H1-H6)
   - Include comprehensive workflow examples and best practices for content depth

2. **Technical Documentation SEO**
   - Document git workflows with clear, searchable descriptions
   - Include code examples demonstrating workflow patterns
   - Use semantic HTML structure in documentation
   - Add internal links to related git and version control documentation

3. **Content Quality for Search**
   - Ensure documentation answers common git workflow queries
   - Include troubleshooting sections for common workflow issues
   - Provide comprehensive workflow reference documentation
   - Maintain documentation freshness with git best practices updates

---

## Technical Notes

### Hooks Directory Standardization

**Problem**: Initially, two packages were creating hooks in different locations:
- `@colis/rig` (commissioning): Created `.githooks/post-checkout` (for IDE colors) and set `git config core.hooksPath .githooks`
- `@your-org/git-workflow`: Was installing hooks to `.git/hooks/` (pre-commit, commit-msg, pre-push, post-checkout)

**Result**: Git-workflow hooks wouldn't run because git was configured to look in `.githooks/`!

**Solution**:
1. **Git-workflow now uses `.githooks/`**: Changed from `.git/hooks/` to `.githooks/` to match @colis/rig
2. **Sets hooks path**: Git-workflow now sets `git config core.hooksPath .githooks` 
3. **Preserves existing hooks**: Before installing a hook, checks if it already exists
   - If hook exists (e.g., post-checkout from @colis/rig), skip installation
   - This preserves @colis/rig's comprehensive post-checkout hook for IDE colors
4. **Hook precedence**: @colis/rig's post-checkout hook takes precedence (installed first during `core init`)

**Files Changed**:
- `packages/git-workflow/src/lifecycle/init.ts`: 
  - Changed hooks directory to `.githooks/`
  - Added check to skip existing hooks
  - Added git config for `core.hooksPath`

**Testing**: Verify that after running both:
```bash
npx @colis/rig init
npx git-workflow init
```
The `.githooks/` directory contains:
- `post-checkout` (from @colis/rig - for IDE colors)
- `pre-commit` (from git-workflow)
- `commit-msg` (from git-workflow)
- `pre-push` (from git-workflow)

And `git config core.hooksPath` returns `.githooks`.

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Transformed placeholder PRD into comprehensive specification for Git Workflow asset package. Defined package as asset provider with lifecycle tools consumed by core for git initialization and ongoing management. Added complete problem statement (inconsistent git setup, no lifecycle management, manual configuration), solution design (standardized assets, core integration, full lifecycle management), comprehensive asset catalog (hooks, templates, configs, rules, docs), lifecycle management tools (init, verify, repair, update) with programmatic APIs, core integration points, technical architecture, CLI commands, usage examples, error handling, future enhancements, testing strategy, and success criteria. Specified hybrid placement where core orchestrates lifecycle operations while git-workflow package provides assets and tooling. Included monorepo strategy decision context.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added GitHub CLI (`gh`) management to Git Workflow package scope. Updated solution and goals to include gh readiness, added a core component for gh management, extended lifecycle tools to install/verify/repair gh, expanded error handling and dependencies to cover gh, and updated success metrics/criteria to require gh installation and authentication.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added packages repo issue management to Git Workflow scope. Documented standardized issue open/read workflows via `gh`, added repo mapping assets, issue workflow guide, issue lifecycle API, usage examples, error handling, and testing strategy updates. Updated success metrics/criteria to include issue visibility and standardized issue routing.

**Expert**: System Architect  
**Date**: 2026-01-22  
**Changes**: Added expert mailbox registration and GitHub attribution management. Introduced experts mapping asset, registration workflow, verification/repair steps, API surface for registering/listing experts, and success criteria for attribution visibility. Added tests and error handling for missing mappings and attribution setup.

---

