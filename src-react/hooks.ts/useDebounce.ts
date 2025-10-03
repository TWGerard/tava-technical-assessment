import { DependencyList, useCallback, useEffect, useRef } from "react";

const useDebounce = (fn: (...args: any) => any, delay: number, deps: DependencyList) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const argsRef = useRef<any>(undefined);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const executeImmediately = () => {
    cancel();
    if (argsRef.current) {
      fn(...argsRef.current);
    }
  };

  useEffect(() => {
    executeImmediately();
    return cancel;
  }, deps);

  return useCallback((...args: Parameters<typeof fn>) => {
    cancel();
    argsRef.current = args;
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  }, deps);
};

export default useDebounce;
