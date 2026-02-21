# @colis/hull

Design system and theming package for `@colis/keel` — three-layer CSS token system with Tailwind-first base values.

> **Current status:** Layer 1 token values and Layer 2 light/dark theme overrides are implemented in `src/styles.css`.

---

## Requires @colis/keel

Hull is the theming layer for keel. It **must** be used alongside keel:

```bash
npm install @colis/keel @colis/hull
```

Hull assigns values to the `--keel-*` CSS custom properties that keel components consume.

> **Important**: `@colis/keel` works without hull (it has built-in fallback defaults). Hull is optional but recommended for full theming support.

---

## Installation

```bash
npm install @colis/keel @colis/hull
```

Then add hull's stylesheet to your project. For Angular:

```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@colis/hull/src/styles.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

Or import in your global stylesheet:

```css
@import '@colis/hull/styles.css';
```

---

## Three-Layer Architecture

Hull's design system is built in three layers, each serving a distinct purpose:

```
Layer 3: Project Theme   ← your brand overrides
         ↓ overrides
Layer 2: Hull Themes     ← light/dark built-in themes (implemented)
         ↓ overrides
Layer 1: Base            ← token baseline mapping (implemented)
         ↓ assigns to
Keel:    --keel-*        ← consumed by keel components
```

### Layer 1 — Base

Maps design values to the `--keel-*` CSS variable namespace. Hull's default Layer 1 uses Tailwind CSS's design scale as the value source (Tailwind is NOT required at runtime — hull just uses its token values).

```css
/* hull/src/base/tailwind-mapping.css (Phase 2) */
:root {
  --keel-color-primary: #3b82f6;   /* Tailwind blue-500 */
  --keel-space-lg: 16px;           /* Tailwind spacing-4 */
  /* ... all tokens ... */
}
```

### Layer 2 — Themes

Built-in theme sets that override Layer 1 per visual context.

| Theme | Applied via | Description |
|-------|-------------|-------------|
| Light | `:root` (default) | Default light mode |
| Dark | `.hull-dark` or `prefers-color-scheme` | Dark mode |

```css
/* Enable dark mode */
.hull-dark {
  --keel-color-bg-base: #111827;
  --keel-color-text-base: #f9fafb;
}
```

### Layer 3 — Project Theming

A supported convention for projects to apply their own brand on top of hull:

```css
/* my-project/src/styles/hull.theme.css */
:root {
  --keel-color-primary: #7c3aed;       /* brand purple */
  --keel-color-primary-hover: #6d28d9;
  --keel-font-family: 'Geist', sans-serif;
}
```

---

## Dark Mode

Hull supports three ways to activate dark mode:

```css
/* 1. CSS class on <html> */
<html class="hull-dark">

/* 2. Data attribute */
<html data-hull-theme="dark">

/* 3. System preference (automatic) */
/* Hull respects prefers-color-scheme: dark automatically */
/* Add class="hull-light" to force light mode regardless of system */
```

---

## Project Theming

Override hull's token values with your project's brand:

```css
/* Import hull first, then your overrides */
@import '@colis/hull/styles.css';

:root {
  --keel-color-primary: #your-brand-color;
  --keel-font-family: 'Your Brand Font', sans-serif;
}
```

> See [src/project/README.md](./src/project/README.md) for full project theming documentation.

---

## Token Reference

Hull assigns values to all tokens in the `--keel-*` namespace. See:

- [docs/reference/KEEL_HULL_TOKEN_CONTRACT.md](../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md) — complete token contract
- [@colis/keel README](../keel/README.md) — token table with default values

---

## License

MIT — Copyright © Colis
