export type PublicUserDto = {
  id: string;
  email: string;
};

export type AuthResponseDto = {
  user: PublicUserDto;
  accessToken: string;
};

export type AccessTokenResponseDto = {
  accessToken: string;
};
