import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthResponse, UserID } from 'src/common/decorators';
import { LocalGuard, RefreshJwtGuard } from './guards';
import { Registerdto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signUp(@Body() body: Registerdto): Promise<any> {
    return this.authService.register(body);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  signIn(@Body() _body: LoginDto, @AuthResponse() auth): Promise<any> {
    return auth;
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  refresh(@UserID() userId): Promise<any> {
    return this.authService.refreshTokens(userId);
  }
}
