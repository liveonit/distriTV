import { UserActionTypes } from './user.state'
import { CreateUserT, UpdateUserT } from './user.type'

export const listUsers = (payload?: { query?: string }) => ({
  type: UserActionTypes.LIST_ALL_REQUEST,
  payload,
})

export const createUser = (payload: CreateUserT) => ({
  type: UserActionTypes.CREATE_REQUEST,
  payload,
})

export const updateUser = (payload: UpdateUserT) => ({
  type: UserActionTypes.EDIT_REQUEST,
  payload,
})

export const deleteUser = (payload: { id: number | string }) => ({
  type: UserActionTypes.DELETE_REQUEST,
  payload,
})
