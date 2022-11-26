import { applyMiddleware, createStore, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { monitorEnhancer } from '@utils/general/monitorEnhancer';
import { loggerMiddleware } from '@utils/general/loggerMiddleware';

import rootReducer from './rootReducer';
import {rootEpic} from './rootEpic';

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; }
}

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export function configureStore() {
  const epicMiddleware = createEpicMiddleware();
  const middlewareEnhancer = applyMiddleware(epicMiddleware, loggerMiddleware);
  const composedEnhancers = composeEnhancers(middlewareEnhancer, monitorEnhancer);

  const store = createStore(rootReducer, undefined, composedEnhancers);
  
  epicMiddleware.run(rootEpic);

  return store;
}

const store = configureStore();
export default store