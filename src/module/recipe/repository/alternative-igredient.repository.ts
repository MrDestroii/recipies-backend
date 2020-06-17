import { EntityRepository, Repository } from 'typeorm';
import { AlternativeIngredientEntity } from 'src/entity/alternative-ingredient.entity';

@EntityRepository(AlternativeIngredientEntity)
export class AlternativeIngredientRepository extends Repository<AlternativeIngredientEntity> {}
