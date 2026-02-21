# @colis/keel-storybook

Interactive component explorer for `@colis/keel` components and `@colis/hull` themes.

---

## Development

```bash
npm install
npm run storybook    # starts on http://localhost:6006
```

## Build

```bash
npm run build-storybook    # outputs static site to dist/
```

## Story Structure

```
stories/
├── Introduction.mdx                         ← Welcome page
├── tokens/
│   ├── ColorTokens.stories.ts               ← All --keel-color-* tokens
│   ├── SpacingTokens.stories.ts             ← All --keel-space-* tokens
│   └── TypographyTokens.stories.ts          ← Font size/weight tokens
├── themes/
│   ├── HullLight.stories.ts                 ← Light theme preview
│   ├── HullDark.stories.ts                  ← Dark theme preview
│   └── ThemeMatrix.stories.ts               ← All themes side by side
└── components/
    ├── COMPONENT_STORY_TEMPLATE.md          ← Template for new stories
    └── <component>/                         ← Phase 2+ component stories
```

## Adding a New Component Story

1. Create `stories/components/<component-name>/<ComponentName>.stories.ts`
2. Follow the template in `stories/components/COMPONENT_STORY_TEMPLATE.md`
3. Add component to `stories/themes/ThemeMatrix.stories.ts`
4. Update `packages/keel-mcp/src/data/story-links.ts`
5. Update `packages/chartroom/src/content/docs/design-system/keel/overview.mdx` component status table

## Docs Sync Rule

Per `package_docs_sync.mdc`: **any change to `@colis/keel` or `@colis/hull` requires story updates here** before the change is considered complete.
