import {
  atom,
  selector,
} from 'recoil';
import BaseEdgeData from '../types/BaseEdgeData';
import { hasDuplicates } from '../utils/array';

const initialEdges: BaseEdgeData[] = [];

/**
 * Used to know what are the edges currently displayed within the Canvas component.
 */
export const edgesState = atom<BaseEdgeData[]>({
  key: 'edgesState',
  default: initialEdges,
});

/**
 * Custom selector for the atom.
 *
 * Applies custom business logic and sanity check when manipulating the atom.
 */
export const edgesSelector = selector<BaseEdgeData[]>({
  key: 'edgesSelector',
  get: ({ get }): BaseEdgeData[] => {
    return get(edgesState) || [];
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
    const hasDuplicateEdges = hasDuplicates(newValue as BaseEdgeData[], 'id');

    if (!hasDuplicateEdges) {
      set(edgesState, newValue);
    } else {
      const message = `Duplicate edge ids found, the edges weren't updated to avoid to corrupt the dataset.`;
      console.error(message, newValue);
      throw new Error(message);
    }
  },
});
