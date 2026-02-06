# Angular CLI Integration

The `template-project` package uses the official Angular CLI by default for creating Angular projects.

## Overview

**Angular projects now use Angular CLI by default!**

When you create an Angular project, it will automatically use Angular CLI (`ng new`) unless you opt out:

1. ✅ Use Angular CLI to generate the project structure (default)
2. ✅ Respect your package manager choice (npm, yarn, pnpm)
3. ✅ Skip git initialization if `--skip-git` is specified
4. ✅ Skip dependency installation if `--skip-deps` is specified
5. ✅ Still run Project Initialization to add:
   - Cursor rules and commands
   - Port Manager integration
   - IDE color configuration
   - Task Manager (if not skipped)

## Usage

### Basic Usage (Angular CLI - Default)

```bash
# Uses Angular CLI automatically
create-project create my-angular-app
```

### Opt Out of Angular CLI

```bash
# Use templates instead of Angular CLI
create-project create my-angular-app --no-use-ng-cli
```

### Explicit Angular CLI (Same as Default)

```bash
# Explicitly specify Angular CLI
create-project create my-angular-app --use-ng-cli
```

### With Package Manager

```bash
# Use pnpm as package manager
create-project create my-angular-app --use-ng-cli --package-manager pnpm

# Use yarn as package manager
create-project create my-angular-app --use-ng-cli --package-manager yarn
```

### Skip Options

```bash
# Skip dependency installation
create-project create my-angular-app --use-ng-cli --skip-deps

# Skip git initialization
create-project create my-angular-app --use-ng-cli --skip-git

# Skip both
create-project create my-angular-app --use-ng-cli --skip-deps --skip-git
```

### Skip Project Initialization

```bash
# Only use Angular CLI, skip Project Initialization
create-project create my-angular-app --use-ng-cli --skip-init
```

## Comparison: Angular CLI vs Templates

### Using Angular CLI (Default)

```bash
create-project create my-app
```

**Pros:**
- ✅ Latest official Angular project structure (default)
- ✅ Angular CLI-specific features
- ✅ Always up-to-date with Angular releases
- ✅ Standard Angular community structure

**Cons:**
- Less customization
- No pre-configured integrations (unless via Project Initialization)

### Using Templates

```bash
create-project create my-app --no-use-ng-cli
```

**Pros:**
- ✅ Customized project structure
- ✅ Pre-configured integrations
- ✅ Consistent across project types
- ✅ Optimized for your workflow

**Cons:**
- May not include latest Angular CLI features
- Requires template updates for new Angular versions

## What Happens Behind the Scenes

When you use `--use-ng-cli`:

1. **Creates output directory**
   ```bash
   mkdir my-angular-app
   ```

2. **Runs Angular CLI**
   ```bash
   npx @angular/cli@latest new my-angular-app \
     --package-manager=pnpm \
     --directory=. \
     --skip-git \
     --skip-install
   ```

3. **Runs Project Initialization** (unless `--skip-init`)
   - Copies Cursor rules
   - Sets up commands
   - Configures Port Manager
   - Applies IDE colors

4. **Installs Dependencies** (unless `--skip-deps`)
   ```bash
   pnpm install
   ```

5. **Initializes Git** (unless `--skip-git`)
   ```bash
   git init
   ```

6. **Opens in Cursor IDE**
   ```bash
   cursor my-angular-app
   ```

## Dry Run Mode

Test what will be created without actually creating anything:

```bash
create-project create my-app --use-ng-cli --dry-run
```

Output:
```
🔍 Dry run - Would run Angular CLI:
  ng new my-app --package-manager=npm --skip-git
```

## Troubleshooting

### Angular CLI Not Found

If you get an error about Angular CLI not being found:

```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Or use npx (recommended)
npx @angular/cli@latest new my-app
```

### Permission Errors

If you get permission errors:

```bash
# On macOS/Linux, ensure you have write permissions
sudo chown -R $USER:$USER /path/to/directory

# Or create in a different directory
cd ~/projects
create-project create my-app --use-ng-cli
```

### Package Manager Issues

If the package manager doesn't work:

```bash
# Ensure the package manager is installed
npm install -g pnpm  # For pnpm
npm install -g yarn  # For yarn
```

## Examples

### Example 1: Basic Angular CLI Project

```bash
create-project create my-blog --use-ng-cli
```

Creates:
- Angular project with Angular CLI
- Cursor rules and commands
- Port Manager integration
- Git repository
- Opens in Cursor IDE

### Example 2: Angular CLI with PNPM

```bash
create-project create my-store \
  --use-ng-cli \
  --package-manager pnpm \
  --description "E-commerce store"
```

Creates:
- Angular project with pnpm
- Project description added
- All standard integrations

### Example 3: Quick Setup for Development

```bash
create-project create my-prototype \
  --use-ng-cli \
  --skip-deps \
  --skip-task-manager
```

Creates:
- Angular project (no dependencies installed yet)
- Project Initialization
- No Task Manager
- Ready for rapid development

## Best Practices

1. **Use `--use-ng-cli` for:**
   - Standard Angular projects
   - When you want latest Angular CLI features
   - When following Angular community conventions

2. **Use templates (default) for:**
   - Customized project structures
   - Pre-configured integrations
   - Consistency across multiple projects

3. **Always run Project Initialization:**
   - Don't skip `--skip-init` unless you have a specific reason
   - Cursor rules and commands improve development experience
   - Port Manager prevents port conflicts

4. **Choose the right package manager:**
   - `npm`: Default, most compatible
   - `yarn`: Fast, deterministic
   - `pnpm`: Efficient disk usage

## Implementation Details

The Angular CLI integration is implemented in:

- **Interface**: `CreateOptions` in `src/cli/commands/create.ts`
  - Added `useNgCli?: boolean` option

- **Logic**: `createCommand` function in `src/cli/commands/create.ts`
  - Detects `useNgCli` flag
  - Checks if template is Angular
  - Runs Angular CLI instead of template generation

- **CLI**: `bin/create-project`
  - Added `--use-ng-cli` option
  - Passes to `createCommand`

## Future Enhancements

Potential improvements:

1. **Interactive Mode**: Prompt user to choose between template and Angular CLI
2. **Angular Version Selection**: Allow specifying Angular version
3. **Additional Angular CLI Options**: Pass through more Angular CLI flags
4. **Template Merging**: Apply templates on top of Angular CLI output
5. **Other CLIs**: Support for React CLI, Vue CLI, etc.

## Testing

To test the Angular CLI integration:

1. **Build the package:**
   ```bash
   cd packages/template-project
   npm run build
   ```

2. **Link globally:**
   ```bash
   npm link
   ```

3. **Create a test project:**
   ```bash
   cd /tmp
   create-project create test-ng-cli --use-ng-cli --dry-run
   ```

4. **Verify output:**
   - Check that Angular CLI command is shown
   - Verify flags are correct

5. **Create actual project:**
   ```bash
   create-project create test-ng-cli --use-ng-cli
   ```

6. **Verify result:**
   - Check Angular project structure
   - Verify Cursor rules are present
   - Verify Port Manager configuration
   - Test that the app runs

## Contributing

If you want to improve the Angular CLI integration:

1. **Fork the repository**
2. **Make your changes** in `src/cli/commands/create.ts`
3. **Test thoroughly** with different options
4. **Update documentation** if needed
5. **Submit a pull request**

## License

MIT
