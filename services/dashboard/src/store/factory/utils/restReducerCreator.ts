import { handleActions } from 'redux-actions'

import { Id, ParcialWithId } from '../Generics';
import { ICreateActions } from './ICreateActions';


export const restReducerCreator = <T extends { id: Id }>(entityName: string, actions: ICreateActions = {}) => {
  interface IState {
    loading: { GET: boolean, POST: boolean, PUT: boolean, REMOVE: boolean },
    items: T[],
    createPendingData?: Omit<T, 'id'>,
    updatePendingData?: ParcialWithId<T>
  }

  const initState: IState = {
    loading: { GET: false, POST: false, PUT: false, REMOVE: false },
    items: [],
  }

  type CombinedPayloads = T[] | T | Omit<T, 'id'> | ParcialWithId<T> | Id

  const reducer = handleActions<IState, CombinedPayloads>({
    [entityName.toUpperCase()]: {
      ...(actions[entityName].get && {
        GET: {
          REQUEST: s => ({ ...s, loading: { ...s.loading, GET: true } }),
          SUCCESS: (s, a) => ({ ...s, items: a.payload as T[], loading: { ...s.loading, GET: false } }),
          FAILED: s => ({ ...s, loading: { ...s.loading, GET: false } }),
          CANCELLED: s => ({ ...s, loading: { ...s.loading, GET: false } })
        }
      }),
      ...(actions[entityName].post && {
        POST: {
          REQUEST: (s, a) => ({ ...s, createPendingData: a.payload as Omit<T, 'id'>, loading: { ...s.loading, POST: false } }),
          SUCCESS: (s, a) => s.createPendingData
            ? { loading: { ...s.loading, POST: false }, createPendingData: undefined, items: [...s.items, { ...s.createPendingData, id: a.payload as Id } as T] }
            : { ...s, loading: { ...s.loading, POST: false } }
          ,
          FAILED: s => ({ ...s, loading: { ...s.loading, POST: false } }),
          CANCELLED: s => ({ ...s, loading: { ...s.loading, POST: false } })
        }
      }),
      ...(actions[entityName].put && {
        PUT: {
          REQUEST: (s, a) => ({ ...s, updatePendingData: a.payload as ParcialWithId<T>, loading: { ...s.loading, PUT: true } }),
          SUCCESS: (s, a) => ({ ...s, items: s.items.map(i => i.id === a.payload ? { ...i, ...s.updatePendingData } : i), loading: { ...s.loading, PUT: false } }),
          FAILED: (s, _a) => ({ ...s, loading: { ...s.loading, PUT: false } }),
          CANCELLED: s => ({ ...s, loading: { ...s.loading, PUT: false } })
        }
      }),
      ...(actions[entityName].remove && {
        REMOVE: {
          REQUEST: (s, _a) => ({ ...s, loading: { ...s.loading, REMOVE: false } }),
          SUCCESS: (s, a) => a.payload
            ? ({ ...s, items: s.items.filter(i => i.id !== a.payload as Id), loading: { ...s.loading, REMOVE: true } })
            : ({ ...s, loading: { ...s.loading, REMOVE: true } }),
          FAILED: (s, _a) => ({ ...s, loading: { ...s.loading, REMOVE: false } }),
          CANCELLED: s => ({ ...s, loading: { ...s.loading, REMOVE: false } })
        }
      })
    }
  }, initState);
  return reducer;
}
