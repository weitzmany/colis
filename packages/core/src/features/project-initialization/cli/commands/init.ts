/**
 * Init Command
 * 
 * CLI command for project initialization.
 */

import { initializeProject, InitOptions } from '../../project-initializer.js';
import chalk from 'chalk';

export async function initCommand(options: InitOptions) {
  try {
    const result = await initializeProject(options);

    if (!result.success) {
      console.error(chalk.red('\nErrors:'));
      result.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
      process.exit(1);
    }

    if (result.warnings.length > 0) {
      console.warn(chalk.yellow('\nWarnings:'));
      result.warnings.forEach((warning) => console.warn(chalk.yellow(`  - ${warning}`)));
    }
  } catch (error: any) {
    console.error(chalk.red(`\nFatal error: ${error.message}`));
    process.exit(1);
  }
}
