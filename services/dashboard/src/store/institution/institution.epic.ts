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

const listInstitutions: Epic = (action$) =>
  action$.pipe(
    ofType(InstitutionActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const {session} = storage.get<SessionT>('session') || {}
      return apiSvc.request({ path: '/institution', requireAuthType: session?.type }).pipe(
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

export const institutionsEpics = [listInstitutions, listInstitutionsFailed]
