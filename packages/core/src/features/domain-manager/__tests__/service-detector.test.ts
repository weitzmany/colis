/**
 * Service Detector Tests
 */

import { ServiceDetector } from '../service-detector.js';
import * as fs from 'fs-extra';

jest.mock('fs-extra');
const pathExistsMock = jest.spyOn(fs, 'pathExists') as jest.MockedFunction<any>;
const readFileMock = jest.spyOn(fs, 'readFile') as jest.MockedFunction<any>;

describe('ServiceDetector', () => {
  let serviceDetector: ServiceDetector;

  beforeEach(() => {
    jest.clearAllMocks();
    serviceDetector = new ServiceDetector();
  });

  describe('detectServices', () => {
    const projectPath = '/path/to/project';

    it('should detect frontend service in frontend directory', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.includes('frontend') && filePath.endsWith('angular.json')) {
          return Promise.resolve(true);
        }
        if (filePath.includes('frontend')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockResolvedValue('{}');

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('frontend');
      expect(result[0].path).toBe('frontend');
      expect(result[0].type).toBe('angular');
    });

    it('should detect frontend service in web directory', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.includes('web') && filePath.endsWith('package.json')) {
          return Promise.resolve(true);
        }
        if (filePath.includes('web')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockResolvedValue(
        JSON.stringify({ dependencies: { react: '^18.0.0' } })
      );

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('frontend');
      expect(result[0].path).toBe('web');
      expect(result[0].type).toBe('react');
    });

    it('should detect backend service in backend directory', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.includes('backend') && filePath.endsWith('package.json')) {
          return Promise.resolve(true);
        }
        if (filePath.includes('backend')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockResolvedValue('{}');

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('backend');
      expect(result[0].path).toBe('backend');
      expect(result[0].type).toBe('node');
    });

    it('should detect backend service in api directory', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.includes('api') && filePath.endsWith('composer.json')) {
          return Promise.resolve(true);
        }
        if (filePath.includes('api')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('backend');
      expect(result[0].path).toBe('api');
      expect(result[0].type).toBe('php');
    });

    it('should detect both frontend and backend services', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (
          filePath.includes('frontend') ||
          filePath.includes('backend') ||
          (filePath.includes('package.json') && !filePath.includes('api'))
        ) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockResolvedValue('{}');

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toHaveLength(2);
      expect(result.find((s) => s.name === 'frontend')).toBeDefined();
      expect(result.find((s) => s.name === 'backend')).toBeDefined();
    });

    it('should detect root-level Angular project', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.endsWith('angular.json')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockResolvedValue('{}');

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('root');
      expect(result[0].type).toBe('angular');
    });

    it('should detect port from angular.json', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.endsWith('angular.json')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockImplementation((filePath: string) => {
        if (filePath.endsWith('angular.json')) {
          return Promise.resolve(
            JSON.stringify({
              projects: {
                'my-project': {
                  architect: {
                    serve: {
                      options: {
                        port: 4200,
                      },
                    },
                  },
                },
              },
            })
          );
        }
        return Promise.resolve('{}');
      });

      const result = await serviceDetector.detectServices(projectPath);

      expect(result[0].detectedPort).toBe(4200);
    });

    it('should detect port from package.json scripts', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.endsWith('package.json')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockResolvedValue(
        JSON.stringify({
          scripts: {
            start: 'node server.js --port 3000',
          },
        })
      );

      const result = await serviceDetector.detectServices(projectPath);

      expect(result[0].detectedPort).toBe(3000);
    });

    it('should detect port from .env file', async () => {
      pathExistsMock.mockImplementation((filePath: string) => {
        if (filePath.endsWith('.env') || filePath.endsWith('package.json')) {
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      });
      readFileMock.mockImplementation((filePath: string) => {
        if (filePath.endsWith('.env')) {
          return Promise.resolve('PORT=8080\n');
        }
        return Promise.resolve('{}');
      });

      const result = await serviceDetector.detectServices(projectPath);

      expect(result[0].detectedPort).toBe(8080);
    });

    it('should return empty array if no services detected', async () => {
      pathExistsMock.mockResolvedValue(false);

      const result = await serviceDetector.detectServices(projectPath);

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      pathExistsMock.mockResolvedValue(true);
      readFileMock.mockRejectedValue(new Error('Read failed'));

      const result = await serviceDetector.detectServices(projectPath);

      // Should not throw, but may return empty or partial results
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
