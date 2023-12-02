import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { UserRoles } from '@prisma/client';

registerEnumType(UserRoles, { name: 'UserRoles' });

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRoles)
  role: UserRoles;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
