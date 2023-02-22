import { RoleT } from './role.type'

export enum RoleActionTypes {
  LIST_ALL_REQUEST = 'ROLE/LIST_ALL_REQUEST',
  LIST_ALL_SUCCESS = 'ROLE/LIST_ALL_SUCCESS',
  LIST_ALL_FAILURE = 'ROLE/LIST_ALL_FAILURE',
  EDIT_REQUEST = 'ROLE/EDIT_REQUEST',
  EDIT_SUCCESS = 'ROLE/EDIT_SUCCESS',
  EDIT_FAILURE = 'ROLE/EDIT_FAILURE',
}

export type EditRolePayload = { userId: string; roleMappings: { roleId: string; institutionId: number }[] }

export type EditRoleActionCreator = {
  type: string
  payload: EditRolePayload
}

export type RoleState = {
  isLoading: boolean
  items: RoleT[]
}
