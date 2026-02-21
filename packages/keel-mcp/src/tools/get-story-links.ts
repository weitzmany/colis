import { STORY_LINKS, getStoryLinksForComponent, STORYBOOK_BASE_URL } from '../data/story-links.js';

export interface GetStoryLinksInput {
  component?: string;
}

export function getStoryLinks(input: GetStoryLinksInput = {}) {
  const { component } = input;

  if (component) {
    const links = getStoryLinksForComponent(component);
    return {
      component,
      storybookBaseUrl: STORYBOOK_BASE_URL,
      stories: links.length > 0 ? links : [],
      note: links.length === 0
        ? `No stories available yet for '${component}'. Component stories ship in Phase 2.`
        : undefined,
    };
  }

  return {
    storybookBaseUrl: STORYBOOK_BASE_URL,
    stories: STORY_LINKS,
    total: STORY_LINKS.length,
  };
}
