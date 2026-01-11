/**
 * Template Processor
 *
 * Processes template files with variable substitution using Handlebars
 */
import { TemplateContext } from './types';
export declare class TemplateProcessor {
    /**
     * Process a single template file
     */
    processTemplate(templatePath: string, outputPath: string, context: TemplateContext): Promise<void>;
    /**
     * Process a template file path (handle file renaming based on context)
     */
    processTemplatePath(templatePath: string, context: TemplateContext): string;
    /**
     * Check if a file is a template file
     */
    isTemplateFile(filePath: string): boolean;
    /**
     * Register custom Handlebars helpers
     */
    registerHelpers(): void;
    constructor();
}
//# sourceMappingURL=template-processor.d.ts.map