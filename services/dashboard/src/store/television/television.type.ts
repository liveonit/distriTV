import * as z from 'zod'

export const televisionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
  institutionId: z.number().optional(),
  ip: z.string().ip({ version: 'v4', message: 'IP requires a format like XXX.XXX.XXX.XXX' }),
  mac: z
    .string()
    .regex(
      /^[0-9a-f]{1,2}([.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/,
      'Mac Addess requieres a format like: a1:b2:c3:d4:e5:f6',
    ),
  tvCode: z.string().nonempty(),
  m2mRelations: z
    .object({
      labels: z.array(z.number()).optional(),
    })
    .optional(),
  institution: z
    .object({
      id: z.number(),
      name: z.string(),
      city: z.string(),
      locality: z.string(),
    })
    .optional(),
})

export type TelevisionT = z.TypeOf<typeof televisionSchema>
