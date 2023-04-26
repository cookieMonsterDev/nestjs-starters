import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { JwtPayload, UpdateRefreshTokenPayload } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register({ password, ...rest }: RegisterDto) {
    try {
      const hash = await argon.hash(password);

      const { id, email, ...other } = await this.prisma.user.create({
        data: {
          ...rest,
          hash,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const { access_token, refresh_token } = await this.getTokens({
        userId: id,
        email: email,
      });

      await this.updateRefreshTokenHash({ userId: id, refresh_token });

      return { id, email, ...other, access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) throw new NotFoundException('email is wrong');

      const passwordMatches = await argon.verify(user.hash, password);
      if (!passwordMatches)
        throw new ForbiddenException('email or password is wrong');

      const { access_token, refresh_token } = await this.getTokens({
        userId: user.id,
        email: email,
      });

      await this.updateRefreshTokenHash({ userId: user.id, refresh_token });

      const { id, name, ...rest } = user;

      return { id, name, email, access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }

  async refresh({ email, password }: LoginDto) {
    return '';
  }

  async logout({ email, password }: LoginDto) {
    return '';
  }

  async updateRefreshTokenHash({
    userId,
    refresh_token,
  }: UpdateRefreshTokenPayload) {
    try {
      const refresh_hash = await argon.hash(refresh_token);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refresh_hash,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  private async getTokens(payload: JwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }
}
