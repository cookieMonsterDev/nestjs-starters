import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthType } from './types';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from 'src/types/jwt.type';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create({ password, ...rest }: CreateUserDto): Promise<AuthType> {
    try {
      const password_hash = await this.generatePassword(password);

      const newUserModel = new this.userModel({
        hash: password_hash,
        ...rest,
      });

      const user = await newUserModel.save();

      const { hash, ...other } = user.toObject();

      const token = await this.generateToken({ ...other });

      return { user: { ...other }, token };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }: LoginUserDto): Promise<AuthType> {
    try {
      const user = await this.userModel.findOne({ where: { email } });

      if (!user) throw new NotFoundException('Invalid credentials.');

      const passwordMatches = await this.comparePasswords(password, user.hash);
      if (!passwordMatches)
        throw new UnauthorizedException('Invalid credentials.');

      const { hash, ...rest } = user.toObject();

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
