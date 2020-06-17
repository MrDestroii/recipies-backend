import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from 'typeorm';

import { BaseEntity } from './base.entity';
import { RecipeEntity } from './recipe.entity';

@Entity('step')
export class StepEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  text: string;

  @Column('int')
  position: number;

  @ManyToOne(
    type => RecipeEntity,
    recipe => recipe.steps,
  )
  recipe: RecipeEntity;
}
