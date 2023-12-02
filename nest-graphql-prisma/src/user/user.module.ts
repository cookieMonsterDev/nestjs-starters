import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserResolver, UserService, JwtService],
})
export class UserModule {}
