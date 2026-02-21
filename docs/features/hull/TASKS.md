# Hull — Implementation Tasks

**Package**: `@colis/hull`  
**Phase**: 2 — Layer 1 + Layer 2 live  
**Status**: In Progress  
**Last Updated**: 2026-02-21

---

## Phase 1 Tasks: Empty Installable Package + Architecture Scaffold

### Task 1.1 — Initialize Package Directory

**Status**: In Progress  
**Priority**: P0  
**Description**: Create the `packages/hull/` directory with all required package scaffolding.

**Sub-tasks**:
- [ ] Create `packages/hull/` directory
- [ ] Create `packages/hull/package.json`
- [ ] Create `packages/hull/tsconfig.json`
- [ ] Create `packages/hull/README.md`
- [ ] Create `packages/hull/src/index.ts` (empty in Phase 1)
- [ ] Create `packages/hull/src/styles.css` (empty entry point in Phase 1)

**Acceptance**:
- `npm install @colis/hull` succeeds in a test project
- Package installs alongside `@colis/keel` without conflict

---

### Task 1.2 — Three-Layer Directory Structure

**Status**: Pending  
**Priority**: P1  
**Description**: Create the directory structure for all three layers as documented in the PRD.

**Sub-tasks**:
- [ ] Create `src/base/` directory with `.gitkeep` (Layer 1 — Tailwind mapping)
- [ ] Create `src/themes/light/` directory with `.gitkeep` (Layer 2 — light theme)
- [ ] Create `src/themes/dark/` directory with `.gitkeep` (Layer 2 — dark theme)
- [ ] Create `src/project/` directory with `.gitkeep` (Layer 3 — project overrides)
- [ ] Create `src/base/README.md` explaining Layer 1 purpose and Tailwind-first strategy
- [ ] Create `src/themes/README.md` explaining Layer 2 purpose and theme set list
- [ ] Create `src/project/README.md` explaining Layer 3 override mechanism

**Acceptance**:
- All three layer directories exist
- Each has a README explaining its role
- Structure matches the directory tree in PRD

---

### Task 1.3 — Package Metadata and Scripts

**Status**: Pending  
**Priority**: P1  
**Description**: Ensure `package.json` follows `@colis` monorepo conventions and declares correct dependencies.

**Sub-tasks**:
- [ ] Set `name: "@colis/hull"`, `version: "0.1.0"`, `type: "module"`
- [ ] Define `exports` map with main entry `"."` and `"./styles.css"`
- [ ] Define `files` array to include `src/`, `dist/`, `styles.css`, `README.md`
- [ ] Add `scripts`: `build`, `clean`, `lint`, `release:patch`, `release:minor`, `release:major`
- [ ] Declare `@colis/keel` as peer dependency (`">=0.1.0"`)
- [ ] Add `devDependencies`: TypeScript, rimraf, prettier
- [ ] Confirm no `tailwindcss` runtime dependency (values used as reference only)

**Acceptance**:
- `npm pack --dry-run` shows only expected published files
- `@colis/keel` is in `peerDependencies`, not `dependencies`

---

### Task 1.4 — Monorepo Workspace Registration

**Status**: Pending  
**Priority**: P1  
**Description**: Register `packages/hull` in the root workspace configuration if applicable.

**Sub-tasks**:
- [ ] Check if root `package.json` has `"workspaces"` field
- [ ] Add `"packages/hull"` to workspaces if applicable

**Acceptance**:
- `npm ls @colis/hull` resolves correctly from the monorepo root

---

### Task 1.5 — README Documentation

**Status**: Pending  
**Priority**: P1  
**Description**: Write a README that fully documents the three-layer architecture and consumption patterns.

**Sub-tasks**:
- [ ] Write "What is Hull?" section
- [ ] Write "Requires keel" section explaining the dependency rule
- [ ] Write "Installation" section
- [ ] Write "Three-Layer Architecture" section with architecture diagram
- [ ] Write "Layer 1: Base" section explaining Tailwind-first mapping
- [ ] Write "Layer 2: Hull Themes" section listing built-in themes (planned)
- [ ] Write "Layer 3: Project Theming" section showing override pattern with code example
- [ ] Write "Angular Integration" section with angular.json example

**Acceptance**:
- README renders correctly on npm/Verdaccio
- Three-layer architecture is clearly explained with examples

---

## Phase 2 Tasks: Layer 1 + Layer 2 Implementation

### Task 2.1 — Tailwind Mapping (Layer 1)

**Status**: Done  
Implemented token baseline assignments in `src/styles.css` (single-file Layer 1 for now), including info/tertiary semantic families used by `keel-button`.

### Task 2.2 — Light Theme (Layer 2)

**Status**: Done  
Implemented light/default context on `:root`, `.hull-light`, and `[data-hull-theme='light']`.

### Task 2.3 — Dark Theme (Layer 2)

**Status**: Done  
Implemented dark mode overrides via `.hull-dark`, `[data-hull-theme='dark']`, and `prefers-color-scheme` media query.

### Task 2.4 — Main CSS Entry Point

Fill in `src/styles.css` to import Layer 1 and Layer 2 light/dark themes in the correct cascade order.

### Task 2.5 — Semantic State Themes

Implement contextual theme sets: `.hull-danger`, `.hull-success`, `.hull-warning`, `.hull-primary`, `.hull-secondary`.

---

## Phase 3 Tasks: Extended Themes + Adapters (Future)

### Task 3.1 — Bootstrap Adapter (Layer 1)

Create `src/base/bootstrap-mapping.css` that maps Bootstrap's CSS variables to the `--keel-*` namespace. Projects using Bootstrap can import this instead of the Tailwind mapping.

### Task 3.2 — Custom Mapping Template

Create `src/base/custom-mapping.template.css` — a commented template that teams can copy to create their own Layer 1 mapping without hull.

### Task 3.3 — Theme Utilities

Implement JavaScript helpers in `src/utils/` for generating project-specific theme CSS programmatically.

### Task 3.4 — Design Token Export

Export design tokens in DTCG (Design Tokens Community Group) format for Figma/design tool sync.

---

## Notes

- Hull's CSS is purely additive — it never removes or overrides project CSS outside `--keel-*` variables
- Layer 1 token values are derived from Tailwind's scale but Tailwind is NOT required at runtime
- Layer 3 is a convention, not enforced — hull cannot prevent bad overrides, it only documents the supported pattern
- Once the Layer 1 token values are finalized in Phase 2, they should not change without a major version bump (they form the visual contract)
