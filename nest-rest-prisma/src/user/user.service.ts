import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/common/utils';
import * as bcrypt from 'bcrypt';
import { JwtPayload, PublicUser } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    try {
      const users = await this.prisma.user.findMany({});

      const mapped_users = users.map((e) => exclude(e, ['hash']) as PublicUser);

      return mapped_users;
    } catch (error) {
      throw error;
    }
  }

  async findOneById(userId: string): Promise<PublicUser> {
    try {
      const { hash, ...rest } = await this.prisma.user.findFirst({
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
      const user = await this.prisma.user.findFirst({ where: { id: userId } });

      if (!user) throw new NotFoundException('User not found');

      let hash = user.hash;
      if (password) {
        const passwordMatches = await this.comparePasswords(password, hash);

        if (passwordMatches)
          throw new BadRequestException("Can't use the same password");

        hash = await this.generatePassword(password);
      }

      const newUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: { hash, ...rest },
      });

      const { hash: newUserHash, ...newRest } = newUser;

      const token = await this.generateToken({ ...newRest });

      return { user: { ...newRest }, token };
    } catch (error) {
      throw error;
    }
  }

  async removeOneById(userId: string): Promise<void> {
    try {
      await this.prisma.user.deleteMany({
        where: {
          id: userId,
        },
      });
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
