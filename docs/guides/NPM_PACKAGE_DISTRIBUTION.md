# NPM Package Distribution Guide

This guide explains how to create an npm package that distributes Cursor rules, commands, and documentation to projects.

**⚠️ PLANNING MODE**: This guide describes the planned approach for creating an npm package. This is documentation only.

**Last Updated**: 2026-01-05  
**Status**: Planning/Documentation Only

## Overview

An npm package can distribute any type of files, not just JavaScript code. You can package:
- **Rules** (`.mdc` files) - Cursor IDE rules
- **Commands** (`.md` files) - Cursor IDE commands
- **Documentation** (`.md` files) - Guides and references
- **Scripts** (`.sh`, `.py`, `.js` files) - Validation and setup scripts
- **Templates** - Project templates and boilerplate

## How NPM Packages Work for Non-Code Assets

### Key Concepts

1. **Package Structure**: npm packages can contain any files, not just code
2. **Installation Scripts**: Use `postinstall` to run scripts after installation
3. **Bin Scripts**: Executable scripts accessible via `npx` or `npm run`
4. **File Distribution**: Files in package are copied to `node_modules/`
5. **Custom Installation**: Scripts can copy files from `node_modules/` to project directories

### The Distribution Flow

```
1. Package Published
   └─> Contains: templates/.cursor/rules/, templates/.cursor/commands/, etc.

2. Project Installs Package
   npm install @your-org/cursor-standards
   └─> Package installed to: node_modules/@your-org/cursor-standards/

3. Postinstall Script Runs
   postinstall: "node lib/install.js"
   └─> Copies files from node_modules/.../templates/ to project/.cursor/

4. Files Available in Project
   └─> .cursor/rules/, .cursor/commands/ ready to use
```

## Package Structure

### What Goes in the Package

```
cursor-standards/
├── package.json              # Package metadata and scripts
├── README.md                 # Package documentation
├── LICENSE                   # License file
├── .npmignore               # Files to exclude from package
│
├── templates/               # Source files to distribute
│   ├── .cursor/
│   │   ├── rules/
│   │   │   ├── user/
│   │   │   │   ├── documentation_structure.mdc
│   │   │   │   ├── planning_mode.mdc
│   │   │   │   └── security_and_secrets.mdc
│   │   │   └── experts/
│   │   │       └── [all expert personas]
│   │   └── commands/
│   │       ├── general/
│   │       └── local/
│   └── scripts/
│       └── validate-documentation.sh
│
├── lib/                      # Installation utilities
│   └── install.js           # Script that copies templates to project
│
└── bin/                      # Executable scripts
    ├── install-cursor-rules # CLI command
    └── validate-documentation
```

### Why This Structure?

- **`templates/`**: Contains the actual files to distribute (rules, commands, etc.)
- **`lib/install.js`**: JavaScript script that copies files from templates to project
- **`bin/`**: Executable commands users can run with `npx`
- **`package.json`**: Defines scripts, bin commands, and metadata

## Package.json Configuration

### Essential Fields

```json
{
  "name": "@your-org/cursor-standards",
  "version": "1.0.0",
  "description": "Cursor IDE rules, commands, and expert personas",
  
  "files": [
    "templates/",
    "lib/",
    "bin/",
    "README.md"
  ],
  
  "scripts": {
    "postinstall": "node lib/install.js"
  },
  
  "bin": {
    "install-cursor-rules": "./bin/install-cursor-rules",
    "validate-documentation": "./bin/validate-documentation"
  }
}
```

### Field Explanations

- **`files`**: Which files/directories to include in the published package
- **`scripts.postinstall`**: Runs automatically after `npm install`
- **`bin`**: Makes scripts executable via `npx` or `npm run`

## Installation Script Logic

### How Installation Works

The installation script (`lib/install.js`) does the following:

1. **Locate Package Directory**:
   ```javascript
   const PACKAGE_DIR = path.resolve(__dirname, '..');
   // Points to: node_modules/@your-org/cursor-standards/
   ```

2. **Locate Project Root**:
   ```javascript
   const TARGET_DIR = process.cwd();
   // Points to: project root (where package.json is)
   ```

3. **Copy Files**:
   ```javascript
   // Copy from: node_modules/.../templates/.cursor/rules/
   // Copy to:   project/.cursor/rules/
   copyDirectory(
     path.join(PACKAGE_DIR, 'templates', '.cursor', 'rules'),
     path.join(TARGET_DIR, '.cursor', 'rules')
   );
   ```

### Why This Approach?

- **Automatic**: Runs on `npm install`, no manual steps
- **Non-Destructive**: Can check if files exist before overwriting
- **Flexible**: Can install selectively (rules only, commands only, etc.)
- **Versioned**: Each package version can have different files

## Step-by-Step: Creating the Package

### Step 1: Prepare Source Files

1. **Organize your files**:
   - Put rules in `.cursor/rules/`
   - Put commands in `.cursor/commands/`
   - Put scripts in `scripts/`

2. **Create templates directory**:
   ```bash
   mkdir -p templates/.cursor/rules/user
   mkdir -p templates/.cursor/rules/experts
   mkdir -p templates/.cursor/commands/local
   mkdir -p templates/scripts
   ```

3. **Copy files to templates**:
   ```bash
   cp .cursor/rules/user/*.mdc templates/.cursor/rules/user/
   cp .cursor/rules/experts/*.mdc templates/.cursor/rules/experts/
   cp .cursor/commands/local/*.md templates/.cursor/commands/local/
   cp scripts/*.sh templates/scripts/
   ```

### Step 2: Create Installation Script

Create `lib/install.js` that:
- Reads files from `templates/` directory (in package)
- Copies them to project root `.cursor/` directory
- Handles errors gracefully
- Provides feedback to user

### Step 3: Create package.json

Define:
- Package name and version
- Files to include (`templates/`, `lib/`, `bin/`)
- Postinstall script
- Bin commands

### Step 4: Test Locally

```bash
# Create package file
npm pack
# Creates: your-org-cursor-standards-1.0.0.tgz

# Test in a project
cd /path/to/test-project
npm install /path/to/package.tgz

# Verify files copied
ls -la .cursor/rules/
ls -la .cursor/commands/
```

### Step 5: Publish

```bash
# Update version
npm version patch

# Publish
npm publish --access public
```

## Usage in Projects

### Installation

```bash
# Install from npm
npm install --save-dev @your-org/cursor-standards
```

### What Happens

1. Package downloads to `node_modules/@your-org/cursor-standards/`
2. `postinstall` script runs automatically
3. Script copies files from `templates/` to project `.cursor/`
4. Rules and commands are ready to use

### Manual Installation

If automatic installation doesn't work or user wants to reinstall:

```bash
# Run installation script manually
npx install-cursor-rules

# Or use npm script
npm run install:rules
```

## Advanced Features

### Selective Installation

Allow users to install only what they need:

```javascript
// lib/install.js
const installRules = process.argv.includes('--rules');
const installCommands = process.argv.includes('--commands');

if (installRules) {
  copyRules();
}
if (installCommands) {
  copyCommands();
}
```

Usage:
```bash
npm run install:rules      # Only rules
npm run install:commands  # Only commands
```

### Configuration File

Allow projects to configure installation:

```json
// .cursor-config.json in project
{
  "install": {
    "rules": true,
    "commands": true,
    "experts": false
  }
}
```

### Update Detection

Check if files need updating:

```javascript
// Compare package version with installed version
const packageVersion = require('../package.json').version;
const installedVersion = readFile('.cursor/.version');

if (packageVersion !== installedVersion) {
  console.log('Updating from', installedVersion, 'to', packageVersion);
  installFiles({ force: true });
}
```

## Distribution Strategies

### Strategy 1: Copy on Install (Recommended)

**How**: Files copied from `node_modules/` to project root on install

**Pros**:
- Files in project, easy to customize
- Works with version control
- No dependency on node_modules

**Cons**:
- Files duplicated in each project
- Updates require reinstall

**Best For**: Rules, commands, configuration files

### Strategy 2: Symlink

**How**: Create symlinks from project to package

**Pros**:
- Single source of truth
- Automatic updates when package updates

**Cons**:
- Requires node_modules to exist
- Platform-specific (Windows vs Unix)
- Can break if package removed

**Best For**: Shared resources that shouldn't be customized

### Strategy 3: Reference Only

**How**: Package provides files, project references them

**Pros**:
- No file copying
- Always uses latest from package

**Cons**:
- Requires node_modules
- Harder to customize
- Cursor may not find files in node_modules

**Best For**: Documentation, templates

## File Organization in Package

### What to Include

✅ **Include**:
- Rules (`.mdc` files)
- Commands (`.md` files)
- Installation scripts
- Validation scripts
- README and documentation

❌ **Exclude**:
- Source code (if using build process)
- Test files
- Development tools
- Git history
- CI/CD configs

### .npmignore

Control what gets published:

```
# Exclude
.git/
node_modules/
*.log
.DS_Store
src/
test/

# Include
templates/
lib/
bin/
README.md
```

## Version Management

### Semantic Versioning

- **Patch** (1.0.1): Bug fixes, minor rule updates
- **Minor** (1.1.0): New experts, new commands, new rules
- **Major** (2.0.0): Breaking changes, major restructures

### Updating Projects

```bash
# Update package
npm update @your-org/cursor-standards

# Reinstall files (if needed)
npx install-cursor-rules --force
```

## Best Practices

### 1. Non-Destructive Installation

- Check if files exist before overwriting
- Use `--force` flag for overwrite
- Backup existing files if needed

### 2. Clear Feedback

- Show what's being installed
- Indicate success/failure
- Provide next steps

### 3. Error Handling

- Handle missing directories gracefully
- Provide helpful error messages
- Don't fail silently

### 4. Documentation

- Clear README with usage examples
- Document all configuration options
- Provide troubleshooting guide

### 5. Testing

- Test installation in clean directories
- Test with different Node.js versions
- Test in CI/CD environments

## Common Patterns

### Pattern 1: Simple Copy

```javascript
// Copy all files from templates to project
copyDirectory('templates/.cursor', '.cursor');
```

### Pattern 2: Selective Copy

```javascript
// Copy only if flag provided
if (options.rules) {
  copyDirectory('templates/.cursor/rules', '.cursor/rules');
}
```

### Pattern 3: Merge with Existing

```javascript
// Copy only if file doesn't exist
if (!fs.existsSync(targetFile)) {
  copyFile(sourceFile, targetFile);
}
```

### Pattern 4: Update Detection

```javascript
// Only copy if version changed
if (needsUpdate()) {
  copyFiles({ force: true });
  saveVersion();
}
```

## Troubleshooting

### Files Not Installing

**Problem**: Files not appearing after install

**Solutions**:
- Check `postinstall` script runs
- Verify `templates/` directory exists in package
- Check file permissions
- Run installation script manually

### Scripts Not Executable

**Problem**: Scripts not runnable after install

**Solutions**:
- Set executable bit in package
- Use `chmod` in install script
- Check `.npmignore` doesn't exclude scripts

### Version Conflicts

**Problem**: Multiple versions installed

**Solutions**:
- Use `npm ls` to check versions
- Remove duplicates
- Reinstall package

## Example: Complete Package

### Directory Structure

```
cursor-standards/
├── package.json
├── README.md
├── LICENSE
├── .npmignore
├── templates/
│   ├── .cursor/
│   │   ├── rules/
│   │   └── commands/
│   └── scripts/
├── lib/
│   └── install.js
└── bin/
    └── install-cursor-rules
```

### Installation Flow

1. User: `npm install @your-org/cursor-standards`
2. npm: Downloads package to `node_modules/`
3. npm: Runs `postinstall` script
4. Script: Copies `templates/.cursor/` → `.cursor/`
5. Result: Rules and commands available in project

### Usage

```bash
# Install
npm install --save-dev @your-org/cursor-standards

# Files automatically installed to .cursor/

# Use commands
npx validate-documentation

# Update
npm update @your-org/cursor-standards
```

## Summary

Creating an npm package for rules, commands, and docs involves:

1. **Organize files** in `templates/` directory
2. **Create installation script** that copies files to project
3. **Configure package.json** with postinstall script
4. **Test locally** with `npm pack`
5. **Publish** to npm registry

The key insight: npm packages can distribute any files, not just code. Use `postinstall` scripts to copy files from `node_modules/` to project directories where they're needed.

### Mobile Considerations for NPM Package Distribution

When distributing npm packages that will be used on mobile devices:

1. **Mobile Installation**
   - Package size should be optimized for mobile bandwidth constraints
   - Installation scripts should be efficient on mobile devices
   - Consider mobile storage limitations when including large templates or assets

2. **Mobile File System**
   - File copying operations should handle slower mobile storage gracefully
   - Directory creation should be optimized for mobile file systems
   - Consider mobile path length limitations in file organization

3. **Mobile Development Workflow**
   - Postinstall scripts should work with mobile development environments
   - Package should support mobile SSH/terminal workflows
   - Installation process should be mobile-terminal friendly

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (npm package distribution, package publishing, npm publishing, file distribution)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive distribution examples and workflow descriptions for content depth

2. **Technical Documentation SEO**
   - Document npm distribution process with clear, searchable descriptions
   - Include code examples demonstrating package structure and installation
   - Use semantic HTML structure in documentation
   - Add internal links to related npm and package management documentation

3. **Content Quality for Search**
   - Ensure guide answers common npm distribution queries
   - Include troubleshooting sections for common distribution issues
   - Provide comprehensive distribution workflow reference documentation
   - Maintain documentation freshness with npm and distribution tooling updates

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive guide explaining how to create an npm package that distributes Cursor rules, commands, and documentation. This guide covers how npm packages work for non-code assets (key concepts, distribution flow), package structure (what goes in package, why this structure), package.json configuration (essential fields, field explanations), installation script logic (how installation works, why this approach), step-by-step creation process (prepare source files, create installation script, create package.json, test locally, publish), usage in projects (installation, what happens, manual installation), advanced features (selective installation, configuration file, update detection), distribution strategies (copy on install, symlink, reference only), file organization (what to include/exclude, .npmignore), version management (semantic versioning, updating projects), best practices (non-destructive installation, clear feedback, error handling, documentation, testing), common patterns (simple copy, selective copy, merge with existing, update detection), troubleshooting (files not installing, scripts not executable, version conflicts), and complete example with directory structure, installation flow, and usage. This guide provides a complete understanding of how to package and distribute non-code assets via npm.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for npm package distribution section covering mobile installation (package size optimization, efficient installation scripts, mobile storage limitations), mobile file system (file copying operations, directory creation, path length limitations), and mobile development workflow (mobile development environments, SSH/terminal workflows, mobile-terminal friendly installation). This addition ensures npm package distribution accounts for mobile device constraints and mobile development workflows.

---

