/**
 * Domain Manager Types
 * 
 * Type definitions for Domain Manager feature.
 */

export interface SetupOptions {
  projectName: string;
  port?: number; // Single port for single-service projects
  frontendPort?: number; // Frontend port for multi-service
  backendPort?: number; // Backend port for multi-service
  domain?: string; // Custom domain name (optional, auto-generated if not provided)
  skipHosts?: boolean; // Skip hosts file update
}

export interface DomainSetupResult {
  domain: string;
  caddyfileUpdated: boolean;
  hostsUpdated: boolean;
  config: DomainConfig;
}

export interface DomainConfig {
  domain: string;
  frontendPort?: number;
  backendPort?: number;
  port?: number; // For single-service
  isMultiService: boolean;
}

export interface DomainInfo {
  domain: string;
  config: DomainConfig;
  caddyfileLine?: number; // Line number in Caddyfile
  hostsEntry?: boolean; // Whether entry exists in hosts file
}

export interface CaddyDomainBlock {
  domain: string;
  frontendPort?: number;
  backendPort?: number;
  port?: number;
}

