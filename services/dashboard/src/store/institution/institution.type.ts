import { TelevisionT } from '../television/television.type'

export type InstitutionT = {
  id: number
  name: string
  city?: string
  locality?: string
  televisions?: TelevisionT[]
}
