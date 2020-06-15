import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  find(@Query() query: { name: string }) {
    return this.ingredientService.find(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() data: CreateIngredientDTO): Promise<IngredientEntity> {
    return this.ingredientService.create(data);
  }
}
