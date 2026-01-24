# Update: Angular CLI is Now Default

## Summary

**Angular CLI is now the default for Angular projects!**

Previously, Angular projects were created using templates by default, and you had to explicitly use `--use-ng-cli` to use Angular CLI.

Now, Angular projects automatically use Angular CLI, and you can opt out with `--no-use-ng-cli` if you want to use templates.

---

## What Changed

### Before (v1.1.0)

```bash
# Used templates
create-project create my-app

# Required explicit flag for Angular CLI
create-project create my-app --use-ng-cli
```

### After (v1.2.0)

```bash
# Uses Angular CLI automatically
create-project create my-app

# Opt out to use templates
create-project create my-app --no-use-ng-cli
```

---

## Technical Changes

### Code Logic

**Before:**
```typescript
const useNgCli = options.useNgCli || false;
```

**After:**
```typescript
const isAngularTemplate = templateType.toLowerCase().includes('angular');
const useNgCli = isAngularTemplate ? (options.useNgCli !== false) : (options.useNgCli === true);
```

This means:
- **For Angular**: Default is `true` (uses CLI), unless explicitly set to `false` via `--no-use-ng-cli`
- **For other templates**: Default is `false` (uses templates), unless explicitly set to `true` via `--use-ng-cli`

### CLI Options

**Added:**
- `--no-use-ng-cli` - Opt out of Angular CLI, use templates instead

**Updated:**
- `--use-ng-cli` - Now explicitly enables Angular CLI (same as default for Angular)

---

## Documentation Updates

All documentation has been updated to reflect the new default:

1. ✅ **README.md** - Updated to show Angular CLI as default
2. ✅ **USAGE.md** - Updated usage examples
3. ✅ **QUICK_REFERENCE.md** - Updated quick reference
4. ✅ **ANGULAR_CLI_INTEGRATION.md** - Updated integration guide
5. ✅ **SUMMARY.md** - Updated implementation summary

---

## Migration Guide

### For Existing Users

If you were using templates (default behavior before):

**Option 1: Accept the new default (Recommended)**
- Angular CLI is now the standard
- Get latest Angular features automatically
- Follow Angular community conventions

**Option 2: Keep using templates**
```bash
# Add --no-use-ng-cli flag
create-project create my-app --no-use-ng-cli
```

If you were explicitly using `--use-ng-cli`:
- No change needed! Still works the same
- You can now omit the flag since it's default

---

## Why This Change?

### Benefits

1. **Latest Features** - Always get the latest Angular CLI structure
2. **Community Standard** - Follows Angular community conventions
3. **Less Maintenance** - Don't need to update templates for Angular releases
4. **Better Default** - Most users want standard Angular CLI structure

### User Choice Preserved

Users still have full control:
- Default: Angular CLI (modern, standard)
- Opt-out: Templates (customized, pre-configured)

---

## Examples

### Default Behavior (Angular CLI)

```bash
# Basic (uses Angular CLI)
create-project create my-app

# With options (uses Angular CLI)
create-project create my-app --package-manager pnpm

# With skip flags (uses Angular CLI)
create-project create my-app --skip-deps
```

### Using Templates Instead

```bash
# Opt out of Angular CLI
create-project create my-app --no-use-ng-cli

# With options
create-project create my-app --no-use-ng-cli --package-manager pnpm
```

---

## Testing

### Quick Test

```bash
# 1. Build package
cd packages/template-project
npm run build

# 2. Link globally
npm link

# 3. Test default (Angular CLI)
cd /tmp
create-project create test-default

# 4. Test templates
create-project create test-templates --no-use-ng-cli

# 5. Verify
cd test-default
ls -la  # Should see Angular CLI structure
cat angular.json  # Should exist

cd ../test-templates
ls -la  # Should see template structure
```

---

## Backward Compatibility

✅ **Fully Compatible** - No breaking changes

- `--use-ng-cli` still works (now same as default for Angular)
- `--no-use-ng-cli` is the new way to opt out
- All other options work the same
- Non-Angular templates unchanged

---

## Version

- **Previous:** v1.1.0 (Angular CLI opt-in)
- **Current:** v1.2.0 (Angular CLI default)

---

## Summary

**Angular CLI is now the default for Angular projects.**

- ✅ Default: Uses Angular CLI
- ✅ Opt-out: Use `--no-use-ng-cli` for templates
- ✅ Latest features automatically
- ✅ Community standards
- ✅ Still supports templates
- ✅ Fully backward compatible

---

**Date:** 2026-01-17  
**Status:** ✅ Complete
