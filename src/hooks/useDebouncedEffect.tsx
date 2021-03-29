import {
  DependencyList,
  useCallback,
  useEffect,
} from 'react';

/**
 * Debounces a React.useEffect function.
 *
 * @param effect
 * @param delay
 * @param deps
 *
 * @see https://stackoverflow.com/a/61127960/2391795
 */
export const useDebouncedEffect = (effect: () => any, delay: number, deps: DependencyList) => {
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
}
