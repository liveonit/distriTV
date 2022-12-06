import { z } from 'zod';

export const createNotificationBody = z.object({
  name: z.string(),
  city: z.string(),
  locality: z.string(),
});

export type CreateNotificationBodyType = z.infer<typeof createNotificationBody>;
