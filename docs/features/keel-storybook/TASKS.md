# Keel Storybook — Implementation Tasks

**Package**: `@colis/keel-storybook`  
**Phase**: 1 — Foundation Scaffold  
**Status**: In Progress

---

## Phase 1 Tasks

### Task 1.1 — Package Setup

- [x] Create `packages/keel-storybook/` directory structure
- [x] Create `package.json` with Storybook Angular 8.x dependencies
- [x] Create `.storybook/main.ts` with Angular framework config
- [x] Create `.storybook/preview.ts` with global story options
- [x] Create `.storybook/preview-head.html` with keel CSS token defaults
- [ ] Run `npm install` and verify Storybook starts

### Task 1.2 — Token Stories

- [x] `stories/tokens/ColorTokens.stories.ts`
- [x] `stories/tokens/SpacingTokens.stories.ts`
- [x] `stories/tokens/TypographyTokens.stories.ts`

### Task 1.3 — Theme Stories

- [x] `stories/themes/HullLight.stories.ts`
- [x] `stories/themes/HullDark.stories.ts`
- [x] `stories/themes/ThemeMatrix.stories.ts`

### Task 1.4 — Documentation

- [x] `stories/Introduction.mdx`
- [x] `stories/components/COMPONENT_STORY_TEMPLATE.md`
- [x] `README.md`

## Package Sync Requirements

### Documentation Impact

- [x] `docs/features/keel-storybook/PRD.md` — created
- [x] `docs/features/keel-storybook/TASKS.md` — created
- [x] `packages/keel-storybook/README.md` — created

### MCP Impact

When Phase 2 component stories are added:
- Update `packages/keel-mcp/src/data/story-links.ts` with story IDs
