import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'


import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { InstitutionActionTypes } from './institution.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

// === List institutions
const listInstitutions: Epic = (action$) =>
  action$.pipe(
    ofType(InstitutionActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({payload}) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({
        path: `/institution${payload?.query ? `?${payload.query}` : ''}`,
        requireAuthType: session?.type 
      }).pipe(
        map(({ response }) => {
          return {
            type: InstitutionActionTypes.LIST_ALL_SUCCESS,
            payload: response
          }
        }),
        catchError((err) =>
          of({
            type: InstitutionActionTypes.LIST_ALL_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )
const listInstitutionsFailed: Epic = (action$) =>
  action$.pipe(
    ofType(InstitutionActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting institutions.', key: 'REQUEST_ERROR' })),
  )

// === Create institution
const createInstitution: Epic = (action$) =>
  action$.pipe(
    ofType(InstitutionActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'POST', path: '/institution', requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: InstitutionActionTypes.CREATE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: InstitutionActionTypes.CREATE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

// === Update institution
const updateInstitution: Epic = (action$) =>
  action$.pipe(
    ofType(InstitutionActionTypes.EDIT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'PUT', path: `/institution/${payload.id}`, requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: InstitutionActionTypes.EDIT_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: InstitutionActionTypes.EDIT_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


// === Update institution
const deleteInstitution: Epic = (action$) =>
  action$.pipe(
    ofType(InstitutionActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'DELETE', path: `/institution/${payload.id}`, requireAuthType: session?.type }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: InstitutionActionTypes.DELETE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: InstitutionActionTypes.DELETE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


export const institutionsEpics = [listInstitutions, listInstitutionsFailed, createInstitution, updateInstitution, deleteInstitution]
