import { PATH_NAME } from './pathName'
import { DRAWER_MENU_LABEL } from './drawerMenu'
import projConfig from '../../../package.json'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

export const LANGUAGE = {
  ENGLISH: 'en',
  SPANISH: 'es',
}

const VERSION_PROJECT = {
  // eslint-disable-next-line global-require
  version: projConfig.version,
}

const GLOBAL_CONFIGS = {
  PORT: 3002,
  SKIP_PREFLIGHT_CHECK: true,
  REACT_APP_DRAWER_WIDTH: 240,
  REACT_APP_THEME: 'light',
  REACT_APP_LANGUAGE: 'en',
  REACT_APP_DELAY_GET_DATA: 300,
  REACT_APP_DEBOUNCE_TIME: 500,
  REACT_APP_MAX_SNACKBAR: 3,
  REACT_APP_AUTO_HIDE_SNACKBAR: 2000,
  API_URL: '/api/v1',
  DEBUG_STORE: false,
}

const GOOGLE_CONFIGS = {
  clientId: '1009712653750-9m40br6dvf4qjimouukfuf57btg7u75u.apps.googleusercontent.com',
}

export { PATH_NAME, DRAWER_MENU_LABEL, VERSION_PROJECT, GLOBAL_CONFIGS, GOOGLE_CONFIGS }
