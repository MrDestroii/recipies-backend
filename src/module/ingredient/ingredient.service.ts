import { Injectable } from '@nestjs/common';

import { IngredientEntity } from 'src/entity/ingredient.entity';
import { getLowerStringFromObject } from 'src/helpers/tools';
import { IngredientRepository } from './ingredient.repository';
import { CreateIngredientDTO } from './create-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  find(query: { name: string }): Promise<IngredientEntity[]> {
    const nameLike: string = getLowerStringFromObject(query.name);
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
