import { useState, useEffect } from 'react';

import { GLOBAL_CONFIGS } from '../configs';

const useDebounce = (text: string, delay: number = GLOBAL_CONFIGS.REACT_APP_DEBOUNCE_TIME) => {
  const [debounced, setDebounced] = useState<string>(text);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(text);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [text, delay]);

  return debounced;
};

export default useDebounce;
