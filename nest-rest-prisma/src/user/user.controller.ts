import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards';
import { UserOrAdminGuard, UserRoleUpdateGuard } from './guards';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findOneById(userId);
  }

  @UseGuards(JwtGuard, UserRoleUpdateGuard, UserOrAdminGuard)
  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateOneById(userId, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.userService.removeOneById(userId);
  }
}
