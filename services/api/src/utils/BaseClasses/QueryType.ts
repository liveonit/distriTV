import { z } from 'zod';

export const querySchema = z.object({
  skip: z
    .string()
    .or(z.undefined())
    .transform((v) => (typeof v === 'string' ? +v : undefined)),
  take: z
    .string()
    .or(z.undefined())
    .transform((v) => (typeof v === 'string' ? +v : undefined)),
  relations: z.string().optional().transform((v) => typeof v === 'string' && v.split(',')),
  search: z
    .string()
    .or(z.undefined())
    .transform((v) => {
      if (typeof v === 'string') {
        const [column, value] = v.split(':');
        if ((column?.length, value?.length)) return { column, value };
        else return undefined;
      }
    }),
});
export type PaginationQueryType = z.infer<typeof querySchema>;
