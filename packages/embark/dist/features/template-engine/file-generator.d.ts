/**
 * File Generator
 *
 * Generates project structure from templates.
 * Handles file creation, directory structure, and template processing.
 *
 * @example
 * ```typescript
 * const generator = new FileGenerator();
 * const result = await generator.generateProject({
 *   outputPath: './my-project',
 *   templatePath: './templates/angular',
 *   context: { projectName: 'my-app', packageManager: 'npm' }
 * });
 * ```
 */
import { GenerationOptions, GenerationResult } from './types.js';
/**
 * Generates project files and directory structure from templates.
 *
 * Processes Handlebars templates, substitutes variables, and creates
 * the complete project structure in the output directory.
 */
export declare class FileGenerator {
    /** Template processor for handling Handlebars templates */
    private processor;
    /**
     * Create a new FileGenerator instance.
     */
    constructor();
    /**
     * Generate a complete project from a template.
     *
     * Processes all template files recursively, substitutes variables using
     * the provided context, and creates the project structure in the output path.
     *
     * @param options - Generation options including paths, context, and behavior flags
     * @returns Generation result with created files, errors, and warnings
     *
     * @example
     * ```typescript
     * const result = await generator.generateProject({
     *   outputPath: './my-project',
     *   templatePath: './templates/angular',
     *   context: {
     *     projectName: 'my-app',
     *     packageManager: 'npm',
     *     port: 4200
     *   },
     *   overwrite: false,
     *   skipExisting: true
     * });
     *
     * if (result.success) {
     *   console.log(`Created ${result.filesCreated.length} files`);
     * }
     * ```
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