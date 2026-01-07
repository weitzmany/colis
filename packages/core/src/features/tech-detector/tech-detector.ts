/**
 * Tech Detector
 * 
 * Main class that orchestrates technology stack detection.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { TechStack } from './types';
import { FrameworkDetector } from './detectors/framework-detector';
import { LanguageDetector } from './detectors/language-detector';
import { BuildToolDetector } from './detectors/build-tool-detector';
import { PackageManagerDetector } from './detectors/package-manager-detector';
import { RuntimeDetector } from './detectors/runtime-detector';

export class TechDetector {
  private frameworkDetector: FrameworkDetector;
  private languageDetector: LanguageDetector;
  private buildToolDetector: BuildToolDetector;
  private packageManagerDetector: PackageManagerDetector;
  private runtimeDetector: RuntimeDetector;

  constructor() {
    this.frameworkDetector = new FrameworkDetector();
    this.languageDetector = new LanguageDetector();
    this.buildToolDetector = new BuildToolDetector();
    this.packageManagerDetector = new PackageManagerDetector();
    this.runtimeDetector = new RuntimeDetector();
  }

  /**
   * Detect technology stack from project directory
   */
  async detect(projectPath: string): Promise<TechStack> {
    const resolvedPath = path.resolve(projectPath);

    // Run all detectors in parallel
    const [framework, languages, buildTools, packageManager, runtime] = await Promise.all([
      this.frameworkDetector.detect(resolvedPath),
      this.languageDetector.detect(resolvedPath),
      this.buildToolDetector.detect(resolvedPath),
      this.packageManagerDetector.detect(resolvedPath),
      this.runtimeDetector.detect(resolvedPath),
    ]);

    return {
      framework: framework || undefined,
      languages,
      buildTools,
      packageManager,
      runtime: runtime || undefined,
      detectedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Save tech stack to .core-tech.json
   */
  async save(projectPath: string, techStack: TechStack): Promise<void> {
    const resolvedPath = path.resolve(projectPath);
    const configPath = path.join(resolvedPath, '.core-tech.json');
    
    await fs.writeFile(
      configPath,
      JSON.stringify(techStack, null, 2),
      'utf-8'
    );
  }

  /**
   * Load tech stack from .core-tech.json
   */
  async load(projectPath: string): Promise<TechStack | null> {
    const resolvedPath = path.resolve(projectPath);
    const configPath = path.join(resolvedPath, '.core-tech.json');
    
    if (!(await fs.pathExists(configPath))) {
      return null;
    }

    try {
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content) as TechStack;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update existing tech stack (re-detect and merge)
   */
  async update(projectPath: string): Promise<TechStack> {
    const existing = await this.load(projectPath);
    const detected = await this.detect(projectPath);
    
    // Merge: prefer existing if available, otherwise use detected
    return {
      ...detected,
      detectedAt: new Date().toISOString(),
      version: existing?.version || detected.version,
    };
  }
}

