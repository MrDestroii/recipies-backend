import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/entity/user.entity';

export const UserReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity = request.user
    return user;
  },
);
