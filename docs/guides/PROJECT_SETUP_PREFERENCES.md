# Project Setup Preferences

This document records user preferences and conventions for setting up new projects.

**Last Updated**: 2026-01-05

## Project Location

### Default Projects Directory

**From 2026-01-05 onwards**, all new projects should be created at:

```
/Users/yoavweitzman/Documents/Projects
```

### Previous Location

Previously, projects were created in various locations under `~/Documents/`, including:
- `~/Documents/bots/`
- `~/Documents/discord-story-bot/`
- `~/Documents/games/`
- `~/Documents/sandbox/`
- `~/Documents/packages/` (this repository)

### Migration Note

Existing projects remain in their current locations. This preference applies only to **new projects** created from 2026-01-05 onwards.

## Project Setup Workflow

When creating a new project in `/Users/yoavweitzman/Documents/Projects/`:

1. **Create project directory**:
   ```bash
   mkdir -p /Users/yoavweitzman/Documents/Projects/my-new-project
   cd /Users/yoavweitzman/Documents/Projects/my-new-project
   ```

2. **Initialize project** (if using Node.js/npm):
   ```bash
   npm init -y
   ```

3. **Install and initialize core package**:
   ```bash
   npm install @your-org/core
   npx @your-org/core init
   ```

4. **Project is ready** with:
   - All Cursor rules and expert personas
   - Standardized commands
   - Port Manager initialized
   - Consistent setup

## Directory Structure

New projects should follow this structure:

```
/Users/yoavweitzman/Documents/Projects/
├── project-name-1/
│   ├── .cursor/
│   │   ├── rules/
│   │   └── commands/
│   ├── src/
│   ├── package.json
│   └── ...
├── project-name-2/
│   └── ...
└── ...
```

## Benefits of Centralized Location

- **Organization**: All projects in one location
- **Easy Discovery**: Easy to find and list all projects
- **Consistent Structure**: All projects follow same location pattern
- **Port Management**: Port Manager can easily discover and manage all projects
- **Documentation**: Easier to document and track all projects

## Related Documentation

- [Project Initialization PRD](../features/project-initialization/PRD.md) - Automated project setup
- [Port Manager PRD](../features/port-manager/PRD.md) - Port assignment and management
- [Project Purpose](../reference/PROJECT_PURPOSE.md) - Project goals and structure

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created project setup preferences document to record user preference for creating new projects at `/Users/yoavweitzman/Documents/Projects` starting from 2026-01-05. This document serves as a reference for future project creation and ensures consistency in project location and setup workflow.

---
