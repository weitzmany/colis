# @colis/chartroom

Colis ecosystem documentation portal — all `@colis/*` package guides, component docs, theming reference, and MCP setup.

Built with [Astro](https://astro.build) and the [Starlight](https://starlight.astro.build) docs theme.

---

## Development

```bash
npm install
npm run dev        # starts on http://localhost:4300
```

## Build

```bash
npm run build      # outputs static site to dist/
npm run preview    # preview built site on http://localhost:4301
```

## Structure

```
src/content/docs/
├── index.mdx                         ← Package index homepage
├── getting-started/                  ← General getting started
├── design-system/
│   ├── getting-started/              ← Keel/hull installation guides
│   ├── keel/                         ← Keel component docs
│   ├── hull/                         ← Hull theming docs
│   └── mcp/                          ← MCP setup and tool reference
└── packages/                         ← Other @colis package docs
    ├── rig.mdx
    ├── logbook.mdx
    ├── embark.mdx
    ├── deck.mdx
    └── shipyard.mdx
```

## Adding Documentation

1. Create `.mdx` file in the appropriate `src/content/docs/` subdirectory
2. Add it to the sidebar in `astro.config.mjs`
3. Link to it from related pages (follow the cross-link convention)

## Cross-Links

- **To Storybook**: use `http://localhost:6006/?path=/story/...` in dev
- **To MCP tool**: reference the tool name from the [Tool Reference](/design-system/mcp/tool-reference/)

## Docs Sync Rule

Per `package_docs_sync.mdc`: any change to `@colis/keel`, `@colis/hull`, or any other `@colis/*` package requires corresponding updates to the relevant pages in this site before the change is considered complete.
