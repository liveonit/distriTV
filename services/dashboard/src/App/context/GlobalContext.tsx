import React, { useContext, createContext, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppActionTypes } from 'src/store/app/AppState'

import { GLOBAL_CONFIGS } from '../configs'
import { useStoredLanguage } from '../hooks/useLanguage'
import { useStoredTheme } from '../hooks/useStoredTheme'

type IProps = {
  children: React.ReactNode
}

type IContext = {
  modeTheme: string
  language: string
  setModeTheme: (mode: string) => void
  setLanguage: (language: string) => void
}

const initialState = {
  modeTheme: GLOBAL_CONFIGS.REACT_APP_THEME || 'light',
  language: GLOBAL_CONFIGS.REACT_APP_LANGUAGE || 'en',
  setModeTheme: () => {
    console.log('setModeTheme')
  },
  setLanguage: () => {
    console.log('setLanguage')
  },
}

const GlobalContext = createContext<IContext>(initialState)

const GlobalProvider = ({ children }: IProps) => {
  const dispatch = useDispatch()
  const modeTheme = useStoredTheme()
  const language = useStoredLanguage()

  const handleSetModeTheme = useCallback((mode: string) => {
    dispatch({
      type: AppActionTypes.SET_THEME,
      payload: mode,
    })
  }, [])

  const handleChangeLanguage = useCallback((language: string) => {
    dispatch({
      type: AppActionTypes.SET_LANGUAGE,
      payload: language,
    })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        modeTheme,
        language,
        setModeTheme: handleSetModeTheme,
        setLanguage: handleChangeLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

const useGlobalContext = () => useContext(GlobalContext)

export { GlobalContext, GlobalProvider, useGlobalContext }
