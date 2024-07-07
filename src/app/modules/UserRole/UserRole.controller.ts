

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserRoleService } from './UserRole.service';
import { Request, Response } from 'express';

// create user role
const createUserRole = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await UserRoleService.createUserRole(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User Role created successfully!',
    data: result,
  });
});

// get all user role
const getAllUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await UserRoleService.getAllUserRole();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Role fetched successfully!',
    data: result,
  });
});

// get single user role

const getSingleUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserRoleService.getSingleUserRole(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Role fetched successfully!',
    data: result,
  });
});

// update user role\

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const result = await UserRoleService.updateUserRole(id, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Role updated successfully!',
    data: result,
  });
});

// delete user role

const deleteUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserRoleService.deleteUserRole(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Role deleted successfully!',
    data: result,
  });
});

export const UserRoleController = {
    createUserRole,
    getAllUserRole,
    getSingleUserRole,
    updateUserRole,
    deleteUserRole,
    };
