import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/auth/dto';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
