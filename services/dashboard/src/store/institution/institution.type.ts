import * as z from 'zod'

export const institutionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name is reqired').min(2, 'Name must have at least 2 caracters'),
  city: z.string().nonempty('City is reqired'),
  locality: z.string().nonempty('Name is reqired').min(2, 'Name must have at least 2 caracters'),
})

export type InstitutionT = {
  id?: number
  name: string
  city: string
  locality?: string
}

export type CreateInstitutionT = {
  name: string
  city: string
  locality: string
}

export type UpdateInstitutionT = {
  id: number
  name?: string
  city?: string
  locality?: string
}
