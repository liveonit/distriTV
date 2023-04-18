import * as z from 'zod'

export const televisionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
  institutionId: z.number().optional(),
  ip: z.string().nonempty('Ip is required').min(7, 'Ip must have at least 7 characters'),
  mac: z.string().nonempty('Mac is required'),
  tvCode: z.string().nonempty(),
  label: z.array(z.number()).optional(),
  institution: z.object({
    id: z.number(),
    name: z.string(),
    city: z.string(),
    locality: z.string()
  }).optional()
})

export type TelevisionT = z.TypeOf<typeof televisionSchema>
