# Hull — Design System and Theming Package

## Product Requirements Document (PRD)

**Package Name**: `@colis/hull`  
**Status**: Phase 1 — Foundation MVP (empty installable package + layer architecture definition)  
**Priority**: High (P1)  
**Created Date**: 2026-02-21  
**Last Updated**: 2026-02-21

---

## Overview

### What is Hull?

Hull is the official design system and theming package for the `@colis` ecosystem. It provides concrete design values (colors, spacing, typography) organized into a three-layer architecture that works with `@colis/keel` components.

The name follows the maritime naming convention. A **hull** is the outer shell of a ship — the surface the world sees. Hull is what gives keel's structural components their visual appearance.

### Phase 1 Scope (MVP)

Phase 1 delivers an **empty, installable package** with:

- A valid, publishable `@colis/hull` npm package
- The three-layer architecture defined and documented
- The directory structure and API contracts for all three layers
- Tailwind-first Layer 1 token mapping strategy documented
- No actual theme files yet — populated in Phase 2

### Three-Layer Architecture

```
Layer 3: Project Theme (project overrides --keel-* vars)
         ↓ overrides
Layer 2: Hull Themes (built-in light/dark + semantic palette sets)
         ↓ maps values into
Layer 1: Base (Tailwind token → --keel-* mapping)
         ↓ assigns concrete values to
Keel:    --keel-color-primary, --keel-space-sm, etc. (consumed by components)
```

---

## Dependency Contract (Critical)

### Hull's Dependencies

- **Required peer dependency** on `@colis/keel` — hull exists to theme keel
- Optional dev dependency on Tailwind CSS (used for Layer 1 token mapping source)
- No runtime JavaScript dependencies in Phase 1 — hull is CSS-only in its initial form

### Rule: Hull Requires Keel, Keel Does Not Require Hull

```
@colis/keel → no dependency on hull → works standalone
@colis/hull → peer dependency on keel → must be used with keel
```

### Consumer Installation

```bash
# Option A: keel only (works without hull)
npm install @colis/keel

# Option B: keel + hull (full design system)
npm install @colis/keel @colis/hull
```

### Activating Hull

Projects import hull's CSS (or the specific layer they need) into their global stylesheet:

```css
/* Option 1: Full hull (recommended) */
@import '@colis/hull';

/* Option 2: Specific layer only */
@import '@colis/hull/themes/light';
@import '@colis/hull/themes/dark';
```

---

## Three-Layer Architecture (Detailed)

### Layer 1 — Base (Tailwind Token Mapping)

**Purpose**: Maps Tailwind CSS v3/v4 design tokens to the keel CSS variable namespace.

**Why Tailwind-first?**

Tailwind ships a well-maintained, semantically structured design token set (colors, spacing, border-radius, typography) that has broad industry adoption. Rather than inventing token values from scratch, Layer 1 takes Tailwind's palette and maps it into the `--keel-*` namespace. This gives:

- Battle-tested, accessible default values
- Familiar color scale to developers who know Tailwind
- Easy path for Tailwind CSS users (tokens are already consistent with their stack)

**What Layer 1 does NOT do**:
- It does not require projects to install or use Tailwind CSS
- It does not generate utility classes
- It is purely a CSS variable assignment file

**Implementation**:

```css
/* packages/hull/src/base/tailwind-mapping.css */
/* Maps Tailwind's scale to keel tokens */

:root {
  /* Color → Tailwind-equivalent values */
  --keel-color-primary: #3b82f6;        /* Tailwind blue-500 */
  --keel-color-primary-hover: #2563eb;  /* Tailwind blue-600 */
  --keel-color-secondary: #6b7280;      /* Tailwind gray-500 */
  --keel-color-danger: #ef4444;         /* Tailwind red-500 */
  --keel-color-success: #22c55e;        /* Tailwind green-500 */
  --keel-color-warning: #f59e0b;        /* Tailwind amber-500 */

  /* Spacing → Tailwind default spacing scale */
  --keel-space-xs: 4px;   /* Tailwind 1 (4px) */
  --keel-space-sm: 8px;   /* Tailwind 2 (8px) */
  --keel-space-md: 12px;  /* Tailwind 3 (12px) */
  --keel-space-lg: 16px;  /* Tailwind 4 (16px) */
  --keel-space-xl: 24px;  /* Tailwind 6 (24px) */
  --keel-space-2xl: 32px; /* Tailwind 8 (32px) */

  /* Border radius */
  --keel-radius-sm: 4px;     /* Tailwind rounded */
  --keel-radius-md: 6px;     /* Tailwind rounded-md */
  --keel-radius-lg: 8px;     /* Tailwind rounded-lg */
  --keel-radius-full: 9999px;/* Tailwind rounded-full */

  /* Typography */
  --keel-font-family: ui-sans-serif, system-ui, sans-serif; /* Tailwind sans */
  --keel-font-size-sm: 0.875rem;   /* Tailwind text-sm */
  --keel-font-size-base: 1rem;     /* Tailwind text-base */
  --keel-font-size-lg: 1.125rem;   /* Tailwind text-lg */
  --keel-font-weight-normal: 400;
  --keel-font-weight-medium: 500;
  --keel-font-weight-bold: 700;

  /* Shadows → Tailwind shadow scale */
  --keel-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --keel-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --keel-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Transitions */
  --keel-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --keel-transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Z-index scale */
  --keel-z-dropdown: 200;
  --keel-z-tooltip:  300;
  --keel-z-modal:    1000;
}
```

**Future adapters (Phase 3+)**:
- Bootstrap adapter: `@colis/hull/base/bootstrap-mapping.css`
- Custom adapter template: `@colis/hull/base/custom-mapping.template.css`

---

### Layer 2 — Hull Themes

**Purpose**: Built-in theme sets that build on Layer 1 by re-assigning `--keel-*` tokens per visual context (light/dark mode, semantic state variants, palette families).

**Built-in Themes (Phase 2)**:

| Theme | Description | CSS class |
|-------|-------------|-----------|
| `light` | Default light mode | `:root` or `.hull-light` |
| `dark` | Dark mode | `.hull-dark` or `@media (prefers-color-scheme: dark)` |
| `primary` | Primary brand palette | `.hull-primary` |
| `secondary` | Secondary palette | `.hull-secondary` |
| `danger` | Error/destructive context | `.hull-danger` |
| `success` | Success/confirmation context | `.hull-success` |
| `warning` | Warning context | `.hull-warning` |

**Dark Mode Strategy**:

```css
/* Light is default on :root */
:root {
  --keel-color-text-base: #111827;
  --keel-color-bg-base: #ffffff;
  --keel-color-border: #e5e7eb;
}

/* Dark theme overrides on class or media query */
.hull-dark,
[data-hull-theme="dark"] {
  --keel-color-text-base: #f9fafb;
  --keel-color-bg-base: #111827;
  --keel-color-border: #374151;
}

@media (prefers-color-scheme: dark) {
  :root:not(.hull-light) {
    --keel-color-text-base: #f9fafb;
    --keel-color-bg-base: #111827;
    --keel-color-border: #374151;
  }
}
```

---

### Layer 3 — Project Theme Mechanism

**Purpose**: Provides a documented, supported path for consuming projects to override hull's theme values with their own brand tokens — without modifying hull's source files.

**Mechanism**:

Projects create a `hull.theme.css` file (or equivalent) in their own source and import it after hull:

```css
/* my-project/src/styles/hull.theme.css */
/* Override hull's built-in theme with project brand */

:root {
  /* Brand primary */
  --keel-color-primary: #7c3aed;       /* Project purple */
  --keel-color-primary-hover: #6d28d9;

  /* Brand fonts */
  --keel-font-family: 'Geist', sans-serif;
}
```

**Load Order in Project**:

```css
/* my-project/src/styles.css */
@import '@colis/hull';           /* Layer 1 + Layer 2 defaults */
@import './hull.theme.css';      /* Layer 3: project overrides */
```

**Angular Integration**:

```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@colis/hull/styles.css",
              "src/styles/hull.theme.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

**Hull Theme API Helpers (Phase 2)**:

Hull will expose helper utilities to make project theming discoverable:

```typescript
// Future: @colis/hull/utils
import { generateHullTheme } from '@colis/hull/utils';

// Generates the CSS text for a custom theme
const myTheme = generateHullTheme({
  colors: {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
  },
  fonts: {
    family: "'Geist', sans-serif",
  }
});
```

---

## Package Technical Requirements

### Package Metadata

- **Name**: `@colis/hull`
- **Scope**: `@colis`
- **Type**: ESM (`"type": "module"`)
- **Initial version**: `0.1.0`
- **License**: MIT
- **Main asset**: CSS (not JavaScript-heavy)

### Peer Dependencies

```json
{
  "peerDependencies": {
    "@colis/keel": ">=0.1.0"
  }
}
```

### File Structure (Phase 1 — Empty Scaffold)

```
packages/hull/
├── package.json
├── README.md
├── tsconfig.json
└── src/
    ├── index.ts              ← Public JS API entry (empty in Phase 1)
    ├── styles.css            ← Main CSS entry (imports all layers; empty in Phase 1)
    ├── base/                 ← Layer 1: Tailwind mapping
    │   └── .gitkeep
    ├── themes/               ← Layer 2: Built-in themes
    │   ├── light/
    │   │   └── .gitkeep
    │   └── dark/
    │       └── .gitkeep
    └── project/              ← Layer 3: Project theme mechanism docs/helpers
        └── .gitkeep
```

### Files to Publish

```
dist/
src/        (CSS source files)
README.md
styles.css  (convenience top-level CSS entry)
```

---

## Phase 1 Acceptance Criteria

- [ ] `@colis/hull` package exists in `packages/hull/`
- [ ] `package.json` is valid, follows `@colis` conventions, declares keel peer dep
- [ ] Package installs with `npm install @colis/hull`
- [ ] Directory structure for all three layers is present
- [ ] `styles.css` entry point exists (empty in Phase 1)
- [ ] `README.md` documents the three-layer architecture and usage
- [ ] No Tailwind CSS runtime dependency (Tailwind values used as reference only)

---

## Out of Scope (Phase 1)

- Any actual CSS theme values or token assignments
- JavaScript theme switching utilities
- Framework-specific integrations (Angular, React, etc.)
- Bootstrap or other CSS framework adapters
- Design tokens in JSON/DTCG format
- Storybook or design documentation site

---

## Future Phases

### Phase 2 — Layer 1 + Layer 2 Implementation

Fill in the Tailwind mapping (Layer 1) and ship light/dark built-in themes (Layer 2). Hull becomes functional and can theme keel components.

### Phase 3 — Extended Themes + Adapters

- Additional palette themes (primary, secondary, danger variants)
- Bootstrap adapter layer
- JSON design tokens export (for Figma/design tool sync)
- Theme switching JavaScript utilities

### Phase 4 — Advanced

- Design token pipeline with DTCG format
- Automatic dark mode media query generation
- CSS nesting-based theme scoping
- Theme validation tooling
