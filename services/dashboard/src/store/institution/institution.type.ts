import * as z from 'zod'

export const institutionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is required').min(2, 'Name must have at least 2 characters'),
  city: z.string().nonempty('City is required'),
  locality: z.string().nonempty('Locality is reqired').min(2, 'Locality must have at least 2 characters'),
})

export type InstitutionT = z.TypeOf<typeof institutionSchema>
