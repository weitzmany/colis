# @colis/keel-mcp

MCP server for `@colis/keel` and `@colis/hull` — gives AI coding assistants authoritative, always-up-to-date knowledge about keel components and hull theming.

---

## What it does

When installed and configured, your AI agent (Cursor, Claude Code, etc.) can call these tools:

| Tool | Description |
|------|-------------|
| `list_components` | List all keel components with status |
| `get_component_api` | Full props/inputs/outputs for a component |
| `get_component_examples` | Ready-to-paste Angular code snippets |
| `get_theme_tokens` | `--keel-*` CSS custom property definitions |
| `get_theme_recipes` | Step-by-step install/theme guides |
| `get_story_links` | Storybook story URLs |
| `get_docs_links` | Docs portal page links |

---

## Installation

In your project that uses `@colis/keel`:

```bash
npm install --save-dev @colis/keel-mcp
```

---

## Configure Cursor

Add to your project's `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "keel": {
      "command": "node",
      "args": ["node_modules/@colis/keel-mcp/dist/server.js"],
      "description": "Keel component and hull theming assistant"
    }
  }
}
```

Restart Cursor. The `keel` MCP tools will be available to the agent.

---

## Build (development)

```bash
npm install
npm run build     # compiles TypeScript to dist/
npm run start     # runs the server (for testing)
npm run dev       # watch mode
```

---

## Data Files

All tool responses come from typed TypeScript data files in `src/data/`:

| File | Tool(s) | Sync trigger |
|------|---------|-------------|
| `components.ts` | `list_components`, `get_component_api` | New keel component added |
| `examples.ts` | `get_component_examples` | New component or example added |
| `tokens.ts` | `get_theme_tokens` | Token contract updated |
| `recipes.ts` | `get_theme_recipes` | Hull theming workflow changed |
| `story-links.ts` | `get_story_links` | New Storybook story added |
| `docs-links.ts` | `get_docs_links` | New chartroom page added |

Per `package_docs_sync.mdc`: these files must be updated whenever the relevant keel/hull/storybook/docs changes are made.

---

## Related

- [Docs Portal](http://localhost:4300) — `@colis/chartroom`
- [Storybook](http://localhost:6006) — `@colis/keel-storybook`
- [Token Contract](../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md)
