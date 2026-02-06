# @colis/embark

Project template package for scaffolding new projects with standard structure, configuration files, and best practices (formerly: template-project).

## Installation

```bash
npm install -g @colis/embark
```

Or use with npx (no installation required):

```bash
npx @colis/embark create my-project
```

## Usage

### Basic Usage

Create a new project with interactive prompts (defaults to Angular):

```bash
npx @colis/embark create my-project
```

### With Options

```bash
npx @colis/embark create my-project \
  --template angular \
  --package-manager pnpm \
  --skip-deps \
  --skip-git
```

### Command Options

- `--template <type>`: Template type (angular, slim, full-stack, frontend, backend, api). Default: angular
- `--package-manager <manager>`: Package manager (npm, yarn, pnpm). Default: npm
- `--skip-deps`: Skip dependency installation
- `--skip-git`: Skip git initialization
- `--skip-init`: Skip Project Initialization (not recommended)
- `--skip-task-manager`: Skip Task Manager initialization
- `--overwrite`: Overwrite existing files
- `--skip-existing`: Skip existing files (default)
- `--dry-run`: Show what would be created without making changes
- `--description <text>`: Project description
- `--author <name>`: Author name
- `--license <type>`: License type (MIT, Apache-2.0, etc.)
- `--use-ng-cli`: Use Angular CLI (ng new) to generate Angular project (default for Angular templates)
- `--no-use-ng-cli`: Use templates instead of Angular CLI for Angular projects

### Using Angular CLI

**Angular projects now use Angular CLI by default!**

When you create an Angular project, it will automatically use the Angular CLI (`ng new`) to generate the project:

```bash
# Uses Angular CLI by default for Angular templates
npx @colis/embark create my-angular-app

# Or explicitly specify
npx @colis/embark create my-angular-app --use-ng-cli
```

If you prefer to use the customized templates instead of Angular CLI, you can opt out:

```bash
# Use templates instead of Angular CLI
npx @colis/embark create my-angular-app --no-use-ng-cli
```

This will:
- Use Angular CLI (`ng new`) to generate a standard Angular project structure
- **Always skip git initialization** (`--skip-git`) to maintain monorepo structure at root
- **Automatically remove any nested `.git` directories** after project creation
- Respect your package manager choice (`--package-manager`)
- Skip dependency installation if `--skip-deps` is specified
- Still run Project Initialization to set up Cursor rules, commands, and Port Manager

**When Angular CLI is used (default):**
- ✅ Latest official Angular project structure
- ✅ Angular CLI-specific features
- ✅ Always up-to-date with Angular releases

**When templates are used (`--no-use-ng-cli`):**
- ✅ Customized project structure
- ✅ Pre-configured integrations
- ✅ Consistency across different project types

## What Gets Set Up Automatically

When you create a new project, the following are automatically initialized:

1. **Project Structure** - Complete template structure with all necessary files
2. **CI/CD Configuration** - GitHub Actions and GitLab CI workflows for automated testing and building
3. **Project Initialization** - Cursor rules, commands, Port Manager, and IDE colors
4. **Task Manager** - Task management system initialized (can be skipped with `--skip-task-manager`)
5. **Dependencies** - Package dependencies installed (can be skipped with `--skip-deps`)
6. **Git Repository** - Git initialized (can be skipped with `--skip-git`)
7. **IDE Opening** - Project automatically opens in Cursor IDE

## Available Templates

### Angular Template (Default)

Angular frontend application with TypeScript:

```bash
npx @colis/embark create my-app --template angular
```

**Includes:**
- Angular 17+ with TypeScript
- Standalone components
- Angular Router
- Karma/Jasmine testing setup
- Modern build configuration
- GitHub Actions CI workflow
- GitLab CI configuration

### Slim Template

Slim PHP framework backend application:

```bash
npx @colis/embark create my-api --template slim
```

**Includes:**
- Slim Framework 4.x
- PHP-DI container
- Monolog logging
- PHPUnit testing
- PHPStan static analysis
- PSR-12 code style
- GitHub Actions CI workflow (PHP 8.2)
- GitLab CI configuration

### Full-Stack Template

Full-stack application with Next.js frontend and Express backend:

```bash
npx @colis/embark create my-app --template full-stack
```

**Includes:**
- Next.js 14 with TypeScript
- Express API server
- CORS configuration
- Environment variable setup
- GitHub Actions CI workflow (frontend + backend)
- GitLab CI configuration

### Frontend Template

Frontend-only application with React/Next.js:

```bash
npx @colis/embark create my-app --template frontend
```

**Includes:**
- Next.js 14 with TypeScript
- React 18
- ESLint configuration
- GitHub Actions CI workflow
- GitLab CI configuration

### Backend Template

Backend-only application with Express/Node.js:

```bash
npx @colis/embark create my-api --template backend
```

**Includes:**
- Express with TypeScript
- CORS configuration
- Environment variable setup
- Nodemon for development
- GitHub Actions CI workflow
- GitLab CI configuration

## PRD Templates

This package includes Product Requirements Document (PRD) templates to help you plan your projects before implementation.

### Available Templates

Located in `templates/`:

1. **Full PRD Template** (`PRD_TEMPLATE.md`)
   - Comprehensive planning document
   - Includes MVP definition, roadmap, risks, approval sign-offs
   - Best for complex projects with multiple stakeholders

2. **Quick Start PRD** (`PRD_QUICK_START.md`)
   - Streamlined planning document
   - Focus on core MVP features
   - Best for rapid planning and iteration

### Usage

```bash
# Copy template to your project
cp packages/template-project/templates/PRD_TEMPLATE.md ./my-project-prd.md

# Use with Task Master AI (if available)
npx taskmaster-ai parse-prd my-project-prd.md
```

See [templates/README.md](templates/README.md) for detailed usage instructions.

## Integration with Project Initialization

This package automatically integrates with `@your-org/core` Project Initialization feature. After generating the project structure, it will:

1. Copy Cursor rules and commands
2. Initialize Port Manager
3. Configure IDE colors
4. Set up project defaults

You can skip this step with `--skip-init`, but it's not recommended.

## Project Structure

Generated projects follow standard best practices:

- TypeScript configuration
- ESLint setup
- Git ignore files
- README with getting started instructions
- Proper directory structure

## API Documentation

### Programmatic Usage

You can use the template engine programmatically in your own code:

```typescript
import { createCommand } from '@colis/embark';
import { TemplateRegistry, FileGenerator, ConfigManager } from '@colis/embark/features/template-engine';

// Using the high-level create command
await createCommand({
  projectName: 'my-app',
  template: 'angular',
  packageManager: 'npm'
});

// Using individual components
const registry = new TemplateRegistry();
const templates = await registry.discoverTemplates();
const template = await registry.getTemplate('angular');

const generator = new FileGenerator();
const result = await generator.generateProject({
  outputPath: './my-project',
  templatePath: template.path,
  context: {
    projectName: 'my-app',
    packageManager: 'npm',
    port: 4200
  }
});
```

### Type Definitions

All types are exported from the package:

```typescript
import type {
  TemplateContext,
  TemplateMetadata,
  ProjectConfig,
  GenerationOptions,
  GenerationResult
} from '@colis/embark/features/template-engine';
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Code Documentation

This package uses TypeScript with JSDoc comments for API documentation.
Generate documentation using TypeDoc:

```bash
npx typedoc src/index.ts
```

## Architecture

The template-project package follows a modular architecture:

- **Template Engine** (`src/features/template-engine/`): Core template processing
  - `TemplateProcessor`: Handlebars template processing
  - `TemplateRegistry`: Template discovery and metadata management
  - `ConfigManager`: Interactive configuration collection
  - `FileGenerator`: Project structure generation
- **CLI** (`src/cli/commands/`): Command-line interface
  - `create.ts`: Main create command implementation
- **Templates** (`src/templates/`): Template files organized by type

## Contributing

When adding new templates:

1. Create a new directory in `src/templates/<template-name>/`
2. Add a `template.json` file with metadata
3. Create template files with `.hbs` extension
4. Use Handlebars syntax for variable substitution: `{{projectName}}`
5. Test the template by creating a project

## License

MIT
