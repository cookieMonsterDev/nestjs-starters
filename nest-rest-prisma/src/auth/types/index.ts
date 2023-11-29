export interface JwtPayload {
  userId: number;
  email: string;
}

export interface UpdateRefreshTokenPayload {
  userId: number;
  refresh_token: string;
}
