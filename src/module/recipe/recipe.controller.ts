import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { UserReq } from 'src/decorators/user.decorator'

import { RecipeService } from './recipe.service';

import { CreateRecipeDTO } from './create-recipe.dto'
import { RecipeEntity } from 'src/entity/recipe.entity';
import { UserEntity } from 'src/entity/user.entity';

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

  @Post()
  create(@Body() data: CreateRecipeDTO, @UserReq() user: UserEntity): Promise<RecipeEntity> {
    return this.recipeService.create(data, user)
  }
}
