import { Injectable } from '@nestjs/common';

import * as R from 'ramda';

import { RecipeEntity } from 'src/entity/recipe.entity';
import { LikeEntity } from 'src/entity/like.entity';
import { IngredientEntity } from 'src/entity/ingredient.entity';

@Injectable()
export class RecipeHelper {
  filterLikes(recipe: RecipeEntity): RecipeEntity {
    const recipeWithFilteredLikes = {
      ...recipe,
      likes: R.filter<LikeEntity>(R.prop('isActive'))(recipe.likes),
    };
    return recipeWithFilteredLikes;
  }

  filterByIngredients(
    ingredientsIds: string[] = [],
  ): (value: RecipeEntity) => boolean {
    const isEmptyIngredientsIds: boolean = R.isEmpty(ingredientsIds);
    return isEmptyIngredientsIds
      ? R.always(true)
      : (recipe: RecipeEntity): boolean => {
          return R.compose(
            R.any(item => R.includes(item, ingredientsIds)),
            R.map(R.prop('id')),
            R.prop('ingredients'),
          )(recipe);
        };
  }

  parseRequestAlternativeIngredients = R.compose(
    R.values,
    R.mapObjIndexed<
      IngredientEntity[],
      { ingredientId: string; ingredients: IngredientEntity[] },
      string
    >((ingredients: IngredientEntity[], ingredientId: string): {
      ingredientId: string;
      ingredients: IngredientEntity[];
    } => {
      return {
        ingredientId,
        ingredients,
      };
    }),
  );
}
