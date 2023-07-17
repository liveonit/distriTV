import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'

import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { TelevisionActionTypes } from './television.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

// === List televisions
const listTelevisions: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ path: '/television', requireAuthType: session?.type }).pipe(
        map(({ response }) => {
          return {
            type: TelevisionActionTypes.LIST_ALL_SUCCESS,
            payload: response,
          }
        }),
        catchError((err) =>
          of({
            type: TelevisionActionTypes.LIST_ALL_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )
const listTelevisionsFailed: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting televisions.', key: 'REQUEST_ERROR' })),
  )
const listTelevisionsJoin: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.LIST_ALL_JOIN_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}

      return apiSvc
        .request({
          path: `/television?relations=institution,labels,alert${payload?.query ? `&${payload.query}` : ''}`,
          requireAuthType: session?.type,
        })
        .pipe(
          map(({ response }) => {
            return {
              type: TelevisionActionTypes.LIST_ALL_JOIN_SUCCESS,
              payload: response,
            }
          }),
          catchError((err) =>
            of({
              type: TelevisionActionTypes.LIST_ALL_JOIN_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )
const listTelevisionsJoinFailed: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting televisions.', key: 'REQUEST_ERROR' })),
  )

// === Create television
const createTelevision: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc
        .request({
          method: 'POST',
          path: '/television?relations=institution,labels',
          requireAuthType: session?.type,
          body: payload,
        })
        .pipe(
          mergeMap(({ response }) => {
            return of({
              type: TelevisionActionTypes.CREATE_SUCCESS,
              payload: response,
            })
          }),
          catchError((err) =>
            of({
              type: TelevisionActionTypes.CREATE_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )

// === Update television
const updateTelevision: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.EDIT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc
        .request({
          method: 'PUT',
          path: `/television/${payload.id}?relations=institution,labels`,
          requireAuthType: session?.type,
          body: payload,
        })
        .pipe(
          mergeMap(({ response }) => {
            return of({
              type: TelevisionActionTypes.EDIT_SUCCESS,
              payload: response,
            })
          }),
          catchError((err) =>
            of({
              type: TelevisionActionTypes.EDIT_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )

// === Update television
const deleteTelevision: Epic = (action$) =>
  action$.pipe(
    ofType(TelevisionActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc
        .request({ method: 'DELETE', path: `/television/${payload.id}`, requireAuthType: session?.type })
        .pipe(
          mergeMap(({ response }) => {
            return of({
              type: TelevisionActionTypes.DELETE_SUCCESS,
              payload: response,
            })
          }),
          catchError((err) =>
            of({
              type: TelevisionActionTypes.DELETE_FAILURE,
              payload: err,
            }),
          ),
        )
    }),
  )

export const televisionsEpics = [
  listTelevisions,
  listTelevisionsFailed,
  listTelevisionsJoin,
  listTelevisionsJoinFailed,
  createTelevision,
  updateTelevision,
  deleteTelevision,
]
