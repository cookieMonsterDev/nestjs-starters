import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRoles } from '../types/roles';

export class Registerdto {
  @IsOptional()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/(?=.*?[A-Z])/, {
    message: 'password must have at least 1 upper case letter',
  })
  @Matches(/(?=.*?[a-z])/, {
    message: 'password must have at least 1 lower case letter',
  })
  @Matches(/(?=.*?[0-9])/, {
    message: 'password must have at least 1 number',
  })
  @Matches(/(?=.*?[#?!@$%^_&*-])/, {
    message: 'password must have at least 1 special character',
  })
  @Matches(/^\S*$/, {
    message: 'password must have no spaces',
  })
  password: string;

  @IsOptional()
  @IsString()
  firstName: string = null;

  @IsOptional()
  @IsString()
  lastName: string = null;

  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles = UserRoles.USER;
}
