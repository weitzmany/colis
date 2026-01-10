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
- Validates everything is set up correctly

See [Project Initialization PRD](../../docs/features/project-initialization/PRD.md) for details.

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

See the [Port Manager PRD](../../docs/features/port-manager/PRD.md) for detailed documentation.

## License

MIT




