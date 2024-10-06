import { User } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<User[]> {
    return this.database.user.findMany()
  }

  async findOne(id: number): Promise<User> {
    return this.database.user.findFirstOrThrow({ where: { id }})
  }
}
