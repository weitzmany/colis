/**
 * Angular Framework Handler
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FrameworkHandler } from './interfaces.js';
import { ConfigurationResult } from '../types.js';

export class AngularHandler implements FrameworkHandler {
  getName(): string {
    return 'angular';
  }

  async detect(projectPath: string): Promise<boolean> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (await fs.pathExists(angularJsonPath)) {
      return true;
    }
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return (
        packageJson.dependencies?.['@angular/core'] !== undefined ||
        packageJson.devDependencies?.['@angular/core'] !== undefined
      );
    }
    return false;
  }

  async updateConfig(projectPath: string, port: number): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (!(await fs.pathExists(angularJsonPath))) {
      result.errors.push('angular.json not found');
      return result;
    }

    try {
      const angularJson = JSON.parse(await fs.readFile(angularJsonPath, 'utf-8'));
      if (angularJson.projects) {
        for (const projectName of Object.keys(angularJson.projects)) {
          const project = angularJson.projects[projectName];
          if (project.architect?.serve?.options) {
            project.architect.serve.options.port = port;
          }
        }
        await fs.writeFile(angularJsonPath, JSON.stringify(angularJson, null, 2), 'utf-8');
        result.filesUpdated.push('angular.json');
      }
    } catch (error) {
      result.errors.push(`Failed to update angular.json: ${error}`);
    }

    // Update package.json to display domain URL if domain is configured
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        
        // Check if domain is configured
        const portManagerPath = path.join(projectPath, '.port-manager.json');
        if (await fs.pathExists(portManagerPath)) {
          const portManagerConfig = JSON.parse(await fs.readFile(portManagerPath, 'utf-8'));
          if (portManagerConfig.domain) {
            // Update start script to show domain URL
            const domain = portManagerConfig.domain;
            const originalStart = packageJson.scripts?.start || `ng serve --port ${port}`;
            
            // Wrap ng serve with a script that displays the domain URL
            packageJson.scripts.start = `${originalStart} & echo "" && echo "  ➜ Domain: http://${domain}/" && wait`;
            
            await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
            result.filesUpdated.push('package.json');
          }
        }
      }
    } catch (error) {
      // Non-critical error - domain display is optional
      result.errors.push(`Warning: Could not update package.json for domain display: ${error}`);
    }

    return result;
  }

  getDefaultPort(): number {
    return 4200;
  }

  async validateConfig(projectPath: string, port: number): Promise<boolean> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (!(await fs.pathExists(angularJsonPath))) {
      return false;
    }

    try {
      const angularJson = JSON.parse(await fs.readFile(angularJsonPath, 'utf-8'));
      if (angularJson.projects) {
        for (const projectName of Object.keys(angularJson.projects)) {
          const project = angularJson.projects[projectName];
          if (project.architect?.serve?.options?.port === port) {
            return true;
          }
        }
      }
    } catch (error) {
      return false;
    }

    return false;
  }
}




