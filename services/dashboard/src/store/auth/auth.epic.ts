import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { AuthActionTypes } from 'src/store/auth/AuthState'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'
import { parseJwt } from 'src/App/helpers'

import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { UserT } from '../models/Global'

const refreshToken$ = defer(() => checkOrRefreshToken())

const login: Epic = (action$) =>
  action$.pipe(
    ofType(AuthActionTypes.LOGIN_REQUEST),
    mergeMap(({ payload }) => {
      return apiSvc.request({ method: 'POST', path: '/auth/login', body: payload }).pipe(
        map(({ response }) => {
          const userPayload = parseJwt<UserT>((response as any).refreshToken)
          if (!userPayload) throw Error('Invalid user payload')
          storage.set('session', {
            session: { ...(response as any), type: 'local' },
            roleMappings: userPayload.roleMappings,
          })
          return {
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: response,
          }
        }),
        catchError((err) => {
          return of({
            type: AuthActionTypes.LOGIN_FAILURE,
            payload: err,
          })
        }),
      )
    }),
  )

const googleLogin: Epic = (action$) =>
  action$.pipe(
    ofType(AuthActionTypes.GOOGLE_LOGIN_REQUEST),
    mergeMap(({ payload }) => {
      return apiSvc.request({ method: 'POST', path: '/auth/googlelogin', body: { tokenId: payload.tokenId } }).pipe(
        map(({ response }) => {
          storage.set('session', {
            session: { ...payload, type: 'google' },
            roleMappings: (response as any).roleMappings,
          })
          return {
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: response,
          }
        }),
        catchError((err) => {
          return of({
            type: AuthActionTypes.LOGIN_FAILURE,
            payload: err,
          })
        }),
      )
    }),
  )

const loginFailed: Epic = (action$) =>
  action$.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Invalid credentials.', key: 'INVALID_CREDENTIALS' })),
  )

const logout: Epic = (action$) =>
  action$.pipe(
    ofType(AuthActionTypes.LOGOUT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    catchError((err) => {
      storage.remove('session')
      return err
    }),
    mergeMap(() => {
      return apiSvc.request({ method: 'POST', path: '/auth/logout', requireAuthType: 'local' }).pipe(
        map(() => {
          storage.remove('session')
          return {
            type: AuthActionTypes.LOGOUT_SUCCESS,
          }
        }),
        catchError((err) => {
          return of({
            type: AuthActionTypes.LOGOUT_FAILURE,
            payload: err,
          })
        }),
      )
    }),
  )

export const authEpics = [login, loginFailed, logout, googleLogin]
