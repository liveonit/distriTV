import { z } from 'zod';

export const createAgendaBody = z.object({
  contenid: z.number(),
  televisionid: z.number(),
  ip: z.string(),
  mac: z.string(),
  
});

export type CreateTelevisionBodyType = z.infer<typeof createAgendaBody>;
