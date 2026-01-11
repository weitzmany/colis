/**
 * Create Command
 *
 * CLI command for creating new projects from templates
 */
export interface CreateOptions {
    projectName?: string;
    template?: string;
    packageManager?: 'npm' | 'yarn' | 'pnpm';
    skipDeps?: boolean;
    skipGit?: boolean;
    skipInit?: boolean;
    overwrite?: boolean;
    skipExisting?: boolean;
    dryRun?: boolean;
    description?: string;
    author?: string;
    license?: string;
}
export declare function createCommand(options?: CreateOptions): Promise<void>;
//# sourceMappingURL=create.d.ts.map