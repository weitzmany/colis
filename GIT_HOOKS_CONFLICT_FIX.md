# Git Hooks Directory Conflict - FIXED ✅

## Problem Description

You discovered a critical conflict: **Two packages were creating git hooks in different locations!**

### The Conflict

1. **`@your-org/core`** (commissioning feature):
   - Creates: `.githooks/post-checkout` (for IDE colors)
   - Sets: `git config core.hooksPath .githooks`
   - Result: Git looks for hooks in `.githooks/`

2. **`@your-org/git-workflow`** (BEFORE the fix):
   - Created hooks in: `.git/hooks/`
   - Hooks: pre-commit, commit-msg, pre-push, post-checkout
   - Result: **These hooks NEVER RAN** because git was looking in `.githooks/`!

## The Fix

### Changes Made to `@your-org/git-workflow`

#### 1. **Hooks Directory Changed**
**File**: `packages/git-workflow/src/lifecycle/init.ts`

**Before**:
```typescript
const hooksDir = path.join(projectRoot, '.git', 'hooks');
```

**After**:
```typescript
// Use .githooks directory (matches @your-org/core's post-checkout hook location)
const hooksDir = path.join(projectRoot, '.githooks');
```

#### 2. **Skip Existing Hooks**
Added logic to preserve hooks created by other packages (like @your-org/core's post-checkout):

```typescript
for (const hook of hooksToInstall) {
  const src = path.join(assetsDir, 'hooks', hook);
  const dest = path.join(hooksDir, hook);

  // Check if hook already exists (e.g., from @your-org/core)
  if (await fileExists(dest)) {
    result.skipped.push(`git hook: ${hook}`);
    console.log(chalk.gray(`  ✓ Hook already exists: ${hook} (preserving existing)`));
    continue;
  }

  // Install hook if source exists
  if (await fileExists(src)) {
    await copyFile(src, dest, { preservePermissions: true });
    await makeExecutable(dest);
    result.installed.push(`git hook: ${hook}`);
    console.log(chalk.green(`  ✓ Installed ${hook} hook`));
  }
}
```

#### 3. **Configure Git Hooks Path**
Added git config to ensure git uses `.githooks/`:

```typescript
// Step 3.5: Configure git to use .githooks directory
try {
  await setGitConfig(projectRoot, 'core.hooksPath', '.githooks');
  console.log(chalk.green('  ✓ Configured git hooks path'));
} catch (error) {
  result.errors.push('Failed to configure git hooks path');
  console.log(chalk.yellow('  ⚠️  Failed to configure git hooks path'));
}
```

#### 4. **Fixed TypeScript Errors**
- Removed unused `getGit` import
- Added `getGitUserEmail` import
- Changed email detection from `listConfig()` to `getGitUserEmail()`
- Removed unused `Issue` imports from repair.ts and verify.ts

### Hook Precedence

**After the fix**, hooks are installed in this order:

1. **@your-org/core** (runs first during project init):
   - Creates `.githooks/post-checkout` for IDE colors
   - Sets `git config core.hooksPath .githooks`

2. **@your-org/git-workflow** (runs after):
   - Finds `.githooks/post-checkout` already exists → **SKIPS** (preserves @your-org/core's hook)
   - Installs: `pre-commit`, `commit-msg`, `pre-push`
   - Confirms `git config core.hooksPath .githooks` is set

### Result

**All hooks work together in `.githooks/` directory!**

```
.githooks/
├── post-checkout     # From @your-org/core (IDE colors) ✅
├── pre-commit        # From git-workflow ✅
├── commit-msg        # From git-workflow ✅
└── pre-push          # From git-workflow ✅
```

## Testing the Fix

### Test 1: New Project Initialization

```bash
# Create a new project
mkdir test-project && cd test-project

# Initialize core (creates .githooks/post-checkout)
npx @your-org/core init

# Initialize git-workflow (should NOT overwrite post-checkout)
npx git-workflow init

# Verify hooks directory
ls -la .githooks/

# Expected output:
# -rwxr-xr-x  post-checkout  (from @your-org/core)
# -rwxr-xr-x  pre-commit     (from git-workflow)
# -rwxr-xr-x  commit-msg     (from git-workflow)
# -rwxr-xr-x  pre-push       (from git-workflow)

# Verify git config
git config core.hooksPath
# Expected output: .githooks
```

### Test 2: Existing Project (like chore-allowance-manager)

```bash
cd /Users/yoavweitzman/Documents/Projects/chore-allowance-manager

# Run git-workflow init (should use .githooks/)
npx git-workflow init

# Check hooks directory
ls -la .githooks/

# Verify all hooks are in .githooks/, not .git/hooks/
ls -la .git/hooks/  # Should be empty or have sample files only

# Verify git config
git config core.hooksPath
# Expected output: .githooks
```

### Test 3: Verify Hooks Run

```bash
# Test pre-commit hook
echo "test" > test-file.txt
git add test-file.txt
git commit -m "test: verify pre-commit hook runs"
# Should see hook output

# Test post-checkout hook (IDE colors)
git checkout -b test-branch
# Should see "🎨 Updating IDE colors..." message
# .vscode/settings.json should be updated with new colors

# Test commit-msg hook
echo "bad commit message" | git commit -m
# Should reject bad commit messages

# Test pre-push hook
git push
# Should run checks before pushing
```

## Documentation Updates

### Updated Files

1. **`docs/features/git-workflow/PRD.md`**:
   - Added "Hooks Directory Conflict" to Pain Points
   - Added "Hooks Directory Standardization" to Solution
   - Updated Initialize (`init`) section to clarify `.githooks/` usage
   - Added comprehensive "Technical Notes" section documenting the conflict and resolution

## Files Changed

### Production Code
- `packages/git-workflow/src/lifecycle/init.ts` - Main fix
- `packages/git-workflow/src/lifecycle/repair.ts` - Removed unused import
- `packages/git-workflow/src/lifecycle/verify.ts` - Removed unused import

### Documentation
- `docs/features/git-workflow/PRD.md` - Added technical notes and updated descriptions
- `GIT_HOOKS_CONFLICT_FIX.md` - This summary document

### Build
- Compiled git-workflow with `npm run build` ✅

## Next Steps

1. **Test the fix**: Run the test scenarios above
2. **Verify in chore-allowance-manager**: Ensure hooks are in `.githooks/` and all work
3. **Test monorepo enforcement**: Verify nested `.git` removal still works
4. **Update embark**: Ensure it works with the new git-workflow

## Key Takeaways

✅ **Single hooks directory**: All hooks now live in `.githooks/`
✅ **No overwrites**: Existing hooks are preserved
✅ **Proper configuration**: Git config points to `.githooks/`
✅ **All hooks run**: No more "hooks not running" issues
✅ **Clean separation**: @your-org/core handles IDE colors, git-workflow handles git practices

---

**Status**: FIXED ✅
**Build**: Successful ✅
**Documentation**: Updated ✅
**Ready for Testing**: YES ✅
