/**
 * Keel/Hull CSS token definitions.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When the token contract in docs/reference/KEEL_HULL_TOKEN_CONTRACT.md changes,
 * update this file to match.
 */
export type TokenCategory = 'color' | 'spacing' | 'radius' | 'typography' | 'shadow' | 'transition' | 'z-index' | 'focus';
export interface KeelToken {
    name: string;
    category: TokenCategory;
    keelFallback: string;
    hullLayer1Value: string;
    tailwindSource: string;
    description: string;
    usedBy: string[];
}
export declare const KEEL_TOKENS: KeelToken[];
export declare function getTokensByCategory(category: TokenCategory): KeelToken[];
export declare function getTokenByName(name: string): KeelToken | undefined;
//# sourceMappingURL=tokens.d.ts.map