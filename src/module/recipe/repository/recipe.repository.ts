import { EntityRepository, Repository } from 'typeorm';
import { RecipeEntity } from 'src/entity/recipe.entity';

@EntityRepository(RecipeEntity)
export class RecipeRepository extends Repository<RecipeEntity> {}
