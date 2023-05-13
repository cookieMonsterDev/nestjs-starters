import { Injectable } from '@nestjs/common';
import { SignIn } from './dto/sign-in.dto';
import { SignUp } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(body: SignUp) {
    try {
      const user = await this.usersRepository.create({
        ...body
      });

      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      throw new error();
    }
  }

  async login(body: SignIn) {}
}
