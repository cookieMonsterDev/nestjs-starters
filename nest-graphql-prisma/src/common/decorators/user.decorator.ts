import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from 'src/auth/entities/auth.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as Auth;
  },
);