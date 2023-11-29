import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthType } from './types';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from 'src/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create({ password, ...rest }: CreateUserDto): Promise<AuthType> {
    try {
      const password_hash = await this.generatePassword(password);

      const user = await this.prisma.user.create({
        data: {
          hash: password_hash,
          ...rest,
        },
      });
      const { hash, ...other } = user;

      const token = await this.generateToken({ ...other });

      return { user: { ...other }, token };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginUserDto): Promise<AuthType> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) throw new NotFoundException('Invalid credentials.');

      const passwordMatches = await this.comparePasswords(password, user.hash);
      if (!passwordMatches)
        throw new UnauthorizedException('Invalid credentials.');

      const { hash, ...rest } = user;

      const token = await this.generateToken({ ...rest });

      return { user: { ...rest }, token };
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
