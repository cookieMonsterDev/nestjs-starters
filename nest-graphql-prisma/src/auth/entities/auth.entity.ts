import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Auth {
  @Field((type) => User)
  user: User;

  @Field()
  token: string;
}
