/**
 * Port Manager Database Schema
 * 
 * Defines the database schema for port assignments.
 */

export const PORT_ASSIGNMENTS_TABLE = 'port_assignments';
export const PORT_HISTORY_TABLE = 'port_history';

export const CREATE_PORT_ASSIGNMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS ${PORT_ASSIGNMENTS_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name VARCHAR(255) NOT NULL,
    project_path VARCHAR(512) NOT NULL,
    app_type VARCHAR(50) NOT NULL,
    port INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    config_file VARCHAR(512),
    env_var VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(port),
    UNIQUE(project_name, app_type)
  )
`;

export const CREATE_PORT_ASSIGNMENTS_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_project_name ON ${PORT_ASSIGNMENTS_TABLE}(project_name);
  CREATE INDEX IF NOT EXISTS idx_app_type ON ${PORT_ASSIGNMENTS_TABLE}(app_type);
  CREATE INDEX IF NOT EXISTS idx_status ON ${PORT_ASSIGNMENTS_TABLE}(status);
  CREATE INDEX IF NOT EXISTS idx_port_status ON ${PORT_ASSIGNMENTS_TABLE}(port, status);
  CREATE INDEX IF NOT EXISTS idx_created_at ON ${PORT_ASSIGNMENTS_TABLE}(created_at);
`;

export const CREATE_PORT_HISTORY_TABLE = `
  CREATE TABLE IF NOT EXISTS ${PORT_HISTORY_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER,
    action VARCHAR(20) NOT NULL,
    user_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (assignment_id) REFERENCES ${PORT_ASSIGNMENTS_TABLE}(id)
  )
`;

export const CREATE_PORT_HISTORY_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_assignment_id ON ${PORT_HISTORY_TABLE}(assignment_id);
  CREATE INDEX IF NOT EXISTS idx_timestamp ON ${PORT_HISTORY_TABLE}(timestamp);
`;




