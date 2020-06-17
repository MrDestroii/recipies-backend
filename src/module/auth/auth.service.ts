import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as R from 'ramda';

import { UserEntity } from 'src/entity/user.entity';
import { UserService } from '../user/user.service';
import CreateUserDTO from '../user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: UserEntity = await this.userService.findOneByEmail(email);
    if (await this.userService.comparePassword(pass, user.password)) {
      return user;
    } else {
      throw new HttpException('Bab Request', HttpStatus.BAD_REQUEST);
    }
  }

  async signIn(user: UserEntity) {
    const payload = { username: user.email, sub: user.password };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signUp(createData: CreateUserDTO) {
    try {
      const newUser = await this.userService.create(createData);
      return newUser;
    } catch (e) {
      if (R.compose(R.propEq('code', '23505'))(e)) {
        throw new HttpException(
          `User with email - ${createData.email} already exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Bab Request', HttpStatus.BAD_REQUEST);
    }
  }
}
