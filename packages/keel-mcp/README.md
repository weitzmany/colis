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

## Installation & MCP Setup

### Step 1 — Install globally

```bash
npm install -g @colis/keel-mcp
```

This installs the `keel-mcp` binary to your PATH.

### Step 2 — Configure Cursor

**Global** (available in all projects) — add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "keel": {
      "command": "keel-mcp",
      "description": "Keel component and hull theming assistant"
    }
  }
}
```

**Per-project** — add to `.cursor/mcp.json` in the project root (same config):

```json
{
  "mcpServers": {
    "keel": {
      "command": "keel-mcp",
      "description": "Keel component and hull theming assistant"
    }
  }
}
```

### Step 3 — Restart Cursor

The `keel` MCP tools will be available to the agent in every project.

### Keeping it up to date

When new components or tokens are added to `@colis/keel`, a new version of `@colis/keel-mcp` will be published with updated data. Run this to get the latest:

```bash
npm update -g @colis/keel-mcp
```

Then restart Cursor.

---

> **Registry note:** `@colis/keel-mcp` is on a private registry.  
> Make sure your `~/.npmrc` has the scope configured before installing:
> ```
> @colis:registry=http://<your-verdaccio-host>:4873/
> ```

> **Why not `npx keel-mcp`?**  
> `npx keel-mcp` looks for a package called `keel-mcp` on the public npm registry.  
> The package is `@colis/keel-mcp` (scoped), so `npx` won't find it that way.  
> Installing globally and using `keel-mcp` directly is the correct approach.

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
