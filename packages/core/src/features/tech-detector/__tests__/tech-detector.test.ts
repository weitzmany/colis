/**
 * Tech Detector Tests
 * 
 * Unit tests for the main TechDetector class.
 */

import { TechDetector } from '../tech-detector.js';
import { FrameworkDetector } from '../detectors/framework-detector.js';
import { LanguageDetector } from '../detectors/language-detector.js';
import { BuildToolDetector } from '../detectors/build-tool-detector.js';
import { PackageManagerDetector } from '../detectors/package-manager-detector.js';
import { RuntimeDetector } from '../detectors/runtime-detector.js';
import { TechStack } from '../types.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import { jest } from '@jest/globals';

// Mock detectors
jest.mock('../detectors/framework-detector.js');
jest.mock('../detectors/language-detector.js');
jest.mock('../detectors/build-tool-detector.js');
jest.mock('../detectors/package-manager-detector.js');
jest.mock('../detectors/runtime-detector.js');
jest.mock('fs-extra');

describe('TechDetector', () => {
  let detector: TechDetector;
  let mockFrameworkDetector: jest.Mocked<FrameworkDetector>;
  let mockLanguageDetector: jest.Mocked<LanguageDetector>;
  let mockBuildToolDetector: jest.Mocked<BuildToolDetector>;
  let mockPackageManagerDetector: jest.Mocked<PackageManagerDetector>;
  let mockRuntimeDetector: jest.Mocked<RuntimeDetector>;

  beforeEach(() => {
    // Create mock instances
    mockFrameworkDetector = {
      detect: jest.fn(),
    } as any;

    mockLanguageDetector = {
      detect: jest.fn(),
    } as any;

    mockBuildToolDetector = {
      detect: jest.fn(),
    } as any;

    mockPackageManagerDetector = {
      detect: jest.fn(),
    } as any;

    mockRuntimeDetector = {
      detect: jest.fn(),
    } as any;

    // Mock constructors
    (FrameworkDetector as jest.Mock).mockImplementation(() => mockFrameworkDetector);
    (LanguageDetector as jest.Mock).mockImplementation(() => mockLanguageDetector);
    (BuildToolDetector as jest.Mock).mockImplementation(() => mockBuildToolDetector);
    (PackageManagerDetector as jest.Mock).mockImplementation(() => mockPackageManagerDetector);
    (RuntimeDetector as jest.Mock).mockImplementation(() => mockRuntimeDetector);

    detector = new TechDetector();
    jest.clearAllMocks();
  });

  describe('detect', () => {
    it('should detect complete tech stack', async () => {
      const projectPath = '/test/project';

      mockFrameworkDetector.detect.mockResolvedValue({
        name: 'Next.js',
        type: 'nextjs',
        version: '14.0.0',
      });

      mockLanguageDetector.detect.mockResolvedValue([
        {
          name: 'TypeScript',
          type: 'typescript',
          version: '5.0.0',
          primary: true,
        },
      ]);

      mockBuildToolDetector.detect.mockResolvedValue([
        {
          name: 'Vite',
          type: 'vite',
          version: '5.0.0',
        },
      ]);

      mockPackageManagerDetector.detect.mockResolvedValue({
        name: 'npm',
        type: 'npm',
        version: '9.0.0',
      });

      mockRuntimeDetector.detect.mockResolvedValue({
        name: 'Node.js',
        type: 'node',
        version: '20.0.0',
      });

      const techStack = await detector.detect(projectPath);

      expect(techStack.framework).toBeDefined();
      expect(techStack.framework?.name).toBe('Next.js');
      expect(techStack.languages).toHaveLength(1);
      expect(techStack.buildTools).toHaveLength(1);
      expect(techStack.packageManager.name).toBe('npm');
      expect(techStack.runtime?.name).toBe('Node.js');
      expect(techStack.detectedAt).toBeDefined();
      expect(techStack.version).toBe('1.0.0');
    });

    it('should handle missing optional components', async () => {
      const projectPath = '/test/project';

      mockFrameworkDetector.detect.mockResolvedValue(null);
      mockLanguageDetector.detect.mockResolvedValue([]);
      mockBuildToolDetector.detect.mockResolvedValue([]);
      mockPackageManagerDetector.detect.mockResolvedValue({
        name: 'npm',
        type: 'npm',
      });
      mockRuntimeDetector.detect.mockResolvedValue(null);

      const techStack = await detector.detect(projectPath);

      expect(techStack.framework).toBeUndefined();
      expect(techStack.languages).toEqual([]);
      expect(techStack.buildTools).toEqual([]);
      expect(techStack.packageManager.name).toBe('npm');
      expect(techStack.runtime).toBeUndefined();
    });

    it('should run all detectors in parallel', async () => {
      const projectPath = '/test/project';

      mockFrameworkDetector.detect.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(null), 10)));
      mockLanguageDetector.detect.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 10)));
      mockBuildToolDetector.detect.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 10)));
      mockPackageManagerDetector.detect.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ name: 'npm', type: 'npm' }), 10)));
      mockRuntimeDetector.detect.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(null), 10)));

      const startTime = Date.now();
      await detector.detect(projectPath);
      const endTime = Date.now();

      // Should complete in roughly 10ms (parallel) not 50ms (sequential)
      expect(endTime - startTime).toBeLessThan(30);
    });
  });

  describe('save', () => {
    it('should save tech stack to .core-tech.json', async () => {
      const projectPath = '/test/project';
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '14.0.0',
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

      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await detector.save(projectPath, techStack);

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.core-tech.json'),
        expect.stringContaining('Next.js'),
        'utf-8'
      );
    });

    it('should handle write errors', async () => {
      const projectPath = '/test/project';
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

      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write failed'));

      await expect(detector.save(projectPath, techStack)).rejects.toThrow();
    });
  });

  describe('load', () => {
    it('should load tech stack from .core-tech.json', async () => {
      const projectPath = '/test/project';
      const techStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '14.0.0',
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

      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(techStack));

      const loaded = await detector.load(projectPath);

      expect(loaded).toBeDefined();
      expect(loaded?.framework?.name).toBe('Next.js');
    });

    it('should return null when file does not exist', async () => {
      const projectPath = '/test/project';

      (fs.pathExists as jest.Mock).mockResolvedValue(false);

      const loaded = await detector.load(projectPath);

      expect(loaded).toBeNull();
    });

    it('should return null when file is invalid JSON', async () => {
      const projectPath = '/test/project';

      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('invalid json');

      const loaded = await detector.load(projectPath);

      expect(loaded).toBeNull();
    });
  });

  describe('update', () => {
    it('should update existing tech stack', async () => {
      const projectPath = '/test/project';
      const existingStack: TechStack = {
        framework: {
          name: 'Next.js',
          type: 'nextjs',
          version: '13.0.0',
        },
        languages: [],
        buildTools: [],
        packageManager: {
          name: 'npm',
          type: 'npm',
        },
        detectedAt: '2024-01-01T00:00:00.000Z',
        version: '1.0.0',
      };

      mockFrameworkDetector.detect.mockResolvedValue({
        name: 'Next.js',
        type: 'nextjs',
        version: '14.0.0',
      });
      mockLanguageDetector.detect.mockResolvedValue([]);
      mockBuildToolDetector.detect.mockResolvedValue([]);
      mockPackageManagerDetector.detect.mockResolvedValue({
        name: 'npm',
        type: 'npm',
      });
      mockRuntimeDetector.detect.mockResolvedValue(null);

      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(existingStack));

      const updated = await detector.update(projectPath);

      expect(updated.framework?.version).toBe('14.0.0');
      expect(updated.detectedAt).not.toBe(existingStack.detectedAt);
      expect(updated.version).toBe('1.0.0');
    });

    it('should create new tech stack when none exists', async () => {
      const projectPath = '/test/project';

      mockFrameworkDetector.detect.mockResolvedValue({
        name: 'Next.js',
        type: 'nextjs',
        version: '14.0.0',
      });
      mockLanguageDetector.detect.mockResolvedValue([]);
      mockBuildToolDetector.detect.mockResolvedValue([]);
      mockPackageManagerDetector.detect.mockResolvedValue({
        name: 'npm',
        type: 'npm',
      });
      mockRuntimeDetector.detect.mockResolvedValue(null);

      (fs.pathExists as jest.Mock).mockResolvedValue(false);

      const updated = await detector.update(projectPath);

      expect(updated.framework?.name).toBe('Next.js');
      expect(updated.detectedAt).toBeDefined();
    });
  });
});
