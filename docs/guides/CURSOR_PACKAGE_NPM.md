# Cursor Rules & Commands NPM Package Guide

**⚠️ PLANNING MODE**: This guide describes the planned structure and implementation for packaging Cursor rules, commands, and expert personas as an npm package. This is documentation only - no actual implementation files have been created yet.

This guide explains how to package Cursor rules, commands, and expert personas as an npm package for easy distribution across all projects.

**Last Updated**: 2026-01-05  
**Status**: Planning/Documentation Only

## Overview

Packaging Cursor rules and commands as an npm package provides:
- ✅ **Easy Installation**: `npm install @your-org/compass`
- ✅ **Version Management**: Track versions and updates
- ✅ **Automatic Updates**: Update all projects with `npm update`
- ✅ **Dependency Management**: Standard npm workflow
- ✅ **CI/CD Integration**: Install in CI/CD pipelines
- ✅ **Workspace Support**: Works with npm workspaces and monorepos

## Package Structure

### Recommended Package Structure

```
compass/
├── package.json                 # Package configuration
├── README.md                    # Package documentation
├── LICENSE                      # License file
├── .npmignore                  # Files to exclude from package
├── bin/                        # Executable scripts
│   ├── install-cursor-rules    # Installation script
│   └── validate-documentation  # Validation script
├── templates/                  # Template files
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
│       ├── validate-documentation.sh
│       └── setup-project.sh
├── lib/                        # JavaScript utilities (if needed)
│   └── install.js
└── docs/                       # Package documentation
    └── USAGE.md
```

## Package.json Configuration

### Basic package.json

```json
{
  "name": "@your-org/compass",
  "version": "1.0.0",
  "description": "Cursor IDE rules, commands, and expert personas for consistent development standards",
  "keywords": [
    "cursor",
    "rules",
    "commands",
    "standards",
    "documentation",
    "ai-assistant"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/compass.git"
  },
  "files": [
    "templates/",
    "bin/",
    "lib/",
    "README.md",
    "LICENSE"
  ],
  "bin": {
    "install-cursor-rules": "./bin/install-cursor-rules",
    "validate-documentation": "./bin/validate-documentation"
  },
  "scripts": {
    "postinstall": "node lib/install.js",
    "test": "echo \"No tests specified\" && exit 0",
    "prepublishOnly": "npm run test"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### Advanced package.json with Scripts

```json
{
  "name": "@your-org/compass",
  "version": "1.0.0",
  "description": "Cursor IDE rules, commands, and expert personas for consistent development standards",
  "keywords": [
    "cursor",
    "rules",
    "commands",
    "standards",
    "documentation",
    "ai-assistant",
    "expert-personas"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/compass.git"
  },
  "files": [
    "templates/",
    "bin/",
    "lib/",
    "README.md",
    "LICENSE",
    "docs/"
  ],
  "bin": {
    "install-cursor-rules": "./bin/install-cursor-rules",
    "validate-documentation": "./bin/validate-documentation",
    "update-cursor-rules": "./bin/update-cursor-rules"
  },
  "scripts": {
    "postinstall": "node lib/install.js",
    "install:rules": "node lib/install.js --rules",
    "install:commands": "node lib/install.js --commands",
    "install:experts": "node lib/install.js --experts",
    "install:all": "node lib/install.js --all",
    "validate": "./bin/validate-documentation",
    "test": "npm run validate",
    "prepublishOnly": "npm run validate"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "peerDependencies": {},
  "devDependencies": {
    "markdownlint-cli": "^0.38.0",
    "markdown-link-check": "^0.11.0"
  }
}
```

## Installation Script

### JavaScript Installation Script (lib/install.js)

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_DIR = path.resolve(__dirname, '..');
const TARGET_DIR = process.cwd(); // Current working directory (project root)

const OPTIONS = {
  rules: process.argv.includes('--rules'),
  commands: process.argv.includes('--commands'),
  experts: process.argv.includes('--experts'),
  scripts: process.argv.includes('--scripts'),
  all: process.argv.includes('--all'),
  force: process.argv.includes('--force'),
};

// If no specific option, install all
if (!OPTIONS.rules && !OPTIONS.commands && !OPTIONS.experts && !OPTIONS.scripts) {
  OPTIONS.all = true;
}

function copyDirectory(src, dest, options = {}) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Source directory not found: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath, options);
    } else {
      // Check if file exists and handle force option
      if (fs.existsSync(destPath) && !options.force) {
        console.log(`⏭️  Skipping existing file: ${destPath}`);
        return;
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${destPath}`);
    }
  });
}

function installRules() {
  console.log('📋 Installing Cursor rules...');
  const src = path.join(PACKAGE_DIR, 'templates', '.cursor', 'rules', 'user');
  const dest = path.join(TARGET_DIR, '.cursor', 'rules', 'user');
  copyDirectory(src, dest, { force: OPTIONS.force });
}

function installCommands() {
  console.log('⚡ Installing Cursor commands...');
  const src = path.join(PACKAGE_DIR, 'templates', '.cursor', 'commands');
  const dest = path.join(TARGET_DIR, '.cursor', 'commands');
  copyDirectory(src, dest, { force: OPTIONS.force });
}

function installExperts() {
  console.log('👥 Installing expert personas...');
  const src = path.join(PACKAGE_DIR, 'templates', '.cursor', 'rules', 'experts');
  const dest = path.join(TARGET_DIR, '.cursor', 'rules', 'experts');
  copyDirectory(src, dest, { force: OPTIONS.force });
}

function installScripts() {
  console.log('🔧 Installing validation scripts...');
  const src = path.join(PACKAGE_DIR, 'templates', 'scripts');
  const dest = path.join(TARGET_DIR, 'scripts');
  copyDirectory(src, dest, { force: OPTIONS.force });
  
  // Make scripts executable
  if (fs.existsSync(dest)) {
    const files = fs.readdirSync(dest);
    files.forEach(file => {
      const filePath = path.join(dest, file);
      if (fs.statSync(filePath).isFile()) {
        fs.chmodSync(filePath, '755');
      }
    });
  }
}

// Main installation
console.log('🚀 Installing Cursor standards...');
console.log(`📦 Package: ${PACKAGE_DIR}`);
console.log(`🎯 Target: ${TARGET_DIR}`);
console.log('');

if (OPTIONS.all || OPTIONS.rules) {
  installRules();
}

if (OPTIONS.all || OPTIONS.commands) {
  installCommands();
}

if (OPTIONS.all || OPTIONS.experts) {
  installExperts();
}

if (OPTIONS.all || OPTIONS.scripts) {
  installScripts();
}

console.log('');
console.log('✅ Installation complete!');
console.log('');
console.log('📚 Next steps:');
console.log('   1. Review installed rules in .cursor/rules/');
console.log('   2. Review installed commands in .cursor/commands/');
console.log('   3. Run validation: npm run validate-documentation');
```

### Shell Installation Script (bin/install-cursor-rules)

```bash
#!/bin/bash
# bin/install-cursor-rules

set -e

PACKAGE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="$(pwd)"

echo "🚀 Installing Cursor standards..."
echo "📦 Package: $PACKAGE_DIR"
echo "🎯 Target: $TARGET_DIR"
echo ""

# Install rules
if [ -d "$PACKAGE_DIR/templates/.cursor/rules/user" ]; then
    echo "📋 Installing Cursor rules..."
    mkdir -p "$TARGET_DIR/.cursor/rules/user"
    cp -r "$PACKAGE_DIR/templates/.cursor/rules/user/"* "$TARGET_DIR/.cursor/rules/user/"
    echo "✅ Rules installed"
fi

# Install commands
if [ -d "$PACKAGE_DIR/templates/.cursor/commands" ]; then
    echo "⚡ Installing Cursor commands..."
    mkdir -p "$TARGET_DIR/.cursor/commands"
    cp -r "$PACKAGE_DIR/templates/.cursor/commands/"* "$TARGET_DIR/.cursor/commands/"
    echo "✅ Commands installed"
fi

# Install experts
if [ -d "$PACKAGE_DIR/templates/.cursor/rules/experts" ]; then
    echo "👥 Installing expert personas..."
    mkdir -p "$TARGET_DIR/.cursor/rules/experts"
    cp -r "$PACKAGE_DIR/templates/.cursor/rules/experts/"* "$TARGET_DIR/.cursor/rules/experts/"
    echo "✅ Expert personas installed"
fi

# Install scripts
if [ -d "$PACKAGE_DIR/templates/scripts" ]; then
    echo "🔧 Installing validation scripts..."
    mkdir -p "$TARGET_DIR/scripts"
    cp -r "$PACKAGE_DIR/templates/scripts/"* "$TARGET_DIR/scripts/"
    chmod +x "$TARGET_DIR/scripts/"*.sh
    echo "✅ Scripts installed"
fi

echo ""
echo "✅ Installation complete!"
```

## Usage

### Installation

#### Install from npm registry:

```bash
npm install --save-dev @your-org/compass
```

#### Install from local path:

```bash
npm install --save-dev file:../compass
```

#### Install from git repository:

```bash
npm install --save-dev git+https://github.com/your-org/compass.git
```

### Post-Installation

The package automatically runs installation after `npm install` via the `postinstall` script. To manually install:

```bash
# Install all (rules, commands, experts, scripts)
npx install-cursor-rules

# Install specific components
npm run install:rules      # Only rules
npm run install:commands  # Only commands
npm run install:experts    # Only experts
npm run install:all       # All components
```

### Validation

```bash
# Run documentation validation
npx validate-documentation

# Or use npm script
npm run validate
```

### Updates

```bash
# Update package
npm update @your-org/compass

# Reinstall rules (after update)
npx install-cursor-rules --force
```

## Package Configuration

### .npmignore

Exclude unnecessary files from the package:

```
# Development files
.git/
.gitignore
.cursor/
node_modules/
*.log
.DS_Store

# Source files (if using build process)
src/
*.ts
tsconfig.json

# Test files
test/
tests/
*.test.js
*.spec.js

# CI/CD
.github/
.gitlab-ci.yml

# Documentation (keep only essential)
docs/
!README.md
!docs/USAGE.md

# Keep templates and bin
!templates/
!bin/
!lib/
```

### Files to Include

The `files` field in `package.json` controls what gets published:

```json
{
  "files": [
    "templates/",
    "bin/",
    "lib/",
    "README.md",
    "LICENSE",
    "docs/USAGE.md"
  ]
}
```

## Publishing

### Prepare for Publishing

1. **Version the package**:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major   # 1.0.0 -> 2.0.0
   ```

2. **Test locally**:
   ```bash
   npm pack
   # Creates a .tgz file you can test
   ```

3. **Publish**:
   ```bash
   npm publish
   # Or for scoped packages:
   npm publish --access public
   ```

### Version Management

Use semantic versioning:
- **Patch** (1.0.1): Bug fixes, minor updates
- **Minor** (1.1.0): New features, new experts, new commands
- **Major** (2.0.0): Breaking changes, major restructures

## Integration with Projects

### In package.json

Add to your project's `package.json`:

```json
{
  "devDependencies": {
    "@your-org/compass": "^1.0.0"
  },
  "scripts": {
    "validate-docs": "validate-documentation",
    "update-cursor": "install-cursor-rules --force"
  }
}
```

### In CI/CD

Add to GitHub Actions:

```yaml
- name: Install Cursor Standards
  run: npm install --save-dev @your-org/compass

- name: Validate Documentation
  run: npm run validate-docs
```

## Advanced Features

### Selective Installation

Allow projects to choose which components to install:

```javascript
// lib/install.js - Enhanced version
const config = {
  installRules: process.env.CURSOR_INSTALL_RULES !== 'false',
  installCommands: process.env.CURSOR_INSTALL_COMMANDS !== 'false',
  installExperts: process.env.CURSOR_INSTALL_EXPERTS !== 'false',
  installScripts: process.env.CURSOR_INSTALL_SCRIPTS !== 'false',
};
```

### Configuration File

Allow projects to configure installation via `.cursor-config.json`:

```json
{
  "install": {
    "rules": true,
    "commands": true,
    "experts": true,
    "scripts": true
  },
  "exclude": [
    "experts/legacy_expert.mdc"
  ]
}
```

### Update Mechanism

Create an update script that checks for changes:

```bash
#!/bin/bash
# bin/update-cursor-rules

PACKAGE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="$(pwd)"

# Check if rules need updating
if [ -f "$TARGET_DIR/.cursor/rules/.version" ]; then
    INSTALLED_VERSION=$(cat "$TARGET_DIR/.cursor/rules/.version")
    PACKAGE_VERSION=$(node -p "require('$PACKAGE_DIR/package.json').version")
    
    if [ "$INSTALLED_VERSION" != "$PACKAGE_VERSION" ]; then
        echo "🔄 Updating from $INSTALLED_VERSION to $PACKAGE_VERSION..."
        install-cursor-rules --force
        echo "$PACKAGE_VERSION" > "$TARGET_DIR/.cursor/rules/.version"
    else
        echo "✅ Already up to date ($PACKAGE_VERSION)"
    fi
else
    install-cursor-rules
    node -p "require('$PACKAGE_DIR/package.json').version" > "$TARGET_DIR/.cursor/rules/.version"
fi
```

## Best Practices

### 1. Version Management

- Use semantic versioning
- Tag releases in git
- Document breaking changes in CHANGELOG.md

### 2. Backward Compatibility

- Maintain backward compatibility when possible
- Use major version for breaking changes
- Provide migration guides

### 3. Testing

- Test installation in clean directories
- Test with different Node.js versions
- Test in CI/CD environments

### 4. Documentation

- Clear README.md with usage examples
- Document all configuration options
- Provide troubleshooting guide

### 5. Distribution

- Publish to npm registry (public or private)
- Use scoped packages (`@your-org/package-name`)
- Consider private npm registry for internal use

## Troubleshooting

### Installation Issues

**Problem**: Rules not installing
**Solution**: Check file permissions, ensure templates/ directory exists

**Problem**: Scripts not executable
**Solution**: Use `chmod +x` or set in package.json `files` with executable bit

### Version Conflicts

**Problem**: Multiple versions installed
**Solution**: Use `npm ls` to check, remove duplicates, reinstall

### CI/CD Issues

**Problem**: Installation fails in CI
**Solution**: Ensure Node.js version matches `engines` requirement

## Example: Complete Package Setup

### Directory Structure

```
compass/
├── package.json
├── README.md
├── LICENSE
├── .npmignore
├── bin/
│   ├── install-cursor-rules
│   └── validate-documentation
├── lib/
│   └── install.js
├── templates/
│   ├── .cursor/
│   │   ├── rules/
│   │   │   ├── user/
│   │   │   └── experts/
│   │   └── commands/
│   └── scripts/
└── docs/
    └── USAGE.md
```

### Installation Flow

1. User runs `npm install @your-org/compass`
2. Package installs to `node_modules/@your-org/compass`
3. `postinstall` script runs `node lib/install.js`
4. Script copies files from `templates/` to project root `.cursor/`
5. User can now use Cursor rules and commands

### Usage in Project

```bash
# Install
npm install --save-dev @your-org/compass

# Rules are automatically installed to .cursor/rules/
# Commands are automatically installed to .cursor/commands/

# Validate documentation
npm run validate-docs

# Update rules
npm update @your-org/compass
npx install-cursor-rules --force
```

### Mobile Considerations for Cursor Package NPM

When packaging Cursor rules and commands for npm distribution with mobile usage:

1. **Mobile Installation**
   - Package size should be optimized for mobile bandwidth
   - Installation scripts should handle mobile storage constraints
   - Postinstall scripts should be efficient on mobile devices

2. **Mobile File System**
   - File copying from npm package should handle slower mobile storage
   - Directory creation should be optimized for mobile file systems
   - Template installation should account for mobile path length limitations

3. **Mobile Development**
   - Package should work with mobile development environments
   - Installation should support mobile SSH/terminal workflows
   - Package contents should be mobile-terminal accessible

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (npm package, Cursor rules, package distribution, npm publishing, monorepo)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive package structure examples and distribution guides for content depth

2. **Technical Documentation SEO**
   - Document npm package structure with clear, searchable descriptions
   - Include code examples demonstrating package configuration and installation
   - Use semantic HTML structure in documentation
   - Add internal links to related npm, monorepo, and package distribution documentation

3. **Content Quality for Search**
   - Ensure guide answers common npm package distribution queries
   - Include troubleshooting sections for common packaging issues
   - Provide comprehensive package structure reference documentation
   - Maintain documentation freshness with npm and packaging tooling updates

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive guide for packaging Cursor rules and commands as an npm package. This guide covers package structure (recommended structure with templates, bin, lib directories), package.json configuration (basic and advanced configurations with scripts, bin, files fields), installation scripts (JavaScript installation script with selective installation, shell installation script), usage (installation from npm/git/local, post-installation, validation, updates), package configuration (.npmignore, files to include), publishing (version management, semantic versioning, publishing process), integration with projects (package.json integration, CI/CD integration), advanced features (selective installation, configuration file, update mechanism), best practices (version management, backward compatibility, testing, documentation, distribution), troubleshooting (installation issues, version conflicts, CI/CD issues), and complete package setup example with directory structure and installation flow. This guide provides a complete solution for distributing Cursor standards as an npm package, enabling easy installation and updates across all projects.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for Cursor package npm section covering mobile installation (package size optimization, mobile storage constraints, efficient postinstall scripts), mobile file system (file copying operations, directory creation, path length limitations), and mobile development (mobile development environments, SSH/terminal workflows, mobile-terminal accessibility). This addition ensures the npm package distribution works well on mobile devices and mobile development workflows.

---

