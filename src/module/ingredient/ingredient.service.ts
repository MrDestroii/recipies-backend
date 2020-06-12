import { Injectable } from '@nestjs/common';

import * as R from 'ramda';

import { IngredientRepository } from './ingredient.repository';
import { IngredientEntity } from 'src/entity/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  find(query: { name: string }): Promise<IngredientEntity[]> {
    return this.ingredientRepository
      .createQueryBuilder()
      .where('LOWER(name) LIKE :title', { title: `%${R.or(query.name, '')}%` })
      .take(10)
      .getMany();
  }
}
