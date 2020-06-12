import { Controller, Get, Param } from '@nestjs/common';
import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService){}
  @Get()
  find() {
    return this.recipeService.find()
  }

  @Get("/:id")
  get(@Param('id') id: string) {
    return this.recipeService.get(id)
  }
}
