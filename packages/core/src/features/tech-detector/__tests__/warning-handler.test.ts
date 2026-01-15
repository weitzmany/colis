/**
 * Warning Handler Tests
 * 
 * Unit tests for warning handling functionality.
 */

import { WarningHandler } from '../standards/warning-handler.js';
import { Warning } from '../standards/warning-detector.js';
import { StandardsLoader } from '../standards/standards-loader.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('inquirer');
jest.mock('../standards/standards-loader.js');

describe('WarningHandler', () => {
  let handler: WarningHandler;
  const mockProjectPath = '/test/project';

  beforeEach(() => {
    handler = new WarningHandler();
    jest.clearAllMocks();
  });

  describe('handleWarnings', () => {
    it('should return empty array when warnings are empty', async () => {
      const warnings: Warning[] = [];

      const responses = await handler.handleWarnings(warnings, mockProjectPath, true);

      expect(responses).toEqual([]);
    });

    it('should return empty array when non-interactive', async () => {
      const warnings: Warning[] = [
        {
          type: 'non-recommended',
          category: 'framework',
          detected: { name: 'Vue' },
          message: 'Non-recommended framework detected: Vue',
        },
      ];

      const responses = await handler.handleWarnings(warnings, mockProjectPath, false);

      expect(responses).toEqual([]);
    });

    it('should handle multiple warnings', async () => {
      const warnings: Warning[] = [
        {
          type: 'non-recommended',
          category: 'framework',
          detected: { name: 'Vue' },
          recommended: ['nextjs', 'angular'],
          message: 'Non-recommended framework detected: Vue',
        },
        {
          type: 'outdated-version',
          category: 'framework',
          detected: { name: 'Next.js', version: '13.5.0' },
          minimumVersion: '14.0.0',
          message: 'Version 13.5.0 is below recommended minimum 14.0.0',
        },
      ];

      (inquirer.prompt as jest.Mock).mockResolvedValue({ action: 'ignore' });
      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const responses = await handler.handleWarnings(warnings, mockProjectPath, true);

      expect(responses).toHaveLength(2);
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleNonRecommendedWarning', () => {
    it('should add recommendation when user chooses add-recommendation', async () => {
      const warning: Warning = {
        type: 'non-recommended',
        category: 'framework',
        detected: { name: 'Vue' },
        recommended: ['nextjs', 'angular'],
        message: 'Non-recommended framework detected: Vue',
      };

      (inquirer.prompt as jest.Mock).mockResolvedValue({ action: 'add-recommendation' });
      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const response = await (handler as any).handleNonRecommendedWarning(warning, mockProjectPath);

      expect(response).toBeDefined();
      expect(response.action).toBe('add-recommendation');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should ignore warning when user chooses ignore', async () => {
      const warning: Warning = {
        type: 'non-recommended',
        category: 'framework',
        detected: { name: 'Vue' },
        recommended: ['nextjs', 'angular'],
        message: 'Non-recommended framework detected: Vue',
      };

      (inquirer.prompt as jest.Mock).mockResolvedValue({ action: 'ignore' });
      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const mockStandardsLoader = {
        saveUserChoices: jest.fn().mockResolvedValue(undefined),
      };
      (handler as any).standardsLoader = mockStandardsLoader;

      const response = await (handler as any).handleNonRecommendedWarning(warning, mockProjectPath);

      expect(response.action).toBe('ignore');
      expect(mockStandardsLoader.saveUserChoices).toHaveBeenCalled();
    });
  });

  describe('handleVersionWarning', () => {
    it('should update version when user chooses update-version', async () => {
      const warning: Warning = {
        type: 'outdated-version',
        category: 'framework',
        detected: { name: 'Next.js', version: '13.5.0' },
        minimumVersion: '14.0.0',
        message: 'Version 13.5.0 is below recommended minimum 14.0.0',
      };

      (inquirer.prompt as jest.Mock)
        .mockResolvedValueOnce({ action: 'update-version' })
        .mockResolvedValueOnce({ run: false });

      const response = await (handler as any).handleVersionWarning(warning, mockProjectPath);

      expect(response).toBeDefined();
      expect(response.action).toBe('update-version');
    });

    it('should change recommendation when user chooses change-recommendation', async () => {
      const warning: Warning = {
        type: 'outdated-version',
        category: 'framework',
        detected: { name: 'Next.js', version: '13.5.0' },
        minimumVersion: '14.0.0',
        message: 'Version 13.5.0 is below recommended minimum 14.0.0',
      };

      (inquirer.prompt as jest.Mock).mockResolvedValue({ action: 'change-recommendation' });
      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const response = await (handler as any).handleVersionWarning(warning, mockProjectPath);

      expect(response.action).toBe('change-recommendation');
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('addRecommendation', () => {
    it('should add tech to recommendations', async () => {
      const warning: Warning = {
        type: 'non-recommended',
        category: 'framework',
        detected: { name: 'Vue.js' },
        message: 'Non-recommended framework detected: Vue.js',
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await (handler as any).addRecommendation(warning, mockProjectPath);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = (fs.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.frameworks.recommended).toContain('vue-js');
    });

    it('should merge with existing standards', async () => {
      const warning: Warning = {
        type: 'non-recommended',
        category: 'language',
        detected: { name: 'Python' },
        message: 'Non-recommended language detected: Python',
      };

      const existingStandards = {
        languages: {
          recommended: ['typescript'],
          minimumVersions: {},
        },
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(existingStandards));
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await (handler as any).addRecommendation(warning, mockProjectPath);

      const writeCall = (fs.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.languages.recommended).toContain('typescript');
      expect(writtenData.languages.recommended).toContain('python');
    });
  });

  describe('changeRecommendation', () => {
    it('should update minimum version', async () => {
      const warning: Warning = {
        type: 'outdated-version',
        category: 'framework',
        detected: { name: 'Next.js', version: '13.5.0' },
        minimumVersion: '14.0.0',
        message: 'Version 13.5.0 is below recommended minimum 14.0.0',
      };

      (fs.pathExists as jest.Mock).mockResolvedValue(false);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await (handler as any).changeRecommendation(warning, mockProjectPath);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = (fs.writeFile as jest.Mock).mock.calls[0];
      const writtenData = JSON.parse(writeCall[1]);
      expect(writtenData.frameworks.minimumVersions['next-js']).toBe('13.5.0');
    });

    it('should handle missing version gracefully', async () => {
      const warning: Warning = {
        type: 'outdated-version',
        category: 'framework',
        detected: { name: 'Next.js' }, // No version
        minimumVersion: '14.0.0',
        message: 'Version is below recommended minimum',
      };

      await (handler as any).changeRecommendation(warning, mockProjectPath);

      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('ignoreWarning', () => {
    it('should save ignored warning for non-recommended tech', async () => {
      const warning: Warning = {
        type: 'non-recommended',
        category: 'framework',
        detected: { name: 'Vue' },
        message: 'Non-recommended framework detected: Vue',
      };

      const mockStandardsLoader = {
        saveUserChoices: jest.fn().mockResolvedValue(undefined),
      };
      (handler as any).standardsLoader = mockStandardsLoader;

      await (handler as any).ignoreWarning(warning, mockProjectPath);

      expect(mockStandardsLoader.saveUserChoices).toHaveBeenCalled();
      const choices = mockStandardsLoader.saveUserChoices.mock.calls[0][1];
      expect(choices.ignoredWarnings?.frameworks?.vue).toBeDefined();
    });

    it('should save ignored warning for outdated version', async () => {
      const warning: Warning = {
        type: 'outdated-version',
        category: 'framework',
        detected: { name: 'Next.js', version: '13.5.0' },
        minimumVersion: '14.0.0',
        message: 'Version 13.5.0 is below recommended minimum 14.0.0',
      };

      const mockStandardsLoader = {
        saveUserChoices: jest.fn().mockResolvedValue(undefined),
      };
      (handler as any).standardsLoader = mockStandardsLoader;

      await (handler as any).ignoreWarning(warning, mockProjectPath);

      expect(mockStandardsLoader.saveUserChoices).toHaveBeenCalled();
      const choices = mockStandardsLoader.saveUserChoices.mock.calls[0][1];
      expect(choices.ignoredWarnings?.versions?.['next-js']).toBeDefined();
      expect(choices.ignoredWarnings?.versions?.['next-js'].current).toBe('13.5.0');
      expect(choices.ignoredWarnings?.versions?.['next-js'].recommended).toBe('14.0.0');
    });
  });
});
