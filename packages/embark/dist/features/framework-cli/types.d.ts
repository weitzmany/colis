/**
 * Framework CLI Types
 *
 * Common types and interfaces for framework CLI integrations.
 */
/**
 * Options for creating a project with a framework CLI
 */
export interface FrameworkCliOptions {
    /** Project name */
    projectName: string;
    /** Project description */
    projectDescription?: string;
    /** Output directory path */
    outputPath: string;
    /** Package manager (npm, yarn, pnpm) */
    packageManager: string;
    /** Skip git initialization */
    skipGit?: boolean;
    /** Skip dependency installation */
    skipDeps?: boolean;
    /** Dry run mode */
    dryRun?: boolean;
    /** Custom options specific to the framework */
    customOptions?: Record<string, any>;
}
/**
 * Result from creating a project with a framework CLI
 */
export interface FrameworkCliResult {
    /** Whether the creation was successful */
    success: boolean;
    /** Output path where project was created */
    outputPath: string;
    /** Framework name */
    framework: string;
    /** Whether dependencies were installed */
    depsInstalled: boolean;
    /** Error message if creation failed */
    error?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
}
/**
 * Version information for a framework and its ecosystem
 */
export interface FrameworkVersions {
    /** Framework name */
    framework: string;
    /** Framework version */
    version: string;
    /** Related package versions */
    ecosystem?: Record<string, string>;
}
/**
 * Interface for framework CLI implementations
 */
export interface FrameworkCli {
    /** Framework name (e.g., 'angular', 'react', 'vue') */
    name: string;
    /** Framework display name (e.g., 'Angular', 'React', 'Vue') */
    displayName: string;
    /**
     * Check if this CLI should be used for the given template type
     */
    shouldUse(templateType: string): boolean;
    /**
     * Fetch the latest version information for this framework
     */
    fetchVersions?(): Promise<FrameworkVersions | undefined>;
    /**
     * Create a project using this framework's CLI
     */
    create(options: FrameworkCliOptions): Promise<FrameworkCliResult>;
}
//# sourceMappingURL=types.d.ts.map