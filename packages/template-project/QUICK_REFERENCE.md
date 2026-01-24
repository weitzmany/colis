# Angular CLI Integration - Quick Reference

## TL;DR

**Angular projects now use Angular CLI by default!**

```bash
# Uses Angular CLI automatically
create-project create my-app

# Opt out to use templates instead
create-project create my-app --no-use-ng-cli
```

---

## Command Reference

### Basic Usage

| Command | Description |
|---------|-------------|
| `create-project create my-app` | Create Angular with CLI (default) |
| `create-project create my-app --no-use-ng-cli` | Create Angular with templates |
| `create-project create my-app --template slim` | Other templates (not Angular) |

### With Options

| Command | Description |
|---------|-------------|
| `--package-manager pnpm` | Use pnpm instead of npm |
| `--skip-deps` | Don't install dependencies |
| `--skip-git` | Don't initialize git |
| `--skip-init` | Don't run Project Initialization |
| `--dry-run` | Show what would be created |
| `--no-use-ng-cli` | Use templates for Angular (not CLI) |

### Examples

```bash
# Basic Angular (uses CLI automatically)
create-project create my-app

# Angular with pnpm (uses CLI)
create-project create my-app --package-manager pnpm

# Angular with templates (opt out of CLI)
create-project create my-app --no-use-ng-cli

# Dry run
create-project create my-app --dry-run
```

---

## What You Get

### With `--use-ng-cli`

✅ Standard Angular CLI project structure  
✅ Latest Angular version and features  
✅ Angular community conventions  
✅ Project Initialization (Cursor rules, Port Manager)  
✅ Opens in Cursor IDE  

### With Templates (Default)

✅ Customized project structure  
✅ Pre-configured integrations  
✅ Consistent across project types  
✅ Project Initialization  
✅ Opens in Cursor IDE  

---

## Quick Decision Guide

### Use `--use-ng-cli` if you want:

- ✅ Latest Angular CLI structure
- ✅ Standard Angular conventions
- ✅ Angular CLI-specific features

### Use Templates (default) if you want:

- ✅ Customized structure
- ✅ Pre-configured setup
- ✅ Consistency across project types

---

## Troubleshooting

### Issue: "Angular CLI command failed"

**Solution:**
```bash
# Ensure internet connection
# Or install Angular CLI globally
npm install -g @angular/cli
```

### Issue: "Permission denied"

**Solution:**
```bash
# Change to a directory you own
cd ~/projects
create-project create my-app --use-ng-cli
```

### Issue: "Wrong package manager"

**Solution:**
```bash
# Install the package manager first
npm install -g pnpm  # or yarn
```

---

## Testing

### Quick Test

```bash
# 1. Create project
create-project create test-app --use-ng-cli

# 2. Navigate to project
cd test-app

# 3. Install dependencies (if skipped)
npm install

# 4. Start dev server
npm start

# 5. Open browser
# http://localhost:4200
```

### Expected Results

✅ Project created successfully  
✅ Standard Angular files present  
✅ `.cursor/` directory exists  
✅ Port Manager shows project  
✅ App builds and runs  

---

## Files to Check

```bash
# Verify structure
ls -la                      # See project files
cat package.json            # Check project name
cat angular.json            # Check Angular config

# Verify Project Initialization
ls -la .cursor/rules/experts/    # Should have ~26 files
port-manager list                # Should show project

# Verify Angular CLI structure
ls -la src/app/                  # Standard Angular app
```

---

## What Happens Behind the Scenes

1. Detects `--use-ng-cli` flag
2. Runs: `npx @angular/cli@latest new my-app --package-manager=npm --directory=.`
3. Runs Project Initialization (Cursor rules, Port Manager, colors)
4. Installs dependencies (unless --skip-deps)
5. Initializes git (unless --skip-git)
6. Opens in Cursor IDE

---

## Documentation

- **Quick Start:** This file
- **Full Guide:** [ANGULAR_CLI_INTEGRATION.md](./ANGULAR_CLI_INTEGRATION.md)
- **Testing:** [QUICK_TEST_CHECKLIST.md](./QUICK_TEST_CHECKLIST.md)
- **Changes:** [CHANGELOG_ANGULAR_CLI.md](./CHANGELOG_ANGULAR_CLI.md)

---

## One-Liner Summary

Use `--use-ng-cli` to create Angular projects with the official Angular CLI while still getting Cursor rules, Port Manager, and IDE setup automatically.

---

**Status:** ✅ Ready to use  
**Version:** 1.1.0  
**Date:** 2026-01-17
