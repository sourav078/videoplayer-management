import { Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { permissionGroupSearchAbleFields } from './permission_group.constant';
import {
  IPermission_group,
  IPermissionFilter,
} from './permission_group.interface';

// create permission_group
const createPermissionGroup = async (
  payload: IPermission_group,
): Promise<IPermission_group> => {
  //  if payload.length is getter then 62 then throw error
  if (payload.name.length > 191) {
    throw new ApiError(
      400,
      'Permission Group name length should be less than 191',
    );
  }

  // check if permission_group already exists
  const permission_groupExists = await prisma.permissionGroup.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (permission_groupExists) {
    throw new ApiError(400, 'Permission Group already exists');
  }

  const permission_group = await prisma.permissionGroup.create({
    data: payload,
  });
  return permission_group;
};

// get all permission_group
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
      OR: permissionGroupSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.PermissionGroupWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const permission_group = await prisma.permissionGroup.findMany({
    where: whereConditions,
    include: {
      _count: {
        select: { permission: true },
      },
      permission: true,
    },
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: 'desc',
          },
    skip,
    take: limit,
  });

  const total = await prisma.permissionGroup.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: permission_group,
  };
};

// get single permission_group
const getSinglePermissionGroup = async (
  id: string,
): Promise<IPermission_group | null> => {
  const permission_group = await prisma.permissionGroup.findUnique({
    where: {
      id,
    },
  });
  if (!permission_group) {
    throw new ApiError(404, 'Permission Group not found');
  }

  return permission_group;
};

// update permission_group
const updatePermissionGroup = async (
  id: string,
  payload: IPermission_group,
): Promise<IPermission_group | null> => {
  // find permission_group
  const singlePermission_group = await prisma.permissionGroup.findUnique({
    where: {
      id,
    },
  });

  if (!singlePermission_group) {
    throw new ApiError(404, 'Permission Group not found');
  }

  // check if permission_group already exists and id is not same
  const permission_groupExists = await prisma.permissionGroup.findFirst({
    where: {
      name: payload.name,
      NOT: {
        id,
      },
    },
  });

  if (permission_groupExists) {
    throw new ApiError(400, 'Permission Group already exists');
  }

  //  if payload.length is getter then 191 then throw error

  if (payload.name.length > 191) {
    throw new ApiError(
      400,
      'Permission Group name length should be less than 191',
    );
  }

  const permission_group = await prisma.permissionGroup.update({
    where: {
      id,
    },
    data: payload,
  });
  return permission_group;
};

// delete permission_group
const deletePermissionGroup = async (
  id: string,
): Promise<IPermission_group> => {
  // find permission_group
  const singlePermission_group = await prisma.permissionGroup.findUnique({
    where: {
      id,
    },
  });

  if (!singlePermission_group) {
    throw new ApiError(404, 'Permission Group not found');
  }

  await prisma.permission.deleteMany({
    where: {
      group_id: id,
    },
  });

  const permission_group = await prisma.permissionGroup.delete({
    where: {
      id,
    },
  });
  return permission_group;
};

export const PermissionGroupService = {
  createPermissionGroup,
  getAllPermissionGroup,
  getSinglePermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
};
