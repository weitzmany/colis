import { TokenCategory } from '../data/tokens.js';
export interface GetThemeTokensInput {
    category?: TokenCategory;
    name?: string;
}
export declare function getThemeTokens(input?: GetThemeTokensInput): {
    error: string;
    tokens?: undefined;
    validCategories?: undefined;
    category?: undefined;
    total?: undefined;
    categories?: undefined;
} | {
    tokens: import("../data/tokens.js").KeelToken[];
    error?: undefined;
    validCategories?: undefined;
    category?: undefined;
    total?: undefined;
    categories?: undefined;
} | {
    error: string;
    validCategories: TokenCategory[];
    tokens?: undefined;
    category?: undefined;
    total?: undefined;
    categories?: undefined;
} | {
    category: TokenCategory;
    tokens: import("../data/tokens.js").KeelToken[];
    error?: undefined;
    validCategories?: undefined;
    total?: undefined;
    categories?: undefined;
} | {
    tokens: import("../data/tokens.js").KeelToken[];
    total: number;
    categories: string[];
    error?: undefined;
    validCategories?: undefined;
    category?: undefined;
};
//# sourceMappingURL=get-theme-tokens.d.ts.map