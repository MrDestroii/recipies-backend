import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from 'src/entity/user.entity';
import CreateUserDTO from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  private saltRounds = 10;

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async create(createData: CreateUserDTO): Promise<UserEntity> {
    createData.password = await this.getHash(createData.password);
    const createdUserEntity = this.userRepository.create(createData);
    const createdUser = await this.userRepository.save(createdUserEntity);

    return createdUser;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const findedUser = await this.userRepository.findByEmail(email);
    return findedUser;
  }

  async getHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
