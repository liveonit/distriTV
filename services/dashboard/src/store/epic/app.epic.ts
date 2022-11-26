import { Epic, ofType } from 'redux-observable'
import { map } from 'rxjs'
import { storage } from 'src/utils/general/Storage'

import { IAppActionTypes } from '../models/IAppState'

const setTheme: Epic = (action$) =>
  action$.pipe(
    ofType(IAppActionTypes.SET_THEME),
    map(({ payload }) => {
      storage.set('theme', payload)
      return {
        type: IAppActionTypes.SET_THEME_SUCCESS,
      }
    }),
  )

const setLanguage: Epic = (action$) =>
  action$.pipe(
    ofType(IAppActionTypes.SET_LANGUAGE),
    map(({ payload }) => {
      storage.set('language', payload)
      return {
        type: IAppActionTypes.SET_LANGUAGE_SUCCESS,
      }
    }),
  )

export const appEpics = [setTheme, setLanguage]
