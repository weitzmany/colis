# Port Management Strategy

This document defines a comprehensive strategy for managing ports across all projects to ensure consistency and prevent conflicts.

**Last Updated**: 2026-01-05

## Overview

This strategy provides:
1. **Consistent port configuration** across all projects
2. **Conflict prevention** through port allocation and validation
3. **Standardized configuration patterns** for different application types
4. **Port registry** for tracking and managing port assignments

## Port Allocation Scheme

### Port Ranges by Application Type

| Port Range | Application Type | Examples |
|------------|-----------------|----------|
| **3000-3099** | Web Applications (Node.js, Next.js, Express) | Next.js apps, Express APIs, Web servers |
| **4000-4099** | Frontend Development Servers (React, Vue, etc.) | React dev server, Vite, Webpack dev server |
| **4200-4299** | Angular Development Servers | Angular CLI dev server |
| **5000-5099** | Backend Services (Python, Ruby, etc.) | Flask, Django, Rails, Sinatra |
| **6000-6099** | Microservices & APIs | REST APIs, GraphQL servers |
| **7000-7099** | Development Tools & Utilities | Storybook, Documentation servers |
| **8000-8099** | Backend Services (PHP, Java, etc.) | PHP-FPM, Tomcat, Spring Boot |
| **9000-9099** | Additional Services | WebSocket servers, Real-time services |
| **3306** | MySQL Databases | Standard MySQL port |
| **5432** | PostgreSQL Databases | Standard PostgreSQL port |
| **6379** | Redis | Standard Redis port |
| **27017** | MongoDB | Standard MongoDB port |

### Reserved Ports

These ports are reserved for specific services and should not be used for applications:

- **3306**: MySQL (standard)
- **5432**: PostgreSQL (standard)
- **6379**: Redis (standard)
- **27017**: MongoDB (standard)
- **8080**: Common HTTP alternative (use with caution)
- **8443**: HTTPS alternative (use with caution)

## Port Assignment Registry

### Current Project Port Assignments

| Project | App Type | Assigned Port | Status | Notes |
|---------|----------|---------------|--------|-------|
| **games** | Frontend (Angular) | 4200 | ✅ Assigned | Angular dev server |
| **games** | Backend (PHP) | 8080 | ✅ Assigned | Docker container |
| **games** | Database (MySQL) | 3306 | ✅ Reserved | Standard MySQL |
| **games** | phpMyAdmin | 8081 | ✅ Assigned | Database UI |
| **discord-story-bot** | Web Server | 3000 | ✅ Assigned | Express server |
| **spoon-me** | Frontend (Next.js) | 3001 | ⚠️ Needs Update | Currently 3000 (conflict) |
| **bots** | Web Panel | 3002 | ⚠️ Needs Update | Currently PORT env (unset) |
| **sandbox/keel** | Frontend (Angular) | 4201 | ⚠️ Needs Update | Currently 4200 (conflict) |

### Port Allocation Rules

1. **First-Come-First-Served**: Ports are assigned based on project creation order
2. **Sequential Assignment**: Similar app types get sequential ports (3000, 3001, 3002, etc.)
3. **Type-Based Ranges**: Each application type has its own port range
4. **Reserved Ports**: Standard database/service ports are always reserved

## Configuration Standards

### Standard Configuration Patterns

#### 1. Node.js/Express Applications

**Pattern**: Use environment variable with project-specific default

```javascript
// Standard pattern
const PORT = process.env.PORT || 3000; // Default to assigned port

// Example: discord-story-bot
const PORT = process.env.PORT || 3000;

// Example: bots (needs update)
const PORT = process.env.PORT || 3002; // Update from unset to 3002
```

**Configuration File**: `.env.example`
```env
# Port Configuration
PORT=3000
```

**package.json Scripts**:
```json
{
  "scripts": {
    "dev": "PORT=3000 node server.js",
    "start": "node server.js"
  }
}
```

#### 2. Next.js Applications

**Pattern**: Use PORT environment variable or `-p` flag

**Configuration File**: `.env.local` or `.env.example`
```env
# Port Configuration
PORT=3001
```

**package.json Scripts**:
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "start": "next start -p 3001"
  }
}
```

**Alternative**: Use `next.config.js` (not recommended for port, use env var instead)

#### 3. Angular Applications

**Pattern**: Configure in `angular.json` with project-specific port

**Configuration File**: `angular.json`
```json
{
  "projects": {
    "frontend": {
      "architect": {
        "serve": {
          "options": {
            "port": 4200
          }
        }
      }
    }
  }
}
```

**package.json Scripts**:
```json
{
  "scripts": {
    "start": "ng serve --port 4200",
    "dev": "ng serve --port 4200"
  }
}
```

#### 4. Docker Compose Applications

**Pattern**: Map host ports in `docker-compose.yml` with project-specific ports

**Configuration File**: `docker-compose.yml`
```yaml
services:
  php:
    ports:
      - "8080:80"  # Host:Container
    # ... other config

  mysql:
    ports:
      - "3306:3306"  # Standard MySQL port
    # ... other config

  phpmyadmin:
    ports:
      - "8081:80"  # Host:Container
    # ... other config
```

**Environment File**: `.env` (for docker-compose)
```env
# Port Configuration
PHP_PORT=8080
MYSQL_PORT=3306
PHPMYADMIN_PORT=8081
```

#### 5. Python Applications (Flask/Django)

**Pattern**: Use environment variable with project-specific default

```python
# Standard pattern
import os
PORT = int(os.environ.get('PORT', 5000))

# Example
PORT = int(os.environ.get('PORT', 5000))
```

**Configuration File**: `.env.example`
```env
# Port Configuration
PORT=5000
```

## Conflict Prevention Mechanisms

### 1. Port Registry Validation

**Location**: `docs/reference/PROJECTS_PORTS.md`

**Process**:
1. Before assigning a new port, check the registry
2. Verify no conflicts with existing assignments
3. Update registry with new assignment
4. Document the assignment with project name and app type

### 2. Port Conflict Detection Script

Create a script to detect port conflicts:

```bash
#!/bin/bash
# scripts/check-port-conflicts.sh

# Check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $port is in use"
        lsof -Pi :$port -sTCP:LISTEN
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Check all registered ports
echo "Checking registered ports..."
check_port 3000
check_port 3001
check_port 3002
check_port 4200
check_port 4201
check_port 8080
check_port 8081
check_port 3306
```

### 3. Pre-Start Port Validation

Add port validation to project startup scripts:

**Node.js/Express Example**:
```javascript
// utils/port-validator.js
function validatePort(port) {
  const net = require('net');
  const server = net.createServer();
  
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        reject(new Error(`Port ${port} is already in use`));
      } else {
        reject(err);
      }
    });
  });
}

// Usage in server.js
const PORT = process.env.PORT || 3000;
validatePort(PORT)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
```

### 4. Port Allocation Workflow

**When Starting a New Project**:

1. **Identify Application Type**
   - Determine if it's Node.js, Angular, Next.js, etc.

2. **Check Port Registry**
   - Review `docs/reference/PROJECTS_PORTS.md`
   - Find the next available port in the appropriate range

3. **Reserve Port**
   - Update the port registry with the new assignment
   - Document the project name, app type, and port

4. **Configure Project**
   - Set port in configuration file (`.env`, `angular.json`, etc.)
   - Use standard configuration pattern for the app type

5. **Test Port Availability**
   - Run port conflict detection script
   - Verify port is not in use

6. **Document Configuration**
   - Update project README with port information
   - Add port to `.env.example` if applicable

## Configuration File Standards

### Required Files

Each project should have:

1. **Port Configuration File**
   - `.env.example` (for Node.js/Next.js projects)
   - `angular.json` (for Angular projects)
   - `docker-compose.yml` (for Docker projects)

2. **Documentation**
   - Port mentioned in project README
   - Port listed in `docs/reference/PROJECTS_PORTS.md`

3. **Environment Variables**
   - PORT variable documented in `.env.example`
   - Default port value clearly specified

### Configuration File Templates

#### .env.example Template

```env
# Port Configuration
# Default port for this application
# Override with: PORT=<port> npm start
PORT=3000

# Database Port (if applicable)
DATABASE_PORT=3306

# Other service ports (if applicable)
REDIS_PORT=6379
```

#### angular.json Port Configuration

```json
{
  "projects": {
    "project-name": {
      "architect": {
        "serve": {
          "options": {
            "port": 4200,
            "host": "localhost"
          }
        }
      }
    }
  }
}
```

#### docker-compose.yml Port Configuration

```yaml
services:
  app:
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      - PORT=3000

  database:
    ports:
      - "${DB_PORT:-3306}:3306"
```

## Port Management Tools

### 1. Port Registry Script

Create a script to manage the port registry:

```bash
#!/bin/bash
# scripts/port-registry.sh

REGISTRY_FILE="docs/reference/PROJECTS_PORTS.md"

# Add new port assignment
add_port() {
    local project=$1
    local app_type=$2
    local port=$3
    
    # Check if port is already assigned
    if grep -q "|.*$port.*|" "$REGISTRY_FILE"; then
        echo "❌ Port $port is already assigned"
        return 1
    fi
    
    # Add to registry (implementation depends on registry format)
    echo "✅ Port $port assigned to $project ($app_type)"
}

# List all port assignments
list_ports() {
    grep -E "^\|.*\|.*\|.*\|" "$REGISTRY_FILE" | grep -v "Project Name"
}

# Check port availability
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "❌ Port $port is in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}
```

### 2. Port Conflict Detection

```bash
#!/bin/bash
# scripts/detect-port-conflicts.sh

# Scan all projects for port configurations
# Compare with running processes
# Report conflicts

echo "Scanning for port conflicts..."

# Get all ports from registry
PORTS=$(grep -oE "[0-9]{4,5}" docs/reference/PROJECTS_PORTS.md | sort -u)

for port in $PORTS; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $port is in use:"
        lsof -Pi :$port -sTCP:LISTEN
    fi
done
```

### 3. Port Allocation Helper

```bash
#!/bin/bash
# scripts/allocate-port.sh

# Allocate next available port for application type
# Usage: ./allocate-port.sh <app-type> <project-name>

APP_TYPE=$1
PROJECT_NAME=$2

case $APP_TYPE in
    "node"|"nextjs"|"express")
        START_PORT=3000
        ;;
    "angular")
        START_PORT=4200
        ;;
    "react"|"vite")
        START_PORT=4000
        ;;
    *)
        echo "Unknown app type: $APP_TYPE"
        exit 1
        ;;
esac

# Find next available port
# (Implementation: check registry and find next available)
```

## Migration Plan

### Current State Issues

1. **Port Conflicts**:
   - `spoon-me` and `discord-story-bot` both use port 3000
   - `games` and `sandbox/keel` both use port 4200
   - `bots` has no default port configured

2. **Inconsistent Configuration**:
   - Some projects use environment variables
   - Some projects hardcode ports
   - Some projects have no port configuration

### Migration Steps

#### Step 1: Update Port Assignments

1. **spoon-me**: Change from 3000 to 3001
   - Update `.env.example`: `PORT=3001`
   - Update `package.json` scripts: `"dev": "next dev -p 3001"`
   - Update documentation

2. **bots**: Set default port to 3002
   - Update `web.js`: `const PORT = process.env.PORT || 3002;`
   - Create `.env.example`: `PORT=3002`
   - Update documentation

3. **sandbox/keel**: Change from 4200 to 4201
   - Update `angular.json`: `"port": 4201`
   - Update `package.json` scripts: `"start": "ng serve --port 4201"`
   - Update documentation

#### Step 2: Standardize Configuration

For each project:
1. Ensure port is configured in standard location
2. Add `.env.example` with PORT variable (if applicable)
3. Update `package.json` scripts to use port
4. Document port in project README

#### Step 3: Update Registry

1. Update `docs/reference/PROJECTS_PORTS.md` with new assignments
2. Mark conflicts as resolved
3. Document migration in registry

#### Step 4: Validate

1. Run port conflict detection script
2. Test each project starts on correct port
3. Verify no conflicts exist

## Best Practices

### 1. Always Use Environment Variables

**Good**:
```javascript
const PORT = process.env.PORT || 3000;
```

**Bad**:
```javascript
const PORT = 3000; // Hardcoded
```

### 2. Document Port in Multiple Places

- Project README
- `.env.example`
- `docs/reference/PROJECTS_PORTS.md`
- Configuration files (if applicable)

### 3. Use Consistent Defaults

- Always provide a sensible default
- Use project-specific port from registry
- Never use port 0 (random port assignment)

### 4. Validate Port on Startup

- Check if port is available before starting
- Provide clear error messages if port is in use
- Exit gracefully if port conflict detected

### 5. Update Registry Immediately

- Update port registry when assigning new port
- Remove port from registry when project is deprecated
- Keep registry synchronized with actual configurations

## Port Management Checklist

When starting a new project:

- [ ] Identify application type
- [ ] Check port registry for available port
- [ ] Reserve port in registry
- [ ] Configure port in project (`.env`, `angular.json`, etc.)
- [ ] Add port to `.env.example` (if applicable)
- [ ] Update `package.json` scripts
- [ ] Document port in project README
- [ ] Test port availability
- [ ] Verify no conflicts exist

When updating existing project:

- [ ] Check current port assignment
- [ ] Verify no conflicts with new port
- [ ] Update all configuration files
- [ ] Update port registry
- [ ] Update project documentation
- [ ] Test port change

## Tools and Scripts

### Recommended Tools

1. **lsof**: Check if port is in use
   ```bash
   lsof -i :3000
   ```

2. **netstat**: Alternative port checking
   ```bash
   netstat -an | grep 3000
   ```

3. **Port Registry**: `docs/reference/PROJECTS_PORTS.md`
   - Centralized port tracking
   - Conflict detection reference

4. **Port Management Scripts**: (to be created)
   - `scripts/check-port-conflicts.sh`
   - `scripts/allocate-port.sh`
   - `scripts/port-registry.sh`

## Future Enhancements

1. **Automated Port Allocation**: Script to automatically assign next available port
2. **Port Conflict Detection**: CI/CD check for port conflicts
3. **Port Registry API**: Programmatic access to port registry
4. **Port Reservation System**: Lock ports during development
5. **Port Usage Analytics**: Track which ports are used most

## Architectural Considerations

### System Architecture for Port Management

The port management strategy should be implemented with a **centralized registry architecture** that supports:

1. **Single Source of Truth**: Central database (SQLite/MySQL/PostgreSQL) for port assignments
2. **Distributed Access**: Multiple developers can access the same registry
3. **Conflict Prevention**: Atomic operations for port allocation
4. **Audit Trail**: Complete history of port assignments and changes

### Scalability Architecture

**Current Strategy (Manual)**:
- File-based registry (`PROJECTS_PORTS.md`)
- Manual updates required
- Single-user access (file conflicts)
- No automated validation

**Future Architecture (Automated)**:
- Database-backed registry (SQLite/MySQL/PostgreSQL)
- Automated port allocation
- Multi-user support with database locking
- Real-time conflict detection
- CI/CD integration

### Integration Architecture

**Port Manager Package Integration**:
- CLI tool for port management
- Programmatic API for automation
- Framework-specific adapters
- CI/CD hooks and plugins

**Architecture Benefits**:
- **Separation of Concerns**: Registry separate from project configuration
- **Extensibility**: Easy to add new frameworks and tools
- **Testability**: Registry operations can be tested independently
- **Scalability**: Database backend supports growth

### Data Architecture

**Port Registry Schema**:
- Project name (unique identifier)
- Application type (for port range selection)
- Port number (unique constraint)
- Status (active, inactive, reserved)
- Metadata (configuration files, environment variables)
- Timestamps (created, updated, last used)

**Data Flow**:
1. Port allocation request → Registry check → Port assignment → Configuration update
2. Port validation → Registry check → System check → Conflict report
3. Port release → Registry update → Configuration cleanup

### Performance Architecture

**Optimization Strategies**:
1. **Caching**: In-memory cache for frequently accessed ports
2. **Indexing**: Database indexes on port, project name, app type
3. **Batch Operations**: Bulk validation for multiple projects
4. **Lazy Loading**: Load port data only when needed

**Performance Targets**:
- Port allocation: < 100ms
- Conflict detection: < 200ms per project
- Registry query: < 50ms
- Configuration update: < 100ms per file

## Summary

This strategy provides:

1. **Consistent Configuration**: Standard patterns for each application type
2. **Conflict Prevention**: Port ranges, registry, and validation
3. **Clear Documentation**: Port assignments tracked in registry
4. **Migration Path**: Steps to resolve current conflicts
5. **Best Practices**: Guidelines for port management
6. **Tools and Scripts**: Automation for port management

By following this strategy, all projects will have:
- Consistent port configuration
- No port conflicts
- Clear documentation
- Easy port management

---

## Review/Contribution

**Last Updated**: 2026-01-05  
**Status**: Active Strategy  
**Next Review**: When adding new projects or changing port assignments

**Expert**: Arthur Davis  
**Expertise**: Architecture (System Design and Scalability)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Architectural Considerations" section covering system architecture for port management (centralized registry architecture with single source of truth, distributed access, conflict prevention, audit trail), scalability architecture (comparing current manual file-based strategy with future automated database-backed architecture), integration architecture (Port Manager package integration with CLI tool, programmatic API, framework-specific adapters, CI/CD hooks, and architecture benefits including separation of concerns, extensibility, testability, scalability), data architecture (port registry schema with project name, application type, port number, status, metadata, timestamps, and data flow diagrams for port allocation, validation, and release), and performance architecture (optimization strategies including caching, indexing, batch operations, lazy loading, and performance targets for port allocation < 100ms, conflict detection < 200ms, registry query < 50ms, configuration update < 100ms). These additions provide architectural guidance for implementing the port management strategy at scale, ensuring the strategy supports future automation and multi-user scenarios while maintaining performance and scalability.

