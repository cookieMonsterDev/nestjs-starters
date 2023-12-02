import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User)
  findOne(@Args('userId') userId: string) {
    return this.userService.findOneById(userId);
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  update(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserDto: UpdateUserInput,
  ) {
    return this.userService.updateOneById(userId, updateUserDto);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  remove(@Args('userId') userId: string) {
    return this.userService.removeOneById(userId);
  }
}
