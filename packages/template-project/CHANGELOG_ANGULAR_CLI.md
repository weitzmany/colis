# Changelog: Angular CLI Integration

## Feature: Angular CLI Integration for Project Creation

**Date:** 2026-01-17  
**Version:** 1.1.0  
**Type:** Feature Enhancement

---

## Summary

Added support for creating Angular projects using the official Angular CLI (`ng new`) instead of template-based generation. This provides users with the choice between customized templates and standard Angular CLI project structure.

---

## Changes Made

### 1. Code Changes

#### `src/cli/commands/create.ts`

**Added:**
- New option `useNgCli?: boolean` to `CreateOptions` interface
- Angular CLI detection and execution logic in `createCommand` function
- Conditional branching: if `useNgCli` is true and template is Angular-related, use Angular CLI; otherwise use template generation

**Implementation Details:**
```typescript
// Check if using Angular CLI
const useNgCli = options.useNgCli || false;
const isAngularTemplate = templateType.toLowerCase().includes('angular');

if (useNgCli && isAngularTemplate) {
  // Build Angular CLI command
  const ngCommand = [
    'npx',
    '@angular/cli@latest',
    'new',
    config.projectName,
    `--package-manager=${packageManagerFlag}`,
    skipGitFlag,
    skipInstallFlag,
    '--directory=.',
  ].filter(Boolean).join(' ');

  // Create output directory and run Angular CLI
  await fs.ensureDir(outputPath);
  execSync(ngCommand, { cwd: outputPath, stdio: 'inherit' });
}
```

#### `bin/create-project`

**Added:**
- New CLI option: `--use-ng-cli` 
- Description: "Use Angular CLI (ng new) to generate Angular project"
- Passes `useNgCli` option to `createCommand`

### 2. Documentation Updates

#### `README.md`

**Added:**
- New command option: `--use-ng-cli`
- New section: "Using Angular CLI" with examples
- Comparison: When to use `--use-ng-cli` vs templates

#### `USAGE.md`

**Added:**
- Examples of using `--use-ng-cli` flag
- Examples with different options (package manager, skip flags)

#### `QUICK_TEST_CHECKLIST.md`

**Added:**
- New section: "Testing Angular CLI Integration"
- Test steps for Angular CLI projects
- Comparison testing between template and CLI approaches
- Red flags specific to Angular CLI integration
- Success criteria for Angular CLI integration

#### New Files Created

1. **`ANGULAR_CLI_INTEGRATION.md`**
   - Comprehensive guide to Angular CLI integration
   - Usage examples
   - Comparison with template-based approach
   - Behind-the-scenes explanation
   - Troubleshooting section
   - Best practices

2. **`CHANGELOG_ANGULAR_CLI.md`** (this file)
   - Summary of changes
   - Implementation details
   - Benefits and use cases

---

## Benefits

### For Users

1. **Choice of Project Structure**
   - Use standard Angular CLI structure for familiarity
   - Use customized templates for pre-configured setups

2. **Latest Angular Features**
   - Always get latest Angular CLI defaults
   - No waiting for template updates

3. **Community Standards**
   - Follows Angular community conventions
   - Easier to find help and resources

### For Maintainers

1. **Reduced Template Maintenance**
   - Don't need to update Angular templates for every Angular release
   - Angular CLI handles structure updates

2. **User Flexibility**
   - Users can choose what works best for their workflow
   - Both approaches are supported

---

## Use Cases

### Use `--use-ng-cli` When:

- ✅ You want the latest official Angular project structure
- ✅ You need Angular CLI-specific features
- ✅ You prefer Angular community standards
- ✅ You want automatic updates with Angular releases
- ✅ You're familiar with Angular CLI workflow

### Use Templates (Default) When:

- ✅ You want customized project structure
- ✅ You need pre-configured integrations
- ✅ You want consistency across different project types
- ✅ You need specific project setup/configuration

---

## Compatibility

### Works With:

- ✅ All package managers (npm, yarn, pnpm)
- ✅ Skip options (--skip-deps, --skip-git, --skip-init)
- ✅ Project Initialization (Cursor rules, Port Manager, IDE colors)
- ✅ Task Manager initialization
- ✅ Dry run mode

### Requirements:

- Node.js installed
- Internet connection (to download Angular CLI)
- Appropriate package manager installed (if not using npm)

---

## Examples

### Basic Usage

```bash
create-project create my-app --use-ng-cli
```

### With Options

```bash
# Use pnpm
create-project create my-app --use-ng-cli --package-manager pnpm

# Skip deps
create-project create my-app --use-ng-cli --skip-deps

# Dry run
create-project create my-app --use-ng-cli --dry-run
```

### Comparison

```bash
# Template-based (default)
create-project create my-template-app

# Angular CLI-based
create-project create my-cli-app --use-ng-cli
```

---

## Testing

### Manual Testing Checklist

1. **Basic Creation**
   ```bash
   create-project create test-ng-cli --use-ng-cli
   cd test-ng-cli
   npm start
   ```

2. **With Different Package Managers**
   ```bash
   create-project create test-pnpm --use-ng-cli --package-manager pnpm
   create-project create test-yarn --use-ng-cli --package-manager yarn
   ```

3. **With Skip Options**
   ```bash
   create-project create test-skip-deps --use-ng-cli --skip-deps
   create-project create test-skip-git --use-ng-cli --skip-git
   ```

4. **Dry Run**
   ```bash
   create-project create test-dry --use-ng-cli --dry-run
   ```

### Expected Results

- ✅ Standard Angular CLI project structure
- ✅ Project Initialization still runs (unless --skip-init)
- ✅ Port Manager allocates port
- ✅ Dependencies installed (unless --skip-deps)
- ✅ Git initialized (unless --skip-git)
- ✅ Project builds and runs successfully

---

## Future Enhancements

Potential improvements for future versions:

1. **Interactive Mode**
   - Prompt user to choose between template and Angular CLI
   - Show pros/cons of each approach

2. **Angular Version Selection**
   - Allow specifying Angular version: `--ng-version 17`

3. **Additional CLI Options**
   - Pass through more Angular CLI flags
   - Example: `--routing`, `--style scss`

4. **Template Merging**
   - Apply custom templates on top of Angular CLI output
   - Best of both worlds

5. **Other Framework CLIs**
   - React: Create React App or Vite
   - Vue: Vue CLI
   - Next.js: create-next-app

---

## Migration Guide

### For Existing Users

No migration needed! This is an **additive feature**.

- Existing template-based workflow continues to work
- New `--use-ng-cli` option is opt-in
- All other features remain unchanged

### For New Users

Choose your approach:

```bash
# Option 1: Template-based (default, customized)
create-project create my-app

# Option 2: Angular CLI-based (standard)
create-project create my-app --use-ng-cli
```

---

## Known Limitations

1. **Angular CLI Only**
   - Currently only works with Angular templates
   - Other templates (React, Vue) not affected

2. **Internet Required**
   - Needs to download Angular CLI via npx
   - Template-based approach works offline

3. **Template Customizations Lost**
   - Angular CLI generates standard structure
   - Custom template configurations not applied
   - Project Initialization still adds Cursor setup

---

## Breaking Changes

**None.** This is a backward-compatible feature addition.

---

## Acknowledgments

This feature was implemented to provide users with flexibility in project creation while maintaining the benefits of Project Initialization (Cursor rules, Port Manager, IDE colors).

---

## Related Documentation

- [ANGULAR_CLI_INTEGRATION.md](./ANGULAR_CLI_INTEGRATION.md) - Comprehensive guide
- [README.md](./README.md) - Main documentation
- [USAGE.md](./USAGE.md) - Usage examples
- [QUICK_TEST_CHECKLIST.md](./QUICK_TEST_CHECKLIST.md) - Testing guide

---

## Support

For issues or questions:

1. Check the [ANGULAR_CLI_INTEGRATION.md](./ANGULAR_CLI_INTEGRATION.md) guide
2. Review [Troubleshooting](#troubleshooting) section
3. Create an issue in the repository

---

## License

MIT
