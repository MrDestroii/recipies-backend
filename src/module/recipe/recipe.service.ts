import { Injectable } from '@nestjs/common';
import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from './repository/ingredient.repository';
import { AlternativeIngredientRepository } from './repository/alternative-igredient.repository';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly alternativeIngredientRepository: AlternativeIngredientRepository,
  ) {}

  find() {
    return this.recipeRepository.find({
      relations: ['likes', 'likes.user', 'ingredients', 'alternativeIngredients', 'alternativeIngredients.ingredient'],
    });
  }
}
