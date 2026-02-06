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
import chalk from 'chalk';
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

    // Ensure projectName is a string if provided and trim it
    if (config.projectName) {
      if (typeof config.projectName !== 'string') {
        config.projectName = String(config.projectName);
      }
      config.projectName = config.projectName.trim();
    }

    // If project name not provided or empty after trimming, prompt for it
    if (!config.projectName || config.projectName.length === 0) {
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
      config.projectName = nameAnswer.projectName.trim();
    }
    
    // Ensure projectName is always trimmed after collection
    if (config.projectName && typeof config.projectName === 'string') {
      config.projectName = config.projectName.trim();
    }

    // If template type not provided, prompt for stack selection
    if (!config.templateType && !config.stackSelection) {
      config.stackSelection = await this.promptForStackSelection();
      
      // Check if all selections are "none"
      const selections = config.stackSelection;
      if (selections.frontend === 'none' && selections.backend === 'none' && (!selections.mobile || selections.mobile === 'none')) {
        console.error(chalk.red('\n❌ Error: At least one stack component (frontend, backend, or mobile) must be selected.'));
        console.error(chalk.yellow('Please select at least one component to create.'));
        process.exit(1);
      }
      
      // For backward compatibility, set templateType based on selections
      // Priority: full-stack > frontend > backend
      if (selections.frontend !== 'none' && selections.backend !== 'none') {
        config.templateType = 'full-stack';
      } else if (selections.frontend !== 'none') {
        config.templateType = selections.frontend || 'angular';
      } else if (selections.backend !== 'none') {
        config.templateType = selections.backend || 'slim';
      }
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
              default: 'Yoav Weitzman',
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

    // Ensure projectName is set and trimmed before returning
    if (config.projectName && typeof config.projectName === 'string') {
      config.projectName = config.projectName.trim();
    }
    
    return config as ProjectConfig;
  }

  /**
   * Prompt for stack selection (frontend, backend, mobile)
   */
  async promptForStackSelection(): Promise<{ frontend: string | 'none'; backend: string | 'none'; mobile?: string | 'none' }> {
    const selections: { frontend: string | 'none'; backend: string | 'none'; mobile?: string | 'none' } = {
      frontend: 'none',
      backend: 'none',
    };

    // Prompt for frontend
    const frontendAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'frontend',
        message: 'Select frontend framework:',
        choices: [
          { name: 'Angular', value: 'angular' },
          { name: 'React/Next.js', value: 'frontend' },
          { name: 'Vue', value: 'vue' },
          { name: 'None', value: 'none' },
        ],
        default: 'angular',
      },
    ]);
    selections.frontend = frontendAnswer.frontend;

    // Prompt for backend
    const backendAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'backend',
        message: 'Select backend framework:',
        choices: [
          { name: 'Slim (PHP)', value: 'slim' },
          { name: 'Express/Node.js', value: 'backend' },
          { name: 'Zend (PHP)', value: 'zend' },
          { name: 'None', value: 'none' },
        ],
        default: 'slim',
      },
    ]);
    selections.backend = backendAnswer.backend;

    // Prompt for mobile (optional, future feature)
    const mobileAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'mobile',
        message: 'Select mobile framework (optional):',
        choices: [
          { name: 'React Native', value: 'react-native' },
          { name: 'Ionic', value: 'ionic' },
          { name: 'None', value: 'none' },
        ],
        default: 'none',
      },
    ]);
    selections.mobile = mobileAnswer.mobile;

    return selections;
  }

  /**
   * Prompt for template type (legacy method, kept for backward compatibility)
   */
  async promptForTemplateType(): Promise<string> {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateType',
        message: 'Select template type:',
        choices: [
          { name: 'Angular (Frontend)', value: 'angular' },
          { name: 'Vue (Frontend)', value: 'vue' },
          { name: 'Slim (PHP Backend)', value: 'slim' },
          { name: 'Zend (PHP Backend)', value: 'zend' },
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

    // Ensure projectName is a string before calling trim
    const projectName = typeof config.projectName === 'string' ? config.projectName.trim() : '';
    if (!projectName || projectName.length === 0) {
      errors.push('Project name is required');
    }

    // Either templateType (legacy) or stackSelection must be provided
    if (!config.templateType && !config.stackSelection) {
      errors.push('Template type or stack selection is required');
    }
    
    // If stackSelection is provided, validate it
    if (config.stackSelection) {
      const { frontend, backend, mobile } = config.stackSelection;
      if (frontend === 'none' && backend === 'none' && (!mobile || mobile === 'none')) {
        errors.push('At least one stack component (frontend, backend, or mobile) must be selected');
      }
    }

    if (!config.packageManager) {
      errors.push('Package manager is required');
    }

    // Validate project name format (only if projectName exists and is not empty)
    if (projectName && projectName.length > 0) {
      const isValid = /^[a-z0-9-]+$/i.test(projectName);
      if (!isValid) {
        errors.push(`Project name must contain only letters, numbers, and hyphens (got: "${projectName}")`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
