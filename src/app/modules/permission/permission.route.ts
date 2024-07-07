import express from 'express';
import { PermissionController } from './permission.controller';

const router = express.Router();

// create permission
router.post('/', PermissionController.createPermissionGroup);
// get all permission
router.get('/', PermissionController.getAllPermissionGroup);
// get single permission
router.get('/:id', PermissionController.getSinglePermissionGroup);
// update permission
router.patch('/:id', PermissionController.updatePermissionGroup);
// delete permission
router.delete('/:id', PermissionController.deletePermissionGroup);

export const PermissionRoute = router;
