import { Types } from "mongoose";
import { User, UserDocument } from "src/user/schema/user.schema";

export type JwtPayload = Omit<User & { _id: Types.ObjectId }, 'hash'>;