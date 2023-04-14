import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'


import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { LabelActionTypes } from './label.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

// === List labels
const listLabels: Epic = (action$) =>
  action$.pipe(
    ofType(LabelActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ path: '/label', requireAuthType: session?.type }).pipe(
        map(({ response }) => {
          return {
            type: LabelActionTypes.LIST_ALL_SUCCESS,
            payload: response
          }
        }),
        catchError((err) =>
          of({
            type: LabelActionTypes.LIST_ALL_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )
const listLabelsFailed: Epic = (action$) =>
  action$.pipe(
    ofType(LabelActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting labels.', key: 'REQUEST_ERROR' })),
  )

// === Create label
const createLabel: Epic = (action$) =>
  action$.pipe(
    ofType(LabelActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'POST', path: '/label', requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: LabelActionTypes.CREATE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: LabelActionTypes.CREATE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

// === Update label
const updateLabel: Epic = (action$) =>
  action$.pipe(
    ofType(LabelActionTypes.EDIT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'PUT', path: `/label/${payload.id}`, requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: LabelActionTypes.EDIT_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: LabelActionTypes.EDIT_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


// === Update label
const deleteLabel: Epic = (action$) =>
  action$.pipe(
    ofType(LabelActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'DELETE', path: `/label/${payload.id}`, requireAuthType: session?.type }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: LabelActionTypes.DELETE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: LabelActionTypes.DELETE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


export const labelsEpics = [listLabels, listLabelsFailed, createLabel, updateLabel, deleteLabel]
