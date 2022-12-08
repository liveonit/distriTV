import { PermissionT } from './permission.type'

export enum PermissionActionTypes {
  LIST_ALL_REQUEST = 'USER/LIST_ALL_REQUEST',
  LIST_ALL_SUCCESS = 'USER/LIST_ALL_SUCCESS',
  LIST_ALL_FAILURE = 'USER/LIST_ALL_FAILURE',
  EDIT_REQUEST = 'USER/EDIT_REQUEST',
  EDIT_SUCCESS = 'USER/EDIT_SUCCESS',
  EDIT_FAILURE = 'USER/EDIT_FAILURE',
}

export type EditPermissionPayload = { userId: string; roleMappings: { roleId: string; institutionId: number }[] }

export type EditPermissionActionCreator = {
  type: string
  payload: EditPermissionPayload
}

export type PermissionsState = {
  isLoading: boolean
  items: PermissionT[]
}
