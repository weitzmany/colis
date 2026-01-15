/**
 * Template Registry
 * 
 * Manages available templates and their metadata.
 * Discovers templates from the file system and loads their metadata from template.json files.
 * 
 * @example
 * ```typescript
 * const registry = new TemplateRegistry();
 * const templates = await registry.discoverTemplates();
 * const angularTemplate = await registry.getTemplate('angular');
 * ```
 */

import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TemplateMetadata } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Manages template discovery and retrieval.
 * 
 * Templates are stored in directories under `src/templates/`. Each template directory
 * should contain a `template.json` file with metadata about the template.
 */
export class TemplateRegistry {
  /** Path to templates directory */
  private templatesPath: string;

  /**
   * Create a new TemplateRegistry instance.
   * 
   * @param templatesPath - Optional custom path to templates directory.
   *                        Defaults to `src/templates` relative to package root.
   */
  constructor(templatesPath?: string) {
    // Default to src/templates relative to package root
    this.templatesPath = templatesPath || this.getDefaultTemplatesPath();
  }

  /**
   * Get default templates path relative to package root.
   * 
   * @returns Path to default templates directory
   * @private
   */
  private getDefaultTemplatesPath(): string {
    // Get path relative to package root
    const packageRoot = path.resolve(__dirname, '../../..');
    return path.join(packageRoot, 'src', 'templates');
  }

  /**
   * Discover all available templates in the templates directory.
   * 
   * Scans the templates directory for subdirectories and loads metadata
   * from each template's template.json file.
   * 
   * @returns Array of template metadata objects
   * @throws {Error} If templates directory cannot be read
   * 
   * @example
   * ```typescript
   * const registry = new TemplateRegistry();
   * const templates = await registry.discoverTemplates();
   * console.log(`Found ${templates.length} templates`);
   * ```
   */
  async discoverTemplates(): Promise<TemplateMetadata[]> {
    const templates: TemplateMetadata[] = [];

    if (!(await fs.pathExists(this.templatesPath))) {
      return templates;
    }

    const entries = await fs.readdir(this.templatesPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const templatePath = path.join(this.templatesPath, entry.name);
        const metadata = await this.loadTemplateMetadata(templatePath);
        if (metadata) {
          templates.push(metadata);
        }
      }
    }

    return templates;
  }

  /**
   * Get a specific template by type
   */
  async getTemplate(type: string): Promise<TemplateMetadata | null> {
    const templates = await this.discoverTemplates();
    return templates.find((t) => t.type === type || t.name === type) || null;
  }

  /**
   * Load template metadata from template.json
   */
  async loadTemplateMetadata(templatePath: string): Promise<TemplateMetadata | null> {
    const metadataPath = path.join(templatePath, 'template.json');

    if (!(await fs.pathExists(metadataPath))) {
      // Try to infer metadata from directory name
      const dirName = path.basename(templatePath);
      return {
        name: dirName,
        description: `${dirName} project template`,
        type: this.inferType(dirName),
        version: '1.0.0',
        path: templatePath,
      };
    }

    try {
      const metadataContent = await fs.readJson(metadataPath);
      return {
        ...metadataContent,
        path: templatePath,
      };
    } catch (error) {
      console.warn(`Failed to load template metadata from ${metadataPath}:`, error);
      return null;
    }
  }

  /**
   * Infer template type from directory name
   */
  private inferType(dirName: string): TemplateMetadata['type'] {
    const lowerName = dirName.toLowerCase();
    if (lowerName.includes('angular')) {
      return 'angular';
    }
    if (lowerName.includes('slim')) {
      return 'slim';
    }
    if (lowerName.includes('full') || lowerName.includes('stack')) {
      return 'full-stack';
    }
    if (lowerName.includes('frontend') || lowerName.includes('client')) {
      return 'frontend';
    }
    if (lowerName.includes('backend') || lowerName.includes('server')) {
      return 'backend';
    }
    if (lowerName.includes('api')) {
      return 'api';
    }
    return 'angular'; // Default to Angular
  }

  /**
   * Validate template structure
   */
  async validateTemplate(templatePath: string): Promise<boolean> {
    if (!(await fs.pathExists(templatePath))) {
      return false;
    }

    // Check if template.json exists or if there are template files
    const metadataPath = path.join(templatePath, 'template.json');
    const hasMetadata = await fs.pathExists(metadataPath);

    // Check if there are any template files
    const hasTemplateFiles = await this.hasTemplateFiles(templatePath);

    return hasMetadata || hasTemplateFiles;
  }

  /**
   * Check if directory contains template files
   */
  private async hasTemplateFiles(dirPath: string): Promise<boolean> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isFile() && (entry.name.endsWith('.hbs') || entry.name.includes('{{'))) {
        return true;
      }

      if (entry.isDirectory()) {
        if (await this.hasTemplateFiles(fullPath)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get template path
   */
  getTemplatesPath(): string {
    return this.templatesPath;
  }
}
