/**
 * Docs portal page links for keel/hull/mcp topics.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When new pages are added to packages/chartroom, add entries here.
 */
export const DOCS_BASE_URL = 'http://localhost:4300';
export const DOCS_LINKS = [
    {
        title: 'Installation',
        path: '/design-system/getting-started/installation',
        url: `${DOCS_BASE_URL}/design-system/getting-started/installation`,
        keywords: ['install', 'setup', 'npm', 'angular.json'],
        description: 'Install @colis/keel in your Angular project',
    },
    {
        title: 'Using Keel Without Hull',
        path: '/design-system/getting-started/without-hull',
        url: `${DOCS_BASE_URL}/design-system/getting-started/without-hull`,
        keywords: ['keel only', 'no hull', 'standalone', 'defaults'],
        description: 'Use keel with built-in CSS defaults, no hull required',
    },
    {
        title: 'Using Keel With Hull',
        path: '/design-system/getting-started/with-hull',
        url: `${DOCS_BASE_URL}/design-system/getting-started/with-hull`,
        keywords: ['hull', 'design system', 'install hull', 'themes'],
        description: 'Add hull for a full design system with light/dark themes',
    },
    {
        title: 'Keel — Overview',
        path: '/design-system/keel/overview',
        url: `${DOCS_BASE_URL}/design-system/keel/overview`,
        keywords: ['keel', 'components', 'overview', 'standalone'],
        description: 'Overview of the @colis/keel component library',
    },
    {
        title: 'CSS Token Contract',
        path: '/design-system/keel/token-contract',
        url: `${DOCS_BASE_URL}/design-system/keel/token-contract`,
        keywords: ['tokens', 'css variables', '--keel', 'custom properties'],
        description: 'Complete reference for --keel-* CSS custom properties',
    },
    {
        title: 'Hull — Overview',
        path: '/design-system/hull/overview',
        url: `${DOCS_BASE_URL}/design-system/hull/overview`,
        keywords: ['hull', 'design system', 'theming', 'overview'],
        description: 'Overview of the @colis/hull design system',
    },
    {
        title: 'Hull — Three-Layer Architecture',
        path: '/design-system/hull/architecture',
        url: `${DOCS_BASE_URL}/design-system/hull/architecture`,
        keywords: ['architecture', 'layers', 'base', 'themes', 'tailwind'],
        description: "How hull's three CSS layers compose the design system",
    },
    {
        title: 'Dark Mode',
        path: '/design-system/hull/dark-mode',
        url: `${DOCS_BASE_URL}/design-system/hull/dark-mode`,
        keywords: ['dark mode', 'hull-dark', 'prefers-color-scheme', 'toggle'],
        description: 'Enable and configure dark mode with @colis/hull',
    },
    {
        title: 'Project Theming',
        path: '/design-system/hull/project-theming',
        url: `${DOCS_BASE_URL}/design-system/hull/project-theming`,
        keywords: ['brand', 'custom theme', 'override', 'layer 3', 'project'],
        description: 'Apply your project brand on top of hull (Layer 3)',
    },
    {
        title: 'MCP — Overview',
        path: '/design-system/mcp/overview',
        url: `${DOCS_BASE_URL}/design-system/mcp/overview`,
        keywords: ['mcp', 'ai', 'llm', 'cursor', 'assistant'],
        description: 'Give AI assistants authoritative keel/hull knowledge',
    },
    {
        title: 'MCP — Setup in Cursor',
        path: '/design-system/mcp/setup-cursor',
        url: `${DOCS_BASE_URL}/design-system/mcp/setup-cursor`,
        keywords: ['cursor', 'mcp.json', 'configuration', 'setup'],
        description: 'Configure keel-mcp in Cursor IDE',
    },
    {
        title: 'MCP — Tool Reference',
        path: '/design-system/mcp/tool-reference',
        url: `${DOCS_BASE_URL}/design-system/mcp/tool-reference`,
        keywords: ['tools', 'list_components', 'get_component_api', 'reference'],
        description: 'All available keel-mcp tool signatures and responses',
    },
];
export function searchDocsLinks(query) {
    const q = query.toLowerCase();
    return DOCS_LINKS.filter((d) => d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.keywords.some((k) => k.toLowerCase().includes(q)));
}
//# sourceMappingURL=docs-links.js.map