import * as z from 'zod'

export const televisionSchema = z.object({
  id: z.number().optional(),
  institutionId: z.number().optional(),
  ip: z.string().nonempty('Ip is required').min(7, 'Ip must have at least 2 characters'),
  mac: z.string().nonempty('Mac is required'),
  //tvCode: z.string().nonempty()
})

export type TelevisionT = z.TypeOf<typeof televisionSchema>
