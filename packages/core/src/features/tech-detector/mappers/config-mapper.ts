/**
 * Config Mapper
 * 
 * Maps TechStack to .core-tech.json format.
 */

import { TechStack } from '../types';

export class ConfigMapper {
  /**
   * Map TechStack to config file format
   */
  map(techStack: TechStack): any {
    return {
      version: techStack.version,
      detectedAt: techStack.detectedAt,
      framework: techStack.framework || null,
      languages: techStack.languages,
      buildTools: techStack.buildTools,
      packageManager: techStack.packageManager,
      runtime: techStack.runtime || null,
    };
  }
}

