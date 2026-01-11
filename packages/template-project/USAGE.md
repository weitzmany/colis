# Using Template Project Locally

Since `@your-org/template-project` is not yet published to npm, you need to use it locally.

## Setup (One-Time)

### Option 1: Use npm link (Recommended)

```bash
# Navigate to template-project package
cd /Users/yoavweitzman/Documents/packages/packages/template-project

# Build the package
npm run build

# Link it globally
npm link
```

Now you can use it from anywhere:

```bash
create-project create my-awesome-app
```

### Option 2: Use Directly from Package Directory

```bash
# Navigate to template-project package
cd /Users/yoavweitzman/Documents/packages/packages/template-project

# Build the package
npm run build

# Use the command directly
node bin/create-project create my-awesome-app
```

### Option 3: Use npx with Local Path

```bash
# From anywhere, use npx with the local path
npx /Users/yoavweitzman/Documents/packages/packages/template-project create my-awesome-app
```

## Usage

After setup, create a new project:

```bash
# Basic usage (interactive prompts)
create-project create my-awesome-app

# With options
create-project create my-awesome-app \
  --template angular \
  --package-manager pnpm \
  --description "My awesome app"

# Skip certain steps
create-project create my-awesome-app \
  --skip-deps \
  --skip-git \
  --skip-task-manager
```

## Troubleshooting

### Command Not Found

If you get `command not found`, make sure you've run `npm link` in the template-project directory.

### Module Resolution Errors

If you see module resolution errors:
1. Make sure you've run `npm run build` in the template-project directory
2. Check that `dist/` directory exists with compiled files
3. Try rebuilding: `npm run clean && npm run build`

### Permission Errors

If you get permission errors:
```bash
chmod +x /Users/yoavweitzman/Documents/packages/packages/template-project/bin/create-project
```

## What Gets Created

When you run `create-project create my-awesome-app`:

1. ✅ Project structure from template
2. ✅ Project Initialization (rules, commands, Port Manager, colors)
3. ✅ Task Manager initialized
4. ✅ Dependencies installed
5. ✅ Git repository initialized
6. ✅ Project opens in Cursor IDE

## Next Steps

After project creation:

```bash
cd my-awesome-app
npm start  # or composer start for Slim projects
```
