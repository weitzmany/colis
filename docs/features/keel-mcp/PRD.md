# Keel MCP Server

## Product Requirements Document (PRD)

**Package Name**: `@colis/keel-mcp`  
**Status**: Phase 1 — Foundation Scaffold + Tool Contract  
**Priority**: High (P1)  
**Created Date**: 2026-02-21  
**Last Updated**: 2026-02-21

---

## Overview

### What is Keel MCP?

`@colis/keel-mcp` is a Model Context Protocol (MCP) server that gives LLM agents authoritative, real-time knowledge about `@colis/keel` components and `@colis/hull` theming.

When a developer installs `keel` or `hull` in their project and configures their LLM agent (e.g., Cursor, Claude Code, Copilot) to use this MCP server, the agent can:

- Know exactly what components are available and their status
- Get the correct Angular import and template syntax for any component
- Get complete prop/input/output documentation for components
- Get working usage examples for every component variant
- Get the full CSS token list (with fallbacks and hull override values)
- Get light/dark/project theming recipes and code
- Navigate to the live Storybook story or docs portal page for any component

### Problem Statement

Without MCP, LLMs have to rely on:
- Stale training data that doesn't know about `@colis/keel`
- README files that require manual reading context
- Trial-and-error component usage

This leads to:
- Incorrect imports and selectors
- Wrong prop names or missing required inputs
- Incorrect theming instructions
- Time wasted on avoidable errors

### Solution

A running MCP server that an LLM can call as a structured tool, giving it instant access to authoritative, always-up-to-date Colis UI knowledge.

---

## Architecture

### MCP Server Model

```
Consumer Project (Angular app)
  ↓ installs
@colis/keel + @colis/hull

  ↓ developer configures in their .cursor/mcp.json (or similar)
@colis/keel-mcp  (running as local MCP server)

  ↓ LLM agent calls tools
list_components
get_component_api → accurate props, selector, imports
get_component_examples → ready-to-paste Angular code
get_theme_tokens → --keel-* token values + fallbacks
get_theme_recipes → light/dark setup, project overrides
get_story_links → Storybook story URLs
get_docs_links → docs portal page URLs
```

### Source of Truth

| MCP Tool | Data Source |
|----------|-------------|
| `list_components` | `packages/keel-mcp/src/data/components.ts` |
| `get_component_api` | `packages/keel-mcp/src/data/components.ts` |
| `get_component_examples` | `packages/keel-mcp/src/data/examples.ts` |
| `get_theme_tokens` | `packages/keel-mcp/src/data/tokens.ts` |
| `get_theme_recipes` | `packages/keel-mcp/src/data/recipes.ts` |
| `get_story_links` | `packages/keel-mcp/src/data/story-links.ts` |
| `get_docs_links` | `packages/keel-mcp/src/data/docs-links.ts` |

All data files are plain TypeScript — easy to update when components/tokens change (enforced by `package_docs_sync.mdc` rule).

---

## MCP Tool Contract

### Tool: `list_components`

**Description**: List all available `@colis/keel` components with their status and brief description.

**Input**: none (or optional `status` filter: `all | available | planned`)

**Output**:
```json
{
  "components": [
    {
      "name": "KeelButtonComponent",
      "selector": "keel-button",
      "importPath": "@colis/keel",
      "status": "planned",
      "description": "Primary action button with multiple variants",
      "phase": 2,
      "storyUrl": null,
      "docsUrl": "https://colis-docs/keel/components/button"
    }
  ]
}
```

---

### Tool: `get_component_api`

**Description**: Get full API documentation for a keel component (inputs, outputs, CSS classes, slots).

**Input**:
```json
{ "component": "keel-button" }
```

**Output**:
```json
{
  "name": "KeelButtonComponent",
  "selector": "keel-button",
  "importPath": "@colis/keel",
  "inputs": [
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'danger' | 'ghost' | 'link'",
      "default": "primary",
      "required": false,
      "description": "Visual variant of the button"
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": false,
      "required": false,
      "description": "Disables the button"
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": false,
      "required": false,
      "description": "Shows loading spinner, disables interaction"
    }
  ],
  "outputs": [
    {
      "name": "clicked",
      "type": "EventEmitter<void>",
      "description": "Emits when button is clicked (not when disabled/loading)"
    }
  ],
  "slots": [
    {
      "name": "default",
      "description": "Button label content"
    }
  ],
  "cssTokens": ["--keel-color-primary", "--keel-space-sm", "--keel-space-lg", "--keel-radius-md"]
}
```

---

### Tool: `get_component_examples`

**Description**: Get ready-to-use Angular code examples for a keel component.

**Input**:
```json
{ "component": "keel-button", "variant": "primary" }
```

**Output**:
```json
{
  "component": "keel-button",
  "examples": [
    {
      "title": "Basic primary button",
      "variant": "primary",
      "imports": "import { KeelButtonComponent } from '@colis/keel';",
      "componentDecorator": "@Component({ standalone: true, imports: [KeelButtonComponent] })",
      "template": "<keel-button variant=\"primary\">Save changes</keel-button>"
    },
    {
      "title": "Disabled state",
      "variant": "primary",
      "template": "<keel-button variant=\"primary\" [disabled]=\"isLoading\">Save</keel-button>"
    },
    {
      "title": "With event binding",
      "template": "<keel-button variant=\"primary\" (clicked)=\"onSave()\">Save</keel-button>"
    }
  ]
}
```

---

### Tool: `get_theme_tokens`

**Description**: Get CSS custom property definitions for keel/hull token system.

**Input**:
```json
{ "category": "color" }
```
(optional — omit to get all tokens)

**Output**:
```json
{
  "tokens": [
    {
      "name": "--keel-color-primary",
      "category": "color",
      "keelFallback": "#3b82f6",
      "hullLayer1Value": "#3b82f6",
      "tailwindSource": "blue-500",
      "description": "Primary action color",
      "usedBy": ["keel-button", "keel-input"]
    }
  ]
}
```

---

### Tool: `get_theme_recipes`

**Description**: Get step-by-step instructions for common theming tasks.

**Input**:
```json
{ "recipe": "dark-mode" }
```

**Output**:
```json
{
  "recipe": "dark-mode",
  "title": "Enable dark mode with hull",
  "prerequisites": ["@colis/keel", "@colis/hull"],
  "steps": [
    {
      "step": 1,
      "description": "Add hull to angular.json styles",
      "code": "\"node_modules/@colis/hull/src/styles.css\""
    },
    {
      "step": 2,
      "description": "Add hull-dark class to host element for dark mode",
      "code": "<html class=\"hull-dark\">"
    },
    {
      "step": 3,
      "description": "Or use Angular service to toggle",
      "code": "document.documentElement.classList.toggle('hull-dark', isDark);"
    }
  ]
}
```

---

### Tool: `get_story_links`

**Description**: Get Storybook story URLs for a component or theme.

**Input**:
```json
{ "component": "keel-button" }
```

**Output**:
```json
{
  "component": "keel-button",
  "storybookBaseUrl": "http://localhost:6006",
  "stories": [
    {
      "name": "Primary",
      "storyId": "keel-button--primary",
      "url": "http://localhost:6006/?path=/story/keel-button--primary"
    },
    {
      "name": "Secondary",
      "storyId": "keel-button--secondary",
      "url": "http://localhost:6006/?path=/story/keel-button--secondary"
    }
  ]
}
```

---

### Tool: `get_docs_links`

**Description**: Get documentation portal URLs for packages, components, or concepts.

**Input**:
```json
{ "query": "hull dark mode" }
```

**Output**:
```json
{
  "results": [
    {
      "title": "Hull Theming — Dark Mode",
      "url": "http://localhost:3000/hull/theming/dark-mode",
      "description": "How to enable and customize dark mode with @colis/hull"
    }
  ]
}
```

---

## Consumer Configuration

### Cursor / `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "keel": {
      "command": "node",
      "args": ["node_modules/@colis/keel-mcp/dist/server.js"],
      "description": "Keel component library and hull theming documentation server"
    }
  }
}
```

### How consuming projects install

```bash
npm install --save-dev @colis/keel-mcp
```

Then add the above to `.cursor/mcp.json`. The MCP server starts automatically when needed by the agent.

---

## Package Technical Requirements

- **Name**: `@colis/keel-mcp`
- **Version**: `0.1.0`
- **Type**: ESM (`"type": "module"`)
- **Runtime**: Node.js ≥18
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Main entry**: `dist/server.js` (MCP server runner)
- **Data files**: `src/data/*.ts` — typed TypeScript objects, updated per `package_docs_sync.mdc` rule
- **No peer deps on Angular** — pure Node.js server
- **Peer deps**: `@colis/keel` (for version alignment), `@colis/hull` (optional)

---

## Phase 1 Acceptance Criteria

- [ ] Package exists at `packages/keel-mcp/`
- [ ] MCP server starts with `node dist/server.js`
- [ ] All 7 tools are registered and respond (with Phase 1 static/placeholder data)
- [ ] Consumer can configure in `.cursor/mcp.json` and receive tool responses
- [ ] Data files for each tool exist in `src/data/`

---

## Future Phases

### Phase 2 — Live Data Sync
- Parse component metadata directly from `packages/keel/src/` TypeScript files
- Auto-sync token data from `packages/keel/src/tokens/defaults.css`
- Watch mode: restart MCP server when package files change

### Phase 3 — Full Ecosystem
- Expand to cover all `@colis/*` packages (rig, embark, etc.)
- Add package install/setup tools
- Add upgrade/migration guidance tools
