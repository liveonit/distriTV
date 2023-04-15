import { Epic, ofType } from 'redux-observable'
import { map, mergeMap, catchError, debounceTime, concatMap, takeUntil } from 'rxjs/operators'
import { defer, of, Subject } from 'rxjs'
import { storage } from '@utils/general/Storage'
import { checkOrRefreshToken } from 'src/services/auth'

import { enqueueSnackbarAction } from '../app/app.action'
import apiSvc from '../../services/api'
import { ContentActionTypes } from './content.state'
import { SessionT } from '../auth/auth.type'

const refreshToken$ = defer(() => checkOrRefreshToken())

const listContents: Epic = (action$) =>
  action$.pipe(
    ofType(ContentActionTypes.LIST_ALL_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(() => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ path: '/content', requireAuthType: session?.type }).pipe(
        map(({ response }) => {
          return {
            type: ContentActionTypes.LIST_ALL_SUCCESS,
            payload: response,
          }
        }),
        catchError((err) =>
          of({
            type: ContentActionTypes.LIST_ALL_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

const listContentsFailed: Epic = (action$) =>
  action$.pipe(
    ofType(ContentActionTypes.LIST_ALL_FAILURE),
    map(() => enqueueSnackbarAction({ variant: 'error', message: 'Error getting contents.', key: 'REQUEST_ERROR' })),
  )

const uploadContent: Epic = (action$) => {
  const progressSubscriber$ = new Subject()
  const { session } = storage.get<SessionT>('session') || {}

  return action$.pipe(
    ofType(ContentActionTypes.UPLOAD_FILE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    catchError((err) => {
      storage.remove('session')
      return err
    }),
    mergeMap(({ payload }) => {
      const { file } = payload
      const formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('type', file.type)
      formData.append('name', payload.name)

      return apiSvc
        .request({
          method: 'POST',
          path: '/content/upload',
          requireAuthType: session?.type,
          extraConfig: {
            progressSubscriber: progressSubscriber$,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
          },
          body: formData,
        })
        .pipe(takeUntil(action$.pipe(ofType(ContentActionTypes.CANCEL_VIDEO_UPLOAD))))
        .pipe(
          mergeMap(({ response }) => {
            return of(
              {
                type: ContentActionTypes.UPLOAD_FILE_SUCCESS,
              },
              {
                type: ContentActionTypes.CREATE_REQUEST,
                payload: { ...payload, url: `${window.location.protocol}//${window.location.host}${(response as any)[0].filePath}` },
              },
            )
          }),
          catchError((err) => {
            return of({
              type: ContentActionTypes.UPLOAD_FILE_FAILURE,
              payload: err,
            })
          }),
        )
    }),
  )
}

const createContent: Epic = (action$) =>
  action$.pipe(
    ofType(ContentActionTypes.CREATE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'POST', path: '/content', requireAuthType: session?.type, body: payload }).pipe(
        mergeMap(({ response }) => {
          return of(
            {
              type: ContentActionTypes.CREATE_SUCCESS,
              payload: response,
            },
            { type: ContentActionTypes.LIST_ALL_REQUEST },
          )
        }),
        catchError((err) =>
          of({
            type: ContentActionTypes.CREATE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

  const deleteContent: Epic = (action$) =>
  action$.pipe(
    ofType(ContentActionTypes.DELETE_REQUEST),
    debounceTime(0),
    concatMap((act) => refreshToken$.pipe(map(() => act))),
    mergeMap(({ payload }) => {
      const { session } = storage.get<SessionT>('session') || {}
      return apiSvc.request({ method: 'DELETE', path: `/content/${payload.id}`, requireAuthType: session?.type }).pipe(
        mergeMap(({ response }) => {
          return of({
            type: ContentActionTypes.DELETE_SUCCESS,
            payload: response,
          })
        }),
        catchError((err) =>
          of({
            type: ContentActionTypes.DELETE_FAILURE,
            payload: err,
          }),
        ),
      )
    }),
  )

export const contentsEpics = [listContents, listContentsFailed, uploadContent, createContent, deleteContent]
