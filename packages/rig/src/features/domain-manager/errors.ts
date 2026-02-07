/**
 * Domain Manager Custom Errors
 * 
 * Custom error classes for Domain Manager operations.
 */

/**
 * Base error class for Domain Manager errors
 */
export class DomainManagerError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DomainManagerError';
    Object.setPrototypeOf(this, DomainManagerError.prototype);
  }
}

/**
 * Error thrown when Caddy is not installed
 */
export class CaddyNotInstalledError extends DomainManagerError {
  constructor(message: string = 'Caddy is not installed') {
    super(message, 'CADDY_NOT_INSTALLED');
    this.name = 'CaddyNotInstalledError';
    Object.setPrototypeOf(this, CaddyNotInstalledError.prototype);
  }
}

/**
 * Error thrown when Caddy is not running
 */
export class CaddyNotRunningError extends DomainManagerError {
  constructor(message: string = 'Caddy is not running') {
    super(message, 'CADDY_NOT_RUNNING');
    this.name = 'CaddyNotRunningError';
    Object.setPrototypeOf(this, CaddyNotRunningError.prototype);
  }
}

/**
 * Error thrown when domain configuration fails
 */
export class DomainConfigurationError extends DomainManagerError {
  constructor(
    message: string,
    public domain?: string,
    public reason?: string
  ) {
    super(message, 'DOMAIN_CONFIGURATION_ERROR', { domain, reason });
    this.name = 'DomainConfigurationError';
    Object.setPrototypeOf(this, DomainConfigurationError.prototype);
  }
}

/**
 * Error thrown when hosts file operation fails
 */
export class HostsFileError extends DomainManagerError {
  constructor(
    message: string,
    public operation: 'read' | 'write' | 'backup',
    public path?: string
  ) {
    super(message, 'HOSTS_FILE_ERROR', { operation, path });
    this.name = 'HostsFileError';
    Object.setPrototypeOf(this, HostsFileError.prototype);
  }
}

/**
 * Error thrown when domain validation fails
 */
export class DomainValidationError extends DomainManagerError {
  constructor(
    message: string,
    public domain?: string,
    public validationRule?: string
  ) {
    super(message, 'DOMAIN_VALIDATION_ERROR', { domain, validationRule });
    this.name = 'DomainValidationError';
    Object.setPrototypeOf(this, DomainValidationError.prototype);
  }
}

/**
 * Error thrown when Caddyfile operation fails
 */
export class CaddyfileError extends DomainManagerError {
  constructor(
    message: string,
    public operation: 'read' | 'write' | 'parse',
    public path?: string
  ) {
    super(message, 'CADDYFILE_ERROR', { operation, path });
    this.name = 'CaddyfileError';
    Object.setPrototypeOf(this, CaddyfileError.prototype);
  }
}
