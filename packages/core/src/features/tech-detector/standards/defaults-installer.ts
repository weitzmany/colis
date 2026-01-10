/**
 * Defaults Installer
 * 
 * Handles installation of default technologies for new projects.
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as path from 'path';
import { TechDetector } from '../tech-detector';
import { StandardsLoader, NewProjectDefaults } from './standards-loader';

const execAsync = promisify(exec);

export interface InstallDefaultsResult {
  installed: boolean;
  framework?: string;
  errors: string[];
}

export class DefaultsInstaller {
  private techDetector: TechDetector;
  private standardsLoader: StandardsLoader;

  constructor() {
    this.techDetector = new TechDetector();
    this.standardsLoader = new StandardsLoader();
  }

  /**
   * Check if project is new (no frameworks detected) and prompt to install defaults
   */
  async checkAndPromptForDefaults(
    projectPath: string,
    interactive: boolean = true
  ): Promise<InstallDefaultsResult> {
    const result: InstallDefaultsResult = {
      installed: false,
      errors: [],
    };

    try {
      // Detect current tech stack
      const techStack = await this.techDetector.detect(projectPath);
      
      // Check if project is new (no framework detected)
      const isNewProject = !techStack.framework;

      if (!isNewProject) {
        // Project already has a framework, skip
        return result;
      }

      // Get new project defaults
      const defaults = await this.standardsLoader.getNewProjectDefaults(projectPath);
      if (!defaults) {
        // No defaults configured, skip
        return result;
      }

      // Prompt user if interactive
      if (interactive) {
        const shouldInstall = await this.promptForInstall(defaults);
        if (!shouldInstall) {
          return result;
        }
      }

      // Determine project type (frontend or backend)
      const projectType = await this.determineProjectType(projectPath, defaults);
      
      // Install defaults based on project type
      if (projectType === 'frontend') {
        result.installed = await this.installFrontendDefaults(projectPath, defaults);
        result.framework = defaults.framework;
      } else if (projectType === 'backend' && defaults.backendDefaults) {
        result.installed = await this.installBackendDefaults(projectPath, defaults.backendDefaults);
        result.framework = defaults.backendDefaults.framework;
      } else {
        // Default to frontend if backend defaults not available
        result.installed = await this.installFrontendDefaults(projectPath, defaults);
        result.framework = defaults.framework;
      }

      if (result.installed) {
        console.log(chalk.green(`\n✓ Successfully initialized ${result.framework} project!`));
      }

    } catch (error: any) {
      result.errors.push(`Failed to install defaults: ${error.message}`);
      console.error(chalk.red(`Error: ${error.message}`));
    }

    return result;
  }

  /**
   * Prompt user if they want to install defaults
   */
  private async promptForInstall(defaults: NewProjectDefaults): Promise<boolean> {
    console.log(chalk.blue('\n📦 New project detected - no frameworks found'));
    console.log(chalk.gray(`Recommended defaults:`));
    console.log(chalk.gray(`  Frontend: ${defaults.framework} + ${defaults.language}`));
    if (defaults.backendDefaults) {
      console.log(chalk.gray(`  Backend: ${defaults.backendDefaults.framework} + ${defaults.backendDefaults.language}`));
    }

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to initialize this project with the recommended defaults?',
        default: true,
      },
    ]);

    return answer.install;
  }

  /**
   * Determine project type (frontend or backend)
   */
  private async determineProjectType(
    projectPath: string,
    defaults: NewProjectDefaults
  ): Promise<'frontend' | 'backend'> {
    // Check for existing backend indicators
    const composerPath = path.join(projectPath, 'composer.json');
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    const hasBackendFiles = await fs.pathExists(composerPath) || await fs.pathExists(requirementsPath);

    // Check for existing frontend indicators
    const packageJsonPath = path.join(projectPath, 'package.json');
    const hasFrontendFiles = await fs.pathExists(packageJsonPath);

    // If backend files exist but no frontend, it's a backend project
    if (hasBackendFiles && !hasFrontendFiles && defaults.backendDefaults) {
      return 'backend';
    }

    // Default to frontend
    return 'frontend';
  }

  /**
   * Install frontend defaults
   */
  private async installFrontendDefaults(
    projectPath: string,
    defaults: NewProjectDefaults
  ): Promise<boolean> {
    try {
      console.log(chalk.blue(`\n🚀 Initializing ${defaults.framework} project...`));

      const framework = defaults.framework.toLowerCase();
      const version = defaults.versions[framework] || 'latest';

      switch (framework) {
        case 'angular':
          await this.installAngular(projectPath, version);
          break;
        case 'nextjs':
        case 'next.js':
          await this.installNextJs(projectPath, version);
          break;
        case 'react':
          await this.installReact(projectPath, version);
          break;
        default:
          console.log(chalk.yellow(`⚠ Framework ${framework} installation not yet implemented`));
          return false;
      }

      return true;
    } catch (error: any) {
      console.error(chalk.red(`Failed to install frontend defaults: ${error.message}`));
      return false;
    }
  }

  /**
   * Install backend defaults
   */
  private async installBackendDefaults(
    projectPath: string,
    backendDefaults: NonNullable<NewProjectDefaults['backendDefaults']>
  ): Promise<boolean> {
    try {
      console.log(chalk.blue(`\n🚀 Initializing ${backendDefaults.framework} project...`));

      const framework = backendDefaults.framework.toLowerCase();
      const version = backendDefaults.versions[framework] || 'latest';

      switch (framework) {
        case 'slim':
          await this.installSlim(projectPath, version);
          break;
        case 'laravel':
          await this.installLaravel(projectPath, version);
          break;
        case 'laminas':
        case 'zend':
          await this.installLaminas(projectPath, version);
          break;
        default:
          console.log(chalk.yellow(`⚠ Framework ${framework} installation not yet implemented`));
          return false;
      }

      return true;
    } catch (error: any) {
      console.error(chalk.red(`Failed to install backend defaults: ${error.message}`));
      return false;
    }
  }

  /**
   * Install Angular
   */
  private async installAngular(projectPath: string, version: string): Promise<void> {
    const projectName = path.basename(projectPath);
    // Angular CLI requires creating in a new directory, so we create in parent and move files
    const parentPath = path.dirname(projectPath);
    const tempProjectName = `${projectName}-temp`;
    const command = `npx -y @angular/cli@${version} new ${tempProjectName} --skip-git --routing --style=css --skip-install`;
    
    console.log(chalk.gray(`Running: ${command}`));
    await execAsync(command, { cwd: parentPath });
    
    // Move files from temp directory to current directory
    const tempPath = path.join(parentPath, tempProjectName);
    if (await fs.pathExists(tempPath)) {
      const files = await fs.readdir(tempPath);
      for (const file of files) {
        if (file !== 'node_modules' && file !== '.git') {
          const srcPath = path.join(tempPath, file);
          const destPath = path.join(projectPath, file);
          if (await fs.pathExists(destPath)) {
            await fs.remove(destPath);
          }
          await fs.move(srcPath, destPath);
        }
      }
      await fs.remove(tempPath);
    }
    
    // Install dependencies
    console.log(chalk.gray('Installing dependencies...'));
    await execAsync('npm install', { cwd: projectPath });
  }

  /**
   * Install Next.js
   */
  private async installNextJs(projectPath: string, version: string): Promise<void> {
    const command = `npx -y create-next-app@${version} . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`;
    
    console.log(chalk.gray(`Running: ${command}`));
    await execAsync(command, { cwd: projectPath });
  }

  /**
   * Install React
   */
  private async installReact(projectPath: string, version: string): Promise<void> {
    const command = `npx -y create-react-app@${version} . --template typescript`;
    
    console.log(chalk.gray(`Running: ${command}`));
    await execAsync(command, { cwd: projectPath });
  }

  /**
   * Install Slim
   */
  private async installSlim(projectPath: string, version: string): Promise<void> {
    const command = `composer create-project slim/slim-skeleton:${version} .`;
    
    console.log(chalk.gray(`Running: ${command}`));
    await execAsync(command, { cwd: projectPath });
  }

  /**
   * Install Laravel
   */
  private async installLaravel(projectPath: string, version: string): Promise<void> {
    const command = `composer create-project laravel/laravel:${version} .`;
    
    console.log(chalk.gray(`Running: ${command}`));
    await execAsync(command, { cwd: projectPath });
  }

  /**
   * Install Laminas
   */
  private async installLaminas(projectPath: string, version: string): Promise<void> {
    const command = `composer create-project laminas/laminas-mvc-skeleton:${version} .`;
    
    console.log(chalk.gray(`Running: ${command}`));
    await execAsync(command, { cwd: projectPath });
  }
}
