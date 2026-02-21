import { THEMING_RECIPES, getRecipeById } from '../data/recipes.js';

export interface GetThemeRecipesInput {
  recipe?: string;
}

export function getThemeRecipes(input: GetThemeRecipesInput = {}) {
  const { recipe } = input;

  if (recipe) {
    const found = getRecipeById(recipe);
    if (!found) {
      return {
        error: `Recipe '${recipe}' not found.`,
        availableRecipes: THEMING_RECIPES.map((r) => ({ id: r.id, title: r.title })),
      };
    }
    return found;
  }

  return {
    recipes: THEMING_RECIPES.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      prerequisites: r.prerequisites,
      docsUrl: `http://localhost:4300${r.docsPath}`,
    })),
  };
}
