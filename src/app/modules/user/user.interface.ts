import { User } from '@prisma/client';

export type ISingUpUserResponse = {
  accessToken: string;
  refreshToken?: string;
  newUser: User;
};

export type ILoginUser = {
  email: string;
  password: string;
  mobile_number: string;
};

export type ISocialSignIn = {
  first_name: string;
  last_name?: string;
  image: string;
  email: string;
  mobile_number: string;
  provider: 'google' | 'facebook' | 'credentials';
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  permissions?: {
    name: string;
  }[];
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
