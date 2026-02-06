# IMPORTANT: Setup Required

## Problem

If you're seeing missing `.cursor`, `.githooks`, or `.vscode` directories, it means **Project Initialization failed** because `@your-org/core` is not available.

## Solution

Before using `create-project`, you must link `@your-org/core` globally:

```bash
# 1. Go to core package
cd /Users/yoavweitzman/Documents/packages/packages/core

# 2. Link it globally
npm link

# 3. Verify it's linked
npm list -g --depth=0 | grep @your-org/core
# Should show: @your-org/core@1.0.0 -> /Users/yoavweitzman/Documents/packages/packages/core

# 4. Now you can use create-project anywhere
cd ~/Documents/Projects
create-project
```

## Why This Is Needed

`create-project` runs **Project Initialization** from `@your-org/core`, which sets up:
- `.cursor/rules/` - Expert personas
- `.cursor/commands/` - Cursor commands
- `.githooks/` - Git hooks
- `.vscode/settings.json` - IDE colors
- `.port-manager.json` - Port allocation

If `@your-org/core` is not available (not linked), Project Initialization **fails silently** and you get an incomplete project.

## Alternative: Manual Initialization

If you already created a project without `@your-org/core` linked:

```bash
# 1. Link core globally (if not done)
cd /Users/yoavweitzman/Documents/packages/packages/core
npm link

# 2. Go to your project
cd ~/Documents/Projects/mobile-learning-companion

# 3. Link core in project
npm link @your-org/core

# 4. Run initialization manually
npx @your-org/core init
```

## How to Check

After creating a project, verify these exist:
```bash
ls -la .cursor/rules/      # Should have experts/ and user/
ls -la .cursor/commands/   # Should have general/
ls -la .githooks/          # Should have post-checkout
ls -la .vscode/            # Should have settings.json
ls -la .port-manager.json  # Should exist
```

If any are missing, Project Initialization didn't run!

## Fix for Future

We should update `create-project` to:
1. Check if `@your-org/core` is globally linked
2. If not, show clear error message with instructions
3. Don't continue if core is not available
