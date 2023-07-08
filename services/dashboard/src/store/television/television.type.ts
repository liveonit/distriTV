import * as z from 'zod'

export const televisionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
  institutionId: z.number().optional(),
  ip: z
    .union([
      z.string().length(0, 'IP requires a format like XXX.XXX.XXX.XXX'),
      z.string().ip({ version: 'v4', message: 'IP requires a format like XXX.XXX.XXX.XXX' }),
    ])
    .optional(),
  mac: z
    .union([
      z.string().length(0, 'Mac Addess requieres a format like: a1:b2:c3:d4:e5:f6'),
      z
        .string()
        .regex(
          /^[0-9a-f]{1,2}([.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/,
          'Mac Addess requieres a format like: a1:b2:c3:d4:e5:f6',
        ),
    ])
    .optional(),
  tvCode: z.string().nonempty(),
  labels: z.array(z.any()).optional(),
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
