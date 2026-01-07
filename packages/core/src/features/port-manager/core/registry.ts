/**
 * Registry Manager
 * 
 * Manages the port assignment registry using the database repository.
 */

import { PortRepository } from '../database/port-repository';
import { PortAssignment, PortFilters, PortStatus } from '../types';

export class RegistryManager {
  constructor(private repository: PortRepository) {}

  /**
   * Get port assignment for a project
   */
  async getPort(projectName: string, appType: string): Promise<PortAssignment | null> {
    return this.repository.getPort(projectName, appType);
  }

  /**
   * Get port assignment by port number
   */
  async getByPort(port: number): Promise<PortAssignment | null> {
    return this.repository.getByPort(port);
  }

  /**
   * List all port assignments with optional filters
   */
  async listPorts(filters: PortFilters = {}): Promise<PortAssignment[]> {
    return this.repository.listPorts(filters);
  }

  /**
   * Check if a port is available
   */
  async checkAvailability(port: number): Promise<boolean> {
    return this.repository.checkAvailability(port);
  }

  /**
   * Release a port assignment
   */
  async releasePort(projectName: string, appType: string): Promise<void> {
    await this.repository.releasePort(projectName, appType);
    const assignment = await this.repository.getPort(projectName, appType);
    if (assignment) {
      await this.repository.addHistory(assignment.id, 'released');
    }
  }

  /**
   * Update port assignment status
   */
  async updateStatus(
    projectName: string,
    appType: string,
    status: PortStatus
  ): Promise<void> {
    await this.repository.updatePort(projectName, appType, { status });
    const assignment = await this.repository.getPort(projectName, appType);
    if (assignment) {
      await this.repository.addHistory(assignment.id, 'status_updated', undefined, `Status changed to ${status}`);
    }
  }

  /**
   * Get port history for a project
   */
  async getHistory(projectName?: string): Promise<any[]> {
    return this.repository.getHistory(projectName);
  }
}

