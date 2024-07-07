import express from 'express';
import { PermissionGroupController } from './permission_group.controller';

const router = express.Router();

// create permission_group
router.post('/', PermissionGroupController.createPermissionGroup);
// get all permission_group
router.get('/', PermissionGroupController.getAllPermissionGroup);
// get single permission_group
router.get('/:id', PermissionGroupController.getSinglePermissionGroup);
// update permission_group
router.patch('/:id', PermissionGroupController.updatePermissionGroup);
// delete permission_group
router.delete('/:id', PermissionGroupController.deletePermissionGroup);

export const PermissionGroupRoutes = router;
