import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {

  constructor(
    private database: DatabaseService
  ) {}

  async signIn({ email, password }: SignInDto): Promise<User> {
    try {
      const user = await this.database.user.findFirstOrThrow({ where: { email }})
      const isSame = await bcrypt.compare(password, user.hash);
      if(!isSame) throw new UnauthorizedException()
      return user
    }
    catch (error) {
      throw error
    }
  }

  
  async signUp({ email, password }: SignUpDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const user = await this.database.user.create({ data: { email, hash }});
      return user
    }
    catch (error) {
      console.log(error)
      throw error
    }
  }
}
