# Domain Manager Feature - Product Requirements Document

## Overview

**Feature Name**: Domain Manager  
**Package**: `@colis/rig` (core package)  
**Version**: 1.0.9  
**Status**: Implemented  
**Last Updated**: 2026-01-25

## Executive Summary

Domain Manager is a local development tool that automatically manages local domain names using Caddy reverse proxy and system hosts file. It eliminates the need for developers to manually configure domains for local development, providing a seamless experience for setting up `*.local` domains that resolve to local services.

### Problem Statement

When working with multiple local development projects, developers face several challenges:
- **Port conflicts**: Keeping track of which ports are used by which projects
- **Local domain setup**: Manually configuring `/etc/hosts` and reverse proxy rules
- **Multi-service projects**: Managing separate frontend and backend services
- **Configuration complexity**: Remembering port numbers and domain configurations
- **Team consistency**: Ensuring all team members have the same local setup

### Solution

Domain Manager provides automated domain setup that:
- ✅ Automatically detects project services and ports
- ✅ Generates and configures Caddy reverse proxy rules
- ✅ Updates system hosts file with proper entries
- ✅ Supports both single-service and multi-service projects
- ✅ Validates domain names and prevents configuration errors
- ✅ Provides CLI commands for easy management

## User Stories

### Primary User Stories

**As a developer**, I want to quickly set up a local domain for my project so that I can access it with a memorable URL instead of `localhost:PORT`.

**As a developer**, I want automatic detection of my project's ports so that I don't have to manually specify them.

**As a developer**, I want to manage multiple projects with different domains so that I can work on several projects simultaneously without conflicts.

**As a developer**, I want to easily list all my configured domains so that I can see what's currently set up.

**As a developer**, I want to remove domain configurations when I'm done with a project so that I can keep my system clean.

### Secondary User Stories

**As a developer**, I want custom domain names for my projects so that I can use meaningful URLs.

**As a developer**, I want support for multi-service projects (frontend + backend) so that I can work with full-stack applications.

**As a developer**, I want clear error messages when something goes wrong so that I can quickly fix configuration issues.

**As a developer**, I want the system to validate my domain names so that I don't create invalid configurations.

## Features

### 1. Automatic Domain Setup

**Priority**: P1 (Critical)

**Description**: Automatically configure a local domain for a project, including Caddy reverse proxy and hosts file entries.

**Functional Requirements**:
- Generate domain name from project name (e.g., `my-project.local`)
- Accept custom domain names
- Support single-service projects (one port)
- Support multi-service projects (frontend + backend ports)
- Auto-detect project services and ports
- Update Caddyfile with reverse proxy rules
- Update `/etc/hosts` with domain entry
- Validate domain name format
- Check Caddy installation before setup

**Technical Details**:
```typescript
// Programmatic API
const manager = new DomainManager();
const result = await manager.setup('/path/to/project', {
  projectName: 'my-project',
  // Ports are auto-detected if not provided
  frontendPort: 4200,  // Optional
  backendPort: 8080,   // Optional
});

// CLI
npx @colis/rig domain-manager setup --project-name my-project
```

**Success Criteria**:
- Domain is accessible via browser
- Caddyfile contains correct configuration
- Hosts file contains correct entry
- Auto-detection works for Angular, React, Node.js, PHP projects
- Error messages are clear and actionable

### 2. Service Detection

**Priority**: P1 (Critical)

**Description**: Automatically detect project type and service ports from project structure and configuration files.

**Functional Requirements**:
- Detect Angular projects (`angular.json`)
- Detect React projects (`package.json` with react dependency)
- Detect Node.js backend services
- Detect PHP projects
- Extract port numbers from configuration files
- Identify multi-service projects (frontend + backend)
- Provide sensible defaults when detection fails

**Technical Details**:
- Searches for `angular.json`, `package.json`, `composer.json`
- Parses configuration files for port information
- Returns detected service information:
  ```typescript
  interface DetectedService {
    name: 'frontend' | 'backend' | 'root';
    type: 'angular' | 'react' | 'node' | 'php';
    path: string;
    detectedPort?: number;
  }
  ```

**Success Criteria**:
- Correctly identifies project type 95% of the time
- Extracts port numbers when available in config files
- Falls back to sensible defaults (Angular: 4200, API: 8080, etc.)

### 3. Domain Removal

**Priority**: P1 (Critical)

**Description**: Remove domain configuration from both Caddyfile and hosts file.

**Functional Requirements**:
- Remove domain block from Caddyfile
- Remove entry from hosts file
- Reload Caddy configuration
- Validate domain name before removal
- Provide clear feedback on removal success

**Technical Details**:
```typescript
// Programmatic API
await manager.remove('my-project.local');

// CLI
npx @colis/rig domain-manager remove my-project.local
```

**Success Criteria**:
- Domain is no longer accessible
- Caddyfile no longer contains domain block
- Hosts file no longer contains entry
- Caddy reloads successfully

### 4. Domain Listing

**Priority**: P2 (Important)

**Description**: List all configured domains with their configuration details.

**Functional Requirements**:
- Parse Caddyfile to extract domain configurations
- Check hosts file for corresponding entries
- Display domain name, ports, and configuration status
- Show both single-service and multi-service configurations
- Indicate if domain has hosts file entry

**Technical Details**:
```typescript
// Programmatic API
const domains = await manager.list();
// Returns DomainInfo[] with domain, ports, and status

// CLI
npx @colis/rig domain-manager list
```

**Success Criteria**:
- All configured domains are listed
- Port information is accurate
- Multi-service vs single-service is clearly indicated
- Hosts file status is shown

### 5. Caddy Installation Check

**Priority**: P1 (Critical)

**Description**: Verify that Caddy is installed and running before attempting domain setup.

**Functional Requirements**:
- Check if Caddy binary is available in PATH
- Check if Caddy service is running
- Provide installation instructions if Caddy is not installed
- Provide clear error messages with resolution steps

**Technical Details**:
```typescript
// Programmatic API
const installed = await manager.checkCaddyInstalled();
const running = await manager.checkCaddyRunning();

// CLI
npx @colis/rig domain-manager install
```

**Success Criteria**:
- Accurately detects Caddy installation
- Provides platform-specific installation instructions
- Clear error messages guide user to resolution

### 6. Error Handling

**Priority**: P1 (Critical)

**Description**: Comprehensive error handling with clear, actionable error messages.

**Functional Requirements**:
- Custom error classes for different failure scenarios
- Error codes for programmatic handling
- Detailed error context (domain, operation, file paths)
- User-friendly error messages in CLI
- Graceful degradation (e.g., continue if hosts file update fails)

**Error Classes**:
- `DomainManagerError`: Base error class
- `CaddyNotInstalledError`: Caddy is not installed
- `CaddyNotRunningError`: Caddy is not running
- `DomainConfigurationError`: Domain configuration failed
- `HostsFileError`: Hosts file operation failed
- `DomainValidationError`: Invalid domain name
- `CaddyfileError`: Caddyfile operation failed

**Success Criteria**:
- All errors are caught and handled appropriately
- Error messages provide clear resolution steps
- CLI displays user-friendly error messages
- Programmatic API provides structured error objects

### 7. Multi-Service Support

**Priority**: P2 (Important)

**Description**: Support projects with both frontend and backend services, configuring Caddy to route appropriately.

**Functional Requirements**:
- Detect multi-service project structure
- Configure Caddy to proxy frontend requests to frontend port
- Configure Caddy to proxy `/api/*` requests to backend port
- Support custom API path prefixes
- Generate appropriate Caddy configuration blocks

**Technical Details**:
```typescript
// Multi-service configuration
const result = await manager.setup('/path/to/project', {
  projectName: 'my-project',
  frontendPort: 4200,
  backendPort: 8080,
});

// Caddy config generated:
// my-project.local {
//   handle /api/* {
//     reverse_proxy localhost:8080
//   }
//   handle {
//     reverse_proxy localhost:4200
//   }
// }
```

**Success Criteria**:
- Frontend requests route to frontend port
- API requests route to backend port
- Configuration works for common frameworks (Angular + Node, React + Express, etc.)

## Technical Architecture

### Component Structure

```
domain-manager/
├── domain-manager.ts       # Main orchestration class
├── caddy-manager.ts        # Caddyfile management
├── hosts-manager.ts        # Hosts file management
├── service-detector.ts     # Project service detection
├── types.ts                # TypeScript types
├── errors.ts               # Custom error classes
├── interfaces.ts           # Interface definitions
└── cli/
    └── commands/
        ├── setup.ts        # Setup command
        ├── remove.ts       # Remove command
        ├── list.ts         # List command
        └── install.ts      # Install check command
```

### Architecture Pattern

**Layered Architecture** with clear separation of concerns:

1. **Service Layer** (`DomainManager`): Orchestrates operations, validates inputs
2. **Infrastructure Layer** (`CaddyManager`, `HostsManager`): Handles file operations
3. **Detection Layer** (`ServiceDetector`): Analyzes project structure
4. **Presentation Layer** (`cli/commands/*`): User-facing CLI interface

### Dependency Injection

Supports dependency injection for testability:

```typescript
// Custom implementations for testing
const manager = new DomainManager({
  caddyManager: mockCaddyManager,
  hostsManager: mockHostsManager,
  serviceDetector: mockServiceDetector,
});
```

### Data Flow

**Setup Flow**:
1. Validate inputs (project path, project name)
2. Check Caddy installation
3. Generate/validate domain name
4. Detect services and ports (if not provided)
5. Add domain to Caddyfile
6. Reload Caddy configuration
7. Add entry to hosts file

**Removal Flow**:
1. Validate domain name
2. Remove domain block from Caddyfile
3. Reload Caddy configuration
4. Remove entry from hosts file

## Integration Points

### With Port Manager

Domain Manager can integrate with Port Manager to automatically allocate and use managed ports:

```typescript
// Future integration
const portManager = new PortManager();
const port = await portManager.allocate('my-project', 'angular');

const domainManager = new DomainManager();
await domainManager.setup('/path/to/project', {
  projectName: 'my-project',
  frontendPort: port,
});
```

### With Project Initialization

Domain Manager is integrated into the project initialization workflow:

```typescript
// In project initialization
const domainManager = new DomainManager();
const domainResult = await domainManager.setup(projectPath, {
  projectName: options.projectName,
  // Ports from Port Manager
  frontendPort: frontendPort,
  backendPort: backendPort,
});
```

## Non-Functional Requirements

### Performance

- **Setup time**: < 2 seconds for domain setup
- **Detection time**: < 500ms for service detection
- **File operations**: < 100ms for Caddyfile/hosts file operations

### Reliability

- **Success rate**: 99%+ for common project types
- **Error recovery**: Graceful handling of all error scenarios
- **Idempotency**: Running setup multiple times is safe

### Security

- **Input validation**: All user inputs are validated
- **Path validation**: Prevents directory traversal attacks
- **Backup creation**: Creates backups before modifying files
- **Permission handling**: Properly handles sudo operations for hosts file

### Maintainability

- **Test coverage**: 80%+ code coverage
- **Documentation**: Comprehensive JSDoc comments
- **Error handling**: All error scenarios documented
- **Type safety**: Full TypeScript type coverage

### Compatibility

- **Operating Systems**: macOS, Linux, Windows (with WSL)
- **Caddy Versions**: 2.x
- **Node.js Versions**: 18+
- **Project Types**: Angular, React, Node.js, PHP, generic

## Configuration

### Default Configuration

```typescript
const DEFAULT_PORTS = {
  ANGULAR_FRONTEND: 4200,
  BACKEND_API: 8080,
  SINGLE_SERVICE: 3000,
};

const DOMAIN_SUFFIX = '.local';
```

### Configurable Paths

```typescript
const manager = new DomainManager({
  caddyfilePath: '/custom/path/Caddyfile',
  hostsPath: '/custom/path/hosts',
});
```

## Testing Strategy

### Unit Tests

- All error classes (`errors.test.ts`)
- DomainManager class (`domain-manager.test.ts`)
- CaddyManager class (`caddy-manager.test.ts`)
- HostsManager class (`hosts-manager.test.ts`)
- ServiceDetector class (`service-detector.test.ts`)

### Integration Tests

- End-to-end domain setup workflow
- Multi-service project configuration
- Error scenarios and recovery

### Test Coverage

- Target: 80%+ code coverage
- Current: Comprehensive test suite with mocked dependencies

## Success Metrics

### User Adoption

- **Target**: 90% of new projects use domain manager
- **Measurement**: Track domain manager setup in project initialization

### User Satisfaction

- **Target**: 4.5/5 user satisfaction rating
- **Measurement**: Developer feedback surveys

### Reliability

- **Target**: < 1% error rate for domain setup
- **Measurement**: Error logs and monitoring

### Performance

- **Target**: Average setup time < 2 seconds
- **Measurement**: Performance monitoring

## Future Enhancements

### Domain Registry (v2.0)

Centralized domain tracking system (similar to Port Manager):
- Persistent storage of domain configurations
- Conflict detection across projects
- Domain allocation and reservation
- Global domain listing across all projects

### Multi-Environment Support (v2.0)

Support for different environments:
- Development domains (`.local`)
- Staging domains (`.staging`)
- Custom environment configurations

### Domain Templates (v2.0)

Predefined domain configurations:
- Common project patterns
- Framework-specific templates
- Team-shared configurations

### Batch Operations (v2.0)

Manage multiple domains at once:
- Setup multiple projects
- Remove multiple domains
- Bulk configuration updates

### SSL/TLS Support (v3.0)

Automatic SSL certificate generation for local development:
- Generate self-signed certificates
- Trust certificates automatically
- HTTPS support for local domains

## Risks and Mitigation

### Risk: Caddy Not Installed

**Mitigation**: 
- Check Caddy installation before any operation
- Provide clear installation instructions
- Offer automated installation option

### Risk: Hosts File Permissions

**Mitigation**:
- Detect permission issues early
- Request sudo access when needed
- Provide clear error messages with resolution steps
- Allow domain setup to proceed even if hosts update fails

### Risk: Port Conflicts

**Mitigation**:
- Integrate with Port Manager for conflict detection
- Validate ports before configuration
- Provide clear error messages for port conflicts

### Risk: Invalid Domain Names

**Mitigation**:
- Strict domain name validation
- Clear error messages with format requirements
- Auto-generate valid domain names from project names

## Dependencies

### Required Dependencies

- `fs-extra`: File system operations
- `child_process`: Process execution for Caddy commands
- `path`: Path manipulation
- Caddy 2.x: Reverse proxy server

### Optional Dependencies

- Port Manager: For automatic port allocation
- Tech Detector: For enhanced service detection

## Documentation

### User Documentation

- **README**: Quick start guide in package README
- **CLI Help**: `--help` flags for all commands
- **Examples**: Common usage patterns

### Developer Documentation

- **Architecture**: `ARCHITECTURE.md` - System design and patterns
- **API Documentation**: JSDoc comments in code
- **Type Definitions**: TypeScript types and interfaces

### Troubleshooting

- **Common Issues**: Installation problems, permission issues
- **Error Messages**: Clear descriptions and resolution steps
- **Debug Mode**: Verbose logging for troubleshooting

## Versioning and Release Strategy

### Current Version: 1.0.0

- ✅ Core domain management functionality
- ✅ Service detection
- ✅ Multi-service support
- ✅ Error handling
- ✅ CLI commands
- ✅ Comprehensive test suite

### Planned Releases

**v1.1.0** (Enhancement):
- Domain registry integration
- Enhanced service detection
- Performance improvements

**v2.0.0** (Major):
- Multi-environment support
- Domain templates
- Batch operations

**v3.0.0** (Major):
- SSL/TLS support
- Advanced Caddy features
- Cloud integration

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Domain Not Accessible

**Symptoms**: Browser shows "This site can't be reached" or "Server not found" when accessing `http://my-project.local`

**Diagnosis Steps**:
```bash
# 1. Check if domain is configured
npx @colis/rig domain-manager list

# 2. Check if Caddy is running
ps aux | grep caddy
# OR
caddy status

# 3. Check hosts file
cat /etc/hosts | grep .local

# 4. Test DNS resolution
ping my-project.local

# 5. Check port availability
lsof -i :4200
```

**Solutions**:

**A. Domain not in list**:
```bash
# Setup domain
npx @colis/rig domain-manager setup --project-name my-project
```

**B. Caddy not running**:
```bash
# Start Caddy (macOS with Homebrew)
brew services start caddy

# Start Caddy (Linux systemd)
sudo systemctl start caddy

# Start Caddy manually
caddy run --config /path/to/Caddyfile
```

**C. Hosts file not updated**:
```bash
# Check if entry exists
cat /etc/hosts | grep my-project.local

# If missing, add manually (requires sudo)
echo "127.0.0.1 my-project.local" | sudo tee -a /etc/hosts

# OR re-run setup
npx @colis/rig domain-manager setup --project-name my-project
```

**D. Application not running**:
```bash
# Start your application on the configured port
npm start
# OR
ng serve
# OR check your package.json scripts
```

#### Issue 2: Caddy Not Installed

**Symptoms**: Error message "Caddy is not installed"

**Solutions**:

**macOS (Homebrew)**:
```bash
brew install caddy
```

**Ubuntu/Debian**:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

**Fedora/RHEL/CentOS**:
```bash
dnf install 'dnf-command(copr)'
dnf copr enable @caddy/caddy
dnf install caddy
```

**Verify installation**:
```bash
caddy version
```

#### Issue 3: Port Conflicts

**Symptoms**: Error message "Port already in use" or application fails to start

**Diagnosis**:
```bash
# Check what's using the port
lsof -i :4200

# Check Port Manager allocation
npx @colis/rig port-manager list
```

**Solutions**:

**A. Application using wrong port**:
```bash
# Check .port-manager.json
cat .port-manager.json

# Update application to use allocated port
# (Angular example)
ng serve --port 4200
```

**B. Port conflict with another project**:
```bash
# Allocate a new port
npx @colis/rig port-manager allocate --project-name my-project

# Update domain configuration
npx @colis/rig domain-manager setup --project-name my-project
```

#### Issue 4: Caddyfile Syntax Errors

**Symptoms**: Caddy fails to reload, error messages about Caddyfile

**Diagnosis**:
```bash
# Validate Caddyfile
caddy validate --config /path/to/Caddyfile

# OR let Caddy show the error
caddy reload --config /path/to/Caddyfile
```

**Solutions**:

**A. Fix syntax manually**:
```bash
# Edit Caddyfile
nano /path/to/Caddyfile

# Validate after editing
caddy validate --config /path/to/Caddyfile
```

**B. Regenerate domain configuration**:
```bash
# Remove broken configuration
npx @colis/rig domain-manager remove my-project.local

# Re-setup with correct configuration
npx @colis/rig domain-manager setup --project-name my-project
```

#### Issue 5: Multi-Service Project Not Working

**Symptoms**: Frontend works but backend API returns 404 or vice versa

**Diagnosis**:
```bash
# Check domain configuration
npx @colis/rig domain-manager list

# Check if both services are running
lsof -i :4200  # Frontend
lsof -i :8080  # Backend

# Test API directly
curl http://localhost:8080/api/test
```

**Solutions**:

**A. Backend not running**:
```bash
# Start backend service
cd backend/
npm start
# OR your backend start command
```

**B. Frontend not routing API calls**:
```bash
# Check Caddyfile configuration
cat Caddyfile | grep -A 10 "my-project.local"

# Should show:
# my-project.local {
#   handle /api/* {
#     reverse_proxy localhost:8080
#   }
#   handle {
#     reverse_proxy localhost:4200
#   }
# }
```

**C. Wrong API path prefix**:
```bash
# If your API uses different prefix (e.g., /api/v1)
# You need to manually update Caddyfile or
# configure your application to use /api/*
```

#### Issue 6: Hosts File Permissions

**Symptoms**: Error message "Permission denied" when updating hosts file

**Solutions**:

**A. Run with sudo** (domain manager should handle this):
```bash
# The tool should prompt for sudo
npx @colis/rig domain-manager setup --project-name my-project
```

**B. Manual hosts file update**:
```bash
# Add entry manually
echo "127.0.0.1 my-project.local" | sudo tee -a /etc/hosts

# Verify
cat /etc/hosts | grep my-project.local
```

#### Issue 7: Domain Works But Shows Wrong Content

**Symptoms**: Domain loads but shows content from different project

**Diagnosis**:
```bash
# Check all configured domains
npx @colis/rig domain-manager list

# Check Caddyfile for conflicts
cat Caddyfile
```

**Solutions**:

**A. Remove duplicate/conflicting domains**:
```bash
# List domains to find duplicates
npx @colis/rig domain-manager list

# Remove old/conflicting domain
npx @colis/rig domain-manager remove old-project.local
```

**B. Reload Caddy**:
```bash
# Reload Caddy configuration
caddy reload --config /path/to/Caddyfile
```

### Verification Checklist

Use this checklist to verify domain setup is working correctly:

```bash
# 1. ✓ Caddy is installed
caddy version

# 2. ✓ Caddy is running
ps aux | grep caddy

# 3. ✓ Domain is configured in domain manager
npx @colis/rig domain-manager list

# 4. ✓ Domain is in hosts file
cat /etc/hosts | grep my-project.local

# 5. ✓ Port is allocated
npx @colis/rig port-manager list

# 6. ✓ Application is running
lsof -i :4200

# 7. ✓ Domain resolves
ping my-project.local

# 8. ✓ Domain is accessible
curl http://my-project.local

# 9. ✓ Browser access works
# Open http://my-project.local in browser
```

### Quick Fix Commands

**Reset domain configuration**:
```bash
# Remove domain
npx @colis/rig domain-manager remove my-project.local

# Re-setup domain
npx @colis/rig domain-manager setup --project-name my-project

# Reload Caddy
caddy reload
```

**Full project re-initialization**:
```bash
# In your project directory
npx @colis/rig update

# This will fix:
# - Port Manager
# - Domain Manager
# - Rules and commands
# - IDE colors
```

**Manual Caddy reload**:
```bash
# Reload Caddy with default config location
caddy reload --config ~/Caddyfile

# OR find Caddyfile and reload
caddy reload --config $(find ~ -name Caddyfile | head -n 1)
```

### Debug Mode

For detailed troubleshooting information, you can enable verbose logging:

```bash
# Set environment variable for verbose output
DEBUG=domain-manager* npx @colis/rig domain-manager setup --project-name my-project
```

### Getting Help

If you're still experiencing issues:

1. **Check error messages**: Domain Manager provides detailed error messages with resolution steps
2. **Review logs**: Check Caddy logs for detailed information
   ```bash
   # macOS Homebrew
   tail -f /usr/local/var/log/caddy/caddy.log
   
   # Linux systemd
   sudo journalctl -u caddy -f
   ```
3. **Verify configuration**: Ensure all files are correctly configured
4. **Ask for help**: Include error messages, system info, and steps you've tried

### Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `Caddy is not installed` | Caddy not found in PATH | Install Caddy (see Issue 2) |
| `Permission denied` | Insufficient permissions for hosts file | Run with sudo or check permissions |
| `Port already in use` | Port conflict with another process | Kill other process or allocate new port |
| `Invalid domain name` | Domain format is incorrect | Use valid format: `name.local` |
| `Caddyfile not found` | Caddyfile missing or wrong path | Re-run domain setup |
| `Failed to reload Caddy` | Caddy configuration error | Validate Caddyfile syntax |
| `Domain already exists` | Domain already configured | Remove old domain first |

## Appendix

### CLI Command Reference

```bash
# Setup a domain
npx @colis/rig domain-manager setup --project-name my-project

# Remove a domain
npx @colis/rig domain-manager remove my-project.local

# List all domains
npx @colis/rig domain-manager list

# Check Caddy installation
npx @colis/rig domain-manager install
```

### Programmatic API Reference

```typescript
import { DomainManager } from '@colis/rig/features/domain-manager';

// Create instance
const manager = new DomainManager();

// Setup domain
const result = await manager.setup('/path/to/project', {
  projectName: 'my-project',
  frontendPort: 4200,  // Optional
  backendPort: 8080,   // Optional
});

// Remove domain
await manager.remove('my-project.local');

// List domains
const domains = await manager.list();

// Check Caddy status
const installed = await manager.checkCaddyInstalled();
const running = await manager.checkCaddyRunning();
```

### Related Documentation

- **[Domain Manager Architecture](../../packages/core/src/features/domain-manager/ARCHITECTURE.md)**: Detailed architecture documentation
- **[Port Manager PRD](./port-manager/PRD.md)**: Related feature documentation
- **[Project Initialization PRD](./commissioning/PRD.md)**: Integration documentation
- **[@colis/rig Package README](../../packages/core/README.md)**: Package overview

---

## Review/Contribution

**Author**: AI Assistant  
**Date**: 2026-01-25  
**Changes**: Created comprehensive PRD for Domain Manager feature covering problem statement, user stories, features (domain setup, service detection, removal, listing, Caddy checks, error handling, multi-service support), technical architecture (component structure, layered architecture, dependency injection, data flow), integration points (Port Manager, Project Initialization), non-functional requirements (performance, reliability, security, maintainability, compatibility), configuration, testing strategy, success metrics, future enhancements (domain registry, multi-environment, templates, batch operations, SSL/TLS), risks and mitigation, dependencies, documentation, versioning/release strategy, comprehensive troubleshooting guide (common issues, verification checklist, quick fixes, debug mode, error messages reference), and comprehensive appendix with CLI commands, programmatic API reference, and related documentation links.
