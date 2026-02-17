# Release Scripts - Standardized Across All Packages ✅

All packages now have consistent release scripts following the same pattern.

## Standard Release Scripts

All three packages (`logbook`, `rig`, `embark`) now have:

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run clean && npm run build",
    "release:patch": "npm version patch && npm run clean && npm run build && npm publish",
    "release:minor": "npm version minor && npm run clean && npm run build && npm publish",
    "release:major": "npm version major && npm run clean && npm run build && npm publish"
  }
}
```

## Usage

### Patch Release (Bug fixes)
```bash
npm run release:patch
```
- Increments: `1.0.0` → `1.0.1`
- Use for: Bug fixes, documentation updates, small tweaks

### Minor Release (New features)
```bash
npm run release:minor
```
- Increments: `1.0.0` → `1.1.0`
- Use for: New features, backward-compatible changes

### Major Release (Breaking changes)
```bash
npm run release:major
```
- Increments: `1.0.0` → `2.0.0`
- Use for: Breaking changes, API changes

## What Each Script Does

1. **`npm version [patch|minor|major]`**
   - Updates version in package.json
   - Creates git commit with version bump
   - Creates git tag

2. **`npm run clean`**
   - Removes the `dist/` directory
   - Ensures fresh build

3. **`npm run build`**
   - Compiles TypeScript to JavaScript
   - Generates type definitions

4. **`npm publish`**
   - Publishes package to npm registry
   - Uses files from `dist/` directory

## Publishing Order for GitHub Feature

When ready to publish this GitHub management feature:

### 1. Logbook (patch or no change needed)
```bash
cd packages/logbook
# If changes were made:
npm run release:patch  # 1.0.0 → 1.0.1
# Otherwise, no release needed
```

### 2. Rig (minor recommended)
```bash
cd packages/rig
npm run release:minor  # 1.7.20 → 1.8.0
```

### 3. Embark (minor recommended)
```bash
cd packages/embark
npm install @colis/rig@latest  # Get newly published rig
npm run release:minor  # 1.1.0 → 1.2.0
```

## Pre-publish Checklist

Before running release scripts, ensure:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Changes are committed to git
- [ ] You're on the correct branch (main/master)
- [ ] You're logged into npm: `npm whoami`
- [ ] You have publish permissions for @colis scope

## Changes Made

### @colis/logbook
**Added**:
- `prepublishOnly` script
- `release:patch` script
- `release:minor` script
- `release:major` script

### @colis/rig
**Status**: Already had correct scripts ✅

### @colis/embark
**Changed**:
- Removed custom `update:dependencies` script
- Removed intermediate `release` script
- Updated `release:patch`, `release:minor`, `release:major` to match rig's pattern
- Scripts now directly: version → clean → build → publish

## Benefits of Standardization

1. **Consistency**: Same workflow across all packages
2. **Simplicity**: One command does everything
3. **Safety**: Always builds fresh before publishing
4. **Git Integration**: Automatic version commits and tags
5. **Predictability**: Same behavior for all developers

## Testing Release Scripts (Dry Run)

To test without actually publishing:

```bash
# Test the version bump and build (but don't publish)
npm version patch --no-git-tag-version
npm run clean
npm run build
# Check that dist/ looks correct
# Then reset: git checkout package.json
```

---

**All packages now have standardized release scripts. Ready to use when you're ready to publish!**
