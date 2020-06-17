import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Exclude, classToPlain } from 'class-transformer';

import { BaseEntity } from './base.entity';
import { RecipeEntity } from './recipe.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar', {
    unique: true,
  })
  email: string;

  @Column('varchar')
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(type => RecipeEntity, recipe => recipe.user)
  recipes: RecipeEntity[]

  toJSON() {
    return classToPlain(this);
  }
}
