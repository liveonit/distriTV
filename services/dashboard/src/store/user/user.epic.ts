import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'

import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { UserActionTypes } from './user.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

const getUsers: Epic = (action$) =>
  action$.pipe(
    ofType(UserActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc
        .request({
          path: '/user?relations=roleMappings,roleMappings.role,roleMappings.user',
          requireAuthType: session?.type,
        })
        .pipe(
          map(({ response }) => {
            return {
              type: UserActionTypes.LIST_ALL_SUCCESS,
              payload: response,
            }
          }),
          catchError((err) =>
            of({
              type: UserActionTypes.LIST_ALL_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )

const getUsersFailed: Epic = (action$) =>
  action$.pipe(
    ofType(UserActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting users.', key: 'REQUEST_ERROR' })),
  )

// === Create user
const createUser: Epic = (action$) =>
  action$.pipe(
    ofType(UserActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc
        .request({
          method: 'POST',
          path: '/user?relations=roleMappings,roleMappings.role,roleMappings.user',
          requireAuthType: session?.type,
          body: payload,
        })
        .pipe(
          mergeMap(({ response }) => {
            return of({
              type: UserActionTypes.CREATE_SUCCESS,
              payload: response,
            })
          }),
          catchError((err) =>
            of({
              type: UserActionTypes.CREATE_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )

// === Update user
const updateUser: Epic = (action$) =>
  action$.pipe(
    ofType(UserActionTypes.EDIT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc
        .request({
          method: 'PUT',
          path: `/user/${payload.id}?relations=roleMappings,roleMappings.role,roleMappings.user`,
          requireAuthType: session?.type,
          body: payload,
        })
        .pipe(
          mergeMap(({ response }) => {
            return of({
              type: UserActionTypes.EDIT_SUCCESS,
              payload: response,
            })
          }),
          catchError((err) =>
            of({
              type: UserActionTypes.EDIT_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )

// === Update user
const deleteUser: Epic = (action$) =>
  action$.pipe(
    ofType(UserActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'DELETE', path: `/user/${payload.id}`, requireAuthType: session?.type }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: UserActionTypes.DELETE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: UserActionTypes.DELETE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

export const usersEpics = [getUsers, getUsersFailed, createUser, updateUser, deleteUser]
