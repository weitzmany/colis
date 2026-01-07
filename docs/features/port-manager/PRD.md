# Port Manager - PRD

**Feature Name**: Port Manager  
**Type**: Core Feature (part of `@your-org/core` package)  
**Status**: Planning  
**Priority**: P1 (High)  
**Created**: 2026-01-05
**Package Architecture**: Core Package Feature

## Package Context

Port Manager is a **core feature** within the `@your-org/core` package. The core package contains:

- **Features**: Port Manager, Authentication, Database Tools, and more
- **Rules**: Cursor rules, expert personas, user rules
- **Commands**: Cursor commands for common tasks
- **Shared Utilities**: Database abstractions, configuration utilities

Other packages (e.g., `@your-org/task-manager`) depend on `@your-org/core` and can use Port Manager along with other core features.

See [Package Architecture Strategy](../../architecture/PACKAGE_ARCHITECTURE.md) for details.

## Overview

Port Manager is a core feature in `@your-org/core` that eliminates port conflicts and simplifies development workflow. It automatically manages port assignments across all your projects through a centralized registry, ensuring consistent configuration and preventing conflicts before they happen.

**Installation**:
```bash
# Install core package (includes Port Manager and other features)
npm install @your-org/core

# Use Port Manager
import { PortManager } from '@your-org/core/features/port-manager';
```

**As Part of Feature Package**:
```bash
# Install feature package (automatically includes core)
npm install @your-org/task-manager

# Port Manager available via core dependency
import { PortManager } from '@your-org/core/features/port-manager';
```

## Problem Statement

### Current Issues

1. **Manual Port Management**: Developers must manually check and assign ports
2. **Port Conflicts**: Multiple projects can use the same port, causing conflicts
3. **Inconsistent Configuration**: Different projects use different methods to configure ports
4. **No Central Registry**: Port assignments are scattered across documentation
5. **No Validation**: No automated checking for port conflicts before starting applications

### Pain Points

- **Time Wasted**: Starting a new project requires manual port checking (5-10 minutes per project)
- **Late Discovery**: Port conflicts discovered only when starting applications, causing frustrating delays
- **Inconsistent Setup**: Different projects use different port configuration methods, making maintenance difficult
- **No Visibility**: Difficult to track which ports are in use across multiple projects
- **Manual Work**: No automated enforcement means developers must remember and enforce conventions manually

## Solution

Port Manager solves these problems with an intelligent npm package that:

1. **Central Port Registry**: Maintains a single source of truth for all port assignments in a local database (MySQL or SQLite)
2. **Smart Port Allocation**: Automatically finds and assigns the perfect port for your project type in seconds
3. **Automatic Configuration**: Updates your project files with the correct port settings, so you don't have to
4. **Proactive Conflict Prevention**: Detects and prevents port conflicts before you start your application
5. **Simple CLI Commands**: Easy-to-use command-line tools that work the way you expect
6. **Framework Integration**: Works seamlessly with Next.js, Angular, Express, React, and Docker

## Goals

### Primary Goals

1. **Automate Port Management**: Eliminate manual port checking and assignment
2. **Prevent Conflicts**: Automatically detect and prevent port conflicts
3. **Enforce Consistency**: Ensure all projects follow the same port configuration patterns
4. **Central Registry**: Maintain a single source of truth for port assignments
5. **Developer Experience**: Make port management seamless and transparent

### Success Metrics

### Quantitative Metrics

- **Port Conflict Rate**: Zero port conflicts across all projects (target: 0%)
- **Configuration Consistency**: 100% of projects use consistent port configuration
- **Time to Port Assignment**: Port assignment time reduced from minutes to seconds (target: < 5 seconds)
- **Validation Coverage**: Automated validation on every project start (target: 100%)
- **Adoption Rate**: Percentage of projects using port manager (target: 80% within 6 months)
- **Developer Satisfaction**: Developer satisfaction score (target: > 4.5/5.0)

### Qualitative Metrics

- **Developer Experience**: Seamless, transparent port management
- **Team Consistency**: Uniform port configuration across team projects
- **Error Reduction**: Elimination of port-related development blockers
- **Onboarding Time**: Reduced time for new developers to set up projects

## Target Users

### Primary Users

- **Developers**: Working on multiple projects simultaneously
  - **Pain Points**: Manual port checking, conflicts when starting projects
  - **Goals**: Fast project setup, no port conflicts, consistent configuration
  - **Usage Frequency**: Daily (every project start)
  
- **DevOps Engineers**: Managing development environments
  - **Pain Points**: Inconsistent port configurations, difficult environment management
  - **Goals**: Standardized environments, automated port management
  - **Usage Frequency**: Weekly (environment setup, validation)
  
- **Team Leads**: Ensuring consistency across team projects
  - **Pain Points**: Team members using different ports, conflicts in shared environments
  - **Goals**: Team-wide consistency, reduced onboarding friction
  - **Usage Frequency**: Monthly (team setup, project reviews)

### User Personas

#### Persona 1: Solo Developer (Sarah)
- **Role**: Full-stack developer working on 3-5 projects
- **Experience**: 3-5 years
- **Pain Points**: 
  - Forgets which ports are in use
  - Spends 5-10 minutes checking ports when starting projects
  - Occasional port conflicts when switching between projects
- **Goals**: 
  - Instant port allocation
  - No manual port checking
  - Automatic conflict prevention
- **Success Criteria**: Can start any project in < 10 seconds without port issues

#### Persona 2: DevOps Engineer (Mike)
- **Role**: Managing development infrastructure for 20+ projects
- **Experience**: 5-8 years
- **Pain Points**:
  - Inconsistent port configurations across projects
  - Difficult to track which ports are assigned
  - Manual documentation maintenance
- **Goals**:
  - Centralized port registry
  - Automated configuration enforcement
  - Easy port auditing and validation
- **Success Criteria**: Can validate all projects' port configurations in < 1 minute

#### Persona 3: Team Lead (Jennifer)
- **Role**: Leading team of 5-10 developers
- **Experience**: 7+ years
- **Pain Points**:
  - New team members struggle with port setup
  - Team members use different port configurations
  - Port conflicts in shared development environments
- **Goals**:
  - Standardized port management across team
  - Reduced onboarding time
  - Zero port-related blockers
- **Success Criteria**: New team members can set up projects in < 5 minutes

### Use Cases

1. **Starting a New Project**: Automatically allocate and configure port
   - **User**: Developer
   - **Frequency**: Weekly
   - **Value**: Saves 5-10 minutes per project setup

2. **Starting Existing Project**: Validate port availability and configuration
   - **User**: Developer
   - **Frequency**: Daily
   - **Value**: Prevents conflicts, ensures consistency

3. **Checking Port Status**: Query which ports are in use
   - **User**: Developer, DevOps Engineer
   - **Frequency**: As needed
   - **Value**: Quick visibility into port assignments

4. **Resolving Conflicts**: Automatically resolve port conflicts
   - **User**: Developer
   - **Frequency**: Occasional (when conflicts occur)
   - **Value**: Eliminates development blockers

5. **Project Migration**: Migrate existing projects to use port manager
   - **User**: DevOps Engineer, Team Lead
   - **Frequency**: One-time per project
   - **Value**: Standardizes existing projects

## Features

### Core Features

#### 1. Port Registry

**What It Does**: Maintains a centralized database that tracks every port assignment across all your projects, giving you complete visibility and control.

**Requirements**:
- Store project name, app type, port number, status
- Support MySQL and SQLite backends
- Automatic database initialization
- Migration support for schema updates

**Data Model**:
```typescript
interface PortAssignment {
  id: number;
  projectName: string;
  appType: 'node' | 'nextjs' | 'angular' | 'react' | 'php' | 'python' | 'docker';
  port: number;
  status: 'active' | 'inactive' | 'reserved';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    configFile?: string;
    envVar?: string;
    notes?: string;
  };
}
```

#### 2. Automatic Port Allocation

**What It Does**: Instantly finds and assigns the perfect available port for your project type, eliminating guesswork and manual checking.

**Requirements**:
- Allocate ports based on type-specific ranges
- Check port availability (not in use, not assigned)
- Reserve port in registry
- Return port number for configuration

**Port Ranges**:
- Node.js/Next.js/Express: 3000-3099
- React/Vite: 4000-4099
- Angular: 4200-4299
- Python: 5000-5099
- PHP: 8000-8099

**API**:
```typescript
async function allocatePort(
  projectName: string,
  appType: AppType,
  preferredPort?: number
): Promise<number>
```

#### 3. Port Conflict Detection

**What It Does**: Proactively identifies port conflicts before you start your application, preventing frustrating "port already in use" errors.

**Requirements**:
- Check if port is already assigned to another project
- Check if port is currently in use by a process
- Validate port configuration matches registry
- Report conflicts with details

**API**:
```typescript
async function detectConflicts(
  projectPath: string
): Promise<ConflictReport[]>

interface ConflictReport {
  port: number;
  conflictType: 'assigned' | 'in_use' | 'mismatch';
  details: string;
  resolution?: string;
}
```

#### 4. Configuration Enforcement

**What It Does**: Automatically updates your project configuration files with the correct port settings, ensuring consistency across all your projects.

**Requirements**:
- Update `.env.example` with PORT variable
- Update `package.json` scripts with port
- Update `angular.json` for Angular projects
- Update `docker-compose.yml` for Docker projects
- Create/update configuration files as needed

**Supported Frameworks**:
- Next.js (`.env.local`, `package.json`)
- Angular (`angular.json`, `package.json`)
- Express/Node.js (`.env.example`, `package.json`)
- React/Vite (`vite.config.js`, `package.json`)
- Docker (`docker-compose.yml`)

**API**:
```typescript
async function configurePort(
  projectPath: string,
  port: number,
  appType: AppType
): Promise<ConfigurationResult>

interface ConfigurationResult {
  filesUpdated: string[];
  filesCreated: string[];
  errors: string[];
}
```

#### 5. CLI Tools

**What It Does**: Provides intuitive command-line tools that make port management effortless.

**Available Commands**:

1. **`port-manager init`** - Set up port management for your project
   - Automatically detects your application type
   - Allocates the perfect port
   - Configures all project files

2. **`port-manager check`** - Verify your port setup
   - Shows current port status
   - Detects any conflicts
   - Validates your configuration

3. **`port-manager allocate`** - Get a new port for your project
   - Finds an available port
   - Updates the registry
   - Configures your project files

4. **`port-manager list`** - View all port assignments
   - See all assigned ports at a glance
   - Filter by project, type, or status
   - Quick overview of your port usage

5. **`port-manager release`** - Free up a port
   - Release a port assignment
   - Mark it as available for other projects

6. **`port-manager validate`** - Check everything is correct
   - Validates all your projects
   - Checks for conflicts
   - Reports any inconsistencies

7. **`port-manager migrate`** - Bring existing projects into the system
   - Register your existing port
   - Update configuration files
   - Start managing it automatically

#### 6. Framework Integration

**What It Does**: Seamlessly integrates with your favorite frameworks, automatically handling port configuration so you can focus on building.

**Supported Frameworks**:

1. **Next.js** - Works out of the box
   - Automatically uses your allocated port when running `next dev`
   - Updates `.env.local` with the correct port
   - No manual configuration needed

2. **Angular** - Full Angular CLI support
   - Integrates with `ng serve` command
   - Automatically uses your allocated port
   - Updates `angular.json` configuration

3. **Express/Node.js** - Simple integration
   - Provides port validation middleware
   - Auto-configures from the registry
   - Works with any Express application

4. **Docker Compose** - Container support
   - Validates your port mappings
   - Suggests optimal port allocations
   - Updates `docker-compose.yml` automatically

#### 7. Database Backend

**What It Does**: Supports multiple database backends, so you can choose what works best for your environment—from local development to team collaboration.

**Supported Backends**:
- **MySQL**: For shared development environments
- **SQLite**: For local development (default)
- **PostgreSQL**: Alternative option

**Database Schema**:

The schema follows database best practices with proper normalization, indexing, and data integrity:

```sql
CREATE TABLE port_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(255) NOT NULL,
  project_path VARCHAR(512) NOT NULL,
  app_type VARCHAR(50) NOT NULL,
  port INT NOT NULL,
  status ENUM('active', 'inactive', 'reserved') DEFAULT 'active',
  config_file VARCHAR(512),
  env_var VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_port (port),
  UNIQUE KEY unique_project (project_name, app_type),
  INDEX idx_project_name (project_name),
  INDEX idx_app_type (app_type),
  INDEX idx_status (status),
  INDEX idx_port_status (port, status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Schema Design Principles

**1. Normalization**
- **3NF Compliance**: All non-key attributes depend only on the primary key
- **No Redundancy**: Project name and path stored once per assignment
- **Atomic Values**: Each field contains a single value

**2. Data Integrity**
- **Primary Key**: Auto-incrementing ID for unique identification
- **Unique Constraints**: 
  - `unique_port`: Ensures no two assignments use the same port
  - `unique_project`: Ensures no duplicate project/app_type combinations
- **NOT NULL Constraints**: Required fields cannot be null
- **ENUM Constraints**: Status limited to valid values

**3. Indexing Strategy**

**Primary Indexes**:
- `PRIMARY KEY (id)`: Fast lookups by ID
- `UNIQUE KEY unique_port (port)`: Fast port availability checks
- `UNIQUE KEY unique_project (project_name, app_type)`: Fast project lookups

**Secondary Indexes**:
- `idx_project_name`: Optimize queries filtering by project name
- `idx_app_type`: Optimize queries filtering by application type
- `idx_status`: Optimize queries filtering by status
- `idx_port_status`: Composite index for port availability queries (port + status)
- `idx_created_at`: Optimize queries sorting by creation date

**Index Selection Rationale**:
- Indexes on frequently queried columns (project_name, app_type, status)
- Composite index (port, status) for common query pattern: "find available port"
- Covering index strategy for read-heavy workloads

**4. Data Types Optimization**

**String Types**:
- `VARCHAR(255)`: Project names (reasonable max length)
- `VARCHAR(512)`: File paths (accommodate long paths)
- `VARCHAR(50)`: App types (limited enum-like values)
- `TEXT`: Notes (unlimited length for flexibility)

**Numeric Types**:
- `INT`: Port numbers (0-65535 range, sufficient)
- `INT AUTO_INCREMENT`: IDs (efficient auto-increment)

**Temporal Types**:
- `TIMESTAMP`: Created/updated timestamps (automatic management)

**5. Character Set and Collation**
- `utf8mb4`: Full UTF-8 support (emojis, international characters)
- `utf8mb4_unicode_ci`: Case-insensitive Unicode collation

#### Query Optimization

**Common Query Patterns**:

1. **Port Availability Check**:
```sql
-- Optimized with composite index (port, status)
SELECT COUNT(*) FROM port_assignments 
WHERE port = ? AND status = 'active';
```

2. **Find Available Port in Range**:
```sql
-- Optimized with index on port
SELECT MIN(port) FROM port_assignments 
WHERE app_type = ? AND port BETWEEN ? AND ? AND status = 'active';
```

3. **List Ports by Project**:
```sql
-- Optimized with index on project_name
SELECT * FROM port_assignments 
WHERE project_name = ? 
ORDER BY created_at DESC;
```

4. **List Ports by App Type**:
```sql
-- Optimized with index on app_type
SELECT * FROM port_assignments 
WHERE app_type = ? AND status = 'active';
```

**Query Performance Targets**:
- Port availability check: < 10ms
- Port allocation query: < 50ms
- List operations: < 100ms (with pagination)

#### Migration Strategy

**Versioned Migrations**:
- Sequential migration files (001_initial_schema.sql, 002_add_history.sql, etc.)
- Migration tracking table to record applied migrations
- Rollback support for each migration

**Migration Best Practices**:
- **Backward Compatible**: Additive changes preferred
- **Data Preservation**: Never drop columns without migration path
- **Transaction Safety**: Migrations wrapped in transactions
- **Testing**: Test migrations on staging before production

**Example Migration Structure**:
```sql
-- migrations/001_initial_schema.sql
CREATE TABLE port_assignments (...);

-- migrations/002_add_history_table.sql
CREATE TABLE port_history (...);

-- migrations/003_add_composite_index.sql
CREATE INDEX idx_port_status ON port_assignments(port, status);
```

#### Database-Specific Considerations

**SQLite**:
- Simpler schema (no AUTO_INCREMENT, use INTEGER PRIMARY KEY)
- File-based, single-user access
- Good for local development

**MySQL**:
- Full feature set (AUTO_INCREMENT, ENUM, etc.)
- Connection pooling required
- InnoDB engine for transactions

**PostgreSQL**:
- SERIAL instead of AUTO_INCREMENT
- Better JSON support for metadata
- Advanced indexing options (GIN, GiST)

**Configuration**:
```json
{
  "database": {
    "type": "sqlite" | "mysql" | "postgresql",
    "sqlite": {
      "path": "~/.port-manager/registry.db"
    },
    "mysql": {
      "host": "localhost",
      "port": 3306,
      "database": "port_manager",
      "user": "port_manager",
      "password": "***"
    }
  }
}
```

### Advanced Features

#### 8. Port Reservation

**What It Does**: Lock down specific ports for special purposes, ensuring they're always available when you need them.

**When to Use**:
- **Future Projects**: Reserve ports for projects you're planning to start
- **Service Ports**: Reserve ports for databases, Redis, and other services
- **Testing Environments**: Reserve ports for dedicated test environments

**API**:
```typescript
async function reservePort(
  port: number,
  purpose: string,
  notes?: string
): Promise<void>
```

#### 9. Port History

**What It Does**: Maintains a complete audit trail of all port assignments and changes, so you always know what happened and when.

**What You Get**:
- **Assignment Tracking**: See when ports were assigned or released
- **Change History**: Track all configuration changes over time
- **Audit Trail**: Complete record for troubleshooting and compliance

#### 10. Multi-Project Support

**What It Does**: Manages ports across your entire project portfolio, giving you a unified view and preventing conflicts between projects.

**Capabilities**:
- **Auto-Discovery**: Automatically scans and detects all your projects
- **Batch Operations**: Validate or configure multiple projects at once
- **Cross-Project Safety**: Prevents conflicts across all your projects

#### 11. Port Range Management

**What It Does**: Lets you customize port ranges for different application types, giving you full control over port allocation.

**Features**:
- **Custom Ranges**: Define your own port ranges for each app type
- **Range Validation**: Ensures ports stay within defined ranges
- **Conflict Prevention**: Detects conflicts within and across port ranges

#### 12. CI/CD Integration

**What It Does**: Integrates with your CI/CD pipeline to catch port issues before they reach production.

**Pipeline Features**:
- **Pre-Commit Hooks**: Validate ports before code is committed
- **CI Validation**: Automated port conflict checks in your CI pipeline
- **Automated Allocation**: Allocate ports automatically in CI environments

## Technical Architecture

### System Architecture Overview

Port Manager follows a **layered architecture pattern** with clear separation of concerns:

1. **Presentation Layer**: CLI interface for user interaction
2. **Application Layer**: Core business logic (allocation, validation, configuration)
3. **Data Access Layer**: Database abstraction with multiple backend support
4. **Integration Layer**: Framework-specific adapters

### Package Structure (Within Core)

Port Manager is structured as a feature module within the core package:

```
@your-org/core/
├── src/
│   ├── features/
│   │   └── port-manager/        # Port Manager feature module
│   │       ├── index.ts         # Public API export
│   │       ├── cli/
│   │       │   ├── commands/
│   │       │   │   ├── init.ts
│   │       │   │   ├── check.ts
│   │       │   │   ├── allocate.ts
│   │       │   │   ├── list.ts
│   │       │   │   ├── release.ts
│   │       │   │   ├── validate.ts
│   │       │   │   └── migrate.ts
│   │       │   └── index.ts
│   │       ├── core/
│   │       │   ├── registry.ts
│   │       │   ├── allocator.ts
│   │       │   ├── validator.ts
│   │       │   └── configurator.ts
│   │       ├── database/
│   │       │   ├── interfaces.ts
│   │       │   ├── mysql.ts
│   │       │   ├── sqlite.ts
│   │       │   ├── postgresql.ts
│   │       │   └── migrations/
│   │       ├── frameworks/
│   │       │   ├── interfaces.ts
│   │       │   ├── nextjs.ts
│   │       │   ├── angular.ts
│   │       │   ├── express.ts
│   │       │   ├── react.ts
│   │       │   └── docker.ts
│   │       └── utils/
│   │           ├── port-checker.ts
│   │           ├── file-updater.ts
│   │           └── project-detector.ts
│   ├── shared/                  # Shared utilities (used by port-manager)
│   │   ├── database/            # Database abstractions
│   │   │   ├── repository.ts
│   │   │   ├── sqlite.ts
│   │   │   └── mysql.ts
│   │   └── config/              # Configuration utilities
│   └── index.ts                 # Core package exports
├── bin/
│   └── port-manager             # CLI binary
├── package.json
├── tsconfig.json
└── README.md
```

**Note**: Port Manager uses core's shared database abstractions from `shared/database/` but can also have feature-specific database implementations if needed.

### Architecture Patterns

#### 1. Repository Pattern (Data Access Layer)

**Purpose**: Abstract database operations behind a consistent interface

**Implementation**:
```typescript
interface DatabaseRepository {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getPort(projectName: string, appType: string): Promise<PortAssignment | null>;
  assignPort(assignment: PortAssignment): Promise<void>;
  releasePort(projectName: string, appType: string): Promise<void>;
  listPorts(filters: PortFilters): Promise<PortAssignment[]>;
  checkAvailability(port: number): Promise<boolean>;
  reservePort(port: number, purpose: string): Promise<void>;
  getHistory(projectName?: string): Promise<PortHistory[]>;
}
```

**Benefits**:
- Database-agnostic business logic
- Easy to swap database backends
- Testable with mock implementations
- Consistent API across all databases

#### 2. Strategy Pattern (Database Backends)

**Purpose**: Allow runtime selection of database implementation

**Implementation**:
```typescript
class DatabaseFactory {
  static create(config: DatabaseConfig): DatabaseRepository {
    switch (config.type) {
      case 'sqlite':
        return new SQLiteRepository(config.sqlite);
      case 'mysql':
        return new MySQLRepository(config.mysql);
      case 'postgresql':
        return new PostgreSQLRepository(config.postgresql);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
}
```

**Benefits**:
- Flexible deployment options
- Environment-specific optimization
- Easy to add new database backends

#### 3. Factory Pattern (Framework Detection)

**Purpose**: Create framework-specific configuration handlers

**Implementation**:
```typescript
interface FrameworkHandler {
  detect(projectPath: string): boolean;
  configure(projectPath: string, port: number): Promise<ConfigurationResult>;
  validate(projectPath: string): Promise<ValidationResult>;
}

class FrameworkFactory {
  static create(appType: AppType): FrameworkHandler {
    switch (appType) {
      case 'nextjs':
        return new NextJSHandler();
      case 'angular':
        return new AngularHandler();
      case 'express':
        return new ExpressHandler();
      // ... other frameworks
    }
  }
}
```

**Benefits**:
- Extensible framework support
- Isolated framework logic
- Easy to add new frameworks

#### 4. Command Pattern (CLI Interface)

**Purpose**: Encapsulate CLI operations as first-class objects

**Implementation**:
```typescript
interface Command {
  execute(args: CommandArgs): Promise<CommandResult>;
  validate(args: CommandArgs): ValidationResult;
}

class InitCommand implements Command {
  constructor(
    private registry: RegistryManager,
    private allocator: PortAllocator,
    private configurator: ConfigurationManager
  ) {}
  
  async execute(args: InitArgs): Promise<CommandResult> {
    // Command implementation
  }
}
```

**Benefits**:
- Consistent command interface
- Easy to add new commands
- Testable command logic
- Undo/redo capability (future enhancement)

### System Components and Responsibilities

#### 1. Registry Manager

**Responsibility**: Manage port assignments in database

**Architecture Role**: Data Access Layer - Repository implementation

**Key Methods**:
- `getPort(projectName, appType)`: Get assigned port
- `assignPort(projectName, appType, port)`: Assign port
- `releasePort(projectName, appType)`: Release port
- `listPorts(filters)`: List all ports with filtering
- `checkAvailability(port)`: Check if port is available
- `reservePort(port, purpose)`: Reserve port for special use
- `getHistory(projectName?)`: Get port assignment history

**Dependencies**:
- DatabaseRepository (injected)
- Configuration (port ranges, reserved ports)

**Design Considerations**:
- Thread-safe operations for concurrent access
- Transaction support for atomic operations
- Caching layer for frequently accessed ports (future)

#### 2. Port Allocator

**Responsibility**: Allocate available ports based on rules

**Architecture Role**: Application Layer - Business logic

**Key Methods**:
- `allocate(projectName, appType, preferredPort?)`: Allocate port with conflict checking
- `findAvailablePort(appType, startPort)`: Find next available port in range
- `validatePortRange(port, appType)`: Validate port is in correct range
- `checkSystemPort(port)`: Check if port is in use by system

**Dependencies**:
- RegistryManager (for port availability)
- PortChecker (for system port checking)
- Configuration (port ranges)

**Design Considerations**:
- Efficient port search algorithm (binary search for sorted ports)
- Port range exhaustion handling
- Preferred port fallback logic

#### 3. Conflict Detector

**Responsibility**: Detect port conflicts proactively

**Architecture Role**: Application Layer - Validation logic

**Key Methods**:
- `detectConflicts(projectPath)`: Detect all conflicts in project
- `checkPortInUse(port)`: Check if port is currently in use by process
- `checkPortAssigned(port)`: Check if port is assigned to another project
- `validateConfiguration(projectPath)`: Validate project config matches registry
- `generateConflictReport(conflicts)`: Generate detailed conflict report

**Dependencies**:
- RegistryManager (for registry conflicts)
- PortChecker (for system port checking)
- FrameworkDetector (for configuration validation)

**Design Considerations**:
- Comprehensive conflict detection (registry, system, configuration)
- Clear conflict reporting with resolution suggestions
- Performance optimization for batch validation

#### 4. Configuration Manager

**Responsibility**: Update project configuration files

**Architecture Role**: Application Layer - Integration logic

**Key Methods**:
- `configure(projectPath, port, appType)`: Configure project with port
- `updateEnvFile(projectPath, port)`: Update .env files
- `updatePackageJson(projectPath, port)`: Update package.json scripts
- `updateAngularJson(projectPath, port)`: Update angular.json
- `updateDockerCompose(projectPath, port)`: Update docker-compose.yml
- `backupConfiguration(projectPath)`: Backup before modification

**Dependencies**:
- FrameworkHandler (framework-specific configuration)
- FileUpdater (file system operations)

**Design Considerations**:
- Atomic file updates (write to temp, then replace)
- Backup before modification
- Idempotent operations (safe to run multiple times)
- Framework-specific configuration patterns

#### 5. Framework Detector

**Responsibility**: Detect project framework type

**Architecture Role**: Application Layer - Detection logic

**Key Methods**:
- `detectFramework(projectPath)`: Detect framework from project files
- `detectAppType(projectPath)`: Detect app type (node, python, php, etc.)
- `getConfigFiles(projectPath, appType)`: Get relevant config files
- `validateFramework(projectPath, appType)`: Validate framework detection

**Dependencies**:
- File system access
- Framework-specific detection rules

**Design Considerations**:
- Fast detection (check common files first)
- Fallback detection strategies
- Confidence scoring for ambiguous cases

### Data Flow and Interactions

#### Port Allocation Flow

```
User Command (CLI)
    ↓
Command Handler
    ↓
Port Allocator
    ├──→ Registry Manager (check availability)
    ├──→ Port Checker (check system ports)
    └──→ Configuration Manager (update files)
    ↓
Framework Handler (framework-specific config)
    ↓
File Updater (write configuration)
    ↓
Registry Manager (persist assignment)
    ↓
Success Response
```

#### Conflict Detection Flow

```
User Command (check/validate)
    ↓
Conflict Detector
    ├──→ Registry Manager (check registry conflicts)
    ├──→ Port Checker (check system ports)
    ├──→ Framework Detector (get configuration)
    └──→ Configuration Manager (validate config)
    ↓
Conflict Report Generator
    ↓
Detailed Conflict Report
```

### Technology Stack and Rationale

#### Core Technologies

1. **TypeScript**
   - **Rationale**: Type safety, better IDE support, maintainability
   - **Version**: 5.x (latest stable)

2. **Node.js**
   - **Rationale**: Cross-platform CLI tool, npm ecosystem integration
   - **Version**: 18.x LTS (minimum)

3. **Commander.js**
   - **Rationale**: Mature CLI framework, command parsing, help generation
   - **Alternative Considered**: Yargs (chose Commander for simplicity)

#### Database Drivers

1. **sqlite3** (SQLite)
   - **Rationale**: Zero-configuration, file-based, perfect for local development
   - **Performance**: Fast for single-user scenarios

2. **mysql2** (MySQL)
   - **Rationale**: Production-ready, team collaboration, connection pooling
   - **Performance**: Optimized for concurrent access

3. **pg** (PostgreSQL)
   - **Rationale**: Advanced features, JSON support, enterprise adoption
   - **Performance**: Excellent for complex queries

#### File System Operations

1. **fs-extra**
   - **Rationale**: Promise-based, additional utilities, cross-platform
   - **Features**: Atomic writes, directory operations

2. **dotenv**
   - **Rationale**: Standard .env file parsing, environment variable management

#### CLI Enhancements

1. **chalk**
   - **Rationale**: Terminal colors, improved UX, error highlighting

2. **inquirer**
   - **Rationale**: Interactive prompts, user-friendly CLI experience

### Infrastructure Requirements

#### Local Development (SQLite)

- **Storage**: ~1MB per 1000 port assignments
- **Performance**: < 10ms per operation
- **Concurrency**: Single-user (file locking)
- **Backup**: File-based (copy database file)

#### Team Collaboration (MySQL/PostgreSQL)

- **Storage**: ~10MB per 10,000 port assignments
- **Performance**: < 50ms per operation (with connection pooling)
- **Concurrency**: Multi-user (database-level locking)
- **Backup**: Database backup strategies
- **Connection Pooling**: Required for production use
- **Replication**: Optional for high availability

### Integration Points

#### 1. Framework Integration

**Integration Method**: File-based configuration updates

**Supported Frameworks**:
- Next.js: `.env.local`, `package.json`, `next.config.js`
- Angular: `angular.json`, `package.json`
- Express: `.env.example`, `package.json`
- React/Vite: `vite.config.js`, `package.json`
- Docker: `docker-compose.yml`

**Integration Strategy**:
- Read existing configuration
- Merge port settings (preserve other config)
- Write updated configuration
- Backup original files

#### 2. CI/CD Integration

**Integration Points**:
- Pre-commit hooks: Validate port configuration
- CI pipeline: Automated port conflict checks
- Build scripts: Port allocation for test environments

**Integration Methods**:
- Git hooks (pre-commit, pre-push)
- CI configuration files (GitHub Actions, GitLab CI, Jenkins)
- npm scripts integration

#### 3. System Integration

**Port Checking**:
- **Unix/Linux**: `lsof`, `netstat`, `/proc/net/tcp`
- **macOS**: `lsof`, `netstat`
- **Windows**: `netstat`, `Get-NetTCPConnection` (PowerShell)

**File System**:
- Cross-platform path handling
- File locking for concurrent access
- Atomic file operations

### Scalability Considerations

#### Horizontal Scaling

**Current Architecture**: Single-instance CLI tool

**Future Scalability Options**:
1. **Shared Database**: Multiple CLI instances share MySQL/PostgreSQL database
2. **API Server**: Central API server for port management (future enhancement)
3. **Distributed Registry**: Multi-region port registry (future enhancement)

**Scalability Limits**:
- **SQLite**: ~1000 projects per database (file locking bottleneck)
- **MySQL/PostgreSQL**: 10,000+ projects (with proper indexing)

#### Performance Optimization

1. **Database Indexing**:
   - Index on `port` (unique constraint)
   - Index on `project_name` + `app_type` (composite unique)
   - Index on `status` (for filtering)

2. **Caching Strategy**:
   - In-memory cache for frequently accessed ports
   - Cache invalidation on port assignment/release
   - TTL-based cache expiration

3. **Query Optimization**:
   - Batch operations for multi-project validation
   - Prepared statements for repeated queries
   - Connection pooling for database backends

4. **Port Allocation Algorithm**:
   - Binary search for sorted port ranges
   - Port range pre-allocation (reserve blocks)
   - Lazy port checking (check only when needed)

#### Database Scaling

**SQLite Limitations**:
- Single-writer limitation
- File-based locking
- Not suitable for high concurrency

**MySQL/PostgreSQL Advantages**:
- Row-level locking
- Connection pooling
- Read replicas for scaling reads
- Partitioning for large datasets

**Migration Path**:
1. Start with SQLite (local development)
2. Migrate to MySQL/PostgreSQL (team collaboration)
3. Add read replicas (high-traffic scenarios)
4. Implement caching layer (future optimization)

### Dependency Analysis

#### Component Dependencies

```
CLI Commands
    ↓
Core Components (Registry, Allocator, Validator, Configurator)
    ↓
Database Layer (Repository Interface)
    ↓
Database Implementations (SQLite, MySQL, PostgreSQL)
    ↓
Framework Handlers
    ↓
File System Operations
```

#### External Dependencies

1. **System Dependencies**:
   - Port checking tools (lsof, netstat)
   - File system access
   - Process management

2. **npm Dependencies**:
   - TypeScript compiler
   - Database drivers
   - CLI framework
   - File system utilities

3. **Runtime Dependencies**:
   - Node.js runtime
   - Database server (for MySQL/PostgreSQL)

#### Build Order and Prerequisites

**Phase 1: Foundation**
1. Database layer (interfaces, SQLite implementation)
2. Core components (Registry, Allocator)
3. Basic CLI commands (init, allocate, list)

**Phase 2: Validation**
4. Conflict detection
5. Port validation
6. Configuration validation

**Phase 3: Integration**
7. Framework handlers
8. Configuration manager
9. Advanced CLI commands

**Phase 4: Advanced Features**
10. MySQL/PostgreSQL support
11. Port history
12. CI/CD integration

### Database Layer

**Abstraction**: Database-agnostic interface using Repository Pattern

**Implementation**:
- SQLite (default, local development)
- MySQL (shared development environments)
- PostgreSQL (alternative option)

**Migration System**:
- Versioned schema migrations
- Automatic migration on startup
- Rollback support
- Migration history tracking

**Connection Management**:
- Connection pooling for MySQL/PostgreSQL
- Lazy connection initialization
- Connection retry logic
- Graceful connection cleanup

## API Reference

### CLI API

The CLI is available via the core package's binary:

```bash
# CLI available after installing @your-org/core
npx @your-org/core port-manager init [--project-name <name>] [--app-type <type>] [--port <port>]

# Or use the binary directly (if installed globally)
port-manager init [--project-name <name>] [--app-type <type>] [--port <port>]

# Check port status and conflicts
npx @your-org/core port-manager check [--project-path <path>]

# Allocate new port
npx @your-org/core port-manager allocate --project-name <name> --app-type <type> [--port <port>]

# List all port assignments
npx @your-org/core port-manager list [--project <name>] [--type <type>] [--status <status>]

# Release port assignment
npx @your-org/core port-manager release --project-name <name> [--app-type <type>]

# Validate all projects
npx @your-org/core port-manager validate [--project-path <path>]

# Migrate existing project
npx @your-org/core port-manager migrate --project-path <path> [--port <port>]
```

### Programmatic API

The Port Manager provides a clean, RESTful-inspired programmatic API that follows consistent design principles:

**Import from Core Package**:
```typescript
import { PortManager } from '@your-org/core/features/port-manager';

const manager = new PortManager({
  database: {
    type: 'sqlite',
    path: '~/.port-manager/registry.db'
  }
});

// Allocate port (POST-like operation: creates new assignment)
const port = await manager.allocate('my-project', 'nextjs');

// Check conflicts (GET-like operation: retrieves information)
const conflicts = await manager.detectConflicts('./my-project');

// Configure project (PUT-like operation: updates configuration)
await manager.configure('./my-project', port, 'nextjs');

// Get port assignment (GET-like operation: retrieves resource)
const assignment = await manager.getPort('my-project', 'nextjs');

// List ports (GET-like operation: retrieves collection)
const allPorts = await manager.listPorts({ appType: 'nextjs' });

// Release port (DELETE-like operation: removes assignment)
await manager.release('my-project', 'nextjs');
```

#### API Design Principles

**1. Resource-Based Operations**
- Port assignments are treated as resources
- Operations follow RESTful semantics (GET, POST, PUT, DELETE)
- Clear separation between read and write operations

**2. Consistent Error Handling**
```typescript
try {
  const port = await manager.allocate('my-project', 'nextjs');
} catch (error) {
  if (error instanceof PortConflictError) {
    // Handle conflict
  } else if (error instanceof PortRangeExhaustedError) {
    // Handle range exhaustion
  } else {
    // Handle other errors
  }
}
```

**3. Promise-Based Async API**
- All operations return Promises
- Consistent async/await support
- Proper error propagation

**4. Type Safety**
- Full TypeScript support
- Strongly typed interfaces
- IntelliSense support

**5. Configuration Options**
- Flexible configuration object
- Sensible defaults
- Environment-specific overrides

#### API Response Formats

**Success Response**:
```typescript
interface PortAssignment {
  id: number;
  projectName: string;
  appType: AppType;
  port: number;
  status: 'active' | 'inactive' | 'reserved';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    configFile?: string;
    envVar?: string;
    notes?: string;
  };
}
```

**Error Response**:
```typescript
interface PortManagerError {
  code: string;
  message: string;
  details?: {
    port?: number;
    projectName?: string;
    conflictType?: string;
  };
}
```

**Conflict Report**:
```typescript
interface ConflictReport {
  port: number;
  conflictType: 'assigned' | 'in_use' | 'mismatch';
  details: string;
  resolution?: string;
  severity: 'error' | 'warning' | 'info';
}
```

#### API Versioning Strategy

**Current Version**: v1 (implicit)

**Future Versioning**:
- Semantic versioning for npm package
- API versioning via configuration option
- Backward compatibility guarantees
- Migration guides for breaking changes

#### API Documentation Standards

**OpenAPI/Swagger Support** (Future):
- Auto-generated API documentation
- Interactive API explorer
- Request/response examples
- Error code reference

## Configuration

### Global Configuration

**Location**: `~/.port-manager/config.json`

```json
{
  "database": {
    "type": "sqlite",
    "sqlite": {
      "path": "~/.port-manager/registry.db"
    },
    "mysql": {
      "host": "localhost",
      "port": 3306,
      "database": "port_manager",
      "user": "port_manager",
      "password": "***"
    }
  },
  "portRanges": {
    "node": { "start": 3000, "end": 3099 },
    "nextjs": { "start": 3000, "end": 3099 },
    "angular": { "start": 4200, "end": 4299 },
    "react": { "start": 4000, "end": 4099 },
    "python": { "start": 5000, "end": 5099 },
    "php": { "start": 8000, "end": 8099 }
  },
  "reservedPorts": [
    { "port": 3306, "purpose": "MySQL" },
    { "port": 5432, "purpose": "PostgreSQL" },
    { "port": 6379, "purpose": "Redis" }
  ]
}
```

### Project Configuration

**Location**: `.port-manager.json` (in project root)

```json
{
  "projectName": "my-project",
  "appType": "nextjs",
  "port": 3000,
  "autoConfigure": true,
  "configFiles": {
    "env": ".env.example",
    "packageJson": "package.json",
    "nextConfig": "next.config.js"
  }
}
```

## Implementation Plan

### Phase 1: Core Functionality (MVP)

1. **Database Layer**
   - SQLite implementation
   - Basic schema and migrations
   - CRUD operations for port assignments

2. **Port Allocation**
   - Basic port allocation logic
   - Port range validation
   - Availability checking

3. **CLI Commands**
   - `init`: Initialize project
   - `allocate`: Allocate port
   - `check`: Check conflicts
   - `list`: List assignments

4. **Configuration**
   - Next.js configuration
   - Basic .env file updates

### Phase 2: Framework Support

1. **Framework Detection**
   - Auto-detect project type
   - Framework-specific configuration

2. **Configuration Updates**
   - Angular support
   - Express/Node.js support
   - Docker Compose support
   - React/Vite support

3. **Conflict Detection**
   - Port in-use detection
   - Registry conflict detection
   - Configuration validation

### Phase 3: Advanced Features

1. **Database Backends**
   - MySQL support
   - PostgreSQL support

2. **Advanced Features**
   - Port reservation
   - Port history
   - Multi-project support

3. **Integration**
   - CI/CD integration
   - Pre-commit hooks
   - Framework hooks

## Dependencies

### Core Package Dependencies

Port Manager, as part of `@your-org/core`, shares dependencies with the core package:

**Core Package Dependencies**:
- **TypeScript**: Type safety
- **Commander**: CLI framework (shared across core features)
- **sqlite3** or **mysql2**: Database drivers (shared database abstractions)
- **dotenv**: Environment variable management
- **fs-extra**: File system operations
- **chalk**: Terminal colors
- **inquirer**: Interactive prompts

**Port Manager Specific Dependencies**:
- Uses core's shared database abstractions
- May have feature-specific dependencies if needed

### Development Dependencies

**Core Package Development Dependencies**:
- **jest**: Testing framework (shared across core)
- **@types/node**: TypeScript types
- **eslint**: Linting
- **prettier**: Code formatting

**Note**: Dependencies are managed at the core package level, not per-feature.

## Testing Strategy

### Unit Tests

- Port allocation logic
- Conflict detection
- Configuration file updates
- Database operations

### Integration Tests

- End-to-end CLI commands
- Framework integration
- Database migrations

### E2E Tests

- Full project initialization
- Port conflict resolution
- Multi-project scenarios

## Documentation

### Required Documentation

1. **README.md**: Package overview and quick start
2. **API.md**: Complete API reference
3. **GUIDE.md**: Usage guide with examples
4. **CONFIGURATION.md**: Configuration reference
5. **FRAMEWORKS.md**: Framework-specific guides
6. **MIGRATION.md**: Migration guide for existing projects

## Success Criteria

### Functional Requirements

- ✅ Automatically allocate ports based on app type
- ✅ Detect and prevent port conflicts
- ✅ Configure projects with consistent patterns
- ✅ Support all major frameworks
- ✅ Maintain central port registry

### Non-Functional Requirements

- ✅ Fast port allocation (< 1 second)
- ✅ Reliable conflict detection (100% accuracy)
- ✅ Easy to use (simple CLI commands)
- ✅ Well documented (comprehensive docs)
- ✅ Extensible (plugin system for new frameworks)

## Future Enhancements

1. **Web UI**: Browser-based port management interface
2. **Team Collaboration**: Shared port registry for teams
3. **Port Analytics**: Usage statistics and insights
4. **Auto-Migration**: Automatic migration of existing projects
5. **Plugin System**: Extensible framework support
6. **Cloud Sync**: Sync port registry across devices

## Business Value Analysis

### Problem Value

**Current State Costs**:
- **Time Cost**: 5-10 minutes per project setup for port checking = ~2-4 hours/month per developer
- **Conflict Resolution**: 15-30 minutes per conflict = ~1-2 hours/month per developer
- **Onboarding Friction**: 30-60 minutes for new team members = ~1 hour per new hire
- **Team Inconsistency**: 2-4 hours/month for team leads managing port conflicts

**Total Cost per Developer**: ~4-7 hours/month
**Total Cost per Team (10 developers)**: ~40-70 hours/month = $4,000-$7,000/month (at $100/hour)

### Solution Value

**Time Savings**:
- **Project Setup**: 5-10 minutes → < 5 seconds = 99% reduction
- **Conflict Resolution**: 15-30 minutes → 0 minutes = 100% elimination
- **Onboarding**: 30-60 minutes → < 5 minutes = 90% reduction

**Business Impact**:
- **Developer Productivity**: +4-7 hours/month per developer = 5-10% productivity increase
- **Team Efficiency**: Reduced onboarding time, faster project setup
- **Quality**: Zero port conflicts = zero port-related blockers
- **Consistency**: Standardized configuration = easier maintenance

### ROI Analysis

**Development Cost**: 
- Phase 1 (MVP): ~3 weeks = ~120 hours = $12,000
- Phase 2-4 (Full): ~8 weeks = ~320 hours = $32,000
- **Total**: ~$44,000

**Annual Savings** (10-developer team):
- Time savings: 40-70 hours/month × 12 months = 480-840 hours/year
- Cost savings: $48,000-$84,000/year
- **ROI**: 109-191% in first year
- **Payback Period**: 6-11 months

**Scalability**:
- Benefits scale with team size
- One-time development cost, ongoing value
- Can be packaged and sold as npm package

### Market Opportunity

**Target Market**:
- **Primary**: Development teams (5-50 developers)
- **Secondary**: Solo developers and freelancers
- **Tertiary**: Large enterprises (50+ developers)

**Market Size**:
- Estimated 10M+ developers worldwide
- ~30% work on multiple projects = 3M potential users
- Conservative adoption: 0.1% = 3,000 users
- At $5/month or $50/year = $150K-$300K annual revenue potential

**Competitive Advantage**:
- First-mover in automated port management
- Centralized registry (unique feature)
- Framework-agnostic (broader appeal)
- Open-source potential (community adoption)

## Go-to-Market Strategy

### Phase 1: Internal Adoption (Months 1-2)
- **Goal**: Validate with internal projects
- **Target**: All projects in `~/Documents/`
- **Success Criteria**: 100% adoption, zero conflicts

### Phase 2: Open Source Release (Months 3-4)
- **Goal**: Build community and gather feedback
- **Strategy**: Release as open-source npm package
- **Marketing**: GitHub, npm, developer communities
- **Success Criteria**: 100+ GitHub stars, 50+ npm downloads/week

### Phase 3: Commercial Option (Months 5-6)
- **Goal**: Monetize for enterprise features
- **Strategy**: Freemium model (basic free, advanced paid)
- **Features**: Team collaboration, cloud sync, analytics
- **Success Criteria**: 10+ paying customers

## Pricing Model (Future Consideration)

### Free Tier - Perfect for Solo Developers
- **Who It's For**: Individual developers working on personal projects
- **What You Get**: SQLite backend, basic port management, community support
- **Best For**: Getting started and managing your own projects

### Pro Tier - For Growing Teams ($5/month or $50/year)
- **Who It's For**: Small teams and professional developers
- **What You Get**: Multiple developers, MySQL/PostgreSQL support, port analytics, priority support
- **Best For**: Teams that need shared port management and better visibility

### Enterprise Tier - For Large Organizations (Custom pricing)
- **Who It's For**: Large teams and organizations
- **What You Get**: Team collaboration features, cloud sync, advanced analytics, dedicated support, custom integrations
- **Best For**: Organizations that need enterprise-grade port management

## Security Considerations

### Security Threat Analysis (STRIDE Framework)

#### 1. Spoofing (Identity Attacks)

**Threat**: Unauthorized access to port registry or configuration files

**Mitigation**:
- **File Permissions**: Restrict database file permissions (600 for SQLite, owner-only access)
- **Database Credentials**: Secure storage of MySQL/PostgreSQL credentials (environment variables, not hardcoded)
- **User Context**: Run CLI with appropriate user permissions (no root/sudo required)
- **Access Control**: Database-level access control for shared databases (MySQL/PostgreSQL)

**Implementation**:
```typescript
// Secure file permissions for SQLite database
import { chmod } from 'fs-extra';
await chmod(dbPath, 0o600); // Owner read/write only
```

#### 2. Tampering (Data Integrity)

**Threat**: Unauthorized modification of port assignments or configuration files

**Mitigation**:
- **Input Validation**: Validate all inputs (project names, port numbers, app types)
- **File Integrity**: Backup original configuration files before modification
- **Atomic Operations**: Use database transactions for atomic updates
- **Read-Only Mode**: Option to run in read-only mode for validation

**Input Validation**:
```typescript
function validatePort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

function validateProjectName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name) && name.length <= 255;
}
```

#### 3. Repudiation (Non-repudiation)

**Threat**: Inability to track who made port assignments or changes

**Mitigation**:
- **Audit Logging**: Log all port assignments, releases, and configuration changes
- **Port History**: Maintain complete history of port assignments
- **User Tracking**: Track system user for local operations (optional)
- **Timestamp Tracking**: Automatic timestamps for all operations

**Audit Trail**:
```sql
CREATE TABLE port_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT,
  action ENUM('created', 'updated', 'released', 'reserved'),
  user_id VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details TEXT
);
```

#### 4. Information Disclosure (Confidentiality)

**Threat**: Exposure of sensitive information (project paths, credentials, port assignments)

**Mitigation**:
- **Sensitive Data**: Never log or expose database credentials
- **Path Sanitization**: Sanitize file paths in error messages
- **Secure Defaults**: Secure default file permissions
- **Environment Variables**: Use environment variables for sensitive configuration

**Secure Error Messages**:
```typescript
// Don't expose full paths in errors
const sanitizedPath = path.basename(projectPath);
throw new Error(`Port conflict in project: ${sanitizedPath}`);
```

#### 5. Denial of Service (DoS)

**Threat**: Port exhaustion or resource exhaustion attacks

**Mitigation**:
- **Port Range Limits**: Enforce port range limits per app type
- **Rate Limiting**: Limit port allocation requests (future enhancement)
- **Resource Limits**: Database connection limits and query timeouts
- **Validation**: Prevent invalid port assignments

**Port Range Enforcement**:
```typescript
function validatePortRange(port: number, appType: AppType): boolean {
  const range = PORT_RANGES[appType];
  return port >= range.start && port <= range.end;
}
```

#### 6. Elevation of Privilege

**Threat**: Unauthorized access to system ports or elevated permissions

**Mitigation**:
- **No Root Required**: Tool should not require root/sudo privileges
- **Port Validation**: Only manage user-space ports (1024-65535)
- **System Port Protection**: Prevent assignment of system ports (< 1024)
- **Least Privilege**: Run with minimum required permissions

**System Port Protection**:
```typescript
const SYSTEM_PORT_THRESHOLD = 1024;
if (port < SYSTEM_PORT_THRESHOLD) {
  throw new Error(`Cannot assign system port ${port}. Use ports >= ${SYSTEM_PORT_THRESHOLD}`);
}
```

### OWASP Top 10 Security Considerations

#### A01:2021 – Broken Access Control

**Risk**: Unauthorized access to port registry

**Mitigation**:
- File system permissions (600 for database files)
- Database access control (MySQL/PostgreSQL user permissions)
- Input validation for all operations

#### A02:2021 – Cryptographic Failures

**Risk**: Exposure of database credentials

**Mitigation**:
- Environment variables for credentials (never hardcode)
- Secure credential storage
- No sensitive data in configuration files

#### A03:2021 – Injection

**Risk**: SQL injection in database queries

**Mitigation**:
- Parameterized queries (prepared statements)
- Input validation and sanitization
- Type-safe database interfaces

**Example**:
```typescript
// Use parameterized queries
await db.query(
  'SELECT * FROM port_assignments WHERE project_name = ? AND app_type = ?',
  [projectName, appType]
);
```

#### A04:2021 – Insecure Design

**Risk**: Security flaws in architecture

**Mitigation**:
- Security-first design principles
- Threat modeling (STRIDE)
- Secure defaults

#### A05:2021 – Security Misconfiguration

**Risk**: Insecure default configurations

**Mitigation**:
- Secure default file permissions
- Secure default database configurations
- Security configuration documentation

#### A06:2021 – Vulnerable Components

**Risk**: Vulnerable dependencies

**Mitigation**:
- Regular dependency updates
- Security vulnerability scanning (npm audit)
- Dependency version pinning

#### A07:2021 – Authentication Failures

**Risk**: Weak authentication for shared databases

**Mitigation**:
- Strong database passwords
- Connection string security
- Environment variable management

#### A08:2021 – Software and Data Integrity Failures

**Risk**: Tampered configuration files or database

**Mitigation**:
- File integrity checks (backup before modification)
- Atomic file operations
- Database transaction integrity

#### A09:2021 – Security Logging Failures

**Risk**: Insufficient security logging

**Mitigation**:
- Comprehensive audit logging
- Port history tracking
- Error logging (without sensitive data)

#### A10:2021 – Server-Side Request Forgery (SSRF)

**Risk**: Not applicable (local tool, no network requests)

**Mitigation**: N/A (CLI tool, no server component)

### Security Best Practices

#### 1. Secure Configuration

**Database Credentials**:
```bash
# Use environment variables
export PORT_MANAGER_DB_HOST=localhost
export PORT_MANAGER_DB_USER=port_manager
export PORT_MANAGER_DB_PASSWORD=secure_password
```

**File Permissions**:
- Database files: 600 (owner read/write only)
- Configuration files: 644 (owner read/write, others read)
- Scripts: 755 (owner read/write/execute, others read/execute)

#### 2. Input Validation

**All Inputs Must Be Validated**:
- Port numbers: 1-65535, integer
- Project names: Alphanumeric, underscore, hyphen only
- App types: Valid enum values
- File paths: Sanitized, validated

#### 3. Secure Defaults

**Default Security Settings**:
- Secure file permissions on database creation
- No default credentials
- Port range limits enforced
- System port protection enabled

#### 4. Error Handling

**Secure Error Messages**:
- No sensitive information in error messages
- Sanitized file paths
- Generic error messages for security failures
- Detailed logging (separate from user-facing errors)

#### 5. Dependency Security

**Security Maintenance**:
- Regular `npm audit` checks
- Automated dependency updates
- Security vulnerability monitoring
- Pinned dependency versions

### Security Checklist

- [ ] File permissions set correctly (600 for database)
- [ ] Database credentials stored securely (environment variables)
- [ ] Input validation for all user inputs
- [ ] Parameterized queries (no SQL injection)
- [ ] System port protection (< 1024 blocked)
- [ ] Audit logging implemented
- [ ] Secure error messages (no sensitive data)
- [ ] Dependency security (npm audit clean)
- [ ] Secure defaults configured
- [ ] Security documentation complete

## Risk Assessment

### Technical Risks

1. **Database Compatibility**: Medium risk
   - **Mitigation**: Start with SQLite, add MySQL/PostgreSQL incrementally
   - **Impact**: Limited to SQLite users initially
   - **Architectural Mitigation**: Repository pattern ensures database-agnostic code, easy to add new backends

2. **Framework Support**: Medium risk
   - **Mitigation**: Prioritize most common frameworks (Next.js, Angular)
   - **Impact**: Some frameworks may need manual configuration
   - **Architectural Mitigation**: Factory pattern for framework handlers allows incremental framework support

3. **Port Detection Accuracy**: Low risk
   - **Mitigation**: Use proven system-level port checking (lsof/netstat)
   - **Impact**: Rare false positives/negatives
   - **Architectural Mitigation**: Multiple detection methods (registry + system check) for redundancy

### Architectural Risks

1. **Scalability Limitations**: Medium risk
   - **Risk**: SQLite file locking limits concurrent access
   - **Mitigation**: 
     - Clear migration path to MySQL/PostgreSQL for teams
     - Connection pooling for database backends
     - Caching layer for frequently accessed data
   - **Impact**: Single-user limitation for SQLite, multi-user requires MySQL/PostgreSQL

2. **Concurrent Port Allocation**: Medium risk
   - **Risk**: Race conditions when multiple processes allocate ports simultaneously
   - **Mitigation**:
     - Database-level locking (transactions)
     - Atomic port allocation operations
     - Retry logic for failed allocations
   - **Impact**: Potential port conflicts if not properly handled

3. **File System Race Conditions**: Low risk
   - **Risk**: Multiple processes updating same configuration files
   - **Mitigation**:
     - Atomic file operations (write to temp, then replace)
     - File locking mechanisms
     - Backup before modification
   - **Impact**: Potential configuration corruption if not handled

4. **Framework Detection Accuracy**: Medium risk
   - **Risk**: Incorrect framework detection leading to wrong configuration
   - **Mitigation**:
     - Multiple detection strategies (file presence, package.json analysis)
     - Confidence scoring for ambiguous cases
     - Manual override option
   - **Impact**: Incorrect port configuration if detection fails

5. **Database Migration Failures**: Low risk
   - **Risk**: Schema migrations failing in production
   - **Mitigation**:
     - Versioned migrations with rollback support
     - Migration testing in staging
     - Backup before migration
   - **Impact**: Database corruption or data loss if migration fails

6. **Performance Degradation**: Low risk
   - **Risk**: Slow port allocation with large number of projects
   - **Mitigation**:
     - Database indexing on critical columns
     - Efficient port search algorithms
     - Caching for frequently accessed data
   - **Impact**: Slow CLI operations with 1000+ projects

### Integration Challenges

1. **Framework-Specific Configuration**: Medium complexity
   - **Challenge**: Each framework has different configuration patterns
   - **Mitigation**: Framework handler pattern isolates framework logic
   - **Impact**: More code to maintain, but better separation of concerns

2. **Cross-Platform Compatibility**: Low complexity
   - **Challenge**: Different port checking tools on different platforms
   - **Mitigation**: Platform-specific port checking implementations
   - **Impact**: Additional testing required for each platform

3. **CI/CD Integration Complexity**: Medium complexity
   - **Challenge**: Different CI/CD systems have different integration points
   - **Mitigation**: Standardized hooks and scripts, documentation for each system
   - **Impact**: More documentation and examples needed

### Performance Bottlenecks

1. **Database Query Performance**: Low risk
   - **Bottleneck**: Sequential port allocation queries
   - **Optimization**: Batch operations, connection pooling, indexing
   - **Impact**: < 50ms per operation with proper optimization

2. **File System Operations**: Low risk
   - **Bottleneck**: Multiple file reads/writes during configuration
   - **Optimization**: Batch file operations, caching file contents
   - **Impact**: < 100ms for full project configuration

3. **Port Checking Performance**: Low risk
   - **Bottleneck**: System-level port checking (lsof/netstat)
   - **Optimization**: Cache port check results, parallel checking
   - **Impact**: < 200ms for comprehensive conflict detection

### Scalability Concerns

1. **Single-Instance Limitation**: Medium concern
   - **Current**: CLI tool runs as single process
   - **Future**: API server for multi-instance access (future enhancement)
   - **Impact**: Multiple developers can use shared database, but CLI is single-instance

2. **Database Size Growth**: Low concern
   - **Growth Rate**: ~1KB per port assignment
   - **Scaling**: Database partitioning for 10,000+ projects
   - **Impact**: Minimal with proper indexing

3. **Port Range Exhaustion**: Low concern
   - **Risk**: Running out of available ports in a range
   - **Mitigation**: Configurable port ranges, automatic range expansion
   - **Impact**: Manual intervention needed if all ports in range are used

### Business Risks

1. **Adoption**: Medium risk
   - **Mitigation**: Start with internal adoption, gather feedback
   - **Impact**: Low adoption = limited value

2. **Maintenance**: Low risk
   - **Mitigation**: Well-documented, modular architecture
   - **Impact**: Ongoing maintenance costs

3. **Competition**: Low risk
   - **Mitigation**: First-mover advantage, unique features
   - **Impact**: Potential competitors in future

## Stakeholder Analysis

### Primary Stakeholders

1. **Developers** (End Users)
   - **Interest**: Fast, reliable port management
   - **Influence**: High (adoption decision)
   - **Engagement**: Daily usage

2. **DevOps Engineers** (Power Users)
   - **Interest**: Standardization, automation
   - **Influence**: High (team adoption)
   - **Engagement**: Weekly usage

3. **Team Leads** (Decision Makers)
   - **Interest**: Team efficiency, consistency
   - **Influence**: High (team-wide adoption)
   - **Engagement**: Monthly reviews

### Secondary Stakeholders

1. **Project Managers**
   - **Interest**: Reduced blockers, faster onboarding
   - **Influence**: Medium (project prioritization)

2. **CTO/Engineering Leadership**
   - **Interest**: Developer productivity, tool standardization
   - **Influence**: High (budget, resources)

## Release Strategy

### MVP Release (Phase 1)
- **Scope**: Core functionality, SQLite, Next.js support
- **Timeline**: 3 weeks
- **Success Criteria**: Internal adoption, zero conflicts

### Beta Release (Phase 2)
- **Scope**: All frameworks, conflict detection
- **Timeline**: 2-3 weeks
- **Success Criteria**: 10+ beta users, positive feedback

### Public Release (Phase 3)
- **Scope**: All features, documentation
- **Timeline**: 2-3 weeks
- **Success Criteria**: npm publication, 100+ downloads

## Success Criteria (Enhanced)

### Phase 1 Success (MVP)
- ✅ Zero port conflicts in internal projects
- ✅ 100% internal adoption
- ✅ Port allocation < 5 seconds
- ✅ Developer satisfaction > 4.0/5.0

### Phase 2 Success (Beta)
- ✅ 10+ beta users
- ✅ Positive feedback (> 80% satisfaction)
- ✅ All major frameworks supported
- ✅ Zero critical bugs

### Phase 3 Success (Public)
- ✅ Published to npm
- ✅ 100+ GitHub stars
- ✅ 50+ weekly downloads
- ✅ Community contributions

## Mobile Development Considerations

### Mobile Development Scenarios

Port Manager should support developers working on mobile development projects and developers using mobile devices for development:

1. **Mobile App Development**: Managing ports for mobile app backends, APIs, and development servers
2. **Mobile Device Development**: Developers using tablets or mobile devices for development work
3. **Mobile Network Constraints**: Port management that works efficiently on mobile networks
4. **Mobile Terminal Usage**: CLI tool optimized for mobile terminal applications

### Mobile-Specific Port Ranges

**Mobile Development Port Ranges**:
- **React Native Metro Bundler**: 8081 (default)
- **Expo Development Server**: 19000, 19001, 19002
- **Flutter Development Server**: 5000-5099
- **Ionic Development Server**: 8100-8199
- **Mobile API Backends**: 3000-3099 (shared with web)

**Mobile Device Testing Ports**:
- **iOS Simulator**: Uses host machine ports
- **Android Emulator**: Uses host machine ports (forwarded)
- **Physical Device Testing**: Requires network-accessible ports

### Mobile Development Workflow

**Port Manager should support**:
1. **Mobile Framework Detection**: Auto-detect React Native, Flutter, Ionic, Expo projects
2. **Mobile-Specific Port Allocation**: Allocate ports in mobile development ranges
3. **Device Port Forwarding**: Manage port forwarding for Android emulators
4. **Network-Accessible Ports**: Ensure ports are accessible from mobile devices on local network

### Mobile Terminal Optimization

**CLI Tool Considerations**:
- **Concise Output**: Minimize output for small mobile screens
- **Touch-Friendly Prompts**: Interactive prompts that work well on mobile terminals
- **Battery Efficiency**: Minimize CPU usage and network operations
- **Offline Capability**: Basic operations work without network (local SQLite)
- **Fast Startup**: Quick command execution on mobile devices

### Mobile Network Optimization

**Performance Considerations**:
- **Minimal Network Calls**: Cache port registry locally
- **Efficient Database Operations**: Optimize for slower mobile storage
- **Batch Operations**: Group operations to reduce I/O
- **Connection Pooling**: Efficient database connections on mobile

### Mobile Development Integration

**Framework-Specific Mobile Support**:
- **React Native**: Metro bundler port (8081) management
- **Expo**: Expo development server ports (19000-19002)
- **Flutter**: Flutter development server port allocation
- **Ionic**: Ionic serve port management
- **Mobile Backends**: API server port management for mobile apps

## Package Architecture

### Core Package Integration

Port Manager is implemented as a feature module within `@your-org/core`. This architecture provides:

1. **Shared Infrastructure**: Uses core's shared database abstractions and utilities
2. **Consistent Patterns**: Follows core package patterns and conventions
3. **Easy Integration**: Other core features can use Port Manager
4. **Feature Packages**: Feature packages (e.g., `@your-org/task-manager`) can use Port Manager via core dependency

### Usage in Feature Packages

Feature packages that depend on `@your-org/core` can use Port Manager:

```typescript
// In @your-org/task-manager
import { PortManager } from '@your-org/core/features/port-manager';

// Use Port Manager for task manager's port needs
const portManager = new PortManager({...});
```

### Export Strategy

Port Manager is exported from core package as:

```typescript
// @your-org/core/src/index.ts
export { PortManager } from './features/port-manager';
export * from './features/port-manager';

// Usage
import { PortManager } from '@your-org/core/features/port-manager';
// Or
import { PortManager } from '@your-org/core';
```

## Related Documentation

- [Package Architecture Strategy](../../architecture/PACKAGE_ARCHITECTURE.md) - Core package architecture
- [Port Management Strategy](../guides/PORT_MANAGEMENT_STRATEGY.md) - Port management strategy
- [Projects Ports Reference](../reference/PROJECTS_PORTS.md) - Current port assignments

---

## Review/Contribution

**Created**: 2026-01-05  
**Status**: Planning  
**Priority**: P1 (High)

**Expert**: Patricia Martinez  
**Expertise**: Product Management (Conflict Resolution, Business Decisions)  
**Date**: 2026-01-05  
**Changes**: Enhanced this PRD with comprehensive product management perspective. Added detailed "Success Metrics" section with quantitative metrics (port conflict rate, configuration consistency, time to port assignment, validation coverage, adoption rate, developer satisfaction) and qualitative metrics (developer experience, team consistency, error reduction, onboarding time). Expanded "Target Users" section with detailed user personas (Solo Developer Sarah, DevOps Engineer Mike, Team Lead Jennifer) including pain points, goals, and success criteria for each persona. Added comprehensive "Business Value Analysis" section covering problem value (current state costs: 4-7 hours/month per developer = $4,000-$7,000/month per team), solution value (99% reduction in setup time, 100% elimination of conflicts, 90% reduction in onboarding), ROI analysis (109-191% ROI in first year, 6-11 month payback period), and market opportunity (3M potential users, $150K-$300K annual revenue potential). Added "Go-to-Market Strategy" section with three-phase approach (internal adoption, open source release, commercial option). Added "Pricing Model" section with free, pro, and enterprise tiers. Added "Risk Assessment" section covering technical risks (database compatibility, framework support, port detection accuracy) and business risks (adoption, maintenance, competition) with mitigation strategies. Added "Stakeholder Analysis" section identifying primary stakeholders (developers, DevOps engineers, team leads) and secondary stakeholders (project managers, CTO/engineering leadership) with their interests, influence, and engagement levels. Added "Release Strategy" section with MVP, Beta, and Public release phases. Enhanced "Success Criteria" section with phase-specific success metrics. These additions transform the PRD from a technical specification into a comprehensive product document that includes business value, market analysis, user research, risk assessment, and go-to-market strategy, making it suitable for product decision-making and stakeholder communication.

**Expert**: Emma Rodriguez  
**Expertise**: Copywriting (App naming, section naming, website content)  
**Date**: 2026-01-05  
**Changes**: Enhanced this PRD with copywriting improvements to make it more engaging, clear, and user-focused. Improved the "Overview" section with a more compelling value proposition that emphasizes benefits over features. Enhanced "Pain Points" section with clearer formatting and more specific descriptions of developer frustrations. Transformed "Solution" section from a feature list into benefit-focused descriptions that explain what each feature does for the user. Changed all feature "Description" headers to "What It Does" for better clarity and user-centric language. Improved CLI command descriptions with clearer, more actionable language and better formatting. Enhanced framework integration descriptions to emphasize ease of use and automatic configuration. Improved advanced features descriptions with "What It Does" format and clearer use cases. Enhanced pricing tier descriptions with "Who It's For" and "What You Get" sections to make value propositions clearer. All changes focus on making the PRD more readable, engaging, and focused on user benefits rather than technical implementation details, while maintaining accuracy and completeness.

**Expert**: Arthur Davis  
**Expertise**: Architecture (System Design and Scalability)  
**Date**: 2026-01-05  
**Changes**: Significantly expanded the "Technical Architecture" section with comprehensive architectural design details. Added "System Architecture Overview" describing the layered architecture pattern (Presentation, Application, Data Access, Integration layers). Enhanced "Architecture Patterns" section with detailed implementations of Repository Pattern (database abstraction), Strategy Pattern (database backends), Factory Pattern (framework detection), and Command Pattern (CLI interface), including code examples and benefits for each pattern. Expanded "System Components and Responsibilities" section with detailed architectural roles, dependencies, and design considerations for each core component (Registry Manager, Port Allocator, Conflict Detector, Configuration Manager, Framework Detector). Added "Data Flow and Interactions" section with detailed flow diagrams for port allocation and conflict detection processes. Added "Technology Stack and Rationale" section explaining technology choices with justifications (TypeScript, Node.js, Commander.js, database drivers, file system operations, CLI enhancements). Added "Infrastructure Requirements" section covering local development (SQLite) and team collaboration (MySQL/PostgreSQL) requirements including storage, performance, concurrency, and backup considerations. Added "Integration Points" section detailing framework integration methods, CI/CD integration points, and system integration approaches. Added comprehensive "Scalability Considerations" section covering horizontal scaling options, performance optimization strategies (database indexing, caching, query optimization, port allocation algorithms), and database scaling migration paths. Added "Dependency Analysis" section with component dependency diagrams, external dependencies, and build order/prerequisites. Enhanced "Risk Assessment" section with new "Architectural Risks" subsection covering scalability limitations, concurrent port allocation, file system race conditions, framework detection accuracy, database migration failures, and performance degradation with mitigation strategies. Added "Integration Challenges" and "Performance Bottlenecks" subsections with detailed analysis and optimization strategies. Added "Scalability Concerns" subsection addressing single-instance limitations, database size growth, and port range exhaustion. These additions transform the technical architecture section from a basic package structure into a comprehensive architectural specification suitable for system design, scalability planning, and implementation guidance.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Mobile Development Considerations" section covering mobile development scenarios (mobile app development, mobile device development, mobile network constraints, mobile terminal usage), mobile-specific port ranges (React Native Metro Bundler 8081, Expo 19000-19002, Flutter 5000-5099, Ionic 8100-8199, mobile API backends), mobile development workflow (mobile framework detection, mobile-specific port allocation, device port forwarding, network-accessible ports), mobile terminal optimization (concise output, touch-friendly prompts, battery efficiency, offline capability, fast startup), mobile network optimization (minimal network calls, efficient database operations, batch operations, connection pooling), and mobile development integration (React Native, Expo, Flutter, Ionic, mobile backends). These additions ensure Port Manager supports mobile development workflows and is optimized for use on mobile devices, considering mobile constraints like battery life, network speed, and terminal screen size.

**Expert**: Andrew Lee  
**Expertise**: RESTful API Design  
**Date**: 2026-01-05  
**Changes**: Enhanced the "Programmatic API" section with comprehensive RESTful API design principles. Added "API Design Principles" subsection covering resource-based operations (treating port assignments as resources with RESTful semantics), consistent error handling (typed error classes with proper error propagation), promise-based async API (consistent async/await support), type safety (full TypeScript support with strongly typed interfaces), and configuration options (flexible configuration with sensible defaults). Added "API Response Formats" subsection with detailed TypeScript interfaces for PortAssignment (success response), PortManagerError (error response), and ConflictReport (conflict information) including all fields and types. Added "API Versioning Strategy" subsection covering current version (v1 implicit), future versioning approach (semantic versioning, API versioning via configuration, backward compatibility guarantees, migration guides). Added "API Documentation Standards" subsection covering future OpenAPI/Swagger support (auto-generated documentation, interactive API explorer, request/response examples, error code reference). These additions transform the programmatic API section from basic code examples into a comprehensive API design specification following RESTful principles and best practices for developer-friendly APIs.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Significantly enhanced the "Database Schema" section with comprehensive database design best practices. Added "Schema Design Principles" subsection covering normalization (3NF compliance, no redundancy, atomic values), data integrity (primary key, unique constraints, NOT NULL constraints, ENUM constraints), indexing strategy (primary indexes for fast lookups, secondary indexes for query optimization, composite index for port availability queries, covering index strategy), data types optimization (string types with appropriate lengths, numeric types, temporal types), and character set and collation (utf8mb4 for full UTF-8 support). Added "Query Optimization" subsection with common query patterns (port availability check, find available port in range, list ports by project, list ports by app type) with optimized SQL examples and query performance targets (< 10ms for availability check, < 50ms for allocation, < 100ms for list operations). Added "Migration Strategy" subsection covering versioned migrations (sequential migration files, migration tracking table, rollback support), migration best practices (backward compatible, data preservation, transaction safety, testing), and example migration structure. Added "Database-Specific Considerations" subsection covering SQLite (simpler schema, file-based, single-user), MySQL (full feature set, connection pooling, InnoDB engine), and PostgreSQL (SERIAL, JSON support, advanced indexing). These additions transform the database schema from a basic table definition into a comprehensive database design specification with optimization strategies and migration planning.

**Expert**: Sarah Johnson  
**Expertise**: Security (STRIDE Threat Modeling, OWASP Top 10)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Security Considerations" section covering security threat analysis using STRIDE framework. Added detailed analysis for each STRIDE threat: Spoofing (file permissions, database credentials, access control), Tampering (input validation, file integrity, atomic operations), Repudiation (audit logging, port history, user tracking), Information Disclosure (sensitive data protection, path sanitization, secure defaults), Denial of Service (port range limits, rate limiting, resource limits), and Elevation of Privilege (no root required, port validation, system port protection). Added OWASP Top 10 security considerations covering all 10 categories with specific mitigations for each (Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Software and Data Integrity Failures, Security Logging Failures). Added "Security Best Practices" subsection covering secure configuration (database credentials, file permissions), input validation (all inputs validated), secure defaults (default security settings), error handling (secure error messages), and dependency security (regular audits, updates). Added comprehensive "Security Checklist" with 10 security requirements. These additions ensure Port Manager follows security best practices and addresses all major security threats for a CLI tool managing port assignments and configuration files.

