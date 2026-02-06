/**
 * Angular CLI Integration
 * 
 * Handles project creation using the official Angular CLI.
 */

import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { FrameworkCli, FrameworkCliOptions, FrameworkCliResult, FrameworkVersions } from './types.js';
import { getLatestAngularVersion, getAngularEcosystemVersions } from '../../utils/npm-version-fetcher.js';

/**
 * Angular CLI implementation
 */
export class AngularCli implements FrameworkCli {
  name = 'angular';
  displayName = 'Angular';
  
  /**
   * Check if Angular CLI should be used for this template
   */
  shouldUse(templateType: string): boolean {
    return templateType.toLowerCase().includes('angular');
  }
  
  /**
   * Fetch latest Angular version and ecosystem versions
   */
  async fetchVersions(): Promise<FrameworkVersions | undefined> {
    try {
      console.log(chalk.blue('\n🔍 Fetching latest Angular version...'));
      const latestAngular = await getLatestAngularVersion();
      const ecosystemVersions = await getAngularEcosystemVersions(latestAngular);
      
      console.log(chalk.green(`✓ Using Angular ${ecosystemVersions.angular}`));
      
      return {
        framework: 'angular',
        version: ecosystemVersions.angular,
        ecosystem: {
          typescript: ecosystemVersions.typescript,
          node: ecosystemVersions.node,
          rxjs: ecosystemVersions.rxjs,
          tslib: ecosystemVersions.tslib,
          zoneJs: ecosystemVersions.zoneJs,
        },
      };
    } catch (error) {
      console.warn(chalk.yellow('⚠ Could not fetch latest Angular version, using template defaults'));
      return undefined;
    }
  }
  
  /**
   * Create a project using Angular CLI
   */
  async create(options: FrameworkCliOptions): Promise<FrameworkCliResult> {
    const {
      projectName,
      outputPath,
      packageManager,
      skipGit = false,
      skipDeps = false,
      dryRun = false,
    } = options;
    
    console.log(chalk.blue('🅰️  Using Angular CLI to generate Angular frontend...'));
    
    // Dry run
    if (dryRun) {
      console.log(chalk.blue('\n🔍 Dry run - Would run Angular CLI:'));
      console.log(chalk.green(`  ng new ${projectName} --package-manager=${packageManager} --skip-git=${skipGit}`));
      return {
        success: true,
        outputPath,
        framework: 'angular',
        depsInstalled: false,
      };
    }
    
    try {
      // Build Angular CLI command
      const packageManagerFlag = packageManager || 'npm';
      // Always skip git in Angular CLI since we're in a monorepo
      // Git initialization is handled at the project root level
      const skipGitFlag = '--skip-git';
      const skipInstallFlag = skipDeps ? '--skip-install' : '';
      
      const parentDir = path.dirname(outputPath);
      
      // Ensure parent directory exists
      await fs.ensureDir(parentDir);
      
      const ngCommand = [
        'npx',
        '@angular/cli@latest',
        'new',
        projectName,
        `--package-manager=${packageManagerFlag}`,
        skipGitFlag,
        skipInstallFlag,
      ].filter(Boolean).join(' ');
      
      console.log(chalk.gray(`  Running: ${ngCommand}`));
      
      // Run Angular CLI
      execSync(ngCommand, {
        cwd: parentDir,
        stdio: 'inherit',
      });
      
      // If the project name differs from the target directory name, rename it
      const generatedPath = path.join(parentDir, projectName);
      if (generatedPath !== outputPath && await fs.pathExists(generatedPath)) {
        console.log(chalk.blue(`  Renaming ${projectName}/ to ${path.basename(outputPath)}/`));
        await fs.move(generatedPath, outputPath, { overwrite: true });
      }
      
      console.log(chalk.green('✓ Angular frontend created with Angular CLI'));
      
      return {
        success: true,
        outputPath,
        framework: 'angular',
        depsInstalled: !skipDeps,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red('\n❌ Failed to create project with Angular CLI:'));
      console.error(chalk.red(errorMessage));
      
      return {
        success: false,
        outputPath,
        framework: 'angular',
        depsInstalled: false,
        error: errorMessage,
      };
    }
  }
  
  /**
   * Update Angular configuration files with custom settings
   */
  async updateConfig(outputPath: string, config: {
    port?: number;
    additionalSettings?: Record<string, any>;
  }): Promise<void> {
    if (config.port) {
      // Update package.json with port
      const packageJsonPath = path.join(outputPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        
        // Update start script with port
        if (packageJson.scripts?.start) {
          packageJson.scripts.start = `ng serve --port ${config.port}`;
        }
        
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
      
      // Update angular.json with port
      const angularJsonPath = path.join(outputPath, 'angular.json');
      if (await fs.pathExists(angularJsonPath)) {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update port in serve options
        if (angularJson.projects) {
          for (const projectName of Object.keys(angularJson.projects)) {
            const project = angularJson.projects[projectName];
            if (project.architect?.serve?.options) {
              project.architect.serve.options.port = config.port;
            }
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
      }
    }
  }
}
