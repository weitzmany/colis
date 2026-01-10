/**
 * Update Command
 * 
 * CLI command for updating project initialization - checks for gaps and updates as needed.
 */

import { updateProject, UpdateOptions } from '../../project-updater';
import chalk from 'chalk';

export async function updateCommand(options: UpdateOptions) {
  try {
    const result = await updateProject(options);

    if (!result.success) {
      console.error(chalk.red('\nErrors:'));
      result.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
      process.exit(1);
    }

    if (result.warnings.length > 0) {
      console.warn(chalk.yellow('\nWarnings:'));
      result.warnings.forEach((warning) => console.warn(chalk.yellow(`  - ${warning}`)));
    }

    if (result.updated.length > 0) {
      console.log(chalk.green('\nUpdated:'));
      result.updated.forEach((item) => console.log(chalk.green(`  ✓ ${item}`)));
    }

    if (result.added.length > 0) {
      console.log(chalk.blue('\nAdded:'));
      result.added.forEach((item) => console.log(chalk.blue(`  + ${item}`)));
    }
  } catch (error: any) {
    console.error(chalk.red(`\nFatal error: ${error.message}`));
    process.exit(1);
  }
}
