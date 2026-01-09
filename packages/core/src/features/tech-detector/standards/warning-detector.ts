/**
 * Warning Detector
 * 
 * Detects warnings for non-recommended tech and outdated versions.
 */

import { TechStack, FrameworkInfo, LanguageInfo, BuildToolInfo, PackageManagerInfo, RuntimeInfo } from '../types';
import { TechStandards, UserChoices } from './standards-loader';
import semver from 'semver';

export interface Warning {
  type: 'non-recommended' | 'outdated-version';
  category: 'framework' | 'language' | 'buildTool' | 'packageManager' | 'runtime';
  detected: {
    name: string;
    version?: string;
  };
  recommended?: string[];
  minimumVersion?: string;
  message: string;
}

export class WarningDetector {
  /**
   * Detect all warnings in tech stack
   */
  async detectWarnings(
    techStack: TechStack,
    standards: TechStandards,
    userChoices: UserChoices
  ): Promise<Warning[]> {
    const warnings: Warning[] = [];

    // Check framework
    if (techStack.framework) {
      const frameworkWarnings = this.checkFramework(techStack.framework, standards, userChoices);
      warnings.push(...frameworkWarnings);
    }

    // Check languages
    for (const language of techStack.languages) {
      const languageWarnings = this.checkLanguage(language, standards, userChoices);
      warnings.push(...languageWarnings);
    }

    // Check build tools
    for (const buildTool of techStack.buildTools) {
      const buildToolWarnings = this.checkBuildTool(buildTool, standards, userChoices);
      warnings.push(...buildToolWarnings);
    }

    // Check package manager
    const packageManagerWarnings = this.checkPackageManager(techStack.packageManager, standards, userChoices);
    warnings.push(...packageManagerWarnings);

    // Check runtime
    if (techStack.runtime) {
      const runtimeWarnings = this.checkRuntime(techStack.runtime, standards, userChoices);
      warnings.push(...runtimeWarnings);
    }

    return warnings;
  }

  /**
   * Check framework against standards
   */
  private checkFramework(
    framework: FrameworkInfo,
    standards: TechStandards,
    userChoices: UserChoices
  ): Warning[] {
    const warnings: Warning[] = [];
    const frameworkName = framework.type || framework.name.toLowerCase();

    // Check if ignored
    if (userChoices.ignoredWarnings?.frameworks?.[frameworkName]) {
      return warnings;
    }

    // Check if recommended
    const isRecommended = standards.frameworks.recommended.some(
      (rec) => rec.toLowerCase() === frameworkName
    );

    if (!isRecommended) {
      warnings.push({
        type: 'non-recommended',
        category: 'framework',
        detected: {
          name: framework.name,
          version: framework.version,
        },
        recommended: standards.frameworks.recommended,
        message: `Non-recommended framework detected: ${framework.name}`,
      });
    }

    // Check version if recommended
    if (isRecommended && framework.version) {
      const minVersion = standards.frameworks.minimumVersions[frameworkName];
      if (minVersion && this.isVersionBelow(framework.version, minVersion, frameworkName, userChoices)) {
        warnings.push({
          type: 'outdated-version',
          category: 'framework',
          detected: {
            name: framework.name,
            version: framework.version,
          },
          minimumVersion: minVersion,
          message: `Version ${framework.version} is below recommended minimum ${minVersion}`,
        });
      }
    }

    return warnings;
  }

  /**
   * Check language against standards
   */
  private checkLanguage(
    language: LanguageInfo,
    standards: TechStandards,
    userChoices: UserChoices
  ): Warning[] {
    const warnings: Warning[] = [];
    const languageName = language.type || language.name.toLowerCase();

    // Check if recommended
    const isRecommended = standards.languages.recommended.some(
      (rec) => rec.toLowerCase() === languageName
    );

    if (!isRecommended) {
      warnings.push({
        type: 'non-recommended',
        category: 'language',
        detected: {
          name: language.name,
          version: language.version,
        },
        recommended: standards.languages.recommended,
        message: `Non-recommended language detected: ${language.name}`,
      });
    }

    // Check version if recommended
    if (isRecommended && language.version) {
      const minVersion = standards.languages.minimumVersions[languageName];
      if (minVersion && this.isVersionBelow(language.version, minVersion, languageName, userChoices)) {
        warnings.push({
          type: 'outdated-version',
          category: 'language',
          detected: {
            name: language.name,
            version: language.version,
          },
          minimumVersion: minVersion,
          message: `Version ${language.version} is below recommended minimum ${minVersion}`,
        });
      }
    }

    return warnings;
  }

  /**
   * Check build tool against standards
   */
  private checkBuildTool(
    buildTool: BuildToolInfo,
    standards: TechStandards,
    userChoices: UserChoices
  ): Warning[] {
    const warnings: Warning[] = [];
    const toolName = buildTool.type || buildTool.name.toLowerCase();

    // Check if recommended
    const isRecommended = standards.buildTools.recommended.some(
      (rec) => rec.toLowerCase() === toolName
    );

    if (!isRecommended) {
      warnings.push({
        type: 'non-recommended',
        category: 'buildTool',
        detected: {
          name: buildTool.name,
          version: buildTool.version,
        },
        recommended: standards.buildTools.recommended,
        message: `Non-recommended build tool detected: ${buildTool.name}`,
      });
    }

    // Check version if recommended
    if (isRecommended && buildTool.version) {
      const minVersion = standards.buildTools.minimumVersions[toolName];
      if (minVersion && this.isVersionBelow(buildTool.version, minVersion, toolName, userChoices)) {
        warnings.push({
          type: 'outdated-version',
          category: 'buildTool',
          detected: {
            name: buildTool.name,
            version: buildTool.version,
          },
          minimumVersion: minVersion,
          message: `Version ${buildTool.version} is below recommended minimum ${minVersion}`,
        });
      }
    }

    return warnings;
  }

  /**
   * Check package manager against standards
   */
  private checkPackageManager(
    packageManager: PackageManagerInfo,
    standards: TechStandards,
    userChoices: UserChoices
  ): Warning[] {
    const warnings: Warning[] = [];
    const pmName = packageManager.type || packageManager.name.toLowerCase();

    // Check if recommended
    const isRecommended = standards.packageManagers.recommended.some(
      (rec) => rec.toLowerCase() === pmName
    );

    if (!isRecommended) {
      warnings.push({
        type: 'non-recommended',
        category: 'packageManager',
        detected: {
          name: packageManager.name,
          version: packageManager.version,
        },
        recommended: standards.packageManagers.recommended,
        message: `Non-recommended package manager detected: ${packageManager.name}`,
      });
    }

    // Check version if recommended
    if (isRecommended && packageManager.version) {
      const minVersion = standards.packageManagers.minimumVersions[pmName];
      if (minVersion && this.isVersionBelow(packageManager.version, minVersion, pmName, userChoices)) {
        warnings.push({
          type: 'outdated-version',
          category: 'packageManager',
          detected: {
            name: packageManager.name,
            version: packageManager.version,
          },
          minimumVersion: minVersion,
          message: `Version ${packageManager.version} is below recommended minimum ${minVersion}`,
        });
      }
    }

    return warnings;
  }

  /**
   * Check runtime against standards
   */
  private checkRuntime(
    runtime: RuntimeInfo,
    standards: TechStandards,
    userChoices: UserChoices
  ): Warning[] {
    const warnings: Warning[] = [];
    const runtimeName = runtime.type || runtime.name.toLowerCase();

    // Check if recommended
    const isRecommended = standards.runtimes.recommended.some(
      (rec) => rec.toLowerCase() === runtimeName
    );

    if (!isRecommended) {
      warnings.push({
        type: 'non-recommended',
        category: 'runtime',
        detected: {
          name: runtime.name,
          version: runtime.version,
        },
        recommended: standards.runtimes.recommended,
        message: `Non-recommended runtime detected: ${runtime.name}`,
      });
    }

    // Check version if recommended
    if (isRecommended && runtime.version) {
      const minVersion = standards.runtimes.minimumVersions[runtimeName];
      if (minVersion && this.isVersionBelow(runtime.version, minVersion, runtimeName, userChoices)) {
        warnings.push({
          type: 'outdated-version',
          category: 'runtime',
          detected: {
            name: runtime.name,
            version: runtime.version,
          },
          minimumVersion: minVersion,
          message: `Version ${runtime.version} is below recommended minimum ${minVersion}`,
        });
      }
    }

    return warnings;
  }

  /**
   * Check if version is below minimum (and not ignored)
   */
  private isVersionBelow(
    currentVersion: string,
    minVersion: string,
    techName: string,
    userChoices: UserChoices
  ): boolean {
    // Check if ignored
    const ignored = userChoices.ignoredWarnings?.versions?.[techName];
    if (ignored && ignored.current === currentVersion && ignored.recommended === minVersion) {
      return false;
    }

    // Compare versions using semver
    try {
      return semver.lt(currentVersion, minVersion);
    } catch (error) {
      // If semver comparison fails, do string comparison
      return currentVersion < minVersion;
    }
  }
}
