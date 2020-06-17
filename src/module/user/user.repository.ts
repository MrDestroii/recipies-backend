import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findByEmail(email: string) {
    const user = await this.findOne(null, {
      select: ['name', 'email', 'id', 'password'],
      where: {
        email,
      },
    });

    if (user) {
      return user;
    } else {
      throw new HttpException(
        `User with email: ${email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
