# Chartroom — Implementation Tasks

**Package**: `@colis/chartroom`  
**Phase**: 1 — Foundation Scaffold  
**Status**: In Progress  
**Last Updated**: 2026-02-21

---

## Phase 1 Tasks: Docs Portal Foundation

### Task 1.1 — Initialize Astro + Starlight Project

**Status**: In Progress  
**Priority**: P0  
**Description**: Create `packages/chartroom/` with Astro + Starlight framework.

**Sub-tasks**:
- [ ] Initialize Astro project with `create astro@latest --template starlight`
- [ ] Configure `astro.config.mjs` with Starlight plugin
- [ ] Configure dev server port to `4300`
- [ ] Set site title: "Colis Docs"
- [ ] Create sidebar navigation structure for all packages
- [ ] Add `README.md` with dev/build instructions

**Acceptance**:
- `npm run dev` starts on port 4300
- Sidebar shows all planned package sections

---

### Task 1.2 — Package Index Homepage

**Status**: Pending  
**Priority**: P1  
**Description**: Create the docs homepage with the full `@colis/*` package index.

**Sub-tasks**:
- [ ] Create `src/content/docs/index.mdx` — homepage
- [ ] Add package cards: name, description, status, install command
- [ ] Add legend: Storybook icon, MCP icon, status badge
- [ ] Link each card to its package page

**Acceptance**:
- Homepage lists all 9+ packages
- Each card links to a package-specific page (even if placeholder)

---

### Task 1.3 — Keel + Hull Quickstart Pages

**Status**: Pending  
**Priority**: P1  
**Description**: Create the primary keel/hull getting-started pages.

**Sub-tasks**:
- [ ] `src/content/docs/design-system/getting-started/installation.mdx`
- [ ] `src/content/docs/design-system/getting-started/with-hull.mdx`
- [ ] `src/content/docs/design-system/getting-started/without-hull.mdx`
- [ ] `src/content/docs/design-system/keel/overview.mdx`
- [ ] `src/content/docs/design-system/hull/overview.mdx`
- [ ] `src/content/docs/design-system/hull/dark-mode.mdx`
- [ ] `src/content/docs/design-system/mcp/setup-cursor.mdx`

**Acceptance**:
- All pages render without errors
- keel + hull installation flow is fully documented

---

### Task 1.4 — Placeholder Pages for Other Packages

**Status**: Pending  
**Priority**: P2  
**Description**: Create stub pages for all `@colis/*` packages so navigation is complete.

**Sub-tasks**:
- [ ] `src/content/docs/packages/rig.mdx` — stub
- [ ] `src/content/docs/packages/logbook.mdx` — stub
- [ ] `src/content/docs/packages/embark.mdx` — stub
- [ ] `src/content/docs/packages/deck.mdx` — stub
- [ ] `src/content/docs/packages/shipyard.mdx` — stub

---

### Task 1.5 — Cross-Link Components

**Status**: Pending  
**Priority**: P2  
**Description**: Create MDX components for linking to Storybook and MCP.

**Sub-tasks**:
- [ ] Create `src/components/StorybookLink.astro` — links to a Storybook story
- [ ] Create `src/components/McpToolCard.astro` — shows an MCP tool with its signature
- [ ] Document usage in `README.md`

---

## Package Sync Requirements

### Documentation Impact

- [ ] `docs/features/chartroom/PRD.md` — created ✅
- [ ] `docs/features/chartroom/TASKS.md` — created ✅
- [ ] `packages/chartroom/README.md` — to create in Task 1.1
- [ ] `docs/reference/PROJECTS_LIST.md` — to update
- [ ] `VERDACCIO_SETUP.md` — N/A (not published to npm)

### Storybook Impact

N/A — chartroom is a docs site, not a UI component package.

### MCP Impact

N/A — chartroom is a docs site. It links to `keel-mcp`, but doesn't modify MCP data.
