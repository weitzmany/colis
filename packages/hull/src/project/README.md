# Hull Layer 3 — Project Theme Mechanism

## Purpose

Layer 3 is a convention (not enforced code) that documents the supported pattern for consuming projects to override hull's design tokens with their own brand values.

## The Override Pattern

Projects that want to apply their own brand should:

1. Install `@colis/keel` and `@colis/hull`
2. Import hull's styles first
3. Create a project-specific theme file that overrides `--keel-*` tokens

### Example: Angular Project Setup

**Step 1**: Create your project theme file

```css
/* src/styles/hull.theme.css */
/* Override hull's defaults with your project brand */

:root {
  /* Brand primary */
  --keel-color-primary:        #7c3aed;   /* your purple */
  --keel-color-primary-hover:  #6d28d9;
  --keel-color-primary-subtle: #f5f3ff;

  /* Brand typography */
  --keel-font-family: 'Geist', 'Inter', sans-serif;

  /* Brand border radius */
  --keel-radius-md: 8px;   /* slightly more rounded */
  --keel-radius-lg: 12px;
}
```

**Step 2**: Configure your Angular project

```json
// angular.json — add styles in order
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@colis/hull/src/styles.css",
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

The import order ensures the cascade is:

```
1. Hull Layer 1 (base values)    ← lowest priority
2. Hull Layer 2 (light/dark)     ← overrides base
3. Project theme                 ← overrides hull themes
4. Project styles                ← highest priority
```

## Rules for Project Themes

- Only override tokens that are in the `--keel-*` contract (see [Token Contract](../../../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md))
- Do not introduce new `--keel-*` tokens — these are reserved for keel/hull
- Use your own `--my-app-*` namespace for project-specific tokens
- The Layer 3 mechanism is purely CSS cascade — there is no JavaScript involved

## Phase 3: Theme Generation Utilities

In Phase 3, hull will provide JavaScript utilities to generate project theme CSS programmatically:

```typescript
// Future: @colis/hull/utils
import { generateHullTheme } from '@colis/hull/utils';

const myTheme = generateHullTheme({
  colors: {
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
  },
  fonts: {
    family: "'Geist', sans-serif",
  }
});

// myTheme contains CSS string you can inject or write to a file
```
