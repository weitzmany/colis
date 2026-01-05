# MCP (Model Context Protocol) Configurations

This document lists all MCP configurations found in other projects and the consolidated configuration for this project.

**Last Updated**: 2025-01-05

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

**See Also:**
- [Games Project MCP Documentation](../../../games/docs/setup/MCP_CONFIGURATION.md) - Original MCP setup documentation
- [Security and Secrets](../guides/SECURITY_AND_SECRETS.md) - Rules for handling secrets

