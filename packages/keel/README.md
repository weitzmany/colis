# @colis/keel

Angular component library for the Colis ecosystem — standalone, themeable UI primitives.

> **Current status:** `keel-button` is available. Additional primitives are planned.

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

This loads keel's default design tokens (colors, spacing, typography). Keel components render correctly with these defaults even when `@colis/hull` is not installed.

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
| `--keel-color-secondary` | `#d1d5db` | Secondary action color |
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

### Button Minimum Size Tokens

| Token | Default |
|-------|---------|
| `--keel-button-min-size-xs` | `0px` |
| `--keel-button-min-size-sm` | `0px` |
| `--keel-button-min-size-md` | `0px` |
| `--keel-button-min-size-lg` | `0px` |
| `--keel-button-min-size-xl` | `0px` |

### Typography

| Token | Default |
|-------|---------|
| `--keel-font-family` | `ui-sans-serif, system-ui, sans-serif` |
| `--keel-font-size-xs` | `0.75rem` |
| `--keel-font-size-sm` | `0.875rem` |
| `--keel-font-size-md` | `1rem` |
| `--keel-font-size-lg` | `1.125rem` |
| `--keel-font-size-xl` | `1.25rem` |

> For the full token list, see [src/tokens/defaults.css](./src/tokens/defaults.css) or the shared [Token Contract documentation](../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md).

---

## Available Component

### Button (`<keel-button>`)

`KeelButtonComponent` is a standalone Angular component exported from `@colis/keel`.

```typescript
import { Component } from '@angular/core';
import { KeelButtonComponent } from '@colis/keel';

@Component({
  standalone: true,
  imports: [KeelButtonComponent],
  template: `
    <keel-button variant="solid" theme="primary" (clicked)="onSave()">Save</keel-button>
  `
})
export class ExampleComponent {
  onSave(): void {
    // handle click
  }
}
```

#### Inputs

| Input | Type | Default |
|------|------|---------|
| `variant` | `'solid' \| 'outline' \| 'flat' \| 'link'` | `'solid'` |
| `theme` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'tertiary' \| 'dark'` | `'primary'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `rounded` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `EventEmitter<void>` | Emitted when the button is clicked and not disabled |

#### Slot Placeholders

- default slot: button content, e.g. `<keel-button>Save</keel-button>`
- `[keelButtonIcon]`: reserved placeholder for future icon component support

## Planned Components

| Component | Selector | Status |
|-----------|----------|--------|
| Button | `<keel-button>` | Available |
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
  template: `<keel-button variant="solid" theme="primary">Save</keel-button>`
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
