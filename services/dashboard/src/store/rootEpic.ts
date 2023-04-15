import { combineEpics } from 'redux-observable'

import { authEpics } from './auth/auth.epic'
import { appEpics } from './app/app.epic'
import { usersEpics } from './user/user.epic'
import { institutionsEpics } from './institution/institution.epic'
import { contentsEpics } from './content/content.epic'
import {televisionsEpics} from './television/television.epic'
import {labelsEpics} from './label/label.epic'
import { agendasEpics } from './agenda/agenda.epic'


export const rootEpic = combineEpics(...authEpics, ...appEpics, ...usersEpics, ...institutionsEpics, ...contentsEpics, ...televisionsEpics, ...labelsEpics, ...agendasEpics)
