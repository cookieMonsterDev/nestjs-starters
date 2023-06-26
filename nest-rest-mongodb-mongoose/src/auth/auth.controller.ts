import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthResponse, UserID } from 'src/common/decorators';
import { LocalGuard, RefreshJwtGuard } from './guards';
import { Registerdto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Auth } from '../types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signUp(@Body() body: Registerdto): Promise<Auth> {
    return this.authService.register(body);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  signIn(@Body() _body: LoginDto, @AuthResponse() auth): Promise<Auth> {
    return auth;
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  refresh(@UserID() userId): Promise<Auth> {
    return this.authService.refreshTokens(userId);
  }
}
