import { Injectable } from '@nestjs/common';

import * as R from 'ramda';

import { IngredientRepository } from './ingredient.repository';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { CreateIngredientDTO } from './create-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  find(query: { name: string }): Promise<IngredientEntity[]> {
    const nameLike: string = R.compose(R.toLower, R.or(''))(query.name);
    return this.ingredientRepository
      .createQueryBuilder()
      .where('LOWER(name) LIKE :title', {
        title: `%${nameLike}%`,
      })
      .take(10)
      .getMany();
  }

  create(data: CreateIngredientDTO): Promise<IngredientEntity> {
    const createdIngredient = this.ingredientRepository.create(data);
    return this.ingredientRepository.save(createdIngredient);
  }
}
