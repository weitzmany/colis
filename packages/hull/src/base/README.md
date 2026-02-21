# Hull Layer 1 — Base (Tailwind Token Mapping)

## Purpose

Layer 1 assigns concrete CSS values to the `--keel-*` CSS custom property namespace.

This is the foundation layer — Layer 2 themes build on top of it by overriding specific tokens for light/dark mode and semantic contexts.

## Tailwind-First Strategy

Hull's default Layer 1 uses values from Tailwind CSS's design system as the source of truth. This means:

- **Battle-tested values**: Tailwind's color, spacing, and typography scales are widely used and accessible
- **No Tailwind dependency**: Hull does NOT require Tailwind CSS to be installed — it just uses Tailwind's token values as static CSS values
- **Familiar to Tailwind developers**: If your team knows Tailwind, hull's defaults will feel natural

## Phase 2 Implementation

In Phase 2, `tailwind-mapping.css` will be created here with the full `--keel-*` token assignments.

Reference: [docs/reference/KEEL_HULL_TOKEN_CONTRACT.md](../../../../docs/reference/KEEL_HULL_TOKEN_CONTRACT.md) for the full token list.

## Future Adapters (Phase 3+)

- `bootstrap-mapping.css` — for Bootstrap-based projects
- `custom-mapping.template.css` — starter template for fully custom token values
