# Domain Manager Architecture

**Feature**: `core/domain-manager`  
**Last Updated**: 2026-01-05

## Overview

Domain Manager is a local development tool that manages local domain names using Caddy reverse proxy and system hosts file. It provides a clean architecture with separation of concerns, dependency injection support, and extensibility.

## Architecture Pattern

Domain Manager follows a **Layered Architecture** pattern with clear separation between:

1. **Service Layer** (`DomainManager`) - Orchestrates domain management operations
2. **Infrastructure Layer** (`CaddyManager`, `HostsManager`) - Handles external system interactions
3. **Detection Layer** (`ServiceDetector`) - Analyzes project structure
4. **Presentation Layer** (`cli/commands/*`) - User-facing CLI interface

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLI Commands Layer                        │
│  (setup.ts, remove.ts, list.ts, install.ts)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  DomainManager (Service Layer)              │
│  - Orchestrates domain operations                           │
│  - Validates inputs                                         │
│  - Coordinates between managers                             │
└───────┬───────────────┬───────────────┬─────────────────────┘
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CaddyManager │ │ HostsManager │ │ServiceDetector│
│              │ │              │ │              │
│ - Caddyfile  │ │ - /etc/hosts  │ │ - Project    │
│   operations │ │   operations │ │   analysis   │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Design Principles

### 1. Separation of Concerns

Each component has a single, well-defined responsibility:

- **DomainManager**: Orchestrates domain setup/removal operations
- **CaddyManager**: Manages Caddy reverse proxy configuration
- **HostsManager**: Manages system hosts file
- **ServiceDetector**: Detects project services and ports

### 2. Dependency Injection

Domain Manager supports dependency injection for testability and extensibility:

```typescript
// Default usage
const manager = new DomainManager();

// Custom configuration
const manager = new DomainManager({
  caddyfilePath: '/custom/path/Caddyfile',
  hostsPath: '/custom/path/hosts',
});

// Custom implementations (for testing)
const manager = new DomainManager({
  caddyManager: mockCaddyManager,
  hostsManager: mockHostsManager,
  serviceDetector: mockServiceDetector,
});
```

### 3. Interface-Based Design

All managers implement interfaces (`ICaddyManager`, `IHostsManager`, `IServiceDetector`) enabling:

- **Testability**: Easy mocking for unit tests
- **Extensibility**: Custom implementations can be provided
- **Flexibility**: Swap implementations without changing DomainManager

### 4. Configuration Management

Configuration is externalized and injectable:

- **Caddyfile Path**: Configurable via `DomainManagerConfig.caddyfilePath`
- **Hosts File Path**: Configurable via `DomainManagerConfig.hostsPath`
- **Default Values**: Sensible defaults for common use cases

## Component Responsibilities

### DomainManager (Service Layer)

**Responsibilities**:
- Orchestrates domain setup and removal operations
- Validates inputs (project path, project name, domain format)
- Coordinates between CaddyManager, HostsManager, and ServiceDetector
- Handles business logic (service detection, port assignment)
- Provides unified error handling

**Dependencies**:
- `ICaddyManager` - Caddy configuration operations
- `IHostsManager` - Hosts file operations
- `IServiceDetector` - Service detection

### CaddyManager (Infrastructure Layer)

**Responsibilities**:
- Manages Caddyfile read/write operations
- Generates Caddy domain block configurations
- Parses existing Caddyfile content
- Reloads Caddy configuration
- Checks Caddy installation and running status

**Dependencies**:
- File system operations (`fs-extra`)
- Process execution (`child_process`)

**Configuration**:
- `CaddyManagerConfig.caddyfilePath` - Custom Caddyfile path

### HostsManager (Infrastructure Layer)

**Responsibilities**:
- Manages hosts file read/write operations
- Validates IP address formats
- Creates backups before modifications
- Handles platform-specific paths (Windows vs Unix)

**Dependencies**:
- File system operations (`fs-extra`)
- Process execution for sudo operations (`child_process`)

**Configuration**:
- `HostsManagerConfig.hostsPath` - Custom hosts file path

### ServiceDetector (Detection Layer)

**Responsibilities**:
- Detects project structure (frontend/backend/root services)
- Identifies service types (Angular, React, PHP, Node)
- Extracts port numbers from configuration files
- Provides service information for domain configuration

**Dependencies**:
- File system operations (`fs-extra`)

## Data Flow

### Domain Setup Flow

```
1. CLI Command (setup.ts)
   │
   ▼
2. DomainManager.setup()
   ├─ Validate inputs
   ├─ Check Caddy installation
   ├─ Generate/validate domain name
   │
   ├─ ServiceDetector.detectServices()
   │  └─ Analyze project structure
   │  └─ Extract port information
   │
   ├─ CaddyManager.addDomain()
   │  └─ Read Caddyfile
   │  └─ Generate domain block
   │  └─ Write Caddyfile
   │  └─ Reload Caddy
   │
   └─ HostsManager.addEntry()
      └─ Read hosts file
      └─ Add domain entry
      └─ Write hosts file
```

### Domain Removal Flow

```
1. CLI Command (remove.ts)
   │
   ▼
2. DomainManager.remove()
   ├─ Validate domain name
   │
   ├─ CaddyManager.removeDomain()
   │  └─ Read Caddyfile
   │  └─ Remove domain block
   │  └─ Write Caddyfile
   │  └─ Reload Caddy
   │
   └─ HostsManager.removeEntry()
      └─ Read hosts file
      └─ Remove domain entry
      └─ Write hosts file
```

## Extensibility Points

### 1. Custom Manager Implementations

Implement interfaces to provide custom behavior:

```typescript
class CustomCaddyManager implements ICaddyManager {
  async addDomain(config: CaddyDomainBlock): Promise<void> {
    // Custom implementation
  }
  // ... other methods
}

const manager = new DomainManager({
  caddyManager: new CustomCaddyManager(),
});
```

### 2. Configuration Customization

Override default paths and behavior:

```typescript
const manager = new DomainManager({
  caddyfilePath: '/custom/caddy/Caddyfile',
  hostsPath: '/custom/hosts',
});
```

### 3. Service Detection Extension

Provide custom service detection logic:

```typescript
class CustomServiceDetector implements IServiceDetector {
  async detectServices(projectPath: string): Promise<DetectedService[]> {
    // Custom detection logic
  }
}

const manager = new DomainManager({
  serviceDetector: new CustomServiceDetector(),
});
```

## Error Handling Architecture

Domain Manager uses a hierarchical error class structure:

```
DomainManagerError (base)
├─ CaddyNotInstalledError
├─ CaddyNotRunningError
├─ DomainConfigurationError
├─ HostsFileError
├─ DomainValidationError
└─ CaddyfileError
```

Each error class provides:
- **Error Code**: Machine-readable error identifier
- **Error Context**: Domain, operation type, file paths
- **Error Details**: Additional metadata for debugging

## Testing Architecture

Tests use dependency injection to isolate components:

```typescript
// Mock implementations
const mockCaddyManager: ICaddyManager = { ... };
const mockHostsManager: IHostsManager = { ... };
const mockServiceDetector: IServiceDetector = { ... };

// Inject mocks
const manager = new DomainManager({
  caddyManager: mockCaddyManager,
  hostsManager: mockHostsManager,
  serviceDetector: mockServiceDetector,
});
```

## Scalability Considerations

### Current Architecture Supports:

1. **Multiple Domain Configurations**: Can manage unlimited domains
2. **Different Service Types**: Supports single-service and multi-service projects
3. **Custom Configurations**: Configurable paths and implementations
4. **Extensibility**: Interface-based design allows custom implementations

### Future Scalability Enhancements:

1. **Domain Registry**: Centralized domain tracking (similar to port-manager)
2. **Configuration Persistence**: Save/load domain configurations
3. **Multi-Environment Support**: Different configurations for dev/staging/prod
4. **Domain Templates**: Predefined domain configurations
5. **Batch Operations**: Setup/remove multiple domains at once

## Security Architecture

### Input Validation

- Domain name format validation (prevents injection)
- IP address format validation (prevents malicious entries)
- Path validation (prevents directory traversal)

### File Operations

- Backup creation before modifications
- Atomic writes (temp file → final file)
- Permission handling (sudo operations)

### Error Handling

- No sensitive information in error messages
- Clear error messages for troubleshooting
- Graceful degradation (hosts file failures don't break Caddy setup)

## Performance Considerations

### Current Optimizations

1. **Lazy Service Detection**: Only detects services when ports not provided
2. **Efficient File Operations**: Single read/write operations
3. **Minimal Process Execution**: Only reloads Caddy when needed

### Future Optimizations

1. **Caching**: Cache Caddyfile and hosts file content
2. **Batch Operations**: Group multiple domain operations
3. **Async Operations**: Parallel file operations where possible

## Maintainability

### Code Organization

- **Clear Separation**: Each component in its own file
- **Single Responsibility**: Each class has one clear purpose
- **Interface Contracts**: Clear interfaces define component contracts
- **Type Safety**: Comprehensive TypeScript types

### Documentation

- **JSDoc Comments**: All public methods documented
- **Error Documentation**: `@throws` annotations
- **Architecture Documentation**: This file
- **Review Documentation**: REVIEW.md tracks changes

## Trade-offs and Decisions

### Dependency Injection vs. Direct Instantiation

**Decision**: Support both dependency injection and direct instantiation

**Rationale**:
- Dependency injection enables testability and extensibility
- Direct instantiation provides convenience for common use cases
- Optional config parameter balances both needs

### Interface-Based Design vs. Concrete Classes

**Decision**: Use interfaces for all manager dependencies

**Rationale**:
- Enables testability through mocking
- Allows custom implementations
- Maintains loose coupling

### Configuration Management

**Decision**: Use constructor-based configuration

**Rationale**:
- Simple and straightforward
- No global state
- Easy to test with different configurations

### Error Handling Strategy

**Decision**: Custom error classes with hierarchical structure

**Rationale**:
- Better error context and debugging
- Enables specific error handling in CLI
- Matches pattern used in port-manager

## Related Features

- **Port Manager**: Similar architecture pattern with dependency injection
- **Project Initialization**: Uses domain-manager for domain setup
- **Service Detector**: Shared service detection logic

---

## Review/Contribution

**Expert**: Arthur Davis  
**Expertise**: Architecture (System Design and Scalability)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive architectural improvements to domain-manager feature following architecture best practices. Created interfaces.ts file with ICaddyManager, IHostsManager, IServiceDetector interfaces and DomainManagerConfig interface for dependency injection support. Updated CaddyManager to implement ICaddyManager interface and accept CaddyManagerConfig for configurable Caddyfile path. Updated HostsManager to implement IHostsManager interface and accept HostsManagerConfig for configurable hosts file path. Updated ServiceDetector to implement IServiceDetector interface. Refactored DomainManager constructor to support dependency injection with optional DomainManagerConfig parameter, enabling custom implementations for testing and extensibility while maintaining backward compatibility with default implementations. Updated index.ts to export interfaces. Updated domain-manager.test.ts to use dependency injection pattern with mocked interfaces instead of mocking constructors. Created ARCHITECTURE.md documentation file covering component architecture, design principles, data flow, extensibility points, error handling architecture, testing architecture, scalability considerations, security architecture, performance considerations, maintainability, and trade-offs. All changes improve architectural quality, testability, extensibility, and maintainability following architecture best practices including separation of concerns, dependency injection, interface-based design, and configuration management.
