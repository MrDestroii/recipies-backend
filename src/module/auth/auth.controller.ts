import {
  Controller,
  UseGuards,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { UserEntity } from 'src/entity/user.entity';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { AuthService } from './auth.service';
import CreateUserDTO from '../user/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() createData: CreateUserDTO) {
    return this.authService.signUp(createData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @UsePipes(new ValidationPipe({ transform: true }))
  getProfile(@Request() req: { user: UserEntity }) {
    return req.user;
  }
}
