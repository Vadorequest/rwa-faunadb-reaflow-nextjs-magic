import {
  atom,
  selector,
} from 'recoil';
import { MouseEntered } from '../types/MouseEntered';

/**
 * Used to know where the mouse/cursor is currently entered. (in which node/port)
 *
 * Might detects the node/port automatically based on the entered port/node counterpart.
 *
 * XXX Behaved erratically (because of <foreignObject> complex structure), isn't reliable
 */
export const mouseEnteredState = atom<MouseEntered>({
  key: 'mouseEnteredState',
  default: {},
});

/**
 * XXX It was an experiment which didn't work out due to other concerns.
 *  Unused for now, might be useful later on.
 *
 * @deprecated
 */
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
    set(mouseEnteredState, newValue);
  },
});
