import { Injectable } from '@nestjs/common';

import * as R from 'ramda';

import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from '../ingredient/ingredient.repository';
import { AlternativeIngredientRepository } from './repository/alternative-igredient.repository';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { LikeEntity } from 'src/entity/like.entity';
import { CreateRecipeDTO } from './create-recipe.dto';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeFindQueryType } from './find-query.type';
import { getLowerStringFromObject } from 'src/helpers/tools';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly alternativeIngredientRepository: AlternativeIngredientRepository,
  ) {}

  async find(query: RecipeFindQueryType) {
    const searchValue: string = getLowerStringFromObject(query.searchValue);

    const recipes = await this.recipeRepository
      .createQueryBuilder("recipe")
      .innerJoinAndSelect("recipe.likes", "likes")
      .innerJoinAndSelect("likes.user", "user")
      .innerJoin("recipe.ingredients", "ingredientsSearch")
      .innerJoinAndSelect("recipe.ingredients", "ingredients")
      .innerJoinAndSelect("recipe.alternativeIngredients", "alternativeIngredients")
      .innerJoinAndSelect("alternativeIngredients.ingredient", "ingredient")
      .innerJoinAndSelect("alternativeIngredients.ingredientAlternative", "ingredientAlternative")
      .where('LOWER(recipe.name) LIKE :search OR LOWER(ingredientsSearch.name) LIKE :search', {
        search: `%${searchValue}%`,
      })
      .getMany();

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
        'steps',
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

  async create(data: CreateRecipeDTO, user: UserEntity) {
    const createdRecipe = this.recipeRepository.create({
      name: data.name,
      photo: data.photo,
      complexity: data.complexity,
      ingredients: data.ingredients,
      description: data.description,
      user,
    });

    const savedRecipe = await this.recipeRepository.save(createdRecipe);
    await Promise.all(
      R.compose(
        R.map(
          async (alternativeIngredient: {
            ingredients: IngredientEntity[];
            ingredientId: string;
          }) => {
            const { ingredients, ingredientId } = alternativeIngredient;
            await Promise.all(
              R.map(async ingredient => {
                const alternativeIngredientCreated = this.alternativeIngredientRepository.create(
                  {
                    recipe: savedRecipe,
                    ingredient: { id: ingredientId },
                    ingredientAlternative: ingredient,
                  },
                );

                await this.alternativeIngredientRepository.save(
                  alternativeIngredientCreated,
                );
              })(ingredients),
            );
          },
        ),
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
      )(data.alternativeIngredients),
    );

    const currentRecipe = await this.recipeRepository.findOne(savedRecipe.id, {
      relations: [
        'likes',
        'likes.user',
        'ingredients',
        'alternativeIngredients',
        'alternativeIngredients.ingredient',
        'alternativeIngredients.ingredientAlternative',
      ],
    });

    return this.filterLikes(currentRecipe);
  }
}
