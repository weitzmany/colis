/**
 * Package Manager Detector
 * 
 * Detects package manager used in the project by checking lock files.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { PackageManagerInfo } from '../types';

export class PackageManagerDetector {
  /**
   * Detect package manager from project directory
   */
  async detect(projectPath: string): Promise<PackageManagerInfo> {
    const resolvedPath = path.resolve(projectPath);

    // Check for npm
    if (await fs.pathExists(path.join(resolvedPath, 'package-lock.json'))) {
      return {
        name: 'npm',
        type: 'npm',
        version: await this.getNpmVersion(),
        lockFile: 'package-lock.json',
      };
    }

    // Check for yarn
    if (await fs.pathExists(path.join(resolvedPath, 'yarn.lock'))) {
      return {
        name: 'Yarn',
        type: 'yarn',
        version: await this.getYarnVersion(),
        lockFile: 'yarn.lock',
      };
    }

    // Check for pnpm
    if (await fs.pathExists(path.join(resolvedPath, 'pnpm-lock.yaml'))) {
      return {
        name: 'pnpm',
        type: 'pnpm',
        version: await this.getPnpmVersion(),
        lockFile: 'pnpm-lock.yaml',
      };
    }

    // Check for pip (Python)
    if (await fs.pathExists(path.join(resolvedPath, 'requirements.txt'))) {
      return {
        name: 'pip',
        type: 'pip',
        lockFile: 'requirements.txt',
      };
    }

    // Check for composer (PHP)
    if (await fs.pathExists(path.join(resolvedPath, 'composer.json'))) {
      const composerLockPath = path.join(resolvedPath, 'composer.lock');
      return {
        name: 'Composer',
        type: 'composer',
        lockFile: await fs.pathExists(composerLockPath) ? 'composer.lock' : undefined,
      };
    }

    // Check for Maven (Java)
    if (await fs.pathExists(path.join(resolvedPath, 'pom.xml'))) {
      return {
        name: 'Maven',
        type: 'maven',
        lockFile: 'pom.xml',
      };
    }

    // Check for Gradle (Java)
    if (await fs.pathExists(path.join(resolvedPath, 'build.gradle'))) {
      return {
        name: 'Gradle',
        type: 'gradle',
        lockFile: 'build.gradle',
      };
    }

    // Default to npm if package.json exists
    if (await fs.pathExists(path.join(resolvedPath, 'package.json'))) {
      return {
        name: 'npm',
        type: 'npm',
        version: await this.getNpmVersion(),
      };
    }

    // Default fallback
    return {
      name: 'Unknown',
      type: 'npm',
    };
  }

  /**
   * Get npm version
   */
  private async getNpmVersion(): Promise<string | undefined> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('npm --version');
      return stdout.trim();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get yarn version
   */
  private async getYarnVersion(): Promise<string | undefined> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('yarn --version');
      return stdout.trim();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get pnpm version
   */
  private async getPnpmVersion(): Promise<string | undefined> {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('pnpm --version');
      return stdout.trim();
    } catch (error) {
      return undefined;
    }
  }
}




