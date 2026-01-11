/**
 * Template Processor
 * 
 * Processes template files with variable substitution using Handlebars
 */

import Handlebars from 'handlebars';
import fs from 'fs-extra';
import * as path from 'path';
import { TemplateContext } from './types.js';

export class TemplateProcessor {
  /**
   * Process a single template file
   */
  async processTemplate(
    templatePath: string,
    outputPath: string,
    context: TemplateContext
  ): Promise<void> {
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
  processTemplatePath(templatePath: string, context: TemplateContext): string {
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
  isTemplateFile(filePath: string): boolean {
    return filePath.endsWith('.hbs') || filePath.includes('{{');
  }

  /**
   * Register custom Handlebars helpers
   */
  registerHelpers(): void {
    // Helper for conditional sections
    Handlebars.registerHelper('if_eq', function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // Helper for JSON stringification
    Handlebars.registerHelper('json', function (context: unknown) {
      return JSON.stringify(context, null, 2);
    });

    // Helper for uppercase
    Handlebars.registerHelper('uppercase', function (str: string) {
      return str ? str.toUpperCase() : '';
    });

    // Helper for lowercase
    Handlebars.registerHelper('lowercase', function (str: string) {
      return str ? str.toLowerCase() : '';
    });

    // Helper for kebab-case
    Handlebars.registerHelper('kebab', function (str: string) {
      return str
        ? str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase()
        : '';
    });
  }

  constructor() {
    this.registerHelpers();
  }
}
