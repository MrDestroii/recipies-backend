import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { AlternativeIngredientEntity } from './alternative-ingredient.entity';

@Entity('ingredient')
export class IngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @OneToMany(type => AlternativeIngredientEntity, alternativeIngredient => alternativeIngredient.ingredient)
  alternativeIngredients: AlternativeIngredientEntity[]
}