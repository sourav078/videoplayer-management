// permission validation

import { z } from 'zod';

const PermissionSchema = z.object({
  body: z.object({
    name: z.string().nonempty({
      message: 'Name is required',
    }),
    group_id: z.string().nonempty({
      message: 'Group ID is required',
    }),
  }),
});

export const PermissionValidation = {
  PermissionSchema,
};
