/**
 * Angular CLI Integration
 *
 * Handles project creation using the official Angular CLI.
 */
import { FrameworkCli, FrameworkCliOptions, FrameworkCliResult, FrameworkVersions } from './types.js';
/**
 * Angular CLI implementation
 */
export declare class AngularCli implements FrameworkCli {
    name: string;
    displayName: string;
    /**
     * Check if Angular CLI should be used for this template
     */
    shouldUse(templateType: string): boolean;
    /**
     * Fetch latest Angular version and ecosystem versions
     */
    fetchVersions(): Promise<FrameworkVersions | undefined>;
    /**
     * Create a project using Angular CLI
     */
    create(options: FrameworkCliOptions): Promise<FrameworkCliResult>;
    /**
     * Update Angular configuration files with custom settings
     */
    updateConfig(outputPath: string, config: {
        port?: number;
        additionalSettings?: Record<string, any>;
    }): Promise<void>;
}
//# sourceMappingURL=angular-cli.d.ts.map