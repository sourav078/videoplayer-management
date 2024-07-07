import { z } from 'zod';

//* Create user request validation by Zod
const createUserZodSchema = z.object({
  body: z.object({
    first_name: z.string({
      required_error: 'First name is required ',
    }),
    last_name: z.string().optional(),
    email: z.string().email(),
    mobile_number: z.string({
      required_error: 'Mobile number is required!',
    }),
    roles: z.array(z.string()).nonempty(),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
