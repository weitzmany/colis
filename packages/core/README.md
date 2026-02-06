# @your-org/core

Core package providing foundational features, rules, experts, and commands for all projects.

## Quick Start - New Project Setup

### 🎯 Quick Start: Setting Up a New Project

**Got a fresh project folder? Get up and running in three simple steps:**

```bash
# Step 1: Initialize npm project (if you don't have package.json)
npm init -y

# Step 2: Link the core package
npm link @your-org/core

# Step 3: Initialize everything
npx @your-org/core init
```

**Done!** Your project now includes:
- ✅ All expert personas and user rules in `.cursor/rules/`
- ✅ General commands in `.cursor/commands/`
- ✅ Port Manager initialized and configured
- ✅ **Local domain configured** - Automatic `.local` domain with Caddy reverse proxy
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

### ⚙️ One-Time Setup

**First time using the core package?** Link it globally once, then use it in any project:

```bash
cd ~/Documents/packages/packages/core
npm link
```

This creates a global symlink so you can use `npm link @your-org/core` in any project.

### 🔄 Alternative Installation Method

**Prefer not to use npm link?** Install directly from the file path instead:

```bash
npm init -y
npm install file:../../packages/packages/core
npx @your-org/core init
```

### 📦 Coming Soon: Published Package

**Once published to npm**, installation will be even simpler:

```bash
npm init -y
npm install @your-org/core
npx @your-org/core init
```

### 💡 Pro Tips

1. **Already linked globally** — The package is ready to use. Just run `npm link @your-org/core` in any project.

2. **Always initialize** — After linking, run `npx @your-org/core init` to set everything up correctly.

3. **Why npm link works great:**
   - See changes instantly (no reinstalling needed)
   - Cleaner than file paths
   - Works just like a published package
   - Perfect for local development

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
- ✅ **Sets up local domain** - Automatic `.local` domain with Caddy (e.g., `my-project.local`)
- ✅ **Sets up IDE colors** - Generates unique color scheme per project
- ✅ Validates everything is set up correctly

**Learning Tip**: This command is idempotent - you can run it multiple times safely. It will skip files that already exist unless you use the `--overwrite` flag.

**Learn More**: See [Project Initialization PRD](../../docs/features/commissioning/PRD.md) for detailed documentation.

### IDE Colors

**Visual project organization** — Each project gets its own color scheme that changes based on your git branch:

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

**Prefer to skip IDE colors?** Use the flag:
```bash
npx @your-org/core init --skip-colors
```

### Domain Manager

**Purpose**: Automatically set up local domains for your projects using Caddy reverse proxy, eliminating the need to remember port numbers.

**Why it matters**: Instead of accessing `localhost:4200`, your projects get memorable domains like `my-project.local`. Domain Manager automatically configures Caddy and your hosts file.

**Automatic Setup**:
```bash
# Happens automatically during project initialization
npx @colis/rig init

# Your project is now accessible at:
# http://my-project.local
```

**Manual Domain Management**:
```bash
# Setup a domain manually
npx @colis/rig domain-manager setup --project-name my-project

# List all configured domains
npx @colis/rig domain-manager list

# Remove a domain
npx @colis/rig domain-manager remove my-project.local
```

**What it does**:
- ✅ Generates domain name from project name (e.g., `my-project.local`)
- ✅ Detects project services and ports automatically
- ✅ Configures Caddy reverse proxy rules
- ✅ Updates system hosts file
- ✅ Supports multi-service projects (frontend + backend)

**Skip domain setup** (if you prefer ports):
```bash
npx @colis/rig init --skip-domain
```

**Learning Tip**: Domain Manager works seamlessly with Port Manager. Ports are allocated first, then domains are configured to route to those ports.

**Learn More**: See [Domain Manager PRD](../../docs/features/domain-manager/PRD.md) for detailed documentation.

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

**CLI Commands**:
```bash
# Port Manager initializes automatically during project setup
# But you can also manage ports manually:

# Set up Port Manager for your project
npx @your-org/core port-manager init

# Get a port assigned to your project
npx @your-org/core port-manager allocate --project-name my-project --app-type nextjs

# Verify your port setup (check for conflicts)
npx @your-org/core port-manager check

# See all your port assignments
npx @your-org/core port-manager list
```

**Learning Tip**: Port Manager automatically detects your project type and suggests appropriate ports. You can override the default port if needed, but the automatic allocation usually works best.

## Rules and Commands

**Supercharge your IDE** — The core package includes Cursor IDE rules and commands that automatically enhance your development workflow. Everything is copied to your project during initialization.

### What Gets Installed

- **Expert Rules** → `.cursor/rules/`
  - **Expert personas**: Specialized AI assistants for different domains
    - Architecture Expert: System design and scalability guidance
    - Security Expert: Security best practices and threat modeling
    - Testing Expert: Test strategy and implementation help
  - **User rules**: Project-specific guidelines and best practices
  
- **Commands** → `.cursor/commands/general/`
  - Reusable commands for common development tasks
  - Commands that work across all your projects
  
- **Local commands**: Not included (these are for the packages repository only)

### How Expert Personas Help

Think of expert personas as **specialized AI assistants** that provide domain-specific guidance. After initialization, you can ask questions like:
- "How should I structure this API?" → Architecture Expert helps
- "Is this code secure?" → Security Expert reviews
- "What tests should I write?" → Testing Expert guides you

**The best part?** They're automatically available in your project — no extra setup needed.

## What's Inside

**Curious about the package structure?** Here's how everything is organized:

```
@your-org/core/
├── features/          # Core features (Port Manager, Tech Detector, etc.)
│   ├── port-manager/  # Port management feature
│   ├── tech-detector/ # Technology detection feature
│   ├── domain-manager/# Domain management feature
│   └── commissioning/ # Project setup feature
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

**Quick Reference**:
- **Features**: Ready-to-use modules you can import in your projects
- **Shared Utilities**: Common code used across features (database, config)
- **Rules**: Cursor IDE configuration that enhances your development experience
- **Commands**: Reusable CLI commands for common development tasks

## Learn More

**Want to dive deeper?** Here's where to find everything you need:

### Getting Started
- **[Getting Started Guide](./GETTING_STARTED.md)**: Step-by-step guide for new users
- **This README**: Quick start guide and feature overview
- **Architecture Documentation** ([ARCHITECTURE.md](./ARCHITECTURE.md)): Deep dive into package architecture and design patterns

### Feature Documentation
- **Port Manager**: [PRD](../../docs/features/port-manager/PRD.md) - Complete feature documentation
- **Project Initialization**: [PRD](../../docs/features/commissioning/PRD.md) - Setup and configuration guide

### Architecture & Strategy
- **Package Architecture Strategy**: [Overview](../../docs/architecture/PACKAGE_ARCHITECTURE.md) - How packages are organized and work together

### Learning Path

**Just getting started?** Follow this path:
1. 📖 **Start here**: Read the [Getting Started Guide](./GETTING_STARTED.md) for step-by-step instructions
2. 🚀 **Try it out**: Run `npx @your-org/core init` in a test project
3. 🔍 **Explore features**: Check out the features section above to see what's available
4. 🏗️ **Understand the design**: Read the Architecture Documentation to see how it all fits together
5. 📚 **Go deeper**: Check individual feature PRDs for advanced usage

**Already familiar?** Jump straight to:
- **Architecture Documentation** — Design patterns and system structure
- **Feature PRDs** — Advanced usage and API details
- **Package Architecture Strategy** — How everything integrates

## License

MIT




