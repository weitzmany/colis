/**
 * Standards Loader
 * 
 * Loads technology standards from default and project-specific files.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface BackendDefaults {
  framework: string;
  language: string;
  packageManager: string;
  runtime: string;
  versions: Record<string, string>;
}

export interface NewProjectDefaults {
  framework: string;
  language: string;
  buildTool: string;
  packageManager: string;
  runtime: string;
  versions: Record<string, string>;
  backendDefaults?: BackendDefaults;
}

export interface TechStandards {
  newProjectDefaults?: NewProjectDefaults;
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
    languages?: Record<string, { reason: string; timestamp: string }>;
    buildTools?: Record<string, { reason: string; timestamp: string }>;
    packageManagers?: Record<string, { reason: string; timestamp: string }>;
    runtimes?: Record<string, { reason: string; timestamp: string }>;
    versions?: Record<string, { current: string; recommended: string; reason: string; timestamp: string }>;
  };
  customRecommendations?: {
    frameworks?: string[];
    languages?: string[];
    buildTools?: string[];
    packageManagers?: string[];
    runtimes?: string[];
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
   * 
   * @returns TechStandards object with default standards, or empty standards if file not found
   */
  private async loadDefaultStandards(): Promise<TechStandards> {
    const standardsPath = path.join(__dirname, 'default-standards.json');
    try {
      const content = await fs.readFile(standardsPath, 'utf-8');
      const standards = JSON.parse(content) as TechStandards;
      
      // Validate structure
      if (!this.validateStandardsStructure(standards)) {
        console.warn('⚠ Default standards file has invalid structure, using empty standards');
        return this.getEmptyStandards();
      }
      
      return standards;
    } catch (error) {
      // Fallback to empty standards if file not found or invalid
      console.warn(`⚠ Could not load default standards: ${error}`);
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
      newProjectDefaults: project.newProjectDefaults || defaults.newProjectDefaults,
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
   * Get new project defaults (recommended defaults for new projects)
   */
  async getNewProjectDefaults(projectPath: string): Promise<NewProjectDefaults | null> {
    const standards = await this.loadStandards(projectPath);
    return standards.newProjectDefaults || null;
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

  /**
   * Validate standards structure
   * 
   * @param standards - Standards object to validate
   * @returns true if structure is valid, false otherwise
   */
  private validateStandardsStructure(standards: any): standards is TechStandards {
    if (!standards || typeof standards !== 'object') {
      return false;
    }

    const requiredCategories = ['frameworks', 'languages', 'buildTools', 'packageManagers', 'runtimes'];
    
    for (const category of requiredCategories) {
      if (!standards[category] || typeof standards[category] !== 'object') {
        return false;
      }
      
      const categoryData = standards[category];
      if (!Array.isArray(categoryData.recommended) || typeof categoryData.minimumVersions !== 'object') {
        return false;
      }
    }

    return true;
  }
}
