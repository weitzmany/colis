# Hull Layer 2 — Built-in Themes

## Purpose

Layer 2 provides built-in theme sets that override `--keel-*` token values for specific visual contexts. These themes build on top of Layer 1 values.

## Built-in Themes (Phase 2)

| Directory | Theme | Applied via | Description |
|-----------|-------|-------------|-------------|
| `light/` | Light mode | `:root` (default) | Default light theme |
| `dark/` | Dark mode | `.hull-dark` or `@media (prefers-color-scheme: dark)` | Dark theme |

## Future Themes (Phase 3+)

| Theme | Applied via | Description |
|-------|-------------|-------------|
| `.hull-primary` | CSS class | Primary brand context |
| `.hull-secondary` | CSS class | Secondary brand context |
| `.hull-danger` | CSS class | Destructive/error context |
| `.hull-success` | CSS class | Positive/success context |
| `.hull-warning` | CSS class | Warning context |

## Dark Mode Strategy

Hull supports three dark mode activation strategies:

1. **Class-based**: Add `.hull-dark` to `<html>` or a parent element
2. **Data attribute**: Set `data-hull-theme="dark"` on `<html>`
3. **System preference**: Hull respects `@media (prefers-color-scheme: dark)` unless `.hull-light` is explicitly set

## Phase 2 Implementation

In Phase 2:
- `light/index.css` will be created with light theme token values
- `dark/index.css` will be created with dark theme overrides

These will be imported automatically by `../../styles.css`.
