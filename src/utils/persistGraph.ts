import BaseEdgeData from '../types/BaseEdgeData';
import BaseNodeData from '../types/BaseNodeData';

const LS_NS = 'reaflow-graph';

/**
 * Gets the graph data from the localstorage.
 */
export const getGraphDataFromLS = (): { nodes?: BaseNodeData[], edges?: BaseEdgeData[] } => {
  const data = localStorage.getItem(LS_NS);

  if (!data) {
    return {};
  } else {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};

/**
 * Persists the graph data in the localstorage.
 *
 * @param nodes
 * @param edges
 */
export const persistGraphDataInLS = (nodes: BaseNodeData[], edges: BaseEdgeData[]): void => {
  console.log('persistGraphDataInLS', nodes, edges);
  localStorage.setItem(LS_NS, JSON.stringify({
    nodes,
    edges,
  }));
};
