import { User } from "src/user/schema/user.schema";

export type JwtPayload = Omit<User, 'hash'>;