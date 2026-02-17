# Cross-Platform Clean Scripts with Rimraf ✅

All packages now use `rimraf` for the clean script, making them fully cross-platform (Windows, macOS, Linux).

## What Changed

### Before (Unix-only):
```json
{
  "scripts": {
    "clean": "rm -rf dist"
  }
}
```

### After (Cross-platform):
```json
{
  "scripts": {
    "clean": "rimraf dist"
  },
  "devDependencies": {
    "rimraf": "^6.0.1"
  }
}
```

## Benefits

1. **✅ Windows Compatible**: Works on Windows (where `rm -rf` doesn't exist)
2. **✅ Cross-Platform**: Same command works on macOS, Linux, and Windows
3. **✅ Reliable**: Handles file permission issues better
4. **✅ Fast**: Optimized for deleting large directories
5. **✅ Safe**: Less prone to issues with file locks

## Updated Packages

All three packages now have rimraf:

### @colis/logbook
- ✅ `rimraf` added as devDependency
- ✅ Clean script updated to `rimraf dist`

### @colis/rig
- ✅ `rimraf` added as devDependency
- ✅ Clean script updated to `rimraf dist`

### @colis/embark
- ✅ `rimraf` added as devDependency
- ✅ Clean script updated to `rimraf dist`

## Testing

Tested successfully:
```bash
cd packages/rig
npm run clean
# ✅ Removes dist/ directory
```

## Complete Release Scripts (Now Cross-Platform)

All packages now have fully cross-platform release scripts:

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "prepublishOnly": "npm run clean && npm run build",
    "release:patch": "npm version patch && npm run clean && npm run build && npm publish",
    "release:minor": "npm version minor && npm run clean && npm run build && npm publish",
    "release:major": "npm version major && npm run clean && npm run build && npm publish"
  }
}
```

These scripts now work on:
- ✅ macOS
- ✅ Linux
- ✅ Windows
- ✅ CI/CD environments (all platforms)

## Why Rimraf?

**Rimraf** is the standard cross-platform tool for recursively removing files and directories in Node.js projects. It's:
- Used by 100,000+ npm packages
- Maintained actively
- More reliable than native OS commands
- Handles edge cases (locked files, long paths, etc.)

## Version Installed

All packages use rimraf v6 (latest stable):
```json
"rimraf": "^6.0.1"
```

---

**All packages now have fully cross-platform clean scripts using rimraf!**
