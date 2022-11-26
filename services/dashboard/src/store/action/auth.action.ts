import { IAuthActionCreator, IAuthActionTypes } from '../models/IAuthState'

export const login: (username: string, password: string) => IAuthActionCreator = (username, password) => ({
  type: IAuthActionTypes.LOGIN_REQUEST,
  payload: { username, password },
})

export const logout = () => ({ type: IAuthActionTypes.LOGOUT_REQUEST })

export const setUserData = (userData: any) => ({ type: IAuthActionTypes.SET_USER_DATA, payload: userData })
