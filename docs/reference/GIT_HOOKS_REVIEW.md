# Git Hooks Review

This document lists useful git hooks patterns found in other projects.

**Last Updated**: 2025-01-05

## Git Hooks Patterns Found

### ✅ Pre-Push Hook (games)

#### 1. **Comprehensive Pre-Push Hook** (games/scripts/pre-push)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/pre-push`
- **Description**: Comprehensive pre-push hook that runs CI checks before pushing
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for pre-push validation
- **Key Features**:
  - **GitHub Actions Check**: Verifies last CI run passed
  - **Frontend Checks**: Lint, typecheck, test, build
  - **Backend Checks**: PHPCS, PHPStan, PHPUnit
  - **E2E Checks**: Console/network checks (Playwright)
  - **Branch Filtering**: Only runs for main/development branches
  - **Commit Tracking**: Tracks checked commits to avoid re-checking
  - **Error Handling**: Clear error messages, exit codes
  - **Color Output**: ANSI colors for better UX
- **Pattern**: Comprehensive CI check before push
- **Notes**:
  - Very thorough validation
  - Can be adapted to any tech stack
  - Branch-specific execution
  - GitHub Actions integration
  - Prevents pushing broken code

#### 2. **Git Hooks Setup Script** (games/scripts/setup-git-hooks.sh)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/setup-git-hooks.sh`
- **Description**: Script to install git hooks into `.git/hooks/`
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for hook installation
- **Key Features**:
  - Copies hook templates to `.git/hooks/`
  - Makes hooks executable
  - Verifies installation
  - Error handling
- **Pattern**: Automated hook installation
- **Notes**:
  - Simple, reusable pattern
  - Makes hooks easy to set up
  - Version-controlled hook templates

## Recommended Git Hooks Patterns

### Pre-Push Hook:

1. ✅ **Pattern**:
   - Check CI status (GitHub Actions, etc.)
   - Run local checks (lint, test, build)
   - Block push if checks fail
   - Branch-specific execution

2. ✅ **Common Checks**:
   - Linting
   - Type checking
   - Unit tests
   - Build verification
   - E2E tests (optional)

3. ✅ **Best Practices**:
   - Fast execution (don't block too long)
   - Clear error messages
   - Branch filtering (only critical branches)
   - Skip option (`--no-verify` for emergencies)

### Pre-Commit Hook:

1. ✅ **Pattern**:
   - Quick checks before commit
   - Format code (Prettier, etc.)
   - Lint staged files
   - Prevent invalid commits

2. ✅ **Common Checks**:
   - Code formatting
   - Lint staged files
   - Commit message format
   - File size checks

3. ✅ **Best Practices**:
   - Very fast (shouldn't block workflow)
   - Only check staged files
   - Auto-fix where possible
   - Clear feedback

### Hook Installation:

1. ✅ **Pattern**:
   - Hook templates in `scripts/` or `.githooks/`
   - Setup script to install hooks
   - Version control hook templates
   - Documentation for setup

2. ✅ **Best Practices**:
   - Automated installation
   - Version-controlled templates
   - Easy to update
   - Clear setup instructions

## Git Hooks Best Practices

1. **Hook Types**:
   - **Pre-commit**: Quick checks, formatting
   - **Pre-push**: Comprehensive CI checks
   - **Commit-msg**: Commit message validation
   - **Post-commit**: Notifications, logging

2. **Performance**:
   - Pre-commit: Very fast (< 1 second)
   - Pre-push: Can be longer (full CI checks)
   - Don't block developer workflow unnecessarily

3. **Error Handling**:
   - Clear error messages
   - Exit codes (0 = success, 1 = failure)
   - Color output for visibility
   - Helpful guidance

4. **Branch Filtering**:
   - Pre-push: Only critical branches (main, development)
   - Pre-commit: All branches
   - Configurable filtering

5. **Bypass Option**:
   - `--no-verify` flag for emergencies
   - Document when to use
   - Use sparingly

6. **Maintenance**:
   - Version control hook templates
   - Update hooks with codebase
   - Document hook behavior
   - Test hooks regularly

## Git Hooks Patterns

### Pattern 1: Pre-Push Hook (CI Checks)
```bash
#!/bin/bash
# Check GitHub Actions status
# Run local tests
# Block if checks fail
```

### Pattern 2: Pre-Commit Hook (Formatting)
```bash
#!/bin/bash
# Format code (Prettier)
# Lint staged files
# Auto-fix where possible
```

### Pattern 3: Hook Setup Script
```bash
#!/bin/bash
# Copy hook templates to .git/hooks/
# Make hooks executable
# Verify installation
```

## Notes

- Git hooks are powerful for enforcing quality
- Pre-push hooks prevent broken code from being pushed
- Pre-commit hooks enforce formatting/style
- Hook installation should be automated
- Hooks should be fast (especially pre-commit)
- Clear error messages are essential
- Branch filtering helps balance safety and speed
- Version control hook templates
- Documentation is important
- Bypass option for emergencies

