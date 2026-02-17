# Complete Project Initialization for Angular CLI Projects

## Problems Solved

### Problem 1: `.vscode` in Wrong Location
When Angular CLI creates a project (e.g., `frontend/`), it creates `.vscode/` inside that directory. For full-stack projects, we want `.vscode/` at the **root** level, not inside the frontend folder.

### Problem 2: Missing Project Initialization
Projects created with Angular CLI weren't getting the full Project Initialization setup:
- ❌ Missing `.cursor/rules/` (complement)
- ❌ Missing `.cursor/commands/` (Cursor commands)
- ❌ Missing `.githooks/` (Git hooks for branch colors)
- ❌ Missing IDE colors in `.vscode/settings.json`
- ❌ Missing Port Manager configuration

## Solution

### 1. Run Full Project Initialization

After Angular CLI creates the project, we now run the **complete** `initializeProject()` which sets up:

✅ **`.cursor/rules/`** - Expert personas and coding rules  
✅ **`.cursor/commands/`** - Cursor commands  
✅ **`.githooks/post-checkout`** - Automatic branch-based colors  
✅ **`.vscode/settings.json`** - IDE color theme  
✅ **`.port-manager.json`** - Port allocation  
✅ **`.gitignore`** - Proper ignores for settings  

### 2. Move `.vscode` to Root (Full-Stack Only)

After Project Initialization completes, if creating a full-stack project:
- **Check** if Angular created `.vscode` in `frontend/`
- **Merge** Angular's settings with root `.vscode/settings.json` (root colors take precedence)
- **Remove** `frontend/.vscode` (use root instead)

```
Before:
my-project/
├── .vscode/              # Created by Project Init ✓
│   └── settings.json     # IDE colors ✓
└── frontend/
    └── .vscode/          # Created by Angular CLI ❌

After:
my-project/
├── .vscode/              # Merged settings ✓
│   └── settings.json     # IDE colors + Angular settings ✓
└── frontend/             # No .vscode here ✓
```

## Implementation Details

### Code Location
File: `packages/template-project/src/cli/commands/create.ts`

### Workflow

1. **Angular CLI Creates Project** (lines ~495-500)
   ```typescript
   execSync(ngCommand, { cwd: angularParentDir, stdio: 'inherit' });
   ```

2. **Project Initialization Runs** (lines ~708-715)
   ```typescript
   await initializeProject({
     projectName: config.projectName,
     appType: resolvedTemplateType,
     skipRules: false,      // Copy complement
     skipCommands: false,   // Copy Cursor commands
     skipPortManager: false, // Init Port Manager
     skipColors: false,     // Setup IDE colors + git hooks
   });
   ```
   
   This creates:
   - `.cursor/rules/` with all complement
   - `.cursor/commands/` with Cursor commands
   - `.githooks/post-checkout` for branch colors
   - `.vscode/settings.json` with IDE colors
   - `.port-manager.json` for port management

3. **Merge Angular's .vscode** (lines ~718-740)
   ```typescript
   // If Angular created .vscode in frontend/, merge with root
   const angularVscodePath = path.join(outputPath, 'frontend', '.vscode');
   const rootVscodePath = path.join(outputPath, '.vscode');
   
   if (await fs.pathExists(angularVscodePath)) {
     // Merge settings (root colors take precedence)
     const merged = { ...angularSettings, ...rootSettings };
     await fs.writeJson(rootSettingsPath, merged);
     
     // Remove frontend/.vscode
     await fs.remove(angularVscodePath);
   }
   ```

## Result

✅ **Single-Stack (Angular only)**: Full Project Init at root  
✅ **Full-Stack (Angular + Slim)**: Full Project Init at root, Angular .vscode merged  
✅ **Cursor Rules**: Expert personas copied  
✅ **Cursor Commands**: Commands available  
✅ **Git Hooks**: Branch-based colors work  
✅ **IDE Colors**: Beautiful unique theme  
✅ **Port Manager**: Automatic port allocation  

## Example Output

```bash
🅰️  Using Angular CLI to generate Angular frontend...
✓ Angular frontend created with Angular CLI

📁 Generating backend from template...
✓ Created 15 backend files

⚙️  Running Project Initialization...
  Linking @colis/rig...
  ✓ Linked @colis/rig

📋 Copying rules...
  ✓ Copied 25 complement
  ✓ Copied 8 user rules

⚡ Copying commands...
  ✓ Copied 12 general commands

🔌 Initializing Port Manager...
  ✓ Allocated port 4200

🎨 Configuring IDE colors...
  ✓ Generated KEY_COLOR: #80CA95
  ✓ Created .githooks/post-checkout
  ✓ Created .vscode/settings.json

✓ Project Initialization completed

📁 Organizing project structure...
  Merging Angular .vscode settings...
  ✓ Merged Angular settings into root .vscode
  Removed frontend/.vscode (using root)
```

## Project Structure

```
my-project/
├── .cursor/
│   ├── rules/              # ✅ Expert personas + user rules
│   │   ├── experts/
│   │   └── user/
│   └── commands/           # ✅ Cursor commands
│       └── general/
├── .githooks/
│   └── post-checkout       # ✅ Branch-based colors
├── .vscode/
│   └── settings.json       # ✅ IDE colors + Angular settings
├── .port-manager.json      # ✅ Port allocation
├── .gitignore              # ✅ Ignores settings.json
├── frontend/               # Angular app (no .vscode)
│   ├── src/
│   └── package.json
├── backend/                # Slim API
│   ├── src/
│   └── composer.json
└── README.md
```

## What initializeProject() Does

The `initializeProject()` function from `@colis/rig` handles:

1. **Rules Copying** (`copyRules`)
   - Copies complement from `@colis/rig/rules/experts/` → `.cursor/rules/experts/`
   - Copies user rules from `@colis/rig/rules/user/` → `.cursor/rules/user/`

2. **Commands Copying** (`copyCommands`)
   - Copies general commands from `@colis/rig/commands/general/` → `.cursor/commands/general/`
   - Excludes local commands (project-specific)

3. **Port Manager Init** (`portManagerInit`)
   - Creates `.port-manager.json`
   - Allocates port for project
   - Registers project in global port registry

4. **IDE Colors Setup** (color manager + hook generator)
   - Generates unique `KEY_COLOR` based on project name
   - Creates `.githooks/post-checkout` for branch-based colors
   - Creates `.vscode/settings.json` with color theme
   - Adds `.vscode/settings.json` to `.gitignore`

## Benefits

✅ **Complete Setup**: Everything configured automatically  
✅ **Expert Personas**: AI agents work optimally  
✅ **Cursor Commands**: All commands available  
✅ **Branch Colors**: Visual branch distinction  
✅ **Port Management**: No port conflicts  
✅ **Clean Workflow**: No manual setup needed  
✅ **Git-Safe**: Settings not committed  
✅ **Consistent**: Same setup as template-based projects  

## See Also

- [RESPECT_USER_CHOICES.md](./RESPECT_USER_CHOICES.md) - How we respect stack choices
- [ANGULAR_CLI_INTEGRATION.md](./ANGULAR_CLI_INTEGRATION.md) - Angular CLI details
- [USAGE.md](./USAGE.md) - Usage examples
- [@colis/rig docs](../core/README.md) - Project Initialization details
