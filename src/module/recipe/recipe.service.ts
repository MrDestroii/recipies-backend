import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import * as R from 'ramda';

import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from '../ingredient/ingredient.repository';
import { AlternativeIngredientRepository } from './repository/alternative-igredient.repository';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { CreateRecipeDTO } from './dto/create-recipe.dto';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeFindQueryType } from './find-query.type';
import { getLowerStringFromObject } from 'src/helpers/tools';
import { StepRepository } from './repository/step.repository';
import { CreateStepDTO } from './dto/create-step.dto';
import { Raw } from 'typeorm';
import { UpdateRecipeDTO } from './dto/update-recipe.dto';
import { RecipeHelper } from './recipe.helper';
import { AlternativeIngredientEntity } from 'src/entity/alternative-ingredient.entity';

@Injectable()
export class RecipeService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly alternativeIngredientRepository: AlternativeIngredientRepository,
    private readonly stepRepository: StepRepository,
    private readonly recipeHelper: RecipeHelper,
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
          'user',
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
      const fiilterByIngredients = this.recipeHelper.filterByIngredients(
        query.ingredients,
      );

      return R.compose(
        R.filter<RecipeEntity>(fiilterByIngredients),
        R.map<RecipeEntity, RecipeEntity>(this.recipeHelper.filterLikes),
      )(recipes);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async get(id: string) {
    try {
      const recipe: RecipeEntity = await this.recipeRepository.findOneOrFail(
        id,
        {
          relations: [
            'likes',
            'likes.user',
            'ingredients',
            'alternativeIngredients',
            'alternativeIngredients.ingredient',
            'alternativeIngredients.ingredientAlternative',
            'steps',
            'user'
          ],
        },
      );

      return this.recipeHelper.filterLikes(recipe);
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async create(data: CreateRecipeDTO, user: UserEntity) {
    const alternativeIngredients = R.compose(
      R.map(
        (alternativeIngredient: {
          ingredients: IngredientEntity[];
          ingredientId: string;
        }) => {
          const { ingredients, ingredientId } = alternativeIngredient;
          return R.map(ingredient => {
            return this.alternativeIngredientRepository.create({
              ingredient: { id: ingredientId },
              ingredientAlternative: ingredient,
            });
          })(ingredients);
        },
      ),
      this.recipeHelper.parseRequestAlternativeIngredients,
    )(data.alternativeIngredients);

    const createdRecipe = this.recipeRepository.create({
      name: data.name,
      photo: data.photo,
      complexity: data.complexity,
      ingredients: data.ingredients,
      description: data.description,
      user,
      alternativeIngredients: R.flatten(alternativeIngredients),
    });

    const savedRecipe = await this.recipeRepository.save(createdRecipe);

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

    return this.recipeHelper.filterLikes(currentRecipe);
  }

  async update(id: string, data: UpdateRecipeDTO) {
    try {
      const currentRecipe = await this.recipeRepository.findOneOrFail(id, {
        relations: [
          'ingredients',
          'alternativeIngredients',
          'alternativeIngredients.ingredient',
          'alternativeIngredients.ingredientAlternative',
        ],
      });

      const alternativeIngredietns: AlternativeIngredientEntity[][] = await Promise.all(
        R.compose(
          R.map(
            async (alternativeIngredient: {
              ingredients: IngredientEntity[];
              ingredientId: string;
            }) => {
              const { ingredients, ingredientId } = alternativeIngredient;
              const alternativeIngredietns: AlternativeIngredientEntity[] = await Promise.all(
                R.map(async ingredient => {
                  const currentAlternativeIngredient = await this.alternativeIngredientRepository.findOne(
                    {
                      relations: [
                        'recipe',
                        'ingredient',
                        'ingredientAlternative',
                      ],
                      where: {
                        recipe: currentRecipe,
                        ingredient: { id: ingredientId },
                        ingredientAlternative: ingredient,
                      },
                    },
                  );
                  if (R.isNil(currentAlternativeIngredient)) {
                    const alternativeIngredientCreated = this.alternativeIngredientRepository.create(
                      {
                        recipe: currentRecipe,
                        ingredient: { id: ingredientId },
                        ingredientAlternative: ingredient,
                      },
                    );

                    return alternativeIngredientCreated;
                  } else {
                    return currentAlternativeIngredient;
                  }
                })(ingredients),
              );

              return alternativeIngredietns;
            },
          ),
          this.recipeHelper.parseRequestAlternativeIngredients,
        )(data.alternativeIngredients),
      );

      const steps = await Promise.all(
        R.map((step: object) => {
          if (R.compose(R.not, R.has('id'))(step)) {
            const createdSteep = this.stepRepository.create({
              ...step,
              recipe: currentRecipe,
            });
            return this.stepRepository.save(createdSteep);
          } else {
            return step;
          }
        })(data.steps),
      );

      return this.recipeRepository.save({
        ...currentRecipe,
        name: data.name,
        photo: data.photo,
        complexity: data.complexity,
        description: data.description,
        ingredients: data.ingredients,
        alternativeIngredients: R.flatten(alternativeIngredietns),
        steps,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
