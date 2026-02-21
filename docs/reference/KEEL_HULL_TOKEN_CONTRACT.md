# Keel + Hull Token Contract

**Status**: Active — Frozen at Phase 1 finalization  
**Version**: 1.0  
**Last Updated**: 2026-02-21  
**Owners**: `@colis/keel`, `@colis/hull`

---

## Overview

This document defines the CSS custom property (token) contract shared between `@colis/keel` and `@colis/hull`. It is the single source of truth for:

1. **Which package owns what** — keel consumes tokens, hull provides values
2. **Token naming conventions** — the `--keel-{category}-{scale}` namespace
3. **Fallback behavior** — what keel does when hull is absent
4. **Hull's value responsibility** — which layer assigns which values

---

## Ownership Model

```
┌──────────────────────────────────────────────────────────────┐
│  KEEL (@colis/keel)                                          │
│  Role: CONSUMER                                              │
│  - Reads CSS vars via var(--keel-*, fallback)                │
│  - Defines safe fallback values for standalone use           │
│  - Never assigns concrete values to --keel-* tokens          │
└──────────────────────────────────────────────────────────────┘
                         ↑ reads
┌──────────────────────────────────────────────────────────────┐
│  HULL (@colis/hull)                                          │
│  Role: PROVIDER                                              │
│  Layer 1: Assigns Tailwind-sourced base values to --keel-*   │
│  Layer 2: Overrides --keel-* per theme (light/dark/etc)      │
│  Layer 3: Documents pattern for project overrides            │
└──────────────────────────────────────────────────────────────┘
                         ↑ overrides
┌──────────────────────────────────────────────────────────────┐
│  PROJECT (consuming app)                                     │
│  Role: OVERRIDER                                             │
│  - Optionally overrides --keel-* vars with brand values      │
│  - Imports hull first, then its own overrides                │
└──────────────────────────────────────────────────────────────┘
```

---

## Token Namespace

All tokens follow the pattern:

```
--keel-{category}-{scale}
```

No other CSS custom properties in the `--keel-` namespace may be defined by third parties or consuming projects for any purpose other than overriding the values listed here. The namespace is reserved for the keel/hull contract.

---

## Full Token Reference

### Color Tokens

| Token | Keel Fallback Default | Hull Layer 1 (Tailwind Source) | Notes |
|-------|-----------------------|-------------------------------|-------|
| `--keel-color-primary` | `#3b82f6` | Tailwind `blue-500` | Main brand/action color |
| `--keel-color-primary-hover` | `#2563eb` | Tailwind `blue-600` | Hover state for primary |
| `--keel-color-primary-active` | `#1d4ed8` | Tailwind `blue-700` | Active/pressed state |
| `--keel-color-primary-subtle` | `#eff6ff` | Tailwind `blue-50` | Light bg for primary context |
| `--keel-color-secondary` | `#6b7280` | Tailwind `gray-500` | Secondary actions |
| `--keel-color-secondary-hover` | `#4b5563` | Tailwind `gray-600` | Hover state for secondary |
| `--keel-color-secondary-subtle` | `#f9fafb` | Tailwind `gray-50` | Light bg for secondary |
| `--keel-color-danger` | `#ef4444` | Tailwind `red-500` | Destructive/error actions |
| `--keel-color-danger-hover` | `#dc2626` | Tailwind `red-600` | Hover for danger |
| `--keel-color-danger-subtle` | `#fef2f2` | Tailwind `red-50` | Light bg for error context |
| `--keel-color-success` | `#22c55e` | Tailwind `green-500` | Success/positive states |
| `--keel-color-success-hover` | `#16a34a` | Tailwind `green-600` | Hover for success |
| `--keel-color-success-subtle` | `#f0fdf4` | Tailwind `green-50` | Light bg for success context |
| `--keel-color-warning` | `#f59e0b` | Tailwind `amber-500` | Warning states |
| `--keel-color-warning-hover` | `#d97706` | Tailwind `amber-600` | Hover for warning |
| `--keel-color-warning-subtle` | `#fffbeb` | Tailwind `amber-50` | Light bg for warning context |
| `--keel-color-text-base` | `#111827` | Tailwind `gray-900` | Primary text color |
| `--keel-color-text-muted` | `#6b7280` | Tailwind `gray-500` | Secondary/muted text |
| `--keel-color-text-disabled` | `#9ca3af` | Tailwind `gray-400` | Disabled text |
| `--keel-color-text-inverse` | `#ffffff` | White | Text on dark backgrounds |
| `--keel-color-bg-base` | `#ffffff` | White | Page/component background |
| `--keel-color-bg-subtle` | `#f9fafb` | Tailwind `gray-50` | Subtle background (cards, etc.) |
| `--keel-color-bg-overlay` | `rgba(0,0,0,0.5)` | — | Modal overlays |
| `--keel-color-border` | `#e5e7eb` | Tailwind `gray-200` | Default border |
| `--keel-color-border-strong` | `#d1d5db` | Tailwind `gray-300` | Stronger border |
| `--keel-color-border-focus` | `#3b82f6` | Tailwind `blue-500` | Focus ring border |

### Spacing Tokens

| Token | Keel Fallback Default | Hull Layer 1 (Tailwind Source) | Notes |
|-------|-----------------------|-------------------------------|-------|
| `--keel-space-xs` | `4px` | Tailwind spacing `1` | Extra small spacing |
| `--keel-space-sm` | `8px` | Tailwind spacing `2` | Small spacing (tight padding) |
| `--keel-space-md` | `12px` | Tailwind spacing `3` | Medium spacing |
| `--keel-space-lg` | `16px` | Tailwind spacing `4` | Large spacing (standard padding) |
| `--keel-space-xl` | `24px` | Tailwind spacing `6` | Extra large spacing |
| `--keel-space-2xl` | `32px` | Tailwind spacing `8` | 2x large |
| `--keel-space-3xl` | `48px` | Tailwind spacing `12` | 3x large |

### Border Radius Tokens

| Token | Keel Fallback Default | Hull Layer 1 (Tailwind Source) | Notes |
|-------|-----------------------|-------------------------------|-------|
| `--keel-radius-sm` | `4px` | Tailwind `rounded` (4px) | Small radius |
| `--keel-radius-md` | `6px` | Tailwind `rounded-md` (6px) | Medium radius (default) |
| `--keel-radius-lg` | `8px` | Tailwind `rounded-lg` (8px) | Large radius |
| `--keel-radius-xl` | `12px` | Tailwind `rounded-xl` (12px) | Extra large |
| `--keel-radius-full` | `9999px` | Tailwind `rounded-full` | Pill shape |

### Typography Tokens

| Token | Keel Fallback Default | Hull Layer 1 (Tailwind Source) | Notes |
|-------|-----------------------|-------------------------------|-------|
| `--keel-font-family` | `ui-sans-serif, system-ui, sans-serif` | Tailwind `font-sans` | Base font stack |
| `--keel-font-family-mono` | `ui-monospace, monospace` | Tailwind `font-mono` | Monospace font stack |
| `--keel-font-size-xs` | `0.75rem` | Tailwind `text-xs` | 12px |
| `--keel-font-size-sm` | `0.875rem` | Tailwind `text-sm` | 14px |
| `--keel-font-size-base` | `1rem` | Tailwind `text-base` | 16px |
| `--keel-font-size-lg` | `1.125rem` | Tailwind `text-lg` | 18px |
| `--keel-font-size-xl` | `1.25rem` | Tailwind `text-xl` | 20px |
| `--keel-font-weight-normal` | `400` | — | Regular weight |
| `--keel-font-weight-medium` | `500` | — | Medium weight |
| `--keel-font-weight-semibold` | `600` | — | Semibold weight |
| `--keel-font-weight-bold` | `700` | — | Bold weight |
| `--keel-line-height-tight` | `1.25` | Tailwind `leading-tight` | Compact line height |
| `--keel-line-height-base` | `1.5` | Tailwind `leading-normal` | Normal line height |
| `--keel-line-height-relaxed` | `1.75` | Tailwind `leading-relaxed` | Relaxed line height |

### Shadow Tokens

| Token | Keel Fallback Default | Hull Layer 1 (Tailwind Source) | Notes |
|-------|-----------------------|-------------------------------|-------|
| `--keel-shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Tailwind `shadow-sm` | Subtle shadow |
| `--keel-shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Tailwind `shadow-md` | Medium shadow |
| `--keel-shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Tailwind `shadow-lg` | Large shadow |
| `--keel-shadow-none` | `none` | — | Explicit no-shadow |

### Transition Tokens

| Token | Keel Fallback Default | Notes |
|-------|-----------------------|-------|
| `--keel-transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Fast micro-interactions |
| `--keel-transition-base` | `200ms cubic-bezier(0.4, 0, 0.2, 1)` | Default transitions |
| `--keel-transition-slow` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` | Deliberate transitions |

### Z-Index Tokens

| Token | Keel Fallback Default | Notes |
|-------|-----------------------|-------|
| `--keel-z-dropdown` | `200` | Dropdown menus |
| `--keel-z-sticky` | `100` | Sticky headers |
| `--keel-z-tooltip` | `300` | Tooltips |
| `--keel-z-overlay` | `400` | Background overlays |
| `--keel-z-modal` | `500` | Modal dialogs |
| `--keel-z-notification` | `600` | Toast/notification |

### Focus Ring Tokens

| Token | Keel Fallback Default | Notes |
|-------|-----------------------|-------|
| `--keel-focus-ring-width` | `2px` | Width of focus indicator |
| `--keel-focus-ring-offset` | `2px` | Offset from element |
| `--keel-focus-ring-color` | `#3b82f6` | Focus ring color (matches primary) |

---

## Fallback Rules

### Keel's Fallback Pattern

Every token consumed by keel **must** include a fallback value in the `var()` call:

```css
/* CORRECT — always include fallback */
color: var(--keel-color-primary, #3b82f6);

/* WRONG — no fallback means broken appearance without hull */
color: var(--keel-color-primary);
```

### Default Values in Keel's Token File

Keel ships a `src/tokens/defaults.css` that assigns fallback values to all tokens on `:root`. These serve two purposes:

1. Provide baseline values when hull is absent
2. Serve as documentation of what the tokens look like at rest

```css
/* packages/keel/src/tokens/defaults.css */
/* These are default values — hull overrides them when installed */
:root {
  --keel-color-primary: #3b82f6;
  --keel-space-lg: 16px;
  /* ... all tokens ... */
}
```

When hull is installed, its Layer 1 re-assigns these same variables with potentially identical or different values. The result is a clean cascade: keel sets defaults, hull overrides them.

---

## Adding New Tokens

When a new keel component needs a token not in this list:

1. **Propose** the token in the keel PR, documenting: name, category, scale, fallback value, description
2. **Review** the token name against the naming convention (`--keel-{category}-{scale}`)
3. **Add** to this document first — it is the contract
4. **Implement** in keel (fallback in `defaults.css` + `var()` usage in component)
5. **Assign** in hull Layer 1 and Layer 2 as part of the hull PR

New tokens must not break existing keel components (they are additive).

---

## Dark Mode Token Responsibility

Hull Layer 2 is responsible for dark mode token assignments. The pattern:

```css
/* hull/src/themes/light/index.css — establishes light values */
:root {
  --keel-color-text-base: #111827;
  --keel-color-bg-base: #ffffff;
  --keel-color-border: #e5e7eb;
}

/* hull/src/themes/dark/index.css — overrides for dark */
.hull-dark,
[data-hull-theme="dark"],
@media (prefers-color-scheme: dark) {
  --keel-color-text-base: #f9fafb;
  --keel-color-bg-base: #111827;
  --keel-color-border: #374151;
}
```

Keel does **not** ship dark mode defaults. Dark mode only works when hull is installed.

---

## Contract Stability

Once Phase 2 is shipped, the following are **breaking changes** (require major version bump):

- Renaming any existing token (e.g., `--keel-color-primary` → `--keel-color-brand`)
- Removing any existing token
- Changing a fallback default to a value with significantly different visual result

The following are **non-breaking**:

- Adding new tokens
- Changing fallback defaults within the same visual intent (e.g., slightly different shade of blue for primary)
- Adding new categories
