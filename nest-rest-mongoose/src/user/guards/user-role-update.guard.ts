import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Injectable()
export class UserRoleUpdateGuard extends JwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { user, body } = req;
    console.log(user, body);

    if (!('role' in body)) return true;

    if ('role' in body && user.role === 'ADMIN') return true;

    return false;
  }
}