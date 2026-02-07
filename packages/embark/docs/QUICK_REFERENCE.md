# Quick Reference: Existing Project Operations

## TL;DR

When you run `create-project` on an **existing directory**, you now get **6 options** instead of 4:

1. 🔄 **Update** - Add missing configurations (ports, rules, commands, colors)
2. ➕ **Add Framework** - Add frontend, backend, or mobile to existing project
3. 🗑️ **Delete** - Remove directory and start fresh
4. ❌ **Abort** - Cancel operation
5. 🔤 **New Name** - Use different project name
6. 📦 **Rename** - Move existing directory to backup

## Quick Commands

### Update an Existing Project

```bash
create-project my-existing-app
# Select: "Update existing project"
```

**What it does:**
- Detects your tech stack
- Adds Port Manager if missing
- Copies `.cursor/rules` if missing
- Copies `.cursor/commands` if missing
- Configures IDE colors if missing

**Safe:** Preserves all your code ✅

### Add Framework to Existing Project

```bash
create-project my-existing-app
# Select: "Add framework"
# Choose: Frontend/Backend/Mobile
```

**Options:**
- Frontend: Angular, React, Vue
- Backend: Slim (PHP), Node.js
- Mobile: React Native, Flutter

**Safe:** Preserves all your code ✅

## Common Scenarios

### Scenario 1: Manual Project → Add Tooling

```bash
# You created manually
ng new my-app

# Add tooling
create-project my-app → "Update existing project"
```

### Scenario 2: Frontend → Add Backend

```bash
# Have frontend
create-project my-app → "Add framework" → "Backend - Slim"
```

**Result:**
```
my-app/
├── frontend/   (your existing Angular code)
└── backend/    (new Slim backend)
```

### Scenario 3: Backend → Add Frontend

```bash
# Have backend
create-project my-api → "Add framework" → "Frontend - Angular"
```

**Result:**
```
my-api/
├── frontend/   (new Angular frontend)
└── backend/    (your existing Slim code)
```

### Scenario 4: Full-Stack → Add Mobile

```bash
# Have frontend + backend
create-project my-app → "Add framework" → "Mobile - React Native"
```

**Result:**
```
my-app/
├── frontend/   (existing)
├── backend/    (existing)
└── mobile/     (new React Native)
```

## What Gets Detected

### Frontend Detection

| Framework | Detected By |
|-----------|-------------|
| Angular   | `angular.json` file exists |
| React     | `react` in `package.json` dependencies |
| Vue       | `vue` in `package.json` dependencies |

### Backend Detection

| Framework | Detected By |
|-----------|-------------|
| Slim (PHP) | `slim/slim` in `composer.json` |
| Node.js    | `backend/package.json` exists |

### Structure Detection

| Structure | Detected By |
|-----------|-------------|
| Single framework | Framework files in root directory |
| Multi-framework  | `frontend/`, `backend/`, `mobile/` subdirectories |

## What Gets Updated (Update Mode)

| Component | What Happens |
|-----------|--------------|
| Port Manager | Initialized if `.port-manager.json` missing |
| Rules | Copied to `.cursor/rules/` if missing |
| Commands | Copied to `.cursor/commands/` if missing |
| IDE Colors | Added to `.vscode/settings.json` if missing |
| Git Hooks | Copied to `.githooks/` if missing |

## What Gets Added (Add Framework Mode)

| Action | What Happens |
|--------|--------------|
| Directory | Creates `frontend/`, `backend/`, or `mobile/` subdirectory |
| Files | Generates framework files using CLI or templates |
| README | Updates root `README.md` with new structure |
| Dependencies | Installs npm/composer dependencies automatically |

## When to Use Each Mode

### Use Update Mode When:
- ✅ Project created manually (not via create-project)
- ✅ Cloned project needs local setup
- ✅ Missing configuration files
- ✅ Want latest tooling configurations

### Use Add Framework Mode When:
- ✅ Started with frontend, need backend
- ✅ Started with backend, need frontend
- ✅ Want to add mobile to existing web app
- ✅ Want separate admin backend
- ✅ Building incrementally

## Safety Guarantees

Both new modes are **100% safe**:

| Operation | Your Code | Configurations |
|-----------|-----------|----------------|
| Update | ✅ Preserved | ✅ Added if missing |
| Add Framework | ✅ Preserved | ✅ New directory created |

**Nothing gets deleted or overwritten** in update or add framework modes.

## Quick Comparison

| Mode | Adds Config | Adds Code | Modifies Existing |
|------|-------------|-----------|-------------------|
| Update | ✅ Yes | ❌ No | ❌ No |
| Add Framework | ✅ Yes | ✅ Yes (new dir) | ❌ No |
| Delete | ❌ No | ❌ No | ✅ Yes (deletes all) |

## Tips

### Best Practices

1. **Run update after cloning** - Set up local configuration
2. **Add incrementally** - Start with one framework, add more later
3. **Update regularly** - Keep configurations current
4. **Test after adding** - Verify new framework works before continuing

### Troubleshooting

**Problem:** "Cannot add framework: A similar framework already exists"
- **Solution:** You already have that framework type. Use update mode instead.

**Problem:** "Port Manager not found"
- **Solution:** Update mode will initialize it automatically.

**Problem:** "Rules not found"
- **Solution:** Ensure `@colis/rig` is globally linked.

**Problem:** "Framework CLI failed"
- **Solution:** Install the framework CLI globally (e.g., `npm i -g @angular/cli`).

## Examples

### Example 1: Complete Evolution

```bash
# Day 1: Create backend
create-project my-api
# Choose: Backend - Slim

# Day 10: Add frontend
create-project my-api → "Add framework" → "Frontend - Angular"

# Day 30: Add mobile
create-project my-api → "Add framework" → "Mobile - React Native"

# Final result: Full-stack project!
my-api/
├── frontend/
├── backend/
└── mobile/
```

### Example 2: Update Cloned Project

```bash
# Clone project
git clone https://github.com/user/project.git
cd project

# Set up local tooling
create-project project → "Update existing project"

# ✅ Ready for development!
```

### Example 3: Manual to Managed

```bash
# Created manually
ng new my-app

# Add all tooling
create-project my-app → "Update existing project"

# ✅ Now managed by create-project!
```

## Summary

**Old Behavior:**
```
Existing project? → Delete or rename only
```

**New Behavior:**
```
Existing project? → Update, Add Framework, Delete, Abort, New Name, or Rename
```

**Key Benefits:**
- ✅ Non-destructive operations
- ✅ Incremental project growth
- ✅ Configuration management
- ✅ Framework flexibility
- ✅ Safe for production code

## Learn More

- Full documentation: [`EXISTING_PROJECT_OPERATIONS.md`](./EXISTING_PROJECT_OPERATIONS.md)
- Implementation details: [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)

---

**Remember:** Update and Add Framework modes are **completely safe** - they never delete or modify your existing code!
