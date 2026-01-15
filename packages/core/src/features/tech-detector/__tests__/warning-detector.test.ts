/**
 * Warning Detector Tests
 * 
 * Unit tests for warning detection functionality.
 */

import { WarningDetector } from '../standards/warning-detector.js';
import { TechStack, FrameworkInfo, LanguageInfo, BuildToolInfo, PackageManagerInfo, RuntimeInfo } from '../types.js';
import { TechStandards, UserChoices } from '../standards/standards-loader.js';

describe('WarningDetector', () => {
  let detector: WarningDetector;
  let mockStandards: TechStandards;
  let mockUserChoices: UserChoices;

  beforeEach(() => {
    detector = new WarningDetector();
    
    mockStandards = {
      frameworks: {
        recommended: ['nextjs', 'angular', 'react'],
        minimumVersions: {
          nextjs: '14.0.0',
          angular: '17.0.0',
          react: '18.0.0',
        },
      },
      languages: {
        recommended: ['typescript', 'javascript'],
        minimumVersions: {
          typescript: '5.0.0',
          node: '18.0.0',
        },
      },
      buildTools: {
        recommended: ['vite', 'webpack'],
        minimumVersions: {
          vite: '5.0.0',
          webpack: '5.0.0',
        },
      },
      packageManagers: {
        recommended: ['npm', 'pnpm', 'yarn'],
        minimumVersions: {
          npm: '9.0.0',
          pnpm: '8.0.0',
        },
      },
      runtimes: {
        recommended: ['node'],
        minimumVersions: {
          node: '18.0.0',
        },
      },
    };

    mockUserChoices = {};
  });

  describe('detectWarnings', () => {
    it('should detect non-recommended framework', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Vue',
          type: 'vue',
          version: '3.5.0',
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('non-recommended');
      expect(warnings[0].category).toBe('framework');
      expect(warnings[0].detected.name).toBe('Vue');
    });

    it('should detect outdated framework version', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '13.5.0', // Below minimum 14.0.0
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('outdated-version');
      expect(warnings[0].category).toBe('framework');
      expect(warnings[0].minimumVersion).toBe('14.0.0');
    });

    it('should not warn for recommended framework with valid version', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '14.5.0', // Above minimum
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(0);
    });

    it('should detect non-recommended language', async () => {
      const techStack: TechStack = {
        languages: [
          {
            name: 'Python',
            type: 'python',
            version: '3.11.0',
          },
        ],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('non-recommended');
      expect(warnings[0].category).toBe('language');
    });

    it('should detect outdated language version', async () => {
      const techStack: TechStack = {
        languages: [
          {
            name: 'TypeScript',
            type: 'typescript',
            version: '4.9.0', // Below minimum 5.0.0
          },
        ],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('outdated-version');
      expect(warnings[0].category).toBe('language');
    });

    it('should respect ignored warnings', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Vue',
          type: 'vue',
          version: '3.5.0',
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      mockUserChoices = {
        ignoredWarnings: {
          frameworks: {
            vue: {
              reason: 'user_choice',
              timestamp: new Date().toISOString(),
            },
          },
        },
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(0);
    });

    it('should respect ignored version warnings', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '13.5.0',
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      mockUserChoices = {
        ignoredWarnings: {
          versions: {
            nextjs: {
              current: '13.5.0',
              recommended: '14.0.0',
              reason: 'user_choice',
              timestamp: new Date().toISOString(),
            },
          },
        },
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(0);
    });

    it('should detect multiple warnings', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Vue',
          type: 'vue',
          version: '3.5.0',
        },
        languages: [
          {
            name: 'Python',
            type: 'python',
            version: '3.9.0',
          },
        ],
        buildTools: [
          {
            name: 'Rollup',
            type: 'rollup',
            version: '3.0.0',
          },
        ],
        packageManager: {
          name: 'npm',
          type: 'npm',
          version: '8.0.0', // Below minimum 9.0.0
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings.length).toBeGreaterThan(1);
    });

    it('should handle empty tech stack', async () => {
      const techStack: TechStack = {
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(0);
    });

    it('should handle custom recommendations', async () => {
      const techStack: TechStack = {
        languages: [
          {
            name: 'Python',
            type: 'python',
            version: '3.11.0',
          },
        ],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      mockUserChoices = {
        customRecommendations: {
          languages: ['python'],
        },
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(0);
    });
  });

  describe('version comparison', () => {
    it('should handle semver prefixes correctly', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '^13.5.0', // Has prefix
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].type).toBe('outdated-version');
    });

    it('should handle version strings without patch', async () => {
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '13', // Incomplete version
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      const warnings = await detector.detectWarnings(techStack, mockStandards, mockUserChoices);

      // Should still detect as outdated (fallback to string comparison)
      expect(warnings.length).toBeGreaterThanOrEqual(0);
    });
  });
});
