import { useEffect, useRef } from 'react';

const useDebounce = (callback, delay) => {
  const callbackRef = useRef(callback);
  const timerIdRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = (...args) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }
    timerIdRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };

  return debouncedCallback;
};

export default useDebounce;
