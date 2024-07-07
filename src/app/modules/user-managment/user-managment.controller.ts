import { Request, Response } from 'express';
import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import { UserService } from './user-managment.service';
import sendResponse from '../../../shared/sendResponse';
import { IUserFilters } from './user-managment.interface';
import pick from '../../../shared/pick';
import { userFilterableFields } from './user-managment.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...user } = req.body;
  const result = await UserService.createUser(user);

  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const { id } = req.params;
  const result = await UserService.updateUser(id, userData);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUser(id);
  sendResponse<Partial<User> | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'GET User successfully!',
    data: result,
  });
});

// getSingleUserByEmail

const getSingleUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await UserService.getSingleUserByEmail(email);
  sendResponse<Partial<User> | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get Single User By Email successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters: IUserFilters = pick(req.query, userFilterableFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await UserService.getAllUsers(filters, paginationOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'GET Users successfully!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUser(id);

  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const UserController = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  getSingleUserByEmail,
};
