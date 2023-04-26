import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types';

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user;
  },
);
