/**
 * Standards Loader
 * 
 * Loads technology standards from default and project-specific files.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface TechStandards {
  frameworks: {
    recommended: string[];
    minimumVersions: Record<string, string>;
  };
  languages: {
    recommended: string[];
    minimumVersions: Record<string, string>;
  };
  buildTools: {
    recommended: string[];
    minimumVersions: Record<string, string>;
  };
  packageManagers: {
    recommended: string[];
    minimumVersions: Record<string, string>;
  };
  runtimes: {
    recommended: string[];
    minimumVersions: Record<string, string>;
  };
}

export interface UserChoices {
  ignoredWarnings?: {
    frameworks?: Record<string, { reason: string; timestamp: string }>;
    versions?: Record<string, { current: string; recommended: string; reason: string; timestamp: string }>;
  };
  customRecommendations?: {
    frameworks?: string[];
    minimumVersions?: Record<string, string>;
  };
}

export class StandardsLoader {
  /**
   * Load standards (defaults + project overrides)
   */
  async loadStandards(projectPath: string): Promise<TechStandards> {
    const defaultStandards = await this.loadDefaultStandards();
    const projectStandards = await this.loadProjectStandards(projectPath);
    
    // Merge: project overrides take precedence
    return this.mergeStandards(defaultStandards, projectStandards);
  }

  /**
   * Load default standards from core package
   */
  private async loadDefaultStandards(): Promise<TechStandards> {
    const standardsPath = path.join(__dirname, 'default-standards.json');
    try {
      const content = await fs.readFile(standardsPath, 'utf-8');
      return JSON.parse(content) as TechStandards;
    } catch (error) {
      // Fallback to empty standards if file not found
      return this.getEmptyStandards();
    }
  }

  /**
   * Load project-specific standards
   */
  private async loadProjectStandards(projectPath: string): Promise<Partial<TechStandards> | null> {
    const standardsPath = path.join(projectPath, '.core-tech-standards.json');
    if (!(await fs.pathExists(standardsPath))) {
      return null;
    }

    try {
      const content = await fs.readFile(standardsPath, 'utf-8');
      return JSON.parse(content) as Partial<TechStandards>;
    } catch (error) {
      return null;
    }
  }

  /**
   * Merge default and project standards
   */
  private mergeStandards(
    defaults: TechStandards,
    project: Partial<TechStandards> | null
  ): TechStandards {
    if (!project) {
      return defaults;
    }

    return {
      frameworks: {
        recommended: project.frameworks?.recommended || defaults.frameworks.recommended,
        minimumVersions: {
          ...defaults.frameworks.minimumVersions,
          ...(project.frameworks?.minimumVersions || {}),
        },
      },
      languages: {
        recommended: project.languages?.recommended || defaults.languages.recommended,
        minimumVersions: {
          ...defaults.languages.minimumVersions,
          ...(project.languages?.minimumVersions || {}),
        },
      },
      buildTools: {
        recommended: project.buildTools?.recommended || defaults.buildTools.recommended,
        minimumVersions: {
          ...defaults.buildTools.minimumVersions,
          ...(project.buildTools?.minimumVersions || {}),
        },
      },
      packageManagers: {
        recommended: project.packageManagers?.recommended || defaults.packageManagers.recommended,
        minimumVersions: {
          ...defaults.packageManagers.minimumVersions,
          ...(project.packageManagers?.minimumVersions || {}),
        },
      },
      runtimes: {
        recommended: project.runtimes?.recommended || defaults.runtimes.recommended,
        minimumVersions: {
          ...defaults.runtimes.minimumVersions,
          ...(project.runtimes?.minimumVersions || {}),
        },
      },
    };
  }

  /**
   * Load user choices (ignored warnings, custom recommendations)
   */
  async loadUserChoices(projectPath: string): Promise<UserChoices> {
    const choicesPath = path.join(projectPath, '.core-tech-choices.json');
    if (!(await fs.pathExists(choicesPath))) {
      return {};
    }

    try {
      const content = await fs.readFile(choicesPath, 'utf-8');
      return JSON.parse(content) as UserChoices;
    } catch (error) {
      return {};
    }
  }

  /**
   * Save user choices
   */
  async saveUserChoices(projectPath: string, choices: UserChoices): Promise<void> {
    const choicesPath = path.join(projectPath, '.core-tech-choices.json');
    await fs.writeFile(choicesPath, JSON.stringify(choices, null, 2), 'utf-8');
  }

  /**
   * Get empty standards structure
   */
  private getEmptyStandards(): TechStandards {
    return {
      frameworks: { recommended: [], minimumVersions: {} },
      languages: { recommended: [], minimumVersions: {} },
      buildTools: { recommended: [], minimumVersions: {} },
      packageManagers: { recommended: [], minimumVersions: {} },
      runtimes: { recommended: [], minimumVersions: {} },
    };
  }
}
