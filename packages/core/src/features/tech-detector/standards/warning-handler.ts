/**
 * Warning Handler
 * 
 * Handles interactive warnings and user choices.
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { Warning } from './warning-detector';
import { StandardsLoader, UserChoices } from './standards-loader';
import * as fs from 'fs-extra';
import * as path from 'path';

export type WarningAction = 'add-recommendation' | 'install-recommended' | 'update-version' | 'change-recommendation' | 'ignore';

export interface WarningResponse {
  action: WarningAction;
  warning: Warning;
}

export class WarningHandler {
  private standardsLoader: StandardsLoader;

  constructor() {
    this.standardsLoader = new StandardsLoader();
  }

  /**
   * Handle warnings interactively
   */
  async handleWarnings(
    warnings: Warning[],
    projectPath: string,
    interactive: boolean = true
  ): Promise<WarningResponse[]> {
    if (!interactive || warnings.length === 0) {
      return [];
    }

    const responses: WarningResponse[] = [];

    for (const warning of warnings) {
      const response = await this.handleWarning(warning, projectPath);
      if (response) {
        responses.push(response);
      }
    }

    return responses;
  }

  /**
   * Handle a single warning
   */
  private async handleWarning(
    warning: Warning,
    projectPath: string
  ): Promise<WarningResponse | null> {
    console.log(chalk.yellow(`\n⚠️  Warning: ${warning.message}`));

    if (warning.type === 'non-recommended') {
      return await this.handleNonRecommendedWarning(warning, projectPath);
    } else if (warning.type === 'outdated-version') {
      return await this.handleVersionWarning(warning, projectPath);
    }

    return null;
  }

  /**
   * Handle non-recommended tech warning
   */
  private async handleNonRecommendedWarning(
    warning: Warning,
    projectPath: string
  ): Promise<WarningResponse | null> {
    const recommendedList = warning.recommended?.join(', ') || 'None';

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `Detected: ${warning.detected.name}${warning.detected.version ? ` ${warning.detected.version}` : ''}\nRecommended: ${recommendedList}\n\nWhat would you like to do?`,
        choices: [
          {
            name: `Add ${warning.detected.name} to recommendations`,
            value: 'add-recommendation',
          },
          {
            name: warning.recommended && warning.recommended.length > 0
              ? `Install/init recommended ${warning.category} (${warning.recommended[0]})`
              : 'Skip',
            value: 'install-recommended',
            disabled: !warning.recommended || warning.recommended.length === 0,
          },
          {
            name: 'Ignore for now',
            value: 'ignore',
          },
        ],
      },
    ]);

    const action = answer.action as WarningAction;

    // Execute action
    if (action === 'add-recommendation') {
      await this.addRecommendation(warning, projectPath);
    } else if (action === 'install-recommended') {
      await this.showInstallInstructions(warning);
    } else if (action === 'ignore') {
      await this.ignoreWarning(warning, projectPath);
    }

    return { action, warning };
  }

  /**
   * Handle version warning
   */
  private async handleVersionWarning(
    warning: Warning,
    projectPath: string
  ): Promise<WarningResponse | null> {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `Detected: ${warning.detected.name} ${warning.detected.version}\nRecommended Minimum: ${warning.minimumVersion}\n\nWhat would you like to do?`,
        choices: [
          {
            name: `Update to ${warning.minimumVersion}`,
            value: 'update-version',
          },
          {
            name: `Change recommendation to ${warning.detected.version}`,
            value: 'change-recommendation',
          },
          {
            name: 'Ignore for now',
            value: 'ignore',
          },
        ],
      },
    ]);

    const action = answer.action as WarningAction;

    // Execute action
    if (action === 'update-version') {
      await this.showUpdateInstructions(warning);
    } else if (action === 'change-recommendation') {
      await this.changeRecommendation(warning, projectPath);
    } else if (action === 'ignore') {
      await this.ignoreWarning(warning, projectPath);
    }

    return { action, warning };
  }

  /**
   * Add detected tech to recommendations
   */
  private async addRecommendation(warning: Warning, projectPath: string): Promise<void> {
    const standardsPath = path.join(projectPath, '.core-tech-standards.json');
    let standards: any = {};

    if (await fs.pathExists(standardsPath)) {
      try {
        standards = JSON.parse(await fs.readFile(standardsPath, 'utf-8'));
      } catch (error) {
        // Ignore parse errors
      }
    }

    // Add to appropriate category
    const category = warning.category;
    if (!standards[category]) {
      standards[category] = { recommended: [], minimumVersions: {} };
    }
    if (!standards[category].recommended) {
      standards[category].recommended = [];
    }

    const techName = warning.detected.name.toLowerCase();
    if (!standards[category].recommended.includes(techName)) {
      standards[category].recommended.push(techName);
    }

    await fs.writeFile(standardsPath, JSON.stringify(standards, null, 2), 'utf-8');
    console.log(chalk.green(`✓ Added ${warning.detected.name} to recommendations`));
    console.log(chalk.green(`✓ Updated .core-tech-standards.json`));
  }

  /**
   * Show install instructions for recommended tech
   */
  private async showInstallInstructions(warning: Warning): Promise<void> {
    if (!warning.recommended || warning.recommended.length === 0) {
      return;
    }

    const recommended = warning.recommended[0];
    let command = '';

    // Generate install command based on category and recommended tech
    if (warning.category === 'framework') {
      if (recommended === 'nextjs') {
        command = 'npx create-next-app@latest';
      } else if (recommended === 'angular') {
        command = 'ng new my-app';
      } else if (recommended === 'react') {
        command = 'npx create-react-app my-app';
      } else if (recommended === 'express') {
        command = 'npx express-generator my-app';
      }
    }

    if (command) {
      console.log(chalk.blue(`\nTo install ${recommended}, run:`));
      console.log(chalk.cyan(`  ${command}`));
    } else {
      console.log(chalk.yellow(`\nPlease install ${recommended} manually.`));
    }
  }

  /**
   * Show update instructions
   */
  private async showUpdateInstructions(warning: Warning): Promise<void> {
    if (!warning.minimumVersion) {
      return;
    }

    const techName = warning.detected.name.toLowerCase();
    let command = '';

    // Generate update command based on category
    if (warning.category === 'framework') {
      if (techName.includes('next')) {
        command = `npm install next@${warning.minimumVersion} react@latest react-dom@latest`;
      } else if (techName.includes('angular')) {
        command = `ng update @angular/core@${warning.minimumVersion}`;
      } else if (techName.includes('react')) {
        command = `npm install react@${warning.minimumVersion} react-dom@${warning.minimumVersion}`;
      } else if (techName.includes('express')) {
        command = `npm install express@${warning.minimumVersion}`;
      }
    } else if (warning.category === 'language') {
      if (techName.includes('typescript')) {
        command = `npm install -g typescript@${warning.minimumVersion}`;
      } else if (techName.includes('node')) {
        command = `nvm install ${warning.minimumVersion} && nvm use ${warning.minimumVersion}`;
      }
    } else if (warning.category === 'buildTool') {
      if (techName.includes('vite')) {
        command = `npm install -D vite@${warning.minimumVersion}`;
      } else if (techName.includes('webpack')) {
        command = `npm install -D webpack@${warning.minimumVersion}`;
      }
    } else if (warning.category === 'packageManager') {
      if (techName === 'npm') {
        command = `npm install -g npm@${warning.minimumVersion}`;
      } else if (techName === 'pnpm') {
        command = `npm install -g pnpm@${warning.minimumVersion}`;
      } else if (techName === 'yarn') {
        command = `npm install -g yarn@${warning.minimumVersion}`;
      }
    }

    if (command) {
      console.log(chalk.blue(`\nTo update ${warning.detected.name} to ${warning.minimumVersion}, run:`));
      console.log(chalk.cyan(`  ${command}`));
      
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'run',
          message: 'Run this command now?',
          default: false,
        },
      ]);

      if (answer.run) {
        // Note: In a real implementation, we would execute the command
        // For now, we just show it
        console.log(chalk.yellow('Note: Command execution not implemented yet. Please run manually.'));
      }
    } else {
      console.log(chalk.yellow(`\nPlease update ${warning.detected.name} to ${warning.minimumVersion} manually.`));
    }
  }

  /**
   * Change recommendation to current version
   */
  private async changeRecommendation(warning: Warning, projectPath: string): Promise<void> {
    if (!warning.detected.version || !warning.minimumVersion) {
      return;
    }

    const standardsPath = path.join(projectPath, '.core-tech-standards.json');
    let standards: any = {};

    if (await fs.pathExists(standardsPath)) {
      try {
        standards = JSON.parse(await fs.readFile(standardsPath, 'utf-8'));
      } catch (error) {
        // Ignore parse errors
      }
    }

    // Update minimum version
    const category = warning.category;
    if (!standards[category]) {
      standards[category] = { recommended: [], minimumVersions: {} };
    }
    if (!standards[category].minimumVersions) {
      standards[category].minimumVersions = {};
    }

    const techName = warning.detected.name.toLowerCase();
    standards[category].minimumVersions[techName] = warning.detected.version;

    await fs.writeFile(standardsPath, JSON.stringify(standards, null, 2), 'utf-8');
    console.log(chalk.green(`✓ Changed recommendation to ${warning.detected.version}`));
    console.log(chalk.green(`✓ Updated .core-tech-standards.json`));
  }

  /**
   * Ignore warning (store choice)
   */
  private async ignoreWarning(warning: Warning, projectPath: string): Promise<void> {
    const choicesPath = path.join(projectPath, '.core-tech-choices.json');
    let choices: UserChoices = {};

    if (await fs.pathExists(choicesPath)) {
      try {
        choices = JSON.parse(await fs.readFile(choicesPath, 'utf-8'));
      } catch (error) {
        // Ignore parse errors
      }
    }

    if (!choices.ignoredWarnings) {
      choices.ignoredWarnings = {};
    }

    const techName = warning.detected.name.toLowerCase();

    if (warning.type === 'non-recommended') {
      if (!choices.ignoredWarnings.frameworks) {
        choices.ignoredWarnings.frameworks = {};
      }
      choices.ignoredWarnings.frameworks[techName] = {
        reason: 'user_choice',
        timestamp: new Date().toISOString(),
      };
    } else if (warning.type === 'outdated-version') {
      if (!choices.ignoredWarnings.versions) {
        choices.ignoredWarnings.versions = {};
      }
      choices.ignoredWarnings.versions[techName] = {
        current: warning.detected.version || '',
        recommended: warning.minimumVersion || '',
        reason: 'user_choice',
        timestamp: new Date().toISOString(),
      };
    }

    await this.standardsLoader.saveUserChoices(projectPath, choices);
    console.log(chalk.gray(`✓ Warning ignored (stored in .core-tech-choices.json)`));
  }
}
