# NPM Package Organization Strategies

This guide explains different strategies for organizing multiple related npm packages, such as having a main package with sub-packages or related packages.

**⚠️ PLANNING MODE**: This guide describes package organization strategies. This is documentation only.

**Last Updated**: 2026-01-05  
**Status**: Planning/Documentation Only

## Overview

When you have multiple related packages (like `kendo`, `kendo-buttons`, `kendo-grid`), you have several organizational options:

1. **Monorepo** - Multiple packages in one repository
2. **Scoped Packages** - Related packages under same scope (`@your-org/package-name`)
3. **Separate Repositories** - Each package in its own repo
4. **Package Relationships** - Packages that depend on or extend each other

## Strategy 1: Monorepo (Recommended for Related Packages)

### What is a Monorepo?

A monorepo is a single repository containing multiple packages. All packages are versioned and published together.

### Structure

```
compass/
├── package.json              # Root package.json (workspace config)
├── packages/
│   ├── core/                 # Main package
│   │   ├── package.json
│   │   ├── templates/
│   │   └── lib/
│   ├── rules/                # Rules-only package
│   │   ├── package.json
│   │   └── templates/
│   ├── commands/             # Commands-only package
│   │   ├── package.json
│   │   └── templates/
│   └── experts/              # Experts-only package
│       ├── package.json
│       └── templates/
└── lerna.json                 # Or use npm workspaces
```

### Benefits

- ✅ **Single Source of Truth**: All packages in one place
- ✅ **Shared Tooling**: Common scripts, configs, tests
- ✅ **Atomic Updates**: Update multiple packages together
- ✅ **Easier Development**: Work on related packages simultaneously
- ✅ **Consistent Versioning**: Version packages together

### Implementation

#### Using npm Workspaces

```json
// Root package.json
{
  "name": "@your-org/compass",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "publish": "npm publish --workspaces"
  }
}
```

#### Using Lerna

```json
// lerna.json
{
  "version": "independent",
  "packages": ["packages/*"],
  "npmClient": "npm"
}
```

### Publishing

```bash
# Publish all packages
lerna publish

# Or with npm workspaces
npm publish --workspaces
```

## Strategy 2: Scoped Packages

### What are Scoped Packages?

Scoped packages use the format `@scope/package-name`. They group related packages under a common namespace.

### Structure

```
@your-org/
├── compass/         # Main package
├── compass-rules/   # Rules only
├── compass-commands/# Commands only
└── compass-experts/ # Experts only
```

### Package Names

```json
// @your-org/compass
{
  "name": "@your-org/compass",
  "version": "1.0.0"
}

// @your-org/compass-rules
{
  "name": "@your-org/compass-rules",
  "version": "1.0.0"
}

// @your-org/compass-commands
{
  "name": "@your-org/compass-commands",
  "version": "1.0.0"
}
```

### Benefits

- ✅ **Clear Organization**: Related packages grouped by scope
- ✅ **Namespace Protection**: Avoid naming conflicts
- ✅ **Flexible Installation**: Install only what you need
- ✅ **Independent Versioning**: Each package can have different versions

### Usage

```bash
# Install main package (includes all)
npm install @your-org/compass

# Install only rules
npm install @your-org/compass-rules

# Install only commands
npm install @your-org/compass-commands
```

## Strategy 3: Package Relationships

### Main Package + Sub-Packages

The main package can depend on or reference sub-packages.

#### Option A: Main Package Includes All

```json
// @your-org/compass/package.json
{
  "name": "@your-org/compass",
  "dependencies": {
    "@your-org/compass-rules": "^1.0.0",
    "@your-org/compass-commands": "^1.0.0",
    "@your-org/compass-experts": "^1.0.0"
  }
}
```

When user installs main package, sub-packages are installed automatically.

#### Option B: Main Package References Sub-Packages

```json
// @your-org/compass/package.json
{
  "name": "@your-org/compass",
  "peerDependencies": {
    "@your-org/compass-rules": "^1.0.0",
    "@your-org/compass-commands": "^1.0.0"
  }
}
```

User must install sub-packages separately, but main package can use them.

#### Option C: Optional Dependencies

```json
// @your-org/compass/package.json
{
  "name": "@your-org/compass",
  "optionalDependencies": {
    "@your-org/compass-rules": "^1.0.0",
    "@your-org/compass-commands": "^1.0.0"
  }
}
```

Sub-packages are installed if available, but not required.

## Strategy 4: Separate Repositories

### Structure

Each package has its own repository:

```
compass/          # Main package repo
compass-rules/    # Rules package repo
compass-commands/ # Commands package repo
```

### Benefits

- ✅ **Independent Development**: Teams can work separately
- ✅ **Independent Versioning**: Each package versions independently
- ✅ **Smaller Repos**: Each repo is focused
- ✅ **Clear Boundaries**: Clear separation of concerns

### Challenges

- ❌ **Coordination**: Harder to coordinate updates
- ❌ **Shared Code**: Duplicate tooling/config
- ❌ **Version Sync**: Need to manually sync versions

## Comparison of Strategies

### Monorepo vs Scoped Packages vs Separate Repos

| Feature | Monorepo | Scoped Packages | Separate Repos |
|---------|----------|-----------------|----------------|
| **Organization** | Single repo | Multiple packages, one scope | Multiple repos |
| **Versioning** | Together or independent | Independent | Independent |
| **Development** | Easy to work together | Moderate | Harder |
| **Publishing** | Atomic or individual | Individual | Individual |
| **Tooling** | Shared | Can share | Duplicated |
| **Complexity** | Medium | Low | Low |

## Recommended Approach for Cursor Standards

### Option 1: Monorepo with Workspaces (Recommended)

```
compass/
├── package.json              # Workspace root
├── packages/
│   ├── core/                 # @your-org/compass
│   │   ├── package.json
│   │   └── templates/
│   ├── rules/                # @your-org/compass-rules
│   │   ├── package.json
│   │   └── templates/.cursor/rules/
│   ├── commands/             # @your-org/compass-commands
│   │   ├── package.json
│   │   └── templates/.cursor/commands/
│   └── experts/              # @your-org/compass-experts
│       ├── package.json
│       └── templates/.cursor/rules/experts/
└── lerna.json
```

**Benefits**:
- All packages in one place
- Easy to develop together
- Can publish individually or together
- Shared tooling and configs

### Option 2: Scoped Packages (Simpler)

```
@your-org/
├── compass/         # Main (includes all)
├── compass-rules/    # Rules only
├── compass-commands/# Commands only
└── compass-experts/ # Experts only
```

**Benefits**:
- Simple structure
- Independent versioning
- Users can install only what they need
- Clear package boundaries

## Implementation Examples

### Example 1: Monorepo Setup

#### Root package.json

```json
{
  "name": "@your-org/compass-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "publish:all": "npm publish --workspaces --access public"
  }
}
```

#### Core Package

```json
// packages/core/package.json
{
  "name": "@your-org/compass",
  "version": "1.0.0",
  "dependencies": {
    "@your-org/compass-rules": "workspace:*",
    "@your-org/compass-commands": "workspace:*",
    "@your-org/compass-experts": "workspace:*"
  },
  "postinstall": "node lib/install-all.js"
}
```

#### Rules Package

```json
// packages/rules/package.json
{
  "name": "@your-org/compass-rules",
  "version": "1.0.0",
  "files": ["templates/"],
  "postinstall": "node lib/install-rules.js"
}
```

### Example 2: Scoped Packages Setup

#### Main Package

```json
// @your-org/compass/package.json
{
  "name": "@your-org/compass",
  "version": "1.0.0",
  "dependencies": {
    "@your-org/compass-rules": "^1.0.0",
    "@your-org/compass-commands": "^1.0.0",
    "@your-org/compass-experts": "^1.0.0"
  },
  "postinstall": "node lib/install-all.js"
}
```

#### Rules Package

```json
// @your-org/compass-rules/package.json
{
  "name": "@your-org/compass-rules",
  "version": "1.0.0",
  "files": ["templates/.cursor/rules/"],
  "postinstall": "node lib/install-rules.js"
}
```

## Installation Patterns

### Pattern 1: Install Everything

```bash
# Install main package (includes all sub-packages)
npm install @your-org/compass
```

### Pattern 2: Install Selectively

```bash
# Install only what you need
npm install @your-org/compass-rules
npm install @your-org/compass-commands
```

### Pattern 3: Install Main + Extend

```bash
# Install main package
npm install @your-org/compass

# Add additional packages
npm install @your-org/compass-experts
```

## Version Management

### Independent Versioning

Each package has its own version:

```
@your-org/compass: 1.0.0
@your-org/compass-rules: 1.2.0
@your-org/compass-commands: 1.1.0
```

### Synchronized Versioning

All packages share the same version:

```
@your-org/compass: 1.0.0
@your-org/compass-rules: 1.0.0
@your-org/compass-commands: 1.0.0
```

### Recommended Approach

- **Major versions**: Synchronized (breaking changes affect all)
- **Minor/Patch**: Independent (features/fixes per package)

## Publishing Strategies

### Strategy 1: Publish All Together

```bash
# Publish all packages with same version
lerna publish --conventional-commits
```

### Strategy 2: Publish Individually

```bash
# Publish each package separately
cd packages/rules && npm publish
cd packages/commands && npm publish
```

### Strategy 3: Publish on Changes

```bash
# Only publish packages that changed
lerna publish --conventional-commits --conventional-graduate
```

## Best Practices

### 1. Clear Package Boundaries

- Each package should have a clear purpose
- Avoid overlapping functionality
- Make dependencies explicit

### 2. Consistent Naming

- Use consistent naming convention
- Group related packages with scope
- Make purpose clear from name

### 3. Documentation

- Document package relationships
- Explain installation options
- Provide usage examples

### 4. Version Management

- Use semantic versioning
- Document breaking changes
- Keep changelogs

### 5. Testing

- Test packages independently
- Test package combinations
- Test installation scenarios

## Real-World Examples

### Kendo UI Structure

```
@progress/kendo-ui-core
@progress/kendo-buttons
@progress/kendo-grid
@progress/kendo-charts
```

- **Approach**: Scoped packages, separate repos
- **Installation**: Install individual packages or bundle
- **Versioning**: Independent versions

### Angular Structure

```
@angular/core
@angular/common
@angular/forms
@angular/router
```

- **Approach**: Monorepo, scoped packages
- **Installation**: Install individual packages
- **Versioning**: Synchronized versions

### Babel Structure

```
@babel/core
@babel/preset-env
@babel/plugin-transform-arrow-functions
```

- **Approach**: Monorepo, scoped packages
- **Installation**: Install core + plugins
- **Versioning**: Independent versions

## Recommended Structure for Cursor Standards

### Monorepo Approach

```
compass/
├── package.json              # Workspace root
├── lerna.json                # Lerna config
├── packages/
│   ├── core/                 # Main package
│   │   ├── package.json
│   │   ├── templates/
│   │   └── lib/
│   ├── rules/                # Rules package
│   │   ├── package.json
│   │   └── templates/.cursor/rules/
│   ├── commands/             # Commands package
│   │   ├── package.json
│   │   └── templates/.cursor/commands/
│   └── experts/              # Experts package
│       ├── package.json
│       └── templates/.cursor/rules/experts/
└── README.md
```

### Installation Options

```bash
# Option 1: Install everything
npm install @your-org/compass

# Option 2: Install only rules
npm install @your-org/compass-rules

# Option 3: Install main + specific packages
npm install @your-org/compass
npm install @your-org/compass-experts
```

## Summary

For organizing multiple related packages:

1. **Monorepo** - Best for packages developed together
2. **Scoped Packages** - Best for related but independent packages
3. **Package Relationships** - Use dependencies to connect packages
4. **Version Management** - Independent or synchronized based on needs

The key is choosing the right strategy based on:
- How packages are developed
- How they're used
- Versioning needs
- Team structure

### Mobile Considerations for Package Organization

When organizing multiple npm packages for mobile development:

1. **Mobile Installation Strategy**
   - Smaller, focused packages reduce mobile bandwidth usage
   - Selective installation allows mobile developers to install only what they need
   - Package size should be optimized for mobile network constraints

2. **Mobile Development Workflow**
   - Package organization should support mobile development environments
   - Monorepo structure should be efficient for mobile storage and processing
   - Package relationships should minimize mobile installation overhead

3. **Mobile Performance**
   - Package discovery and resolution should be fast on mobile devices
   - Dependency resolution should be optimized for mobile networks
   - Package organization should minimize mobile installation time

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (npm package organization, monorepo, scoped packages, package structure)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive organization strategy examples and comparison tables for content depth

2. **Technical Documentation SEO**
   - Document package organization strategies with clear, searchable descriptions
   - Include code examples demonstrating monorepo and package structures
   - Use semantic HTML structure in documentation
   - Add internal links to related npm, monorepo, and package management documentation

3. **Content Quality for Search**
   - Ensure guide answers common package organization queries
   - Include comparison sections for different organization strategies
   - Provide comprehensive strategy reference documentation
   - Maintain documentation freshness with npm and monorepo tooling updates

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive guide on npm package organization strategies for multiple related packages. This guide covers monorepo approach (structure, benefits, implementation with npm workspaces and Lerna, publishing), scoped packages (structure, package names, benefits, usage), package relationships (main package includes all, references sub-packages, optional dependencies), separate repositories (structure, benefits, challenges), comparison of strategies (monorepo vs scoped vs separate repos), recommended approaches for Cursor standards (monorepo with workspaces, scoped packages), implementation examples (monorepo setup, scoped packages setup), installation patterns (install everything, install selectively, install main + extend), version management (independent, synchronized, recommended approach), publishing strategies (publish all together, publish individually, publish on changes), best practices (clear package boundaries, consistent naming, documentation, version management, testing), real-world examples (Kendo UI, Angular, Babel), and recommended structure for Cursor standards with installation options. This guide provides a complete understanding of how to organize multiple related npm packages.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for package organization section covering mobile installation strategy (smaller focused packages, selective installation, package size optimization), mobile development workflow (mobile development environments, monorepo efficiency, installation overhead minimization), and mobile performance (fast package discovery, optimized dependency resolution, minimized installation time). This addition ensures package organization strategies account for mobile device constraints and mobile development workflows.

---

