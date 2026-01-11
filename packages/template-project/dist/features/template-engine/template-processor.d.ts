/**
 * Template Processor
 *
 * Processes template files with variable substitution using Handlebars.
 * Handles both file content processing and file path variable substitution.
 *
 * @example
 * ```typescript
 * const processor = new TemplateProcessor();
 * await processor.processFile('./template/package.json.hbs', context);
 * const processedPath = processor.processFileName('{{projectName}}.json', context);
 * ```
 */
import { TemplateContext } from './types.js';
/**
 * Processes Handlebars templates with variable substitution.
 *
 * Provides methods for processing template file contents and file names
 * using Handlebars syntax (e.g., `{{projectName}}`, `{{#if}}` blocks).
 */
export declare class TemplateProcessor {
    /**
     * Create a new TemplateProcessor instance.
     *
     * Registers custom Handlebars helpers for conditional logic and string manipulation.
     */
    constructor();
    /**
     * Process a single template file with variable substitution.
     *
     * Reads a Handlebars template file, substitutes variables from the context,
     * and writes the processed content to the output path.
     *
     * @param filePath - Path to the template file (usually ends with .hbs)
     * @param context - Template context with variables for substitution
     * @returns Processed template content as a string
     *
     * @example
     * ```typescript
     * const content = await processor.processFile(
     *   './templates/package.json.hbs',
     *   { projectName: 'my-app', packageManager: 'npm' }
     * );
     * ```
     */
    processFile(filePath: string, context: TemplateContext): Promise<string>;
    /**
     * Process a template file name with variable substitution.
     *
     * Substitutes variables in file names (e.g., `{{projectName}}.json` → `my-app.json`).
     *
     * @param fileName - Template file name with variables
     * @param context - Template context with variables for substitution
     * @returns Processed file name with variables substituted
     *
     * @example
     * ```typescript
     * const processedName = processor.processFileName(
     *   '{{projectName}}.json',
     *   { projectName: 'my-app' }
     * );
     * // Returns: 'my-app.json'
     * ```
     */
    processFileName(fileName: string, context: TemplateContext): string;
    /**
     * Process a single template file (legacy method name, use processFile instead).
     *
     * @deprecated Use {@link processFile} instead
     * @param templatePath - Path to template file
     * @param outputPath - Path where processed file should be written
     * @param context - Template context
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
     * Register custom Handlebars helpers for template processing.
     *
     * Registers helpers for:
     * - Conditional logic: `if_eq`, `unless_eq`
     * - String manipulation: `uppercase`, `lowercase`, `kebab`
     * - JSON formatting: `json`
     */
    private registerHelpers;
}
//# sourceMappingURL=template-processor.d.ts.map