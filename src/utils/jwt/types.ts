export type AccessTokenPayload = {
  sub: string; // userId
  email: string;
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string; // userId
  sid: string; // sessionId
  type: 'refresh';
};
