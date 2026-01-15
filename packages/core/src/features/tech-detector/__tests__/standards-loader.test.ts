/**
 * Standards Loader Tests
 * 
 * Unit tests for standards loading functionality.
 */

import { StandardsLoader, TechStandards, UserChoices } from '../standards/standards-loader.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import { jest } from '@jest/globals';

// Mock fs-extra
jest.mock('fs-extra');

describe('StandardsLoader', () => {
  let loader: StandardsLoader;
  const mockProjectPath = '/test/project';

  beforeEach(() => {
    loader = new StandardsLoader();
    jest.clearAllMocks();
  });

  describe('loadStandards', () => {
    it('should load default standards when project standards do not exist', async () => {
      // Mock default standards file exists
      const mockDefaultStandards: TechStandards = {
        frameworks: {
          recommended: ['nextjs', 'angular'],
          minimumVersions: {
            nextjs: '14.0.0',
          },
        },
        languages: {
          recommended: ['typescript'],
          minimumVersions: {
            typescript: '5.0.0',
          },
        },
        buildTools: {
          recommended: ['vite'],
          minimumVersions: {},
        },
        packageManagers: {
          recommended: ['npm'],
          minimumVersions: {},
        },
        runtimes: {
          recommended: ['node'],
          minimumVersions: {},
        },
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath.includes('default-standards.json')) {
          return Promise.resolve(JSON.stringify(mockDefaultStandards));
        }
        return Promise.reject(new Error('File not found'));
      });

      const standards = await loader.loadStandards(mockProjectPath);

      expect(standards).toBeDefined();
      expect(standards.frameworks.recommended).toContain('nextjs');
    });

    it('should merge project standards with defaults', async () => {
      const mockDefaultStandards: TechStandards = {
        frameworks: {
          recommended: ['nextjs', 'angular'],
          minimumVersions: {
            nextjs: '14.0.0',
            angular: '17.0.0',
          },
        },
        languages: {
          recommended: ['typescript'],
          minimumVersions: {},
        },
        buildTools: {
          recommended: ['vite'],
          minimumVersions: {},
        },
        packageManagers: {
          recommended: ['npm'],
          minimumVersions: {},
        },
        runtimes: {
          recommended: ['node'],
          minimumVersions: {},
        },
      };

      const projectStandards = {
        frameworks: {
          recommended: ['vue'], // Override
          minimumVersions: {
            vue: '3.5.0', // Add new
          },
        },
      };

      (fs.pathExists as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath.includes('.core-tech-standards.json')) {
          return Promise.resolve(true);
        }
        if (filePath.includes('default-standards.json')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath.includes('default-standards.json')) {
          return Promise.resolve(JSON.stringify(mockDefaultStandards));
        }
        if (filePath.includes('.core-tech-standards.json')) {
          return Promise.resolve(JSON.stringify(projectStandards));
        }
        return Promise.reject(new Error('File not found'));
      });

      const standards = await loader.loadStandards(mockProjectPath);

      expect(standards.frameworks.recommended).toContain('vue');
      expect(standards.frameworks.minimumVersions.vue).toBe('3.5.0');
      // Should still have default minimum versions
      expect(standards.frameworks.minimumVersions.nextjs).toBe('14.0.0');
    });

    it('should handle invalid JSON gracefully', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('invalid json');

      const standards = await loader.loadStandards(mockProjectPath);

      // Should return empty standards or default
      expect(standards).toBeDefined();
    });

    it('should return empty standards when default file is missing', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const standards = await loader.loadStandards(mockProjectPath);

      expect(standards).toBeDefined();
      expect(standards.frameworks.recommended).toEqual([]);
    });
  });

  describe('loadUserChoices', () => {
    it('should load user choices from file', async () => {
      const mockChoices: UserChoices = {
        ignoredWarnings: {
          frameworks: {
            vue: {
              reason: 'user_choice',
              timestamp: new Date().toISOString(),
            },
          },
        },
        customRecommendations: {
          frameworks: ['vue'],
        },
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockChoices));

      const choices = await loader.loadUserChoices(mockProjectPath);

      expect(choices.ignoredWarnings?.frameworks?.vue).toBeDefined();
      expect(choices.customRecommendations?.frameworks).toContain('vue');
    });

    it('should return empty object when file does not exist', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(false);

      const choices = await loader.loadUserChoices(mockProjectPath);

      expect(choices).toEqual({});
    });

    it('should handle invalid JSON gracefully', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('invalid json');

      const choices = await loader.loadUserChoices(mockProjectPath);

      expect(choices).toEqual({});
    });
  });

  describe('saveUserChoices', () => {
    it('should save user choices to file', async () => {
      const choices: UserChoices = {
        ignoredWarnings: {
          frameworks: {
            vue: {
              reason: 'user_choice',
              timestamp: new Date().toISOString(),
            },
          },
        },
      };

      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await loader.saveUserChoices(mockProjectPath, choices);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.core-tech-choices.json'),
        expect.stringContaining('vue'),
        'utf-8'
      );
    });

    it('should handle write errors', async () => {
      const choices: UserChoices = {};
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write failed'));

      await expect(loader.saveUserChoices(mockProjectPath, choices)).rejects.toThrow();
    });
  });

  describe('getNewProjectDefaults', () => {
    it('should return new project defaults when available', async () => {
      const mockStandards: TechStandards = {
        newProjectDefaults: {
          framework: 'angular',
          language: 'typescript',
          buildTool: 'webpack',
          packageManager: 'npm',
          runtime: 'node',
          versions: {
            angular: 'latest',
            typescript: 'latest',
          },
        },
        frameworks: {
          recommended: [],
          minimumVersions: {},
        },
        languages: {
          recommended: [],
          minimumVersions: {},
        },
        buildTools: {
          recommended: [],
          minimumVersions: {},
        },
        packageManagers: {
          recommended: [],
          minimumVersions: {},
        },
        runtimes: {
          recommended: [],
          minimumVersions: {},
        },
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockStandards));

      const defaults = await loader.getNewProjectDefaults(mockProjectPath);

      expect(defaults).toBeDefined();
      expect(defaults?.framework).toBe('angular');
      expect(defaults?.language).toBe('typescript');
    });

    it('should return null when defaults not configured', async () => {
      const mockStandards: TechStandards = {
        frameworks: {
          recommended: [],
          minimumVersions: {},
        },
        languages: {
          recommended: [],
          minimumVersions: {},
        },
        buildTools: {
          recommended: [],
          minimumVersions: {},
        },
        packageManagers: {
          recommended: [],
          minimumVersions: {},
        },
        runtimes: {
          recommended: [],
          minimumVersions: {},
        },
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockStandards));

      const defaults = await loader.getNewProjectDefaults(mockProjectPath);

      expect(defaults).toBeNull();
    });
  });
});
