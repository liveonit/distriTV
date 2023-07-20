import { z } from 'zod';

export const updateUserBody = z.object({
  id: z
    .string()
    .or(z.number())
    .transform((v: string | number) => v.toString()),
  username: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      // Check for minimum length
      if (value.length < 8) return false;
      // Check for at least one capital letter
      if (!/[A-Z]/.test(value)) return false;
      // Check for at least one small letter
      if (!/[a-z]/.test(value)) return false;
      // Check for at least one number
      if (!/\d/.test(value)) return false;
      // Check for at least one special character (non-alphanumeric)
      if (!/[^a-zA-Z0-9]/.test(value)) return false;
      return true;
    }, 'Invalid password'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  enabled: z.boolean().optional(),
  email: z.string().email().optional(),
  m2mRelations: z
    .array(
      z.object({
        roleMappings: z.array(z.object({ institutionId: z.number(), roleName: z.string() })),
      }),
    )
    .optional(),
});

export type UpdateUserBodyType = z.infer<typeof updateUserBody>;
