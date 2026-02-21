/**
 * Theming recipes — step-by-step guides for common hull/keel setup tasks.
 */
export interface RecipeStep {
    step: number;
    description: string;
    code?: string;
    language?: string;
    note?: string;
}
export interface ThemingRecipe {
    id: string;
    title: string;
    description: string;
    prerequisites: string[];
    steps: RecipeStep[];
    docsPath: string;
}
export declare const THEMING_RECIPES: ThemingRecipe[];
export declare function getRecipeById(id: string): ThemingRecipe | undefined;
//# sourceMappingURL=recipes.d.ts.map