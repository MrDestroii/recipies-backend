import { Injectable } from '@nestjs/common';

import * as R from 'ramda';

import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from '../ingredient/ingredient.repository';
import { AlternativeIngredientRepository } from './repository/alternative-igredient.repository';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { LikeEntity } from 'src/entity/like.entity';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly alternativeIngredientRepository: AlternativeIngredientRepository,
  ) {}

  async find() {
    const recipes: RecipeEntity[] = await this.recipeRepository.find({
      relations: [
        'likes',
        'likes.user',
        'ingredients',
        'alternativeIngredients',
        'alternativeIngredients.ingredient',
        'alternativeIngredients.ingredientAlternative',
      ],
    });

    return R.map<RecipeEntity, RecipeEntity>(this.filterLikes)(recipes);
  }

  async get(id: string) {
    const recipe: RecipeEntity = await this.recipeRepository.findOneOrFail(id, {
      relations: [
        'likes',
        'likes.user',
        'ingredients',
        'alternativeIngredients',
        'alternativeIngredients.ingredient',
        'alternativeIngredients.ingredientAlternative',
      ],
    });

    return this.filterLikes(recipe);
  }

  filterLikes(recipe: RecipeEntity): RecipeEntity {
    const recipeWithFilteredLikes = {
      ...recipe,
      likes: R.filter<LikeEntity>(R.prop('isActive'))(recipe.likes),
    };
    return recipeWithFilteredLikes;
  }
}
