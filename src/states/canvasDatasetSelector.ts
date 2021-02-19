import {
  DefaultValue,
  selector,
} from 'recoil';
import { CanvasDataset } from '../types/CanvasDataset';
import { hasDuplicates } from '../utils/array';
import { edgesSelector } from './edgesState';
import { nodesSelector } from './nodesState';

/**
 * Custom selector for the atom.
 *
 * Applies custom business logic and sanity check when manipulating the atom.
 */
export const canvasDatasetSelector = selector<CanvasDataset>({
  key: 'canvasDatasetSelector',

  /**
   * Uses the nodes and edges selectors (and not their atoms!) to benefit from their "get" behavior.
   * (which handles the default value)
   *
   * @param get
   */
  get: ({ get }): CanvasDataset => {
    return {
      nodes: get(nodesSelector),
      edges: get(edgesSelector),
    };
  },

  /**
   * Ensures we don't update neither the nodes nor the edges if there are any duplicates in any of both arrays.
   *
   * Helps keeping the dataset consistent (integrity), by avoiding updating only the nodes or only the edges if sanity checks don't pass.
   *
   * XXX It is better to use this selector when updating both edges and nodes at once, to ensure dataset integrity.
   *  (compared to edgesSelector and nodesSelector which would update each of them on their own,
   *  and would break dataset integrity if either of them fail to pass the sanity checks)
   *
   * @param set
   * @param get
   * @param reset
   * @param newValue
   */
  set: ({ set, get, reset }, newValue: DefaultValue | CanvasDataset): void => {
    const nodes = (newValue as CanvasDataset)?.nodes || [];
    const edges = (newValue as CanvasDataset)?.edges || [];
    const hasDuplicateNodes = hasDuplicates(nodes, 'id');
    const hasDuplicateEdges = hasDuplicates(edges, 'id');

    if (!hasDuplicateNodes && !hasDuplicateEdges) {
      console.log('canvasDatasetSelector set', newValue);
      set(nodesSelector, nodes);
      set(edgesSelector, edges);
    } else {
      const message = `Duplicate ids found in "${hasDuplicateNodes ? 'nodes' : ''}" "${hasDuplicateEdges ? 'edges' : ''}", the canvas dataset wasn't updated to avoid to corrupt the dataset.`;
      console.error(message, newValue);
      throw new Error(message);
    }
  },
});
