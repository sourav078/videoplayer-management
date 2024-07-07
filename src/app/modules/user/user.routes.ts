import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(UserValidation.loginZodSchema),
  AuthController.loginUser,
);

router.post(
  '/admin-login',
  validateRequest(UserValidation.loginZodSchema),
  AuthController.adminLogin,
);

router.post(
  '/social-signIn',
  validateRequest(UserValidation.socialSignInZodSchema),
  AuthController.socialSignIn,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

router.post(
  '/change-password',
  validateRequest(UserValidation.changePasswordZodSchema),
  AuthController.changePassword,
);

router.get(
  '/user',
 
  AuthController.getUser,
);

router.post(
  '/logout',
  AuthController.logout,
);

export const AuthRoutes = router;
