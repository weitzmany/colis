# @colis/keel

Angular component library for the Colis ecosystem — standalone, themeable UI primitives.

> **Phase 1 — Foundation MVP.** No components are shipped yet. This package establishes the installable foundation, public API contract, and CSS token system that Phase 2 components will build on.

---

## Installation

```bash
npm install @colis/keel
```

Angular peer dependency is required (≥ 17.0.0):

```bash
npm install @colis/keel @angular/core @angular/common
```

---

## Works without @colis/hull

Keel is fully independent. It works out of the box with built-in default styles:

```css
/* In your Angular project's global stylesheet */
@import '@colis/keel/src/tokens/defaults.css';
```

This loads keel's default design tokens (colors, spacing, typography). All future keel components will render with sensible defaults.

---

## Works with @colis/hull (Recommended)

For a complete design system with light/dark theming, install hull alongside keel:

```bash
npm install @colis/keel @colis/hull
```

Then import hull instead of keel's defaults:

```css
/* In your Angular project's global stylesheet */
@import '@colis/hull';
```

Hull provides concrete token values, built-in light/dark themes, and project theming support — all while targeting the same `--keel-*` CSS variables that keel components consume.

---

## CSS Token Contract

Keel components use CSS custom properties in the `--keel-*` namespace. You can override any of them to customize the appearance.

### Colors

| Token | Default | Description |
|-------|---------|-------------|
| `--keel-color-primary` | `#3b82f6` | Primary action color |
| `--keel-color-primary-hover` | `#2563eb` | Primary hover state |
| `--keel-color-secondary` | `#6b7280` | Secondary action color |
| `--keel-color-danger` | `#ef4444` | Destructive/error color |
| `--keel-color-success` | `#22c55e` | Success/positive color |
| `--keel-color-warning` | `#f59e0b` | Warning color |
| `--keel-color-text-base` | `#111827` | Primary text |
| `--keel-color-text-muted` | `#6b7280` | Muted/secondary text |
| `--keel-color-bg-base` | `#ffffff` | Base background |
| `--keel-color-border` | `#e5e7eb` | Default border color |

### Spacing

| Token | Default |
|-------|---------|
| `--keel-space-xs` | `4px` |
| `--keel-space-sm` | `8px` |
| `--keel-space-md` | `12px` |
| `--keel-space-lg` | `16px` |
| `--keel-space-xl` | `24px` |
| `--keel-space-2xl` | `32px` |

### Typography

| Token | Default |
|-------|---------|
| `--keel-font-family` | `ui-sans-serif, system-ui, sans-serif` |
| `--keel-font-size-sm` | `0.875rem` |
| `--keel-font-size-base` | `1rem` |
| `--keel-font-size-lg` | `1.125rem` |

> For the full token list, see [src/tokens/defaults.css](./src/tokens/defaults.css) or the shared [Token Contract documentation](../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md).

---

## Planned Components (Phase 2+)

| Component | Selector | Status |
|-----------|----------|--------|
| Button | `<keel-button>` | Planned |
| Input | `<keel-input>` | Planned |
| Textarea | `<keel-textarea>` | Planned |
| Select | `<keel-select>` | Planned |
| Checkbox | `<keel-checkbox>` | Planned |
| Radio | `<keel-radio>` | Planned |
| Modal | `<keel-modal>` | Planned |
| Tooltip | `<keel-tooltip>` | Planned |
| Badge | `<keel-badge>` | Planned |

All components will be **standalone Angular components** (Angular 17+ API) that can be imported individually:

```typescript
import { KeelButtonComponent } from '@colis/keel';

@Component({
  standalone: true,
  imports: [KeelButtonComponent],
  template: `<keel-button variant="primary">Save</keel-button>`
})
export class MyComponent { }
```

---

## Custom Theming (No Hull)

If you are not using `@colis/hull`, override keel's tokens directly:

```css
/* my-project/src/styles.css */
@import '@colis/keel/src/tokens/defaults.css';

/* Override with your brand */
:root {
  --keel-color-primary: #7c3aed;       /* brand purple */
  --keel-color-primary-hover: #6d28d9;
  --keel-font-family: 'Geist', sans-serif;
}
```

---

## License

MIT — Copyright © Colis
