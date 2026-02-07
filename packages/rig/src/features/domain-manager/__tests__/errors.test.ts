/**
 * Domain Manager Error Classes Tests
 */

import {
  DomainManagerError,
  CaddyNotInstalledError,
  CaddyNotRunningError,
  DomainConfigurationError,
  HostsFileError,
  DomainValidationError,
  CaddyfileError,
} from '../errors.js';

describe('Domain Manager Error Classes', () => {
  describe('DomainManagerError', () => {
    it('should create error with message and code', () => {
      const error = new DomainManagerError('Test error', 'TEST_CODE');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('DomainManagerError');
    });

    it('should include details when provided', () => {
      const details = { domain: 'test.local', operation: 'setup' };
      const error = new DomainManagerError('Test error', 'TEST_CODE', details);
      expect(error.details).toEqual(details);
    });

    it('should be instance of Error', () => {
      const error = new DomainManagerError('Test', 'CODE');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('CaddyNotInstalledError', () => {
    it('should create error with default message', () => {
      const error = new CaddyNotInstalledError();
      expect(error.message).toBe('Caddy is not installed');
      expect(error.code).toBe('CADDY_NOT_INSTALLED');
      expect(error.name).toBe('CaddyNotInstalledError');
    });

    it('should create error with custom message', () => {
      const error = new CaddyNotInstalledError('Custom message');
      expect(error.message).toBe('Custom message');
      expect(error.code).toBe('CADDY_NOT_INSTALLED');
    });

    it('should be instance of DomainManagerError', () => {
      const error = new CaddyNotInstalledError();
      expect(error).toBeInstanceOf(DomainManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('CaddyNotRunningError', () => {
    it('should create error with default message', () => {
      const error = new CaddyNotRunningError();
      expect(error.message).toBe('Caddy is not running');
      expect(error.code).toBe('CADDY_NOT_RUNNING');
      expect(error.name).toBe('CaddyNotRunningError');
    });

    it('should create error with custom message', () => {
      const error = new CaddyNotRunningError('Custom message');
      expect(error.message).toBe('Custom message');
    });

    it('should be instance of DomainManagerError', () => {
      const error = new CaddyNotRunningError();
      expect(error).toBeInstanceOf(DomainManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('DomainConfigurationError', () => {
    it('should create error with domain and reason', () => {
      const error = new DomainConfigurationError(
        'Configuration failed',
        'test.local',
        'caddyfile_write'
      );
      expect(error.message).toBe('Configuration failed');
      expect(error.code).toBe('DOMAIN_CONFIGURATION_ERROR');
      expect(error.domain).toBe('test.local');
      expect(error.reason).toBe('caddyfile_write');
      expect(error.name).toBe('DomainConfigurationError');
    });

    it('should include domain and reason in details', () => {
      const error = new DomainConfigurationError(
        'Test',
        'test.local',
        'caddyfile_write'
      );
      expect(error.details).toEqual({
        domain: 'test.local',
        reason: 'caddyfile_write',
      });
    });

    it('should be instance of DomainManagerError', () => {
      const error = new DomainConfigurationError('Test', 'test.local');
      expect(error).toBeInstanceOf(DomainManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('HostsFileError', () => {
    it('should create error with operation and path', () => {
      const error = new HostsFileError(
        'Hosts file error',
        'write',
        '/etc/hosts'
      );
      expect(error.message).toBe('Hosts file error');
      expect(error.code).toBe('HOSTS_FILE_ERROR');
      expect(error.operation).toBe('write');
      expect(error.path).toBe('/etc/hosts');
      expect(error.name).toBe('HostsFileError');
    });

    it('should include operation and path in details', () => {
      const error = new HostsFileError('Test', 'read', '/etc/hosts');
      expect(error.details).toEqual({
        operation: 'read',
        path: '/etc/hosts',
      });
    });

    it('should be instance of DomainManagerError', () => {
      const error = new HostsFileError('Test', 'write');
      expect(error).toBeInstanceOf(DomainManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('DomainValidationError', () => {
    it('should create error with domain and validation rule', () => {
      const error = new DomainValidationError(
        'Invalid domain',
        'invalid-domain',
        'domainFormat'
      );
      expect(error.message).toBe('Invalid domain');
      expect(error.code).toBe('DOMAIN_VALIDATION_ERROR');
      expect(error.domain).toBe('invalid-domain');
      expect(error.validationRule).toBe('domainFormat');
      expect(error.name).toBe('DomainValidationError');
    });

    it('should include domain and validation rule in details', () => {
      const error = new DomainValidationError(
        'Test',
        'test.local',
        'domainFormat'
      );
      expect(error.details).toEqual({
        domain: 'test.local',
        validationRule: 'domainFormat',
      });
    });

    it('should be instance of DomainManagerError', () => {
      const error = new DomainValidationError('Test', 'test.local');
      expect(error).toBeInstanceOf(DomainManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('CaddyfileError', () => {
    it('should create error with operation and path', () => {
      const error = new CaddyfileError(
        'Caddyfile error',
        'read',
        '~/.caddy/Caddyfile'
      );
      expect(error.message).toBe('Caddyfile error');
      expect(error.code).toBe('CADDYFILE_ERROR');
      expect(error.operation).toBe('read');
      expect(error.path).toBe('~/.caddy/Caddyfile');
      expect(error.name).toBe('CaddyfileError');
    });

    it('should include operation and path in details', () => {
      const error = new CaddyfileError('Test', 'write', '/path/to/file');
      expect(error.details).toEqual({
        operation: 'write',
        path: '/path/to/file',
      });
    });

    it('should be instance of DomainManagerError', () => {
      const error = new CaddyfileError('Test', 'read');
      expect(error).toBeInstanceOf(DomainManagerError);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
