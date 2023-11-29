import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignIn } from './dto/sign-in.dto';
import { SignUp } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: SignUp) {
    return this.authService.register(body);
  }

  @Post('login')
  create(@Body() body: SignIn) {
    return this.authService.login(body);
  }
}
