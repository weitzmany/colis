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

import fs from 'fs-extra';
import * as path from 'path';
import { TemplateProcessor } from './template-processor.js';
import { GenerationOptions, GenerationResult, TemplateContext } from './types.js';

/**
 * Generates project files and directory structure from templates.
 * 
 * Processes Handlebars templates, substitutes variables, and creates
 * the complete project structure in the output directory.
 */
export class FileGenerator {
  /** Template processor for handling Handlebars templates */
  private processor: TemplateProcessor;

  /**
   * Create a new FileGenerator instance.
   */
  constructor() {
    this.processor = new TemplateProcessor();
  }

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
  async generateProject(options: GenerationOptions): Promise<GenerationResult> {
    const result: GenerationResult = {
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
      await this.processTemplateFiles(
        options.templatePath,
        options.outputPath,
        options.context,
        options,
        result
      );
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : String(error));
    }

    return result;
  }

  /**
   * Process template files recursively
   */
  private async processTemplateFiles(
    templatePath: string,
    outputPath: string,
    context: TemplateContext,
    options: GenerationOptions,
    result: GenerationResult
  ): Promise<void> {
    const entries = await fs.readdir(templatePath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip template.json metadata file
      if (entry.name === 'template.json') {
        continue;
      }

      const sourcePath = path.join(templatePath, entry.name);
      const targetPath = this.processTemplatePath(
        path.join(outputPath, entry.name),
        context
      );

      if (entry.isDirectory()) {
        // Recursively process directories
        await fs.ensureDir(targetPath);
        await this.processTemplateFiles(sourcePath, targetPath, context, options, result);
      } else if (entry.isFile()) {
        // Process template files
        await this.processFile(sourcePath, targetPath, context, options, result);
      }
    }
  }

  /**
   * Process a single file
   */
  private async processFile(
    sourcePath: string,
    targetPath: string,
    context: TemplateContext,
    options: GenerationOptions,
    result: GenerationResult
  ): Promise<void> {
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
      } else {
        // Copy file as-is
        await fs.copy(sourcePath, targetPath);
      }

      result.filesCreated.push(targetPath);
    } catch (error) {
      result.errors.push(
        `Failed to process ${sourcePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Process template path (handle variable substitution in paths)
   */
  private processTemplatePath(filePath: string, context: TemplateContext): string {
    return this.processor.processTemplatePath(filePath, context);
  }

  /**
   * Collect files that would be created (for dry-run)
   */
  private async collectFilesToCreate(
    options: GenerationOptions,
    result: GenerationResult
  ): Promise<void> {
    const entries = await fs.readdir(options.templatePath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === 'template.json') {
        continue;
      }

      const sourcePath = path.join(options.templatePath, entry.name);
      const targetPath = this.processTemplatePath(
        path.join(options.outputPath, entry.name),
        options.context
      );

      if (entry.isDirectory()) {
        // Recursively collect from directories
        const subOptions = {
          ...options,
          templatePath: sourcePath,
          outputPath: targetPath,
        };
        await this.collectFilesToCreate(subOptions, result);
      } else {
        result.filesCreated.push(targetPath);
      }
    }
  }

  /**
   * Create directory structure
   */
  async createDirectoryStructure(structure: Record<string, unknown>): Promise<void> {
    for (const [dirPath, content] of Object.entries(structure)) {
      await fs.ensureDir(dirPath);
      if (typeof content === 'object' && content !== null) {
        await this.createDirectoryStructure(content as Record<string, unknown>);
      }
    }
  }
}
