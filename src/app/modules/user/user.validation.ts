import {  z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    mobile_number: z.string().optional(),

    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
  cookies: z.object({
    refreshToken: z
      .string({
        required_error: 'Refresh token is required From Cookie!',
      })
      .optional(),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required!',
    }),
    newPassword: z.string({
      required_error: 'New password is required!',
    }),
  }),
});

const socialSignInZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is Required' }),
    image: z.string({ required_error: 'Image is Required' }),
    email: z.string({ required_error: 'Email is Required' }),
    provider: z.enum(['google', 'github', 'credentials'], {
      required_error: 'provider is Required!',
    }),
  }),
});

export const UserValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
  socialSignInZodSchema,
};
