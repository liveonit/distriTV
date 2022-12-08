import { combineReducers } from 'redux';

import auth from './auth/auth.reducer';
import app from './app/app.reducer';
import users from './user/users.reducer'
import institutions from './institution/institutions.reducer'

export const rootReducer = combineReducers({
  auth,
  app,
  users,
  institutions
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
