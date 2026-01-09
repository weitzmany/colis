# @your-org/core

Core package providing foundational features, rules, experts, and commands for all projects.

## Quick Start

### Step 1: Install Core Package

```bash
npm install @your-org/core
```

### Step 2: Initialize Your Project

```bash
npx @your-org/core init
```

This single command automatically:
- ✅ Copies all expert personas and user rules to `.cursor/rules/`
- ✅ Copies general commands to `.cursor/commands/` (excludes local commands for packages repo)
- ✅ Initializes Port Manager (mandatory)
- ✅ Validates setup

**That's it!** Your project is now set up with all rules, commands, and Port Manager.

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




