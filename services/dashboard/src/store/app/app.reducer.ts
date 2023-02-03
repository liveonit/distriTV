import { AppActionTypes, AppActionCreator, AppState } from 'src/store/app/app.state';

const initialState: AppState = {
  isLoading: false,
  dialog: {
    type: 'error',
    isShow: false,
    content: '',
  },
  notifications: {},
};

const reducer = (state = initialState, { type, payload }: AppActionCreator) => {
  switch (type) {
    case AppActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case AppActionTypes.SET_DIALOG:
      return {
        ...state,
        dialog: {
          type: payload.dialog.type,
          isShow: payload.dialog.isShow,
          content: payload.dialog.content,
        },
      };
    case AppActionTypes.ENQUEUE_SNACKBAR: {
      const { key, message, variant } = payload;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [key]: {
            key,
            message,
            variant,
          },
        },
      };
    }
    case AppActionTypes.REMOVE_SNACKBAR: {
      const newNotfi = { ...state.notifications };
      delete newNotfi[payload];
      return {
        ...state,
        notifications: newNotfi,
      };
    }
    default:
      return state;
  }
};

export default reducer;
