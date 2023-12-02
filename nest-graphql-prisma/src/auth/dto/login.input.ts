import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class LoginInput extends PickType(CreateUserInput, [
  'email',
  'password',
] as const) {}
