import * as z from 'zod'

export const televisionSchema = z.object({
  institutionId: z.number(),
  ip: z.string().nonempty('Ip is required').min(7, 'Ip must have at least 2 characters'),
  mac: z.string().nonempty('Mac is required'),
 
})

export type TelevisionT = z.TypeOf<typeof televisionSchema>
