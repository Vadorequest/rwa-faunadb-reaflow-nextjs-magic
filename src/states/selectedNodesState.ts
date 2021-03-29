import {
  atom,
  selector,
} from 'recoil';

/**
 * Used to know which nodes (ids) are being selected by the user.
 *
 * Can be a single node, several nodes, or none of them.
 */
export const selectedNodesState = atom<string[]>({
  key: 'selectedNodesState',
  default: [],
});

export const selectedNodesSelector = selector<string[]>({
  key: 'selectedNodesSelector',
  get: ({ get }): string[] => {
    return get(selectedNodesState);
  },

  /**
   * Ensures we don't update the nodes if there are duplicates.
   *
   * @param set
   * @param get
   * @param reset
   * @param newValue
   */
  set: ({ set, get, reset }, newValue): void => {
    set(selectedNodesState, newValue);
  },
});
