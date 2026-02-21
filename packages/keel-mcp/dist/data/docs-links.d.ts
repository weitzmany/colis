/**
 * Docs portal page links for keel/hull/mcp topics.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When new pages are added to packages/chartroom, add entries here.
 */
export declare const DOCS_BASE_URL = "http://localhost:4300";
export interface DocsLink {
    title: string;
    path: string;
    url: string;
    keywords: string[];
    description: string;
}
export declare const DOCS_LINKS: DocsLink[];
export declare function searchDocsLinks(query: string): DocsLink[];
//# sourceMappingURL=docs-links.d.ts.map