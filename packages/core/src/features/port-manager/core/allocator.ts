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
  private defaultRanges: { [key: string]: PortRange } = {
    node: { start: 3001, end: 3099 },      // Skip 3000 (default)
    nextjs: { start: 3001, end: 3099 },   // Skip 3000 (default)
    angular: { start: 4201, end: 4299 },  // Skip 4200 (default)
    react: { start: 4001, end: 4099 },    // Skip 4000 (default)
    python: { start: 5001, end: 5099 },  // Skip 5000 (default)
    php: { start: 8001, end: 8099 },      // Skip 8000 (default)
    docker: { start: 3001, end: 3999 },   // Skip 3000 (default)
  };

  /**
   * Default ports that should never be assigned by Port Manager
   * These are reserved for projects that don't use Port Manager
   */
  private reservedDefaultPorts: number[] = [3000, 4200, 4000, 5000, 8000];

  constructor(
    private repository: PortRepository,
    private customRanges?: { [key: string]: PortRange }
  ) {}

  /**
   * Allocate a port for a project
   */
  async allocate(
    projectName: string,
    _projectPath: string,
    appType: AppType,
    preferredPort?: number
  ): Promise<number> {
    // Check if port is already assigned
    const existing = await this.repository.getPort(projectName, appType);
    if (existing && existing.status === 'active') {
      return existing.port;
    }

    // If preferred port is provided, check if it's available
    if (preferredPort) {
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
    const range = this.getRangeForAppType(appType);
    let port = await this.repository.findAvailablePortInRange(range.start, range.end);

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

