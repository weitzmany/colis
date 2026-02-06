# Setup Instructions for Template Project

## One-Time Setup: Link Core Package Globally

Before creating projects, you need to link the `@your-org/core` package globally so that Project Initialization can run automatically.

### Step 1: Link Core Package

```bash
# Navigate to the core package directory
cd /Users/yoavweitzman/Documents/packages/packages/core

# Build the package (if not already built)
npm run build

# Link it globally
npm link
```

**Expected Output:**
```
/Users/yoavweitzman/.nvm/versions/node/v22.12.0/lib/node_modules/@your-org/core -> /Users/yoavweitzman/Documents/packages/packages/core
```

### Step 2: Verify Link

```bash
# Check if it's linked
npm list -g --depth=0 | grep "@your-org/core"
```

You should see `@your-org/core` in the output.

### Step 3: Link Template Project (Optional but Recommended)

```bash
# Navigate to template-project package
cd /Users/yoavweitzman/Documents/packages/packages/template-project

# Build the package
npm run build

# Link it globally
npm link
```

**Expected Output:**
```
/Users/yoavweitzman/.nvm/versions/node/v22.12.0/lib/node_modules/@your-org/template-project -> /Users/yoavweitzman/Documents/packages/packages/template-project
```

## Usage After Setup

Once both packages are linked, you can create projects:

```bash
# From anywhere
create-project create my-awesome-app
```

The Project Initialization will run automatically because `@your-org/core` is available globally.

## Troubleshooting

### If Project Initialization Still Fails

If you get errors about `@your-org/core` not being found:

1. **Check if core is linked:**
   ```bash
   npm list -g --depth=0 | grep "@your-org/core"
   ```

2. **Re-link if needed:**
   ```bash
   cd /Users/yoavweitzman/Documents/packages/packages/core
   npm link
   ```

3. **In your new project, link core locally:**
   ```bash
   cd ~/Documents/Projects/my-new-project
   npm link @your-org/core
   ```

4. **Then run init manually:**
   ```bash
   npx @your-org/core init
   ```

### If Template Project Command Not Found

If `create-project` command is not found:

1. **Check if template-project is linked:**
   ```bash
   npm list -g --depth=0 | grep "@your-org/template-project"
   ```

2. **Re-link if needed:**
   ```bash
   cd /Users/yoavweitzman/Documents/packages/packages/template-project
   npm run build
   npm link
   ```

3. **Verify the command:**
   ```bash
   which create-project
   ```

## Quick Setup Script

You can create a quick setup script to link everything:

```bash
#!/bin/bash
# setup-packages.sh

cd /Users/yoavweitzman/Documents/packages/packages/core
npm run build
npm link

cd /Users/yoavweitzman/Documents/packages/packages/template-project
npm run build
npm link

echo "✅ Packages linked successfully!"
echo "You can now use: create-project create my-app"
```

Save this as `setup-packages.sh`, make it executable (`chmod +x setup-packages.sh`), and run it whenever you need to refresh the links.

## Notes

- **npm link** creates a symlink, so changes to the source code are immediately available
- You only need to run `npm link` once per package (unless you unlink them)
- If you update the packages, you may need to rebuild (`npm run build`) but don't need to re-link
- The links persist until you explicitly unlink them with `npm unlink -g @your-org/core`
