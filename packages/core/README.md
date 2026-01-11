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

### Project Initialization

Automatically set up new projects with one command:

```bash
npx @your-org/core init
```

**What it does**:
- Copies all rules (expert personas, user rules) to `.cursor/rules/`
- Copies general commands to `.cursor/commands/` (excludes local commands)
- Initializes Port Manager automatically (mandatory)
- **Sets up IDE colors** - Generates unique color scheme per project
- Validates everything is set up correctly

See [Project Initialization PRD](../../docs/features/project-initialization/PRD.md) for details.

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

Automatically manage port assignments across all your projects:

```typescript
import { PortManager } from '@your-org/core/features/port-manager';

const manager = new PortManager({
  database: {
    type: 'sqlite',
    path: '~/.port-manager/registry.db'
  }
});

const port = await manager.allocate('my-project', 'nextjs');
```

**CLI Usage**:
```bash
# Port Manager is automatically initialized during project init
# But you can also use it directly:
npx @your-org/core port-manager init
npx @your-org/core port-manager allocate --project-name my-project --app-type nextjs
```

## Rules and Commands

This package includes Cursor rules and commands that are automatically copied to your project during initialization:

- **Rules**: Expert personas and user rules → `.cursor/rules/`
- **Commands**: General commands → `.cursor/commands/general/`
- **Local Commands**: Excluded (these are for the packages repo only)

## Package Structure

```
@your-org/core/
├── features/          # Core features (Port Manager, etc.)
├── shared/            # Shared utilities
├── rules/             # Cursor rules
└── commands/          # Cursor commands
```

## Documentation

- [Architecture Documentation](./ARCHITECTURE.md) - Package architecture and design patterns
- [Port Manager PRD](../../docs/features/port-manager/PRD.md) - Port Manager feature documentation
- [Package Architecture Strategy](../../docs/architecture/PACKAGE_ARCHITECTURE.md) - Overall package architecture strategy

## License

MIT




