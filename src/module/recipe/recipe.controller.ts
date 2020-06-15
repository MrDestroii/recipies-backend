import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';

import { UserReq } from 'src/decorators/user.decorator'

import { RecipeService } from './recipe.service';

import { CreateRecipeDTO } from './create-recipe.dto'
import { RecipeEntity } from 'src/entity/recipe.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeFindQueryType } from './find-query.type';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService){}
  @Get()
  find(@Query() query: RecipeFindQueryType ) {
    return this.recipeService.find(query)
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
