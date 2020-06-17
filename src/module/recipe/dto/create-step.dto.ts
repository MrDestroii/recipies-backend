import { IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateStepDTO {
  @IsNumber()
  @Min(0)
  position: number;

  @IsNotEmpty()
  text: string;
}
