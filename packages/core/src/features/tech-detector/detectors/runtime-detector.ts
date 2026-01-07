/**
 * Runtime Detector
 * 
 * Detects runtime environment and version requirements.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { RuntimeInfo } from '../types';

export class RuntimeDetector {
  /**
   * Detect runtime from project directory
   */
  async detect(projectPath: string): Promise<RuntimeInfo | null> {
    const resolvedPath = path.resolve(projectPath);

    // Check for Node.js
    const node = await this.detectNode(resolvedPath);
    if (node) return node;

    // Check for Python
    const python = await this.detectPython(resolvedPath);
    if (python) return python;

    // Check for PHP
    const php = await this.detectPhp(resolvedPath);
    if (php) return php;

    // Check for Java
    const java = await this.detectJava(resolvedPath);
    if (java) return java;

    return null;
  }

  /**
   * Detect Node.js runtime
   */
  private async detectNode(projectPath: string): Promise<RuntimeInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!(await fs.pathExists(packageJsonPath))) {
      return null;
    }

    let specifiedVersion: string | undefined;
    let minVersion: string | undefined;

    // Check .nvmrc
    const nvmrcPath = path.join(projectPath, '.nvmrc');
    if (await fs.pathExists(nvmrcPath)) {
      try {
        specifiedVersion = (await fs.readFile(nvmrcPath, 'utf-8')).trim();
        minVersion = specifiedVersion;
      } catch (error) {
        // Ignore read errors
      }
    }

    // Check .node-version
    const nodeVersionPath = path.join(projectPath, '.node-version');
    if (!specifiedVersion && await fs.pathExists(nodeVersionPath)) {
      try {
        specifiedVersion = (await fs.readFile(nodeVersionPath, 'utf-8')).trim();
        minVersion = specifiedVersion;
      } catch (error) {
        // Ignore read errors
      }
    }

    // Check package.json engines field
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const engines = packageJson.engines;
      if (engines?.node) {
        const nodeRequirement = engines.node;
        minVersion = this.extractMinVersion(nodeRequirement);
        if (!specifiedVersion) {
          specifiedVersion = nodeRequirement;
        }
      }
    } catch (error) {
      // Ignore parse errors
    }

    // Get actual Node.js version if available
    let actualVersion: string | undefined;
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('node --version');
      actualVersion = stdout.trim().replace(/^v/, '');
    } catch (error) {
      // Ignore exec errors
    }

    return {
      name: 'Node.js',
      type: 'node',
      version: actualVersion,
      minVersion,
      specifiedVersion,
    };
  }

  /**
   * Detect Python runtime
   */
  private async detectPython(projectPath: string): Promise<RuntimeInfo | null> {
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    const setupPyPath = path.join(projectPath, 'setup.py');
    const pyProjectPath = path.join(projectPath, 'pyproject.toml');
    
    if (!(await fs.pathExists(requirementsPath)) && 
        !(await fs.pathExists(setupPyPath)) && 
        !(await fs.pathExists(pyProjectPath))) {
      return null;
    }

    let specifiedVersion: string | undefined;
    let minVersion: string | undefined;

    // Check .python-version
    const pythonVersionPath = path.join(projectPath, '.python-version');
    if (await fs.pathExists(pythonVersionPath)) {
      try {
        specifiedVersion = (await fs.readFile(pythonVersionPath, 'utf-8')).trim();
        minVersion = specifiedVersion;
      } catch (error) {
        // Ignore read errors
      }
    }

    // Check runtime.txt (for Heroku, etc.)
    const runtimePath = path.join(projectPath, 'runtime.txt');
    if (!specifiedVersion && await fs.pathExists(runtimePath)) {
      try {
        const content = await fs.readFile(runtimePath, 'utf-8');
        const match = content.match(/python-([\d.]+)/i);
        if (match) {
          specifiedVersion = match[1];
          minVersion = specifiedVersion;
        }
      } catch (error) {
        // Ignore read errors
      }
    }

    // Get actual Python version if available
    let actualVersion: string | undefined;
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('python3 --version');
      const match = stdout.match(/Python ([\d.]+)/);
      if (match) {
        actualVersion = match[1];
      }
    } catch (error) {
      // Ignore exec errors
    }

    return {
      name: 'Python',
      type: 'python',
      version: actualVersion,
      minVersion,
      specifiedVersion,
    };
  }

  /**
   * Detect PHP runtime
   */
  private async detectPhp(projectPath: string): Promise<RuntimeInfo | null> {
    const composerPath = path.join(projectPath, 'composer.json');
    if (!(await fs.pathExists(composerPath))) {
      return null;
    }

    let minVersion: string | undefined;
    let specifiedVersion: string | undefined;

    try {
      const composerJson = JSON.parse(await fs.readFile(composerPath, 'utf-8'));
      const phpRequirement = composerJson.require?.php;
      if (phpRequirement) {
        specifiedVersion = phpRequirement;
        minVersion = this.extractMinVersion(phpRequirement);
      }
    } catch (error) {
      // Ignore parse errors
    }

    // Get actual PHP version if available
    let actualVersion: string | undefined;
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('php --version');
      const match = stdout.match(/PHP ([\d.]+)/);
      if (match) {
        actualVersion = match[1];
      }
    } catch (error) {
      // Ignore exec errors
    }

    return {
      name: 'PHP',
      type: 'php',
      version: actualVersion,
      minVersion,
      specifiedVersion,
    };
  }

  /**
   * Detect Java runtime
   */
  private async detectJava(projectPath: string): Promise<RuntimeInfo | null> {
    const pomPath = path.join(projectPath, 'pom.xml');
    const gradlePath = path.join(projectPath, 'build.gradle');
    
    if (!(await fs.pathExists(pomPath)) && !(await fs.pathExists(gradlePath))) {
      return null;
    }

    let minVersion: string | undefined;
    let specifiedVersion: string | undefined;

    // Check pom.xml
    if (await fs.pathExists(pomPath)) {
      try {
        const content = await fs.readFile(pomPath, 'utf-8');
        const javaVersionMatch = content.match(/<java\.version>([\d.]+)<\/java\.version>/i) ||
                                content.match(/<maven\.compiler\.source>([\d.]+)<\/maven\.compiler\.source>/i);
        if (javaVersionMatch) {
          specifiedVersion = javaVersionMatch[1];
          minVersion = specifiedVersion;
        }
      } catch (error) {
        // Ignore read errors
      }
    }

    // Check build.gradle
    if (!specifiedVersion && await fs.pathExists(gradlePath)) {
      try {
        const content = await fs.readFile(gradlePath, 'utf-8');
        const match = content.match(/sourceCompatibility\s*=\s*['"]?([\d.]+)/i);
        if (match) {
          specifiedVersion = match[1];
          minVersion = specifiedVersion;
        }
      } catch (error) {
        // Ignore read errors
      }
    }

    // Get actual Java version if available
    let actualVersion: string | undefined;
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      const { stdout } = await execAsync('java -version 2>&1');
      const match = stdout.match(/version\s+"([\d.]+)/);
      if (match) {
        actualVersion = match[1];
      }
    } catch (error) {
      // Ignore exec errors
    }

    return {
      name: 'Java',
      type: 'java',
      version: actualVersion,
      minVersion,
      specifiedVersion,
    };
  }

  /**
   * Extract minimum version from version requirement string
   */
  private extractMinVersion(requirement: string): string | undefined {
    if (!requirement) return undefined;
    
    // Handle ranges like ">=8.0.0", "^18.0.0", "~20.0.0"
    const match = requirement.match(/(?:>=|^)([\d.]+)/);
    if (match) {
      return match[1];
    }
    
    // Handle exact versions
    const exactMatch = requirement.match(/^([\d.]+)$/);
    if (exactMatch) {
      return exactMatch[1];
    }
    
    return undefined;
  }
}




