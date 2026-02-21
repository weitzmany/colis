# Chartroom — Colis Documentation Portal

## Product Requirements Document (PRD)

**Package Name**: `@colis/chartroom`  
**Status**: Phase 1 — Foundation Scaffold  
**Priority**: High (P1)  
**Created Date**: 2026-02-21  
**Last Updated**: 2026-02-21

---

## Overview

### What is Chartroom?

Chartroom is the central documentation portal for the entire `@colis` ecosystem. It aggregates installation guides, usage options, configuration references, architecture explanations, and cross-links to the visual Storybook (`keel-storybook`) and MCP server (`keel-mcp`).

The name follows the maritime naming convention. A **chartroom** is where navigational charts and documentation are kept — the place you go to understand how to navigate the ship.

### Phase 1 Scope

Phase 1 delivers a functional but minimal docs portal:
- **Technology**: [Astro](https://astro.build) with Starlight theme (recommended for structured docs)
- **Content**: Package index page, keel/hull quickstart, placeholder pages for all packages
- **Cross-links**: Links to Storybook stories and MCP server endpoints

### Why Astro + Starlight?

| Factor | Astro Starlight | Next.js docs | Plain Markdown |
|--------|----------------|--------------|----------------|
| Structured docs sidebar | Built-in | Manual | None |
| MDX support | Built-in | Plugin | None |
| Fast static build | Excellent | Good | N/A |
| Search | Built-in | Plugin | None |
| Code highlighting | Built-in | Plugin | None |
| Versioning | Planned by Starlight | Manual | None |
| Angular familiarity needed | No | Moderate | No |

Starlight is the cleanest zero-config docs platform for this use case. No Angular knowledge needed to maintain docs content.

---

## Scope: What Chartroom Covers

### Per-Package Pages

Every `@colis/*` package gets a structured docs page with:

| Section | Content |
|---------|---------|
| Overview | What the package does, why it exists |
| Installation | `npm install @colis/package-name`, registry config |
| Quick Start | Minimal working example |
| Options / API | Config options, exports, environment vars |
| Examples | Code examples for common scenarios |
| Troubleshooting | Common errors and fixes |
| Related | Links to other packages, Storybook (if UI), MCP (if applicable) |

### Package Index

| Package | Docs Status | Storybook | MCP |
|---------|-------------|-----------|-----|
| `@colis/rig` | Planned | No | No |
| `@colis/logbook` | Planned | No | No |
| `@colis/embark` | Planned | No | No |
| `@colis/keel` | Phase 1 | Yes | Yes |
| `@colis/hull` | Phase 1 | Yes | Yes |
| `@colis/keel-mcp` | Phase 1 | No | Self |
| `@colis/chartroom` | Self | No | No |
| `@colis/deck` | Planned | No | No |
| `@colis/shipyard` | Planned | No | No |

### Design System Section (keel + hull)

Dedicated section for the component library and theming system:

```
/design-system/
  getting-started/
    installation
    with-hull
    without-hull
  keel/
    overview
    components/       (one page per component — Phase 2)
    token-contract
  hull/
    overview
    layer-1-base
    layer-2-themes
    layer-3-project-theming
    dark-mode
  mcp/
    overview
    setup-cursor
    tool-reference
```

---

## Cross-Link Architecture

### Docs → Storybook
Every component docs page includes a "View in Storybook" link:
```mdx
<StorybookLink component="keel-button" story="Primary" />
```

### Docs → MCP
Every keel/hull page includes an "Ask via MCP" section showing which MCP tools are relevant.

### Storybook → Docs
Each Storybook story's Docs panel includes:
```
📖 Read the full guide: [link to chartroom page]
```

---

## Technology Stack

| Role | Technology |
|------|-----------|
| Framework | [Astro](https://astro.build) |
| Theme | [Starlight](https://starlight.astro.build) |
| Content | MDX (Markdown + JSX components) |
| Search | Pagefind (built into Starlight) |
| Deployment | Static site (CI build → any host) |
| Dev server | `npm run dev` on port `4300` |
| Build output | `dist/` (static HTML/CSS/JS) |

---

## Package Technical Requirements

- **Name**: `@colis/chartroom`
- **Version**: `0.1.0`
- **Not published to npm** — docs site, not a reusable package
- **Dev server port**: `4300` (via Port Manager convention)
- **Node.js**: ≥18.0.0

---

## Phase 1 Acceptance Criteria

- [ ] `packages/chartroom/` exists with Astro + Starlight setup
- [ ] `npm run dev` starts a working docs site on port 4300
- [ ] Homepage lists all `@colis/*` packages with links
- [ ] `keel` and `hull` quickstart pages exist (minimal)
- [ ] Storybook cross-links are functional (link to `localhost:6006` in dev)
- [ ] MCP setup guide page exists

---

## Future Phases

### Phase 2 — Per-Component Pages
One page per keel component using component metadata from `keel-mcp`.

### Phase 3 — Full Package Coverage
All `@colis/*` packages have complete docs pages.

### Phase 4 — Automation
- Auto-generate component API tables from `keel-mcp` data
- Auto-embed Storybook iframes for live demos
- Broken link checker CI integration
