export interface GetStoryLinksInput {
    component?: string;
}
export declare function getStoryLinks(input?: GetStoryLinksInput): {
    component: string;
    storybookBaseUrl: string;
    stories: import("../data/story-links.js").StoryLink[];
    note: string | undefined;
    total?: undefined;
} | {
    storybookBaseUrl: string;
    stories: import("../data/story-links.js").StoryLink[];
    total: number;
    component?: undefined;
    note?: undefined;
};
//# sourceMappingURL=get-story-links.d.ts.map