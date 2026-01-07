/**
 * Port Manager Types
 * 
 * Type definitions for Port Manager feature.
 */

export type AppType = 'node' | 'nextjs' | 'angular' | 'react' | 'php' | 'python' | 'docker';

export type PortStatus = 'active' | 'inactive' | 'reserved';

export interface PortAssignment {
  id: number;
  projectName: string;
  projectPath: string;
  appType: AppType;
  port: number;
  status: PortStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    configFile?: string;
    envVar?: string;
    notes?: string;
    domain?: string; // Domain name (e.g., "games.local")
  };
}

export interface PortFilters {
  projectName?: string;
  appType?: AppType;
  status?: PortStatus;
  port?: number;
}

export interface ConflictReport {
  port: number;
  conflictType: 'assigned' | 'in_use' | 'mismatch';
  details: string;
  resolution?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ConfigurationResult {
  filesUpdated: string[];
  filesCreated: string[];
  errors: string[];
}

export interface ValidationResult {
  valid: boolean;
  conflicts: ConflictReport[];
  errors: string[];
}

export interface PortRange {
  start: number;
  end: number;
}

export interface PortRanges {
  [appType: string]: PortRange;
}

export interface PortManagerConfig {
  database: {
    type: 'sqlite' | 'mysql' | 'postgresql';
    sqlite?: {
      path: string;
    };
    mysql?: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
    };
    postgresql?: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
    };
  };
  portRanges?: PortRanges;
  reservedPorts?: Array<{ port: number; purpose: string }>;
}

