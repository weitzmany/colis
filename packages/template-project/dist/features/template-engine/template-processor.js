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
import Handlebars from 'handlebars';
import fs from 'fs-extra';
import * as path from 'path';
/**
 * Processes Handlebars templates with variable substitution.
 *
 * Provides methods for processing template file contents and file names
 * using Handlebars syntax (e.g., `{{projectName}}`, `{{#if}}` blocks).
 */
export class TemplateProcessor {
    /**
     * Create a new TemplateProcessor instance.
     *
     * Registers custom Handlebars helpers for conditional logic and string manipulation.
     */
    constructor() {
        this.registerHelpers();
    }
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
    async processFile(filePath, context) {
        const content = await fs.readFile(filePath, 'utf-8');
        const template = Handlebars.compile(content);
        return template(context);
    }
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
    processFileName(fileName, context) {
        const template = Handlebars.compile(fileName);
        return template(context);
    }
    /**
     * Process a single template file (legacy method name, use processFile instead).
     *
     * @deprecated Use {@link processFile} instead
     * @param templatePath - Path to template file
     * @param outputPath - Path where processed file should be written
     * @param context - Template context
     */
    async processTemplate(templatePath, outputPath, context) {
        // Read template file
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        // Compile template with Handlebars
        const template = Handlebars.compile(templateContent);
        // Process template with context
        const processedContent = template(context);
        // Ensure output directory exists
        await fs.ensureDir(path.dirname(outputPath));
        // Write processed content to output path
        await fs.writeFile(outputPath, processedContent, 'utf-8');
    }
    /**
     * Process a template file path (handle file renaming based on context)
     */
    processTemplatePath(templatePath, context) {
        // Replace {{projectName}} and other variables in file paths
        let processedPath = templatePath;
        // Replace common variables in paths
        Object.keys(context).forEach((key) => {
            const value = String(context[key] || '');
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processedPath = processedPath.replace(regex, value);
        });
        // Remove .hbs extension if present
        if (processedPath.endsWith('.hbs')) {
            processedPath = processedPath.slice(0, -4);
        }
        return processedPath;
    }
    /**
     * Check if a file is a template file
     */
    isTemplateFile(filePath) {
        return filePath.endsWith('.hbs') || filePath.includes('{{');
    }
    /**
     * Register custom Handlebars helpers for template processing.
     *
     * Registers helpers for:
     * - Conditional logic: `if_eq`, `unless_eq`
     * - String manipulation: `uppercase`, `lowercase`, `kebab`
     * - JSON formatting: `json`
     */
    registerHelpers() {
        // Helper for conditional sections (if a equals b)
        Handlebars.registerHelper('if_eq', function (a, b, options) {
            if (a === b) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
        // Helper for conditional sections (unless a equals b)
        Handlebars.registerHelper('unless_eq', function (a, b, options) {
            if (a !== b) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
        // Helper for JSON stringification
        Handlebars.registerHelper('json', function (context) {
            return JSON.stringify(context, null, 2);
        });
        // Helper for uppercase conversion
        Handlebars.registerHelper('uppercase', function (str) {
            return str ? str.toUpperCase() : '';
        });
        // Helper for lowercase conversion
        Handlebars.registerHelper('lowercase', function (str) {
            return str ? str.toLowerCase() : '';
        });
        // Helper for kebab-case conversion
        Handlebars.registerHelper('kebab', function (str) {
            return str
                ? str
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .replace(/[\s_]+/g, '-')
                    .toLowerCase()
                : '';
        });
    }
}
//# sourceMappingURL=template-processor.js.map