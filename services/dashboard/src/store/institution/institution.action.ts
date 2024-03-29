import { InstitutionActionTypes } from './institution.state'
import { InstitutionT } from './institution.type'

export const listInstitutions = (payload?: { query?: string }) => ({
  type: InstitutionActionTypes.LIST_ALL_REQUEST,
  payload
})

export const createInstitution = (payload: InstitutionT) => ({
  type: InstitutionActionTypes.CREATE_REQUEST,
  payload
})

export const updateInstitution = (payload: InstitutionT) => ({
  type: InstitutionActionTypes.EDIT_REQUEST,
  payload
})

export const deleteInstitution = (payload: { id: number | string }) => ({
  type: InstitutionActionTypes.DELETE_REQUEST,
  payload
})
