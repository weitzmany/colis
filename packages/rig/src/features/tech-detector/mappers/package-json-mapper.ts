/**
 * Package.json Mapper
 * 
 * Maps TechStack to package.json format (simplified).
 */

import { TechStack } from '../types.js';

export class PackageJsonMapper {
  /**
   * Map TechStack to package.json format
   */
  map(techStack: TechStack): any {
    const primaryLanguage = techStack.languages.find(l => l.primary) || techStack.languages[0];
    
    return {
      core: {
        tech: {
          framework: techStack.framework?.type || null,
          primaryLanguage: primaryLanguage?.type || null,
          packageManager: techStack.packageManager.type,
          runtime: techStack.runtime?.type || null,
        },
      },
    };
  }

  /**
   * Merge tech info into existing package.json
   */
  mergeIntoPackageJson(packageJson: any, techStack: TechStack): any {
    const techInfo = this.map(techStack);
    
    return {
      ...packageJson,
      core: {
        ...(packageJson.core || {}),
        ...techInfo.core,
      },
    };
  }
}




