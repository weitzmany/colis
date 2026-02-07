# @your-org/git-workflow

Standardized git workflow assets and lifecycle management tools for consistent git practices across all projects.

## Features

- 🔧 **Git Hooks**: Pre-commit, commit-msg, pre-push, post-checkout, post-merge
- 📝 **Templates**: Commit messages, PR templates, issue templates
- ⚙️ **Configuration**: .gitignore, .gitattributes, git config snippets
- 🔄 **Lifecycle Management**: Init, verify, repair, update commands
- 🐙 **GitHub CLI Integration**: Install, authenticate, repo creation, issue workflows
- 👥 **Expert Attribution**: Map expert mailboxes to GitHub accounts for contribution tracking
- 📦 **Monorepo Enforcement**: Automatically removes nested .git directories to maintain clean monorepo structure

## Installation

```bash
# Via rig package (recommended)
npm install @colis/rig

# Standalone
npm install @your-org/git-workflow
```

## Usage

### Via Core Package

```bash
# Initialize project (git workflow automatically configured)
npx @colis/rig init

# Verify git workflow health
npx @colis/rig verify

# Repair git workflow issues
npx @colis/rig repair

# Update git workflow to latest standards
npx @colis/rig update
```

### Standalone

```bash
# Initialize git workflow only
npx @your-org/git-workflow init

# Check git workflow health
npx @your-org/git-workflow verify

# Repair git workflow issues
npx @your-org/git-workflow repair

# Update git workflow
npx @your-org/git-workflow update
```

### Programmatic API

```typescript
import { GitWorkflow } from '@your-org/git-workflow';

// Initialize
await GitWorkflow.init({
  projectRoot: process.cwd(),
  projectType: 'nodejs',
  options: {
    hooksEnabled: ['pre-commit', 'commit-msg'],
    commitTemplate: true,
    prTemplate: true,
    createRemoteRepo: true
  }
});

// Verify
const health = await GitWorkflow.verify({
  projectRoot: process.cwd()
});

// Repair if needed
if (health.status !== 'healthy') {
  await GitWorkflow.repair({
    projectRoot: process.cwd(),
    issues: health.issues
  });
}

// Update
await GitWorkflow.update({
  projectRoot: process.cwd(),
  options: {
    backup: true,
    force: false
  }
});
```

## What's Included

### Git Hooks

- **pre-commit**: Linting, type checking, format validation
- **commit-msg**: Commit message validation (conventional commits)
- **pre-push**: Run tests before push
- **post-checkout**: Branch-specific actions
- **post-merge**: Update dependencies, run migrations

### Templates

- Commit message template (`.gitmessage`) with conventional commits format
- PR template with description sections and checklist
- Issue templates (bug report, feature request, docs improvement)

### Configuration

- `.gitignore` templates for Node.js, Python, Go, and generic projects
- `.gitattributes` for line endings and binary files
- Git config snippets for recommended settings

### GitHub CLI

- Automatic installation if missing
- Authentication validation and setup
- Remote repository creation
- Issue workflow management
- Expert contributor mapping

### Monorepo Enforcement

- Automatically scans for nested `.git` directories
- Removes any `.git` directories that are not in the project root
- Maintains clean monorepo structure
- Skips `node_modules` and other common directories
- Reports all removed directories

## Architecture

This package is consumed by `@colis/rig` for:

- Project initialization (automatic git workflow setup)
- Health checks (verify git configuration)
- Repairs (fix broken hooks, missing files)
- Updates (keep git workflow current)

## Documentation

See [PRD](../../docs/features/git-workflow/PRD.md) for complete specification.

## License

MIT
