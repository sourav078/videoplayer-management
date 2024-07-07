/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Provider, User } from '@prisma/client';

import httpStatus from 'http-status';

import { genSalt, hash } from 'bcrypt';
import { ICreateUser, IUserFilters } from './user-managment.interface';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  userRelationalFields,
  userRelationalFieldsMapper,
  userSearchAbleFields,
} from './user-managment.constant';

const createUser = async (data: ICreateUser) => {
  const { password, email } = data;

  // check if ICreateUser any required field is missing then throw error

  const requiredFields = [
    'first_name',
    'email',
    'password',
    'roles',
    'mobile_number',
  ];

  const missingFields = requiredFields.filter(
    field => !Object.keys(data).includes(field),
  );

  if (missingFields.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${missingFields.join(', ')} is required!`,
    );
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  // Check if user already exist with same mobile number
  if (isUserExist?.mobile_number === data.mobile_number) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Mobile number is already exist!',
    );
  }

  if (
    isUserExist?.email &&
    isUserExist?.provider &&
    isUserExist?.provider !== Provider.credentials
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already use with ${isUserExist.provider} provider! Please try with ${isUserExist.provider}.`,
    );
  }

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already exist!');
  }

  const result = await prisma.user.create({
    data: {
      ...data,
      email,
      mobile_number: data.mobile_number,

      password: await hash(password, await genSalt(10)),
      roles: {
        connect: data.roles.map(roleId => ({ id: roleId })),
      },
   
    },
  });
  return result;
};

const updateUser = async (id: string, data: any) => {
  // check if user exist or not
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // if user want to update email or mobile number then check if it is already exist or not , same user can update email or mobile number

  if (data.email) {
    const isEmailExist = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (isEmailExist && isEmailExist.id !== id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already exist!');
    }
  }

  if (data.mobile_number) {
    const isMobileExist = await prisma.user.findFirst({
      where: { mobile_number: data.mobile_number },
    });

    console.log(isMobileExist, id);

    if (isMobileExist && isMobileExist.id !== id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Mobile number is already exist!',
      );
    }
  }

  // if user want to update password then hash it
  if (data.password) {
    data.password = await hash(data.password, await genSalt(10));
  }

  const result = await prisma.user.update({
    where: { id },
    data: {
      ...data,
      roles: {
        set: [],
        connect: data.roles
          ? data.roles.map((roleId: string) => ({ id: roleId }))
          : undefined,
      },
      permissions: {
        set: [],
        connect: data.permissions
          ? data.permissions.map((permissionId: string) => ({
              id: permissionId,
            }))
          : undefined,
      },
    },
  });
  return result;
};

const getSingleUser = async (id: string): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_admin: true,
      mobile_number: true,
      // UserRole: true,
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
      UserPersonalDetails: true,
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found user!');
  }
  return result;
};

// get single user by email

const getSingleUserByEmail = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_admin: true,
      mobile_number: true,
      // UserRole: true,
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
      UserPersonalDetails: true,
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found user!');
  }

  const rolesPermissions =
    result?.roles?.flatMap(role => role.permissions) || [];
  const allPermissions = [...rolesPermissions, ...(result?.permissions || [])];

  result.permissions = allPermissions;

  return result;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (userRelationalFields.includes(key)) {
          return {
            [userRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_admin: true,
      mobile_number: true,
      // UserRole: true,
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
      UserPersonalDetails: true,
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteUser = async (id: string): Promise<User> => {
  // Check if user exist or not
  const isUserExist = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check if user role is super_admin then throw error

  if (isUserExist.roles.some(role => role.name === 'super_admin')) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can not delete super admin!',
    );
  }

  const result = await prisma.user.delete({
    where: { id },
  });
  return result;
};

export const UserService = {
  createUser,
  updateUser,

  getSingleUser,
  getAllUsers,
  deleteUser,
  getSingleUserByEmail,
};
