import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateUserInput, LoginInput } from './dto';


@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  createAuth(@Args('createUserInput') createUserInput: CreateUserInput) {
    return 
  }

  @Mutation(() => Auth)
  updateAuth(@Args('loginInput') loginInput: LoginInput) {
    return
  }
}
