# create-project update Command Implementation

## Summary

Added a new `update` subcommand to the `create-project` CLI that provides easy access to the project update functionality with hash-based synchronization.

## What Was Added

### New Command: `create-project update`

A command that performs the same workflow as `npx @your-org/core update`, but accessible via the `create-project` CLI for convenience.

```bash
# Update project with hash comparison (only copy changed files)
create-project update

# Check what would be updated without making changes
create-project update --check-only

# Force overwrite all files
create-project update --overwrite

# Sync and delete orphaned files
create-project update --delete-orphaned

# Skip specific parts
create-project update --skip-rules
create-project update --skip-commands
```

## Implementation Details

### Files Modified

1. **`bin/create-project`** - Added import and command definition
   ```javascript
   program
     .command('update')
     .description('Update an existing project (sync rules, commands, and configurations)')
     .option('--overwrite', 'Force overwrite all files regardless of hash')
     .option('--delete-orphaned', 'Delete files from project that no longer exist in core package')
     .option('--skip-rules', 'Skip synchronizing rules')
     .option('--skip-commands', 'Skip synchronizing commands')
     .option('--check-only', 'Check what would be updated without making changes')
     .action(async (options) => {
       await updateCommand({
         overwrite: options.overwrite,
         deleteOrphaned: options.deleteOrphaned,
         skipRules: options.skipRules,
         skipCommands: options.skipCommands,
         checkOnly: options.checkOnly,
       });
     });
   ```

2. **`src/cli/commands/update.ts`** - New update command implementation
   - Displays visually appealing header and status messages
   - Executes `npx @your-org/core update` with appropriate flags
   - Provides user-friendly success/error messages
   - Passes through all output from the core update command

### Command Options

- `--overwrite` - Force overwrite all files regardless of hash comparison
- `--delete-orphaned` - Delete files from project that no longer exist in core package
- `--skip-rules` - Skip synchronizing rules
- `--skip-commands` - Skip synchronizing commands
- `--check-only` - Check what would be updated without making changes (dry-run mode)

## Usage Examples

### Basic Update
```bash
create-project update
```

**Output:**
```
╔═══════════════════════════════════════════════════════════╗
║  🔄 Project Update                                        ║
╚═══════════════════════════════════════════════════════════╝

  Synchronizing project with latest core package...

📋 Synchronizing rules...
  ✓ Copied 3 files (modified or new)
  ⊙ Skipped 23 identical files (same hash)

⚡ Synchronizing commands...
  ✓ Copied 1 files (modified or new)
  ⊙ Skipped 3 identical files (same hash)

╔═══════════════════════════════════════════════════════════╗
║  ✅ Project Updated Successfully!                         ║
╚═══════════════════════════════════════════════════════════╝
```

### Check-Only Mode
```bash
create-project update --check-only
```

Shows what would be updated without making any changes.

### Full Sync with Cleanup
```bash
create-project update --overwrite --delete-orphaned
```

Forces overwrite of all files and deletes orphaned files.

## How It Works

1. **User runs command**: `create-project update [options]`
2. **Header displayed**: Shows visual header with update message
3. **Executes core update**: Calls `npx @your-org/core update` with appropriate flags
4. **Output passed through**: All output from core command shown to user
5. **Success message**: Displays success message after completion

## Integration with Core Package

The `update` command delegates to the core package's update functionality:

```typescript
// Build CLI args
const args = ['update'];
if (options.overwrite) args.push('--overwrite');
if (options.deleteOrphaned) args.push('--delete-orphaned');
// ... more options

// Execute core package update
execSync(`npx @your-org/core ${args.join(' ')}`, {
  cwd: process.cwd(),
  stdio: 'inherit', // Pass through stdout/stderr
});
```

This approach:
- ✅ Uses the latest core package functionality
- ✅ Requires minimal maintenance
- ✅ Passes through all output and messages
- ✅ Provides consistent behavior

## Benefits

### For Users

- **Convenience**: Single CLI for both creating and updating projects
- **Consistency**: Same command pattern as `create-project create`
- **Familiarity**: Users already know `create-project`, now can use it for updates
- **Discoverability**: `create-project --help` shows all available commands

### For Developers

- **Simplicity**: Delegates to core package, minimal code duplication
- **Maintainability**: Core package updates automatically reflected
- **DRY Principle**: No duplication of update logic
- **Single Source of Truth**: Update logic lives in core package

## Command Comparison

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `create-project create` | Create new project | Starting new project |
| `create-project update` | Update existing project | Synchronizing with latest core |
| `npx @your-org/core update` | Update via core package | Alternative update method |

**Note**: Both `create-project update` and `npx @your-org/core update` do the same thing - `create-project update` is just a convenience wrapper.

## Example Workflows

### Workflow 1: Create then Update
```bash
# Create a new project
create-project my-app

# ... time passes, core package is updated ...

# Update the project
cd my-app
create-project update
```

### Workflow 2: Update with Specific Options
```bash
# Check what would be updated
create-project update --check-only

# If looks good, apply changes
create-project update

# Full sync including orphan cleanup
create-project update --delete-orphaned
```

### Workflow 3: Selective Update
```bash
# Only update rules, skip commands
create-project update --skip-commands

# Only update commands, skip rules
create-project update --skip-rules
```

## Future Enhancements

Potential improvements:
- Interactive mode prompting for options
- Show diff before applying changes
- Backup creation before update
- Rollback capability
- Update history log
- Scheduled updates check

---

**Status**: ✅ Complete and tested
**Build**: ✅ Passing
**Integration**: ✅ Works with core package

The `create-project update` command is now available and ready to use!
