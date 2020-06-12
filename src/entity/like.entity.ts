import {
  PrimaryGeneratedColumn,
  Entity,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { RecipeEntity } from './recipe.entity';

@Entity('like')
export class LikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  user: UserEntity;

  @ManyToOne(type => RecipeEntity, recipe => recipe.likes)
  recipe: RecipeEntity
}
