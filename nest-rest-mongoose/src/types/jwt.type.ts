import { UserDocument } from "src/user/schema/user.schema";

export type JwtPayload = Omit<UserDocument, 'hash'>;