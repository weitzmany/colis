/**
 * Refit Command
 * 
 * CLI command for refitting project commissioning - checks for gaps and updates as needed.
 * Provides user-friendly interface with clear feedback and helpful guidance.
 * (Formerly: update command)
 */

import { updateProject, UpdateOptions, UpdateResult } from '../../project-updater.js';
import chalk from 'chalk';

/**
 * Display a visually appealing header for the update process
 */
function displayHeader(): void {
  console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  🔄 Project Refit') + chalk.bold.cyan('                                   ║'));
  console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
}

/**
 * Display success message with summary
 */
function displaySuccessMessage(result: UpdateResult): void {
  const hasChanges = result.updated.length > 0 || result.added.length > 0;

  if (hasChanges) {
    console.log(chalk.bold.green('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.green('║') + chalk.bold.white('  ✅ Project Refitted Successfully!') + chalk.bold.green('                  ║'));
    console.log(chalk.bold.green('╚═══════════════════════════════════════════════════════════╝\n'));
  } else {
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') + chalk.bold.white('  ✓ Project Already Up to Date') + chalk.bold.cyan('                      ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
  }
}

function displayShipyardSummary(result: UpdateResult, options: UpdateOptions): void {
  if (options.skipShipyard || !result.shipyardUpdated) {
    console.log(chalk.gray('  • Shipyard CI/CD: skipped'));
    return;
  }

  console.log(chalk.gray('  • Shipyard CI/CD: updated'));
}

function displayGitHubSummary(result: UpdateResult, options: UpdateOptions): void {
  if (options.skipGitHub) {
    console.log(chalk.gray('  • GitHub repository: skipped'));
    return;
  }

  if (result.githubResult?.repoUrl) {
    console.log(chalk.gray(`  • GitHub repository: ready (${result.githubResult.repoUrl})`));
    return;
  }

  console.log(chalk.gray('  • GitHub repository: skipped'));
}

/**
 * Display errors in a user-friendly format
 */
function displayErrors(errors: string[]): void {
  console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.red('║') + chalk.bold.white('  ❌ Update Errors') + chalk.bold.red('                                  ║'));
  console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════╝\n'));

  errors.forEach((error, index) => {
    console.log(chalk.red(`  ${index + 1}. ${error.split('\n')[0]}`));
    if (error.includes('Solution:')) {
      const solution = error.split('Solution:')[1].trim();
      console.log(chalk.yellow(`     💡 ${solution}`));
    }
  });

  console.log(chalk.dim('\n  Need help? Check the error messages above for solutions.\n'));
}

/**
 * Display warnings in a user-friendly format
 */
function displayWarnings(warnings: string[]): void {
  if (warnings.length === 0) return;

  console.log(chalk.bold.yellow('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.yellow('║') + chalk.bold.white('  ⚠️  Warnings') + chalk.bold.yellow('                                     ║'));
  console.log(chalk.bold.yellow('╚═══════════════════════════════════════════════════════════╝\n'));

  warnings.forEach((warning, index) => {
    console.log(chalk.yellow(`  ${index + 1}. ${warning}`));
  });

  console.log(chalk.dim('\n  These warnings don\'t prevent the update, but you may want to address them.\n'));
}

export async function refitCommand(options: UpdateOptions) {
  try {
    displayHeader();

    // Skip defaults check during updates (only needed for new projects)
    const updateOptions = {
      ...options,
      skipDefaults: true,
    };

    const result = await updateProject(updateOptions);

    // Add spacing before results
    console.log();

    if (!result.success) {
      displayErrors(result.errors);
      process.exit(1);
    }

    displayWarnings(result.warnings);

    if (result.updated.length > 0) {
      console.log(chalk.bold.green('\n📝 Updated:'));
      result.updated.forEach((item) => {
        console.log(chalk.green(`  ✓ ${item}`));
      });
    }

    if (result.added.length > 0) {
      console.log(chalk.bold.blue('\n➕ Added:'));
      result.added.forEach((item) => {
        console.log(chalk.blue(`  + ${item}`));
      });
    }

    console.log(chalk.bold('\n📋 Commissioning summary:'));
    displayGitHubSummary(result, updateOptions);
    displayShipyardSummary(result, updateOptions);

    displaySuccessMessage(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.red('║') + chalk.bold.white('  💥 Fatal Error') + chalk.bold.red('                                    ║'));
    console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════╝\n'));
    console.error(chalk.red(`  ${errorMessage}`));
    console.log(chalk.dim('\n  Please check the error above and try again.\n'));
    process.exit(1);
  }
}
