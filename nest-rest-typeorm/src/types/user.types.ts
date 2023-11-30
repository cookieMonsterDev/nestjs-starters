import { User } from 'src/user/entities/user.entity';

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type PublicUser = Omit<User, 'hash'>;
