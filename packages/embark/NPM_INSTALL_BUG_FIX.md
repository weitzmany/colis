# Critical Bug Fix: npm install Removes @your-org/core Symlink

## The Problem

**Project Initialization was failing silently!**

### What Was Happening

1. Angular CLI creates project → runs `npm install` → creates `node_modules/`
2. We run `npm link @your-org/core` → creates symlink in `node_modules/@your-org/`
3. **Project Initialization runs** → Uses `@your-org/core` → **SUCCESS**
4. **"Installing dependencies" step runs** → `npm install` → **REMOVES THE SYMLINK!**
5. Project Initialization appears to succeed, but nothing was created:
   - ❌ No `.cursor/` directory
   - ❌ No `.githooks/` directory
   - ❌ No `.port-manager.json`
   - ❌ No port configuration

### Why `npm install` Was Running

The code had:
```typescript
// Step 7: Install dependencies
if (!config.skipDeps) {
  npm install  // This removes symlinks!
}
```

But Angular CLI **already installed dependencies** (`✔ Packages installed successfully`), so running `npm install` again was:
1. **Redundant** - deps already installed
2. **Destructive** - removed the `@your-org/core` symlink
3. **Wasteful** - added ~7 seconds for no reason

## The Fix

### Solution 1: Skip npm install for Angular CLI Projects

```typescript
// Skip if Angular CLI already installed (when using shouldUseNgCli)
const angularCliInstalledDeps = shouldUseNgCli && !config.skipDeps;
if (!config.skipDeps && !angularCliInstalledDeps) {
  npm install
}
```

This prevents running `npm install` when Angular CLI already installed dependencies.

### Solution 2: Re-link After npm install (Fallback)

If we do run `npm install`, re-link core afterwards:
```typescript
npm install
// Re-link @your-org/core after npm install (which removes symlinks)
npm link @your-org/core
```

## Result

### Before (Broken)
```
✓ Angular frontend created
⚙️ Running Project Initialization...
✓ Linked @your-org/core
✓ Project Initialization completed  ← LIE! Nothing happened

📦 Installing dependencies...  ← This removed the symlink!
✓ Dependencies installed

Result: Empty project, no .cursor/, no .githooks/, no ports configured
```

### After (Fixed)
```
✓ Angular frontend created
⚙️ Running Project Initialization...
✓ Linked @your-org/core
📋 Copying rules...  ← Actually works now!
  ✓ Copied 25 expert personas
⚡ Copying commands...
  ✓ Copied 12 general commands
🔌 Initializing Port Manager...
  ✓ Allocated port 4200
🎨 Configuring IDE colors...
✓ Project Initialization completed

📦 Installing dependencies...  ← SKIPPED (Angular CLI already did it)

Result: Complete project with all features!
```

## Testing

To test the fix, try creating a new project:

```bash
cd /Users/yoavweitzman/Documents/packages/packages/template-project
npm link
create-project test-project
# Choose Angular + Slim

# Verify everything exists:
cd test-project
ls -la .cursor/      # Should have experts/ and user/
ls -la .githooks/    # Should have post-checkout
cat .port-manager.json  # Should show allocated port
cat frontend/package.json | grep "start"  # Should show port
```

## Why It Was Hard to Debug

1. **Silent Failure**: `initializeProject()` succeeded, then its work was destroyed
2. **Misleading Output**: Showed "✓ Project Initialization completed" even though the result was removed
3. **Timing**: The bug only manifested when using Angular CLI (which pre-installs deps)

## See Also

- [SETUP_REQUIRED.md](./SETUP_REQUIRED.md) - How to set up @your-org/core
- [PORT_MANAGER_INTEGRATION.md](./PORT_MANAGER_INTEGRATION.md) - Port configuration
- [COMPLETE_FIX_SUMMARY.md](./COMPLETE_FIX_SUMMARY.md) - All fixes
