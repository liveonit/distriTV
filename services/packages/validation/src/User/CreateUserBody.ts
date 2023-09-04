import { z } from 'zod';

export const roleMapping = z.object({
  roleName: z.string(),
  institutionId: z.number(),
});

export const createUserBody = z.object({
  username: z.string(),
  password: z.string().refine((value) => {
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
  firstName: z.string(),
  lastName: z.string(),
  enabled: z.boolean().default(true),
  email: z.string().email(),
  m2mRelations: z.array(
    z.object({
      roleMappings: z.array(roleMapping),
    }),
  ),
});

export type CreateUserBodyType = z.infer<typeof createUserBody>;
export type RoleMappingInput = z.infer<typeof roleMapping>;
