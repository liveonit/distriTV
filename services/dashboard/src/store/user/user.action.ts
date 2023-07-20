import { UserActionTypes } from './user.state'
import { UserT } from './user.type'

export const listUsers = (payload?: { query?: string }) => ({
  type: UserActionTypes.LIST_ALL_REQUEST,
  payload,
})

export const createUser = (payload: UserT) => ({
  type: UserActionTypes.CREATE_REQUEST,
  payload,
})

export const updateUser = (payload: UserT) => ({
  type: UserActionTypes.EDIT_REQUEST,
  payload,
})

export const deleteUser = (payload: { id: number | string }) => ({
  type: UserActionTypes.DELETE_REQUEST,
  payload,
})
