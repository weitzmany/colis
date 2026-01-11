/**
 * Type definitions for template engine
 */
export interface TemplateContext {
    projectName: string;
    projectDescription?: string;
    appType: string;
    port?: number;
    packageManager: 'npm' | 'yarn' | 'pnpm';
    author?: string;
    license?: string;
    version?: string;
    [key: string]: unknown;
}
export interface TemplateMetadata {
    name: string;
    description: string;
    type: 'full-stack' | 'frontend' | 'backend' | 'api' | 'angular' | 'slim';
    version: string;
    path: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}
export interface ProjectConfig {
    projectName: string;
    projectDescription?: string;
    templateType: string;
    packageManager: 'npm' | 'yarn' | 'pnpm';
    author?: string;
    license?: string;
    skipDeps?: boolean;
    skipGit?: boolean;
    skipInit?: boolean;
    skipTaskManager?: boolean;
    overwrite?: boolean;
    skipExisting?: boolean;
    dryRun?: boolean;
}
export interface GenerationOptions {
    outputPath: string;
    templatePath: string;
    context: TemplateContext;
    overwrite?: boolean;
    skipExisting?: boolean;
    dryRun?: boolean;
}
export interface GenerationResult {
    success: boolean;
    filesCreated: string[];
    filesSkipped: string[];
    errors: string[];
    warnings: string[];
}
export interface DirectoryTree {
    [key: string]: DirectoryTree | string;
}
//# sourceMappingURL=types.d.ts.map