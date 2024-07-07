import express from 'express';
import { UserRoleController } from './UserRole.controller';
const router = express.Router();

// import controller

// create user role
router.post('/', UserRoleController.createUserRole);
// get all user role
router.get('/', UserRoleController.getAllUserRole);
// get single user role
router.get('/:id', UserRoleController.getSingleUserRole);
// update user role
router.patch('/:id', UserRoleController.updateUserRole);
// delete user role
router.delete('/:id', UserRoleController.deleteUserRole);

export const UserRoleRoute = router;
