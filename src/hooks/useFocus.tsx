import {
  MutableRefObject,
  useRef,
} from 'react';

/**
 * Hook to help control input focus dynamically.
 *
 * @example
 *  const [inputRef, setInputFocus] = useFocus()
 *  <input ref={inputRef} />
 *
 * @see https://stackoverflow.com/a/54159564/2391795
 */
const useFocus = (): [any, () => void] => {
  const htmlElRef: MutableRefObject<any> = useRef(null);
  const setFocus = (): void => {
    htmlElRef?.current?.focus?.();
  };

  return [htmlElRef, setFocus];
};

export default useFocus;
