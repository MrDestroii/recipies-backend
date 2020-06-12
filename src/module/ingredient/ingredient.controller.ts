import { Controller, Get, Query } from '@nestjs/common';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  find(@Query() query: { name: string }) {
    return this.ingredientService.find(query)
  }
}
