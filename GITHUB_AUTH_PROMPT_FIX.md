# GitHub Authentication Flow - Improved ✅

## What Was Wrong

Previously, when running `npx @colis/rig refit`, if the user wasn't authenticated:
- ❌ Just showed warning: "Not authenticated to GitHub"
- ❌ Skipped GitHub setup silently
- ❌ User had to manually run `gh auth login` and re-run refit

## What's Fixed Now

Now when running `npx @colis/rig refit`, if not authenticated:
- ✅ **Prompts user**: "Would you like to authenticate with GitHub now?"
- ✅ If YES: Opens browser for `gh auth login`
- ✅ If NO: Skips GitHub setup (user choice)
- ✅ Clear feedback at each step

## New Flow

### Interactive Mode (Normal Usage)
```
🐙 Setting up GitHub repository...
  ⚠ Not authenticated to GitHub
? Would you like to authenticate with GitHub now? (Y/n)

[User chooses YES]
  Opening browser for authentication...
  [Browser opens, user authenticates]
  ✓ Authenticated as username
  Creating GitHub repository...
  ✓ Created repository: https://github.com/username/project
  ✓ Added remote origin
  ✓ Initial commit pushed to origin
```

### If User Declines
```
? Would you like to authenticate with GitHub now? No
  ⊘ GitHub setup skipped
```

### Non-Interactive/CI Mode
```
  ℹ GitHub sync skipped (CI/non-interactive mode)
```

## Code Changes

Updated `packages/rig/src/features/commissioning/github-repo-manager.ts`:

**Before:**
```typescript
if (interactive) {
  authResult = await ensureGhAuth();
} else {
  authResult = await checkGhAuth();
}

if (!authResult.authenticated) {
  // Just warn and skip
  console.log('⚠ Not authenticated');
  return result;
}
```

**After:**
```typescript
if (interactive) {
  // Check first
  authResult = await checkGhAuth();
  
  if (!authResult.authenticated && !dryRun) {
    // Offer to authenticate
    console.log('⚠ Not authenticated to GitHub');
    const { shouldAuth } = await inquirer.prompt([{
      type: 'confirm',
      message: 'Would you like to authenticate with GitHub now?',
      default: true,
    }]);

    if (shouldAuth) {
      authResult = await ensureGhAuth(); // Prompts for login
      if (authResult.authenticated) {
        console.log('✓ Authenticated');
      }
    } else {
      // User declined
      return result;
    }
  }
}
```

## Benefits

1. **More Interactive**: User is guided through the process
2. **Better UX**: Clear choice, not just a warning
3. **Fewer Steps**: Authentication happens in the same command
4. **Still Non-Blocking**: User can decline and continue
5. **CI-Safe**: Non-interactive mode still works correctly

## Testing the Fix

Run refit on a project where you're not authenticated:

```bash
cd your-project
npx @colis/rig refit
```

**Expected behavior:**
1. Detects you're not authenticated
2. Asks: "Would you like to authenticate with GitHub now?"
3. If yes: Opens browser for auth, continues with GitHub setup
4. If no: Skips GitHub setup cleanly

## When This Prompt Appears

The authentication prompt will appear:
- ✅ In `rig init` (when creating GitHub repo)
- ✅ In `rig refit` (when updating and setting up GitHub)
- ✅ In `rig github-sync` (standalone GitHub sync)
- ❌ In CI mode (skips silently)
- ❌ In non-TTY mode (skips silently)

---

**Now refit will offer to authenticate you interactively! Much better UX. 🎉**
