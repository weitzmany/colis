/**
 * Create Command
 * 
 * CLI command for creating new projects from templates.
 * 
 * This command orchestrates the entire project creation workflow:
 * 1. Collects user configuration (interactive or via options)
 * 2. Selects and loads the appropriate template
 * 3. Allocates a port via Port Manager (if available)
 * 4. Generates project structure from template
 * 5. Links @colis/rig for Project Initialization
 * 6. Runs Project Initialization (rules, commands, Port Manager, colors)
 * 7. Installs dependencies (if not skipped)
 * 8. Initializes Task Manager (if not skipped)
 * 9. Initializes git repository (if not skipped)
 * 10. Opens project in Cursor IDE
 * 
 * @module
 */

import * as path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { TemplateRegistry } from '../../features/template-engine/template-registry.js';
import { ConfigManager } from '../../features/template-engine/config-manager.js';
import { FileGenerator } from '../../features/template-engine/file-generator.js';
import { ProjectConfig, TemplateContext } from '../../features/template-engine/types.js';
import { initializeProject } from '@colis/rig/features/project-initialization';
import { frameworkCliRegistry, AngularCli } from '../../features/framework-cli/index.js';
import { enforceMonorepoStructure } from '../../utils/monorepo-enforcer.js';

/**
 * Detect the tech stack of an existing project.
 * 
 * @param projectPath - Path to the project directory
 * @returns Detected tech stack information
 */
async function detectTechStack(projectPath: string): Promise<{
  frontend?: string;
  backend?: string;
  mobile?: string;
  hasAngular?: boolean;
  hasReact?: boolean;
  hasVue?: boolean;
  hasSlim?: boolean;
  hasNode?: boolean;
}> {
  const detected: any = {};
  
  // Check for Angular
  const angularJsonPath = path.join(projectPath, 'angular.json');
  const frontendAngularPath = path.join(projectPath, 'frontend', 'angular.json');
  if (await fs.pathExists(angularJsonPath)) {
    detected.hasAngular = true;
    detected.frontend = 'angular';
  } else if (await fs.pathExists(frontendAngularPath)) {
    detected.hasAngular = true;
    detected.frontend = 'angular';
  }
  
  // Check for React (package.json with react dependency)
  const packageJsonPath = path.join(projectPath, 'package.json');
  const frontendPackagePath = path.join(projectPath, 'frontend', 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    if (pkg.dependencies?.react || pkg.devDependencies?.react) {
      detected.hasReact = true;
      detected.frontend = 'react';
    }
  } else if (await fs.pathExists(frontendPackagePath)) {
    const pkg = await fs.readJson(frontendPackagePath);
    if (pkg.dependencies?.react || pkg.devDependencies?.react) {
      detected.hasReact = true;
      detected.frontend = 'react';
    }
  }
  
  // Check for Vue
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
      detected.hasVue = true;
      detected.frontend = 'vue';
    }
  } else if (await fs.pathExists(frontendPackagePath)) {
    const pkg = await fs.readJson(frontendPackagePath);
    if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
      detected.hasVue = true;
      detected.frontend = 'vue';
    }
  }
  
  // Check for Slim (composer.json with slim/slim dependency)
  const composerJsonPath = path.join(projectPath, 'composer.json');
  const backendComposerPath = path.join(projectPath, 'backend', 'composer.json');
  if (await fs.pathExists(composerJsonPath)) {
    const composer = await fs.readJson(composerJsonPath);
    if (composer.require?.['slim/slim']) {
      detected.hasSlim = true;
      detected.backend = 'slim';
    }
  } else if (await fs.pathExists(backendComposerPath)) {
    const composer = await fs.readJson(backendComposerPath);
    if (composer.require?.['slim/slim']) {
      detected.hasSlim = true;
      detected.backend = 'slim';
    }
  }
  
  // Check for Node.js backend
  const backendPackagePath = path.join(projectPath, 'backend', 'package.json');
  if (await fs.pathExists(backendPackagePath)) {
    detected.hasNode = true;
    if (!detected.backend) {
      detected.backend = 'node';
    }
  }
  
  return detected;
}

/**
 * Helper function: Find the core package in node_modules
 */
async function findCorePackage(projectPath: string): Promise<string | null> {
  const possiblePaths = [
    path.join(projectPath, 'node_modules', '@your-org', 'core'),
    path.join(projectPath, 'node_modules', 'core'),
  ];

  for (const possiblePath of possiblePaths) {
    if (await fs.pathExists(possiblePath)) {
      return possiblePath;
    }
  }

  return null;
}

/**
 * Helper function: Check for missing rules
 */
async function checkMissingRules(projectPath: string, corePackagePath: string): Promise<string[]> {
  const missing: string[] = [];
  
  try {
    const sourceRulesPath = path.join(corePackagePath, 'rules');
    const targetRulesPath = path.join(projectPath, '.cursor', 'rules');

    // Check expert personas
    const expertsSource = path.join(sourceRulesPath, 'experts');
    const expertsTarget = path.join(targetRulesPath, 'experts');

    if (await fs.pathExists(expertsSource)) {
      const expertFiles = await fs.readdir(expertsSource);
      for (const file of expertFiles.filter(f => f.endsWith('.mdc'))) {
        const targetFile = path.join(expertsTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`experts/${file}`);
        }
      }
    }

    // Check user rules
    const userSource = path.join(sourceRulesPath, 'user');
    const userTarget = path.join(targetRulesPath, 'user');

    if (await fs.pathExists(userSource)) {
      const userFiles = await fs.readdir(userSource);
      for (const file of userFiles.filter(f => f.endsWith('.mdc'))) {
        const targetFile = path.join(userTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`user/${file}`);
        }
      }
    }
  } catch (error: any) {
    // Ignore errors
  }

  return missing;
}

/**
 * Helper function: Check for missing commands
 */
async function checkMissingCommands(projectPath: string, corePackagePath: string): Promise<string[]> {
  const missing: string[] = [];
  
  try {
    const sourceCommandsPath = path.join(corePackagePath, 'commands');
    const targetCommandsPath = path.join(projectPath, '.cursor', 'commands');

    // Check general commands
    const generalSource = path.join(sourceCommandsPath, 'general');
    const generalTarget = path.join(targetCommandsPath, 'general');

    if (await fs.pathExists(generalSource)) {
      const commandFiles = await fs.readdir(generalSource);
      for (const file of commandFiles.filter(f => f.endsWith('.md'))) {
        const targetFile = path.join(generalTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`general/${file}`);
        }
      }
    }
    
    // Check local commands
    const localSource = path.join(sourceCommandsPath, 'local');
    const localTarget = path.join(targetCommandsPath, 'local');

    if (await fs.pathExists(localSource)) {
      const commandFiles = await fs.readdir(localSource);
      for (const file of commandFiles.filter(f => f.endsWith('.md'))) {
        const targetFile = path.join(localTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`local/${file}`);
        }
      }
    }
  } catch (error: any) {
    // Ignore errors
  }

  return missing;
}

/**
 * Update an existing project with missing configurations.
 * Detects tech stack, verifies ports, copies missing rules and commands.
 * 
 * @param projectPath - Path to the existing project
 */
async function updateExistingProject(
  projectPath: string
): Promise<void> {
  console.log(chalk.blue('🔍 Detecting existing tech stack...'));
  
  const techStack = await detectTechStack(projectPath);
  
  // Show detected tech
  console.log(chalk.green('\n✓ Detected technologies:'));
  if (techStack.frontend) {
    console.log(chalk.blue(`  Frontend: ${techStack.frontend}`));
  }
  if (techStack.backend) {
    console.log(chalk.blue(`  Backend: ${techStack.backend}`));
  }
  if (!techStack.frontend && !techStack.backend) {
    console.log(chalk.yellow('  No recognized frameworks detected'));
  }
  
  // Get project name from directory
  const projectName = path.basename(projectPath);
  
  // Change to project directory
  const originalCwd = process.cwd();
  process.chdir(projectPath);
  
  // Find core package for file verification
  const corePackagePath = await findCorePackage(projectPath);
  
  try {
    // 0. Enforce monorepo structure (remove nested .git directories)
    await enforceMonorepoStructure(projectPath);
    
    // 1. Check and update Port Manager
    console.log(chalk.blue('\n🔧 Checking Port Manager...'));
    const portManagerPath = path.join(projectPath, '.port-manager.json');
    if (!await fs.pathExists(portManagerPath)) {
      console.log(chalk.yellow('  Port Manager not found. Initializing...'));
      try {
        // Determine app type for port allocation
        const appType = techStack.frontend || techStack.backend || 'app';
        const initResult = await initializeProject({
          projectName,
          appType,
          skipRules: true,
          skipCommands: true,
          skipPortManager: false,
          skipColors: true,
        });
        
        if (initResult.portManagerInitialized) {
          console.log(chalk.green('  ✓ Port Manager initialized'));
        } else {
          console.log(chalk.yellow('  ⚠️  Port Manager initialization had warnings'));
        }
      } catch (error) {
        console.warn(chalk.yellow(`  ⚠️  Could not initialize Port Manager: ${error instanceof Error ? error.message : String(error)}`));
      }
    } else {
      console.log(chalk.green('  ✓ Port Manager already configured'));
      const portConfig = await fs.readJson(portManagerPath);
      console.log(chalk.gray(`    Port: ${portConfig.port}`));
    }
    
    // 2. Check and copy missing rules
    console.log(chalk.blue('\n📋 Checking .cursor/rules...'));
    const rulesPath = path.join(projectPath, '.cursor', 'rules');
    
    if (!await fs.pathExists(rulesPath)) {
      console.log(chalk.yellow('  Rules directory not found. Copying all rules...'));
      try {
        const initResult = await initializeProject({
          projectName,
          appType: techStack.frontend || techStack.backend || 'app',
          skipRules: false,
          skipCommands: true,
          skipPortManager: true,
          skipColors: true,
        });
        
        if (initResult.success) {
          console.log(chalk.green('  ✓ Rules copied'));
        }
      } catch (error) {
        console.warn(chalk.yellow(`  ⚠️  Could not copy rules: ${error instanceof Error ? error.message : String(error)}`));
      }
    } else {
      // Directory exists - check for missing files
      const expertFiles = await fs.readdir(path.join(rulesPath, 'experts')).catch(() => []);
      const expertCount = expertFiles.filter(f => f.endsWith('.mdc')).length;
      
      const userFiles = await fs.readdir(path.join(rulesPath, 'user')).catch(() => []);
      const userCount = userFiles.filter(f => f.endsWith('.mdc')).length;
      
      // Check for missing files if we can find the core package
      if (corePackagePath) {
        const missingRules = await checkMissingRules(projectPath, corePackagePath);
        
        if (missingRules.length > 0) {
          console.log(chalk.yellow(`  ⚠️  ${missingRules.length} rules missing`));
          missingRules.forEach(rule => console.log(chalk.gray(`    - ${rule}`)));
          console.log(chalk.yellow('  Copying missing rules...'));
          try {
            const initResult = await initializeProject({
              projectName,
              appType: techStack.frontend || techStack.backend || 'app',
              skipRules: false,
              skipCommands: true,
              skipPortManager: true,
              skipColors: true,
            });
            
            if (initResult.success) {
              console.log(chalk.green('  ✓ Missing rules copied'));
            }
          } catch (error) {
            console.warn(chalk.yellow(`  ⚠️  Could not copy missing rules: ${error instanceof Error ? error.message : String(error)}`));
          }
        } else {
          console.log(chalk.green('  ✓ All rules present'));
          console.log(chalk.gray(`    ${expertCount} expert personas`));
          console.log(chalk.gray(`    ${userCount} user rules`));
        }
      } else {
        // Can't verify - just show what we have
        console.log(chalk.green('  ✓ Rules directory exists'));
        console.log(chalk.gray(`    ${expertCount} expert personas`));
        console.log(chalk.gray(`    ${userCount} user rules`));
        console.log(chalk.gray('    (Unable to verify completeness - core package not found)'));
      }
    }
    
    // 3. Check and copy missing commands
    console.log(chalk.blue('\n⚙️  Checking .cursor/commands...'));
    const commandsPath = path.join(projectPath, '.cursor', 'commands');
    
    if (!await fs.pathExists(commandsPath)) {
      console.log(chalk.yellow('  Commands directory not found. Copying all commands...'));
      try {
        const initResult = await initializeProject({
          projectName,
          appType: techStack.frontend || techStack.backend || 'app',
          skipRules: true,
          skipCommands: false,
          skipPortManager: true,
          skipColors: true,
        });
        
        if (initResult.success) {
          console.log(chalk.green('  ✓ Commands copied'));
        }
      } catch (error) {
        console.warn(chalk.yellow(`  ⚠️  Could not copy commands: ${error instanceof Error ? error.message : String(error)}`));
      }
    } else {
      // Directory exists - check for missing files
      const generalFiles = await fs.readdir(path.join(commandsPath, 'general')).catch(() => []);
      const generalCount = generalFiles.filter(f => f.endsWith('.md')).length;
      
      const localFiles = await fs.readdir(path.join(commandsPath, 'local')).catch(() => []);
      const localCount = localFiles.filter(f => f.endsWith('.md')).length;
      
      // Check for missing files if we can find the core package
      if (corePackagePath) {
        const missingCommands = await checkMissingCommands(projectPath, corePackagePath);
        
        if (missingCommands.length > 0) {
          console.log(chalk.yellow(`  ⚠️  ${missingCommands.length} commands missing`));
          missingCommands.forEach(cmd => console.log(chalk.gray(`    - ${cmd}`)));
          console.log(chalk.yellow('  Copying missing commands...'));
          try {
            const initResult = await initializeProject({
              projectName,
              appType: techStack.frontend || techStack.backend || 'app',
              skipRules: true,
              skipCommands: false,
              skipPortManager: true,
              skipColors: true,
            });
            
            if (initResult.success) {
              console.log(chalk.green('  ✓ Missing commands copied'));
            }
          } catch (error) {
            console.warn(chalk.yellow(`  ⚠️  Could not copy missing commands: ${error instanceof Error ? error.message : String(error)}`));
          }
        } else {
          console.log(chalk.green('  ✓ All commands present'));
          console.log(chalk.gray(`    ${generalCount} general commands`));
          console.log(chalk.gray(`    ${localCount} local commands`));
        }
      } else {
        // Can't verify - just show what we have
        console.log(chalk.green('  ✓ Commands directory exists'));
        console.log(chalk.gray(`    ${generalCount} general commands`));
        console.log(chalk.gray(`    ${localCount} local commands`));
        console.log(chalk.gray('    (Unable to verify completeness - core package not found)'));
      }
    }
    
    // 4. Check and configure IDE colors
    console.log(chalk.blue('\n🎨 Checking IDE colors...'));
    const vscodeSettingsPath = path.join(projectPath, '.vscode', 'settings.json');
    if (!await fs.pathExists(vscodeSettingsPath)) {
      console.log(chalk.yellow('  IDE colors not configured. Setting up...'));
      try {
        const initResult = await initializeProject({
          projectName,
          appType: techStack.frontend || techStack.backend || 'app',
          skipRules: true,
          skipCommands: true,
          skipPortManager: true,
          skipColors: false,
        });
        
        if (initResult.success) {
          console.log(chalk.green('  ✓ IDE colors configured'));
        }
      } catch (error) {
        console.warn(chalk.yellow(`  ⚠️  Could not configure IDE colors: ${error instanceof Error ? error.message : String(error)}`));
      }
    } else {
      const settings = await fs.readJson(vscodeSettingsPath);
      if (settings['workbench.colorCustomizations']) {
        console.log(chalk.green('  ✓ IDE colors already configured'));
      } else {
        console.log(chalk.yellow('  IDE colors not found in settings. Adding...'));
        try {
          const initResult = await initializeProject({
            projectName,
            appType: techStack.frontend || techStack.backend || 'app',
            skipRules: true,
            skipCommands: true,
            skipPortManager: true,
            skipColors: false,
          });
          
          if (initResult.success) {
            console.log(chalk.green('  ✓ IDE colors configured'));
          }
        } catch (error) {
          console.warn(chalk.yellow(`  ⚠️  Could not configure IDE colors: ${error instanceof Error ? error.message : String(error)}`));
        }
      }
    }
    
    console.log(chalk.green('\n✅ Project update complete!'));
    console.log(chalk.gray('\nUpdated:'));
    console.log(chalk.gray('  - Port Manager configuration'));
    console.log(chalk.gray('  - .cursor/rules (expert personas)'));
    console.log(chalk.gray('  - .cursor/commands (Cursor commands)'));
    console.log(chalk.gray('  - IDE colors (.vscode/settings.json)'));
    
  } finally {
    process.chdir(originalCwd);
  }
}

/**
 * Add a new framework to an existing project.
 * User can select frontend, backend, or mobile to add.
 * 
 * @param projectPath - Path to the existing project
 * @param options - Create command options
 */
async function addFrameworkToProject(
  projectPath: string,
  options: CreateOptions
): Promise<void> {
  console.log(chalk.blue('🔍 Detecting existing tech stack...'));
  
  const techStack = await detectTechStack(projectPath);
  
  // Show detected tech
  console.log(chalk.green('\n✓ Current tech stack:'));
  if (techStack.frontend) {
    console.log(chalk.blue(`  Frontend: ${techStack.frontend}`));
  }
  if (techStack.backend) {
    console.log(chalk.blue(`  Backend: ${techStack.backend}`));
  }
  if (!techStack.frontend && !techStack.backend) {
    console.log(chalk.yellow('  No recognized frameworks detected'));
  }
  
  // Ask user what to add
  console.log(chalk.blue('\n➕ What would you like to add?\n'));
  
  const choices: Array<{ name: string; value: string }> = [];
  
  // Frontend options (if no frontend exists)
  if (!techStack.frontend) {
    choices.push({ name: 'Frontend - Angular', value: 'frontend:angular' });
    choices.push({ name: 'Frontend - React', value: 'frontend:react' });
    choices.push({ name: 'Frontend - Vue', value: 'frontend:vue' });
  }
  
  // Backend options (if no backend exists)
  if (!techStack.backend) {
    choices.push({ name: 'Backend - Slim (PHP)', value: 'backend:slim' });
    choices.push({ name: 'Backend - Node.js/Express', value: 'backend:node' });
  }
  
  // Mobile options (always available)
  choices.push({ name: 'Mobile - React Native', value: 'mobile:react-native' });
  choices.push({ name: 'Mobile - Flutter', value: 'mobile:flutter' });
  
  if (choices.length === 0) {
    console.log(chalk.yellow('⚠️  All major frameworks already detected in this project.'));
    console.log(chalk.gray('You can still add frameworks manually or use a different template.'));
    return;
  }
  
  const frameworkAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Select framework to add:',
      choices,
    },
  ]);
  
  const [frameworkType, frameworkName] = frameworkAnswer.framework.split(':');
  
  console.log(chalk.blue(`\n📦 Adding ${frameworkName} ${frameworkType} to project...\n`));
  
  // Get project name
  const projectName = path.basename(projectPath);
  
  // Determine where to place the new framework
  let targetPath: string;
  if (frameworkType === 'frontend' && !techStack.frontend) {
    // If no frontend exists, create in 'frontend' subdirectory
    targetPath = path.join(projectPath, 'frontend');
  } else if (frameworkType === 'backend' && !techStack.backend) {
    // If no backend exists, create in 'backend' subdirectory
    targetPath = path.join(projectPath, 'backend');
  } else if (frameworkType === 'mobile') {
    // Mobile goes in 'mobile' subdirectory
    targetPath = path.join(projectPath, 'mobile');
  } else {
    console.error(chalk.red('❌ Cannot add framework: A similar framework already exists.'));
    return;
  }
  
  await fs.ensureDir(targetPath);
  
  // Use framework CLI or templates to generate the new framework
  const frameworkCli = frameworkCliRegistry.find(frameworkName);
  
  if (frameworkCli && frameworkType === 'frontend') {
    // Use framework CLI for supported frameworks
    console.log(chalk.blue(`Using ${frameworkCli.displayName} CLI...\n`));
    
    const result = await frameworkCli.create({
      projectName: `${projectName}-${frameworkType}`,
      outputPath: targetPath,
      packageManager: options.packageManager || 'npm',
      skipGit: true,
      skipDeps: options.skipDeps || false,
      dryRun: false,
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Framework CLI creation failed');
    }
    
    console.log(chalk.green(`✓ ${frameworkName} ${frameworkType} added successfully`));
  } else {
    // Use template-based generation
    const templateRegistry = new TemplateRegistry();
    const template = await templateRegistry.getTemplate(frameworkName);
    
    if (!template) {
      console.error(chalk.red(`❌ Template "${frameworkName}" not found`));
      return;
    }
    
    const fileGenerator = new FileGenerator();
    const templateContext = {
      projectName: `${projectName}-${frameworkType}`,
      projectDescription: `${frameworkType} for ${projectName}`,
      appType: frameworkName,
      packageManager: options.packageManager || 'npm',
      author: options.author,
      license: options.license || 'MIT',
      version: '1.0.0',
      port: frameworkType === 'backend' ? 8001 : 3000,
    };
    
    // Get template path
    let templatePath = template.path;
    const projectNameDir = path.join(template.path, '{{projectName}}');
    if (await fs.pathExists(projectNameDir)) {
      templatePath = projectNameDir;
    }
    
    const result = await fileGenerator.generateProject({
      outputPath: targetPath,
      templatePath,
      context: templateContext,
      overwrite: false,
      skipExisting: true,
      dryRun: false,
    });
    
    if (!result.success) {
      console.error(chalk.red('\n❌ Failed to add framework:'));
      result.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
      return;
    }
    
    console.log(chalk.green(`✓ Created ${result.filesCreated.length} files`));
  }
  
  // Update root README to include the new framework
  const rootReadmePath = path.join(projectPath, 'README.md');
  if (await fs.pathExists(rootReadmePath)) {
    console.log(chalk.blue('\n📝 Updating root README...'));
    let readme = await fs.readFile(rootReadmePath, 'utf-8');
    
    // Add framework to structure section
    const frameworkInfo = `- \`${frameworkType}/\` - ${frameworkName} ${frameworkType}\n`;
    
    if (readme.includes('## Project Structure')) {
      readme = readme.replace(
        /(## Project Structure\n\n)/,
        `$1${frameworkInfo}`
      );
    } else {
      readme += `\n## Project Structure\n\n${frameworkInfo}`;
    }
    
    await fs.writeFile(rootReadmePath, readme);
    console.log(chalk.green('✓ Updated README.md'));
  }
  
  // Install dependencies if not skipped
  if (!options.skipDeps) {
    console.log(chalk.blue('\n📦 Installing dependencies...'));
    const originalCwd = process.cwd();
    process.chdir(targetPath);
    
    try {
      if (frameworkName === 'slim' || frameworkType === 'backend') {
        // Check for composer.json
        if (await fs.pathExists(path.join(targetPath, 'composer.json'))) {
          execSync('composer install', { stdio: 'inherit' });
          console.log(chalk.green('✓ Dependencies installed'));
        }
      } else {
        // npm/yarn/pnpm for frontend
        const installCommand = options.packageManager === 'yarn' 
          ? 'yarn install'
          : options.packageManager === 'pnpm'
          ? 'pnpm install'
          : 'npm install';
        
        execSync(installCommand, { stdio: 'inherit' });
        console.log(chalk.green('✓ Dependencies installed'));
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Dependency installation failed: ${error instanceof Error ? error.message : String(error)}`));
    } finally {
      process.chdir(originalCwd);
    }
  }
  
  console.log(chalk.green(`\n✅ ${frameworkName} ${frameworkType} added successfully!`));
  console.log(chalk.gray(`\nLocation: ${path.relative(process.cwd(), targetPath)}/`));
  console.log(chalk.blue('\nNext steps:'));
  console.log(chalk.blue(`  cd ${path.relative(process.cwd(), targetPath)}`));
  console.log(chalk.blue(`  Start developing!`));
}

/**
 * Options for the create command.
 * These options can be provided via CLI flags or programmatically.
 * 
 * @example
 * ```typescript
 * await createCommand({
 *   projectName: 'my-app',
 *   template: 'angular',
 *   packageManager: 'npm',
 *   skipDeps: false
 * });
 * ```
 */
export interface CreateOptions {
  /** Project name (will prompt if not provided) */
  projectName?: string;
  /** Template type (default: 'angular') */
  template?: string;
  /** Package manager (default: 'npm') */
  packageManager?: 'npm' | 'yarn' | 'pnpm';
  /** Skip dependency installation */
  skipDeps?: boolean;
  /** Skip git repository initialization */
  skipGit?: boolean;
  /** Skip Project Initialization (not recommended) */
  skipInit?: boolean;
  /** Skip Task Manager initialization */
  skipTaskManager?: boolean;
  /** Overwrite existing files */
  overwrite?: boolean;
  /** Skip existing files instead of overwriting */
  skipExisting?: boolean;
  /** Show what would be created without making changes */
  dryRun?: boolean;
  /** Project description */
  description?: string;
  /** Author name */
  author?: string;
  /** License type (e.g., 'MIT', 'Apache-2.0') */
  license?: string;
  /** Use Angular CLI to generate project (default: true for Angular, false otherwise). Set to false to use templates instead. */
  useNgCli?: boolean;
}

/**
 * Create a new project from a template.
 * 
 * This is the main entry point for project creation. It handles the complete
 * workflow from configuration collection to project generation and initialization.
 * 
 * @param options - Configuration options for project creation
 * @throws {Error} If project creation fails (template not found, file system errors, etc.)
 * 
 * @example
 * ```typescript
 * // Basic usage
 * await createCommand({ projectName: 'my-app' });
 * 
 * // With options
 * await createCommand({
 *   projectName: 'my-app',
 *   template: 'angular',
 *   packageManager: 'pnpm',
 *   skipDeps: true
 * });
 * ```
 */
export async function createCommand(options: CreateOptions = {}): Promise<void> {
  try {
    // Step 0: Verify @colis/rig is available (required for Project Initialization)
    console.log(chalk.blue('🔍 Checking prerequisites...'));
    try {
      // Check if @colis/rig is globally linked
      execSync('npm list -g @colis/rig', { stdio: 'pipe' });
      console.log(chalk.green('✓ @colis/rig is available\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ @colis/rig is not globally linked!'));
      console.error(chalk.yellow('\nProject Initialization requires @colis/rig to be globally linked.'));
      console.error(chalk.yellow('Without it, your project will be missing:'));
      console.error(chalk.gray('  - .cursor/rules/ (expert personas)'));
      console.error(chalk.gray('  - .cursor/commands/ (Cursor commands)'));
      console.error(chalk.gray('  - .githooks/ (git hooks)'));
      console.error(chalk.gray('  - .vscode/settings.json (IDE colors)'));
      console.error(chalk.gray('  - .port-manager.json (port allocation)'));
      console.error(chalk.yellow('\nTo fix this, run:'));
      console.error(chalk.cyan('  cd /path/to/packages/core'));
      console.error(chalk.cyan('  npm link'));
      console.error(chalk.yellow('\nThen try create-project again.'));
      console.error(chalk.yellow('\nOr use --skip-init to create project without initialization (not recommended).'));
      process.exit(1);
    }

    console.log(chalk.blue('🚀 Creating new project...\n'));

    // Step 1: Get project name first (before tech stack questions)
    const configManager = new ConfigManager();
    
    // Ensure projectName is a string if provided
    let projectName: string | undefined = undefined;
    if (options.projectName) {
      if (typeof options.projectName === 'string') {
        projectName = options.projectName.trim();
      } else {
        // If it's not a string, try to convert it
        projectName = String(options.projectName).trim();
      }
    }
    
    // If project name not provided, prompt for it first
    if (!projectName || projectName.length === 0) {
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
      projectName = nameAnswer.projectName.trim();
    }
    
    // Ensure projectName is defined at this point
    if (!projectName) {
      console.error(chalk.red('❌ Project name is required'));
      process.exit(1);
    }

    // Step 2: Check if directory already exists BEFORE asking about tech stack
    let outputPath = path.resolve(process.cwd(), projectName);
    let resolvedProjectName = projectName;

    if (await fs.pathExists(outputPath)) {
      // Only skip if user explicitly passed --skip-existing flag
      const userExplicitlySkipped = options.skipExisting === true;
      
      if (userExplicitlySkipped && !options.overwrite) {
        console.log(chalk.yellow(`⚠ Directory already exists: ${outputPath}`));
        console.log(chalk.yellow('  Skipping project creation'));
        return;
      }
      
      if (options.overwrite) {
        // User explicitly requested overwrite, proceed
        console.log(chalk.yellow(`⚠ Directory already exists: ${outputPath}`));
        console.log(chalk.yellow('  Overwriting existing directory...'));
        try {
          await fs.remove(outputPath);
          console.log(chalk.green(`✓ Deleted existing directory: ${outputPath}`));
        } catch (error: any) {
          console.log(chalk.yellow(`⚠ Attempting alternative deletion method...`));
          try {
            execSync(`rm -rf "${outputPath}"`, { stdio: 'inherit' });
            console.log(chalk.green(`✓ Deleted existing directory: ${outputPath}`));
          } catch (rmError: any) {
            console.error(chalk.red(`❌ Failed to delete directory: ${error.message || rmError.message}`));
            console.error(chalk.red(`   Please delete the directory manually and try again.`));
            process.exit(1);
          }
        }
      } else {
        // Interactive prompt for handling existing directory
        console.log(chalk.yellow(`⚠ Directory already exists: ${outputPath}\n`));
        
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              {
                name: 'Update existing project - Detect tech, verify ports, copy missing rules and commands',
                value: 'update',
              },
              {
                name: 'Add framework - Add another framework (frontend, backend, mobile) to existing project',
                value: 'add-framework',
              },
              {
                name: 'Delete existing directory - Remove the existing directory and create new project',
                value: 'delete',
              },
              {
                name: 'Abort - Cancel project creation',
                value: 'abort',
              },
              {
                name: 'Use a new name - Enter a different project name',
                value: 'new-name',
              },
              {
                name: 'Rename existing directory - Move existing directory to a backup name',
                value: 'rename',
              },
            ],
          },
        ]);

        switch (answer.action) {
          case 'update':
            // Update existing project mode
            console.log(chalk.blue('\n🔄 Updating existing project...\n'));
            await updateExistingProject(outputPath);
            return; // Exit after update

          case 'add-framework':
            // Add framework mode
            console.log(chalk.blue('\n➕ Adding framework to existing project...\n'));
            await addFrameworkToProject(outputPath, options);
            return; // Exit after adding framework

          case 'delete':
            try {
              await fs.remove(outputPath);
              console.log(chalk.green(`✓ Deleted existing directory: ${outputPath}`));
            } catch (error: any) {
              console.log(chalk.yellow(`⚠ Attempting alternative deletion method...`));
              try {
                execSync(`rm -rf "${outputPath}"`, { stdio: 'inherit' });
                console.log(chalk.green(`✓ Deleted existing directory: ${outputPath}`));
              } catch (rmError: any) {
                console.error(chalk.red(`❌ Failed to delete directory: ${error.message || rmError.message}`));
                console.error(chalk.red(`   Please delete the directory manually and try again.`));
                process.exit(1);
              }
            }
            break;

          case 'abort':
            console.log(chalk.yellow('\n❌ Project creation cancelled'));
            process.exit(0);
            break;

          case 'new-name':
            const nameAnswer = await inquirer.prompt([
              {
                type: 'input',
                name: 'newName',
                message: 'Enter new project name:',
                validate: (input: string) => {
                  if (!input || input.trim().length === 0) {
                    return 'Project name is required';
                  }
                  if (!/^[a-z0-9-]+$/i.test(input)) {
                    return 'Project name must contain only letters, numbers, and hyphens';
                  }
                  const newPath = path.resolve(process.cwd(), input.trim());
                  try {
                    if (fs.existsSync(newPath)) {
                      return 'This directory also exists. Please choose a different name.';
                    }
                  } catch {
                    // Ignore errors during validation
                  }
                  return true;
                },
              },
            ]);
            resolvedProjectName = nameAnswer.newName.trim();
            outputPath = path.resolve(process.cwd(), resolvedProjectName);
            console.log(chalk.green(`✓ Using new project name: ${resolvedProjectName}`));
            break;

          case 'rename':
            const renameAnswer = await inquirer.prompt([
              {
                type: 'input',
                name: 'backupName',
                message: 'Enter backup name for existing directory:',
                default: `${resolvedProjectName}-backup-${Date.now()}`,
                validate: (input: string) => {
                  if (!input || input.trim().length === 0) {
                    return 'Backup name is required';
                  }
                  const backupPath = path.resolve(process.cwd(), input.trim());
                  try {
                    if (fs.existsSync(backupPath)) {
                      return 'This directory already exists. Please choose a different backup name.';
                    }
                  } catch {
                    // Ignore errors during validation
                  }
                  return true;
                },
              },
            ]);
            const backupPath = path.resolve(process.cwd(), renameAnswer.backupName.trim());
            await fs.move(outputPath, backupPath);
            console.log(chalk.green(`✓ Renamed existing directory to: ${backupPath}`));
            break;
        }
      }
    }

    // Step 3: Now collect the rest of the configuration (tech stack, etc.)
    const config: ProjectConfig = await configManager.collectConfig({
      projectName: resolvedProjectName,
      templateType: options.template,
      packageManager: options.packageManager,
      skipDeps: options.skipDeps,
      skipGit: options.skipGit,
      skipInit: options.skipInit,
      skipTaskManager: options.skipTaskManager,
      overwrite: options.overwrite,
      skipExisting: options.skipExisting ?? false,
      dryRun: options.dryRun,
      projectDescription: options.description,
      author: options.author,
      license: options.license,
    });

    // Ensure projectName is set and trimmed
    if (config.projectName && typeof config.projectName === 'string') {
      config.projectName = config.projectName.trim();
    }
    
    // Update outputPath in case projectName changed during config collection
    outputPath = path.resolve(process.cwd(), config.projectName);
    
    // Validate configuration
    const validation = configManager.validateConfig(config);
    if (!validation.valid) {
      console.error(chalk.red('❌ Configuration errors:'));
      validation.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
      if (config.projectName) {
        console.error(chalk.yellow(`  Debug: projectName="${config.projectName}" (type: ${typeof config.projectName}, length: ${config.projectName.length})`));
      }
      process.exit(1);
    }

    // Step 4: Select template(s) based on stack selection
    const templateRegistry = new TemplateRegistry();
    
    // Determine template type from stack selection or legacy templateType
    let templateType = config.templateType;
    let useMultipleTemplates = false;
    let frontendTemplate: any = null;
    let backendTemplate: any = null;
    
    if (config.stackSelection) {
      const { frontend, backend } = config.stackSelection;
      
      // If both frontend and backend selected, check if we have a combined template
      // or if we need to generate them separately
      if (frontend !== 'none' && backend !== 'none') {
        // Check if there's a specific full-stack template for this combination
        const fullStackTemplateName = `${frontend}-${backend}`;
        try {
          const fullStackTemplate = await templateRegistry.getTemplate(fullStackTemplateName);
          if (fullStackTemplate) {
            templateType = fullStackTemplateName;
          } else {
            // No combined template, use separate templates
            useMultipleTemplates = true;
            if (frontend) frontendTemplate = await templateRegistry.getTemplate(frontend);
            if (backend) backendTemplate = await templateRegistry.getTemplate(backend);
            templateType = frontend || 'angular'; // For Angular CLI detection
          }
        } catch {
          // Fallback to separate templates
          useMultipleTemplates = true;
          if (frontend) frontendTemplate = await templateRegistry.getTemplate(frontend);
          if (backend) backendTemplate = await templateRegistry.getTemplate(backend);
          templateType = frontend || 'angular'; // For Angular CLI detection
        }
      } else if (frontend !== 'none') {
        templateType = frontend || 'angular';
      } else if (backend !== 'none') {
        templateType = backend || 'slim';
      }
    }
    
    if (!templateType && !useMultipleTemplates) {
      console.error(chalk.red('❌ No template type selected'));
      process.exit(1);
    }
    
    // Ensure templateType is defined
    const resolvedTemplateType = templateType || 'angular';
    
    // Get template(s)
    let template: any = null;
    if (!useMultipleTemplates) {
      template = await templateRegistry.getTemplate(resolvedTemplateType);

      if (!template) {
        console.error(chalk.red(`❌ Template "${resolvedTemplateType}" not found`));
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
    } else {
      console.log(chalk.green(`✓ Creating custom stack:`));
      if (frontendTemplate) console.log(chalk.blue(`  Frontend: ${frontendTemplate.name}`));
      if (backendTemplate) console.log(chalk.blue(`  Backend: ${backendTemplate.name}`));
    }
    // Show stack selection summary
    if (config.stackSelection) {
      const { frontend, backend, mobile } = config.stackSelection;
      const selected: string[] = [];
      if (frontend !== 'none') selected.push(`Frontend: ${frontend}`);
      if (backend !== 'none') selected.push(`Backend: ${backend}`);
      if (mobile && mobile !== 'none') selected.push(`Mobile: ${mobile}`);
      if (selected.length > 0) {
        console.log(chalk.blue(`  Stack: ${selected.join(', ')}`));
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
    allocatedPort = defaultPorts[resolvedTemplateType] || 4200;

    // Step 4.5: Fetch latest framework version (if using framework CLI)
    let frameworkVersions: any;

    if (templateType === 'angular' || config.stackSelection?.frontend === 'angular') {
      const angularCli = new AngularCli();
      frameworkVersions = await angularCli.fetchVersions();
    }

    // Step 5: Generate project structure
    console.log(chalk.blue('\n📁 Generating project structure...'));

    // Track backend port for multi-service projects
    let backendPort = 8001; // Default for PHP/Slim (Port Manager may override during init)

    // Check if using framework CLI (default for supported frameworks)
    const isAngularTemplate = resolvedTemplateType.toLowerCase().includes('angular');
    const isSlimTemplate = resolvedTemplateType.toLowerCase().includes('slim');
    const isFullStackWithAngular = useMultipleTemplates && frontendTemplate && 
                                     frontendTemplate.type === 'angular';
    
    // For Angular: default to CLI unless explicitly disabled
    // For Slim: use CLI by default (composer create-project)
    // For others: only if explicitly enabled
    const shouldUseFrameworkCli = isAngularTemplate || isFullStackWithAngular
      ? (options.useNgCli !== false)
      : isSlimTemplate
      ? true  // Always use Slim CLI (composer create-project)
      : (options.useNgCli === true);
    
    // Try to find a framework CLI for this template
    const frameworkCli = frameworkCliRegistry.find(resolvedTemplateType);
    
    if (shouldUseFrameworkCli && frameworkCli) {
      if (config.dryRun) {
        console.log(chalk.blue(`\n🔍 Dry run - Would use ${frameworkCli.displayName} CLI`));
        if (useMultipleTemplates && backendTemplate) {
          console.log(chalk.blue('  Then would generate backend from template'));
        }
        return;
      }

      try {
        // For full-stack, create framework in a 'frontend' subdirectory
        const frameworkProjectPath = useMultipleTemplates 
          ? path.join(outputPath, 'frontend')
          : outputPath;
        
        // Create output directory first if full-stack
        if (useMultipleTemplates) {
          await fs.ensureDir(outputPath);
        }
        
        // Use framework CLI to create project
        // For full-stack projects, use project name with -ng suffix to identify it as the Angular app
        const angularProjectName = useMultipleTemplates 
          ? `${config.projectName}-ng`
          : config.projectName;
        
        const result = await frameworkCli.create({
          projectName: angularProjectName,
          projectDescription: config.projectDescription,
          outputPath: frameworkProjectPath,
          packageManager: config.packageManager || 'npm',
          skipGit: config.skipGit,
          skipDeps: config.skipDeps,
          dryRun: config.dryRun,
        });
        
        if (!result.success) {
          throw new Error(result.error || 'Framework CLI creation failed');
        }
        
        // Enforce monorepo structure (remove any nested .git directories created by framework CLI)
        await enforceMonorepoStructure(outputPath);
        
        // If full-stack, also generate backend
        if (useMultipleTemplates && backendTemplate) {
          // Check PHP availability for PHP backends (Slim)
          if (backendTemplate.type.toLowerCase().includes('slim') || backendTemplate.type.toLowerCase().includes('php')) {
            const { checkPhp, printPhpInstallInstructions, printPathFixInstructions } = await import('../../features/framework-cli/php-checker.js');
            const phpCheck = checkPhp(true);

            if (!phpCheck.isAvailable) {
              printPhpInstallInstructions();
              throw new Error('PHP is not installed. Cannot create Slim backend. Please install PHP 8.1+ and try again.');
            }

            if (!phpCheck.inPath) {
              if (phpCheck.phpPath) {
                printPathFixInstructions(phpCheck.phpPath);
              }
              throw new Error('PHP is installed but not in PATH. Composer requires PHP in PATH to work. Please fix your PATH and try again.');
            }

            if (!phpCheck.composerAvailable) {
              console.error(chalk.red('\n❌ Composer is not installed'));
              console.error(chalk.yellow('Please install Composer: https://getcomposer.org/'));
              throw new Error('Composer is not installed. Cannot create Slim backend.');
            }
          }

          console.log(chalk.blue('\n📁 Generating backend from template...'));
          
          const backendPath = path.join(outputPath, 'backend');
          await fs.ensureDir(backendPath);
          
          // backendPort is already declared in outer scope
          // Port Manager will allocate actual port during Project Initialization
          
          const fileGenerator = new FileGenerator();
          const backendContext: TemplateContext = {
            projectName: config.projectName,
            projectDescription: config.projectDescription,
            appType: backendTemplate.type,
            packageManager: config.packageManager,
            author: config.author,
            license: config.license,
            version: '1.0.0',
            port: backendPort, // Use Port Manager allocated port
            stackSelection: config.stackSelection,
            frameworkVersions: undefined,
          };
          
          // Check if template path contains {{projectName}} directory
          let backendTemplatePath = backendTemplate.path;
          const backendProjectNameDir = path.join(backendTemplate.path, '{{projectName}}');
          if (await fs.pathExists(backendProjectNameDir)) {
            backendTemplatePath = backendProjectNameDir;
          }
          
          const backendResult = await fileGenerator.generateProject({
            outputPath: backendPath,
            templatePath: backendTemplatePath,
            context: backendContext,
            overwrite: config.overwrite,
            skipExisting: config.skipExisting,
            dryRun: false,
          });
          
          if (!backendResult.success) {
            console.error(chalk.red('\n❌ Failed to generate backend:'));
            backendResult.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
            process.exit(1);
          }
          
          console.log(chalk.green(`✓ Created ${backendResult.filesCreated.length} backend files`));
          
          // Create root README explaining the structure
          const rootReadme = `# ${config.projectName}

${config.projectDescription || 'Full-stack application with Angular frontend and Slim backend'}

## Project Structure

- \`frontend/\` - Angular application (port ${allocatedPort || 4200})
- \`backend/\` - Slim PHP backend (port ${backendPort})

## Getting Started

### Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

### Backend
\`\`\`bash
cd backend
composer install
composer start
\`\`\`

## Development

See individual README files in \`frontend/\` and \`backend/\` directories for more details.
`;
          await fs.writeFile(path.join(outputPath, 'README.md'), rootReadme);
          console.log(chalk.green('✓ Created root README.md'));
          // DEBUG: Confirm backend was created
          console.log(chalk.gray(`  [DEBUG] Backend created with useMultipleTemplates=${useMultipleTemplates}, backendTemplate=${backendTemplate ? backendTemplate.name : 'undefined'}`));
        }
      } catch (error) {
        console.error(chalk.red('\n❌ Failed to create project with Angular CLI:'));
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    } else {
      // Use template-based generation (existing flow)
      const fileGenerator = new FileGenerator();
          const templateContext: TemplateContext = {
            projectName: config.projectName,
            projectDescription: config.projectDescription,
            appType: resolvedTemplateType,
            packageManager: config.packageManager,
            author: config.author,
            license: config.license,
            version: '1.0.0',
            port: allocatedPort,
            // Include stack selection in context for templates
            stackSelection: config.stackSelection,
            // Include framework versions if fetched
            frameworkVersions,
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
    }

    // Step 6: Run Project Initialization (if not skipped)
    if (!config.skipInit) {
      console.log(chalk.blue('\n⚙️  Running Project Initialization...'));

      // Change to project directory  
      const originalCwd = process.cwd();
      process.chdir(outputPath);

      try {
        // Ensure @colis/rig is available (link if globally linked, or install)
        const corePackagePath = path.join(outputPath, 'node_modules', '@colis', 'rig');
        
        if (!await fs.pathExists(corePackagePath)) {
          console.log(chalk.blue('  Linking @colis/rig...'));
          try {
            // For framework CLI full-stack, create a minimal package.json in root first
            if (shouldUseFrameworkCli && useMultipleTemplates) {
              const rootPackageJson = {
                name: config.projectName,
                version: '1.0.0',
                private: true,
                description: config.projectDescription || '',
              };
              await fs.writeJson(path.join(outputPath, 'package.json'), rootPackageJson, { spaces: 2 });
            }
            
            execSync('npm link @colis/rig', { stdio: 'inherit' });
            console.log(chalk.green('  ✓ Linked @colis/rig'));
          } catch (linkError) {
            console.warn(chalk.yellow('  ⚠ Could not link @colis/rig, trying to continue...'));
            console.warn(chalk.yellow('  Make sure @colis/rig is linked globally: cd packages/core && npm link'));
          }
        }

        const initResult = await initializeProject({
          projectName: config.projectName,
          appType: resolvedTemplateType,
          skipRules: false,
          skipCommands: false,
          skipPortManager: false,
          skipColors: false,
        });

        if (!initResult.success) {
          console.error(chalk.red('\n❌ Project Initialization had errors:'));
          initResult.errors.forEach(error => console.error(chalk.red(`  - ${error}`)));
          if (initResult.warnings.length > 0) {
            console.warn(chalk.yellow('\nWarnings:'));
            initResult.warnings.forEach(warning => console.warn(chalk.yellow(`  - ${warning}`)));
          }
          throw new Error('Project Initialization failed. See errors above.');
        }

        // Always show warnings, even if initialization succeeded
        if (initResult.warnings.length > 0) {
          console.warn(chalk.yellow('\n⚠️  Project Initialization warnings:'));
          initResult.warnings.forEach(warning => console.warn(chalk.yellow(`  - ${warning}`)));
          
          // Check if Port Manager failed
          const portManagerWarnings = initResult.warnings.filter(w => w.includes('Port Manager'));
          if (portManagerWarnings.length > 0 && !initResult.portManagerInitialized) {
            console.warn(chalk.yellow('\n⚠️  Port Manager failed to initialize!'));
            console.warn(chalk.yellow('  This means:'));
            console.warn(chalk.yellow('    - No .port-manager.json created'));
            console.warn(chalk.yellow('    - Frontend/backend ports not configured'));
            console.warn(chalk.yellow('    - You may need to configure ports manually'));
            console.warn(chalk.yellow('\n  💡 To fix: npx @colis/rig port-manager init'));
          }
        }

        console.log(chalk.green('✓ Project Initialization completed'));
        
        // Get the allocated port from Port Manager and update Angular config
        console.log(chalk.blue('\n🔧 Configuring ports...'));
        console.log(chalk.gray(`  [DEBUG] Port config start - useMultipleTemplates: ${useMultipleTemplates}, backendTemplate: ${backendTemplate ? 'exists' : 'null'}`));
        try {
          // Read .port-manager.json to get allocated port
          const portManagerConfigPath = path.join(outputPath, '.port-manager.json');
          console.log(chalk.gray(`  [DEBUG] Checking for: ${portManagerConfigPath}`));
          if (await fs.pathExists(portManagerConfigPath)) {
            const portManagerConfig = await fs.readJson(portManagerConfigPath);
            const allocatedPortFromPM = portManagerConfig.port;
            console.log(chalk.gray(`  [DEBUG] Found port-manager.json, port: ${allocatedPortFromPM}`));
            
            if (allocatedPortFromPM) {
              // Update Angular package.json with allocated port
              const angularPackageJsonPath = useMultipleTemplates ?
                                             path.join(outputPath, 'frontend', 'package.json') :
                                             path.join(outputPath, 'package.json');
              
              if (await fs.pathExists(angularPackageJsonPath)) {
                const packageJson = await fs.readJson(angularPackageJsonPath);
                
                // Update start script to use allocated port
                if (packageJson.scripts && packageJson.scripts.start) {
                  packageJson.scripts.start = `ng serve --port ${allocatedPortFromPM}`;
                  await fs.writeJson(angularPackageJsonPath, packageJson, { spaces: 2 });
                  console.log(chalk.green(`  ✓ Frontend configured to use port ${allocatedPortFromPM}`));
                }
              }
              
              // DEBUG: Check backend port allocation conditions
              console.log(chalk.gray(`  [DEBUG] useMultipleTemplates: ${useMultipleTemplates}, backendTemplate: ${backendTemplate ? backendTemplate.name : 'undefined'}`));
              
              // If full-stack, allocate backend port and update config
              if (useMultipleTemplates && backendTemplate) {
                // Allocate a separate port for the backend through Port Manager
                console.log(chalk.blue('  Allocating backend port...'));
                try {
                  // Determine backend app type
                  const backendAppType = backendTemplate.type.toLowerCase().includes('slim') || 
                                          backendTemplate.type.toLowerCase().includes('php') 
                                          ? 'php' 
                                          : backendTemplate.type;
                  
                  // Run Port Manager allocate command for backend
                  const backendProjectName = `${config.projectName}-backend`;
                  const backendPath = path.join(outputPath, 'backend');
                  
                  // Use Port Manager CLI to allocate backend port
                  const allocateCmd = `port-manager allocate -p "${backendProjectName}" -t "${backendAppType}"`;
                  execSync(allocateCmd, { 
                    cwd: backendPath, 
                    stdio: 'inherit'
                  });
                  
                  // Read the allocated backend port from .port-manager.json
                  const backendPortManagerPath = path.join(backendPath, '.port-manager.json');
                  if (await fs.pathExists(backendPortManagerPath)) {
                    const backendPortConfig = await fs.readJson(backendPortManagerPath);
                    backendPort = backendPortConfig.port;
                    console.log(chalk.green(`  ✓ Backend port allocated: ${backendPort}`));
                  }
                } catch (backendPortError) {
                  console.warn(chalk.yellow('  ⚠️  Could not allocate backend port automatically'));
                  console.warn(chalk.gray(`  Using default port ${backendPort}`));
                  console.warn(chalk.gray(`  You can manually allocate with: cd backend && port-manager allocate -p ${config.projectName}-backend -t php`));
                }
                
                const backendEnvPath = path.join(outputPath, 'backend', '.env');
                
                // Create .env for backend with allocated port
                const envContent = `# Backend Configuration
PORT=${backendPort}
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:${allocatedPortFromPM}
`;
                await fs.writeFile(backendEnvPath, envContent);
                console.log(chalk.green(`  ✓ Backend .env configured with port ${backendPort}`));
                
                // Update backend composer.json if it exists (for PHP/Slim)
                const backendComposerPath = path.join(outputPath, 'backend', 'composer.json');
                if (await fs.pathExists(backendComposerPath)) {
                  const composerJson = await fs.readJson(backendComposerPath);
                  if (composerJson.scripts && composerJson.scripts.start) {
                    // Update start script to use allocated backend port
                    composerJson.scripts.start = composerJson.scripts.start.replace(/localhost:\d+/, `localhost:${backendPort}`);
                    await fs.writeJson(backendComposerPath, composerJson, { spaces: 2 });
                    console.log(chalk.green(`  ✓ Backend composer.json configured with port ${backendPort}`));
                  }
                }
              }
            }
          }
        } catch (error) {
          console.warn(chalk.yellow('  ⚠️  Could not configure ports:'));
          console.warn(chalk.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        }
        
        // If using framework CLI with full-stack, move .vscode from frontend to root
        if (shouldUseFrameworkCli && (isAngularTemplate || isFullStackWithAngular) && useMultipleTemplates) {
          console.log(chalk.blue('\n📁 Organizing project structure...'));
          const frontendVscodePath = path.join(outputPath, 'frontend', '.vscode');
          const rootVscodePath = path.join(outputPath, '.vscode');
          
          // Only merge/remove if frontend created .vscode
          if (await fs.pathExists(frontendVscodePath)) {
            // Check if Project Init created root .vscode
            if (await fs.pathExists(rootVscodePath)) {
              // Project Init already created .vscode at root, merge ALL files from frontend's .vscode
              console.log(chalk.gray('  Merging frontend .vscode files...'));
              
              // Get all files from frontend's .vscode
              const frontendVscodeFiles = await fs.readdir(frontendVscodePath);
              
              for (const file of frontendVscodeFiles) {
                const frontendFilePath = path.join(frontendVscodePath, file);
                const rootFilePath = path.join(rootVscodePath, file);
                
                // Special handling for settings.json - merge instead of replace
                if (file === 'settings.json') {
                  if (await fs.pathExists(rootFilePath)) {
                    // Merge both settings files
                    const frontendSettings = await fs.readJson(frontendFilePath);
                    const rootSettings = await fs.readJson(rootFilePath);
                    
                    // Merge (root settings take precedence for IDE colors)
                    const mergedSettings = { ...frontendSettings, ...rootSettings };
                    await fs.writeJson(rootFilePath, mergedSettings, { spaces: 2 });
                    console.log(chalk.gray(`    Merged ${file}`));
                  } else {
                    // No root settings.json, just copy
                    await fs.copy(frontendFilePath, rootFilePath);
                    console.log(chalk.gray(`    Copied ${file}`));
                  }
                } else {
                  // For other files (extensions.json, launch.json, tasks.json, etc.), copy if not exists
                  if (!await fs.pathExists(rootFilePath)) {
                    await fs.copy(frontendFilePath, rootFilePath);
                    console.log(chalk.gray(`    Copied ${file}`));
                  } else {
                    console.log(chalk.gray(`    Kept existing ${file}`));
                  }
                }
              }
              
              // Remove frontend/.vscode since we merged everything
              await fs.remove(frontendVscodePath);
              console.log(chalk.green('  ✓ Merged frontend .vscode into root'));
            } else {
              // No root .vscode, move frontend's to root
              console.log(chalk.gray('  Moving .vscode to project root...'));
              await fs.move(frontendVscodePath, rootVscodePath);
              console.log(chalk.green('  ✓ Moved .vscode to root'));
            }
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠ Project Initialization failed: ${error instanceof Error ? error.message : String(error)}`));
        console.warn(chalk.yellow('  You can run "npm link @colis/rig && npx @colis/rig init" manually later'));
      } finally {
        process.chdir(originalCwd);
      }
    }

    // Determine if framework CLI installed dependencies (for Step 7)
    const frameworkCliInstalledDeps = shouldUseFrameworkCli && !config.skipDeps;

    // Step 7: Install dependencies (if not skipped)
    // For framework CLI projects, framework already installed frontend dependencies,
    // and the root package.json is minimal (no dependencies), so skip npm install
    // to avoid removing the npm link symlink
    if (!config.skipDeps && !frameworkCliInstalledDeps) {
      console.log(chalk.blue('\n📦 Installing dependencies...'));

      const originalCwd = process.cwd();
      process.chdir(outputPath);

      try {
        // Detect project type and install appropriate dependencies
        const hasComposerJson = await fs.pathExists(path.join(outputPath, 'composer.json'));
        const hasPackageJson = await fs.pathExists(path.join(outputPath, 'package.json'));
        
        // Check for full-stack structure with frontend/backend subdirectories
        const hasFrontendDir = await fs.pathExists(path.join(outputPath, 'frontend'));
        const hasBackendDir = await fs.pathExists(path.join(outputPath, 'backend'));
        const isFullStack = hasFrontendDir && hasBackendDir;
        
        if (isFullStack) {
          // Full-stack project with separate frontend/backend directories
          console.log(chalk.gray('  Detected full-stack project structure'));
          
          // Install frontend dependencies (if not already installed by framework CLI)
          if (hasFrontendDir && !frameworkCliInstalledDeps) {
            const frontendPackageJson = path.join(outputPath, 'frontend', 'package.json');
            if (await fs.pathExists(frontendPackageJson)) {
              console.log(chalk.gray('  Installing frontend dependencies...'));
              try {
                const installCommand = config.packageManager === 'yarn' 
                  ? 'yarn install'
                  : config.packageManager === 'pnpm'
                  ? 'pnpm install'
                  : 'npm install';
                
                process.chdir(path.join(outputPath, 'frontend'));
                execSync(installCommand, { stdio: 'inherit' });
                console.log(chalk.green('  ✓ Frontend dependencies installed'));
                process.chdir(outputPath);
              } catch (error) {
                console.warn(chalk.yellow(`  ⚠ Frontend dependency installation failed: ${error instanceof Error ? error.message : String(error)}`));
                process.chdir(outputPath);
              }
            }
          }
          
          // Install backend dependencies
          if (hasBackendDir) {
            const backendComposerJson = path.join(outputPath, 'backend', 'composer.json');
            const backendPackageJson = path.join(outputPath, 'backend', 'package.json');
            
            if (await fs.pathExists(backendComposerJson)) {
              // PHP backend - use composer
              console.log(chalk.gray('  Installing backend dependencies (PHP/Composer)...'));
              try {
                // Check if composer is available
                execSync('composer --version', { stdio: 'ignore' });
                
                process.chdir(path.join(outputPath, 'backend'));
                execSync('composer install', { stdio: 'inherit' });
                console.log(chalk.green('  ✓ Backend dependencies installed'));
                process.chdir(outputPath);
              } catch (composerError) {
                if (composerError instanceof Error && composerError.message.includes('not found')) {
                  console.warn(chalk.yellow('  ⚠ Composer not found. Please install Composer: https://getcomposer.org/'));
                  console.warn(chalk.yellow('    Then run: cd backend && composer install'));
                } else {
                  console.warn(chalk.yellow(`  ⚠ Backend dependency installation failed: ${composerError instanceof Error ? composerError.message : String(composerError)}`));
                }
                process.chdir(outputPath);
              }
            } else if (await fs.pathExists(backendPackageJson)) {
              // Node.js backend - use npm/yarn/pnpm
              console.log(chalk.gray('  Installing backend dependencies (Node.js)...'));
              try {
                const installCommand = config.packageManager === 'yarn' 
                  ? 'yarn install'
                  : config.packageManager === 'pnpm'
                  ? 'pnpm install'
                  : 'npm install';
                
                process.chdir(path.join(outputPath, 'backend'));
                execSync(installCommand, { stdio: 'inherit' });
                console.log(chalk.green('  ✓ Backend dependencies installed'));
                process.chdir(outputPath);
              } catch (error) {
                console.warn(chalk.yellow(`  ⚠ Backend dependency installation failed: ${error instanceof Error ? error.message : String(error)}`));
                process.chdir(outputPath);
              }
            }
          }
        } else if (hasComposerJson) {
          // Single PHP project - use composer
          console.log(chalk.gray('  Detected PHP project (composer.json found)'));
          
          try {
            // Check if composer is available
            execSync('composer --version', { stdio: 'ignore' });
            
            console.log(chalk.gray('  Running: composer install'));
            execSync('composer install', { stdio: 'inherit' });
            console.log(chalk.green('✓ Composer dependencies installed'));
          } catch (composerError) {
            if (composerError instanceof Error && composerError.message.includes('not found')) {
              console.warn(chalk.yellow('⚠ Composer not found. Please install Composer: https://getcomposer.org/'));
              console.warn(chalk.yellow('  Then run: composer install'));
            } else {
              throw composerError;
            }
          }
        } else if (hasPackageJson) {
          // Single Node.js project - use npm/yarn/pnpm
          const installCommand = config.packageManager === 'yarn' 
            ? 'yarn install'
            : config.packageManager === 'pnpm'
            ? 'pnpm install'
            : 'npm install';

          execSync(installCommand, { stdio: 'inherit' });
          console.log(chalk.green('✓ Dependencies installed'));
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠ Dependency installation failed: ${error instanceof Error ? error.message : String(error)}`));
        
        const hasComposerJson = await fs.pathExists(path.join(outputPath, 'composer.json'));
        if (hasComposerJson) {
          console.warn(chalk.yellow('  You can run "composer install" manually later'));
        } else {
          console.warn(chalk.yellow(`  You can run "${config.packageManager} install" manually later`));
        }
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
          // Try to initialize using taskmaster-ai CLI (suppress npm errors)
          try {
            execSync('npx taskmaster-ai init', { 
              stdio: ['ignore', 'inherit', 'pipe'], // Suppress stderr to avoid npm 404 noise
              cwd: outputPath 
            });
            console.log(chalk.green('✓ Task Manager initialized'));
          } catch (taskmasterError: any) {
            // Check if error is due to package not found (404)
            const errorOutput = taskmasterError.stderr?.toString() || taskmasterError.message || '';
            const isNotFoundError = errorOutput.includes('404') || 
                                   errorOutput.includes('Not found') ||
                                   errorOutput.includes('is not in this registry');
            
            if (isNotFoundError) {
              // Package doesn't exist in npm registry - skip silently
              console.log(chalk.gray('  ⊘ Task Manager skipped (package not available in npm registry)'));
            } else {
              // Other errors - try installing task-manager package
              console.log(chalk.yellow('⚠ taskmaster-ai not found, trying @your-org/task-manager...'));
              try {
                const installCommand = config.packageManager === 'yarn' 
                  ? 'yarn add @your-org/task-manager'
                  : config.packageManager === 'pnpm'
                  ? 'pnpm add @your-org/task-manager'
                  : 'npm install @your-org/task-manager';
                
                execSync(installCommand, { 
                  stdio: ['ignore', 'inherit', 'pipe'], // Suppress stderr
                  cwd: outputPath 
                });
                // Postinstall script will initialize taskmaster-ai
                console.log(chalk.green('✓ Task Manager installed and initialized'));
              } catch (installError: any) {
                const installErrorOutput = installError.stderr?.toString() || installError.message || '';
                if (installErrorOutput.includes('404') || installErrorOutput.includes('Not found')) {
                  // Package doesn't exist - skip silently
                  console.log(chalk.gray('  ⊘ Task Manager skipped (package not available in npm registry)'));
                } else {
                  console.warn(chalk.yellow('⚠ Task Manager initialization skipped'));
                  console.warn(chalk.yellow('  Install manually: npm install @your-org/task-manager'));
                }
              }
            }
          }
        } else {
          console.log(chalk.green('✓ Task Manager already initialized'));
        }
      } catch (error) {
        // Silent skip - Task Manager is optional
        console.log(chalk.gray('  ⊘ Task Manager skipped'));
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
    
    // Step 9: Verify setup (check all fixes are working)
    console.log(chalk.blue('\n🔍 Verifying project setup...'));
    const verificationResults: Array<{ check: string; passed: boolean; details?: string }> = [];
    
    try {
      // Check .cursor/rules/
      const cursorRulesPath = path.join(outputPath, '.cursor', 'rules');
      const hasRules = await fs.pathExists(cursorRulesPath);
      if (hasRules) {
        const expertFiles = (await fs.readdir(path.join(cursorRulesPath, 'experts'))).filter(f => f.endsWith('.mdc'));
        verificationResults.push({ 
          check: '.cursor/rules/', 
          passed: true, 
          details: `${expertFiles.length} expert personas` 
        });
      } else {
        verificationResults.push({ check: '.cursor/rules/', passed: false });
      }
      
      // Check .cursor/commands/
      const cursorCommandsPath = path.join(outputPath, '.cursor', 'commands', 'general');
      const hasCommands = await fs.pathExists(cursorCommandsPath);
      if (hasCommands) {
        const commandFiles = (await fs.readdir(cursorCommandsPath)).filter(f => f.endsWith('.md'));
        verificationResults.push({ 
          check: '.cursor/commands/', 
          passed: true, 
          details: `${commandFiles.length} commands` 
        });
      } else {
        verificationResults.push({ check: '.cursor/commands/', passed: false });
      }
      
      // Check .githooks/
      const githooksPath = path.join(outputPath, '.githooks', 'post-checkout');
      const hasGithooks = await fs.pathExists(githooksPath);
      verificationResults.push({ 
        check: '.githooks/', 
        passed: hasGithooks,
        details: hasGithooks ? 'Branch-based colors enabled' : undefined
      });
      
      // Check .port-manager.json
      const portManagerPath = path.join(outputPath, '.port-manager.json');
      const hasPortManager = await fs.pathExists(portManagerPath);
      if (hasPortManager) {
        const portConfig = await fs.readJson(portManagerPath);
        verificationResults.push({ 
          check: '.port-manager.json', 
          passed: true, 
          details: `Port ${portConfig.port}` 
        });
      } else {
        verificationResults.push({ check: '.port-manager.json', passed: false });
      }
      
      // Check .vscode/settings.json (with IDE colors)
      const vscodeSettingsPath = path.join(outputPath, '.vscode', 'settings.json');
      const hasVscodeSettings = await fs.pathExists(vscodeSettingsPath);
      if (hasVscodeSettings) {
        const settings = await fs.readJson(vscodeSettingsPath);
        const hasColors = settings['workbench.colorCustomizations'] !== undefined;
        verificationResults.push({ 
          check: '.vscode/settings.json', 
          passed: true, 
          details: hasColors ? 'IDE colors configured' : 'No colors' 
        });
      } else {
        verificationResults.push({ check: '.vscode/settings.json', passed: false });
      }
      
      // Check framework CLI .vscode files (extensions, launch, tasks, mcp)
      if (shouldUseFrameworkCli) {
        const vscodeFiles = ['extensions.json', 'launch.json', 'tasks.json', 'mcp.json'];
        const existingFiles = [];
        for (const file of vscodeFiles) {
          if (await fs.pathExists(path.join(outputPath, '.vscode', file))) {
            existingFiles.push(file);
          }
        }
        verificationResults.push({ 
          check: '.vscode/ Angular files', 
          passed: existingFiles.length > 0, 
          details: existingFiles.length > 0 ? existingFiles.join(', ') : 'Missing' 
        });
      }
      
      // Check port configuration in package.json
      if (shouldUseFrameworkCli) {
        const angularPackageJsonPath = useMultipleTemplates ?
                                       path.join(outputPath, 'frontend', 'package.json') :
                                       path.join(outputPath, 'package.json');
        if (await fs.pathExists(angularPackageJsonPath)) {
          const packageJson = await fs.readJson(angularPackageJsonPath);
          const startScript = packageJson.scripts?.start || '';
          const hasPort = startScript.includes('--port');
          verificationResults.push({ 
            check: 'Frontend port configured', 
            passed: hasPort, 
            details: hasPort ? startScript : 'Not configured' 
          });
        }
      }
      
      // Check backend .env
      if (useMultipleTemplates && backendTemplate) {
        const backendEnvPath = path.join(outputPath, 'backend', '.env');
        const hasBackendEnv = await fs.pathExists(backendEnvPath);
        if (hasBackendEnv) {
          const envContent = await fs.readFile(backendEnvPath, 'utf-8');
          const portMatch = envContent.match(/PORT=(\d+)/);
          verificationResults.push({ 
            check: 'Backend port configured', 
            passed: !!portMatch, 
            details: portMatch ? `PORT=${portMatch[1]}` : 'Not configured' 
          });
        } else {
          verificationResults.push({ check: 'Backend .env', passed: false });
        }
      }
      
      // Check root package.json (for full-stack)
      if (useMultipleTemplates) {
        const rootPackageJsonPath = path.join(outputPath, 'package.json');
        const hasRootPackageJson = await fs.pathExists(rootPackageJsonPath);
        verificationResults.push({ 
          check: 'Root package.json', 
          passed: hasRootPackageJson,
          details: hasRootPackageJson ? 'Created for npm link' : 'Missing'
        });
      }
      
      // Display results
      const allPassed = verificationResults.every(r => r.passed);
      const passedCount = verificationResults.filter(r => r.passed).length;
      const totalCount = verificationResults.length;
      
      console.log('');
      verificationResults.forEach(result => {
        const icon = result.passed ? chalk.green('✓') : chalk.red('✗');
        const status = result.passed ? chalk.green('PASS') : chalk.red('FAIL');
        const details = result.details ? chalk.gray(` - ${result.details}`) : '';
        console.log(`  ${icon} ${status} ${result.check}${details}`);
      });
      
      console.log('');
      if (allPassed) {
        console.log(chalk.green(`✅ All checks passed! (${passedCount}/${totalCount})`));
      } else {
        console.log(chalk.yellow(`⚠️  ${passedCount}/${totalCount} checks passed`));
        console.log(chalk.yellow('Some features may not be available. Check the failures above.'));
      }
    } catch (verifyError) {
      console.warn(chalk.yellow('⚠️  Could not verify setup'));
    }
    
    // Create initial git commit
    try {
      // Check if we're in a git repository
      try {
        execSync('git rev-parse --git-dir', { cwd: outputPath, stdio: 'ignore' });
        
        // Check if there are any changes to commit
        const status = execSync('git status --porcelain', { cwd: outputPath, encoding: 'utf-8' });
        if (status.trim()) {
          // Stage all files
          execSync('git add .', { cwd: outputPath, stdio: 'ignore' });
          // Create commit
          execSync('git commit -m "feat: initial project setup"', { cwd: outputPath, stdio: 'ignore' });
          console.log(chalk.green('\n📝 Created initial commit'));
        }
      } catch (gitError) {
        // Not a git repo or no changes, skip commit
      }
    } catch (error) {
      // Silently fail - committing is optional
      console.log(chalk.yellow(`\n⚠️  Could not create initial commit`));
    }
    
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
