# IDE Colors Usage Guide

This guide explains how to use the automatic IDE color feature in new projects.

## Quick Start

When you initialize a new project with `@your-org/core`, IDE colors are automatically configured:

```bash
# Step 1: Create and navigate to your project
cd ~/Documents/Projects/my-new-project
npm init -y

# Step 2: Install core package
npm link @your-org/core

# Step 3: Initialize (includes IDE colors)
npx @your-org/core init
```

That's it! Your IDE colors are now configured.

## What Gets Set Up

### 1. Post-Checkout Git Hook

A `.githooks/post-checkout` hook is created that:
- Detects the current git branch
- Updates `.vscode/settings.json` with branch-specific colors
- Runs automatically when you switch branches

### 2. Initial Settings File

`.vscode/settings.json` is created with:
- Colors based on your current branch
- All UI elements styled (title bar, status bar, activity bar, borders, tabs)
- Automatically ignored by git (won't be committed)

### 3. Git Configuration

- Git hooks path is set to `.githooks`
- `.vscode/settings.json` is added to `.gitignore`
- If the file was previously tracked, it's removed from git tracking

## Color Scheme

### Branch-Based Colors

| Branch | Color | Hex Code | Description |
|--------|-------|----------|-------------|
| `main` / `master` | 🔴 RED | `#ed3535` | Production/main branch |
| `development` / `dev` | 🟠 ORANGE | `#FF8C00` | Development branch |
| Other branches | 🎨 Project KEY_COLOR | Unique per project | Feature branches |

### Project KEY_COLOR

Each project gets a unique KEY_COLOR based on:
- Project name (deterministic hash)
- Curated color palette (light gray, light blue, coral, yellow, green, pink, purple, cyan, orange)
- Ensures uniqueness across all your projects
- **Only assigned during initialization** - existing projects are not affected

All UI colors are derived from KEY_COLOR:
- **Title bar background**: Branch color
- **Status bar**: Branch color
- **Activity bar**: Darker background with branch color accent
- **Borders**: Lightened KEY_COLOR
- **Tabs**: Branch color border

## How It Works

### During Initialization

```bash
npx @your-org/core init
```

The init process:
1. Generates a unique KEY_COLOR for your project
2. Creates `.githooks/post-checkout` hook with your colors
3. Configures git to use `.githooks` directory
4. Ensures `.vscode/settings.json` is ignored
5. Removes `settings.json` from git tracking (if previously tracked)
6. Initializes `settings.json` with current branch colors

### When Switching Branches

```bash
git checkout main        # IDE automatically turns RED
git checkout development # IDE automatically turns ORANGE
git checkout feature-x  # IDE uses project KEY_COLOR
```

The post-checkout hook runs automatically and updates colors.

## Manual Usage

### Regenerate Colors

If you need to regenerate colors (e.g., after updating the core package):

```bash
# Run the hook manually
bash .githooks/post-checkout
```

### Skip Colors During Init

If you don't want IDE colors:

```bash
npx @your-org/core init --skip-colors
```

### Update Colors for Existing Project

If you want to add colors to an existing project:

```bash
# Just run init again (it will update the hook)
npx @your-org/core init
```

## File Structure

After initialization, you'll have:

```
my-project/
├── .githooks/
│   └── post-checkout          # Git hook that updates colors
├── .vscode/
│   └── settings.json          # IDE color settings (ignored by git)
├── .gitignore                 # Contains .vscode/settings.json
└── ...
```

## Troubleshooting

### Colors Not Updating

1. **Check git hooks path**:
   ```bash
   git config core.hooksPath
   # Should output: .githooks
   ```

2. **Verify hook exists and is executable**:
   ```bash
   ls -l .githooks/post-checkout
   # Should show: -rwxr-xr-x (executable)
   ```

3. **Run hook manually**:
   ```bash
   bash .githooks/post-checkout
   ```

### Settings File Not Ignored

1. **Check .gitignore**:
   ```bash
   grep "settings.json" .gitignore
   # Should show: .vscode/settings.json
   ```

2. **Remove from git tracking**:
   ```bash
   git rm --cached .vscode/settings.json
   ```

### Git Not Initialized

If git isn't initialized yet, colors will still be set up:
- The hook will be created
- `settings.json` will be initialized
- Colors will apply once git is initialized and you switch branches

## Customization

### Change KEY_COLOR

The KEY_COLOR is generated from your project name. To use a custom color:

1. Edit `.githooks/post-checkout`
2. Change the `KEY_COLOR` variable
3. Run the hook: `bash .githooks/post-checkout`

### Adjust Color Palette

Colors are generated using the 70's inspired palette. To customize:

1. Edit `packages/core/src/features/project-initialization/color-manager.ts`
2. Modify the `SEVENTIES_PALETTE` or color generation logic
3. Rebuild the package

## Examples

### New Project Setup

```bash
# Create project
mkdir ~/Documents/Projects/my-app
cd ~/Documents/Projects/my-app
npm init -y

# Install core package
npm link @your-org/core

# Initialize (includes colors)
npx @your-org/core init

# Output:
# 🎨 Setting up IDE colors...
#   ✓ Generated post-checkout hook with KEY_COLOR: #81ca95
#   ✓ Configured git hooks path
#   ✓ Ensured .vscode/settings.json is ignored and removed from git tracking
#   ✓ Initialized .vscode/settings.json with color scheme
```

### Branch Switching

```bash
# Start on main branch (RED)
git checkout main
# IDE title bar and status bar turn RED

# Switch to development (ORANGE)
git checkout development
# IDE colors automatically change to ORANGE

# Create feature branch (Project KEY_COLOR)
git checkout -b feature/new-feature
# IDE uses unique project KEY_COLOR
```

## Benefits

1. **Visual Distinction**: Instantly know which branch you're on by color
2. **Project Uniqueness**: Each project has its own color scheme
3. **Automatic**: Colors update automatically when switching branches
4. **Non-Intrusive**: Settings file is ignored, won't clutter your repo
5. **Consistent**: Same color system across all projects

## Related Documentation

- [Project Initialization PRD](../features/project-initialization/PRD.md)
- [Core Package README](../../packages/core/README.md)
