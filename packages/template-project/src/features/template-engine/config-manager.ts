/**
 * Configuration Manager
 * 
 * Collects user configuration via interactive CLI prompts.
 * Handles both interactive prompts and pre-filled options.
 * 
 * @example
 * ```typescript
 * const manager = new ConfigManager();
 * const config = await manager.collectConfig({
 *   projectName: 'my-app',
 *   templateType: 'angular'
 * });
 * ```
 */

import inquirer from 'inquirer';
import { ProjectConfig } from './types.js';

/**
 * Manages collection of project configuration from users.
 * 
 * Uses Inquirer.js to provide interactive prompts for missing configuration
 * values, while respecting pre-filled options.
 */
export class ConfigManager {
  /**
   * Collect configuration from user via interactive prompts.
   * 
   * Prompts for any missing required or optional fields. If options are
   * already provided, those values are used instead of prompting.
   * 
   * @param options - Partial configuration object with pre-filled values
   * @returns Complete ProjectConfig object with all required fields
   * 
   * @example
   * ```typescript
   * // Fully interactive
   * const config = await manager.collectConfig();
   * 
   * // Pre-fill some values
   * const config = await manager.collectConfig({
   *   projectName: 'my-app',
   *   packageManager: 'npm'
   * });
   * ```
   */
  async collectConfig(options?: Partial<ProjectConfig>): Promise<ProjectConfig> {
    const config: Partial<ProjectConfig> = { ...options };

    // If project name not provided, prompt for it
    if (!config.projectName) {
      const nameAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          validate: (input: string) => {
            if (!input || input.trim().length === 0) {
              return 'Project name is required';
            }
            // Validate project name (no spaces, valid npm package name)
            if (!/^[a-z0-9-]+$/i.test(input)) {
              return 'Project name must contain only letters, numbers, and hyphens';
            }
            return true;
          },
        },
      ]);
      config.projectName = nameAnswer.projectName;
    }

    // If template type not provided, prompt for it
    if (!config.templateType) {
      config.templateType = await this.promptForTemplateType();
    }

    // If package manager not provided, prompt for it
    if (!config.packageManager) {
      config.packageManager = await this.promptForPackageManager();
    }

    // Prompt for optional fields if not provided
    if (!config.projectDescription) {
      const descAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectDescription',
          message: 'Project description (optional):',
        },
      ]);
      config.projectDescription = descAnswer.projectDescription || undefined;
    }

    if (!config.author) {
      const authorAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'author',
          message: 'Author name (optional):',
        },
      ]);
      config.author = authorAnswer.author || undefined;
    }

    if (!config.license) {
      const licenseAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'license',
          message: 'License:',
          choices: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'None'],
          default: 'MIT',
        },
      ]);
      config.license = licenseAnswer.license === 'None' ? undefined : licenseAnswer.license;
    }

    return config as ProjectConfig;
  }

  /**
   * Prompt for template type
   */
  async promptForTemplateType(): Promise<string> {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateType',
        message: 'Select template type:',
        choices: [
          { name: 'Angular (Frontend)', value: 'angular' },
          { name: 'Slim (PHP Backend)', value: 'slim' },
          { name: 'Full-Stack (Next.js + Express)', value: 'full-stack' },
          { name: 'Frontend (React/Next.js)', value: 'frontend' },
          { name: 'Backend (Express/Node.js)', value: 'backend' },
          { name: 'API (RESTful API)', value: 'api' },
        ],
        default: 'angular',
      },
    ]);

    return answer.templateType;
  }

  /**
   * Prompt for package manager
   */
  async promptForPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: 'Package manager:',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'yarn', value: 'yarn' },
          { name: 'pnpm', value: 'pnpm' },
        ],
        default: 'npm',
      },
    ]);

    return answer.packageManager;
  }

  /**
   * Validate configuration
   */
  validateConfig(config: Partial<ProjectConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.projectName || config.projectName.trim().length === 0) {
      errors.push('Project name is required');
    }

    if (!config.templateType) {
      errors.push('Template type is required');
    }

    if (!config.packageManager) {
      errors.push('Package manager is required');
    }

    // Validate project name format
    if (config.projectName && !/^[a-z0-9-]+$/i.test(config.projectName)) {
      errors.push('Project name must contain only letters, numbers, and hyphens');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
