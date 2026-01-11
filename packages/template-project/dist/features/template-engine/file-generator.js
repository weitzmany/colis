/**
 * File Generator
 *
 * Generates project structure from templates
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { TemplateProcessor } from './template-processor';
export class FileGenerator {
    processor;
    constructor() {
        this.processor = new TemplateProcessor();
    }
    /**
     * Generate project from template
     */
    async generateProject(options) {
        const result = {
            success: true,
            filesCreated: [],
            filesSkipped: [],
            errors: [],
            warnings: [],
        };
        try {
            if (options.dryRun) {
                // In dry-run mode, just collect what would be created
                await this.collectFilesToCreate(options, result);
                return result;
            }
            // Process template files
            await this.processTemplateFiles(options.templatePath, options.outputPath, options.context, options, result);
        }
        catch (error) {
            result.success = false;
            result.errors.push(error instanceof Error ? error.message : String(error));
        }
        return result;
    }
    /**
     * Process template files recursively
     */
    async processTemplateFiles(templatePath, outputPath, context, options, result) {
        const entries = await fs.readdir(templatePath, { withFileTypes: true });
        for (const entry of entries) {
            // Skip template.json metadata file
            if (entry.name === 'template.json') {
                continue;
            }
            const sourcePath = path.join(templatePath, entry.name);
            const targetPath = this.processTemplatePath(path.join(outputPath, entry.name), context);
            if (entry.isDirectory()) {
                // Recursively process directories
                await fs.ensureDir(targetPath);
                await this.processTemplateFiles(sourcePath, targetPath, context, options, result);
            }
            else if (entry.isFile()) {
                // Process template files
                await this.processFile(sourcePath, targetPath, context, options, result);
            }
        }
    }
    /**
     * Process a single file
     */
    async processFile(sourcePath, targetPath, context, options, result) {
        // Check if target file already exists
        if (await fs.pathExists(targetPath)) {
            if (options.skipExisting) {
                result.filesSkipped.push(targetPath);
                return;
            }
            if (!options.overwrite) {
                result.filesSkipped.push(targetPath);
                result.warnings.push(`File already exists: ${targetPath}`);
                return;
            }
        }
        try {
            // Process template if it's a template file
            if (this.processor.isTemplateFile(sourcePath)) {
                await this.processor.processTemplate(sourcePath, targetPath, context);
            }
            else {
                // Copy file as-is
                await fs.copy(sourcePath, targetPath);
            }
            result.filesCreated.push(targetPath);
        }
        catch (error) {
            result.errors.push(`Failed to process ${sourcePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Process template path (handle variable substitution in paths)
     */
    processTemplatePath(filePath, context) {
        return this.processor.processTemplatePath(filePath, context);
    }
    /**
     * Collect files that would be created (for dry-run)
     */
    async collectFilesToCreate(options, result) {
        const entries = await fs.readdir(options.templatePath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name === 'template.json') {
                continue;
            }
            const sourcePath = path.join(options.templatePath, entry.name);
            const targetPath = this.processTemplatePath(path.join(options.outputPath, entry.name), options.context);
            if (entry.isDirectory()) {
                // Recursively collect from directories
                const subOptions = {
                    ...options,
                    templatePath: sourcePath,
                    outputPath: targetPath,
                };
                await this.collectFilesToCreate(subOptions, result);
            }
            else {
                result.filesCreated.push(targetPath);
            }
        }
    }
    /**
     * Create directory structure
     */
    async createDirectoryStructure(structure) {
        for (const [dirPath, content] of Object.entries(structure)) {
            await fs.ensureDir(dirPath);
            if (typeof content === 'object' && content !== null) {
                await this.createDirectoryStructure(content);
            }
        }
    }
}
//# sourceMappingURL=file-generator.js.map