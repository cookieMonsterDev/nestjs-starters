import { PublicUser } from "src/types";

export interface AuthType {
  user: PublicUser;
  token: string;
}