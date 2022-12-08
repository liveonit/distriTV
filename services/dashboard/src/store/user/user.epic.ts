import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'


import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { SessionT } from '../models/Global'
import { UserActionTypes } from './UsersState'

const refreshToken$ = defer(() => checkOrRefreshToken())

const getUsers: Epic = (action$) =>
  action$.pipe(
    ofType(UserActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const {session} = storage.get<SessionT>('session') || {}
      return apiSvc.request({ path: '/user?relations=roleMappings,roleMappings.role,roleMappings.institution', requireAuthType: session?.type }).pipe(
        map(({ response }) => {
          return {
            type: UserActionTypes.LIST_ALL_SUCCESS,
            payload: response
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

export const usersEpics = [getUsers, getUsersFailed]
