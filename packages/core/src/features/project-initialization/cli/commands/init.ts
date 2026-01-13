/**
 * Init Command
 * 
 * CLI command for project initialization.
 * Provides user-friendly interface with clear feedback and helpful guidance.
 */

import { initializeProject, InitOptions } from '../../project-initializer.js';
import chalk from 'chalk';

/**
 * Display a visually appealing header for the initialization process
 */
function displayHeader(): void {
  console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  🚀 Project Initialization') + chalk.bold.cyan('                              ║'));
  console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
}

/**
 * Display success message with helpful next steps
 */
function displaySuccessMessage(result: any): void {
  console.log(chalk.bold.green('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.green('║') + chalk.bold.white('  ✅ Project Initialized Successfully!') + chalk.bold.green('                  ║'));
  console.log(chalk.bold.green('╚═══════════════════════════════════════════════════════════╝\n'));
  
  console.log(chalk.bold('📋 What was set up:'));
  console.log(chalk.gray('  • Expert personas and user rules'));
  console.log(chalk.gray('  • General commands'));
  if (result.portManagerInitialized) {
    console.log(chalk.gray('  • Port Manager configuration'));
  }
  if (result.validationResult?.colorsValid) {
    console.log(chalk.gray('  • IDE color scheme (unique per project)'));
  }
  
  console.log(chalk.bold('\n💡 Next steps:'));
  console.log(chalk.cyan('  1. Start coding! Your project is ready to go.'));
  console.log(chalk.cyan('  2. Switch branches to see IDE colors change automatically.'));
  console.log(chalk.cyan('  3. Use Port Manager to allocate ports: npx @your-org/core port-manager allocate'));
  console.log(chalk.dim('\n  Happy coding! 🎉\n'));
}

/**
 * Display errors in a user-friendly format
 */
function displayErrors(errors: string[]): void {
  console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.red('║') + chalk.bold.white('  ❌ Initialization Errors') + chalk.bold.red('                              ║'));
  console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════╝\n'));
  
  errors.forEach((error, index) => {
    console.log(chalk.red(`  ${index + 1}. ${error.split('\n')[0]}`));
    // Display solution if present
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
  console.log(chalk.bold.yellow('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.yellow('║') + chalk.bold.white('  ⚠️  Warnings') + chalk.bold.yellow('                                         ║'));
  console.log(chalk.bold.yellow('╚═══════════════════════════════════════════════════════════╝\n'));
  
  warnings.forEach((warning, index) => {
    console.log(chalk.yellow(`  ${index + 1}. ${warning}`));
  });
  
  console.log(chalk.dim('\n  These warnings don\'t prevent initialization, but you may want to address them.\n'));
}

export async function initCommand(options: InitOptions) {
  try {
    displayHeader();
    
    const result = await initializeProject(options);

    if (!result.success) {
      displayErrors(result.errors);
      process.exit(1);
    }

    if (result.warnings.length > 0) {
      displayWarnings(result.warnings);
    }

    // Display success message with next steps
    if (result.success) {
      displaySuccessMessage(result);
    }
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
