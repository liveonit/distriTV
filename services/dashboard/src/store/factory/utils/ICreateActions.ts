import { ActionFunctionAny, Action } from 'redux-actions';

export interface  ICreateActions {
  [name: string]: {
    get ?: {
      request?: ActionFunctionAny<Action<unknown>>,
      success?: ActionFunctionAny<Action<unknown>>,
      failed?: ActionFunctionAny<Action<unknown>>,
      cancel?: ActionFunctionAny<Action<unknown>>,
      canceled?: ActionFunctionAny<Action<unknown>>
    },
    post ?: {
      request?: ActionFunctionAny<Action<unknown>>,
      sucess?: ActionFunctionAny<Action<unknown>>,
      failed?: ActionFunctionAny<Action<unknown>>,
      cancel?: ActionFunctionAny<Action<unknown>>,
      cancelled?: ActionFunctionAny<Action<unknown>>,
    }
    put?: {
      request?: ActionFunctionAny<Action<unknown>>,
      success?: ActionFunctionAny<Action<unknown>>,
      failed?: ActionFunctionAny<Action<unknown>>,
      cancel?: ActionFunctionAny<Action<unknown>>,
      cancelled?: ActionFunctionAny<Action<unknown>>
    },
    remove?: {
      request?: ActionFunctionAny<Action<unknown>>,
      success?: ActionFunctionAny<Action<unknown>>,
      failed?: ActionFunctionAny<Action<unknown>>,
      cancel?: ActionFunctionAny<Action<unknown>>,
      cancelled?: ActionFunctionAny<Action<unknown>>
    }
  }
}