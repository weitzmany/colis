/**
 * Domain Manager
 * 
 * Main class for managing local domains with Caddy reverse proxy.
 */

import { CaddyManager } from './caddy-manager.js';
import { HostsManager } from './hosts-manager.js';
import { ServiceDetector } from './service-detector.js';
import { SetupOptions, DomainSetupResult, DomainConfig, DomainInfo } from './types.js';
import {
  CaddyNotInstalledError,
  DomainValidationError,
  HostsFileError,
  DomainConfigurationError,
} from './errors.js';

export class DomainManager {
  private caddyManager: CaddyManager;
  private hostsManager: HostsManager;
  private serviceDetector: ServiceDetector;

  constructor() {
    this.caddyManager = new CaddyManager();
    this.hostsManager = new HostsManager();
    this.serviceDetector = new ServiceDetector();
  }

  /**
   * Set up domain for a project
   * 
   * @param projectPath - Path to the project directory
   * @param options - Setup options including project name, ports, and domain
   * @returns Domain setup result with configuration details
   * @throws {CaddyNotInstalledError} If Caddy is not installed
   * @throws {DomainValidationError} If domain name is invalid
   * @throws {DomainConfigurationError} If domain configuration fails
   */
  async setup(projectPath: string, options: SetupOptions): Promise<DomainSetupResult> {
    // Validate inputs
    if (!projectPath || typeof projectPath !== 'string') {
      throw new DomainValidationError('Project path is required', undefined, 'projectPath');
    }

    if (!options.projectName || typeof options.projectName !== 'string') {
      throw new DomainValidationError('Project name is required', undefined, 'projectName');
    }

    // Check if Caddy is installed
    const caddyInstalled = await this.caddyManager.checkCaddyInstalled();
    if (!caddyInstalled) {
      throw new CaddyNotInstalledError(
        'Caddy is not installed. Please install it first:\n' +
        '  macOS: brew install caddy\n' +
        '  Linux: See https://caddyserver.com/docs/install\n' +
        '  Or run: domain-manager install'
      );
    }

    // Generate domain name if not provided
    const domain = options.domain || `${options.projectName}.local`;

    // Validate domain name format
    if (!this.isValidDomain(domain)) {
      throw new DomainValidationError(
        `Invalid domain name: ${domain}. Domain must end with .local and contain only alphanumeric characters, hyphens, and dots.`,
        domain,
        'domainFormat'
      );
    }

    // Detect services if ports not explicitly provided
    let frontendPort = options.frontendPort;
    let backendPort = options.backendPort;
    let port = options.port;

    if (!port && !frontendPort && !backendPort) {
      const services = await this.serviceDetector.detectServices(projectPath);
      const frontendService = services.find(s => s.name === 'frontend');
      const backendService = services.find(s => s.name === 'backend');

      if (frontendService && backendService) {
        // Multi-service project
        frontendPort = frontendService.detectedPort || 4200; // Default Angular port
        backendPort = backendService.detectedPort || 8080; // Default backend port
      } else if (frontendService) {
        frontendPort = frontendService.detectedPort || 4200;
      } else if (backendService) {
        backendPort = backendService.detectedPort || 8080;
      } else {
        // Single service - use provided port or default
        port = options.port || 3000;
      }
    }

    // Determine if multi-service
    const isMultiService = !!(frontendPort && backendPort);

    // Create domain config
    const config: DomainConfig = {
      domain,
      isMultiService,
    };

    if (isMultiService) {
      config.frontendPort = frontendPort;
      config.backendPort = backendPort;
    } else {
      config.port = port || frontendPort || backendPort || 3000;
    }

    // Add to Caddyfile
    try {
      await this.caddyManager.addDomain({
        domain,
        frontendPort: config.frontendPort,
        backendPort: config.backendPort,
        port: config.port,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new DomainConfigurationError(
        `Failed to add domain to Caddyfile: ${errorMessage}`,
        domain,
        'caddyfile_write'
      );
    }

    // Add to hosts file (unless skipped)
    let hostsUpdated = false;
    if (!options.skipHosts) {
      try {
        await this.hostsManager.addEntry(domain);
        hostsUpdated = true;
      } catch (error) {
        // Warn but don't fail - hosts file update is optional
        const errorMessage = error instanceof Error ? error.message : String(error);
        // Re-throw as HostsFileError but don't fail the entire operation
        // This allows the domain to be configured in Caddy even if hosts file update fails
        throw new HostsFileError(
          `Could not update hosts file: ${errorMessage}. Domain is configured in Caddyfile but not in hosts file.`,
          'write'
        );
      }
    }

    return {
      domain,
      caddyfileUpdated: true,
      hostsUpdated,
      config,
    };
  }

  /**
   * Remove domain configuration
   * 
   * @param domain - Domain name to remove
   * @throws {DomainValidationError} If domain name is invalid
   * @throws {DomainConfigurationError} If domain removal fails
   */
  async remove(domain: string): Promise<void> {
    // Validate domain name
    if (!domain || typeof domain !== 'string') {
      throw new DomainValidationError('Domain name is required', undefined, 'domain');
    }

    if (!this.isValidDomain(domain)) {
      throw new DomainValidationError(
        `Invalid domain name: ${domain}`,
        domain,
        'domainFormat'
      );
    }

    // Remove from Caddyfile
    try {
      await this.caddyManager.removeDomain(domain);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new DomainConfigurationError(
        `Failed to remove domain from Caddyfile: ${errorMessage}`,
        domain,
        'caddyfile_remove'
      );
    }

    // Remove from hosts file
    try {
      await this.hostsManager.removeEntry(domain);
    } catch (error) {
      // Warn but don't fail - hosts file removal is optional
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new HostsFileError(
        `Could not remove from hosts file: ${errorMessage}. Domain removed from Caddyfile but not from hosts file.`,
        'write'
      );
    }
  }

  /**
   * List all configured domains
   */
  async list(): Promise<DomainInfo[]> {
    const caddyDomains = await this.caddyManager.listDomains();
    const hostsDomains = await this.hostsManager.listEntries();

    // Merge information
    const domainMap = new Map<string, DomainInfo>();

    // Add Caddyfile domains
    for (const caddyDomain of caddyDomains) {
      domainMap.set(caddyDomain.domain, {
        ...caddyDomain,
        hostsEntry: hostsDomains.includes(caddyDomain.domain),
      });
    }

    // Add hosts-only domains (if any)
    for (const hostsDomain of hostsDomains) {
      if (!domainMap.has(hostsDomain)) {
        domainMap.set(hostsDomain, {
          domain: hostsDomain,
          config: {
            domain: hostsDomain,
            isMultiService: false,
          },
          hostsEntry: true,
        });
      }
    }

    return Array.from(domainMap.values());
  }

  /**
   * Check if Caddy is installed
   */
  async checkCaddyInstalled(): Promise<boolean> {
    return this.caddyManager.checkCaddyInstalled();
  }

  /**
   * Check if Caddy is running
   */
  async checkCaddyRunning(): Promise<boolean> {
    return this.caddyManager.checkCaddyRunning();
  }

  /**
   * Validate domain name format
   * 
   * @param domain - Domain name to validate
   * @returns True if domain is valid, false otherwise
   */
  private isValidDomain(domain: string): boolean {
    // Domain must end with .local
    if (!domain.endsWith('.local')) {
      return false;
    }

    // Domain must contain only alphanumeric characters, hyphens, and dots
    // Must not start or end with hyphen or dot (except .local)
    const domainWithoutLocal = domain.slice(0, -6); // Remove '.local'
    if (!domainWithoutLocal || domainWithoutLocal.length === 0) {
      return false;
    }

    // Check format: alphanumeric, hyphens, dots allowed
    // Cannot start or end with hyphen or dot
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return domainRegex.test(domainWithoutLocal);
  }
}

