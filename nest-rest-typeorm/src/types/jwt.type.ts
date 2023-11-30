import { User } from "src/user/entities/user.entity";

export type JwtPayload = Omit<User, 'hash'>;