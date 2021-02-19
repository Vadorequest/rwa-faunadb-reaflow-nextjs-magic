import {
  atom,
  selector,
} from 'recoil';
import BaseNodeData from '../types/BaseNodeData';
import { hasDuplicates } from '../utils/array';

/**
 * Used to know what are the nodes currently displayed within the Canvas component.
 */
export const nodesState = atom<BaseNodeData[] | undefined>({
  key: 'nodesState',
  default: undefined,
});

/**
 * Custom selector for the atom.
 *
 * Applies custom business logic and sanity check when manipulating the atom.
 */
export const nodesSelector = selector<BaseNodeData[]>({
  key: 'nodesSelector',
  get: ({ get }): BaseNodeData[] => {
    const currentNodes: BaseNodeData[] | undefined = get(nodesState);

    if (typeof currentNodes === 'undefined') {
      return window.initialCanvasDataset?.nodes || [];
    } else {
      return currentNodes;
    }
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
    const hasDuplicateNodes = hasDuplicates(newValue as BaseNodeData[], 'id');

    if (!hasDuplicateNodes) {
      console.log('nodesSelector set', newValue);
      set(nodesState, newValue);
    } else {
      const message = `Duplicate node ids found, the nodes weren't updated to avoid to corrupt the dataset.`;
      console.error(message, newValue);
      throw new Error(message);
    }
  },
});
