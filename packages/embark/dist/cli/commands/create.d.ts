/**
 * Create Command
 *
 * CLI command for creating new projects from templates.
 *
 * This command orchestrates the entire project creation workflow:
 * 1. Collects user configuration (interactive or via options)
 * 2. Selects and loads the appropriate template
 * 3. Allocates a port via Port Manager (if available)
 * 4. Generates project structure from template
 * 5. Links @colis/rig for Project Initialization
 * 6. Runs Project Initialization (rules, commands, Port Manager, colors)
 * 7. Installs dependencies (if not skipped)
 * 8. Initializes Task Manager (if not skipped)
 * 9. Initializes git repository (if not skipped)
 * 10. Opens project in Cursor IDE
 *
 * @module
 */
/**
 * Options for the create command.
 * These options can be provided via CLI flags or programmatically.
 *
 * @example
 * ```typescript
 * await createCommand({
 *   projectName: 'my-app',
 *   template: 'angular',
 *   packageManager: 'npm',
 *   skipDeps: false
 * });
 * ```
 */
export interface CreateOptions {
    /** Project name (will prompt if not provided) */
    projectName?: string;
    /** Template type (default: 'angular') */
    template?: string;
    /** Package manager (default: 'npm') */
    packageManager?: 'npm' | 'yarn' | 'pnpm';
    /** Skip dependency installation */
    skipDeps?: boolean;
    /** DEPRECATED: Use skipGithub instead. Skip git repository initialization */
    skipGit?: boolean;
    /** Skip GitHub repository creation */
    skipGithub?: boolean;
    /** GitHub repository visibility (public or private, default: private) */
    githubVisibility?: 'public' | 'private';
    /** Skip Project Initialization (not recommended) */
    skipInit?: boolean;
    /** Skip Task Manager initialization */
    skipTaskManager?: boolean;
    /** Overwrite existing files */
    overwrite?: boolean;
    /** Skip existing files instead of overwriting */
    skipExisting?: boolean;
    /** Show what would be created without making changes */
    dryRun?: boolean;
    /** Project description */
    description?: string;
    /** Author name */
    author?: string;
    /** License type (e.g., 'MIT', 'Apache-2.0') */
    license?: string;
    /** Use Angular CLI to generate project (default: true for Angular, false otherwise). Set to false to use templates instead. */
    useNgCli?: boolean;
}
/**
 * Create a new project from a template.
 *
 * This is the main entry point for project creation. It handles the complete
 * workflow from configuration collection to project generation and initialization.
 *
 * @param options - Configuration options for project creation
 * @throws {Error} If project creation fails (template not found, file system errors, etc.)
 *
 * @example
 * ```typescript
 * // Basic usage
 * await createCommand({ projectName: 'my-app' });
 *
 * // With options
 * await createCommand({
 *   projectName: 'my-app',
 *   template: 'angular',
 *   packageManager: 'pnpm',
 *   skipDeps: true
 * });
 * ```
 */
export declare function createCommand(options?: CreateOptions): Promise<void>;
//# sourceMappingURL=create.d.ts.map