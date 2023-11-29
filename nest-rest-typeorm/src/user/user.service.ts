import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    try {
      const users = await this.usersRepository.find();

      console.log(users);

      return users;
    } catch (error) {
      throw new error();
    }
  }

  async findOneById(id: string) {
    try {
      console.log(id)
      const user = await this.usersRepository.findOneOrFail({ where: { id } });

      return user;
    } catch (error) {
      console.log(error)
      throw new error();
    }
  }
}
