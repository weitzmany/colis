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
import { TemplateMetadata } from './types.js';
/**
 * Manages template discovery and retrieval.
 *
 * Templates are stored in directories under `src/templates/`. Each template directory
 * should contain a `template.json` file with metadata about the template.
 */
export declare class TemplateRegistry {
    /** Path to templates directory */
    private templatesPath;
    /**
     * Create a new TemplateRegistry instance.
     *
     * @param templatesPath - Optional custom path to templates directory.
     *                        Defaults to `src/templates` relative to package root.
     */
    constructor(templatesPath?: string);
    /**
     * Get default templates path relative to package root.
     *
     * @returns Path to default templates directory
     * @private
     */
    private getDefaultTemplatesPath;
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
    discoverTemplates(): Promise<TemplateMetadata[]>;
    /**
     * Get a specific template by type
     */
    getTemplate(type: string): Promise<TemplateMetadata | null>;
    /**
     * Load template metadata from template.json
     */
    loadTemplateMetadata(templatePath: string): Promise<TemplateMetadata | null>;
    /**
     * Infer template type from directory name
     */
    private inferType;
    /**
     * Validate template structure
     */
    validateTemplate(templatePath: string): Promise<boolean>;
    /**
     * Check if directory contains template files
     */
    private hasTemplateFiles;
    /**
     * Get template path
     */
    getTemplatesPath(): string;
}
//# sourceMappingURL=template-registry.d.ts.map