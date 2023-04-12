import * as z from 'zod'

export const labelSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
  description: z.string().optional()
})

export type LabelT = z.TypeOf<typeof labelSchema>
