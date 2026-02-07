# Getting Started with @colis/rig

**Welcome!** This guide will get you up and running with the rig package in minutes.

## What is @colis/rig?

Think of `@colis/rig` as your **development foundation** — a toolkit that provides:
- **Features**: Reusable tools like Port Manager, Tech Detector, and Project Initialization
- **Rules**: Cursor IDE rules and expert personas for enhanced development
- **Commands**: CLI commands for common development tasks
- **Shared Utilities**: Database abstractions and configuration management

## What You'll Need

Before getting started, make sure you have:
- **Node.js** version 18.0.0 or higher
- **npm** or **yarn** package manager
- A project directory where you want to use the rig package

## Installation

### Step 1: One-Time Setup

**First time using the rig package?** Link it globally once:

```bash
cd ~/Documents/packages/packages/rig
npm link
```

This creates a global symlink so you can use `npm link @colis/rig` in any project.

### Step 2: Install in Your Project

Navigate to your project directory and install the rig package:

```bash
# Option 1: Using npm link (for local development)
npm link @colis/rig

# Option 2: Using file path (alternative)
npm install file:../../path/to/packages/rig

# Option 3: When published to npm (future)
npm install @colis/rig
```

### Step 3: Initialize Your Project

Run the initialization command to set up everything:

```bash
npx @colis/rig init
```

**That's it!** Your project is now configured with:
- ✅ All expert personas and user rules
- ✅ General commands for common tasks
- ✅ Port Manager initialized and configured
- ✅ Technology stack detected and saved
- ✅ IDE colors configured (unique colors per project)

## What Just Happened?

When you ran `npx @colis/rig init`, here's what was set up:

1. **Rules Copied**: Expert personas and user rules were copied to `.cursor/rules/`
2. **Commands Copied**: General commands were copied to `.cursor/commands/general/`
3. **Port Manager Initialized**: Port Manager was set up and configured for your project
4. **Tech Stack Detected**: Your project's technology stack was detected and saved
5. **IDE Colors Configured**: Unique colors were assigned to your project

## What's Next?

### Try Out the Features

Now that your project is set up, explore what's available:

#### Port Manager
```bash
# Check your port status
npx @colis/rig port-manager check

# List all port assignments
npx @colis/rig port-manager list
```

#### Tech Detector
```bash
# Detect your project's technology stack
npx @colis/rig tech-detect
```

### Use Features Programmatically

You can also use features in your code:

```typescript
// Import Port Manager
import { PortManager } from '@colis/rig/features/port-manager';

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

If you need to re-initialize your project (e.g., after updating the rig package):

```bash
npx @colis/rig init --overwrite
```

**Warning**: This will overwrite existing files. Use with caution.

### Updating Your Project

To update your project with the latest rules and commands:

```bash
npx @colis/rig update
```

This updates your project without overwriting local changes.

### Skipping Specific Steps

You can skip specific initialization steps:

```bash
# Skip Port Manager initialization
npx @colis/rig init --skip-port-manager

# Skip IDE colors
npx @colis/rig init --skip-colors

# Skip rules copying
npx @colis/rig init --skip-rules

# Skip commands copying
npx @colis/rig init --skip-commands
```

## Troubleshooting

**Running into issues?** Here are quick fixes for common problems:

### Port Manager Not Working

**Problem**: Port Manager commands aren't working.

**Solution**:
1. Check initialization status: `npx @colis/rig port-manager check`
2. Re-initialize if needed: `npx @colis/rig port-manager init`

### Rules Not Showing Up

**Problem**: Expert personas and rules aren't appearing in your IDE.

**Solution**:
1. Verify `.cursor/rules/` directory exists
2. Restart your IDE (Cursor/VS Code)
3. Re-run initialization: `npx @colis/rig init`

### Commands Missing

**Problem**: Commands aren't available in your IDE.

**Solution**:
1. Check if `.cursor/commands/general/` directory exists
2. Verify command files are present
3. Re-run initialization: `npx @colis/rig init`

## Need Help?

- **📖 Documentation**: Check README.md and ARCHITECTURE.md for detailed information
- **🔍 Feature Docs**: Each feature has its own PRD with complete documentation
- **🐛 Issues**: Found a bug or have a question? Report it in the project repository

## Learning Resources

### 🎓 For Beginners

**New to the rig package?** Start here:
1. **This guide** — You're reading it! Follow the steps above
2. **README.md** — Overview of all features and capabilities
3. **Try the examples** — Each feature section has working examples
4. **Explore `.cursor/rules/`** — See what expert personas were installed

### 🚀 For Advanced Users

**Ready to go deeper?** Check out:
1. **ARCHITECTURE.md** — Design patterns and system structure
2. **Feature PRDs** — Complete API documentation for each feature
3. **Source code** — Explore `packages/rig/src/` to see how it works
4. **Package Architecture Strategy** — Understand how everything fits together

## Best Practices

**Get the most out of the rig package** with these tips:

1. **Always initialize** — Run `npx @colis/rig init` after installing to set everything up
2. **Stay updated** — Update the rig package regularly to get new features and improvements
3. **Use Port Manager** — Let it handle port assignments automatically (it's smarter than manual management)
4. **Explore features** — Try different features to discover what works best for your workflow
5. **Read the docs** — Feature PRDs have advanced usage examples and API details

---

**Ready to build something amazing?** 🚀

The rig package is your foundation — now go create something great!
