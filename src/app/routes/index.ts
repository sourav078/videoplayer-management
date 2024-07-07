import express from 'express';
import { AuthRoutes } from '../modules/user/user.routes';
import { PermissionGroupRoutes } from '../modules/permission_group/permission_group.route';
import { PermissionRoute } from '../modules/permission/permission.route';
import { UserRoleRoute } from '../modules/UserRole/UserRole.route';
import { UserRoutes } from '../modules/user-managment/user-managment.route';
import {youtubeRouter} from "../modules/youtube/youtube.route";


const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/permission-group',
    routes: PermissionGroupRoutes,
  },
  {
    path: '/permission',
    routes: PermissionRoute,
  },
  {
    path: '/user-role',
    routes: UserRoleRoute,
  },
  {
    path: '/user',
    routes: UserRoutes,
  },
  {
    path: '/youtube',
    routes: youtubeRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
