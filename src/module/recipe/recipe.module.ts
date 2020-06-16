import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { AlternativeIngredientEntity } from 'src/entity/alternative-ingredient.entity';
import { RecipeRepository } from './repository/recipe.repository';
import { IngredientRepository } from '../ingredient/ingredient.repository';
import { AlternativeIngredientRepository } from './repository/alternative-igredient.repository';
import { StepRepository } from './repository/step.repository';
import { StepEntity } from 'src/entity/step.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeEntity,
      IngredientEntity,
      AlternativeIngredientEntity,
      StepEntity,
      RecipeRepository,
      IngredientRepository,
      AlternativeIngredientRepository,
      StepRepository
    ]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
