import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';

export type UpdateCurrentNode<NodeData extends Partial<BaseNodeData> = Partial<BaseNodeData>> = (nodeData: NodeData) => void;

/**
 * Props received by any node.
 */
export type BaseNodeProps<NodeData extends BaseNodeData = BaseNodeData> = {
  /**
   * Current node.
   */
  node: NodeData;

  /**
   * Updates the properties of the current node.
   *
   * @param nodeData
   */
  updateCurrentNode: any;

  /**
   * The last created node.
   * Will be undefined if no node was created yet.
   */
  lastCreatedNode?: BaseNodeData | undefined;

  /**
   * Whether the node is being selected.
   */
  isSelected: boolean;
} & Partial<NodeProps>;

export default BaseNodeProps;
