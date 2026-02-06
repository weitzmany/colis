/**
 * @your-org/template-project
 *
 * Project template package for scaffolding new projects with standard structure,
 * configuration files, and best practices.
 *
 * ## Features
 *
 * - **Template Engine**: Process Handlebars templates with variable substitution
 * - **Template Registry**: Discover and manage available project templates
 * - **Configuration Manager**: Interactive CLI prompts for user configuration
 * - **File Generator**: Generate project structure from templates
 * - **CLI Interface**: Command-line interface for creating projects
 *
 * ## Usage
 *
 * ```typescript
 * import { createCommand } from '@your-org/template-project';
 *
 * await createCommand({
 *   projectName: 'my-project',
 *   template: 'angular',
 *   packageManager: 'npm'
 * });
 * ```
 *
 * ## CLI Usage
 *
 * ```bash
 * create-project create my-project --template angular
 * ```
 *
 * @packageDocumentation
 */
export * from './features/template-engine';
export * from './cli/commands/create';
//# sourceMappingURL=index.d.ts.map