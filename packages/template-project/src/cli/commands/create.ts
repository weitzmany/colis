/**
 * Create Command
 * 
 * CLI command for creating new projects from templates
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { TemplateRegistry } from '../../features/template-engine/template-registry';
import { ConfigManager } from '../../features/template-engine/config-manager';
import { FileGenerator } from '../../features/template-engine/file-generator';
import { ProjectConfig, TemplateContext } from '../../features/template-engine/types';
import { initializeProject } from '@your-org/core/features/project-initialization';

export interface CreateOptions {
  projectName?: string;
  template?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  skipDeps?: boolean;
  skipGit?: boolean;
  skipInit?: boolean;
  overwrite?: boolean;
  skipExisting?: boolean;
  dryRun?: boolean;
  description?: string;
  author?: string;
  license?: string;
}

export async function createCommand(options: CreateOptions = {}): Promise<void> {
  try {
    console.log(chalk.blue('🚀 Creating new project...\n'));

    // Step 1: Collect configuration
    const configManager = new ConfigManager();
    const config: ProjectConfig = await configManager.collectConfig({
      projectName: options.projectName,
      templateType: options.template,
      packageManager: options.packageManager,
      skipDeps: options.skipDeps,
      skipGit: options.skipGit,
      skipInit: options.skipInit,
      overwrite: options.overwrite,
      skipExisting: options.skipExisting ?? true,
      dryRun: options.dryRun,
      projectDescription: options.description,
      author: options.author,
      license: options.license,
    });

    // Validate configuration
    const validation = configManager.validateConfig(config);
    if (!validation.valid) {
      console.error(chalk.red('❌ Configuration errors:'));
      validation.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
      process.exit(1);
    }

    // Step 2: Select template
    const templateRegistry = new TemplateRegistry();
    const template = await templateRegistry.getTemplate(config.templateType);

    if (!template) {
      console.error(chalk.red(`❌ Template "${config.templateType}" not found`));
      const availableTemplates = await templateRegistry.discoverTemplates();
      if (availableTemplates.length > 0) {
        console.log(chalk.yellow('\nAvailable templates:'));
        availableTemplates.forEach((t) => {
          console.log(chalk.yellow(`  - ${t.type}: ${t.description}`));
        });
      }
      process.exit(1);
    }

    console.log(chalk.green(`✓ Selected template: ${template.name}`));

    // Step 3: Prepare output path
    const outputPath = path.resolve(process.cwd(), config.projectName);

    // Check if directory already exists
    if (await fs.pathExists(outputPath)) {
      if (config.skipExisting && !config.overwrite) {
        console.log(chalk.yellow(`⚠ Directory already exists: ${outputPath}`));
        console.log(chalk.yellow('  Skipping project creation'));
        return;
      }
      if (!config.overwrite) {
        console.error(chalk.red(`❌ Directory already exists: ${outputPath}`));
        console.error(chalk.red('  Use --overwrite to overwrite existing files'));
        process.exit(1);
      }
    }

    // Step 4: Allocate port (if Port Manager is available)
    // Port will be allocated during Project Initialization, so we'll use a default
    // The actual port will be set during the init step
    let allocatedPort: number | undefined;
    
    // Default ports by template type (will be overridden by Port Manager during init)
    const defaultPorts: Record<string, number> = {
      'angular': 4200,
      'slim': 8000,
      'full-stack': 3000,
      'frontend': 3000,
      'backend': 3001,
      'api': 3001,
    };
    allocatedPort = defaultPorts[config.templateType] || 4200;

    // Step 5: Generate project structure
    console.log(chalk.blue('\n📁 Generating project structure...'));

    const fileGenerator = new FileGenerator();
    const templateContext: TemplateContext = {
      projectName: config.projectName,
      projectDescription: config.projectDescription,
      appType: config.templateType,
      packageManager: config.packageManager,
      author: config.author,
      license: config.license,
      version: '1.0.0',
      port: allocatedPort,
    };

    const generationResult = await fileGenerator.generateProject({
      outputPath,
      templatePath: template.path,
      context: templateContext,
      overwrite: config.overwrite,
      skipExisting: config.skipExisting,
      dryRun: config.dryRun,
    });

    if (!generationResult.success) {
      console.error(chalk.red('\n❌ Failed to generate project:'));
      generationResult.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
      process.exit(1);
    }

    if (config.dryRun) {
      console.log(chalk.blue('\n🔍 Dry run - files that would be created:'));
      generationResult.filesCreated.forEach((file) => {
        console.log(chalk.green(`  ✓ ${file}`));
      });
      return;
    }

    console.log(chalk.green(`✓ Created ${generationResult.filesCreated.length} files`));
    if (generationResult.filesSkipped.length > 0) {
      console.log(chalk.yellow(`⚠ Skipped ${generationResult.filesSkipped.length} existing files`));
    }

    // Step 6: Run Project Initialization (if not skipped)
    if (!config.skipInit) {
      console.log(chalk.blue('\n⚙️  Running Project Initialization...'));

      // Change to project directory
      const originalCwd = process.cwd();
      process.chdir(outputPath);

      try {
        await initializeProject({
          projectName: config.projectName,
          appType: config.templateType,
          skipRules: false,
          skipCommands: false,
          skipPortManager: false,
          skipColors: false,
        });

        console.log(chalk.green('✓ Project Initialization completed'));
      } catch (error) {
        console.warn(chalk.yellow(`⚠ Project Initialization failed: ${error instanceof Error ? error.message : String(error)}`));
        console.warn(chalk.yellow('  You can run "npx @your-org/core init" manually later'));
      } finally {
        process.chdir(originalCwd);
      }
    }

    // Step 7: Install dependencies (if not skipped)
    if (!config.skipDeps) {
      console.log(chalk.blue('\n📦 Installing dependencies...'));

      const originalCwd = process.cwd();
      process.chdir(outputPath);

      try {
        const installCommand = config.packageManager === 'yarn' 
          ? 'yarn install'
          : config.packageManager === 'pnpm'
          ? 'pnpm install'
          : 'npm install';

        execSync(installCommand, { stdio: 'inherit' });
        console.log(chalk.green('✓ Dependencies installed'));
      } catch (error) {
        console.warn(chalk.yellow(`⚠ Dependency installation failed: ${error instanceof Error ? error.message : String(error)}`));
        console.warn(chalk.yellow(`  You can run "${config.packageManager} install" manually later`));
      } finally {
        process.chdir(originalCwd);
      }
    }

    // Step 8: Initialize git (if not skipped)
    if (!config.skipGit) {
      console.log(chalk.blue('\n🔧 Initializing git repository...'));

      const originalCwd = process.cwd();
      process.chdir(outputPath);

      try {
        // Check if git is available
        execSync('git --version', { stdio: 'ignore' });
        
        // Initialize git repo
        execSync('git init', { stdio: 'inherit' });
        console.log(chalk.green('✓ Git repository initialized'));
      } catch (error) {
        console.warn(chalk.yellow('⚠ Git initialization skipped (git not available or already initialized)'));
      } finally {
        process.chdir(originalCwd);
      }
    }

    // Success message
    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log(chalk.blue(`\nNext steps:`));
    console.log(chalk.blue(`  cd ${config.projectName}`));
    if (config.skipDeps) {
      console.log(chalk.blue(`  ${config.packageManager} install`));
    }
    console.log(chalk.blue(`  Start developing!`));
  } catch (error) {
    console.error(chalk.red('\n❌ Error creating project:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
