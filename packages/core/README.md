# @your-org/core

Core package providing foundational features, rules, experts, and commands for all projects.

## Quick Start - New Project Setup

### 🎯 Best Workflow for a Brand New Project

**When you open a clean folder, follow these 3 steps:**

```bash
# Step 1: Initialize npm project (if you don't have package.json)
npm init -y

# Step 2: Link the core package
npm link @your-org/core

# Step 3: Initialize everything
npx @your-org/core init
```

**That's it!** Your project is now set up with:
- ✅ All expert personas and user rules in `.cursor/rules/`
- ✅ General commands in `.cursor/commands/`
- ✅ Port Manager initialized and configured
- ✅ Technology stack detected and saved
- ✅ **IDE colors configured** - Unique colors per project with branch-based themes

### 📝 Complete Example

```bash
# Open your new project folder
cd ~/Documents/Projects/my-new-project

# Run these 3 commands:
npm init -y
npm link @your-org/core
npx @your-org/core init
```

### ⚙️ One-Time Setup (Only Needed Once)

Before using `npm link @your-org/core` in projects, you need to link the package globally (one-time setup):

```bash
cd ~/Documents/packages/packages/core
npm link
```

This creates a global symlink so you can use `npm link @your-org/core` in any project.

### 🔄 Alternative: File Path Installation

If you prefer not to use npm link, you can install directly from the file path:

```bash
npm init -y
npm install file:../../packages/packages/core
npx @your-org/core init
```

### 📦 Future: Published Package

When the package is published to npm, you'll be able to use:

```bash
npm init -y
npm install @your-org/core
npx @your-org/core init
```

### ⚠️ Important Notes

1. **npm link is set up** - The package is already linked globally, so you can use `npm link @your-org/core` in any project.

2. **Always run `npx @your-org/core init`** after linking - this ensures everything is set up correctly.

3. **Benefits of npm link:**
   - Changes to the package are immediately available (no reinstall needed)
   - Cleaner than file paths
   - Works exactly like a published package
   - Perfect for local development before publishing

## Features

The core package provides several foundational features that help streamline development workflows. Each feature is designed to be easy to use and well-documented.

### Project Initialization

**Purpose**: Automatically set up new projects with all necessary configuration, rules, and tools in one command.

**Quick Start**:
```bash
npx @your-org/core init
```

**What it does**:
- ✅ Copies all rules (expert personas, user rules) to `.cursor/rules/`
- ✅ Copies general commands to `.cursor/commands/` (excludes local commands)
- ✅ Initializes Port Manager automatically (mandatory)
- ✅ **Sets up IDE colors** - Generates unique color scheme per project
- ✅ Validates everything is set up correctly

**Learning Tip**: This command is idempotent - you can run it multiple times safely. It will skip files that already exist unless you use the `--overwrite` flag.

**Learn More**: See [Project Initialization PRD](../../docs/features/project-initialization/PRD.md) for detailed documentation.

### IDE Colors

Automatically configure unique IDE colors for each project with branch-based themes:

```bash
npx @your-org/core init
```

**What it does**:
- Generates a unique **KEY_COLOR** for your project (from curated color palette)
- Creates a `.githooks/post-checkout` hook that changes colors based on branch
- Initializes `.vscode/settings.json` with the color scheme
- Removes `settings.json` from git tracking (keeps it in `.gitignore`)

**Color Scheme by Branch**:
- **Main/Master branch** → 🔴 **RED** (`#ed3535`)
- **Development/Dev branch** → 🟠 **ORANGE** (`#FF8C00`)
- **Other branches** → 🎨 **Project KEY_COLOR** (unique color from palette)

**How it works**:
1. Each project gets a unique KEY_COLOR based on its name (using curated color palette)
2. All UI colors (title bar, status bar, activity bar, borders, tabs) are derived from KEY_COLOR
3. When you switch branches, the post-checkout hook automatically updates colors
4. Colors are applied to VS Code/Cursor IDE automatically
5. **Colors are only assigned during initialization** - existing projects keep their current colors

**Example**:
```bash
# Initialize a new project
cd ~/Documents/Projects/my-new-project
npm init -y
npm link @your-org/core
npx @your-org/core init

# The init command will:
# ✓ Generate post-checkout hook with KEY_COLOR: #81ca95
# ✓ Configured git hooks path
# ✓ Ensured .vscode/settings.json is ignored and removed from git tracking
# ✓ Initialized .vscode/settings.json with color scheme

# Now when you switch branches:
git checkout main        # IDE turns RED
git checkout development # IDE turns ORANGE
git checkout feature-x  # IDE uses project KEY_COLOR
```

**Skip colors** (if you don't want IDE colors):
```bash
npx @your-org/core init --skip-colors
```

### Port Manager

**Purpose**: Automatically manage port assignments across all your projects to prevent conflicts and ensure consistent configuration.

**Why it matters**: Port conflicts are a common source of frustration when working with multiple projects. Port Manager eliminates this by maintaining a centralized registry of port assignments.

**Programmatic Usage**:
```typescript
import { PortManager } from '@your-org/core/features/port-manager';

// Create a Port Manager instance
const manager = new PortManager({
  database: {
    type: 'sqlite',
    path: '~/.port-manager/registry.db'
  }
});

// Allocate a port for your project
const port = await manager.allocate('my-project', 'nextjs');
console.log(`Assigned port: ${port}`); // e.g., "Assigned port: 3001"
```

**CLI Usage**:
```bash
# Port Manager is automatically initialized during project init
# But you can also use it directly for manual port management:

# Initialize Port Manager for your project
npx @your-org/core port-manager init

# Allocate a port for a specific project and app type
npx @your-org/core port-manager allocate --project-name my-project --app-type nextjs

# Check for port conflicts
npx @your-org/core port-manager check

# List all port assignments
npx @your-org/core port-manager list
```

**Learning Tip**: Port Manager automatically detects your project type and suggests appropriate ports. You can override the default port if needed, but the automatic allocation usually works best.

## Rules and Commands

This package includes Cursor IDE rules and commands that enhance your development experience. These are automatically copied to your project during initialization.

### What You Get

- **Rules** → `.cursor/rules/`
  - Expert personas: Specialized AI agents for different domains (architecture, security, testing, etc.)
  - User rules: Project-specific guidelines and best practices
  
- **Commands** → `.cursor/commands/general/`
  - Reusable commands for common development tasks
  - Commands that work across all projects
  
- **Local Commands**: Excluded (these are for the packages repo only)

### Understanding Expert Personas

Expert personas are specialized AI agents that provide domain-specific guidance. For example:
- **Architecture Expert**: Helps with system design and scalability
- **Security Expert**: Focuses on security best practices and threat modeling
- **Testing Expert**: Assists with test strategy and implementation

These personas are automatically available in your project after initialization, making it easy to get expert-level guidance on specific topics.

## Package Structure

Understanding the package structure helps you navigate and use the core package effectively:

```
@your-org/core/
├── features/          # Core features (Port Manager, Tech Detector, etc.)
│   ├── port-manager/  # Port management feature
│   ├── tech-detector/ # Technology detection feature
│   ├── domain-manager/# Domain management feature
│   └── project-initialization/ # Project setup feature
├── shared/            # Shared utilities used across features
│   ├── database/      # Database abstractions
│   └── config/        # Configuration management
├── rules/             # Cursor IDE rules
│   ├── experts/       # Expert personas
│   └── user/          # User rules
└── commands/          # Cursor commands
    ├── local/         # Local commands (packages repo only)
    └── general/       # General commands (copied to projects)
```

**Key Concepts**:
- **Features**: Self-contained modules you can import and use in your projects
- **Shared Utilities**: Common code used by multiple features (database, config)
- **Rules**: Cursor IDE configuration that enhances your development experience
- **Commands**: Reusable CLI commands for common tasks

## Documentation

Comprehensive documentation is available to help you understand and use the core package effectively:

### Getting Started
- **[Getting Started Guide](./GETTING_STARTED.md)**: Step-by-step guide for new users
- **This README**: Quick start guide and feature overview
- **Architecture Documentation** ([ARCHITECTURE.md](./ARCHITECTURE.md)): Deep dive into package architecture and design patterns

### Feature Documentation
- **Port Manager**: [PRD](../../docs/features/port-manager/PRD.md) - Complete feature documentation
- **Project Initialization**: [PRD](../../docs/features/project-initialization/PRD.md) - Setup and configuration guide

### Architecture & Strategy
- **Package Architecture Strategy**: [Overview](../../docs/architecture/PACKAGE_ARCHITECTURE.md) - How packages are organized and work together

### Learning Path

**New to the core package?** Follow this learning path:
1. 📖 Read the [Getting Started Guide](./GETTING_STARTED.md) for step-by-step instructions
2. 🚀 Run `npx @your-org/core init` in a test project
3. 🔍 Explore the features section above to understand what's available
4. 🏗️ Read the Architecture Documentation to understand the design
5. 📚 Check individual feature PRDs for detailed usage

**Experienced user?** Jump to:
- Architecture Documentation for design patterns
- Feature PRDs for advanced usage
- Package Architecture Strategy for integration patterns

## License

MIT




