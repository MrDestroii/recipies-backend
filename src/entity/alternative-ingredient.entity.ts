import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinTable } from 'typeorm';

import { BaseEntity } from './base.entity';
import { RecipeEntity } from './recipe.entity';
import { IngredientEntity } from './ingredient.entity';

@Entity('alternativeIngredient')
export class AlternativeIngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => RecipeEntity, recipe => recipe.alternativeIngredients)
  recipe: RecipeEntity

  @ManyToOne(type => IngredientEntity, ingredient => ingredient.alternativeIngredients)
  ingredient: IngredientEntity

  @ManyToOne(type => IngredientEntity)
  @JoinTable()
  ingredientAlternative: IngredientEntity
}