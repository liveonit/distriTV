import { RoleMappingT } from './roleMapping.type'

export enum RoleMappingActionTypes {
  LIST_ALL_REQUEST = 'ROLE_MAPPING/LIST_ALL_REQUEST',
  LIST_ALL_SUCCESS = 'ROLE_MAPPING/LIST_ALL_SUCCESS',
  LIST_ALL_FAILURE = 'ROLE_MAPPING/LIST_ALL_FAILURE',
  EDIT_REQUEST = 'ROLE_MAPPING/EDIT_REQUEST',
  EDIT_SUCCESS = 'ROLE_MAPPING/EDIT_SUCCESS',
  EDIT_FAILURE = 'ROLE_MAPPING/EDIT_FAILURE',
}

export type EditRoleMappingPayload = { userId: string; roleMappings: { roleId: string; institutionId: number }[] }

export type EditRoleMappingActionCreator = {
  type: string
  payload: EditRoleMappingPayload
}

export type RoleMappingState = {
  isLoading: boolean
  items: RoleMappingT[]
}
