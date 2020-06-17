import { EntityRepository, Repository } from 'typeorm';
import { StepEntity } from 'src/entity/step.entity';

@EntityRepository(StepEntity)
export class StepRepository extends Repository<StepEntity> {}