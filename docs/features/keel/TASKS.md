# Keel — Implementation Tasks

**Package**: `@colis/keel`  
**Phase**: 1.5 — Foundation + first component  
**Status**: In Progress  
**Last Updated**: 2026-02-21

---

## Phase 1 Tasks: Empty Installable Package

### Task 1.1 — Initialize Package Directory

**Status**: In Progress  
**Priority**: P0  
**Description**: Create the `packages/keel/` directory with all required package scaffolding.

**Sub-tasks**:
- [ ] Create `packages/keel/` directory
- [ ] Create `packages/keel/package.json` (see PRD for required fields)
- [ ] Create `packages/keel/tsconfig.json`
- [ ] Create `packages/keel/README.md` with CSS token contract documentation
- [ ] Create `packages/keel/src/index.ts` (empty public API entry point)
- [ ] Create `packages/keel/src/tokens.css` (CSS vars with fallback defaults)

**Acceptance**:
- `npm install @colis/keel` succeeds in a test Angular project
- `import {} from '@colis/keel'` does not throw

---

### Task 1.2 — CSS Token Defaults File

**Status**: Pending  
**Priority**: P1  
**Description**: Create the token defaults CSS file that documents and provides all keel CSS custom property fallbacks.

**Sub-tasks**:
- [ ] Create `packages/keel/src/tokens/defaults.css`
- [ ] Define all tokens from the PRD token table with fallback values
- [ ] Export tokens file from `src/index.ts`
- [ ] Document token file usage in README

**Acceptance**:
- `tokens/defaults.css` contains all tokens listed in PRD
- Each token uses a sensible accessible default (contrast ratio ≥ 4.5:1 for text/background pairs)

---

### Task 1.3 — Package Metadata and Scripts

**Status**: Pending  
**Priority**: P1  
**Description**: Ensure `package.json` follows `@colis` monorepo conventions exactly.

**Sub-tasks**:
- [ ] Set `name: "@colis/keel"`, `version: "0.1.0"`, `type: "module"`
- [ ] Define `exports` map with main entry `"."` 
- [ ] Define `files` array to control published contents
- [ ] Add `scripts`: `build`, `clean`, `lint`, `release:patch`, `release:minor`, `release:major`
- [ ] Declare Angular peer dependencies (≥ 17.0.0)
- [ ] Add `devDependencies`: TypeScript, rimraf, eslint, prettier
- [ ] Confirm no dependency on `@colis/hull`

**Acceptance**:
- `npm pack --dry-run` shows only expected published files
- No `@colis/hull` in any dependency section

---

### Task 1.4 — Monorepo Workspace Registration

**Status**: Pending  
**Priority**: P1  
**Description**: Register `packages/keel` in the root workspace configuration if a root `package.json` with workspaces exists.

**Sub-tasks**:
- [ ] Check if root `package.json` has `"workspaces"` field
- [ ] Add `"packages/keel"` to workspaces if applicable

**Acceptance**:
- `npm ls @colis/keel` resolves correctly from the monorepo root

---

### Task 1.5 — README Documentation

**Status**: Pending  
**Priority**: P1  
**Description**: Write a comprehensive README that serves as the package's contract documentation.

**Sub-tasks**:
- [ ] Write "What is Keel?" section
- [ ] Write "Installation" section (`npm install @colis/keel`)
- [ ] Write "Works without hull" section with standalone usage example
- [ ] Write "Works with hull" section referencing `@colis/hull`
- [ ] Write "CSS Token Reference" section listing all tokens and defaults
- [ ] Write "Planned Components" table

**Acceptance**:
- README renders correctly on npm/Verdaccio registry
- All token names match those defined in `src/tokens/defaults.css`

---

## Phase 2 Tasks: Core Components

The following tasks are documented for planning purposes but are **not to be implemented in Phase 1**.

### Task 2.1 — Build Pipeline (ng-packagr)

Introduce Angular Package Format (APF) build using `ng-packagr`. Required before shipping any components.

### Task 2.2 — Button Component

**Status**: Done  
**Completed**: 2026-02-22  
Implemented `<keel-button>` with separate `variant` + `theme` API, plus `size`, `rounded`, `disabled`, `loading`, spinner state, and `clicked` output.

### Task 2.3 — Input Component

**Status**: Done  
**Completed**: 2026-02-22  
Implemented `<keel-input>` as a standalone component with `type`, `name`, `placeholder`, `disabled`, `invalid`, `valueChange`, and Angular Forms (`ControlValueAccessor`) support.

### Task 2.4 — Modal Component

Implement `<keel-modal>` using Angular CDK Overlay.

### Task 2.5 — Form Controls

Implement `<keel-checkbox>`, `<keel-radio>`, `<keel-select>`, `<keel-textarea>`.

### Task 2.6 — Storybook Setup

Configure Storybook for component documentation and visual testing.

---

## Phase 3 Tasks: Extended Components (Future)

### Task 3.1 — Extended Component Set

Implement `<keel-tooltip>`, `<keel-badge>`, `<keel-spinner>`, `<keel-alert>`, `<keel-card>`.

### Task 3.2 — Accessibility Testing

Integrate axe-core for automated accessibility testing of all components. Ensure WCAG 2.1 AA compliance.

### Task 3.3 — Visual Regression Testing

Integrate Chromatic or Percy for visual regression testing.

---

## Notes

- All Phase 1 tasks must be completed before Phase 2 begins
- The CSS token contract defined in Phase 1 is **frozen** once Phase 2 component development begins — no breaking token name changes
- Hull team must align with keel's token list before shipping hull's Layer 2
