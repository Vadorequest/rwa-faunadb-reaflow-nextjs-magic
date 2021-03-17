import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';
import { QueueCanvasDatasetMutation } from './CanvasDatasetMutation';
import PartialBaseNodeData from './PartialBaseNodeData';

export type PatchCurrentNode<NodeData extends Partial<BaseNodeData> = Partial<BaseNodeData>> = (patch: PartialBaseNodeData, stateUpdateDelay?: number) => void;

/**
 * Props received by any *Node component (InformationNode, etc.).
 */
export type BaseNodeProps<NodeData extends BaseNodeData = BaseNodeData> = {
  /**
   * Current node.
   */
  node: NodeData;

  /**
   * Adds a new patch to apply to the existing queue.
   */
  queueCanvasDatasetMutation: QueueCanvasDatasetMutation;
} & Partial<NodeProps>;

export default BaseNodeProps;
