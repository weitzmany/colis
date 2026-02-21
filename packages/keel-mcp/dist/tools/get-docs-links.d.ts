export interface GetDocsLinksInput {
    query?: string;
    path?: string;
}
export declare function getDocsLinks(input?: GetDocsLinksInput): {
    error: string;
    results?: undefined;
    query?: undefined;
    total?: undefined;
    docsBaseUrl?: undefined;
    pages?: undefined;
} | {
    results: import("../data/docs-links.js").DocsLink[];
    error?: undefined;
    query?: undefined;
    total?: undefined;
    docsBaseUrl?: undefined;
    pages?: undefined;
} | {
    query: string;
    results: import("../data/docs-links.js").DocsLink[];
    total: number;
    error?: undefined;
    docsBaseUrl?: undefined;
    pages?: undefined;
} | {
    docsBaseUrl: string;
    pages: import("../data/docs-links.js").DocsLink[];
    total: number;
    error?: undefined;
    results?: undefined;
    query?: undefined;
};
//# sourceMappingURL=get-docs-links.d.ts.map