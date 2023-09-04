import { z } from 'zod';

export const updateTelevisionBodySchema = z.object({
  institutionId: z.number().optional(),
  name: z.string().optional(),
  ip: z.string().optional(),
  mac: z.string().optional(),
  tvCode: z.string().length(6).optional(),
  m2mRelations: z
    .object({
      labels: z.array(z.number()).optional(),
    })
    .optional(),
});

export type UpdateTelevisionBodyType = z.infer<typeof updateTelevisionBodySchema>;
