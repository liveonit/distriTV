import { createActions } from 'redux-actions'

import { ICreateActions } from './ICreateActions'
interface IOptions {
  entityName: string;
  enabledActions: {
    GET?: boolean,
    POST?: boolean,
    PUT?: boolean,
    REMOVE?: boolean
  }
}

export const restActionCreator = <T>(options: IOptions) => {
  const { entityName } = options;
  const {GET, POST, PUT, REMOVE } = options.enabledActions;
  const createActionsOptions = {
    [entityName.toUpperCase()]: {
      ...(GET && { GET : {
        REQUEST: (params?: any) => params,
        SUCCESS: (authors: T[]) => authors,
        FAILED: undefined,
        CANCEL: undefined,
        CANCELLED: undefined
      }
    }),
      ...(POST && {POST : {
        REQUEST: (author: Omit<T, 'id'>) => author,
        SUCCESS: (author: T) => author,
        FAILED: undefined,
        CANCEL: undefined,
        CANCELLED: undefined
      }}),
      ...(PUT && {PUT: {
        REQUEST: (author: T) => author,
        SUCCESS: (author: T) => author,
        FAILED: undefined,
        CANCEL: undefined,
        CANCELLED: undefined
      }}),
      ...(REMOVE && {REMOVE: {
        REQUEST: (author: T) => author,
        SUCCESS: (author: T) => author,
        FAILED: undefined,
        CANCEL: undefined,
        CANCELLED: undefined
      }}),
      
    }
  }
  return createActions(createActionsOptions) as ICreateActions;
} 