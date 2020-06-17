import { Controller, Get, Param, Post, Body, Query, UseGuards, UsePipes, ValidationPipe, Patch } from '@nestjs/common';

import { UserReq } from 'src/decorators/user.decorator'

import { RecipeService } from './recipe.service';

import { CreateRecipeDTO } from './dto/create-recipe.dto'
import { RecipeEntity } from 'src/entity/recipe.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeFindQueryType } from './find-query.type';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UpdateRecipeDTO } from './dto/update-recipe.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() data: CreateRecipeDTO, @UserReq() user: UserEntity): Promise<RecipeEntity> {
    return this.recipeService.create(data, user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id:string, @Body() data: UpdateRecipeDTO): any {
    return this.recipeService.update(id, data)
  }
}
