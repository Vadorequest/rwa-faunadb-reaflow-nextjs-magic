import {
  atom,
  selector,
} from 'recoil';

/**
 * Used to know which edges (ids) are being selected by the user.
 *
 * Can be a single edge, several edges, or none of them.
 */
export const selectedEdgesState = atom<string[]>({
  key: 'selectedEdgesState',
  default: [],
});

export const selectedEdgesSelector = selector<string[]>({
  key: 'selectedEdgesSelector',
  get: ({ get }): string[] => {
    return get(selectedEdgesState);
  },

  /**
   * Ensures we don't update the edges if there are duplicates.
   *
   * @param set
   * @param get
   * @param reset
   * @param newValue
   */
  set: ({ set, get, reset }, newValue): void => {
    set(selectedEdgesState, newValue);
  },
});
