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
