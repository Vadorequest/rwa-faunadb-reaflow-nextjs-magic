import BaseEdgeData from './BaseEdgeData';
import BaseNodeData from './BaseNodeData';

/**
 * The canvas dataset contains all nodes and edges drawn in the canvas.
 */
export type CanvasDataset = {
  nodes: BaseNodeData[];
  edges: BaseEdgeData[];
}
