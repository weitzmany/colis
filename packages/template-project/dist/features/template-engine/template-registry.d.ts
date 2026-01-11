/**
 * Template Registry
 *
 * Manages available templates and their metadata
 */
import { TemplateMetadata } from './types';
export declare class TemplateRegistry {
    private templatesPath;
    constructor(templatesPath?: string);
    /**
     * Get default templates path
     */
    private getDefaultTemplatesPath;
    /**
     * Discover all available templates
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