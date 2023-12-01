import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { exclude } from 'src/common/utils';
import * as bcrypt from 'bcrypt';
import { JwtPayload, PublicUser } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    try {
      const users = await this.usersRepository.find({});

      const mapped_users = users.map((e) => exclude(e, ['hash']) as PublicUser);

      return mapped_users;
    } catch (error) {
      throw error;
    }
  }

  async findOneById(userId: string): Promise<PublicUser> {
    try {
      const { hash, ...rest } = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

      return { ...rest };
    } catch (error) {
      throw error;
    }
  }

  async updateOneById(userId: string, { password, ...rest }: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) throw new NotFoundException('User not found');

      let hash = user.hash;
      if (password) {
        const passwordMatches = await this.comparePasswords(password, hash);

        if (passwordMatches)
          throw new BadRequestException("Can't use the same password");

        hash = await this.generatePassword(password);
      }

      const updatedUser: User = {...user, hash, ...rest}

      const newUser = await this.usersRepository.save(updatedUser);

      const { hash: newUserHash, ...newRest } = newUser;

      const token = await this.generateToken({ ...newRest });

      return { user: { ...newRest }, token };
    } catch (error) {
      throw error;
    }
  }

  async removeOneById(userId: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) throw new NotFoundException('User not found');

      await this.usersRepository.delete(user);
    } catch (error) {
      throw error;
    }
  }

  private async generatePassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  private async comparePasswords(
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      const res = await bcrypt.compare(password, hash);
      return res;
    } catch (error) {
      throw error;
    }
  }

  private async generateToken(payload: JwtPayload) {
    try {
      const token = await this.jwt.signAsync(payload, {
        secret: this.configService.get('AUTH_TOKEN_SECRET'),
        expiresIn: '15m',
      });

      return token;
    } catch (error) {
      throw error;
    }
  }
}

