import { User } from 'src/user/entities/user.entity';

export type PublicUser = Omit<User, 'hash'>;
