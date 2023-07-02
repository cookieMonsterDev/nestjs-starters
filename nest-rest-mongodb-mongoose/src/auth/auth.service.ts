import { ForbiddenException, Injectable } from '@nestjs/common';
import { Registerdto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entity/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private Jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email });

      const passMatches = await argon2.verify(user.hash, password);
      if (!passMatches)
        throw new ForbiddenException('Email or password is wrong');

      const { accessToken, refreshToken } = await this.generateTokens({
        userId: user._id,
        role: user.role,
      });

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async register({ password, ...rest }: Registerdto): Promise<any> {
    try {
      const passwordHash = await argon2.hash(password);

      const user = await this.userModel.create({
        hash: passwordHash,
        ...rest,
      });

      const { accessToken, refreshToken } = await this.generateTokens({
        userId: user._id,
        role: user.role,
      });

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async refreshTokens(userId: string): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);

      const { accessToken, refreshToken } = await this.generateTokens({
        userId: user._id,
        role: user.role,
      });

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.Jwt.sign(payload, {
        secret: 'secret1',
        expiresIn: '15m',
      }),
      this.Jwt.sign(payload, {
        secret: 'secret2',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
