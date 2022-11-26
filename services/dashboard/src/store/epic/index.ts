import { combineEpics } from 'redux-observable';

import { authEpics } from './auth.epic';
import { appEpics } from './app.epic';

export const rootEpics = combineEpics(...authEpics, ...appEpics);