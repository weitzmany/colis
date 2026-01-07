/**
 * Framework Detector
 * 
 * Detects framework type and version by examining project files.
 * Extends the existing FrameworkDetector from Port Manager.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FrameworkInfo } from '../types';

export class FrameworkDetector {
  /**
   * Detect framework from project directory
   */
  async detect(projectPath: string): Promise<FrameworkInfo | null> {
    const resolvedPath = path.resolve(projectPath);

    // Check for Next.js
    const nextjs = await this.detectNextJs(resolvedPath);
    if (nextjs) return nextjs;

    // Check for Angular
    const angular = await this.detectAngular(resolvedPath);
    if (angular) return angular;

    // Check for Vue
    const vue = await this.detectVue(resolvedPath);
    if (vue) return vue;

    // Check for Svelte
    const svelte = await this.detectSvelte(resolvedPath);
    if (svelte) return svelte;

    // Check for React
    const react = await this.detectReact(resolvedPath);
    if (react) return react;

    // Check for Express
    const express = await this.detectExpress(resolvedPath);
    if (express) return express;

    // Check for Django
    const django = await this.detectDjango(resolvedPath);
    if (django) return django;

    // Check for Laravel
    const laravel = await this.detectLaravel(resolvedPath);
    if (laravel) return laravel;

    // Check for Flask
    const flask = await this.detectFlask(resolvedPath);
    if (flask) return flask;

    return null;
  }

  /**
   * Detect Next.js
   */
  private async detectNextJs(projectPath: string): Promise<FrameworkInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next;
        if (nextVersion) {
          return {
            name: 'Next.js',
            type: 'nextjs',
            version: this.extractVersion(nextVersion),
            configFile: (await fs.pathExists(path.join(projectPath, 'next.config.js'))) 
              ? 'next.config.js' 
              : (await fs.pathExists(path.join(projectPath, 'next.config.ts'))) 
                ? 'next.config.ts' 
                : undefined,
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Angular
   */
  private async detectAngular(projectPath: string): Promise<FrameworkInfo | null> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (await fs.pathExists(angularJsonPath)) {
      const packageJsonPath = path.join(projectPath, 'package.json');
      let version: string | undefined;
      if (await fs.pathExists(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
          version = this.extractVersion(
            packageJson.dependencies?.['@angular/core'] || 
            packageJson.devDependencies?.['@angular/core']
          );
        } catch (error) {
          // Ignore parse errors
        }
      }
      return {
        name: 'Angular',
        type: 'angular',
        version,
        configFile: 'angular.json',
      };
    }
    
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const angularCore = packageJson.dependencies?.['@angular/core'] || 
                           packageJson.devDependencies?.['@angular/core'];
        if (angularCore) {
          return {
            name: 'Angular',
            type: 'angular',
            version: this.extractVersion(angularCore),
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Vue
   */
  private async detectVue(projectPath: string): Promise<FrameworkInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const vueVersion = packageJson.dependencies?.vue || packageJson.devDependencies?.vue;
        if (vueVersion) {
          return {
            name: 'Vue',
            type: 'vue',
            version: this.extractVersion(vueVersion),
            configFile: (await fs.pathExists(path.join(projectPath, 'vue.config.js'))) 
              ? 'vue.config.js' 
              : (await fs.pathExists(path.join(projectPath, 'vite.config.js'))) 
                ? 'vite.config.js' 
                : undefined,
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Svelte
   */
  private async detectSvelte(projectPath: string): Promise<FrameworkInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const svelteVersion = packageJson.dependencies?.svelte || packageJson.devDependencies?.svelte;
        if (svelteVersion) {
          return {
            name: 'Svelte',
            type: 'svelte',
            version: this.extractVersion(svelteVersion),
            configFile: (await fs.pathExists(path.join(projectPath, 'svelte.config.js'))) 
              ? 'svelte.config.js' 
              : undefined,
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect React
   */
  private async detectReact(projectPath: string): Promise<FrameworkInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const reactVersion = packageJson.dependencies?.react || packageJson.devDependencies?.react;
        if (reactVersion) {
          return {
            name: 'React',
            type: 'react',
            version: this.extractVersion(reactVersion),
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Express
   */
  private async detectExpress(projectPath: string): Promise<FrameworkInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const expressVersion = packageJson.dependencies?.express || packageJson.devDependencies?.express;
        if (expressVersion) {
          return {
            name: 'Express',
            type: 'express',
            version: this.extractVersion(expressVersion),
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Django
   */
  private async detectDjango(projectPath: string): Promise<FrameworkInfo | null> {
    const managePyPath = path.join(projectPath, 'manage.py');
    if (await fs.pathExists(managePyPath)) {
      const requirementsPath = path.join(projectPath, 'requirements.txt');
      let version: string | undefined;
      if (await fs.pathExists(requirementsPath)) {
        try {
          const content = await fs.readFile(requirementsPath, 'utf-8');
          const match = content.match(/Django[=<>!]+([\d.]+)/i);
          if (match) {
            version = match[1];
          }
        } catch (error) {
          // Ignore read errors
        }
      }
      return {
        name: 'Django',
        type: 'django',
        version,
        configFile: 'manage.py',
      };
    }
    return null;
  }

  /**
   * Detect Laravel
   */
  private async detectLaravel(projectPath: string): Promise<FrameworkInfo | null> {
    const artisanPath = path.join(projectPath, 'artisan');
    const composerPath = path.join(projectPath, 'composer.json');
    if (await fs.pathExists(artisanPath) && await fs.pathExists(composerPath)) {
      let version: string | undefined;
      try {
        const composerJson = JSON.parse(await fs.readFile(composerPath, 'utf-8'));
        const laravelVersion = composerJson.require?.['laravel/framework'] || 
                              composerJson['require-dev']?.['laravel/framework'];
        if (laravelVersion) {
          version = this.extractVersion(laravelVersion);
        }
      } catch (error) {
        // Ignore parse errors
      }
      return {
        name: 'Laravel',
        type: 'laravel',
        version,
        configFile: 'artisan',
      };
    }
    return null;
  }

  /**
   * Detect Flask
   */
  private async detectFlask(projectPath: string): Promise<FrameworkInfo | null> {
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    if (await fs.pathExists(requirementsPath)) {
      try {
        const content = await fs.readFile(requirementsPath, 'utf-8');
        if (content.match(/Flask/i)) {
          const match = content.match(/Flask[=<>!]+([\d.]+)/i);
          return {
            name: 'Flask',
            type: 'flask',
            version: match ? match[1] : undefined,
            configFile: 'requirements.txt',
          };
        }
      } catch (error) {
        // Ignore read errors
      }
    }
    return null;
  }

  /**
   * Extract version from version string (handles ^, ~, >=, etc.)
   */
  private extractVersion(versionString: string | undefined): string | undefined {
    if (!versionString) return undefined;
    // Remove version prefixes like ^, ~, >=, <=, etc.
    const cleaned = versionString.replace(/^[\^~<>=!]+/, '');
    // Extract just the version number (e.g., "17.0.0" from "17.0.0" or "17.0.0-beta.1")
    const match = cleaned.match(/^(\d+\.\d+\.\d+)/);
    return match ? match[1] : cleaned;
  }
}

