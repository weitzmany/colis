import { DOCS_LINKS, searchDocsLinks, DOCS_BASE_URL } from '../data/docs-links.js';
export function getDocsLinks(input = {}) {
    const { query, path } = input;
    if (path) {
        const found = DOCS_LINKS.find((d) => d.path === path || d.url.includes(path));
        if (!found) {
            return { error: `No docs page found for path '${path}'.` };
        }
        return { results: [found] };
    }
    if (query) {
        const results = searchDocsLinks(query);
        return {
            query,
            results,
            total: results.length,
        };
    }
    return {
        docsBaseUrl: DOCS_BASE_URL,
        pages: DOCS_LINKS,
        total: DOCS_LINKS.length,
    };
}
//# sourceMappingURL=get-docs-links.js.map