/**
 * Domain Manager Interfaces
 * 
 * Interface definitions for Domain Manager components to support
 * dependency injection, testability, and extensibility.
 */

import { CaddyDomainBlock, DomainInfo } from './types.js';
import { DetectedService } from './service-detector.js';

/**
 * Interface for Caddy Manager operations
 */
export interface ICaddyManager {
  /**
   * Read current Caddyfile content
   */
  readCaddyfile(): Promise<string>;

  /**
   * Add domain block to Caddyfile
   */
  addDomain(config: CaddyDomainBlock): Promise<void>;

  /**
   * Remove domain from Caddyfile
   */
  removeDomain(domain: string): Promise<void>;

  /**
   * List all domains in Caddyfile
   */
  listDomains(): Promise<DomainInfo[]>;

  /**
   * Check if Caddy is installed
   */
  checkCaddyInstalled(): Promise<boolean>;

  /**
   * Check if Caddy is running
   */
  checkCaddyRunning(): Promise<boolean>;
}

/**
 * Interface for Hosts Manager operations
 */
export interface IHostsManager {
  /**
   * Check if domain entry exists in hosts file
   */
  hasEntry(domain: string): Promise<boolean>;

  /**
   * Add domain entry to hosts file
   */
  addEntry(domain: string, ip?: string): Promise<void>;

  /**
   * Remove domain entry from hosts file
   */
  removeEntry(domain: string): Promise<void>;

  /**
   * List all .local domains in hosts file
   */
  listEntries(): Promise<string[]>;
}

/**
 * Interface for Service Detector operations
 */
export interface IServiceDetector {
  /**
   * Detect services in a project
   */
  detectServices(projectPath: string): Promise<DetectedService[]>;
}

/**
 * Domain Manager Configuration
 */
export interface DomainManagerConfig {
  /**
   * Caddyfile path (default: ~/.caddy/Caddyfile)
   */
  caddyfilePath?: string;

  /**
   * Hosts file path (default: /etc/hosts or C:\Windows\System32\drivers\etc\hosts)
   */
  hostsPath?: string;

  /**
   * Custom CaddyManager implementation (for testing/extensibility)
   */
  caddyManager?: ICaddyManager;

  /**
   * Custom HostsManager implementation (for testing/extensibility)
   */
  hostsManager?: IHostsManager;

  /**
   * Custom ServiceDetector implementation (for testing/extensibility)
   */
  serviceDetector?: IServiceDetector;
}
