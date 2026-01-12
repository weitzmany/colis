/**
 * Port Manager
 * 
 * Main class providing the public API for Port Manager feature.
 */

import { DatabaseFactory, DatabaseRepository, MigrationManager } from '../../shared/database/index.js';
import { PortRepository } from './database/port-repository.js';
import { RegistryManager } from './core/registry.js';
import { PortAllocator } from './core/allocator.js';
import { ConflictDetector } from './core/validator.js';
import { ConfigurationManager } from './core/configurator.js';
import { initialSchemaMigration } from './database/migrations/001_initial_schema.js';
import {
  PortManagerConfig,
  PortAssignment,
  AppType,
  PortFilters,
  ValidationResult,
  ConfigurationResult,
  ConflictReport,
} from './types.js';
import {
  PortConflictError,
  PortInUseError,
  PortAssignmentNotFoundError,
} from './errors.js';

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
   * 
   * Updates project configuration files with the assigned port.
   * Can be called with either projectName/appType or projectPath.
   * 
   * @param projectNameOrPath - Project name (if using registry) or project path (if configuring directly)
   * @param appTypeOrPort - App type (if using registry) or port number (if configuring directly)
   * @param portOrAppType - Port number (if using registry) or app type (if configuring directly)
   * @param autoConfigureOrUndefined - Auto-configure flag (if using registry) or undefined (if configuring directly)
   */
  async configure(
    projectNameOrPath: string,
    appTypeOrPort: AppType | number,
    portOrAppType?: number | AppType,
    autoConfigureOrUndefined?: boolean
  ): Promise<ConfigurationResult> {
    // Overload 1: configure(projectName, appType, port, autoConfigure?)
    if (typeof appTypeOrPort === 'string' && typeof portOrAppType === 'number') {
      const projectName = projectNameOrPath;
      const appType = appTypeOrPort as AppType;
      const port = portOrAppType;
      const autoConfigure = autoConfigureOrUndefined !== false;

      const assignment = await this.repository.getPort(projectName, appType);
      if (!assignment) {
        throw new PortAssignmentNotFoundError(
          `Port assignment not found for ${projectName} (${appType})`,
          projectName,
          appType
        );
      }

      const configurator = new ConfigurationManager(assignment.projectPath);
      return configurator.configure(projectName, appType, port, autoConfigure);
    }

    // Overload 2: configure(projectPath, port, appType) - matches PRD API example
    if (typeof appTypeOrPort === 'number' && typeof portOrAppType === 'string') {
      const projectPath = projectNameOrPath;
      const port = appTypeOrPort;
      const appType = portOrAppType as AppType;

      // Try to find assignment by project path
      const assignments = await this.repository.listPorts({});
      const assignment = assignments.find(
        (a) => a.projectPath === projectPath && a.appType === appType && a.port === port
      );

      if (!assignment) {
        throw new PortAssignmentNotFoundError(
          `Port assignment not found for path "${projectPath}" with port ${port} (${appType}). ` +
          `Use allocate() first or provide projectName/appType.`
        );
      }

      const configurator = new ConfigurationManager(projectPath);
      return configurator.configure(assignment.projectName, appType, port, true);
    }

    throw new Error('Invalid configure() arguments. Use configure(projectName, appType, port) or configure(projectPath, port, appType)');
  }

  /**
   * Detect conflicts for a project path
   * 
   * This method scans a project directory and detects all port conflicts,
   * including registry conflicts, system port usage, and configuration mismatches.
   * 
   * @param projectPath - Path to the project directory
   * @returns Array of conflict reports
   */
  async detectConflicts(projectPath: string): Promise<ConflictReport[]> {
    // Find all port assignments for this project path
    const assignments = await this.repository.listPorts({});
    const projectAssignments = assignments.filter(
      (a) => a.projectPath === projectPath
    );

    const allConflicts: ConflictReport[] = [];

    for (const assignment of projectAssignments) {
      const validation = await this.detector.validate(
        assignment.projectName,
        assignment.projectPath,
        assignment.appType,
        assignment.port
      );
      allConflicts.push(...validation.conflicts);
    }

    return allConflicts;
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
   * Reserve a port for special purposes
   * 
   * Reserves a port in the registry to prevent it from being allocated
   * to other projects. Useful for reserving ports for future projects,
   * service ports (databases, Redis), or testing environments.
   * 
   * @param port - Port number to reserve
   * @param purpose - Purpose for the reservation (e.g., "Future project", "MySQL service")
   * @param notes - Optional additional notes about the reservation
   */
  async reservePort(port: number, purpose: string, notes?: string): Promise<void> {
    // Check if port is already assigned to an active project
    const existing = await this.repository.getByPort(port);
    if (existing && existing.status === 'active') {
      throw new PortConflictError(
        `Port ${port} is already assigned to project "${existing.projectName}" (${existing.appType}). ` +
        `Release it first before reserving.`,
        port,
        existing.projectName,
        'assigned'
      );
    }

    // Check if port is in use on the system
    const inUse = await this.detector.checkPortInUse(port);
    if (inUse) {
      throw new PortInUseError(
        `Port ${port} is currently in use by another process. ` +
        `Stop the process before reserving this port.`,
        port
      );
    }

    const notesText = notes ? `${purpose}. ${notes}` : purpose;
    await this.repository.reservePort(port, notesText);
    
    // Add history entry
    const reserved = await this.repository.getByPort(port);
    if (reserved) {
      await this.repository.addHistory(reserved.id, 'reserved', undefined, `Reserved: ${notesText}`);
    }
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

