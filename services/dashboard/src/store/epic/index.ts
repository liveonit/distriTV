import { combineEpics } from 'redux-observable';

import { authEpics } from './auth.epic';
import { appEpics } from './app.epic';
import { usersEpics } from './users.epic';
export const rootEpic = combineEpics(...authEpics, ...appEpics, ...usersEpics);