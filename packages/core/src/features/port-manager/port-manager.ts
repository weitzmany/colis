/**
 * Port Manager
 * 
 * Main class providing the public API for Port Manager feature.
 */

import { DatabaseFactory, DatabaseRepository, MigrationManager } from '../../shared/database';
import { PortRepository } from './database/port-repository';
import { RegistryManager } from './core/registry';
import { PortAllocator } from './core/allocator';
import { ConflictDetector } from './core/validator';
import { ConfigurationManager } from './core/configurator';
import { initialSchemaMigration } from './database/migrations/001_initial_schema';
import {
  PortManagerConfig,
  PortAssignment,
  AppType,
  PortFilters,
  ValidationResult,
  ConfigurationResult,
} from './types';

export class PortManager {
  private db: DatabaseRepository;
  private repository: PortRepository;
  private registry: RegistryManager;
  private allocator: PortAllocator;
  private detector: ConflictDetector;
  private migrationManager: MigrationManager;

  constructor(config: PortManagerConfig) {
    this.db = DatabaseFactory.create(config.database);
    this.repository = new PortRepository(this.db);
    this.registry = new RegistryManager(this.repository);
    this.allocator = new PortAllocator(this.repository, config.portRanges);
    this.detector = new ConflictDetector(this.repository);
    this.migrationManager = new MigrationManager(this.db);
    this.migrationManager.register(initialSchemaMigration);
  }

  /**
   * Connect to database
   */
  async connect(): Promise<void> {
    await this.db.connect();
    await this.migrationManager.migrate();
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    await this.db.disconnect();
  }

  /**
   * Allocate a port for a project
   */
  async allocate(
    projectName: string,
    projectPath: string,
    appType: AppType,
    preferredPort?: number
  ): Promise<number> {
    const port = await this.allocator.allocate(projectName, projectPath, appType, preferredPort);

    // Check if already assigned
    const existing = await this.repository.getPort(projectName, appType);
    if (existing) {
      if (existing.port !== port) {
        await this.repository.updatePort(projectName, appType, { port, status: 'active' });
        await this.repository.addHistory(existing.id, 'port_updated', undefined, `Port changed to ${port}`);
      }
    } else {
      // Create new assignment
      await this.repository.assignPort({
        projectName,
        projectPath,
        appType,
        port,
        status: 'active',
      });
      const assignment = await this.repository.getPort(projectName, appType);
      if (assignment) {
        await this.repository.addHistory(assignment.id, 'allocated');
      }
    }

    return port;
  }

  /**
   * Get port assignment for a project
   */
  async getPort(projectName: string, appType: AppType): Promise<PortAssignment | null> {
    return this.registry.getPort(projectName, appType);
  }

  /**
   * Get port assignment by port number
   */
  async getByPort(port: number): Promise<PortAssignment | null> {
    return this.registry.getByPort(port);
  }

  /**
   * List port assignments with filters
   */
  async listPorts(filters: PortFilters = {}): Promise<PortAssignment[]> {
    return this.registry.listPorts(filters);
  }

  /**
   * Release a port assignment
   */
  async release(projectName: string, appType: AppType): Promise<void> {
    await this.registry.releasePort(projectName, appType);
  }

  /**
   * Check if a port is available
   */
  async checkAvailability(port: number): Promise<boolean> {
    return this.registry.checkAvailability(port);
  }

  /**
   * Configure project with port assignment
   */
  async configure(
    projectName: string,
    appType: AppType,
    port: number,
    autoConfigure: boolean = true
  ): Promise<ConfigurationResult> {
    const assignment = await this.repository.getPort(projectName, appType);
    if (!assignment) {
      throw new Error(`Port assignment not found for ${projectName} (${appType})`);
    }

    const configurator = new ConfigurationManager(assignment.projectPath);
    return configurator.configure(projectName, appType, port, autoConfigure);
  }

  /**
   * Validate port assignments and detect conflicts
   */
  async validate(projectName?: string): Promise<ValidationResult> {
    if (projectName) {
      const assignment = await this.repository.getPort(projectName, 'node'); // Get any assignment for project
      if (!assignment) {
        return {
          valid: true,
          conflicts: [],
          errors: [],
        };
      }
      return this.detector.validate(assignment.projectName, assignment.projectPath, assignment.appType, assignment.port);
    }
    return this.detector.validateAll();
  }

  /**
   * Run database migrations
   */
  async migrate(): Promise<void> {
    await this.migrationManager.migrate();
  }

  /**
   * Get port history
   */
  async getHistory(projectName?: string): Promise<any[]> {
    return this.registry.getHistory(projectName);
  }
}

