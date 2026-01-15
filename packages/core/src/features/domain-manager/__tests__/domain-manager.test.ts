/**
 * Domain Manager Tests
 */

import { DomainManager } from '../domain-manager.js';
import { CaddyManager } from '../caddy-manager.js';
import { HostsManager } from '../hosts-manager.js';
import { ServiceDetector } from '../service-detector.js';
import {
  CaddyNotInstalledError,
  DomainValidationError,
  DomainConfigurationError,
  HostsFileError,
} from '../errors.js';
import { SetupOptions } from '../types.js';
import {
  ICaddyManager,
  IHostsManager,
  IServiceDetector,
} from '../interfaces.js';

// Mock dependencies
jest.mock('../caddy-manager.js');
jest.mock('../hosts-manager.js');
jest.mock('../service-detector.js');

describe('DomainManager', () => {
  let domainManager: DomainManager;
  let mockCaddyManager: jest.Mocked<ICaddyManager>;
  let mockHostsManager: jest.Mocked<IHostsManager>;
  let mockServiceDetector: jest.Mocked<IServiceDetector>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock instances
    mockCaddyManager = {
      checkCaddyInstalled: jest.fn(),
      checkCaddyRunning: jest.fn(),
      addDomain: jest.fn(),
      removeDomain: jest.fn(),
      listDomains: jest.fn(),
      readCaddyfile: jest.fn(),
    } as any;

    mockHostsManager = {
      addEntry: jest.fn(),
      removeEntry: jest.fn(),
      listEntries: jest.fn(),
      hasEntry: jest.fn(),
    } as any;

    mockServiceDetector = {
      detectServices: jest.fn(),
    } as any;

    // Create DomainManager with mocked dependencies
    domainManager = new DomainManager({
      caddyManager: mockCaddyManager,
      hostsManager: mockHostsManager,
      serviceDetector: mockServiceDetector,
    });
  });

  describe('setup', () => {
    const validOptions: SetupOptions = {
      projectName: 'test-project',
      port: 3000,
    };

    it('should validate project path', async () => {
      await expect(
        domainManager.setup('', validOptions)
      ).rejects.toThrow(DomainValidationError);
      await expect(
        domainManager.setup(null as any, validOptions)
      ).rejects.toThrow(DomainValidationError);
    });

    it('should validate project name', async () => {
      await expect(
        domainManager.setup('/path/to/project', {
          projectName: '',
        } as SetupOptions)
      ).rejects.toThrow(DomainValidationError);

      await expect(
        domainManager.setup('/path/to/project', {
          projectName: null as any,
        } as SetupOptions)
      ).rejects.toThrow(DomainValidationError);
    });

    it('should throw CaddyNotInstalledError if Caddy is not installed', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(false);

      await expect(
        domainManager.setup('/path/to/project', validOptions)
      ).rejects.toThrow(CaddyNotInstalledError);
    });

    it('should validate domain name format', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);

      await expect(
        domainManager.setup('/path/to/project', {
          ...validOptions,
          domain: 'invalid-domain', // Missing .local
        })
      ).rejects.toThrow(DomainValidationError);

      await expect(
        domainManager.setup('/path/to/project', {
          ...validOptions,
          domain: '.local', // Empty domain
        })
      ).rejects.toThrow(DomainValidationError);

      await expect(
        domainManager.setup('/path/to/project', {
          ...validOptions,
          domain: 'test@domain.local', // Invalid characters
        })
      ).rejects.toThrow(DomainValidationError);
    });

    it('should generate domain name from project name if not provided', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);
      mockHostsManager.addEntry.mockResolvedValue(undefined);

      const result = await domainManager.setup('/path/to/project', {
        projectName: 'my-project',
        port: 3000,
      });

      expect(result.domain).toBe('my-project.local');
      expect(mockCaddyManager.addDomain).toHaveBeenCalledWith({
        domain: 'my-project.local',
        port: 3000,
        frontendPort: undefined,
        backendPort: undefined,
      });
    });

    it('should setup single-service domain with provided port', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);
      mockHostsManager.addEntry.mockResolvedValue(undefined);

      const result = await domainManager.setup('/path/to/project', {
        projectName: 'test-project',
        port: 3000,
        domain: 'test.local',
      });

      expect(result.domain).toBe('test.local');
      expect(result.config.port).toBe(3000);
      expect(result.config.isMultiService).toBe(false);
      expect(mockCaddyManager.addDomain).toHaveBeenCalledWith({
        domain: 'test.local',
        port: 3000,
        frontendPort: undefined,
        backendPort: undefined,
      });
      expect(mockHostsManager.addEntry).toHaveBeenCalledWith('test.local');
    });

    it('should setup multi-service domain with frontend and backend ports', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);
      mockHostsManager.addEntry.mockResolvedValue(undefined);

      const result = await domainManager.setup('/path/to/project', {
        projectName: 'test-project',
        frontendPort: 4200,
        backendPort: 8080,
        domain: 'test.local',
      });

      expect(result.config.isMultiService).toBe(true);
      expect(result.config.frontendPort).toBe(4200);
      expect(result.config.backendPort).toBe(8080);
      expect(mockCaddyManager.addDomain).toHaveBeenCalledWith({
        domain: 'test.local',
        port: undefined,
        frontendPort: 4200,
        backendPort: 8080,
      });
    });

    it('should detect services if ports not provided', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);
      mockHostsManager.addEntry.mockResolvedValue(undefined);
      mockServiceDetector.detectServices.mockResolvedValue([
        {
          name: 'frontend',
          path: 'frontend',
          type: 'angular',
          detectedPort: 4200,
        },
        {
          name: 'backend',
          path: 'backend',
          type: 'node',
          detectedPort: 8080,
        },
      ]);

      const result = await domainManager.setup('/path/to/project', {
        projectName: 'test-project',
        domain: 'test.local',
      });

      expect(result.config.isMultiService).toBe(true);
      expect(result.config.frontendPort).toBe(4200);
      expect(result.config.backendPort).toBe(8080);
      expect(mockServiceDetector.detectServices).toHaveBeenCalledWith(
        '/path/to/project'
      );
    });

    it('should use default ports when services detected but no ports found', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);
      mockHostsManager.addEntry.mockResolvedValue(undefined);
      mockServiceDetector.detectServices.mockResolvedValue([
        {
          name: 'frontend',
          path: 'frontend',
          type: 'angular',
        },
        {
          name: 'backend',
          path: 'backend',
          type: 'node',
        },
      ]);

      const result = await domainManager.setup('/path/to/project', {
        projectName: 'test-project',
        domain: 'test.local',
      });

      expect(result.config.frontendPort).toBe(4200);
      expect(result.config.backendPort).toBe(8080);
    });

    it('should skip hosts file update if skipHosts is true', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);

      const result = await domainManager.setup('/path/to/project', {
        projectName: 'test-project',
        port: 3000,
        domain: 'test.local',
        skipHosts: true,
      });

      expect(result.hostsUpdated).toBe(false);
      expect(mockHostsManager.addEntry).not.toHaveBeenCalled();
    });

    it('should throw DomainConfigurationError if Caddyfile write fails', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockRejectedValue(
        new Error('Caddyfile write failed')
      );

      await expect(
        domainManager.setup('/path/to/project', {
          projectName: 'test-project',
          port: 3000,
          domain: 'test.local',
        })
      ).rejects.toThrow(DomainConfigurationError);
    });

    it('should throw HostsFileError if hosts file update fails', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);
      mockCaddyManager.addDomain.mockResolvedValue(undefined);
      mockHostsManager.addEntry.mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(
        domainManager.setup('/path/to/project', {
          projectName: 'test-project',
          port: 3000,
          domain: 'test.local',
        })
      ).rejects.toThrow(HostsFileError);
    });
  });

  describe('remove', () => {
    it('should validate domain name', async () => {
      await expect(
        domainManager.remove('')
      ).rejects.toThrow(DomainValidationError);

      await expect(
        domainManager.remove(null as any)
      ).rejects.toThrow(DomainValidationError);
    });

    it('should validate domain format', async () => {
      await expect(
        domainManager.remove('invalid-domain')
      ).rejects.toThrow(DomainValidationError);
    });

    it('should remove domain from Caddyfile and hosts file', async () => {
      mockCaddyManager.removeDomain.mockResolvedValue(undefined);
      mockHostsManager.removeEntry.mockResolvedValue(undefined);

      await domainManager.remove('test.local');

      expect(mockCaddyManager.removeDomain).toHaveBeenCalledWith('test.local');
      expect(mockHostsManager.removeEntry).toHaveBeenCalledWith('test.local');
    });

    it('should throw DomainConfigurationError if Caddyfile removal fails', async () => {
      mockCaddyManager.removeDomain.mockRejectedValue(
        new Error('Caddyfile error')
      );

      await expect(domainManager.remove('test.local')).rejects.toThrow(
        DomainConfigurationError
      );
    });

    it('should throw HostsFileError if hosts file removal fails', async () => {
      mockCaddyManager.removeDomain.mockResolvedValue(undefined);
      mockHostsManager.removeEntry.mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(domainManager.remove('test.local')).rejects.toThrow(
        HostsFileError
      );
    });
  });

  describe('list', () => {
    it('should merge Caddyfile and hosts file domains', async () => {
      mockCaddyManager.listDomains.mockResolvedValue([
        {
          domain: 'test1.local',
          config: {
            domain: 'test1.local',
            port: 3000,
            isMultiService: false,
          },
          caddyfileLine: 1,
        },
      ]);
      mockHostsManager.listEntries.mockResolvedValue([
        'test1.local',
        'test2.local',
      ]);

      const result = await domainManager.list();

      expect(result).toHaveLength(2);
      expect(result[0].domain).toBe('test1.local');
      expect(result[0].hostsEntry).toBe(true);
      expect(result[1].domain).toBe('test2.local');
      expect(result[1].hostsEntry).toBe(true);
    });

    it('should return empty array if no domains configured', async () => {
      mockCaddyManager.listDomains.mockResolvedValue([]);
      mockHostsManager.listEntries.mockResolvedValue([]);

      const result = await domainManager.list();

      expect(result).toEqual([]);
    });
  });

  describe('checkCaddyInstalled', () => {
    it('should return true if Caddy is installed', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(true);

      const result = await domainManager.checkCaddyInstalled();

      expect(result).toBe(true);
    });

    it('should return false if Caddy is not installed', async () => {
      mockCaddyManager.checkCaddyInstalled.mockResolvedValue(false);

      const result = await domainManager.checkCaddyInstalled();

      expect(result).toBe(false);
    });
  });

  describe('checkCaddyRunning', () => {
    it('should return true if Caddy is running', async () => {
      mockCaddyManager.checkCaddyRunning.mockResolvedValue(true);

      const result = await domainManager.checkCaddyRunning();

      expect(result).toBe(true);
    });

    it('should return false if Caddy is not running', async () => {
      mockCaddyManager.checkCaddyRunning.mockResolvedValue(false);

      const result = await domainManager.checkCaddyRunning();

      expect(result).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should use default implementations when no config provided', () => {
      const manager = new DomainManager();
      expect(manager).toBeInstanceOf(DomainManager);
    });

    it('should accept custom implementations via config', () => {
      const customCaddy = mockCaddyManager;
      const customHosts = mockHostsManager;
      const customService = mockServiceDetector;

      const manager = new DomainManager({
        caddyManager: customCaddy,
        hostsManager: customHosts,
        serviceDetector: customService,
      });

      expect(manager).toBeInstanceOf(DomainManager);
    });

    it('should accept custom Caddyfile path', () => {
      const manager = new DomainManager({
        caddyfilePath: '/custom/path/Caddyfile',
      });
      expect(manager).toBeInstanceOf(DomainManager);
    });

    it('should accept custom hosts file path', () => {
      const manager = new DomainManager({
        hostsPath: '/custom/path/hosts',
      });
      expect(manager).toBeInstanceOf(DomainManager);
    });
  });
});
