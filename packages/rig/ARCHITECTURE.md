# Core Package Architecture

**Package**: `@colis/rig`  
**Version**: 1.0.0  
**Last Updated**: 2026-01-05

## Overview

The `@colis/rig` package is a foundational infrastructure package that provides reusable features, shared utilities, and development tools for all projects. It follows a **layered architecture** with clear separation of concerns and uses established design patterns for maintainability and scalability.

## Architecture Principles

### 1. Separation of Concerns
- **Features**: Self-contained, reusable feature modules
- **Shared**: Common utilities used across features
- **Rules**: Cursor IDE rules and expert personas
- **Commands**: CLI commands for common tasks

### 2. Modularity
- Each feature is a self-contained module
- Features can be used independently or together
- Clear module boundaries with well-defined APIs

### 3. Extensibility
- Easy to add new features
- Shared utilities support multiple use cases
- Plugin-friendly architecture

### 4. Scalability
- Database abstraction supports multiple backends
- Factory patterns enable runtime selection
- Repository pattern ensures testability

## Package Structure

```
@colis/rig/
├── src/
│   ├── features/              # Feature modules
│   │   ├── port-manager/      # Port management feature
│   │   ├── tech-detector/     # Technology detection feature
│   │   ├── domain-manager/    # Domain management feature
│   │   └── commissioning/  # Project setup feature
│   ├── shared/                # Shared utilities
│   │   ├── database/          # Database abstractions
│   │   └── config/            # Configuration utilities
│   └── index.ts               # Main entry point
├── rules/                     # Cursor rules
│   ├── experts/               # Expert personas
│   └── user/                  # User rules
├── commands/                   # Cursor commands
│   ├── local/                 # Local commands
│   └── general/               # General commands
├── bin/                        # CLI binaries
├── dist/                       # Compiled output
└── package.json
```

## Architectural Patterns

### 1. Repository Pattern (Data Access Layer)

**Purpose**: Abstract database operations behind a consistent interface

**Implementation**: `src/shared/database/repository.ts`

```typescript
interface DatabaseRepository {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<void>;
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
  isConnected(): boolean;
  getType(): 'sqlite' | 'mysql' | 'postgresql';
}
```

**Benefits**:
- Database-agnostic business logic
- Easy to swap database backends
- Testable with mock implementations
- Consistent API across all databases

**Used By**:
- Port Manager (port assignments registry)
- Future features requiring database access

### 2. Factory Pattern (Database Creation)

**Purpose**: Create database repository instances based on configuration

**Implementation**: `src/shared/database/factory.ts`

```typescript
class DatabaseFactory {
  static create(config: DatabaseConfig): DatabaseRepository {
    switch (config.type) {
      case 'sqlite': return new SQLiteRepository(config.sqlite);
      case 'mysql': return new MySQLRepository(config.mysql);
      case 'postgresql': return new PostgreSQLRepository(config.postgresql);
    }
  }
}
```

**Benefits**:
- Runtime selection of database implementation
- Centralized creation logic
- Easy to add new database backends
- Consistent initialization

**Used By**:
- Port Manager (database initialization)
- All features requiring database access

### 3. Strategy Pattern (Framework Detection)

**Purpose**: Select framework-specific configuration handlers

**Implementation**: `src/features/port-manager/frameworks/factory.ts`

```typescript
interface FrameworkHandler {
  detect(projectPath: string): boolean;
  configure(projectPath: string, port: number): Promise<ConfigurationResult>;
  validate(projectPath: string): Promise<ValidationResult>;
}

class FrameworkFactory {
  static create(appType: AppType): FrameworkHandler {
    switch (appType) {
      case 'nextjs': return new NextJSHandler();
      case 'angular': return new AngularHandler();
      // ...
    }
  }
}
```

**Benefits**:
- Extensible framework support
- Isolated framework logic
- Easy to add new frameworks
- Consistent configuration interface

**Used By**:
- Port Manager (framework-specific configuration)
- Project Initialization (framework detection)

### 4. Command Pattern (CLI Interface)

**Purpose**: Encapsulate CLI operations as first-class objects

**Implementation**: CLI commands in `src/features/*/cli/commands/`

```typescript
interface Command {
  execute(args: CommandArgs): Promise<CommandResult>;
  validate(args: CommandArgs): ValidationResult;
}
```

**Benefits**:
- Consistent command interface
- Easy to add new commands
- Testable command logic
- Undo/redo capability (future enhancement)

**Used By**:
- All CLI features (port-manager, tech-detect, domain-manager, init)

## Layer Architecture

### Presentation Layer
- **CLI Commands**: User-facing command-line interface
- **Binaries**: Executable scripts in `bin/`
- **Responsibility**: User interaction, input validation, output formatting

### Application Layer
- **Feature Modules**: Business logic for each feature
- **Core Components**: Feature-specific core logic (allocators, validators, configurators)
- **Responsibility**: Business rules, orchestration, feature logic

### Data Access Layer
- **Repositories**: Database abstraction implementations
- **Migrations**: Database schema management
- **Responsibility**: Data persistence, database operations

### Integration Layer
- **Framework Handlers**: Framework-specific adapters
- **File System Operations**: Configuration file updates
- **Responsibility**: External system integration, file operations

## Component Responsibilities

### Port Manager Feature

**Architecture Role**: Application Layer - Feature Module

**Components**:
- **PortManager**: Main public API class
- **RegistryManager**: Port assignment registry management
- **PortAllocator**: Port allocation logic
- **ConflictDetector**: Port conflict detection
- **ConfigurationManager**: Project configuration updates

**Dependencies**:
- DatabaseRepository (Data Access Layer)
- FrameworkHandler (Integration Layer)
- PortChecker (Integration Layer)

### Tech Detector Feature

**Architecture Role**: Application Layer - Feature Module

**Components**:
- **TechDetector**: Main detection class
- **Detectors**: Language, framework, build tool detectors
- **Mappers**: Configuration and package.json mappers

**Dependencies**:
- File system access (Integration Layer)

### Domain Manager Feature

**Architecture Role**: Application Layer - Feature Module

**Components**:
- **DomainManager**: Domain management class
- **CaddyManager**: Caddy server integration
- **HostsManager**: System hosts file management

**Dependencies**:
- File system access (Integration Layer)
- External service integration (Caddy)

### Project Initialization Feature

**Architecture Role**: Application Layer - Feature Module

**Components**:
- **ProjectInitializer**: Main initialization class
- **RulesCopier**: Rules copying logic
- **CommandsCopier**: Commands copying logic
- **ColorManager**: IDE color configuration
- **SetupValidator**: Setup validation

**Dependencies**:
- Port Manager (Application Layer)
- File system access (Integration Layer)

## Shared Utilities

### Database Abstractions (`src/shared/database/`)

**Purpose**: Provide database-agnostic data access

**Components**:
- **Repository Interface**: `DatabaseRepository` interface
- **Implementations**: SQLite, MySQL, PostgreSQL repositories
- **Factory**: `DatabaseFactory` for creating repositories
- **Migrations**: Database migration system

**Architecture Pattern**: Repository Pattern + Factory Pattern

**Used By**: Port Manager, future features requiring database access

### Configuration Utilities (`src/shared/config/`)

**Purpose**: Manage global and project-specific configuration

**Components**:
- **GlobalConfigManager**: Manages `~/.port-manager/config.json`
- **ProjectConfigManager**: Manages `.port-manager.json`
- **ConfigValidator**: Validates configuration values

**Architecture Pattern**: Manager Pattern

**Used By**: Port Manager, Project Initialization

## Data Flow

### Port Allocation Flow

```
CLI Command (Presentation Layer)
    ↓
PortManager.allocate() (Application Layer)
    ↓
PortAllocator.allocate() (Application Layer)
    ├──→ RegistryManager.checkAvailability() (Application Layer)
    │       └──→ DatabaseRepository.query() (Data Access Layer)
    ├──→ PortChecker.checkPort() (Integration Layer)
    └──→ ConfigurationManager.configure() (Application Layer)
            └──→ FrameworkHandler.configure() (Integration Layer)
                    └──→ FileUpdater.updateFiles() (Integration Layer)
```

### Project Initialization Flow

```
CLI Command (Presentation Layer)
    ↓
ProjectInitializer.initialize() (Application Layer)
    ├──→ RulesCopier.copy() (Application Layer)
    ├──→ CommandsCopier.copy() (Application Layer)
    ├──→ PortManager.init() (Application Layer)
    ├──→ ColorManager.setup() (Application Layer)
    └──→ SetupValidator.validate() (Application Layer)
```

## Scalability Considerations

### Horizontal Scaling

**Current Architecture**: Single-instance CLI tool

**Scaling Options**:
1. **Shared Database**: Multiple CLI instances share MySQL/PostgreSQL database
2. **API Server** (Future): Central API server for port management
3. **Distributed Registry** (Future): Multi-region port registry

**Limitations**:
- SQLite: Single-user (file locking)
- MySQL/PostgreSQL: Multi-user support with connection pooling

### Performance Optimization

**Database**:
- Indexing on critical columns (port, project_name, app_type)
- Connection pooling for MySQL/PostgreSQL
- Prepared statements for repeated queries

**Caching** (Future):
- In-memory cache for frequently accessed ports
- Cache invalidation on port assignment/release
- TTL-based cache expiration

**Query Optimization**:
- Batch operations for multi-project validation
- Efficient port search algorithms
- Lazy port checking (check only when needed)

## Extension Points

### Adding a New Feature

1. **Create Feature Directory**: `src/features/new-feature/`
2. **Implement Feature Logic**: Core business logic
3. **Add CLI Commands** (if needed): `src/features/new-feature/cli/commands/`
4. **Export from Index**: Add to `src/index.ts`
5. **Update Package Exports**: Add to `package.json` exports

### Adding a New Database Backend

1. **Implement Repository**: Create class implementing `DatabaseRepository`
2. **Add to Factory**: Update `DatabaseFactory.create()`
3. **Add Migration Support**: Implement migration system
4. **Add Tests**: Test implementation

### Adding a New Framework Handler

1. **Implement Handler**: Create class implementing `FrameworkHandler`
2. **Add to Factory**: Update `FrameworkFactory.create()`
3. **Add Detection Logic**: Implement framework detection
4. **Add Configuration Logic**: Implement configuration updates

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock dependencies (database, file system)
- Test error handling and edge cases

### Integration Tests
- Test feature modules end-to-end
- Test database operations with real database
- Test CLI commands with real file system

### Architecture Tests
- Verify layer boundaries are respected
- Ensure dependencies flow in correct direction
- Validate pattern implementations

## Security Considerations

### Database Security
- Parameterized queries (prevent SQL injection)
- Secure credential storage (environment variables)
- File permissions (600 for database files)

### Input Validation
- Validate all user inputs
- Sanitize file paths
- Validate port numbers and project names

### Error Handling
- No sensitive information in error messages
- Sanitized file paths in errors
- Generic error messages for security failures

## Future Enhancements

### Architecture Improvements
1. **Plugin System**: Allow extending core with plugins
2. **Feature Flags**: Enable/disable features at runtime
3. **Lazy Loading**: Load features on demand
4. **Tree Shaking**: Optimize bundle size
5. **API Server**: Central API server for multi-instance access

### Scalability Enhancements
1. **Caching Layer**: In-memory caching for frequently accessed data
2. **Read Replicas**: Database read replicas for scaling reads
3. **Connection Pooling**: Enhanced connection pooling strategies
4. **Batch Operations**: Optimized batch operations for large datasets

## Related Documentation

- [Package Architecture Strategy](../../docs/architecture/PACKAGE_ARCHITECTURE.md)
- [Port Manager PRD](../../docs/features/port-manager/PRD.md)
- [Project Initialization PRD](../../docs/features/commissioning/PRD.md)

---

**Architecture Expert**: Arthur Davis  
**Review Date**: 2026-01-05  
**Status**: Current Architecture Documentation
