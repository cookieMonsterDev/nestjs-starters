import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
