/**
 * Port Allocator
 * 
 * Handles port allocation logic, including range management and conflict detection.
 */

import { PortRepository } from '../database/port-repository.js';
import { AppType, PortRange } from '../types.js';
import { PortConflictError, PortRangeExhaustedError, PortInUseError } from '../errors.js';
import * as net from 'net';

export class PortAllocator {
  /**
   * Port ranges organized by technology
   * Each tech gets 100 ports in a dedicated, non-overlapping range
   * 
   * Frontend Frameworks (3xxx-4xxx):
   * - React:     3001-3099 (default 3000 reserved)
   * - Next.js:   3101-3199 (default 3100 reserved)
   * - Node:      3201-3299
   * - Angular:   4201-4299 (default 4200 reserved)
   * 
   * Backend Frameworks (5xxx):
   * - Vue:       5001-5099 (default 5000 reserved)
   * - Python:    5101-5199 (Django, Flask)
   * 
   * Mobile & Native (8xxx):
   * - PHP:       8001-8099 (default 8000 reserved)
   * - React Native: 8101-8199 (default 8081 reserved)
   * - Expo:      8201-8299
   * - Ionic:     8301-8399 (default 8300 reserved)
   * - Flutter:   8401-8499
   * 
   * Infrastructure (9xxx):
   * - Docker:    9001-9099 (default 9000 reserved)
   */
  private defaultRanges: { [key: string]: PortRange } = {
    // Frontend Frameworks (3xxx-4xxx)
    react: { start: 3001, end: 3099 },      // Skip 3000 (default)
    nextjs: { start: 3101, end: 3199 },     // Skip 3100 (default)
    node: { start: 3201, end: 3299 },       // Express, Fastify, etc.
    angular: { start: 4201, end: 4299 },    // Skip 4200 (default)

    // Backend Frameworks (5xxx)
    vue: { start: 5001, end: 5099 },        // Skip 5000 (default)
    python: { start: 5101, end: 5199 },     // Django, Flask

    // Mobile & Native (8xxx)
    php: { start: 8001, end: 8099 },        // Skip 8000 (default)
    slim: { start: 8001, end: 8099 },       // Slim uses same range as PHP
    'react-native': { start: 8101, end: 8199 }, // Skip 8081/8100 (defaults)
    expo: { start: 8201, end: 8299 },       // Expo projects
    ionic: { start: 8301, end: 8399 },      // Skip 8300 (default)
    flutter: { start: 8401, end: 8499 },    // Flutter web

    // Infrastructure (9xxx)
    docker: { start: 9001, end: 9099 },     // Skip 9000 (default)
  };

  /**
   * Default ports that should never be assigned by Port Manager
   * These are reserved for projects that don't use Port Manager
   */
  private reservedDefaultPorts: number[] = [
    3000,   // React/Node.js default
    3100,   // Next.js default
    4200,   // Angular default
    5000,   // Vue/Python default
    8000,   // PHP default
    8081,   // React Native Metro bundler default
    8100,   // React Native alternative
    8300,   // Ionic default
    9000,   // Docker default
  ];

  constructor(
    private repository: PortRepository,
    private customRanges?: { [key: string]: PortRange }
  ) { }

  /**
   * Allocate a port for a project
   */
  async allocate(
    projectName: string,
    _projectPath: string,
    appType: AppType,
    preferredPort?: number
  ): Promise<number> {
    // DEBUG: Log allocation attempt
    console.log(`[DEBUG allocator] Allocating port for ${projectName} (${appType})`);
    console.log(`[DEBUG allocator] preferredPort: ${preferredPort || 'undefined'}`);

    // Check if port is already assigned
    const existing = await this.repository.getPort(projectName, appType);
    if (existing && existing.status === 'active') {
      console.log(`[DEBUG allocator] Found existing assignment: port ${existing.port}`);
      return existing.port;
    }

    // If preferred port is provided, check if it's available
    if (preferredPort) {
      console.log(`[DEBUG allocator] Checking preferred port ${preferredPort}`);
      // Reject if it's a reserved default port
      if (this.reservedDefaultPorts.includes(preferredPort)) {
        throw new PortConflictError(
          `Port ${preferredPort} is a default port and is reserved for projects not using Port Manager. ` +
          `Please use a different port (e.g., ${preferredPort + 1})`,
          preferredPort,
          undefined,
          'reserved'
        );
      }
      const available = await this.repository.checkAvailability(preferredPort);
      if (!available) {
        const existing = await this.repository.getByPort(preferredPort);
        throw new PortConflictError(
          `Port ${preferredPort} is already assigned to project "${existing?.projectName || 'unknown'}"`,
          preferredPort,
          existing?.projectName,
          'assigned'
        );
      }
      const portAvailable = await this.checkPortInUse(preferredPort);
      if (!portAvailable) {
        throw new PortInUseError(
          `Port ${preferredPort} is currently in use on the system`,
          preferredPort
        );
      }
      if (portAvailable) {
        return preferredPort;
      }
    }

    // Find available port in range
    console.log(`[DEBUG allocator] Finding available port in range`);
    const range = this.getRangeForAppType(appType);
    console.log(`[DEBUG allocator] Range: ${range.start}-${range.end}`);
    let port = await this.repository.findAvailablePortInRange(range.start, range.end);
    console.log(`[DEBUG allocator] findAvailablePortInRange returned: ${port}`);

    if (!port) {
      throw new PortRangeExhaustedError(
        `No available ports in range ${range.start}-${range.end} for app type ${appType}`,
        appType,
        range
      );
    }

    // Safety check: Never assign reserved default ports (even if somehow returned)
    if (this.reservedDefaultPorts.includes(port)) {
      // Try to find next available port
      port = await this.repository.findAvailablePortInRange(port + 1, range.end);
      if (!port) {
        throw new PortRangeExhaustedError(
          `No available ports in range ${range.start}-${range.end} for app type ${appType} ` +
          `(default ports are reserved for unmanaged projects)`,
          appType,
          range
        );
      }
    }

    // Check if port is actually in use on the system
    const portAvailable = await this.checkPortInUse(port);
    if (!portAvailable) {
      throw new PortInUseError(
        `Port ${port} is already in use on the system`,
        port
      );
    }

    return port;
  }

  /**
   * Get port range for app type
   */
  getRangeForAppType(appType: AppType): PortRange {
    if (this.customRanges && this.customRanges[appType]) {
      return this.customRanges[appType];
    }
    return this.defaultRanges[appType] || this.defaultRanges.node;
  }

  /**
   * Check if a port is in use on the system
   */
  async checkPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  }

  /**
   * Validate port is in range for app type
   */
  validatePortInRange(port: number, appType: AppType): boolean {
    const range = this.getRangeForAppType(appType);
    return port >= range.start && port <= range.end;
  }

  /**
   * Get next available port in range
   */
  async getNextAvailablePort(appType: AppType): Promise<number | null> {
    const range = this.getRangeForAppType(appType);
    return this.repository.findAvailablePortInRange(range.start, range.end);
  }
}

