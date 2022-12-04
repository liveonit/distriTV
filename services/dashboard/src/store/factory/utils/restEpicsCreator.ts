import { of, merge, concat, race, defer } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, debounceTime, map, switchMap, concatMap } from 'rxjs/operators'
import { Epic, ofType } from 'redux-observable'
import { checkOrRefreshToken } from '@services/auth'
import { storage } from 'src/utils/general/Storage'
import { SessionT } from 'src/store/models/Global'

import { ICreateActions } from './ICreateActions'

interface IOptions<T> {
  apiUrl?: string
  apiPrefix?: string
  entityName: string
  actions: ICreateActions
  parseResponse?: (response: any, options: IOptions<T>, payload: any) => any
  headers?: any
}
/**
 * Crea una lista de epicas para interactuar con un recurso de una API REST
 * @param {object} options Opciones de Configuración
 */
export const rest$ = <T>(options: IOptions<T>) => {
  const epics = []
  if (options.actions[options.entityName].post !== undefined) {
    epics.push(
      restEpicFactory<T>({
        ...options,
        ...{
          method: 'POST',
          actionType: 'POST',
        },
      }),
    )
  }
  if (options.actions[options.entityName].get !== undefined) {
    epics.push(
      restEpicFactory<T>({
        ...options,
        ...{
          method: 'GET',
          actionType: 'GET',
        },
      }),
    )
  }
  if (options.actions[options.entityName].put !== undefined) {
    epics.push(
      restEpicFactory<T>({
        ...options,
        ...{
          method: 'PUT',
          actionType: 'PUT',
        },
      }),
    )
  }
  if (options.actions[options.entityName].remove !== undefined) {
    epics.push(
      restEpicFactory<T>({
        ...options,
        ...{
          method: 'DELETE',
          actionType: 'REMOVE',
        },
      }),
    )
  }
  return epics
}
const refreshToken$ = defer(() => checkOrRefreshToken())

export const restEpicFactory = <T>(options: IOptions<T> & { method: string; actionType: string }): Epic => {
  return function (action$, _state$) {
    return action$.pipe(
      ofType(`${options.entityName.toUpperCase()}/${options.actionType}/REQUEST`),
      debounceTime(0),
      concatMap((act) => refreshToken$.pipe(map(() => act))),
      switchMap(({ payload }) => {
        const {session} = storage.get<SessionT>('session') || {}
        const ajax$ = ajax({
          url: `${options.apiUrl ? options.apiUrl + '/' : ''}${options.apiPrefix ? options.apiPrefix + '/' : ''}${
            options.entityName
          }${payload && payload.id ? '/' + payload.id : ''}`,
          method: options.method,
          headers: options.headers || {
            'Content-Type': 'application/json',
            authorization: session?.type === 'google' ? session.tokenId : `Bearer ${session?.accessToken}`,
            'auth-type': session?.type
          },
          body: payload,
        }).pipe(
          map(({ response }) => {
            return {
              type: `${options.entityName.toUpperCase()}/${options.actionType}/SUCCESS`,
              payload: options.parseResponse ? options.parseResponse(response, options, payload) : response,
            }
          }),
          catchError((err) =>
            of({
              type: `${options.entityName.toUpperCase()}/${options.actionType}/FAILED`,
              payload: err.response ? err.response : err,
            }),
          ),
        )
        const blocker$ = merge<any>(
          action$.pipe(ofType(`${options.entityName.toUpperCase()}/${options.actionType}/CANCEL`)),
        ).pipe(map(() => ({ type: `${options.entityName.toUpperCase()}/${options.actionType}/CANCELLED` })))

        return concat(
          of({ type: `${options.entityName.toUpperCase()}/${options.actionType}/REQUEST_SENT` }),
          race(ajax$, blocker$),
        )
      }),
    )
  }
}
