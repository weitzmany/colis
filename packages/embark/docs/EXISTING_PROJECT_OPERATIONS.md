# Existing Project Operations

The `create-project` command now supports operations on existing projects, providing two powerful modes for managing your projects:

## Overview

When you run `create-project` with a project name that already exists, you'll be presented with six options:

1. **Update existing project** - Update project configuration and copy missing files
2. **Add framework** - Add another framework (frontend, backend, mobile) to your project
3. **Delete existing directory** - Remove and start fresh
4. **Abort** - Cancel the operation
5. **Use a new name** - Specify a different project name
6. **Rename existing directory** - Move the existing project to a backup name

## 1. Update Mode

### What It Does

Update mode automatically detects your existing tech stack and ensures all configuration files and tooling are properly set up:

- ✅ **Enforces monorepo structure** (removes nested `.git` directories)
- ✅ Detects existing frameworks (Angular, React, Vue, Slim, Node.js)
- ✅ Verifies and initializes Port Manager configuration
- ✅ Copies missing `.cursor/rules` (expert personas)
- ✅ Copies missing `.cursor/commands` (Cursor commands)
- ✅ Configures IDE colors (`.vscode/settings.json`)
- ✅ Sets up git hooks (`.githooks/`)

### When to Use Update Mode

Use update mode when:
- You created a project without using `create-project` (e.g., manually or via framework CLI)
- Your project is missing configuration files (rules, commands, Port Manager)
- You want to ensure your project has the latest tooling configurations
- You cloned a project and need to set up local configurations

### Example

```bash
create-project my-existing-app
# Select: "Update existing project"
```

### What Gets Updated

```
🔍 Detecting existing tech stack...
✓ Detected technologies:
  Frontend: angular
  Backend: slim

🔍 Enforcing monorepo structure...
  → Removed nested .git: frontend/.git
✓ Removed 1 nested .git directory

🔧 Checking Port Manager...
  ✓ Port Manager initialized (or already configured)

📋 Checking .cursor/rules...
  ✓ Rules copied (12 expert personas)

⚙️  Checking .cursor/commands...
  ✓ Commands copied (15 commands)

🎨 Checking IDE colors...
  ✓ IDE colors configured

✅ Project update complete!
```

### Tech Stack Detection

Update mode automatically detects:

**Frontend:**
- Angular (checks for `angular.json`)
- React (checks for `react` dependency in `package.json`)
- Vue (checks for `vue` dependency in `package.json`)

**Backend:**
- Slim (checks for `slim/slim` in `composer.json`)
- Node.js (checks for `backend/package.json`)

**Project Structure:**
- Single framework projects (framework in root)
- Multi-framework projects (frontend/, backend/, mobile/ subdirectories)

## 2. Add Framework Mode

### What It Does

Add framework mode allows you to add additional frameworks to your existing project:

- ➕ Add frontend if you only have backend
- ➕ Add backend if you only have frontend
- ➕ Add mobile to any project
- ➕ Creates proper directory structure
- ➕ Updates root README.md
- ➕ Installs dependencies automatically

### When to Use Add Framework Mode

Use add framework mode when:
- You started with a frontend-only project and now need a backend
- You started with a backend-only project and now need a frontend
- You want to add mobile support to your existing web application
- You want to add a separate admin backend to your existing app

### Supported Frameworks

**Frontend:**
- Angular
- React
- Vue

**Backend:**
- Slim (PHP)
- Node.js/Express

**Mobile:**
- React Native
- Flutter

### Example: Adding Backend to Frontend Project

```bash
create-project my-frontend-app
# Select: "Add framework"
# Select: "Backend - Slim (PHP)"

✓ Current tech stack:
  Frontend: angular

➕ What would you like to add?
# Select: Backend - Slim (PHP)

📦 Adding slim backend to project...
✓ Created 15 files
📝 Updating root README...
✓ Updated README.md
📦 Installing dependencies...
✓ Dependencies installed

✅ slim backend added successfully!
Location: backend/
```

### Example: Adding Frontend to Backend Project

```bash
create-project my-backend-app
# Select: "Add framework"
# Select: "Frontend - Angular"

✓ Current tech stack:
  Backend: slim

➕ What would you like to add?
# Select: Frontend - Angular

📦 Adding angular frontend to project...
Using Angular CLI...
✓ angular frontend added successfully!
Location: frontend/
```

### Example: Adding Mobile to Full-Stack Project

```bash
create-project my-full-stack-app
# Select: "Add framework"
# Select: "Mobile - React Native"

✓ Current tech stack:
  Frontend: angular
  Backend: slim

➕ What would you like to add?
# Select: Mobile - React Native

📦 Adding react-native mobile to project...
✓ Created 20 files
✓ Updated README.md

✅ react-native mobile added successfully!
Location: mobile/
```

### Directory Structure After Adding Frameworks

**Starting with frontend only:**
```
my-app/
├── angular.json
├── package.json
└── src/
```

**After adding backend:**
```
my-app/
├── frontend/           # Angular moved here
│   ├── angular.json
│   ├── package.json
│   └── src/
├── backend/           # Slim created here
│   ├── composer.json
│   ├── public/
│   └── src/
└── README.md          # Updated with structure
```

**After adding mobile:**
```
my-app/
├── frontend/
├── backend/
├── mobile/            # React Native created here
│   ├── package.json
│   ├── App.js
│   └── ...
└── README.md          # Updated again
```

## How It Works

### 1. Project Detection

When you run `create-project` with an existing project name, the command:

1. Checks if the directory exists
2. Analyzes the directory structure
3. Detects existing frameworks
4. Presents appropriate options

### 2. Update Process

For update mode:

1. **Detect tech stack** - Scans for framework markers
2. **Check Port Manager** - Verifies/initializes port configuration
3. **Check rules** - Copies missing expert personas
4. **Check commands** - Copies missing Cursor commands
5. **Check IDE colors** - Configures `.vscode/settings.json`
6. **Verify setup** - Confirms all configurations are in place

### 3. Add Framework Process

For add framework mode:

1. **Detect current stack** - Identifies existing frameworks
2. **Show available options** - Lists frameworks you don't have yet
3. **Create framework** - Uses CLI or templates to generate files
4. **Update README** - Documents the new structure
5. **Install dependencies** - Runs npm/composer install
6. **Verify setup** - Confirms successful addition

## CLI Integration

These modes are automatically available when the project directory already exists:

```bash
# Existing project - shows all 6 options
create-project my-existing-app

# New project - creates normally
create-project my-new-app
```

## Best Practices

### Update Mode Best Practices

1. **Run update regularly** - Keep your project configuration up-to-date
2. **After cloning** - Run update after cloning a project to set up local config
3. **Before major work** - Ensure all tooling is configured before starting
4. **Team consistency** - All team members should run update to have same config

### Add Framework Best Practices

1. **Plan structure** - Decide on frontend/backend/mobile before starting
2. **Add incrementally** - Add one framework at a time
3. **Test after adding** - Verify each framework works before adding more
4. **Update README** - Keep project documentation current (done automatically)

## Comparison with Other Options

### Update vs Delete & Recreate

**Update:**
- ✅ Preserves your code
- ✅ Only adds missing configurations
- ✅ Fast and non-destructive
- ✅ Safe for existing projects

**Delete & Recreate:**
- ❌ Deletes all your code
- ❌ Starts completely fresh
- ❌ Slower
- ⚠️  Only use for truly fresh starts

### Add Framework vs Manual Setup

**Add Framework:**
- ✅ Automatic directory structure
- ✅ Proper integration with existing code
- ✅ Updates README automatically
- ✅ Configures ports correctly

**Manual Setup:**
- ❌ Manual directory creation
- ❌ Manual integration
- ❌ Manual documentation
- ❌ Manual port configuration

## Troubleshooting

### Update Mode Issues

**Problem:** "Port Manager not found"
```bash
# Solution: Update will automatically initialize Port Manager
# No action needed - it's handled automatically
```

**Problem:** "Rules not found"
```bash
# Solution: Update will automatically copy rules
# Ensure @colis/rig is globally linked
```

**Problem:** "Commands not found"
```bash
# Solution: Update will automatically copy commands
# Ensure @colis/rig is globally linked
```

### Add Framework Issues

**Problem:** "Cannot add framework: A similar framework already exists"
```bash
# Solution: You already have a frontend/backend of that type
# Use update mode instead to refresh configuration
```

**Problem:** "Template not found"
```bash
# Solution: Ensure all templates are available
# Check packages/template-project/src/templates/
```

**Problem:** "Framework CLI failed"
```bash
# Solution: Check that the framework CLI is available
# For Angular: npm install -g @angular/cli
# For React: npx works automatically
```

## Examples

### Example 1: Update an Existing Angular Project

```bash
# You created a project manually with ng new
ng new my-app

# Now run create-project to add tooling
create-project my-app

# Select: "Update existing project"
# ✓ Port Manager initialized
# ✓ Rules copied
# ✓ Commands copied
# ✓ IDE colors configured
```

### Example 2: Add Backend to Frontend Project

```bash
# Created frontend project
create-project my-frontend-app

# Later, need to add backend
create-project my-frontend-app

# Select: "Add framework"
# Select: "Backend - Slim (PHP)"
# ✓ Backend created in backend/
# ✓ README updated
```

### Example 3: Full-Stack Project Evolution

```bash
# Start with backend
create-project my-api
# Select stack: Backend - Slim

# Add frontend
create-project my-api
# Select: "Add framework"
# Select: "Frontend - Angular"

# Add mobile
create-project my-api
# Select: "Add framework"
# Select: "Mobile - React Native"

# Final structure:
# my-api/
# ├── frontend/   (Angular)
# ├── backend/    (Slim)
# └── mobile/     (React Native)
```

## Summary

The existing project operations provide two powerful modes:

1. **Update Mode** - Ensures your project has all the latest configurations and tooling
2. **Add Framework Mode** - Allows incremental project growth by adding frameworks as needed

Both modes:
- ✅ Preserve your existing code
- ✅ Work intelligently with existing structure
- ✅ Provide clear feedback about what's being done
- ✅ Can be run multiple times safely
- ✅ Are fully integrated with the create-project workflow

These features make `create-project` a comprehensive tool for managing projects throughout their entire lifecycle, not just during initial creation.
