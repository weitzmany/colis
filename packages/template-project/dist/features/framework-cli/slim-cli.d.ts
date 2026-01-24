/**
 * Slim Framework Integration
 *
 * Creates Slim Framework projects using composer create-project.
 * This allows future fixes in composer to affect us automatically.
 */
import { FrameworkCli, FrameworkCliOptions, FrameworkCliResult } from './types.js';
/**
 * Slim Framework implementation using composer create-project
 *
 * @example
 * composer create-project slim/slim-skeleton my-app
 */
export declare class SlimCli implements FrameworkCli {
    name: string;
    displayName: string;
    /**
     * Check if Slim CLI should be used for this template
     */
    shouldUse(templateType: string): boolean;
    /**
     * Create a Slim Framework project using composer create-project
     */
    create(options: FrameworkCliOptions): Promise<FrameworkCliResult>;
    /**
     * Update Slim configuration files with custom settings
     */
    updateConfig(outputPath: string, config: {
        port?: number;
        additionalSettings?: Record<string, any>;
    }): Promise<void>;
}
//# sourceMappingURL=slim-cli.d.ts.map