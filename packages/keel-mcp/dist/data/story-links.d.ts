/**
 * Storybook story links for keel components and hull themes.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When a new story is added to packages/keel-storybook, add the story ID here.
 * Update storyId in components.ts as well.
 */
export declare const STORYBOOK_BASE_URL = "http://localhost:6006";
export interface StoryLink {
    component: string;
    name: string;
    storyId: string;
    url: string;
}
export declare const STORY_LINKS: StoryLink[];
export declare function getStoryLinksForComponent(component: string): StoryLink[];
//# sourceMappingURL=story-links.d.ts.map