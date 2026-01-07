/**
 * Build Tool Detector
 * 
 * Detects build tools and bundlers used in the project.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { BuildToolInfo } from '../types';

export class BuildToolDetector {
  /**
   * Detect build tools from project directory
   */
  async detect(projectPath: string): Promise<BuildToolInfo[]> {
    const resolvedPath = path.resolve(projectPath);
    const buildTools: BuildToolInfo[] = [];

    // Check for Webpack
    const webpack = await this.detectWebpack(resolvedPath);
    if (webpack) buildTools.push(webpack);

    // Check for Vite
    const vite = await this.detectVite(resolvedPath);
    if (vite) buildTools.push(vite);

    // Check for Rollup
    const rollup = await this.detectRollup(resolvedPath);
    if (rollup) buildTools.push(rollup);

    // Check for esbuild
    const esbuild = await this.detectEsbuild(resolvedPath);
    if (esbuild) buildTools.push(esbuild);

    // Check for Parcel
    const parcel = await this.detectParcel(resolvedPath);
    if (parcel) buildTools.push(parcel);

    // Check for Angular CLI
    const angularCli = await this.detectAngularCli(resolvedPath);
    if (angularCli) buildTools.push(angularCli);

    // Check for Next.js CLI / Turbopack
    const nextCli = await this.detectNextCli(resolvedPath);
    if (nextCli) buildTools.push(nextCli);

    return buildTools;
  }

  /**
   * Detect Webpack
   */
  private async detectWebpack(projectPath: string): Promise<BuildToolInfo | null> {
    const configFiles = [
      'webpack.config.js',
      'webpack.config.ts',
      'webpack.config.cjs',
      'webpack.config.mjs',
    ];

    for (const configFile of configFiles) {
      if (await fs.pathExists(path.join(projectPath, configFile))) {
        const version = await this.getPackageVersion(projectPath, 'webpack');
        return {
          name: 'Webpack',
          type: 'webpack',
          version,
          configFile,
        };
      }
    }

    // Check package.json for webpack in scripts
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const scripts = packageJson.scripts || {};
        const hasWebpack = Object.values(scripts).some((script: any) => 
          typeof script === 'string' && script.includes('webpack')
        );
        if (hasWebpack) {
          const version = await this.getPackageVersion(projectPath, 'webpack');
          return {
            name: 'Webpack',
            type: 'webpack',
            version,
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }

    return null;
  }

  /**
   * Detect Vite
   */
  private async detectVite(projectPath: string): Promise<BuildToolInfo | null> {
    const configFiles = [
      'vite.config.js',
      'vite.config.ts',
      'vite.config.mjs',
      'vite.config.cjs',
    ];

    for (const configFile of configFiles) {
      if (await fs.pathExists(path.join(projectPath, configFile))) {
        const version = await this.getPackageVersion(projectPath, 'vite');
        return {
          name: 'Vite',
          type: 'vite',
          version,
          configFile,
        };
      }
    }

    return null;
  }

  /**
   * Detect Rollup
   */
  private async detectRollup(projectPath: string): Promise<BuildToolInfo | null> {
    const configFiles = [
      'rollup.config.js',
      'rollup.config.ts',
      'rollup.config.mjs',
    ];

    for (const configFile of configFiles) {
      if (await fs.pathExists(path.join(projectPath, configFile))) {
        const version = await this.getPackageVersion(projectPath, 'rollup');
        return {
          name: 'Rollup',
          type: 'rollup',
          version,
          configFile,
        };
      }
    }

    return null;
  }

  /**
   * Detect esbuild
   */
  private async detectEsbuild(projectPath: string): Promise<BuildToolInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const hasEsbuild = packageJson.dependencies?.esbuild || 
                          packageJson.devDependencies?.esbuild;
        if (hasEsbuild) {
          return {
            name: 'esbuild',
            type: 'esbuild',
            version: this.extractVersion(hasEsbuild),
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Parcel
   */
  private async detectParcel(projectPath: string): Promise<BuildToolInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const hasParcel = packageJson.dependencies?.['parcel-bundler'] || 
                         packageJson.dependencies?.parcel ||
                         packageJson.devDependencies?.['parcel-bundler'] ||
                         packageJson.devDependencies?.parcel;
        if (hasParcel) {
          return {
            name: 'Parcel',
            type: 'parcel',
            version: this.extractVersion(hasParcel),
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Detect Angular CLI
   */
  private async detectAngularCli(projectPath: string): Promise<BuildToolInfo | null> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (await fs.pathExists(angularJsonPath)) {
      const version = await this.getPackageVersion(projectPath, '@angular/cli');
      return {
        name: 'Angular CLI',
        type: 'angular-cli',
        version,
        configFile: 'angular.json',
      };
    }
    return null;
  }

  /**
   * Detect Next.js CLI / Turbopack
   */
  private async detectNextCli(projectPath: string): Promise<BuildToolInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const hasNext = packageJson.dependencies?.next || packageJson.devDependencies?.next;
        if (hasNext) {
          // Check for Turbopack (Next.js 13+)
          const nextVersion = this.extractVersion(hasNext);
          const isTurbopack = nextVersion && this.compareVersion(nextVersion, '13.0.0') >= 0;
          
          return {
            name: isTurbopack ? 'Turbopack' : 'Next.js CLI',
            type: isTurbopack ? 'turbopack' : 'next-cli',
            version: nextVersion,
          };
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return null;
  }

  /**
   * Get package version from package.json
   */
  private async getPackageVersion(projectPath: string, packageName: string): Promise<string | undefined> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const version = packageJson.dependencies?.[packageName] || 
                       packageJson.devDependencies?.[packageName];
        return version ? this.extractVersion(version) : undefined;
      } catch (error) {
        // Ignore parse errors
      }
    }
    return undefined;
  }

  /**
   * Extract version from version string
   */
  private extractVersion(versionString: string | undefined): string | undefined {
    if (!versionString) return undefined;
    const cleaned = versionString.replace(/^[\^~<>=!]+/, '');
    const match = cleaned.match(/^(\d+\.\d+\.\d+)/);
    return match ? match[1] : cleaned;
  }

  /**
   * Compare version strings (simple comparison)
   */
  private compareVersion(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    return 0;
  }
}




