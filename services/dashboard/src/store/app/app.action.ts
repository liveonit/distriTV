import { AppActionTypes, Notifer } from 'src/store/app/app.state';

export const setLoading = (isLoading: boolean) => ({
  type: AppActionTypes.SET_LOADING,
  payload: isLoading,
});

export const setDialog = (isShow: boolean, type = 'error', content: React.ReactNode = '') => ({
  type: AppActionTypes.SET_DIALOG,
  payload: {
    dialog: {
      type,
      isShow,
      content,
    },
  },
});

export const enqueueSnackbarAction = (notification: Notifer) => {
  return {
    type: AppActionTypes.ENQUEUE_SNACKBAR,
    payload: {
      key: notification.key || new Date().getTime() + Math.random(),
      message: notification.message,
      variant: notification.variant || 'success',
    },
  };
};

export const removeSnackbar = (key: string | number | undefined) => ({
  type: AppActionTypes.REMOVE_SNACKBAR,
  payload: key,
});


export const setTheme = (payload: any) => ({
  type: AppActionTypes.SET_THEME,
  modeTheme: payload,
})

export const setLanguage = (payload: any) => ({
  type: AppActionTypes.SET_LANGUAGE,
  language: payload,
})