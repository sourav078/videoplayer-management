import httpStatus from 'http-status';

import { PrismaClient, User, Provider } from '@prisma/client';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt, { compare } from 'bcrypt';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  ISocialSignIn,
} from './user.interface';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const prisma = new PrismaClient();

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const {
    email: userEmail,
    password,
    mobile_number: userMobileNumber,
  } = payload;
  // Using Static Methods
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: userEmail }, { mobile_number: userMobileNumber }],
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      provider: true,
      password: true,
      mobile_number: true,
      roles: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  if (
    isUserExist?.email &&
    isUserExist?.provider &&
    isUserExist?.provider !== Provider.credentials
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already in use with ${isUserExist.provider} provider! Please try with ${isUserExist.provider}.`,
    );
  }

  //Check User match Password
  if (
    isUserExist?.password &&
    !(await compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //Create JWT token
  const { id, email, mobile_number } = isUserExist;

  const rolesPermissions =
    isUserExist?.roles?.flatMap(role => role.permissions) || [];
  const allPermissions = [
    ...rolesPermissions,
    ...(isUserExist?.permissions || []),
  ];

  const accessToken = jwtHelpers.createToken(
    { id, email, mobile_number, permissions: allPermissions },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    email: isUserExist.email,
    first_name: isUserExist.first_name,
    last_name: isUserExist?.last_name ?? '',
  };
};

// admin login

const adminLogin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const {
    email: userEmail,
    password,
    mobile_number: userMobileNumber,
  } = payload;

  // Using Static Methods
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: userEmail }, { mobile_number: userMobileNumber }],
    },
    include: {
      roles: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      permissions: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  // check if user.roles not includes 'admin' or "super_admin" role then throw error. user.roles is an array of roles,check its name

  if (
    !isUserExist.roles?.some(role => role.name === 'admin') &&
    !isUserExist.roles?.some(role => role.name === 'super_admin')
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
  }

  if (
    isUserExist?.email &&
    isUserExist?.provider &&
    isUserExist?.provider !== Provider.credentials
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already in use with ${isUserExist.provider} provider! Please try with ${isUserExist.provider}.`,
    );
  }

  //Check User match Password
  if (
    isUserExist?.password &&
    !(await compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //Create JWT token
  const { id, email, mobile_number } = isUserExist;

  const rolesPermissions =
    isUserExist?.roles?.flatMap(role => role.permissions) || [];
  const allPermissions = [
    ...rolesPermissions,
    ...(isUserExist?.permissions || []),
  ];

  const accessToken = jwtHelpers.createToken(
    { id, email, mobile_number, permissions: allPermissions },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    email: isUserExist.email,
    first_name: isUserExist.first_name,
    last_name: isUserExist?.last_name ?? '',
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  if (!token) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Token is required!');
  }

  const decodeToken = jwtHelpers.decodeToken(token);
  // console.log('decodeToken', decodeToken);

  const { id, email, roles, name, mobile_number } = decodeToken;

  if (!id || !email || !roles || !name || !mobile_number) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token!');
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { mobile_number: mobile_number }],
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  // Create new Access Token
  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,

      email: isUserExist.email,
      // role: isUserExist.role,
      mobile_number: isUserExist.mobile_number,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const socialSignIn = async (
  payload: ISocialSignIn,
): Promise<
  Partial<User> & {
    accessToken: string;
  }
> => {
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,

      roles: true,

      provider: true,
    },
  });

  if (
    user &&
    user.email === payload.email &&
    user.provider !== payload.provider
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already in use with ${user.provider} provider! Please try with ${user.provider}`,
    );
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        mobile_number: payload.mobile_number,
        provider: payload.provider,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,

        roles: true,

        provider: true,
      },
    });
  }

  //Create JWT token
  const { id, email, roles } = user;

  const accessToken = jwtHelpers.createToken(
    { id, email, roles },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    ...user,
    accessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // Checking User is exist or not by Using Static Methods
  const isUserExist = await prisma.user.findUnique({
    where: { email: user?.email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  //Check User match Password
  if (
    isUserExist?.password &&
    !(await compare(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect!');
  }

  // Hashed Password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  // Update User Password
  const updatedData = {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  };

  await prisma.user.update({
    where: { email: user?.email },
    data: updatedData,
  });
};

const getUser = async (
  user: JwtPayload | null,
): Promise<Partial<User> | null> => {
  // Checking User is exist or not by Using Static Methods
  const result = await prisma.user.findUnique({
    where: { email: user?.userEmail },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      roles: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      password: false, // Include password if needed
      permissions: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }
  return result;
};

const logout = async (
  refreshToken: string,
): Promise<JwtPayload | undefined> => {
  const verifiedToken = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret,
  );

  const { email } = verifiedToken;
  // Checking User is exist or not by Using Static Methods
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }
  return verifiedToken;
};

export const AuthService = {
  loginUser,
  socialSignIn,
  refreshToken,
  changePassword,
  getUser,
  logout,
  adminLogin,
};
