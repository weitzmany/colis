/**
 * Refit Command
 *
 * CLI command for refitting existing projects with latest rules, commands, and configurations
 * from the rig package. Uses hash-based synchronization to intelligently refit only
 * what has changed.
 *
 * This command performs the same workflow as if you ran rig refit, but is
 * accessible via the embark CLI.
 * (Formerly: update command)
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
export declare function refitCommand(options?: UpdateCommandOptions): Promise<void>;
//# sourceMappingURL=refit.d.ts.map