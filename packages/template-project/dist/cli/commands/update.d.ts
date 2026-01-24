/**
 * Update Command
 *
 * CLI command for updating existing projects with latest rules, commands, and configurations
 * from the core package. Uses hash-based synchronization to intelligently update only
 * what has changed.
 *
 * This command performs the same workflow as if you ran project-init update, but is
 * accessible via the create-project CLI.
 */
/**
 * Update Command Interface
 */
export interface UpdateCommandOptions {
    overwrite?: boolean;
    deleteOrphaned?: boolean;
    skipRules?: boolean;
    skipCommands?: boolean;
    checkOnly?: boolean;
}
/**
 * Execute the update command
 *
 * This command synchronizes the current project with the latest core package,
 * using hash-based comparison to intelligently update only what has changed.
 *
 * @param options - Update options
 */
export declare function updateCommand(options?: UpdateCommandOptions): Promise<void>;
//# sourceMappingURL=update.d.ts.map