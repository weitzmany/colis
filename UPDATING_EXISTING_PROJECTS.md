# Updating Existing Projects with New GitHub Feature

## Quick Answer

**Yes, use `refit`**, but use **rig's version** directly (not embark's):

```bash
cd /path/to/your-existing-project
npx @colis/rig refit
```

## Why `rig refit` (Not `embark refit`)

Both commands exist, but they do slightly different things:

### `npx @colis/rig refit`
✅ **This is what you want**
- Updates rules and commands from rig
- Updates Port Manager configuration
- Updates IDE colors
- **⭐ Now includes GitHub repo setup (NEW!)**
- Smart hash-based sync (only updates what changed)
- Works on any existing project

### `npx @colis/embark refit`
- Just calls `rig refit` internally
- Extra layer, not needed
- Use rig directly instead

## Complete Workflow to Update a Project

### 1. Update Dependencies
```bash
cd /path/to/your-project

# Update to new versions with GitHub feature
npm install --save-dev @colis/rig@latest @colis/embark@latest
```

### 2. Run Refit
```bash
npx @colis/rig refit
```

**What this does:**
- ✅ Syncs latest rules from rig to `.cursor/rules/`
- ✅ Syncs latest commands to `.cursor/commands/`
- ✅ Updates Port Manager if needed
- ✅ Updates IDE colors configuration
- ✅ **Creates GitHub repository** (NEW!)
- ✅ **Adds remote and pushes** (NEW!)

### 3. Check What Changed
```bash
git status
# Review the updated files
```

## Available Refit Options

```bash
# Basic refit
npx @colis/rig refit

# Force overwrite all files (ignore hashes)
npx @colis/rig refit --overwrite

# Delete files that don't exist in rig anymore
npx @colis/rig refit --delete-orphaned

# Skip specific parts
npx @colis/rig refit --skip-rules       # Don't update rules
npx @colis/rig refit --skip-commands    # Don't update commands
npx @colis/rig refit --skip-github      # Don't create GitHub repo (NEW!)

# Preview what would change (dry run)
npx @colis/rig refit --check-only
```

## GitHub-Specific Options (NEW!)

```bash
# Refit but skip GitHub setup
npx @colis/rig refit --skip-github

# Create public repo instead of private
npx @colis/rig refit --github-visibility public
```

## If Project Already Has GitHub Remote

If your project already has a GitHub remote configured, refit will:
- ✅ Detect the existing remote
- ✅ Skip repo creation
- ✅ Show status: "Remote already configured"
- ✅ Continue with other updates

## If You Only Want GitHub Setup

For projects that were initialized before the GitHub feature, you can just sync GitHub:

```bash
npx @colis/rig github-sync
```

This **only** handles GitHub (doesn't update rules/commands).

## Typical Update Workflow

```bash
# 1. Update dependencies
cd my-project
npm install --save-dev @colis/rig@latest

# 2. Refit project
npx @colis/rig refit

# 3. Review changes
git status
git diff

# 4. Commit updates
git add .
git commit -m "chore: update rig configuration and add GitHub integration"
```

## What If Refit Detects Changes?

Refit uses **hash-based comparison**:
- Files with matching hashes → Skipped (no copy needed)
- Files with different hashes → Updated
- Missing files → Created
- Orphaned files (with --delete-orphaned) → Deleted

**Output example:**
```
✓ Copied 3 files (2 complement, 1 user rules)
⊙ Skipped 15 identical files (same hash)
⚠ Deleted 1 orphaned files
✓ GitHub repository: https://github.com/user/my-project
✓ Initial commit pushed to origin
```

## Summary

**Your next step for existing projects:**

```bash
# Update rig to latest version with GitHub feature
npm install --save-dev @colis/rig@latest

# Refit the project (includes new GitHub feature)
npx @colis/rig refit
```

That's it! ✅

**Use `rig refit`, not `embark refit`** - it's more direct and does what you need.
