import { EditRoleActionCreator, EditRolePayload, IUserActionTypes } from '../models/IUsersState'

export const listUsers = () => ({
  type: IUserActionTypes.LIST_ALL_REQUEST,
})

export const editUserRole: (payload: EditRolePayload) => EditRoleActionCreator = (payload) => ({
  type: IUserActionTypes.LIST_ALL_REQUEST,
  payload
})
