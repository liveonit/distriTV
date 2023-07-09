import { combineReducers } from 'redux';

import auth from './auth/auth.reducer';
import app from './app/app.reducer';
import user from './user/user.reducer'
import institution from './institution/institutions.reducer'
import roleMapping from './roleMapping/roleMapping.reducer'
import role from './role/role.reducer'
import permission from './permission/permission.reducer'
import content from './content/content.reducer'
import label from './label/label.reducer'
import television from './television/television.reducer'
import agenda from './agenda/agendas.reducer'
import alert from './alert/alerts.reducer'

export const rootReducer = combineReducers({
  auth,
  app,
  user,
  institution,
  roleMapping,
  role,
  permission,
  content,
  label,
  agenda,
  television,
  alert
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
