import { Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IPermissionFilter } from '../permission_group/permission_group.interface';
import { permissionSearchAbleFields } from './permission.constant';
import { IPermission } from './permission.interface';

// create permission
const createPermissionGroup = async (payload: IPermission) => {
  // check payload.name is unique or not
  const permission = await prisma.permission.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (permission) {
    throw new Error('Already permission exists with this name');
  }

  const result = await prisma.permission.create({
    data: payload,
  });

  // after creating permission, automatically assign this permission to super_admin
  const superAdminRole = await prisma.userRole.findFirst({
    where: {
      name: 'super_admin',
    },
  });

  if (!superAdminRole) {
    await prisma.userRole.create({
      data: {
        name: 'super_admin',
      },
    });
  }

  if (superAdminRole) {
    await prisma.permission.update({
      where: {
        id: result.id,
      },
      data: {
        roles: {
          connect: {
            id: superAdminRole.id,
          },
        },
      },
    });
  }

  return result;
};

// get all permission
const getAllPermissionGroup = async (
  filters: IPermissionFilter,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // search by name

  if (searchTerm) {
    andConditions.push({
      OR: permissionSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.PermissionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.permission.findMany({
    where: whereConditions,
    include: {
      group: true,
      roles: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.permission.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single permission
const getSinglePermissionGroup = async (id: string) => {
  const result = await prisma.permission.findUnique({
    where: {
      id,
    },
    include: {
      group: true,
      roles: true,
    },
  });

  if (!result) {
    throw new Error('Permission not found');
  }

  return result;
};

// update permission

const updatePermissionGroup = async (id: string, payload: IPermission) => {
  // find permission
  const permission = await prisma.permission.findUnique({
    where: {
      id,
    },
  });

  // check if permission exists
  if (!permission) {
    throw new Error('Permission not found');
  }

  const result = await prisma.permission.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// delete permission

const deletePermissionGroup = async (id: string) => {
  // find permission
  const permission = await prisma.permission.findUnique({
    where: {
      id,
    },
  });

  // check if permission exists
  if (!permission) {
    throw new Error('Permission not found');
  }

  const result = await prisma.permission.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PermissionService = {
  createPermissionGroup,
  getAllPermissionGroup,
  getSinglePermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
};
