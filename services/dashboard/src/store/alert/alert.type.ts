import * as z from 'zod'

export const alertSchema = z
.object({
  id: z.number().optional(),
  televisionId: z.number().optional(),
  duration: z.number(),
  labelId: z.number().optional(),
  startDate: z.string().transform((a) => new Date(a)),
  text: z.string(),
})

export type AlertT = z.TypeOf<typeof alertSchema>
