import { EditRoleActionCreator, EditRolePayload, UserActionTypes } from './UsersState'

export const listUsers = () => ({
  type: UserActionTypes.LIST_ALL_REQUEST,
})

export const editUserRole: (payload: EditRolePayload) => EditRoleActionCreator = (payload) => ({
  type: UserActionTypes.LIST_ALL_REQUEST,
  payload
})
