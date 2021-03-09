import { v1 as uuid } from 'uuid';
import BaseEdgeData from '../types/BaseEdgeData';
import BaseNodeData from '../types/BaseNodeData';
import BasePortData from '../types/BasePortData';

/**
 * Creates a new edge and returns it.
 *
 * Optionally links it to a port.
 *
 * @param fromNode
 * @param toNode
 * @param fromPort
 * @param toPort
 * @param edgeData
 */
export const createEdge = (fromNode?: BaseNodeData, toNode?: BaseNodeData, fromPort?: Partial<BasePortData>, toPort?: Partial<BasePortData>, edgeData?: Partial<BaseEdgeData>): BaseEdgeData => {
  let { id = uuid() } = edgeData || {};

  const newEdge = {
    text: 'Label plus grand', // Use a space to increase the distance between nodes, which ease edge's selection
    ...edgeData,
    id,
    from: fromNode?.id,
    to: toNode?.id,
    parent: fromNode?.parent,
    fromPort: fromPort?.id,
    toPort: toPort?.id,
  };
  console.log('createEdge newEdge', newEdge);

  return newEdge;
};
