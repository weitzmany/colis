/**
 * Storybook story links for keel components and hull themes.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When a new story is added to packages/keel-storybook, add the story ID here.
 * Update storyId in components.ts as well.
 */

export const STORYBOOK_BASE_URL = 'http://localhost:6006';

export interface StoryLink {
  component: string;
  name: string;
  storyId: string;
  url: string;
}

export const STORY_LINKS: StoryLink[] = [
  // Token stories (Phase 1 — available)
  {
    component: 'tokens',
    name: 'Color Tokens — Primary',
    storyId: 'design-tokens-colors--primary',
    url: `${STORYBOOK_BASE_URL}/?path=/story/design-tokens-colors--primary`,
  },
  {
    component: 'tokens',
    name: 'Color Tokens — Semantic',
    storyId: 'design-tokens-colors--semantic',
    url: `${STORYBOOK_BASE_URL}/?path=/story/design-tokens-colors--semantic`,
  },
  {
    component: 'tokens',
    name: 'Spacing Tokens',
    storyId: 'design-tokens-spacing--all',
    url: `${STORYBOOK_BASE_URL}/?path=/story/design-tokens-spacing--all`,
  },
  {
    component: 'tokens',
    name: 'Typography Tokens',
    storyId: 'design-tokens-typography--all',
    url: `${STORYBOOK_BASE_URL}/?path=/story/design-tokens-typography--all`,
  },

  // Theme stories (Phase 1 — available)
  {
    component: 'hull-themes',
    name: 'Hull Light',
    storyId: 'hull-themes-light--default',
    url: `${STORYBOOK_BASE_URL}/?path=/story/hull-themes-light--default`,
  },
  {
    component: 'hull-themes',
    name: 'Hull Dark',
    storyId: 'hull-themes-dark--default',
    url: `${STORYBOOK_BASE_URL}/?path=/story/hull-themes-dark--default`,
  },
  {
    component: 'hull-themes',
    name: 'Theme Matrix — Light vs Dark',
    storyId: 'hull-themes-theme-matrix--light-and-dark',
    url: `${STORYBOOK_BASE_URL}/?path=/story/hull-themes-theme-matrix--light-and-dark`,
  },

  // Component stories
  {
    component: 'keel-button',
    name: 'Button Playground',
    storyId: 'components-button--playground',
    url: `${STORYBOOK_BASE_URL}/?path=/story/components-button--playground`,
  },
  {
    component: 'keel-button',
    name: 'Button Variants',
    storyId: 'components-button--variants',
    url: `${STORYBOOK_BASE_URL}/?path=/story/components-button--variants`,
  },
  {
    component: 'keel-button',
    name: 'Button States',
    storyId: 'components-button--themes',
    url: `${STORYBOOK_BASE_URL}/?path=/story/components-button--themes`,
  },
  {
    component: 'keel-button',
    name: 'Button Sizes and Shape',
    storyId: 'components-button--sizes-and-shape',
    url: `${STORYBOOK_BASE_URL}/?path=/story/components-button--sizes-and-shape`,
  },
];

export function getStoryLinksForComponent(component: string): StoryLink[] {
  return STORY_LINKS.filter((s) => s.component === component);
}
