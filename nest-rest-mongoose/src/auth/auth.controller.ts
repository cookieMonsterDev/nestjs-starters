import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from 'src/common/decorators';
import { AuthType } from './types';
import { CreateUserDto } from './dto';
import { LocalGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  login(@Auth() auth: AuthType) {
    return auth;
  }
}
