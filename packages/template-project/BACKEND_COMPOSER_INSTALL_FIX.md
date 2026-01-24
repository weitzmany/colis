# Backend Composer Install Fix

## Problem

When creating full-stack projects with Angular frontend and Slim PHP backend, the backend's Composer dependencies were not being installed automatically. This caused runtime errors when trying to access backend endpoints:

```
Warning: require(.../backend/public/../vendor/autoload.php): Failed to open stream: No such file or directory
Fatal error: Failed opening required '.../vendor/autoload.php'
```

## Root Cause

The dependency installation logic in `create.ts` only checked for `composer.json` at the project root level:

```typescript
const hasComposerJson = await fs.pathExists(path.join(outputPath, 'composer.json'));
```

For full-stack projects with this structure:
```
project-name/
├── frontend/          # Angular app
│   └── package.json
├── backend/           # Slim PHP backend
│   └── composer.json  # ← Not detected!
└── README.md
```

The `composer.json` file is in the `backend/` subdirectory, so it was never detected and `composer install` was never run.

## Solution

Enhanced the dependency installation logic to:

1. **Detect full-stack project structure** by checking for `frontend/` and `backend/` subdirectories
2. **Install frontend dependencies** in the `frontend/` directory (if not already installed by framework CLI)
3. **Install backend dependencies** in the `backend/` directory:
   - For PHP backends: Run `composer install` in `backend/`
   - For Node.js backends: Run `npm install` (or yarn/pnpm) in `backend/`

### Implementation

**File Changed**: `packages/template-project/src/cli/commands/create.ts`

**Key Changes**:

```typescript
// Check for full-stack structure with frontend/backend subdirectories
const hasFrontendDir = await fs.pathExists(path.join(outputPath, 'frontend'));
const hasBackendDir = await fs.pathExists(path.join(outputPath, 'backend'));
const isFullStack = hasFrontendDir && hasBackendDir;

if (isFullStack) {
  // Install backend dependencies
  if (hasBackendDir) {
    const backendComposerJson = path.join(outputPath, 'backend', 'composer.json');
    
    if (await fs.pathExists(backendComposerJson)) {
      // PHP backend - use composer
      console.log(chalk.gray('  Installing backend dependencies (PHP/Composer)...'));
      process.chdir(path.join(outputPath, 'backend'));
      execSync('composer install', { stdio: 'inherit' });
      console.log(chalk.green('  ✓ Backend dependencies installed'));
      process.chdir(outputPath);
    }
  }
}
```

## Testing

To verify the fix:

1. **Create a full-stack project**:
   ```bash
   create-project my-test-app
   # Select Angular + Slim
   ```

2. **Verify backend dependencies installed**:
   ```bash
   cd my-test-app/backend
   ls -la vendor/    # Should exist with packages
   ```

3. **Test backend endpoints**:
   ```bash
   cd backend
   composer start
   # Visit http://localhost:<port>/health
   # Should return JSON, not PHP errors
   ```

## Benefits

- ✅ Backend Composer dependencies automatically installed
- ✅ Backend works immediately after project creation
- ✅ No manual `composer install` required
- ✅ Consistent behavior for all project types
- ✅ Better error handling with helpful messages

## Related Files

- **Fixed**: `packages/template-project/src/cli/commands/create.ts`
- **Compiled**: `packages/template-project/dist/cli/commands/create.js`

## Related Issues

This fix addresses the "vendor/autoload.php not found" error that occurred when:
- Creating full-stack projects with Angular frontend + Slim backend
- Backend dependencies were not installed automatically
- Runtime errors when accessing backend endpoints

---

**Date**: 2026-01-21
**Package**: @your-org/template-project@1.0.0
**Status**: ✅ Fixed and tested
