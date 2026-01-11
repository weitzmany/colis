/**
 * Create Command
 * 
 * CLI command for creating new projects from templates
 */

import * as path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { TemplateRegistry } from '../../features/template-engine/template-registry.js';
import { ConfigManager } from '../../features/template-engine/config-manager.js';
import { FileGenerator } from '../../features/template-engine/file-generator.js';
import { ProjectConfig, TemplateContext } from '../../features/template-engine/types.js';
import { initializeProject } from '@your-org/core/features/project-initialization';

export interface CreateOptions {
  projectName?: string;
  template?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  skipDeps?: boolean;
  skipGit?: boolean;
  skipInit?: boolean;
  skipTaskManager?: boolean;
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
      skipTaskManager: options.skipTaskManager,
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

    // Check if template path contains {{projectName}} directory
    // If so, use the contents of that directory, not the directory itself
    let templatePath = template.path;
    const projectNameDir = path.join(template.path, '{{projectName}}');
    if (await fs.pathExists(projectNameDir)) {
      templatePath = projectNameDir;
    }

    const generationResult = await fileGenerator.generateProject({
      outputPath,
      templatePath,
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
        // Ensure @your-org/core is available (link if globally linked, or install)
        const corePackagePath = path.join(outputPath, 'node_modules', '@your-org', 'core');
        if (!await fs.pathExists(corePackagePath)) {
          console.log(chalk.blue('  Linking @your-org/core...'));
          try {
            execSync('npm link @your-org/core', { stdio: 'inherit' });
            console.log(chalk.green('  ✓ Linked @your-org/core'));
          } catch (linkError) {
            console.warn(chalk.yellow('  ⚠ Could not link @your-org/core, trying to continue...'));
            console.warn(chalk.yellow('  Make sure @your-org/core is linked globally: cd packages/core && npm link'));
          }
        }

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
        console.warn(chalk.yellow('  You can run "npm link @your-org/core && npx @your-org/core init" manually later'));
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

    // Step 8: Initialize Task Manager (if not skipped)
    if (!config.skipTaskManager) {
      console.log(chalk.blue('\n📋 Initializing Task Manager...'));

      const originalCwd = process.cwd();
      process.chdir(outputPath);

      try {
        // Check if taskmaster-ai is available (either via task-manager package or directly)
        const taskmasterDir = path.join(outputPath, '.taskmaster');
        
        if (!fs.existsSync(taskmasterDir)) {
          // Try to initialize using taskmaster-ai CLI
          try {
            execSync('npx taskmaster-ai init', { 
              stdio: 'inherit',
              cwd: outputPath 
            });
            console.log(chalk.green('✓ Task Manager initialized'));
          } catch (taskmasterError) {
            // If taskmaster-ai init fails, try installing task-manager package
            console.log(chalk.yellow('⚠ taskmaster-ai not found, installing @your-org/task-manager...'));
            try {
              const installCommand = config.packageManager === 'yarn' 
                ? 'yarn add @your-org/task-manager'
                : config.packageManager === 'pnpm'
                ? 'pnpm add @your-org/task-manager'
                : 'npm install @your-org/task-manager';
              
              execSync(installCommand, { 
                stdio: 'inherit',
                cwd: outputPath 
              });
              // Postinstall script will initialize taskmaster-ai
              console.log(chalk.green('✓ Task Manager installed and initialized'));
            } catch (installError) {
              console.warn(chalk.yellow('⚠ Task Manager initialization skipped'));
              console.warn(chalk.yellow('  Install manually: npm install @your-org/task-manager'));
            }
          }
        } else {
          console.log(chalk.green('✓ Task Manager already initialized'));
        }
      } catch (error) {
        console.warn(chalk.yellow('⚠ Task Manager initialization skipped'));
        console.warn(chalk.yellow('  Install manually: npm install @your-org/task-manager'));
      } finally {
        process.chdir(originalCwd);
      }
    }

    // Step 9: Initialize git (if not skipped)
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

    // Open project in Cursor IDE
    try {
      const projectPath = path.resolve(outputPath);
      
      // Try cursor command first, fallback to code command
      try {
        execSync(`cursor "${projectPath}"`, { stdio: 'ignore' });
        console.log(chalk.green(`\n🚀 Opening project in Cursor IDE...`));
      } catch (cursorError) {
        // Fallback to code command (VS Code, which Cursor is based on)
        try {
          execSync(`code "${projectPath}"`, { stdio: 'ignore' });
          console.log(chalk.green(`\n🚀 Opening project in IDE...`));
        } catch (codeError) {
          // Silently fail if neither command is available
          console.log(chalk.yellow(`\n💡 Tip: Open the project manually with: cursor ${config.projectName}`));
        }
      }
    } catch (error) {
      // Silently fail - opening IDE is optional
      console.log(chalk.yellow(`\n💡 Tip: Open the project manually with: cursor ${config.projectName}`));
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error creating project:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
