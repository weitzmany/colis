# Getting Started with @your-org/core

**Welcome!** This guide will help you get started with the core package quickly and effectively.

## What is @your-org/core?

The `@your-org/core` package is a foundational development toolkit that provides:
- **Features**: Reusable tools like Port Manager, Tech Detector, and Project Initialization
- **Rules**: Cursor IDE rules and expert personas for enhanced development
- **Commands**: CLI commands for common development tasks
- **Shared Utilities**: Database abstractions and configuration management

## Prerequisites

Before you begin, make sure you have:
- **Node.js** version 18.0.0 or higher
- **npm** or **yarn** package manager
- A project directory where you want to use the core package

## Installation

### Step 1: One-Time Setup (Only Needed Once)

If you're developing the core package locally, link it globally:

```bash
cd ~/Documents/packages/packages/core
npm link
```

This creates a global symlink so you can use `npm link @your-org/core` in any project.

### Step 2: Install in Your Project

Navigate to your project directory and install the core package:

```bash
# Option 1: Using npm link (for local development)
npm link @your-org/core

# Option 2: Using file path (alternative)
npm install file:../../path/to/packages/core

# Option 3: When published to npm (future)
npm install @your-org/core
```

### Step 3: Initialize Your Project

Run the initialization command to set up everything:

```bash
npx @your-org/core init
```

**That's it!** Your project is now configured with:
- ✅ All expert personas and user rules
- ✅ General commands for common tasks
- ✅ Port Manager initialized and configured
- ✅ Technology stack detected and saved
- ✅ IDE colors configured (unique colors per project)

## Understanding What Happened

When you ran `npx @your-org/core init`, the following happened:

1. **Rules Copied**: Expert personas and user rules were copied to `.cursor/rules/`
2. **Commands Copied**: General commands were copied to `.cursor/commands/general/`
3. **Port Manager Initialized**: Port Manager was set up and configured for your project
4. **Tech Stack Detected**: Your project's technology stack was detected and saved
5. **IDE Colors Configured**: Unique colors were assigned to your project

## Next Steps

### Explore the Features

Now that your project is initialized, you can explore the available features:

#### Port Manager
```bash
# Check your port status
npx @your-org/core port-manager check

# List all port assignments
npx @your-org/core port-manager list
```

#### Tech Detector
```bash
# Detect your project's technology stack
npx @your-org/core tech-detect
```

### Use Features Programmatically

You can also use features in your code:

```typescript
// Import Port Manager
import { PortManager } from '@your-org/core/features/port-manager';

// Create a Port Manager instance
const manager = new PortManager({
  database: {
    type: 'sqlite',
    path: '~/.port-manager/registry.db'
  }
});

// Allocate a port
const port = await manager.allocate('my-project', 'nextjs');
```

### Learn More

- **README.md**: Overview of all features
- **ARCHITECTURE.md**: Deep dive into package architecture
- **Feature PRDs**: Detailed documentation for each feature

## Common Tasks

### Re-initializing Your Project

If you need to re-initialize your project (e.g., after updating the core package):

```bash
npx @your-org/core init --overwrite
```

**Warning**: This will overwrite existing files. Use with caution.

### Updating Your Project

To update your project with the latest rules and commands:

```bash
npx @your-org/core update
```

This updates your project without overwriting local changes.

### Skipping Specific Steps

You can skip specific initialization steps:

```bash
# Skip Port Manager initialization
npx @your-org/core init --skip-port-manager

# Skip IDE colors
npx @your-org/core init --skip-colors

# Skip rules copying
npx @your-org/core init --skip-rules

# Skip commands copying
npx @your-org/core init --skip-commands
```

## Troubleshooting

### Port Manager Not Working

If Port Manager isn't working:
1. Check if it was initialized: `npx @your-org/core port-manager check`
2. Re-initialize if needed: `npx @your-org/core port-manager init`

### Rules Not Appearing

If rules aren't appearing in your IDE:
1. Check if `.cursor/rules/` directory exists
2. Restart your IDE (Cursor/VS Code)
3. Re-run initialization: `npx @your-org/core init`

### Commands Not Available

If commands aren't available:
1. Check if `.cursor/commands/general/` directory exists
2. Verify the command file exists
3. Re-run initialization: `npx @your-org/core init`

## Getting Help

- **Documentation**: Check the README.md and ARCHITECTURE.md files
- **Feature PRDs**: Detailed documentation for each feature
- **Issues**: Report issues or ask questions in the project repository

## Learning Resources

### For Beginners
1. Start with this Getting Started guide
2. Read the README.md for feature overview
3. Try the examples in each feature section
4. Explore the `.cursor/rules/` directory to see what was installed

### For Advanced Users
1. Read ARCHITECTURE.md for design patterns
2. Check feature PRDs for detailed API documentation
3. Explore the source code in `packages/core/src/`
4. Review the Package Architecture Strategy document

## Best Practices

1. **Always initialize**: Run `npx @your-org/core init` after installing
2. **Keep updated**: Update the core package regularly to get new features
3. **Use Port Manager**: Let Port Manager handle port assignments automatically
4. **Explore features**: Try different features to see what works best for your workflow
5. **Read documentation**: Check feature PRDs for advanced usage

---

**Happy coding!** 🚀
