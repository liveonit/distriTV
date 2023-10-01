import React from 'react';

export const useTraceUpdate = (type: 'props' | 'state', props: any) => {
  const prev = React.useRef(props);
  React.useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps: any, [k, v]: any[]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log(`Changed ${type}:`, changedProps);
    }
    prev.current = props;
  });
};
