# @your-org/template-project

Project template package for scaffolding new projects with standard structure, configuration files, and best practices.

## Installation

```bash
npm install -g @your-org/template-project
```

Or use with npx (no installation required):

```bash
npx @your-org/template-project create my-project
```

## Usage

### Basic Usage

Create a new project with interactive prompts (defaults to Angular):

```bash
npx @your-org/template-project create my-project
```

### With Options

```bash
npx @your-org/template-project create my-project \
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

## What Gets Set Up Automatically

When you create a new project, the following are automatically initialized:

1. **Project Structure** - Complete template structure with all necessary files
2. **Project Initialization** - Cursor rules, commands, Port Manager, and IDE colors
3. **Task Manager** - Task management system initialized (can be skipped with `--skip-task-manager`)
4. **Dependencies** - Package dependencies installed (can be skipped with `--skip-deps`)
5. **Git Repository** - Git initialized (can be skipped with `--skip-git`)
6. **IDE Opening** - Project automatically opens in Cursor IDE

## Available Templates

### Angular Template (Default)

Angular frontend application with TypeScript:

```bash
npx @your-org/template-project create my-app --template angular
```

**Includes:**
- Angular 17+ with TypeScript
- Standalone components
- Angular Router
- Karma/Jasmine testing setup
- Modern build configuration

### Slim Template

Slim PHP framework backend application:

```bash
npx @your-org/template-project create my-api --template slim
```

**Includes:**
- Slim Framework 4.x
- PHP-DI container
- Monolog logging
- PHPUnit testing
- PHPStan static analysis
- PSR-12 code style

### Full-Stack Template

Full-stack application with Next.js frontend and Express backend:

```bash
npx @your-org/template-project create my-app --template full-stack
```

**Includes:**
- Next.js 14 with TypeScript
- Express API server
- CORS configuration
- Environment variable setup

### Frontend Template

Frontend-only application with React/Next.js:

```bash
npx @your-org/template-project create my-app --template frontend
```

**Includes:**
- Next.js 14 with TypeScript
- React 18
- ESLint configuration

### Backend Template

Backend-only application with Express/Node.js:

```bash
npx @your-org/template-project create my-api --template backend
```

**Includes:**
- Express with TypeScript
- CORS configuration
- Environment variable setup
- Nodemon for development

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

## License

MIT
