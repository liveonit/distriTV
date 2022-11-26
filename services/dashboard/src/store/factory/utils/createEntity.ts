import { combineEpics } from 'redux-observable'

import { Id } from '../Generics'
import { restActionCreator } from './restActionCreator'
import { rest$ } from './restEpicsCreator'
import { restReducerCreator } from './restReducerCreator'

export const createEntity = <TModel extends { id: Id }>(
  entityName: string,
  enabledActions?: { GET?: boolean; POST?: boolean; PUT?: boolean; REMOVE?: boolean },
) => {
  enabledActions = enabledActions
    ? { GET: false, POST: false, PUT: false, REMOVE: false, ...enabledActions }
    : { GET: true, POST: true, PUT: true, REMOVE: true }
  const actions = restActionCreator<TModel>({ entityName: entityName, enabledActions })
  const reducer = restReducerCreator<TModel>(entityName, actions)
  const restEpic = rest$<TModel>({
    apiPrefix: '/api',
    entityName: entityName,
    actions,
  })
  const epics = combineEpics(...restEpic)

  const { get, post, put, remove } = actions[entityName]
  const getActions = {
    get: get?.request,
    create: post?.request,
    update: put?.request,
    remove: remove?.request,
  }

  const getState = (state: any) => state[`${entityName}s`] as ReturnType<typeof reducer>

  return {
    actions,
    getActions,
    getState,
    reducer,
    epics,
  }
}
