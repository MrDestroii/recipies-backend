import { IsNotEmpty, IsUrl, IsNumber, Max, Min, IsString } from 'class-validator';
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

  @IsString()
  description: string;

  @IsNotEmpty()
  ingredients: IngredientEntity[];

  @IsNotEmpty()
  alternativeIngredients: CreateAlternativeIngredients;
}
