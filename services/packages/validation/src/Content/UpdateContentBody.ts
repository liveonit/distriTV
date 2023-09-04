import { z } from 'zod';

export const updateContentBody = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
  text: z.string().optional(),
  duration: z.number().optional(),
  isPublic: z.boolean().optional(),
  isApproved: z.boolean().optional(),
});

export type UpdateContentBodyType = z.infer<typeof updateContentBody>;
