import { IsNotEmpty, IsUrl, IsNumber, Max, Min } from 'class-validator';
import { IngredientEntity } from 'src/entity/ingredient.entity';

export type CreateAlternativeIngredients = {
  [key: string]: IngredientEntity[];
};

export class CreateRecipeDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsUrl()
  readonly photo: string;

  @IsNumber()
  @Max(10)
  @Min(1)
  complexity: number;

  @IsNotEmpty()
  ingredients: IngredientEntity[];

  @IsNotEmpty()
  alternativeIngredients: CreateAlternativeIngredients;
}
