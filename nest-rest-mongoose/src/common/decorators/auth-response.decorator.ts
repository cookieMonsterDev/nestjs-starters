import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthResponse = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auth = request.user as any;
    return auth;
  },
);
