import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';
import PartialBaseNodeData from './PartialBaseNodeData';

export type PatchCurrentNode<NodeData extends Partial<BaseNodeData> = Partial<BaseNodeData>> = (patch: PartialBaseNodeData) => void;

/**
 * Props received by any *Node component (InformationNode, etc.).
 */
export type BaseNodeProps<NodeData extends BaseNodeData = BaseNodeData> = {
  /**
   * Current node.
   */
  node: NodeData;
} & Partial<NodeProps>;

export default BaseNodeProps;
