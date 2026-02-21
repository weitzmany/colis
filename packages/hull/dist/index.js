/**
 * @colis/hull — Design system and theming package for @colis/keel
 *
 * Phase 1: Foundation MVP — architecture scaffold, no theme values yet.
 *
 * Hull provides a three-layer CSS theming system for @colis/keel components:
 *
 *   Layer 1 — Base: src/base/
 *     Tailwind-first mapping of design token values to --keel-* CSS variables.
 *     Projects not using Tailwind CSS still benefit: hull bakes in Tailwind's
 *     battle-tested color/spacing scale as concrete CSS variable values.
 *
 *   Layer 2 — Themes: src/themes/
 *     Built-in theme sets (light, dark, semantic states) that override Layer 1
 *     values per visual context. Applied via CSS class or media query.
 *
 *   Layer 3 — Project: src/project/
 *     Convention and helpers for consuming projects to supply their own brand
 *     tokens on top of hull's defaults.
 *
 * CSS entry point:
 *   @import '@colis/hull/styles.css';
 *
 * See README.md for full usage documentation.
 * See docs/reference/KEEL_HULL_TOKEN_CONTRACT.md for the token contract.
 */
export const HULL_VERSION = '0.1.0';
//# sourceMappingURL=index.js.map