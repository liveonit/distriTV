import { Epic, ofType } from 'redux-observable'
import { map } from 'rxjs'
import { storage } from 'src/utils/general/Storage'

import { AppActionTypes } from './app.state'

const setTheme: Epic = (action$) =>
  action$.pipe(
    ofType(AppActionTypes.SET_THEME),
    map(({ payload }) => {
      storage.set('theme', payload)
      return {
        type: AppActionTypes.SET_THEME_SUCCESS,
      }
    }),
  )

const setLanguage: Epic = (action$) =>
  action$.pipe(
    ofType(AppActionTypes.SET_LANGUAGE),
    map(({ payload }) => {
      storage.set('language', payload)
      return {
        type: AppActionTypes.SET_LANGUAGE_SUCCESS,
      }
    }),
  )

export const appEpics = [setTheme, setLanguage]
