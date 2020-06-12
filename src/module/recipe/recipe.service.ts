import { Injectable } from '@nestjs/common';
import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from '../ingredient/ingredient.repository';
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
      relations: [
        'likes',
        'likes.user',
        'ingredients',
        'alternativeIngredients',
        'alternativeIngredients.ingredient',
        'alternativeIngredients.ingredientAlternative',
      ],
    });
  }

  async get(id: string) {
    const recipe = await this.recipeRepository.findOneOrFail(id, {
      relations: [
        'likes',
        'likes.user',
        'ingredients',
        'alternativeIngredients',
        'alternativeIngredients.ingredient',
        'alternativeIngredients.ingredientAlternative',
      ],
    });

    console.log({ recipe });

    return recipe;
  }
}
