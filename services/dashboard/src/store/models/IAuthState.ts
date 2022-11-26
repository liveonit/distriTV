export enum IAuthActionTypes {
  LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS',
  LOGIN_FAILURE = 'AUTH/LOGIN_FAILURE',
  SILENT_LOGIN = 'AUTH/SILENT_LOGIN',
  LOGOUT_REQUEST = 'AUTH/LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'AUTH/LOGOUT_FAILURE',
  SET_USER_DATA = 'AUTH/SET_USER_DATA',
}

export type IAuthState = {
  user: any | null;
};

export type IAuthActionCreatorPayload = { username: string, password: string};

export type IAuthActionCreator = {
  type: string;
  payload: IAuthActionCreatorPayload
};
