# Keel MCP Server — Implementation Tasks

**Package**: `@colis/keel-mcp`  
**Phase**: 1 — Foundation Scaffold  
**Status**: In Progress  
**Last Updated**: 2026-02-21

---

## Phase 1 Tasks: MCP Server Foundation

### Task 1.1 — Initialize Package Directory

**Status**: In Progress  
**Priority**: P0  
**Description**: Create `packages/keel-mcp/` with all required scaffolding.

**Sub-tasks**:
- [ ] Create `packages/keel-mcp/package.json`
- [ ] Create `packages/keel-mcp/tsconfig.json`
- [ ] Create `packages/keel-mcp/README.md`
- [ ] Create `packages/keel-mcp/src/server.ts` (MCP server entry)
- [ ] Create `packages/keel-mcp/src/tools/` directory for each tool
- [ ] Create `packages/keel-mcp/src/data/` directory for data files

**Acceptance**:
- `node dist/server.js` starts the MCP server without errors

---

### Task 1.2 — MCP SDK Integration

**Status**: Pending  
**Priority**: P1  
**Description**: Integrate `@modelcontextprotocol/sdk` and configure server.

**Sub-tasks**:
- [ ] Install `@modelcontextprotocol/sdk` as dependency
- [ ] Create MCP server instance in `src/server.ts`
- [ ] Register all 7 tools on startup
- [ ] Configure stdio transport (standard for local MCP servers)

**Acceptance**:
- Server registers all tools and responds to `list_tools` MCP call

---

### Task 1.3 — Data Files (Phase 1 Static)

**Status**: Pending  
**Priority**: P1  
**Description**: Create typed TypeScript data files for each tool. Phase 1 uses static data reflecting current package state.

**Sub-tasks**:
- [ ] `src/data/components.ts` — keel component registry (Phase 1: all planned, status = planned)
- [ ] `src/data/tokens.ts` — token definitions from `KEEL_HULL_TOKEN_CONTRACT.md`
- [ ] `src/data/examples.ts` — usage examples (Phase 1: empty/placeholder)
- [ ] `src/data/recipes.ts` — theming recipes (Phase 1: basic entries)
- [ ] `src/data/story-links.ts` — Storybook URLs (Phase 1: TBD placeholders)
- [ ] `src/data/docs-links.ts` — docs portal URLs (Phase 1: TBD placeholders)

**Acceptance**:
- All data files compile without TypeScript errors
- Token data matches `docs/reference/KEEL_HULL_TOKEN_CONTRACT.md`

---

### Task 1.4 — Tool Implementations

**Status**: Pending  
**Priority**: P1  
**Description**: Implement each MCP tool in `src/tools/`.

**Sub-tasks**:
- [ ] `src/tools/list-components.ts`
- [ ] `src/tools/get-component-api.ts`
- [ ] `src/tools/get-component-examples.ts`
- [ ] `src/tools/get-theme-tokens.ts`
- [ ] `src/tools/get-theme-recipes.ts`
- [ ] `src/tools/get-story-links.ts`
- [ ] `src/tools/get-docs-links.ts`

**Acceptance**:
- Each tool returns valid JSON matching schema in PRD
- Tools handle unknown component names gracefully (return 404-style error)

---

### Task 1.5 — Consumer Configuration Documentation

**Status**: Pending  
**Priority**: P1  
**Description**: Document how to install and configure `keel-mcp` in a consuming project.

**Sub-tasks**:
- [ ] Write `README.md` with install + `.cursor/mcp.json` config example
- [ ] Document each tool with input/output examples
- [ ] Write "When to use keel-mcp" section

---

## Package Sync Requirements

### Documentation Impact

- [ ] `docs/features/keel-mcp/PRD.md` — created ✅
- [ ] `docs/features/keel-mcp/TASKS.md` — created ✅
- [ ] `packages/keel-mcp/README.md` — to create in Task 1.5
- [ ] `docs/reference/PROJECTS_LIST.md` — to update
- [ ] `VERDACCIO_SETUP.md` — to update

### Storybook Impact

N/A — `keel-mcp` is a server package, not a UI component.

### MCP Impact

`keel-mcp` IS the MCP package — it is itself the source of truth.
