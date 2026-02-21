# Keel Storybook

## Product Requirements Document (PRD)

**Package Name**: `@colis/keel-storybook`  
**Status**: Phase 1 — Foundation Scaffold  
**Priority**: High (P1)  
**Created Date**: 2026-02-21

---

## Overview

`@colis/keel-storybook` is the Storybook host for the Colis design system. It provides:
- Interactive token explorers for `--keel-*` CSS custom properties
- Hull theme previews (light, dark, and future semantic variants)
- Component stories for all `@colis/keel` components (Phase 2+)
- Theme matrix showing all components across all themes simultaneously

## Phase 1 Scope

- Storybook framework setup (Angular)
- Introduction story
- Design Token stories (colors, spacing, typography)
- Hull Theme stories (light, dark, theme matrix)
- Component story template for Phase 2

## Phase 2+ Scope

One story file per keel component, with:
- All variant states documented via `argTypes`
- Theme matrix updated with each new component
- MCP story-links data updated

## Acceptance Criteria (Phase 1)

- [ ] `npm run storybook` starts on port 6006
- [ ] Token stories show color, spacing, typography previews with live CSS variables
- [ ] HullLight and HullDark theme stories render correctly
- [ ] Theme matrix shows light/dark side by side
- [ ] Introduction page links to chartroom and MCP docs
