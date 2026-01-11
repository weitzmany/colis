/**
 * File Generator
 *
 * Generates project structure from templates
 */
import { GenerationOptions, GenerationResult } from './types';
export declare class FileGenerator {
    private processor;
    constructor();
    /**
     * Generate project from template
     */
    generateProject(options: GenerationOptions): Promise<GenerationResult>;
    /**
     * Process template files recursively
     */
    private processTemplateFiles;
    /**
     * Process a single file
     */
    private processFile;
    /**
     * Process template path (handle variable substitution in paths)
     */
    private processTemplatePath;
    /**
     * Collect files that would be created (for dry-run)
     */
    private collectFilesToCreate;
    /**
     * Create directory structure
     */
    createDirectoryStructure(structure: Record<string, unknown>): Promise<void>;
}
//# sourceMappingURL=file-generator.d.ts.map