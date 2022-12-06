import { z } from 'zod';

export const updateNotificationBodySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
});

export type UpdateNotificationBodyType = z.infer<typeof updateNotificationBodySchema>;
