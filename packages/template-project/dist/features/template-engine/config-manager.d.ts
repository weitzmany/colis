/**
 * Configuration Manager
 *
 * Collects user configuration via interactive CLI prompts.
 * Handles both interactive prompts and pre-filled options.
 *
 * @example
 * ```typescript
 * const manager = new ConfigManager();
 * const config = await manager.collectConfig({
 *   projectName: 'my-app',
 *   templateType: 'angular'
 * });
 * ```
 */
import { ProjectConfig } from './types.js';
/**
 * Manages collection of project configuration from users.
 *
 * Uses Inquirer.js to provide interactive prompts for missing configuration
 * values, while respecting pre-filled options.
 */
export declare class ConfigManager {
    /**
     * Collect configuration from user via interactive prompts.
     *
     * Prompts for any missing required or optional fields. If options are
     * already provided, those values are used instead of prompting.
     *
     * @param options - Partial configuration object with pre-filled values
     * @returns Complete ProjectConfig object with all required fields
     *
     * @example
     * ```typescript
     * // Fully interactive
     * const config = await manager.collectConfig();
     *
     * // Pre-fill some values
     * const config = await manager.collectConfig({
     *   projectName: 'my-app',
     *   packageManager: 'npm'
     * });
     * ```
     */
    collectConfig(options?: Partial<ProjectConfig>): Promise<ProjectConfig>;
    /**
     * Prompt for template type
     */
    promptForTemplateType(): Promise<string>;
    /**
     * Prompt for package manager
     */
    promptForPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'>;
    /**
     * Validate configuration
     */
    validateConfig(config: Partial<ProjectConfig>): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=config-manager.d.ts.map