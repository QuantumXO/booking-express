export enum JwtTokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export type AccessTokenPayload = {
  sub: string; // userId
  email: string;
  type: JwtTokenTypes.ACCESS;
};

export type RefreshTokenPayload = {
  sub: string; // userId
  sid: string; // sessionId
  type: JwtTokenTypes.REFRESH;
};
