export function round(number: number) {
  return Math.round(number * 100 / 100);
}

export function monitorEnhancer(createStore: any) {
  return function (reducer: any, initialState: any, enhancer: any) {
    return createStore(monitoredReducer, initialState, enhancer);

    function monitoredReducer(state: any, action: any) {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = round(end - start);

      console.log('reducer process time:', diff);

      return newState;
    }
  }
}