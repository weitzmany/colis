/**
 * Type definitions for template engine
 *
 * @packageDocumentation
 */
/**
 * Template context variables available to templates during processing.
 * These variables are substituted into template files using Handlebars syntax.
 *
 * @example
 * ```typescript
 * const context: TemplateContext = {
 *   projectName: 'my-app',
 *   appType: 'angular',
 *   packageManager: 'npm',
 *   port: 4200
 * };
 * ```
 */
export interface TemplateContext {
    /** Project name (required) */
    projectName: string;
    /** Optional project description */
    projectDescription?: string;
    /** Application type (e.g., 'angular', 'slim', 'full-stack') */
    appType: string;
    /** Port number allocated for the project (if Port Manager is used) */
    port?: number;
    /** Package manager to use ('npm', 'yarn', or 'pnpm') */
    packageManager: 'npm' | 'yarn' | 'pnpm';
    /** Author name (optional) */
    author?: string;
    /** License type (e.g., 'MIT', 'Apache-2.0') */
    license?: string;
    /** Project version (defaults to '1.0.0') */
    version?: string;
    /** Additional custom variables can be added */
    [key: string]: unknown;
}
/**
 * Metadata for a project template.
 * This information is read from template.json files in template directories.
 *
 * @example
 * ```json
 * {
 *   "name": "angular",
 *   "description": "Angular application template",
 *   "type": "frontend",
 *   "version": "1.0.0",
 *   "dependencies": {
 *     "@angular/core": "^17.0.0"
 *   }
 * }
 * ```
 */
export interface TemplateMetadata {
    /** Template name (e.g., 'angular', 'slim') */
    name: string;
    /** Template description */
    description: string;
    /** Template type category */
    type: 'full-stack' | 'frontend' | 'backend' | 'api' | 'angular' | 'vue' | 'slim' | 'zend';
    /** Template version */
    version: string;
    /** File system path to template directory */
    path: string;
    /** Runtime dependencies for generated projects */
    dependencies?: Record<string, string>;
    /** Development dependencies for generated projects */
    devDependencies?: Record<string, string>;
}
/**
 * Configuration for project generation.
 * Used by ConfigManager to collect user preferences and by createCommand
 * to control project generation behavior.
 *
 * @example
 * ```typescript
 * const config: ProjectConfig = {
 *   projectName: 'my-app',
 *   templateType: 'angular',
 *   packageManager: 'npm',
 *   skipDeps: false,
 *   skipGit: false
 * };
 * ```
 */
export interface ProjectConfig {
    /** Project name (required) */
    projectName: string;
    /** Optional project description */
    projectDescription?: string;
    /** Template type to use (e.g., 'angular', 'slim') - deprecated, use stackSelection */
    templateType?: string;
    /** Stack selection: frontend, backend, mobile options */
    stackSelection?: {
        frontend?: string | 'none';
        backend?: string | 'none';
        mobile?: string | 'none';
    };
    /** Package manager to use */
    packageManager: 'npm' | 'yarn' | 'pnpm';
    /** Author name (optional) */
    author?: string;
    /** License type (optional) */
    license?: string;
    /** Skip dependency installation after generation */
    skipDeps?: boolean;
    /** Skip git repository initialization */
    skipGit?: boolean;
    /** Skip Project Initialization (not recommended) */
    skipInit?: boolean;
    /** Skip Task Manager initialization */
    skipTaskManager?: boolean;
    /** Overwrite existing files (dangerous) */
    overwrite?: boolean;
    /** Skip existing files instead of overwriting (default: true) */
    skipExisting?: boolean;
    /** Show what would be created without making changes */
    dryRun?: boolean;
}
/**
 * Options for project generation.
 * Passed to FileGenerator.generateProject() to control file generation behavior.
 */
export interface GenerationOptions {
    /** Output directory path where project will be created */
    outputPath: string;
    /** Path to template directory */
    templatePath: string;
    /** Template context with variables for substitution */
    context: TemplateContext;
    /** Overwrite existing files */
    overwrite?: boolean;
    /** Skip existing files instead of overwriting */
    skipExisting?: boolean;
    /** Show what would be created without making changes */
    dryRun?: boolean;
}
/**
 * Result of project generation operation.
 * Contains information about files created, skipped, errors, and warnings.
 */
export interface GenerationResult {
    /** Whether generation completed successfully */
    success: boolean;
    /** List of file paths that were created */
    filesCreated: string[];
    /** List of file paths that were skipped (already existed) */
    filesSkipped: string[];
    /** List of error messages encountered during generation */
    errors: string[];
    /** List of warning messages encountered during generation */
    warnings: string[];
}
export interface DirectoryTree {
    [key: string]: DirectoryTree | string;
}
//# sourceMappingURL=types.d.ts.map