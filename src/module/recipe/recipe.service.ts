import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import * as R from 'ramda';

import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from '../ingredient/ingredient.repository';
import { AlternativeIngredientRepository } from './repository/alternative-igredient.repository';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { LikeEntity } from 'src/entity/like.entity';
import { CreateRecipeDTO } from './dto/create-recipe.dto';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeFindQueryType } from './find-query.type';
import { getLowerStringFromObject } from 'src/helpers/tools';
import { StepRepository } from './repository/step.repository';
import { CreateStepDTO } from './dto/create-step.dto';
import { Like, Raw } from 'typeorm';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly alternativeIngredientRepository: AlternativeIngredientRepository,
    private readonly stepRepository: StepRepository,
  ) {}

  async find(query: RecipeFindQueryType) {
    try {
      const searchValue: string = getLowerStringFromObject(query.searchValue);

      const recipes = await this.recipeRepository.find({
        relations: [
          'likes',
          'likes.user',
          'alternativeIngredients',
          'alternativeIngredients.ingredient',
          'alternativeIngredients.ingredientAlternative',
          'steps',
          'ingredients',
        ],
        join: {
          alias: 'recipe',
          innerJoin: { ingredients: 'recipe.ingredients' },
        },
        where: {
          name: Raw(
            alias =>
              `LOWER(${alias}) LIKE '%${searchValue}%' OR LOWER(ingredients.name) LIKE '%${searchValue}%'`,
          ),
        },
        order: {
          [query.orderBy]: query.orderType,
        },
      });
      const fiilterByIngredients = this.filterByIngredients(query.ingredients);

      return R.compose(
        R.filter<RecipeEntity>(fiilterByIngredients),
        R.map<RecipeEntity, RecipeEntity>(this.filterLikes),
      )(recipes);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
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

    await Promise.all(
      R.map((step: CreateStepDTO) => {
        const createdStep = this.stepRepository.create({
          ...step,
          recipe: savedRecipe,
        });
        return this.stepRepository.save(createdStep);
      })(data.steps),
    );

    const currentRecipe = await this.recipeRepository.findOne(savedRecipe.id, {
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

    return this.filterLikes(currentRecipe);
  }
}
