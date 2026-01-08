# Cursor Package Setup Guide

**⚠️ PLANNING MODE**: This guide describes the planned setup process for the npm package. This is documentation only - no actual implementation files have been created yet.

This guide explains how to set up the npm package structure for distributing Cursor rules and commands.

**Last Updated**: 2026-01-05  
**Status**: Planning/Documentation Only

## Overview

To package Cursor rules and commands as an npm package, you need to:

1. Create a `templates/` directory structure
2. Copy existing rules and commands to templates
3. Set up package.json (already created)
4. Create installation scripts (already created)
5. Test the package
6. Publish to npm

## Step 1: Create Templates Directory Structure

Create the following directory structure:

```
templates/
├── .cursor/
│   ├── rules/
│   │   ├── user/
│   │   │   ├── documentation_structure.mdc
│   │   │   ├── planning_mode.mdc
│   │   │   └── security_and_secrets.mdc
│   │   └── experts/
│   │       ├── accessibility_expert.mdc
│   │       ├── api_design_expert.mdc
│   │       ├── architecture_expert.mdc
│   │       └── [all other expert personas]
│   └── commands/
│       ├── general/
│       │   └── [general commands]
│       └── local/
│           ├── expert.md
│           ├── file.md
│           ├── review.md
│           ├── sort.md
│           └── statistics.md
└── scripts/
    ├── validate-documentation.sh
    └── [other validation scripts]
```

## Step 2: Copy Existing Files to Templates

### Copy Rules

```bash
# Create templates directory structure
mkdir -p templates/.cursor/rules/user
mkdir -p templates/.cursor/rules/experts

# Copy user rules
cp .cursor/rules/user/*.mdc templates/.cursor/rules/user/

# Copy expert personas
cp .cursor/rules/experts/*.mdc templates/.cursor/rules/experts/
```

### Copy Commands

```bash
# Create commands directory structure
mkdir -p templates/.cursor/commands/general
mkdir -p templates/.cursor/commands/local

# Copy local commands
cp .cursor/commands/local/*.md templates/.cursor/commands/local/

# Copy general commands (if any)
cp .cursor/commands/general/*.md templates/.cursor/commands/general/ 2>/dev/null || true
```

### Copy Scripts

```bash
# Create scripts directory
mkdir -p templates/scripts

# Copy validation scripts
cp .cursor/scripts/*.py templates/scripts/ 2>/dev/null || true
cp scripts/*.sh templates/scripts/ 2>/dev/null || true
```

## Step 3: Setup Script

Create a setup script to automate the template creation:

```bash
#!/bin/bash
# scripts/setup-package-templates.sh

set -e

echo "📦 Setting up npm package templates..."

# Create directory structure
mkdir -p templates/.cursor/rules/user
mkdir -p templates/.cursor/rules/experts
mkdir -p templates/.cursor/commands/general
mkdir -p templates/.cursor/commands/local
mkdir -p templates/scripts

# Copy user rules
echo "📋 Copying user rules..."
if [ -d ".cursor/rules/user" ]; then
    cp .cursor/rules/user/*.mdc templates/.cursor/rules/user/ 2>/dev/null || true
    echo "✅ User rules copied"
else
    echo "⚠️  No user rules found"
fi

# Copy expert personas
echo "👥 Copying expert personas..."
if [ -d ".cursor/rules/experts" ]; then
    cp .cursor/rules/experts/*.mdc templates/.cursor/rules/experts/ 2>/dev/null || true
    echo "✅ Expert personas copied"
else
    echo "⚠️  No expert personas found"
fi

# Copy local commands
echo "⚡ Copying local commands..."
if [ -d ".cursor/commands/local" ]; then
    cp .cursor/commands/local/*.md templates/.cursor/commands/local/ 2>/dev/null || true
    echo "✅ Local commands copied"
else
    echo "⚠️  No local commands found"
fi

# Copy general commands
echo "⚡ Copying general commands..."
if [ -d ".cursor/commands/general" ]; then
    cp .cursor/commands/general/*.md templates/.cursor/commands/general/ 2>/dev/null || true
    echo "✅ General commands copied"
else
    echo "⚠️  No general commands found"
fi

# Copy scripts
echo "🔧 Copying scripts..."
if [ -d ".cursor/scripts" ]; then
    cp .cursor/scripts/*.py templates/scripts/ 2>/dev/null || true
    cp .cursor/scripts/*.sh templates/scripts/ 2>/dev/null || true
fi
if [ -d "scripts" ]; then
    cp scripts/*.sh templates/scripts/ 2>/dev/null || true
fi
echo "✅ Scripts copied"

echo ""
echo "✅ Template setup complete!"
echo ""
echo "📦 Next steps:"
echo "   1. Review templates/ directory"
echo "   2. Test package: npm pack"
echo "   3. Test installation in a test project"
echo "   4. Publish: npm publish"
```

## Step 4: Update package.json

Update the package name and repository URL in `package.json`:

```json
{
  "name": "@your-org/cursor-standards",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/cursor-standards.git"
  }
}
```

## Step 5: Test the Package

### Create Test Package

```bash
# Create a .tgz package file
npm pack

# This creates: your-org-cursor-standards-1.0.0.tgz
```

### Test Installation

```bash
# In a test project directory
cd /path/to/test-project

# Install from local package
npm install /path/to/packages/your-org-cursor-standards-1.0.0.tgz

# Verify installation
ls -la .cursor/rules/
ls -la .cursor/commands/
```

## Step 6: Publish to npm

### Prepare for Publishing

1. **Update version**:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   ```

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Publish**:
   ```bash
   # For scoped packages (public)
   npm publish --access public
   
   # For unscoped packages
   npm publish
   ```

### Publishing Checklist

- [ ] Version updated in package.json
- [ ] Templates directory populated
- [ ] Installation scripts tested
- [ ] README.md updated
- [ ] LICENSE file included
- [ ] .npmignore configured
- [ ] Package tested locally (`npm pack`)
- [ ] Installation tested in test project
- [ ] Git tagged with version
- [ ] Ready to publish

## Step 7: Usage in Projects

### Install in Project

```bash
# Install from npm
npm install --save-dev @your-org/cursor-standards

# Or install from git
npm install --save-dev git+https://github.com/your-org/cursor-standards.git
```

### Automatic Installation

The package automatically installs rules and commands via the `postinstall` script.

### Manual Installation

```bash
# Install all
npx install-cursor-rules

# Install specific components
npm run install:rules
npm run install:commands
npm run install:experts
npm run install:scripts
```

## Maintenance

### Updating the Package

1. **Update rules/commands** in `.cursor/` directory
2. **Run setup script** to update templates:
   ```bash
   ./scripts/setup-package-templates.sh
   ```
3. **Test locally**:
   ```bash
   npm pack
   ```
4. **Update version**:
   ```bash
   npm version patch
   ```
5. **Publish**:
   ```bash
   npm publish --access public
   ```

### Version Management

- **Patch** (1.0.1): Bug fixes, minor updates to rules
- **Minor** (1.1.0): New experts, new commands, new rules
- **Major** (2.0.0): Breaking changes, major restructures

## Troubleshooting

### Templates Not Found

**Problem**: Installation script can't find templates
**Solution**: Ensure `templates/` directory exists and contains files

### Files Not Copying

**Problem**: Files not copying during installation
**Solution**: Check file permissions, ensure source files exist

### Scripts Not Executable

**Problem**: Scripts not executable after installation
**Solution**: Ensure scripts have executable bit set, or use `chmod +x` in install script

### Package Too Large

**Problem**: Package size exceeds npm limits
**Solution**: Review `.npmignore`, exclude unnecessary files

## Best Practices

1. **Keep Templates Updated**: Run setup script after updating rules/commands
2. **Test Before Publishing**: Always test with `npm pack` first
3. **Version Carefully**: Use semantic versioning
4. **Document Changes**: Update CHANGELOG.md with each version
5. **Tag Releases**: Tag git releases with version numbers

### Mobile Considerations for Package Setup

When setting up and using the Cursor package on mobile devices:

1. **Mobile Installation**
   - npm installation works on mobile devices with Node.js
   - Consider mobile storage constraints when installing packages
   - Postinstall scripts should be efficient on mobile devices

2. **Mobile File System**
   - Template copying operations should handle slower mobile storage gracefully
   - Directory creation should be optimized for mobile file systems
   - Consider mobile path length limitations

3. **Mobile Development Workflow**
   - Package setup should work with mobile development environments
   - Consider mobile SSH/terminal limitations when running installation scripts
   - Package size should be optimized for mobile bandwidth constraints

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (npm package setup, Cursor package, package distribution, npm publishing)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive setup examples and step-by-step instructions for content depth

2. **Technical Documentation SEO**
   - Document package setup process with clear, searchable descriptions
   - Include code examples demonstrating installation and configuration
   - Use semantic HTML structure in documentation
   - Add internal links to related npm and package distribution documentation

3. **Content Quality for Search**
   - Ensure guide answers common npm package setup queries
   - Include troubleshooting sections for common setup issues
   - Provide comprehensive installation reference documentation
   - Maintain documentation freshness with npm and package tooling updates

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created setup guide for preparing Cursor rules and commands as an npm package. This guide covers creating templates directory structure, copying existing files to templates, setup script automation, updating package.json, testing the package (creating test package, testing installation), publishing to npm (preparation, publishing checklist), usage in projects (installation, automatic installation, manual installation), maintenance (updating the package, version management), troubleshooting (templates not found, files not copying, scripts not executable, package too large), and best practices. This guide provides step-by-step instructions for setting up and maintaining the npm package for Cursor standards distribution.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for package setup section covering mobile installation (npm installation on mobile, storage constraints, efficient postinstall scripts), mobile file system (template copying operations, directory creation, path length limitations), and mobile development workflow (mobile development environments, SSH/terminal limitations, package size optimization). This addition ensures the package setup process is optimized for mobile device constraints and mobile development workflows.

**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Enhanced this package setup guide by adding comprehensive "Backend Package Setup Considerations" section covering backend package installation (backend package dependencies with version management, backend package configuration with environment-based config, backend package initialization with setup scripts), backend package structure (backend API package structure with routes/controllers/services, backend service package structure with reusable services, backend middleware package structure with authentication/validation), backend package testing (backend package test setup with test database configuration, backend package test execution with integration tests, backend package test coverage with coverage reporting), and comprehensive backend package setup checklist (package installation, configuration, initialization, structure, testing, test setup, test execution, coverage reporting). This addition ensures that package setup processes include backend development considerations, supporting backend package creation, backend package structure, and backend package testing.

---

