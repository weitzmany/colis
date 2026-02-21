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
| `list_issues` | List open issues in the @colis repo (check for duplicates before filing) |
| `report_issue` | File a bug report, attributed to the AI expert who found it |
| `request_feature` | File a feature request, attributed to the AI expert who raised it |
| `close_issue` | Close an issue after confirming the fix works (opener only) |

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

## Issue Reporting (for consuming project agents)

AI agents in projects that use `@colis` packages can report bugs and feature requests directly
to the monorepo via MCP. Issues are filed on [github.com/weitzmany/colis](https://github.com/weitzmany/colis/issues)
and attributed to the specific expert persona that found the problem.

### Workflow

1. **Check first** — call `list_issues` to avoid duplicates
2. **File** — call `report_issue` or `request_feature` with your `expert_name` and `expert_role`
3. **Wait** — the @colis team will label the issue `status:in-progress` and eventually `status:resolved`
4. **Confirm** — after upgrading and verifying the fix, call `close_issue`

### Example

```
list_issues({ package: "@colis/keel", type: "bug" })

report_issue({
  package: "@colis/keel",
  title: "Button missing aria-label when icon-only",
  description: "When no text content is provided, keel-button renders without aria-label. Fails WCAG 2.1 SC 4.1.2.",
  expert_name: "Allison Foster",
  expert_role: "Accessibility Expert",
  project: "my-app",
  version: "0.2.0"
})
```

### Rule for consuming projects

Add a Cursor rule to your project telling your agent when and how to use these tools.
The `colis_feedback.mdc` rule in the packages repo is the canonical template — copy it to
`.cursor/rules/colis_feedback.mdc` in your project and adapt as needed.

### Important: do not use auto-closing commit messages

Never write commit messages containing `fixes #N`, `closes #N`, or `resolves #N` in reference
to @colis issues. GitHub will auto-close those issues. Always use `close_issue` via MCP instead.

---

## Related

- [Issues](https://github.com/weitzmany/colis/issues) — @colis bug tracker
- [Docs Portal](http://localhost:4300) — `@colis/chartroom`
- [Storybook](http://localhost:6006) — `@colis/keel-storybook`
- [Token Contract](../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md)
