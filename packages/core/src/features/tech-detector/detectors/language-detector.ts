/**
 * Language Detector
 * 
 * Detects programming languages used in the project by scanning files.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import { LanguageInfo } from '../types';

export class LanguageDetector {
  /**
   * Detect languages from project directory
   */
  async detect(projectPath: string): Promise<LanguageInfo[]> {
    const resolvedPath = path.resolve(projectPath);
    const languages: LanguageInfo[] = [];
    const languageCounts = new Map<string, number>();

    // Define language patterns
    const languagePatterns: Array<{
      type: LanguageInfo['type'];
      name: string;
      extensions: string[];
      configFiles?: string[];
    }> = [
      {
        type: 'typescript',
        name: 'TypeScript',
        extensions: ['.ts', '.tsx'],
        configFiles: ['tsconfig.json'],
      },
      {
        type: 'javascript',
        name: 'JavaScript',
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
      },
      {
        type: 'python',
        name: 'Python',
        extensions: ['.py', '.pyw'],
        configFiles: ['requirements.txt', 'setup.py', 'pyproject.toml'],
      },
      {
        type: 'php',
        name: 'PHP',
        extensions: ['.php'],
        configFiles: ['composer.json'],
      },
      {
        type: 'java',
        name: 'Java',
        extensions: ['.java'],
        configFiles: ['pom.xml', 'build.gradle'],
      },
      {
        type: 'go',
        name: 'Go',
        extensions: ['.go'],
        configFiles: ['go.mod'],
      },
      {
        type: 'rust',
        name: 'Rust',
        extensions: ['.rs'],
        configFiles: ['Cargo.toml'],
      },
    ];

    // Count files by extension
    const ignorePatterns = [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.git/**',
      '.angular/**',
      '.next/**',
      'coverage/**',
      '.vscode/**',
      '.idea/**',
    ];

    for (const lang of languagePatterns) {
      let fileCount = 0;
      let hasConfigFile = false;

      // Check for config files
      if (lang.configFiles) {
        for (const configFile of lang.configFiles) {
          if (await fs.pathExists(path.join(resolvedPath, configFile))) {
            hasConfigFile = true;
            break;
          }
        }
      }

      // Count files with matching extensions
      for (const ext of lang.extensions) {
        try {
          const files = await glob(`**/*${ext}`, {
            cwd: resolvedPath,
            ignore: ignorePatterns,
            nodir: true,
          });
          fileCount += files.length;
        } catch (error) {
          // Ignore glob errors
        }
      }

      // Only include languages that have files or config files
      if (fileCount > 0 || hasConfigFile) {
        languageCounts.set(lang.type, fileCount);
        
        // Get version if available
        let version: string | undefined;
        if (lang.type === 'typescript') {
          version = await this.getTypeScriptVersion(resolvedPath);
        } else if (lang.type === 'python') {
          version = await this.getPythonVersion(resolvedPath);
        } else if (lang.type === 'php') {
          version = await this.getPhpVersion(resolvedPath);
        } else if (lang.type === 'java') {
          version = await this.getJavaVersion(resolvedPath);
        } else if (lang.type === 'go') {
          version = await this.getGoVersion(resolvedPath);
        } else if (lang.type === 'rust') {
          version = await this.getRustVersion(resolvedPath);
        }

        languages.push({
          name: lang.name,
          type: lang.type,
          version,
          fileCount,
          primary: false, // Will be set later
        });
      }
    }

    // Determine primary language (most files, or TypeScript if present)
    if (languages.length > 0) {
      // TypeScript is usually primary if present
      const typescript = languages.find(l => l.type === 'typescript');
      if (typescript) {
        typescript.primary = true;
      } else {
        // Otherwise, language with most files
        const primary = languages.reduce((prev, current) => 
          (current.fileCount || 0) > (prev.fileCount || 0) ? current : prev
        );
        primary.primary = true;
      }
    }

    return languages;
  }

  /**
   * Get TypeScript version from package.json or tsconfig.json
   */
  private async getTypeScriptVersion(projectPath: string): Promise<string | undefined> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const tsVersion = packageJson.dependencies?.typescript || 
                         packageJson.devDependencies?.typescript;
        if (tsVersion) {
          return this.extractVersion(tsVersion);
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return undefined;
  }

  /**
   * Get Python version from .python-version or runtime.txt
   */
  private async getPythonVersion(projectPath: string): Promise<string | undefined> {
    const pythonVersionPath = path.join(projectPath, '.python-version');
    const runtimePath = path.join(projectPath, 'runtime.txt');
    
    if (await fs.pathExists(pythonVersionPath)) {
      try {
        const content = await fs.readFile(pythonVersionPath, 'utf-8');
        return content.trim();
      } catch (error) {
        // Ignore read errors
      }
    }
    
    if (await fs.pathExists(runtimePath)) {
      try {
        const content = await fs.readFile(runtimePath, 'utf-8');
        const match = content.match(/python-([\d.]+)/i);
        if (match) {
          return match[1];
        }
      } catch (error) {
        // Ignore read errors
      }
    }
    
    return undefined;
  }

  /**
   * Get PHP version from composer.json
   */
  private async getPhpVersion(projectPath: string): Promise<string | undefined> {
    const composerPath = path.join(projectPath, 'composer.json');
    if (await fs.pathExists(composerPath)) {
      try {
        const composerJson = JSON.parse(await fs.readFile(composerPath, 'utf-8'));
        const phpRequirement = composerJson.require?.php;
        if (phpRequirement) {
          return this.extractVersion(phpRequirement);
        }
      } catch (error) {
        // Ignore parse errors
      }
    }
    return undefined;
  }

  /**
   * Get Java version from pom.xml or build.gradle
   */
  private async getJavaVersion(projectPath: string): Promise<string | undefined> {
    const pomPath = path.join(projectPath, 'pom.xml');
    if (await fs.pathExists(pomPath)) {
      try {
        const content = await fs.readFile(pomPath, 'utf-8');
        const match = content.match(/<java\.version>([\d.]+)<\/java\.version>/i) ||
                     content.match(/<maven\.compiler\.source>([\d.]+)<\/maven\.compiler\.source>/i);
        if (match) {
          return match[1];
        }
      } catch (error) {
        // Ignore read errors
      }
    }
    
    const gradlePath = path.join(projectPath, 'build.gradle');
    if (await fs.pathExists(gradlePath)) {
      try {
        const content = await fs.readFile(gradlePath, 'utf-8');
        const match = content.match(/sourceCompatibility\s*=\s*['"]?([\d.]+)/i);
        if (match) {
          return match[1];
        }
      } catch (error) {
        // Ignore read errors
      }
    }
    
    return undefined;
  }

  /**
   * Get Go version from go.mod
   */
  private async getGoVersion(projectPath: string): Promise<string | undefined> {
    const goModPath = path.join(projectPath, 'go.mod');
    if (await fs.pathExists(goModPath)) {
      try {
        const content = await fs.readFile(goModPath, 'utf-8');
        const match = content.match(/^go\s+([\d.]+)/m);
        if (match) {
          return match[1];
        }
      } catch (error) {
        // Ignore read errors
      }
    }
    return undefined;
  }

  /**
   * Get Rust version from Cargo.toml
   */
  private async getRustVersion(projectPath: string): Promise<string | undefined> {
    const cargoPath = path.join(projectPath, 'Cargo.toml');
    if (await fs.pathExists(cargoPath)) {
      try {
        const content = await fs.readFile(cargoPath, 'utf-8');
        const match = content.match(/^edition\s*=\s*["']([\d.]+)["']/m);
        if (match) {
          return match[1];
        }
      } catch (error) {
        // Ignore read errors
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
}

