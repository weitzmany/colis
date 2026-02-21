import { KEEL_COMPONENTS } from '../data/components.js';
export function listComponents(input = {}) {
    const { status = 'all' } = input;
    const filtered = status === 'all'
        ? KEEL_COMPONENTS
        : KEEL_COMPONENTS.filter((c) => c.status === status);
    return {
        components: filtered.map((c) => ({
            name: c.name,
            selector: c.selector,
            importPath: c.importPath,
            status: c.status,
            description: c.description,
            phase: c.phase,
            storyUrl: c.storyId
                ? `http://localhost:6006/?path=/story/${c.storyId}`
                : null,
            docsUrl: `http://localhost:4300${c.docsPath}`,
        })),
        total: filtered.length,
        available: filtered.filter((c) => c.status === 'available').length,
        planned: filtered.filter((c) => c.status === 'planned').length,
    };
}
//# sourceMappingURL=list-components.js.map