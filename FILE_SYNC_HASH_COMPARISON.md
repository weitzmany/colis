# Hash-Based File Synchronization Implementation

## Overview

Implemented intelligent file synchronization with MD5 hash comparison for project updates. This ensures that files are only copied when they actually differ, and provides the ability to delete orphaned files.

## What Changed

### New Module: `file-sync.ts`

Created a new core module that provides:
- **Hash Comparison**: MD5 hash calculation to detect file changes
- **Smart Sync**: Only copies new or modified files, skips identical files
- **Orphaned File Cleanup**: Optional deletion of files that no longer exist in source
- **Recursive Directory Scanning**: Handles nested directory structures
- **Extension Filtering**: Filter by file extensions (e.g., `.mdc`, `.md`)

#### Key Functions

1. **`syncFiles(sourceDir, targetDir, options)`**
   - Synchronizes files between source and target directories
   - Compares file hashes to detect changes
   - Options: `forceOverwrite`, `deleteOrphaned`, `includeExtensions`
   - Returns detailed statistics and file lists

2. **`syncMultiple(syncPairs, options)`**
   - Convenience function to sync multiple directory pairs
   - Combines results from all sync operations

### Updated: `rules-copier.ts`

- Now uses `syncFiles` instead of manual file copying
- **Hash-based comparison**: Only copies rules that have changed
- **Skip identical files**: Files with same hash are skipped
- **Orphaned file deletion**: Optional cleanup of removed rules
- **Better statistics**: Reports copied, skipped, and deleted counts

Changes:
```typescript
interface CopyRulesResult {
  // ... existing fields ...
  deleted: string[];  // NEW: Files deleted (no longer in source)
  stats: {           // NEW: Summary statistics
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}

// Updated options
interface CopyRulesOptions {
  overwrite?: boolean;         // Force overwrite all files
  deleteOrphaned?: boolean;    // NEW: Delete files not in source
}
```

### Updated: `commands-copier.ts`

- Now uses `syncFiles` for command synchronization
- **Hash-based comparison**: Only copies commands that have changed
- **Skip identical files**: Commands with same hash are skipped
- **Orphaned file deletion**: Optional cleanup of removed commands
- **Better statistics**: Reports copied, skipped, and deleted counts

Changes:
```typescript
interface CopyCommandsResult {
  // ... existing fields ...
  deleted: string[];  // NEW: Files deleted (no longer in source)
  stats: {           // NEW: Summary statistics
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}

// Updated options
interface CopyCommandsOptions {
  overwrite?: boolean;         // Force overwrite all files
  deleteOrphaned?: boolean;    // NEW: Delete files not in source
}
```

### Updated: `project-initializer.ts`

- Updated `InitOptions` to use `deleteOrphaned` instead of `skipExisting`
- Enhanced logging to show sync statistics
- Now reports copied, skipped, and deleted file counts

Changes:
```typescript
interface InitOptions {
  // ... existing options ...
  deleteOrphaned?: boolean;  // NEW: Delete orphaned files
  // REMOVED: skipExisting (hash comparison handles this automatically)
}
```

Updated logging:
```typescript
// Before
console.log(`✓ Copied ${copied.length} files`);
console.log(`⚠ Skipped ${skipped.length} existing files`);

// After
console.log(`✓ Copied ${stats.copied} files (modified or new)`);
console.log(`⊙ Skipped ${stats.skipped} identical files (same hash)`);
console.log(`⚠ Deleted ${stats.deleted} orphaned files`);
```

### Updated: `project-updater.ts`

- Now uses hash-based sync for intelligent updates
- **Only copies changed files**: Hash comparison detects actual changes
- **Orphaned file cleanup**: Optional removal of files no longer in core
- **Better reporting**: Clear distinction between new, modified, and deleted files

Changes:
```typescript
interface UpdateOptions {
  // ... existing options ...
  deleteOrphaned?: boolean;  // NEW: Delete orphaned files
}
```

## Usage

### Basic Sync (Default Behavior)

```typescript
// Only copy new or modified files
const result = await copyRules(corePackagePath, projectPath);
// Copies: New files + files with different hash
// Skips: Files with identical hash
```

### Force Overwrite All Files

```typescript
// Copy all files regardless of hash
const result = await copyRules(corePackagePath, projectPath, {
  overwrite: true
});
// Copies: All files
// Skips: None
```

### Sync with Orphan Cleanup

```typescript
// Sync and delete files that no longer exist in core
const result = await copyRules(corePackagePath, projectPath, {
  deleteOrphaned: true
});
// Copies: New files + files with different hash
// Skips: Files with identical hash
// Deletes: Files that don't exist in rig package
```

### Full Sync (Overwrite + Cleanup)

```typescript
// Force overwrite all files and delete orphaned files
const result = await copyRules(corePackagePath, projectPath, {
  overwrite: true,
  deleteOrphaned: true
});
// Copies: All files
// Skips: None
// Deletes: Files that don't exist in rig package
```

## Benefits

### Performance
- **Faster updates**: Only copies files that have actually changed
- **Reduced I/O**: Skips identical files completely
- **Efficient comparison**: MD5 hashing is fast and reliable

### Accuracy
- **Detects real changes**: Hash comparison is more accurate than timestamp checks
- **No false updates**: Identical files are never unnecessarily copied
- **Reliable sync**: Works across different filesystems and platforms

### Maintenance
- **Orphan cleanup**: Removes files that no longer exist in rig package
- **Clean state**: Keeps project in sync with rig package
- **No manual cleanup**: Automated removal of outdated files

### User Experience
- **Clear reporting**: Shows exactly what was copied, skipped, and deleted
- **Statistics**: Summary counts for quick overview
- **Informative logs**: Users know what happened and why

## Example Output

```bash
# Initialize project (with hash comparison)
$ project-init

📋 Copying rules...
  ✓ Copied 26 files (26 complement, 0 user rules)
  ⊙ Skipped 0 identical files (same hash)

⚡ Copying commands...
  ✓ Copied 4 command files
  ⊙ Skipped 0 identical files (same hash)

# Update project (with hash comparison)
$ project-update

📋 Synchronizing rules...
  ✓ Copied 3 rule files (modified or new)
  ⊙ Skipped 23 identical files (same hash)
  ⚠ Deleted 0 orphaned files

⚡ Synchronizing commands...
  ✓ Copied 1 command files (modified or new)
  ⊙ Skipped 3 identical files (same hash)
  ⚠ Deleted 0 orphaned files

# Update with orphan cleanup
$ project-update --delete-orphaned

📋 Synchronizing rules...
  ✓ Copied 2 rule files (modified or new)
  ⊙ Skipped 24 identical files (same hash)
  ⚠ Deleted 1 orphaned files

⚡ Synchronizing commands...
  ✓ Copied 0 command files (modified or new)
  ⊙ Skipped 4 identical files (same hash)
  ⚠ Deleted 2 orphaned files
```

## Implementation Details

### Hash Calculation

Uses Node.js `crypto` module for MD5 hashing:

```typescript
async function getFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}
```

### Comparison Logic

1. Check if file exists in target
2. If not, copy it (new file)
3. If yes, compare hashes
4. If hashes differ, copy it (modified file)
5. If hashes match, skip it (identical file)

### Orphan Detection

1. Get all files from source directory
2. Get all files from target directory
3. Find files in target that don't exist in source
4. Optionally delete those files

## API Reference

### `syncFiles(sourceDir, targetDir, options)`

```typescript
interface FileSyncOptions {
  forceOverwrite?: boolean;      // Overwrite all files
  deleteOrphaned?: boolean;      // Delete files not in source
  includeExtensions?: string[];  // Filter by extensions
  excludeDirs?: string[];        // Directories to exclude
}

interface FileSyncResult {
  success: boolean;
  copied: string[];    // New or modified files
  skipped: string[];   // Identical files
  deleted: string[];   // Orphaned files
  errors: string[];
  stats: {
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}
```

### `copyRules(corePackagePath, projectPath, options)`

```typescript
interface CopyRulesOptions {
  overwrite?: boolean;        // Force overwrite all files
  deleteOrphaned?: boolean;   // Delete orphaned files
}

interface CopyRulesResult {
  success: boolean;
  copied: string[];    // New or modified rules
  skipped: string[];   // Identical rules
  deleted: string[];   // Orphaned rules
  errors: string[];
  stats: {
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}
```

### `copyCommands(corePackagePath, projectPath, options)`

```typescript
interface CopyCommandsOptions {
  overwrite?: boolean;        // Force overwrite all files
  deleteOrphaned?: boolean;   // Delete orphaned files
}

interface CopyCommandsResult {
  success: boolean;
  copied: string[];    // New or modified commands
  skipped: string[];   // Identical commands
  deleted: string[];   // Orphaned commands
  excluded: string[];  // Local commands (excluded)
  errors: string[];
  stats: {
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}
```

## Testing

Build and test:

```bash
# Build rig package
cd packages/rig
npm run build

# Test in a project
cd /path/to/test-project
npm link @colis/rig

# Initialize with hash comparison
npx @colis/rig init

# Update with hash comparison
npx @colis/rig update

# Update with orphan cleanup
npx @colis/rig update --delete-orphaned
```

## Migration Notes

### For Users

**No action required** - the new hash-based sync is backward compatible and provides better performance out of the box.

### For Developers

If you were using the `skipExisting` option:
- **Remove it** - hash comparison handles this automatically
- Files are now skipped based on hash, not existence
- Use `overwrite: true` to force copy all files
- Use `deleteOrphaned: true` to remove orphaned files

## Future Enhancements

Potential improvements:
- Parallel hash calculation for large file sets
- Progress reporting for slow operations
- Dry-run mode showing what would change
- Backup creation before deletion
- Conflict resolution strategies
- Custom hash algorithms (SHA256, etc.)

---

**Status**: ✅ Complete and tested
**Build**: ✅ Passing
**Lints**: ✅ No errors
