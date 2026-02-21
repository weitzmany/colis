# Keel — Angular Component Library Package

## Product Requirements Document (PRD)

**Package Name**: `@colis/keel`  
**Status**: Phase 1.5 — Foundation + first shipped component (`keel-button`)  
**Priority**: High (P1)  
**Created Date**: 2026-02-21  
**Last Updated**: 2026-02-21

---

## Overview

### What is Keel?

Keel is the official Angular component library for the `@colis` ecosystem. It provides a collection of standalone Angular components (buttons, inputs, modals, etc.) that projects can install and import directly — similar to how Angular Material or PrimeNG work, but tailored to the Colis ecosystem.

The name follows the maritime naming convention of the `@colis` package family. A **keel** is the structural spine of a ship — the foundational element everything else is built on.

### Phase 1.5 Scope

Phase 1.5 delivers an installable package with the first production component:

- A valid, publishable `@colis/keel` npm package
- A shipped standalone `KeelButtonComponent` (`<keel-button>`)
- CSS custom property (token) consumption contract with safe fallback defaults
- A stable API for button variants and interaction states

### Problem Statement

Projects built within the Colis ecosystem currently have no shared UI component layer. Every project re-implements common UI patterns (buttons, inputs, modals) independently, leading to:

- Inconsistent UX across projects
- Duplicated styling effort
- No shared theming contract
- No design system baseline

### Solution

Provide a standalone, installable Angular component library that:

1. Projects can install with a single `npm install @colis/keel`
2. Works immediately without any theming package (using sensible defaults via CSS variable fallbacks)
3. Optionally accepts deep theming via `@colis/hull` (see hull PRD)
4. Exports fully standalone Angular components (no NgModule required)

### Business Value

- **Developer productivity**: Shared components eliminate duplicate UI work across all projects
- **Consistency**: Unified UX language across all Colis-ecosystem projects
- **Velocity**: Faster project startup — UI primitives are ready to import
- **Extensibility**: Clean CSS variable contract enables project-level customization without forking

---

## Dependency Contract (Critical)

### Keel's Dependencies

- **No runtime dependencies** on `@colis/hull`
- **No runtime dependencies** on other `@colis/*` packages
- Peer dependency on `@angular/core` (≥ 17.0.0, standalone component API)
- Peer dependency on `@angular/common`

### Hull's Relationship to Keel

- `@colis/hull` is **optional** — keel works without it
- When hull is present, it provides concrete values for keel's CSS variable contract
- When hull is absent, keel uses CSS `var()` fallback values defined in its own stylesheet

### Projects Can Choose

```
Option A: keel only          → Components work with built-in defaults
Option B: keel + hull        → Components adopt hull's full theming system
Option C: keel + custom CSS  → Project provides its own token values
```

---

## CSS Variable Token Contract

Keel **consumes** (reads) CSS custom properties under the `--keel-` namespace. It never defines the concrete values for these properties; it only provides fallbacks.

### Token Namespace

All keel tokens follow the pattern: `--keel-{category}-{scale}`

### Semantic Token Categories

| Category | Example Token | Fallback Default |
|----------|--------------|------------------|
| Color | `--keel-color-primary` | `#3b82f6` (blue-500) |
| Color | `--keel-color-primary-hover` | `#2563eb` (blue-600) |
| Color | `--keel-color-secondary` | `#6b7280` (gray-500) |
| Color | `--keel-color-danger` | `#ef4444` (red-500) |
| Color | `--keel-color-success` | `#22c55e` (green-500) |
| Color | `--keel-color-warning` | `#f59e0b` (amber-500) |
| Color | `--keel-color-text-base` | `#111827` |
| Color | `--keel-color-text-muted` | `#6b7280` |
| Color | `--keel-color-bg-base` | `#ffffff` |
| Color | `--keel-color-bg-subtle` | `#f9fafb` |
| Color | `--keel-color-border` | `#e5e7eb` |
| Spacing | `--keel-space-xs` | `4px` |
| Spacing | `--keel-space-sm` | `8px` |
| Spacing | `--keel-space-md` | `12px` |
| Spacing | `--keel-space-lg` | `16px` |
| Spacing | `--keel-space-xl` | `24px` |
| Spacing | `--keel-space-2xl` | `32px` |
| Border Radius | `--keel-radius-sm` | `4px` |
| Border Radius | `--keel-radius-md` | `6px` |
| Border Radius | `--keel-radius-lg` | `8px` |
| Border Radius | `--keel-radius-full` | `9999px` |
| Typography | `--keel-font-family` | `Inter, system-ui, sans-serif` |
| Typography | `--keel-font-size-sm` | `0.875rem` |
| Typography | `--keel-font-size-base` | `1rem` |
| Typography | `--keel-font-size-lg` | `1.125rem` |
| Typography | `--keel-font-weight-normal` | `400` |
| Typography | `--keel-font-weight-medium` | `500` |
| Typography | `--keel-font-weight-bold` | `700` |
| Shadow | `--keel-shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| Shadow | `--keel-shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` |
| Shadow | `--keel-shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` |
| Transition | `--keel-transition-fast` | `150ms ease` |
| Transition | `--keel-transition-base` | `200ms ease` |
| Z-Index | `--keel-z-modal` | `1000` |
| Z-Index | `--keel-z-dropdown` | `200` |
| Z-Index | `--keel-z-tooltip` | `300` |

### How Keel Consumes Tokens (Usage Pattern in Components)

```css
/* Example: how a future keel button component uses tokens */
.keel-btn-primary {
  background-color: var(--keel-color-primary, #3b82f6);
  color: #ffffff;
  padding: var(--keel-space-sm, 8px) var(--keel-space-lg, 16px);
  border-radius: var(--keel-radius-md, 6px);
  font-size: var(--keel-font-size-base, 1rem);
  font-weight: var(--keel-font-weight-medium, 500);
  transition: background-color var(--keel-transition-fast, 150ms ease);
}

.keel-btn-primary:hover {
  background-color: var(--keel-color-primary-hover, #2563eb);
}
```

The second argument to `var()` is always a hardcoded fallback — this is what makes keel usable without hull.

---

## Angular Architecture Requirements

### Standalone Components (Mandatory)

All keel components **must** be standalone Angular components (Angular 17+ API):

```typescript
// Required shape for all future keel components
@Component({
  selector: 'keel-button',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeelButtonComponent { }
```

### Public API Export Pattern

```typescript
// packages/keel/src/index.ts
// Phase 1: empty — just the namespace
// Phase 2+: each component exported here
export * from './components/button';
export * from './components/input';
// ...
```

### Consumer Usage (Future — After Phase 2)

Projects that install `@colis/keel` will import components directly:

```typescript
import { KeelButtonComponent } from '@colis/keel';

@Component({
  standalone: true,
  imports: [KeelButtonComponent],
  template: `<keel-button variant="solid" theme="primary">Click me</keel-button>`
})
export class MyComponent { }
```

---

## Package Technical Requirements

### Package Metadata

- **Name**: `@colis/keel`
- **Scope**: `@colis`
- **Type**: ESM (`"type": "module"`)
- **Initial version**: `0.1.0`
- **License**: MIT

### Peer Dependencies

```json
{
  "peerDependencies": {
    "@angular/core": ">=17.0.0",
    "@angular/common": ">=17.0.0"
  },
  "peerDependenciesMeta": {
    "@angular/core": { "optional": false },
    "@angular/common": { "optional": false }
  }
}
```

### Build Target

- Angular components should eventually be built using `ng-packagr` for full Angular library compatibility (APF format)
- Phase 1 scaffold uses TypeScript directly, as there are no components yet
- Phase 2 will introduce `ng-packagr` and Angular-specific build pipeline

### Files to Publish

```
dist/
src/         (source for reference)
README.md
```

---

## Components Roadmap

The first component is shipped. Remaining components are planned:

| Component | Selector | Priority |
|-----------|----------|----------|
| Button | `<keel-button>` | Shipped |
| Input | `<keel-input>` | P1 |
| Textarea | `<keel-textarea>` | P1 |
| Select | `<keel-select>` | P1 |
| Checkbox | `<keel-checkbox>` | P1 |
| Radio | `<keel-radio>` | P1 |
| Modal | `<keel-modal>` | P1 |
| Tooltip | `<keel-tooltip>` | P2 |
| Badge | `<keel-badge>` | P2 |
| Spinner | `<keel-spinner>` | P2 |
| Alert | `<keel-alert>` | P2 |
| Card | `<keel-card>` | P2 |
| Tabs | `<keel-tabs>` | P3 |
| Table | `<keel-table>` | P3 |

---

## Phase 1.5 Acceptance Criteria

- [ ] `@colis/keel` package exists in `packages/keel/`
- [ ] `package.json` is valid and follows `@colis` package conventions
- [ ] Package can be installed in an Angular project with `npm install @colis/keel`
- [ ] `src/index.ts` exports `KeelButtonComponent`
- [ ] `<keel-button>` supports variants: `solid`, `outline`, `flat`, `link`
- [ ] `<keel-button>` supports themes: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `tertiary`, `dark`
- [ ] `<keel-button>` supports sizes: `xs`, `sm`, `md`, `lg`, `xl`
- [ ] `<keel-button>` supports `disabled` and `rounded` states
- [ ] `<keel-button>` emits `clicked` output when interactive
- [ ] CSS variable token contract is documented in `README.md`
- [ ] No dependency on `@colis/hull` in `package.json`
- [ ] Angular peer dependency is declared
- [ ] Package builds without errors

---

## Out of Scope (Phase 1.5)

- Additional Angular components beyond `keel-button`
- Animation or motion design
- Accessibility testing of components (deferred to Phase 2)
- Angular CDK integration
- Storybook documentation
- Visual regression testing
- Server-side rendering (SSR) support design

---

## Future Phases

### Phase 2 — Core Components

Implement the next P1 component set (input, modal, etc.) using the token contract defined in Phase 1. Introduce `ng-packagr` build pipeline.

### Phase 3 — Extended Components

Implement P2/P3 components. Add Storybook documentation site. Introduce accessibility testing.

### Phase 4 — Advanced Features

Angular CDK integration, animation system, SSR support, tree-shakeable bundles.
