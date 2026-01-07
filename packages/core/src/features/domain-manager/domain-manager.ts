/**
 * Domain Manager
 * 
 * Main class for managing local domains with Caddy reverse proxy.
 */

import { CaddyManager } from './caddy-manager';
import { HostsManager } from './hosts-manager';
import { ServiceDetector } from './service-detector';
import { SetupOptions, DomainSetupResult, DomainConfig, DomainInfo } from './types';

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
   */
  async setup(projectPath: string, options: SetupOptions): Promise<DomainSetupResult> {
    // Check if Caddy is installed
    const caddyInstalled = await this.caddyManager.checkCaddyInstalled();
    if (!caddyInstalled) {
      throw new Error(
        'Caddy is not installed. Please install it first:\n' +
        '  macOS: brew install caddy\n' +
        '  Linux: See https://caddyserver.com/docs/install\n' +
        '  Or run: domain-manager install'
      );
    }

    // Generate domain name if not provided
    const domain = options.domain || `${options.projectName}.local`;

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
    await this.caddyManager.addDomain({
      domain,
      frontendPort: config.frontendPort,
      backendPort: config.backendPort,
      port: config.port,
    });

    // Add to hosts file (unless skipped)
    let hostsUpdated = false;
    if (!options.skipHosts) {
      try {
        await this.hostsManager.addEntry(domain);
        hostsUpdated = true;
      } catch (error: any) {
        // Warn but don't fail
        console.warn(`Warning: Could not update hosts file: ${error.message}`);
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
   */
  async remove(domain: string): Promise<void> {
    // Remove from Caddyfile
    await this.caddyManager.removeDomain(domain);

    // Remove from hosts file
    try {
      await this.hostsManager.removeEntry(domain);
    } catch (error: any) {
      // Warn but don't fail
      console.warn(`Warning: Could not remove from hosts file: ${error.message}`);
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
}

