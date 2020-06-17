import { CreateRecipeDTO } from './create-recipe.dto';
import { IsNotEmpty } from 'class-validator';
import { StepEntity } from 'src/entity/step.entity';
import { CreateStepDTO } from './create-step.dto';

export class UpdateRecipeDTO extends CreateRecipeDTO {
  @IsNotEmpty()
  steps: Array<StepEntity | CreateStepDTO>;
}
