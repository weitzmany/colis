# MCP (Model Context Protocol) Configurations

This document lists all MCP configurations found in other projects and the consolidated configuration for this project.

**Last Updated**: 2026-01-05

## MCP Configurations Found in Other Projects

### 1. `/Users/yoavweitzman/Documents/games/.cursor/mcp.json`

**MCP Servers Configured:**
- `filesystem` - File operations for `/Users/yoavweitzman/Documents/games`
- `angular-cli` - Angular CLI wrapper script
- `taskmaster-ai` - Task management (no API keys in env)
- `github` - GitHub operations with custom package

**Configuration:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yoavweitzman/Documents/games"]
    },
    "angular-cli": {
      "command": "/Users/yoavweitzman/.local/bin/ng-mcp-wrapper.sh"
    },
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "github-mcp-custom", "stdio"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

### 2. `/Users/yoavweitzman/Documents/sandbox/.cursor/mcp.json`

**MCP Servers Configured:**
- `angular-cli` - Angular CLI wrapper script
- `taskmaster-ai` - Task management with full API keys
- `github` - GitHub operations with custom package

**Configuration:**
```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "/Users/yoavweitzman/.local/bin/ng-mcp-wrapper.sh"
    },
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "YOUR_GOOGLE_API_KEY_HERE",
        "MISTRAL_API_KEY": "YOUR_MISTRAL_API_KEY_HERE",
        "OPENROUTER_API_KEY": "YOUR_OPENROUTER_API_KEY_HERE",
        "XAI_API_KEY": "YOUR_XAI_API_KEY_HERE"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "github-mcp-custom", "stdio"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

## MCP Servers Summary

### All MCP Servers Found:

1. **filesystem** (`@modelcontextprotocol/server-filesystem`)
   - Enhanced file operations
   - Found in: `games/.cursor/mcp.json`
   - Root path: `/Users/yoavweitzman/Documents/games`

2. **angular-cli**
   - Angular CLI wrapper script
   - Command: `/Users/yoavweitzman/.local/bin/ng-mcp-wrapper.sh`
   - Found in: `games/.cursor/mcp.json`, `sandbox/.cursor/mcp.json`

3. **taskmaster-ai** (`task-master-ai`)
   - Task management with multiple AI provider API keys
   - Found in: `games/.cursor/mcp.json`, `sandbox/.cursor/mcp.json`
   - API Keys (from sandbox):
     - ANTHROPIC_API_KEY
     - OPENAI_API_KEY
     - GOOGLE_API_KEY
     - MISTRAL_API_KEY
     - OPENROUTER_API_KEY
     - XAI_API_KEY

4. **github** (`github-mcp-custom`)
   - GitHub operations (custom package, not standard @modelcontextprotocol/server-github)
   - Found in: `games/.cursor/mcp.json`, `sandbox/.cursor/mcp.json`
   - Requires: GITHUB_PERSONAL_ACCESS_TOKEN

## Consolidated Configuration for This Project

**Note**: During planning mode, the actual `.cursor/mcp.json` file is not created. The configuration below shows what will be needed when planning mode ends.

**Planned Configuration Location**: `/Users/yoavweitzman/Documents/packages/.cursor/mcp.json`

**Planned MCPs:**
- `filesystem` - File operations for this project (configured for `/Users/yoavweitzman/Documents/packages`)
- `angular-cli` - Angular CLI wrapper (if needed)
- `taskmaster-ai` - Task management with all API keys
- `github` - GitHub operations

**Security Note**: All API keys and tokens in this documentation have been redacted. Actual secrets should never be committed to version control. See [Security and Secrets](../guides/SECURITY_AND_SECRETS.md) for details.

**Planning Mode**: The actual configuration file will be created after planning mode ends and implementation begins.

---

## API Design Considerations for MCP Configurations

When designing and configuring MCP (Model Context Protocol) servers, apply RESTful API design principles to ensure consistency, maintainability, and developer experience. MCP servers expose APIs that should follow established API design patterns.

### MCP Server API Design Principles

#### 1. **Consistent Interface Design**
- **Uniform Resource Naming**: Use consistent naming conventions for MCP server resources
- **Standardized Commands**: Follow consistent command patterns across servers
- **Predictable Behavior**: MCP servers should behave predictably across different contexts
- **Example**:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/root"]
      }
    }
  }
  ```

#### 2. **API Versioning for MCP Servers**
- **Server Versioning**: Track MCP server versions in configuration
- **Protocol Versioning**: Support multiple MCP protocol versions
- **Backward Compatibility**: Maintain backward compatibility when possible
- **Example**:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem@1.0.0"],
        "version": "1.0.0",
        "protocolVersion": "2024-11-05"
      }
    }
  }
  ```

#### 3. **API Contract Definition**
- **Clear Interfaces**: Define clear interfaces for each MCP server
- **Input Validation**: Validate inputs before processing
- **Output Consistency**: Ensure consistent output formats
- **Error Contracts**: Define standard error response formats
- **Example**:
  ```json
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "github-mcp-custom", "stdio"],
        "contract": {
          "capabilities": ["read", "write", "search"],
          "rateLimits": {
            "requestsPerMinute": 60
          },
          "errorFormat": "standard"
        }
      }
    }
  }
  ```

#### 4. **Request/Response Patterns**
- **Standardized Requests**: Use consistent request formats
- **Structured Responses**: Return structured, predictable responses
- **Metadata Inclusion**: Include metadata in responses (timestamps, request IDs)
- **Pagination Support**: Support pagination for large result sets
- **Example**:
  ```json
  {
    "mcpServers": {
      "taskmaster-ai": {
        "command": "npx",
        "args": ["-y", "task-master-ai"],
        "requestPattern": {
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "action": "string",
            "params": "object"
          }
        },
        "responsePattern": {
          "success": {
            "status": "success",
            "data": "object",
            "metadata": {
              "timestamp": "ISO8601",
              "requestId": "string"
            }
          },
          "error": {
            "status": "error",
            "error": {
              "code": "string",
              "message": "string",
              "details": "object"
            }
          }
        }
      }
    }
  }
  ```

#### 5. **Error Handling and Status Codes**
- **Standard Error Codes**: Use standard HTTP-like status codes
- **Error Messages**: Provide clear, actionable error messages
- **Error Context**: Include context in error responses
- **Retry Logic**: Define retry strategies for transient errors
- **Example**:
  ```json
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "github-mcp-custom", "stdio"],
        "errorHandling": {
          "retryableErrors": [429, 500, 502, 503],
          "maxRetries": 3,
          "retryDelay": "exponential",
          "errorCodes": {
            "400": "Bad Request",
            "401": "Unauthorized",
            "403": "Forbidden",
            "404": "Not Found",
            "429": "Rate Limited",
            "500": "Internal Server Error"
          }
        }
      }
    }
  }
  ```

#### 6. **API Security Design**
- **Authentication**: Implement secure authentication mechanisms
- **Authorization**: Define authorization levels per server
- **Secret Management**: Use secure secret storage and rotation
- **Input Sanitization**: Sanitize all inputs to prevent injection attacks
- **Example**:
  ```json
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "github-mcp-custom", "stdio"],
        "security": {
          "authentication": "token",
          "authorization": {
            "read": ["repo:read"],
            "write": ["repo:write"]
          },
          "secretStorage": "environment-variables",
          "secretRotation": true
        },
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
        }
      }
    }
  }
  ```

#### 7. **API Rate Limiting and Throttling**
- **Rate Limits**: Define rate limits per MCP server
- **Throttling Strategy**: Implement throttling for high-volume servers
- **Quota Management**: Manage quotas for resource-intensive operations
- **Example**:
  ```json
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "github-mcp-custom", "stdio"],
        "rateLimiting": {
          "requestsPerMinute": 60,
          "requestsPerHour": 5000,
          "burstLimit": 10,
          "throttleStrategy": "exponential-backoff"
        }
      }
    }
  }
  ```

#### 8. **API Documentation Standards**
- **OpenAPI/Swagger**: Document MCP server APIs using OpenAPI
- **Endpoint Documentation**: Document all available endpoints
- **Parameter Documentation**: Document all parameters and their types
- **Example Documentation**: Provide examples for common use cases
- **Example**:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/root"],
        "documentation": {
          "openApiSpec": "https://example.com/filesystem-api.yaml",
          "endpoints": [
            {
              "path": "/files/read",
              "method": "POST",
              "description": "Read file contents",
              "parameters": {
                "path": {
                  "type": "string",
                  "required": true,
                  "description": "File path relative to root"
                }
              }
            }
          ]
        }
      }
    }
  }
  ```

### MCP Server API Design Patterns

#### Pattern 1: Resource-Based API Design
- **Resources as Nouns**: Model MCP server operations as resources
- **Actions as Verbs**: Use standard HTTP verbs (GET, POST, PUT, DELETE)
- **Resource Hierarchy**: Organize resources hierarchically
- **Example**:
  ```json
  {
    "mcpServers": {
      "filesystem": {
        "resources": {
          "files": {
            "operations": ["read", "write", "list", "delete"]
          },
          "directories": {
            "operations": ["create", "list", "delete"]
          }
        }
      }
    }
  }
  ```

#### Pattern 2: Command-Based API Design
- **Commands as Actions**: Model operations as commands
- **Command Parameters**: Pass parameters as command arguments
- **Command Results**: Return structured command results
- **Example**:
  ```json
  {
    "mcpServers": {
      "angular-cli": {
        "commands": {
          "generate": {
            "parameters": ["component", "service", "module"],
            "options": ["--skip-tests", "--dry-run"]
          },
          "build": {
            "parameters": ["--configuration", "--output-path"],
            "options": ["--prod", "--watch"]
          }
        }
      }
    }
  }
  ```

#### Pattern 3: Event-Driven API Design
- **Event Publishers**: MCP servers publish events
- **Event Subscribers**: Clients subscribe to events
- **Event Types**: Define standard event types
- **Example**:
  ```json
  {
    "mcpServers": {
      "taskmaster-ai": {
        "events": {
          "task.created": {
            "description": "Emitted when a task is created",
            "payload": {
              "taskId": "string",
              "title": "string",
              "status": "string"
            }
          },
          "task.updated": {
            "description": "Emitted when a task is updated",
            "payload": {
              "taskId": "string",
              "changes": "object"
            }
          }
        }
      }
    }
  }
  ```

### MCP Server API Best Practices

#### 1. **Consistency Across Servers**
- Use consistent naming conventions
- Follow standard patterns for similar operations
- Maintain uniform error handling
- Standardize response formats

#### 2. **Backward Compatibility**
- Maintain API contracts across versions
- Deprecate features gradually
- Provide migration paths
- Document breaking changes

#### 3. **Performance Optimization**
- Implement caching where appropriate
- Use efficient data formats
- Minimize payload sizes
- Support compression

#### 4. **Observability**
- Log all API calls
- Track performance metrics
- Monitor error rates
- Alert on anomalies

#### 5. **Testing and Validation**
- Test API contracts
- Validate request/response formats
- Test error scenarios
- Verify security controls

### MCP Configuration API Design Checklist

When designing MCP server configurations, ensure:

- [ ] **API Contract**: Clear, documented API contract for each server
- [ ] **Versioning**: Version tracking for servers and protocol
- [ ] **Error Handling**: Standardized error handling and codes
- [ ] **Security**: Secure authentication and authorization
- [ ] **Rate Limiting**: Appropriate rate limits and throttling
- [ ] **Documentation**: Complete API documentation
- [ ] **Consistency**: Consistent patterns across servers
- [ ] **Backward Compatibility**: Maintain compatibility when possible
- [ ] **Performance**: Optimized for performance
- [ ] **Observability**: Monitoring and logging configured

**See Also:**
- [Games Project MCP Documentation](../../../games/docs/setup/MCP_CONFIGURATION.md) - Original MCP setup documentation
- [Security and Secrets](../guides/SECURITY_AND_SECRETS.md) - Rules for handling secrets

## Database-Related MCP Configurations

### Database MCP Server Patterns

**Database Connection MCP Servers**:
- Database connection management MCP servers (PostgreSQL, MySQL, MongoDB, etc.)
- Database connection pooling MCP servers
- Database connection monitoring MCP servers
- Database connection health check MCP servers

**Example Database Connection MCP Configuration**:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_HOST": "localhost",
        "POSTGRES_PORT": "5432",
        "POSTGRES_DATABASE": "your_database",
        "POSTGRES_USER": "YOUR_DB_USER_HERE",
        "POSTGRES_PASSWORD": "YOUR_DB_PASSWORD_HERE"
      }
    },
    "mysql": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-mysql"],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_PORT": "3306",
        "MYSQL_DATABASE": "your_database",
        "MYSQL_USER": "YOUR_DB_USER_HERE",
        "MYSQL_PASSWORD": "YOUR_DB_PASSWORD_HERE"
      }
    }
  }
}
```

**Database Migration MCP Servers**:
- Database migration execution MCP servers
- Database migration rollback MCP servers
- Database migration status MCP servers
- Database migration validation MCP servers

**Example Database Migration MCP Configuration**:
```json
{
  "mcpServers": {
    "database-migrations": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-database-migrations"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/database",
        "MIGRATIONS_DIR": "./migrations",
        "MIGRATION_TOOL": "knex"
      }
    }
  }
}
```

**Database Query MCP Servers**:
- Database query execution MCP servers
- Database query optimization MCP servers
- Database query monitoring MCP servers
- Database query result caching MCP servers

**Example Database Query MCP Configuration**:
```json
{
  "mcpServers": {
    "database-query": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-database-query"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/database",
        "QUERY_CACHE_ENABLED": "true",
        "QUERY_CACHE_TTL": "3600",
        "QUERY_TIMEOUT": "30000"
      }
    }
  }
}
```

**Database Schema MCP Servers**:
- Database schema inspection MCP servers
- Database schema validation MCP servers
- Database schema migration MCP servers
- Database schema documentation MCP servers

**Example Database Schema MCP Configuration**:
```json
{
  "mcpServers": {
    "database-schema": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-database-schema"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/database",
        "SCHEMA_DIR": "./schemas",
        "SCHEMA_FORMAT": "json"
      }
    }
  }
}
```

### Database MCP Configuration Best Practices

**Database Connection Security**:
- Use environment variables for database credentials (never hardcode)
- Use secure credential storage (secret management systems)
- Implement connection encryption (SSL/TLS)
- Use connection pooling for performance
- Monitor database connections (connection limits, connection health)

**Database Migration Management**:
- Version control database migrations
- Test migrations before execution
- Support migration rollback
- Monitor migration execution
- Document migration changes

**Database Query Optimization**:
- Implement query result caching
- Monitor query performance
- Optimize slow queries
- Use connection pooling
- Implement query timeout

**Database Schema Management**:
- Version control database schemas
- Validate schema changes
- Document schema changes
- Test schema migrations
- Monitor schema drift

**Database MCP Configuration Checklist**:
- [ ] **Database Credentials**: Securely stored in environment variables
- [ ] **Connection Security**: SSL/TLS encryption enabled
- [ ] **Connection Pooling**: Configured for performance
- [ ] **Migration Management**: Version controlled and tested
- [ ] **Query Optimization**: Caching and monitoring configured
- [ ] **Schema Management**: Version controlled and documented
- [ ] **Error Handling**: Proper error handling and retry logic
- [ ] **Monitoring**: Database performance and health monitoring
- [ ] **Backup**: Database backup and recovery configured
- [ ] **Documentation**: Database configuration documented

---

## Review/Contribution

**Expert**: Andrew Lee  
**Expertise**: RESTful API Design  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "API Design Considerations for MCP Configurations" section covering MCP server API design principles (consistent interface design with uniform resource naming and standardized commands, API versioning for MCP servers with server and protocol versioning, API contract definition with clear interfaces and input validation, request/response patterns with standardized requests and structured responses, error handling and status codes with standard error codes and retry logic, API security design with authentication and authorization, API rate limiting and throttling with rate limits and quota management, API documentation standards with OpenAPI/Swagger), MCP server API design patterns (resource-based API design with resources as nouns and actions as verbs, command-based API design with commands as actions, event-driven API design with event publishers and subscribers), MCP server API best practices (consistency across servers, backward compatibility, performance optimization, observability, testing and validation), and comprehensive MCP configuration API design checklist covering API contract, versioning, error handling, security, rate limiting, documentation, consistency, backward compatibility, performance, and observability. Also fixed the date from 2025-01-05 to 2026-01-05. This addition ensures that MCP server configurations follow RESTful API design principles, providing consistent, maintainable, and well-documented APIs that enhance developer experience and system reliability.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this MCP configurations document by adding a comprehensive "Database-Related MCP Configurations" section covering database MCP server patterns (database connection MCP servers with connection management and pooling, database migration MCP servers with execution and rollback support, database query MCP servers with query execution and optimization, database schema MCP servers with schema inspection and validation), database MCP configuration best practices (database connection security with credential management and encryption, database migration management with version control and testing, database query optimization with caching and monitoring, database schema management with version control and documentation), practical configuration examples for PostgreSQL, MySQL, database migrations, database queries, and database schemas, and comprehensive database MCP configuration checklist covering database credentials, connection security, connection pooling, migration management, query optimization, schema management, error handling, monitoring, backup, and documentation. This enhancement provides essential database perspective on MCP configurations, ensuring that database-related MCP servers are properly configured, secured, and optimized for production use.

---

