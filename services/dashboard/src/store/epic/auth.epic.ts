import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { IAuthActionTypes } from '@store/models/IAuthState'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'

import { enqueueSnackbarAction } from '../action/app.action'
import apiSvc from '../../services/api'

const refreshToken$ = defer(() => checkOrRefreshToken())

const login: Epic = (action$) =>
  action$.pipe(
    ofType(IAuthActionTypes.LOGIN_REQUEST),
    mergeMap(({ payload }) => {
      return apiSvc.request({ method: 'POST', path: '/user/login', body: payload }).pipe(
        map(({ response }) => {
          storage.set('session', response)
          return {
            type: IAuthActionTypes.LOGIN_SUCCESS,
            payload: response,
          }
        }),
        catchError((err) => {
          return of({
            type: IAuthActionTypes.LOGIN_FAILURE,
            payload: err,
          })
        }),
      )
    }),
  )

const loginFailed: Epic = (action$) =>
  action$.pipe(
    ofType(IAuthActionTypes.LOGIN_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Invalid credentials.', key: 'INVALID_CREDENTIALS' }))
  )

const logout: Epic = (action$) =>
  action$.pipe(
    ofType(IAuthActionTypes.LOGOUT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      return apiSvc.request({ method: 'POST', path: '/user/logout', requireAuth: true }).pipe(
        map(() => {
          storage.remove('session')
          return {
            type: IAuthActionTypes.LOGOUT_SUCCESS,
          }
        }),
        catchError((err) =>
          of({
            type: IAuthActionTypes.LOGOUT_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

export const authEpics = [login, loginFailed, logout]
