import { PublicUserDto } from '../users/users.dto';

export type AuthResponseDto = {
  user: PublicUserDto;
  accessToken: string;
};

export type AccessTokenResponseDto = {
  accessToken: string;
};
