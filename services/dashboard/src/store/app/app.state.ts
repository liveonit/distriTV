export const AppActionTypes = {
  SET_LOADING: 'APP/SET_LOADING',
  SET_DIALOG: 'APP/SET_DIALOG',
  ENQUEUE_SNACKBAR: 'APP/ENQUEUE_SNACKBAR',
  REMOVE_SNACKBAR: 'APP/REMOVE_SNACKBAR',
  SET_THEME: 'APP/SET_THEME',
  SET_THEME_SUCCESS: 'APP/SET_THEME_SUCCESS',
  SET_LANGUAGE: 'APP/SET_LANGUAGE',
  SET_LANGUAGE_SUCCESS: 'APP/SET_LANGUAGE_SUCCESS',
};

type Dialog = {
  type: string;
  isShow: boolean;
  content?: React.ReactNode | string;
};

export type AppState = {
  isLoading: boolean;
  dialog: Dialog;
  notifications: any;
};

export type AppActionCreator = {
  type: string;
  payload: any;
};

export type Notifer = {
  key: number | string;
  message?: string | React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
};
