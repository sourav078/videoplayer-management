import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user-managment.controller';
import { UserValidation } from './user-managment.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  // auth('users.create'),
  UserController.createUser,
);
router.get('/', auth('users.view'), UserController.getAllUsers);
router.get('/:id', auth('users.view'), UserController.getSingleUser);
router.get('/email/:email', UserController.getSingleUserByEmail);

router.patch('/:id', auth('users.update'), UserController.updateUser);

router.delete('/:id', auth('users.delete'), UserController.deleteUser);

export const UserRoutes = router;
