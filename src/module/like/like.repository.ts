import { EntityRepository, Repository } from 'typeorm';
import { LikeEntity } from 'src/entity/like.entity';

@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {}
