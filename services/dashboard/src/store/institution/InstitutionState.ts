import { InstitutionT } from '../models/Global'

export enum InstitutionActionTypes {
  LIST_ALL_REQUEST = 'INSTITUTION/LIST_ALL_REQUEST',
  LIST_ALL_SUCCESS = 'INSTITUTION/LIST_ALL_SUCCESS',
  LIST_ALL_FAILURE = 'INSTITUTION/LIST_ALL_FAILURE',
  CREATE_REQUEST = 'INSTITUTION/CREATE_REQUEST',
  CREATE_SUCCESS = 'INSTITUTION/CREATE_SUCCESS',
  CREATE_FAILURE = 'INSTITUTION/CREATE_FAILURE',
  EDIT_REQUEST = 'INSTITUTION/EDIT_REQUEST',
  EDIT_SUCCESS = 'INSTITUTION/EDIT_SUCCESS',
  EDIT_FAILURE = 'INSTITUTION/EDIT_FAILURE',
  DELETE_REQUEST = 'INSTITUTION/DELETE_REQUEST',
  DELETE_SUCCESS = 'INSTITUTION/DELETE_SUCCESS',
  DELETE_FAILURE = 'INSTITUTION/DELETE_FAILURE',
}

export type InstitutionsState = {
  isLoading: boolean
  institutions: InstitutionT[]
}
