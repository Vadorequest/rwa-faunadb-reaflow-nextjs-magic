import {
  atom,
  selector,
} from 'recoil';
import { MouseEntered } from '../types/MouseEntered';

/**
 * Used to know where the mouse/cursor is currently entered. (in which node/port)
 *
 * Might detects the node/port automatically based on the entered port/node counterpart.
 */
export const mouseEnteredState = atom<MouseEntered>({
  key: 'mouseEnteredState',
  default: {},
});

export const mouseEnteredSelector = selector<MouseEntered>({
  key: 'selectedEdgesSelector',
  get: ({ get }): MouseEntered => {
    return get(mouseEnteredState);
  },

  /**
   *
   *
   * @param set
   * @param get
   * @param reset
   * @param newValue
   */
  set: ({ set, get, reset }, newValue): void => {
    console.log('mouseEnteredSelector set', newValue);
    set(mouseEnteredState, newValue);
  },
});
