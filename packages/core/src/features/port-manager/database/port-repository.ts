/**
 * Port-Specific Database Repository
 * 
 * Implements port assignment database operations using shared DatabaseRepository.
 */

import { DatabaseRepository } from '../../../shared/database/repository';
import { PortAssignment, PortFilters } from '../types';
import { PORT_ASSIGNMENTS_TABLE, PORT_HISTORY_TABLE } from './schema';

export class PortRepository {
  constructor(private db: DatabaseRepository) {}

  /**
   * Get port assignment by project name and app type
   */
  async getPort(projectName: string, appType: string): Promise<PortAssignment | null> {
    const results = await this.db.query<PortAssignment>(
      `SELECT * FROM ${PORT_ASSIGNMENTS_TABLE} WHERE project_name = ? AND app_type = ?`,
      [projectName, appType]
    );
    return results.length > 0 ? this.mapToPortAssignment(results[0]) : null;
  }

  /**
   * Get port assignment by port number
   */
  async getByPort(port: number): Promise<PortAssignment | null> {
    const results = await this.db.query<PortAssignment>(
      `SELECT * FROM ${PORT_ASSIGNMENTS_TABLE} WHERE port = ?`,
      [port]
    );
    return results.length > 0 ? this.mapToPortAssignment(results[0]) : null;
  }

  /**
   * Assign a port to a project
   */
  async assignPort(assignment: Omit<PortAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    await this.db.execute(
      `INSERT INTO ${PORT_ASSIGNMENTS_TABLE} 
       (project_name, project_path, app_type, port, status, config_file, env_var, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assignment.projectName,
        assignment.projectPath,
        assignment.appType,
        assignment.port,
        assignment.status || 'active',
        assignment.metadata?.configFile || null,
        assignment.metadata?.envVar || null,
        assignment.metadata?.notes || null,
      ]
    );
  }

  /**
   * Update port assignment
   */
  async updatePort(
    projectName: string,
    appType: string,
    updates: Partial<PortAssignment>
  ): Promise<void> {
    const setClauses: string[] = [];
    const values: any[] = [];

    if (updates.port !== undefined) {
      setClauses.push('port = ?');
      values.push(updates.port);
    }
    if (updates.status !== undefined) {
      setClauses.push('status = ?');
      values.push(updates.status);
    }
    if (updates.metadata?.configFile !== undefined) {
      setClauses.push('config_file = ?');
      values.push(updates.metadata.configFile);
    }
    if (updates.metadata?.envVar !== undefined) {
      setClauses.push('env_var = ?');
      values.push(updates.metadata.envVar);
    }
    if (updates.metadata?.notes !== undefined) {
      setClauses.push('notes = ?');
      values.push(updates.metadata.notes);
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP');
    values.push(projectName, appType);

    await this.db.execute(
      `UPDATE ${PORT_ASSIGNMENTS_TABLE} SET ${setClauses.join(', ')} 
       WHERE project_name = ? AND app_type = ?`,
      values
    );
  }

  /**
   * Release port assignment
   */
  async releasePort(projectName: string, appType: string): Promise<void> {
    await this.db.execute(
      `UPDATE ${PORT_ASSIGNMENTS_TABLE} SET status = 'inactive', updated_at = CURRENT_TIMESTAMP 
       WHERE project_name = ? AND app_type = ?`,
      [projectName, appType]
    );
  }

  /**
   * List port assignments with filters
   */
  async listPorts(filters: PortFilters = {}): Promise<PortAssignment[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.projectName) {
      conditions.push('project_name = ?');
      values.push(filters.projectName);
    }
    if (filters.appType) {
      conditions.push('app_type = ?');
      values.push(filters.appType);
    }
    if (filters.status) {
      conditions.push('status = ?');
      values.push(filters.status);
    }
    if (filters.port) {
      conditions.push('port = ?');
      values.push(filters.port);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const results = await this.db.query<PortAssignment>(
      `SELECT * FROM ${PORT_ASSIGNMENTS_TABLE} ${whereClause} ORDER BY created_at DESC`,
      values
    );

    return results.map((row) => this.mapToPortAssignment(row));
  }

  /**
   * Check if port is available
   */
  async checkAvailability(port: number): Promise<boolean> {
    const results = await this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${PORT_ASSIGNMENTS_TABLE} 
       WHERE port = ? AND status = 'active'`,
      [port]
    );
    return results[0].count === 0;
  }

  /**
   * Reserve a port
   */
  async reservePort(port: number, purpose: string): Promise<void> {
    await this.db.execute(
      `INSERT INTO ${PORT_ASSIGNMENTS_TABLE} 
       (project_name, project_path, app_type, port, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(port) DO UPDATE SET status = 'reserved', notes = ?`,
      ['_reserved', '_reserved', 'reserved', port, 'reserved', purpose, purpose]
    );
  }

  /**
   * Get port history
   */
  async getHistory(projectName?: string): Promise<any[]> {
    let query = `SELECT * FROM ${PORT_HISTORY_TABLE}`;
    const values: any[] = [];

    if (projectName) {
      query += ` WHERE assignment_id IN (
        SELECT id FROM ${PORT_ASSIGNMENTS_TABLE} WHERE project_name = ?
      )`;
      values.push(projectName);
    }

    query += ' ORDER BY timestamp DESC';
    return this.db.query(query, values);
  }

  /**
   * Add history entry
   */
  async addHistory(
    assignmentId: number | null,
    action: string,
    userId?: string,
    details?: string
  ): Promise<void> {
    await this.db.execute(
      `INSERT INTO ${PORT_HISTORY_TABLE} (assignment_id, action, user_id, details)
       VALUES (?, ?, ?, ?)`,
      [assignmentId, action, userId || null, details || null]
    );
  }

  /**
   * Find available port in range
   */
  async findAvailablePortInRange(start: number, end: number): Promise<number | null> {
    const results = await this.db.query<{ port: number }>(
      `SELECT port FROM ${PORT_ASSIGNMENTS_TABLE} 
       WHERE port BETWEEN ? AND ? AND status = 'active' 
       ORDER BY port`,
      [start, end]
    );

    const usedPorts = new Set(results.map((r) => r.port));

    for (let port = start; port <= end; port++) {
      if (!usedPorts.has(port)) {
        return port;
      }
    }

    return null;
  }

  /**
   * Map database row to PortAssignment
   */
  private mapToPortAssignment(row: Record<string, any>): PortAssignment {
    return {
      id: row.id,
      projectName: row.project_name,
      projectPath: row.project_path,
      appType: row.app_type,
      port: row.port,
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      metadata: {
        configFile: row.config_file || undefined,
        envVar: row.env_var || undefined,
        notes: row.notes || undefined,
      },
    };
  }
}

