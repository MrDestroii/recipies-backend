import { IsNotEmpty } from 'class-validator';

export class CreateIngredientDTO {
  @IsNotEmpty()
  readonly name: string;
}
