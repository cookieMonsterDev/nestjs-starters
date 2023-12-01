import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { JwtPayload } from 'src/types';

@Injectable()
export class UserOrAdminGuard extends JwtGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload;
    const userId = req.params.userId as string;
    return user.id === userId || user.role === 'ADMIN';
  }
}