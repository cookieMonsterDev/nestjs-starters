import { UserDocument } from "src/user/schema/user.schema";

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type PublicUser = Omit<UserDocument, 'hash'>;
