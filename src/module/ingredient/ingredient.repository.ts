import { EntityRepository, Repository } from 'typeorm';
import { IngredientEntity } from 'src/entity/ingredient.entity';

@EntityRepository(IngredientEntity)
export class IngredientRepository extends Repository<IngredientEntity> {}
