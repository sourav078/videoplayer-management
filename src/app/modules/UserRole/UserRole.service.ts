import prisma from '../../../shared/prisma';
import { IUserRole } from './UserRole.interface';

// create user role
const createUserRole = async (payload: IUserRole) => {
  // check payload.name is unique or not
  const userRoleUnique = await prisma.userRole.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (userRoleUnique) {
    throw new Error('Already user role exists with this name');
  }

  const userRoleData = {
    name: payload.name,
    permissions: {
      connect: payload.permissions.map((permission: string) => ({
        id: permission,
      })),
    },
  };

  const userRole = await prisma.userRole.create({
    data: userRoleData,
    include: {
      permissions: {
        include: {
          group: true,
          roles: true,
        },
      },
    },
  });

  return userRole;
};

// get all user role
const getAllUserRole = async () => {
  const userRole = await prisma.userRole.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      permissions: {
        include: {
          group: true,
          roles: true,
        },
      },
    },
  });
  return userRole;
};

// get single user role
const getSingleUserRole = async (id: string) => {
  const userRole = await prisma.userRole.findUnique({
    where: {
      id,
    },

    include: {
      permissions: {
        include: {
          group: true,
          roles: true,
        },
      },
    },
  });
  if (!userRole) {
    throw new Error('User Role not found');
  }

  return userRole;
};

// update user role
const updateUserRole = async (id: string, payload: IUserRole) => {
  // find user role
  const singleUserRole = await prisma.userRole.findUnique({
    where: {
      id,
    },
  });

  // if user role name is super_admin then throw error
  if (singleUserRole?.name === 'super_admin') {
    throw new Error('You can not update super_admin role');
  }

  if (!singleUserRole) {
    throw new Error('User Role not found');
  }

  const userRole = await prisma.userRole.update({
    where: {
      id,
    },
    data: {
      ...payload,
      permissions: {
        set: payload?.permissions?.map((permissionId: string) => ({
          id: permissionId,
        })),
      },
    },
    include: {
      permissions: {
        include: {
          group: true,
          roles: true,
        },
      },
    },
  });
  return userRole;
};

// delete user role

const deleteUserRole = async (id: string) => {
  // find user role
  const singleUserRole = await prisma.userRole.findUnique({
    where: {
      id,
    },
  });

  // if user role name is super_admin then throw error
  if (singleUserRole?.name === 'super_admin') {
    throw new Error('You can not delete super_admin role');
  }

  if (!singleUserRole) {
    throw new Error('User Role not found');
  }

  const userRole = await prisma.userRole.delete({
    where: {
      id,
    },
  });
  return userRole;
};

export const UserRoleService = {
  createUserRole,
  getAllUserRole,
  getSingleUserRole,
  updateUserRole,
  deleteUserRole,
};
