import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Request,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalGuard } from './guards/local.guard';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login(@Body() _loginDto: LoginDto, @Request() req) {
    return req.user;
  }

  @Put('refresh')
  refresh() {
    return 'refresh';
  }

  // @UseGuards(JwtGuard)
  @Put('logout/:userId')
  logout(@Param() userId: number) {
    return 'logout';
  }
}
