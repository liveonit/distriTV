import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'


import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { AlertActionTypes } from './alert.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

// === List alerts
const listAlerts: Epic = (action$) =>
  action$.pipe(
    ofType(AlertActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({payload}) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({
        path: `/alerts?relations=television,content,label${payload?.query ? `&${payload.query}` : ''}`,
        requireAuthType: session?.type 
      }).pipe(
        map(({ response }) => {
          return {
            type: AlertActionTypes.LIST_ALL_SUCCESS,
            payload: response
          }
        }),
        catchError((err) =>
          of({
            type: AlertActionTypes.LIST_ALL_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )
const listAlertsFailed: Epic = (action$) =>
  action$.pipe(
    ofType(AlertActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting alerts.', key: 'REQUEST_ERROR' })),
  )

// === Create alert
const createAlert: Epic = (action$) =>
  action$.pipe(
    ofType(AlertActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'POST', path: '/schedule', requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: AlertActionTypes.CREATE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: AlertActionTypes.CREATE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

// === Update alert
const updateAlert: Epic = (action$) =>
  action$.pipe(
    ofType(AlertActionTypes.EDIT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'PUT', path: `/schedule/${payload.id}`, requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: AlertActionTypes.EDIT_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: AlertActionTypes.EDIT_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


// === Delete alert
const deleteAlert: Epic = (action$) =>
  action$.pipe(
    ofType(AlertActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'DELETE', path: `/schedule/${payload.id}`, requireAuthType: session?.type}).pipe(
        mergeMap(({ response }) => {
          return of({
            type: AlertActionTypes.DELETE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: AlertActionTypes.DELETE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


export const alertsEpics = [listAlerts, listAlertsFailed, createAlert, updateAlert, deleteAlert]
