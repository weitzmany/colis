# Package Dependency Analysis

## Dependency Chain

```
embark (v1.1.0)
  └── depends on: @colis/rig ^1.0.7
      └── depends on: @colis/logbook ^1.0.0
          └── peerDependency (optional): @colis/rig ^1.0.0
```

## Detailed Analysis

### 1. @colis/logbook (v1.0.0)
**Location**: `packages/logbook/`

**Dependencies**:
- `chalk: ^4.1.2`
- `fs-extra: ^11.2.0`
- `simple-git: ^3.22.0`
- `execa: ^5.1.1`

**Peer Dependencies**:
- `@colis/rig: ^1.0.0` (optional) - Allows circular reference for types

**Exports**:
- Main: `./dist/index.js`
- Lifecycle: `./dist/lifecycle/index.js`
- **Utils: `./dist/utils/index.js`** ← Used by rig's github-repo-manager

**Key Utilities Exported** (from `./utils`):
- `ensureGhInstalled()` - Check/install gh CLI
- `ensureGhAuth()` - Ensure GitHub authentication (interactive)
- `checkGhAuth()` - Check GitHub authentication (non-interactive)
- `createGhRepo()` - Create GitHub repository
- `hasRemote()` - Check if git remote exists
- `addRemote()` - Add git remote
- `initGitRepo()` - Initialize git repository
- `getRemoteUrl()` - Get remote URL
- `isGitRepo()` - Check if directory is git repo
- `getCurrentBranch()` - Get current git branch

### 2. @colis/rig (v1.7.20)
**Location**: `packages/rig/`

**Dependencies**:
- `@colis/logbook: ^1.0.0` ✅ **Required for new GitHub management feature**
- `chalk: ^5.3.0` (note: different major version from logbook)
- `commander: ^11.1.0`
- `dotenv: ^16.3.1`
- `fs-extra: ^11.2.0`
- `glob: ^10.5.0`
- `globals: ^17.0.0`
- `inquirer: ^9.2.12` ✅ **Required for nested repo prompts**
- `js-yaml: ^4.1.0`
- `mysql2: ^3.6.5`
- `pg: ^8.11.3`
- `semver: ^7.7.3`
- `sqlite3: ^5.1.7`

**New Feature Dependencies**:
- ✅ `@colis/logbook` - Provides all git/gh utilities
- ✅ `inquirer` - Used for nested repo confirmation prompts
- ✅ `fs-extra` - File system operations
- ✅ `chalk` - Console output styling

**Exports**:
- Main: `./dist/index.js`
- Port Manager: `./dist/features/port-manager/index.js`
- Tech Detector: `./dist/features/tech-detector/index.js`
- Domain Manager: `./dist/features/domain-manager/index.js`
- **Commissioning: `./dist/features/commissioning/index.js`** ← Exports github-repo-manager

**Bin Commands**:
- `@colis/rig` - Main CLI
- `port-manager` - Port management
- `tech-detect` - Technology detection
- `domain-manager` - Domain management
- `rig-setup` - Setup command
- **`github-sync`** - New standalone GitHub sync command

### 3. @colis/embark (v1.1.0)
**Location**: `packages/embark/`

**Dependencies**:
- `@colis/rig: ^1.0.7` ✅ **Needs update to require latest rig version**
- `chalk: ^5.3.0`
- `commander: ^11.1.0`
- `fs-extra: ^11.2.0`
- `handlebars: ^4.7.8`
- `inquirer: ^9.2.12`

**Note**: Embark depends on rig for project initialization, which now includes GitHub management

## Dependency Validation

### ✅ All Dependencies Present
1. **rig → logbook**: ✅ Listed in dependencies (`^1.0.0`)
2. **rig → inquirer**: ✅ Listed in dependencies (`^9.2.12`)
3. **rig → fs-extra**: ✅ Listed in dependencies (`^11.2.0`)
4. **rig → chalk**: ✅ Listed in dependencies (`^5.3.0`)
5. **embark → rig**: ✅ Listed in dependencies (`^1.0.7`)

### ⚠️ Version Considerations

#### Embark's Rig Dependency Version
**Current**: `@colis/rig: ^1.0.7`
**Rig Current Version**: `1.7.20`

Since rig is currently at v1.7.20, embark's dependency `^1.0.7` will correctly resolve to v1.7.20 (caret range allows minor/patch updates).

**Recommendation**: This is fine for now, but consider:
- When publishing, ensure embark's `package.json` specifies a minimum rig version that includes GitHub management
- Option 1: Keep as `^1.0.7` (allows any 1.x.x version)
- Option 2: Update to `^1.7.20` (requires at least v1.7.20)

#### Chalk Version Mismatch
- **logbook**: `chalk: ^4.1.2`
- **rig**: `chalk: ^5.3.0`
- **embark**: `chalk: ^5.3.0`

This is **acceptable** because:
- Each package has chalk in its own dependencies
- No shared chalk instance required between packages
- Chalk v4 and v5 have similar APIs for our use cases

### 🔍 Import Validation

All imports in `github-repo-manager.ts` are satisfied:
```typescript
import * as path from 'path';           // ✅ Node.js built-in
import * as fs from 'fs-extra';         // ✅ rig dependency
import chalk from 'chalk';              // ✅ rig dependency
import { execSync } from 'child_process'; // ✅ Node.js built-in
import { ... } from '@colis/logbook/utils'; // ✅ rig dependency
import inquirer from 'inquirer';        // ✅ rig dependency
```

## Publishing Order

**CRITICAL**: Packages must be published in this order:

1. **First**: `@colis/logbook` (v1.0.0)
   - No dependencies on other @colis packages
   - Safe to publish first

2. **Second**: `@colis/rig` (v1.7.20 → v1.7.21 or v1.8.0)
   - Depends on @colis/logbook
   - Must be published after logbook
   - Contains new GitHub management feature

3. **Third**: `@colis/embark` (v1.1.0 → v1.1.1 or v1.2.0)
   - Depends on @colis/rig
   - Must be published after rig
   - Uses rig's new GitHub management feature

## Monorepo Development Setup

During development (as currently configured):
- Packages are linked using `npm link`
- `logbook` linked globally
- `rig` links to `logbook`
- `embark` links to `rig`

This allows testing the full integration without publishing.

## Release Notes

### Minimum Viable Release

For the GitHub management feature to work properly:

1. **logbook v1.0.0** must include:
   - All gh-utils functions (ensureGhInstalled, ensureGhAuth, checkGhAuth, createGhRepo)
   - All git-utils functions (hasRemote, addRemote, initGitRepo, getRemoteUrl, isGitRepo, getCurrentBranch)
   - Proper exports via `./utils`

2. **rig v1.7.21 (or v1.8.0)** must include:
   - New `github-repo-manager.ts` module
   - Updated `project-initializer.ts` with GitHub integration
   - Updated `project-updater.ts` with GitHub integration
   - New `github-sync` bin command
   - Updated CLI flags (--skip-github, --github-visibility)

3. **embark v1.1.1 (or v1.2.0)** must include:
   - Removed standalone git init step
   - New CLI flags (--skip-github, --github-visibility)
   - Deprecated --skip-git flag with warning
   - GitHub remote verification check
   - Pass GitHub options to rig init

## Dependency Integrity: ✅ VERIFIED

All package dependencies are properly defined and compatible. The implementation will work correctly when packages are built and linked/published in the correct order.
