/**
 * Configuration Manager
 *
 * Collects user configuration via interactive prompts
 */
import { ProjectConfig } from './types.js';
export declare class ConfigManager {
    /**
     * Collect configuration from user
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