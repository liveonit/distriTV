import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap } from 'rxjs/operators'
import { defer, of } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'


import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { AgendaActionTypes } from './agenda.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

// === List agendas
const listAgendas: Epic = (action$) =>
  action$.pipe(
    ofType(AgendaActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ path: '/schedule?relations=television,content,label', requireAuthType: session?.type }).pipe(
        map(({ response }) => {
          return {
            type: AgendaActionTypes.LIST_ALL_SUCCESS,
            payload: response
          }
        }),
        catchError((err) =>
          of({
            type: AgendaActionTypes.LIST_ALL_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )
const listAgendasFailed: Epic = (action$) =>
  action$.pipe(
    ofType(AgendaActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting agendas.', key: 'REQUEST_ERROR' })),
  )

// === Create agenda
const createAgenda: Epic = (action$) =>
  action$.pipe(
    ofType(AgendaActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'POST', path: '/schedule', requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: AgendaActionTypes.CREATE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: AgendaActionTypes.CREATE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

// === Update agenda
const updateAgenda: Epic = (action$) =>
  action$.pipe(
    ofType(AgendaActionTypes.EDIT_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'PUT', path: `/schedule/${payload.id}`, requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: AgendaActionTypes.EDIT_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: AgendaActionTypes.EDIT_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


// === Delete agenda
const deleteAgenda: Epic = (action$) =>
  action$.pipe(
    ofType(AgendaActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'DELETE', path: `/schedule/${payload.id}`, requireAuthType: session?.type}).pipe(
        mergeMap(({ response }) => {
          return of({
            type: AgendaActionTypes.DELETE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: AgendaActionTypes.DELETE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )


export const agendasEpics = [listAgendas, listAgendasFailed, createAgenda, updateAgenda, deleteAgenda]
