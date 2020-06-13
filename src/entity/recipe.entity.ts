import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { IngredientEntity } from './ingredient.entity';
import { UserEntity } from './user.entity';
import { AlternativeIngredientEntity } from './alternative-ingredient.entity';
import { LikeEntity } from './like.entity'
import { StepEntity } from './step.entity'

@Entity('recipe')
export class RecipeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  photo: string;

  @Column('int')
  complexity: number;

  @Column("varchar", { nullable: true })
  description: string;

  @ManyToMany(type => IngredientEntity)
  @JoinTable()
  ingredients: IngredientEntity[];

  @OneToMany(type => AlternativeIngredientEntity, alternativeIngregient => alternativeIngregient.recipe)
  alternativeIngredients: AlternativeIngredientEntity[];

  @ManyToOne(type => UserEntity, user => user.recipes)
  user: UserEntity

  @OneToMany(type => LikeEntity, like => like.recipe)
  likes: LikeEntity[]

  @OneToMany(type => StepEntity, step => step.recipe)
  steps: StepEntity[]
}
