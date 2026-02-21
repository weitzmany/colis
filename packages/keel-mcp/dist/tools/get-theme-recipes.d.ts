export interface GetThemeRecipesInput {
    recipe?: string;
}
export declare function getThemeRecipes(input?: GetThemeRecipesInput): import("../data/recipes.js").ThemingRecipe | {
    error: string;
    availableRecipes: {
        id: string;
        title: string;
    }[];
    recipes?: undefined;
} | {
    recipes: {
        id: string;
        title: string;
        description: string;
        prerequisites: string[];
        docsUrl: string;
    }[];
    error?: undefined;
    availableRecipes?: undefined;
};
//# sourceMappingURL=get-theme-recipes.d.ts.map