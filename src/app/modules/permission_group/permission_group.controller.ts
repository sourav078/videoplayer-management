import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PermissionGroupService } from './permission_group.service';
import { Request, Response } from 'express';
import { IPermissionFilter } from './permission_group.interface';
import { permissionGroupFilterableFields } from './permission_group.constant';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

// create permission_group
const createPermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const { ...permission_groupData } = req.body;
    const result =
      await PermissionGroupService.createPermissionGroup(permission_groupData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Permission Group created successfully!',
      data: result,
    });
  },
);

// get all permission_group
const getAllPermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const filters: IPermissionFilter = pick(
      req.query,
      permissionGroupFilterableFields,
    );

    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result = await PermissionGroupService.getAllPermissionGroup(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission Group fetched successfully!',
      data: result,
    });
  },
);

// get single permission_group
const getSinglePermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PermissionGroupService.getSinglePermissionGroup(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission Group fetched successfully!',
      data: result,
    });
  },
);

// update permission_group
const updatePermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...permission_groupData } = req.body;
    const result = await PermissionGroupService.updatePermissionGroup(
      id,
      permission_groupData,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission Group updated successfully!',
      data: result,
    });
  },
);

// delete permission_group

const deletePermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PermissionGroupService.deletePermissionGroup(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission Group deleted successfully!',
      data: result,
    });
  },
);

export const PermissionGroupController = {
  createPermissionGroup,
  getAllPermissionGroup,
  getSinglePermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
};
