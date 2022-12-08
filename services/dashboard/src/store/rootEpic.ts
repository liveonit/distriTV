import { combineEpics } from 'redux-observable'

import { authEpics } from './auth/auth.epic'
import { appEpics } from './app/app.epic'
import { usersEpics } from './user/user.epic'
import { institutionsEpics } from './institution/institution.epic'
export const rootEpic = combineEpics(...authEpics, ...appEpics, ...usersEpics, ...institutionsEpics)
