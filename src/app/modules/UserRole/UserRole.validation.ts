import { z } from 'zod';

const UserRoleSchema = z.object({
  body: z.object({
    name: z.string().nonempty({
      message: 'Name is required',
    }),
    permissions: z.array(z.string()).nonempty({
      message: 'Permissions is required',
    }),
  }),
});

export const UserRoleValidation = {
  UserRoleSchema,
};
