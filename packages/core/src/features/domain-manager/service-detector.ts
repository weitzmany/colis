/**
 * Service Detector for Domain Manager
 * 
 * Lightweight service detection focused on domain setup needs.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface DetectedService {
  name: string; // 'frontend', 'backend', 'root'
  path: string; // Relative path
  type: 'angular' | 'react' | 'php' | 'node' | 'unknown';
  detectedPort?: number; // Port found in code/config
}

export class ServiceDetector {
  /**
   * Detect services in a project
   */
  async detectServices(projectPath: string): Promise<DetectedService[]> {
    const services: DetectedService[] = [];
    const resolvedPath = path.resolve(projectPath);

    // Check for frontend directory
    const frontendPath = path.join(resolvedPath, 'frontend');
    const webPath = path.join(resolvedPath, 'web');
    
    if (await fs.pathExists(frontendPath)) {
      const frontendType = await this.detectFrontendType(frontendPath);
      services.push({
        name: 'frontend',
        path: 'frontend',
        type: frontendType,
        detectedPort: await this.detectPort(frontendPath, frontendType),
      });
    } else if (await fs.pathExists(webPath)) {
      const webType = await this.detectFrontendType(webPath);
      services.push({
        name: 'frontend',
        path: 'web',
        type: webType,
        detectedPort: await this.detectPort(webPath, webType),
      });
    }

    // Check for backend directory
    const backendPath = path.join(resolvedPath, 'backend');
    const apiPath = path.join(resolvedPath, 'api');
    
    if (await fs.pathExists(backendPath)) {
      const backendType = await this.detectBackendType(backendPath);
      services.push({
        name: 'backend',
        path: 'backend',
        type: backendType,
        detectedPort: await this.detectPort(backendPath, backendType),
      });
    } else if (await fs.pathExists(apiPath)) {
      const apiType = await this.detectBackendType(apiPath);
      services.push({
        name: 'backend',
        path: 'api',
        type: apiType,
        detectedPort: await this.detectPort(apiPath, apiType),
      });
    }

    // Check root level
    const rootType = await this.detectRootType(resolvedPath);
    if (rootType !== 'unknown') {
      services.push({
        name: 'root',
        path: '.',
        type: rootType,
        detectedPort: await this.detectPort(resolvedPath, rootType),
      });
    }

    return services;
  }

  /**
   * Detect frontend type (Angular, React, etc.)
   */
  private async detectFrontendType(dirPath: string): Promise<'angular' | 'react' | 'unknown'> {
    // Check for Angular
    if (await fs.pathExists(path.join(dirPath, 'angular.json'))) {
      return 'angular';
    }

    // Check for React
    const packageJsonPath = path.join(dirPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
          return 'react';
        }
      } catch (error) {
        // Ignore
      }
    }

    return 'unknown';
  }

  /**
   * Detect backend type (PHP, Node, etc.)
   */
  private async detectBackendType(dirPath: string): Promise<'php' | 'node' | 'unknown'> {
    // Check for PHP
    if (await fs.pathExists(path.join(dirPath, 'composer.json'))) {
      return 'php';
    }

    // Check for Node
    if (await fs.pathExists(path.join(dirPath, 'package.json'))) {
      return 'node';
    }

    return 'unknown';
  }

  /**
   * Detect root type
   */
  private async detectRootType(dirPath: string): Promise<'angular' | 'react' | 'php' | 'node' | 'unknown'> {
    // Check for Angular
    if (await fs.pathExists(path.join(dirPath, 'angular.json'))) {
      return 'angular';
    }

    // Check for PHP
    if (await fs.pathExists(path.join(dirPath, 'composer.json'))) {
      return 'php';
    }

    // Check for Node/React
    const packageJsonPath = path.join(dirPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
          return 'react';
        }
        return 'node';
      } catch (error) {
        // Ignore
      }
    }

    return 'unknown';
  }

  /**
   * Detect port from common config files
   */
  private async detectPort(dirPath: string, type: string): Promise<number | undefined> {
    // Check angular.json for Angular
    if (type === 'angular') {
      const angularJsonPath = path.join(dirPath, 'angular.json');
      if (await fs.pathExists(angularJsonPath)) {
        try {
          const angularJson = JSON.parse(await fs.readFile(angularJsonPath, 'utf-8'));
          const port = angularJson.projects?.[Object.keys(angularJson.projects)[0]]?.architect?.serve?.options?.port;
          if (port) return port;
        } catch (error) {
          // Ignore
        }
      }
    }

    // Check package.json scripts for port
    const packageJsonPath = path.join(dirPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const scripts = packageJson.scripts || {};
        for (const script of Object.values(scripts)) {
          if (typeof script === 'string') {
            const portMatch = script.match(/--port\s+(\d+)/);
            if (portMatch) {
              return parseInt(portMatch[1]);
            }
          }
        }
      } catch (error) {
        // Ignore
      }
    }

    // Check .env files
    const envFiles = ['.env', '.env.local', '.env.development'];
    for (const envFile of envFiles) {
      const envPath = path.join(dirPath, envFile);
      if (await fs.pathExists(envPath)) {
        try {
          const content = await fs.readFile(envPath, 'utf-8');
          const portMatch = content.match(/PORT\s*=\s*(\d+)/i);
          if (portMatch) {
            return parseInt(portMatch[1]);
          }
        } catch (error) {
          // Ignore
        }
      }
    }

    return undefined;
  }
}

