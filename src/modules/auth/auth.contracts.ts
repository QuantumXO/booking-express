export type PublicUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
};
