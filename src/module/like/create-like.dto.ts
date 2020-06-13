import { IsNotEmpty } from 'class-validator';

export class CreateLikeDTO {
  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  readonly recipeId: string;
}
