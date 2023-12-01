import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthType } from 'src/auth/types';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthType;
  },
);