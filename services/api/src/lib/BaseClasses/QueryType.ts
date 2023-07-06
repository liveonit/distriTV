import { z } from 'zod';
import { Like, In } from 'typeorm';

export const querySchema = z.object({
  skip: z
    .string()
    .or(z.undefined())
    .transform((v) => (typeof v === 'string' ? +v : undefined)),
  take: z
    .string()
    .or(z.undefined())
    .transform((v) => (typeof v === 'string' ? +v : undefined)),
  relations: z
    .string()
    .optional()
    .transform((v) => typeof v === 'string' && v.split(',')),
  search: z
    .string()
    .or(z.undefined())
    .transform((v) => {
      if (typeof v === 'string') {
        const searches = v.split(';');
        const query: any = {};
        console.log(searches)
        searches.forEach((search) => {
          const [column, value] = search.split(':');
          const [father, son] = column.split('.');

          const parseValue = () => {
            if(value.includes(',')){
              return In(value.split(','));
            } else {
              return Like(`%${value}%`);
            }
          }
          
          if (son) {
            const nested: any = {};
            nested[son] = parseValue();
            query[father] = nested;
          } else {
            query[column] = parseValue();
          }
        });

        console.log(query)
        // return {institution: {name: 'Ceibal'}}
        if (searches.length > 0) return query;
        else return undefined;
      }
    }),
});
export type PaginationQueryType = z.infer<typeof querySchema>;
