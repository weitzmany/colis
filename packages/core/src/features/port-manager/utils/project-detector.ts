/**
 * Framework Detector
 * 
 * Detects the framework type of a project by examining its files.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { AppType } from '../types.js';

export class FrameworkDetector {
  /**
   * Detect framework type from project directory
   */
  async detect(projectPath: string): Promise<AppType | null> {
    const resolvedPath = path.resolve(projectPath);

    // Check for Next.js
    if (await this.isNextJs(resolvedPath)) {
      return 'nextjs';
    }

    // Check for Angular
    if (await this.isAngular(resolvedPath)) {
      return 'angular';
    }

    // Check for React
    if (await this.isReact(resolvedPath)) {
      return 'react';
    }

    // Check for Docker
    if (await this.isDocker(resolvedPath)) {
      return 'docker';
    }

    // Check for Python
    if (await this.isPython(resolvedPath)) {
      return 'python';
    }

    // Check for PHP
    if (await this.isPhp(resolvedPath)) {
      return 'php';
    }

    // Default to Node.js
    if (await this.isNode(resolvedPath)) {
      return 'node';
    }

    return null;
  }

  /**
   * Check if project is Next.js
   */
  private async isNextJs(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return (
        packageJson.dependencies?.next !== undefined ||
        packageJson.devDependencies?.next !== undefined
      );
    }
    return false;
  }

  /**
   * Check if project is Angular
   */
  private async isAngular(projectPath: string): Promise<boolean> {
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

  /**
   * Check if project is React
   */
  private async isReact(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return (
        packageJson.dependencies?.react !== undefined ||
        packageJson.devDependencies?.react !== undefined
      );
    }
    return false;
  }

  /**
   * Check if project uses Docker
   */
  private async isDocker(projectPath: string): Promise<boolean> {
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    const dockerfilePath = path.join(projectPath, 'Dockerfile');
    return (
      (await fs.pathExists(dockerComposePath)) || (await fs.pathExists(dockerfilePath))
    );
  }

  /**
   * Check if project is Python
   */
  private async isPython(projectPath: string): Promise<boolean> {
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    const setupPyPath = path.join(projectPath, 'setup.py');
    const pyProjectPath = path.join(projectPath, 'pyproject.toml');
    return (
      (await fs.pathExists(requirementsPath)) ||
      (await fs.pathExists(setupPyPath)) ||
      (await fs.pathExists(pyProjectPath))
    );
  }

  /**
   * Check if project is PHP
   */
  private async isPhp(projectPath: string): Promise<boolean> {
    const composerPath = path.join(projectPath, 'composer.json');
    return await fs.pathExists(composerPath);
  }

  /**
   * Check if project is Node.js
   */
  private async isNode(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    return await fs.pathExists(packageJsonPath);
  }
}




