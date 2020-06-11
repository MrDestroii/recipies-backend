import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { Exclude, classToPlain } from 'class-transformer';

import { BaseEntity } from './base.entity';

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

  toJSON() {
    return classToPlain(this);
  }
}
