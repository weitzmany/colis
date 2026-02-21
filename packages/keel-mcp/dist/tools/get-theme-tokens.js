import { KEEL_TOKENS, getTokensByCategory } from '../data/tokens.js';
export function getThemeTokens(input = {}) {
    const { category, name } = input;
    if (name) {
        const token = KEEL_TOKENS.find((t) => t.name === name);
        if (!token) {
            return { error: `Token '${name}' not found.` };
        }
        return { tokens: [token] };
    }
    if (category) {
        const validCategories = ['color', 'spacing', 'radius', 'typography', 'shadow', 'transition', 'z-index', 'focus'];
        if (!validCategories.includes(category)) {
            return {
                error: `Invalid category '${category}'.`,
                validCategories,
            };
        }
        return {
            category,
            tokens: getTokensByCategory(category),
        };
    }
    return {
        tokens: KEEL_TOKENS,
        total: KEEL_TOKENS.length,
        categories: ['color', 'spacing', 'radius', 'typography', 'shadow', 'transition', 'z-index', 'focus'],
    };
}
//# sourceMappingURL=get-theme-tokens.js.map