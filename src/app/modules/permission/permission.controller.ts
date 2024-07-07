import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { PermissionService } from './permission.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IPermissionFilter } from '../permission_group/permission_group.interface';
import pick from '../../../shared/pick';
import { permissionFilterableFields } from './permission.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

// create permission
const createPermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = await PermissionService.createPermissionGroup(body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Permission created successfully!',
      data: result,
    });
  },
);

// get all permission
const getAllPermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const filters: IPermissionFilter = pick(
      req.query,
      permissionFilterableFields,
    );

    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result = await PermissionService.getAllPermissionGroup(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission fetched successfully!',
      data: result,
    });
  },
);

// get single permission
const getSinglePermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PermissionService.getSinglePermissionGroup(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission fetched successfully!',
      data: result,
    });
  },
);

// update permission
const updatePermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    const result = await PermissionService.updatePermissionGroup(id, body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission updated successfully!',
      data: result,
    });
  },
);

// delete permission

const deletePermissionGroup = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PermissionService.deletePermissionGroup(id);

    sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: 'Permission deleted successfully!',
      data: result,
    });
  },
);

export const PermissionController = {
  createPermissionGroup,
  getAllPermissionGroup,
  getSinglePermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
};
