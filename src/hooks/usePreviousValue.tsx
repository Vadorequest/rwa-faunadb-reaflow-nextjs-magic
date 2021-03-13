import type { MutableRefObject } from 'react';
import {
  useEffect,
  useRef,
} from 'react';

/**
 * Stores the previous value of a variable.
 *
 * Meant to be used with state, props, or other hooks.
 *
 * @example const wasConnected: boolean = usePreviousValue<boolean>(isConnected);
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * @see https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
 */
export function usePreviousValue<T>(value: T): MutableRefObject<T | undefined>['current'] {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
