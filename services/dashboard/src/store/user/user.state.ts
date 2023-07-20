import { UserT } from './user.type'

export enum UserActionTypes {
  LIST_ALL_REQUEST = 'USER/LIST_ALL_REQUEST',
  LIST_ALL_SUCCESS = 'USER/LIST_ALL_SUCCESS',
  LIST_ALL_FAILURE = 'USER/LIST_ALL_FAILURE',
  CREATE_REQUEST = 'USER/CREATE_REQUEST',
  CREATE_SUCCESS = 'USER/CREATE_SUCCESS',
  CREATE_FAILURE = 'USER/CREATE_FAILURE',
  EDIT_REQUEST = 'USER/EDIT_REQUEST',
  EDIT_SUCCESS = 'USER/EDIT_SUCCESS',
  EDIT_FAILURE = 'USER/EDIT_FAILURE',
  DELETE_REQUEST = 'USER/DELETE_REQUEST',
  DELETE_SUCCESS = 'USER/DELETE_SUCCESS',
  DELETE_FAILURE = 'USER/DELETE_FAILURE',
}

export type UsersState = {
  isLoading: boolean
  items: UserT[]
}
