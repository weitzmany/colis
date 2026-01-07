# @your-org/core

Core package providing foundational features, rules, experts, and commands for all projects.

## Installation

```bash
npm install @your-org/core
```

## Features

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
npx @your-org/core port-manager init
npx @your-org/core port-manager allocate --project-name my-project --app-type nextjs
```

## Rules and Commands

This package includes Cursor rules and commands that can be copied to your projects:

- **Rules**: `./rules/` - Expert personas and user rules
- **Commands**: `./commands/` - Cursor commands for common tasks

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

