import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { JwtGuard, LocalGuard, RefreshJwtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(@Body() _loginDto: LoginDto, @GetCurrentUser() user) {
    return user;
  }

  @UseGuards(RefreshJwtGuard)
  @Put('refresh')
  refresh(@GetCurrentUser() user) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Put('logout')
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }
}
