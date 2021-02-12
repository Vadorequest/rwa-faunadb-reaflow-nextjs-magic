import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';

export type UpdateCurrentNode = (nodeData: Partial<BaseNodeData>) => void;

/**
 * Props received by any node.
 */
export type BaseNodeProps = {
  /**
   * Updates the properties of the current node.
   *
   * @param nodeData
   */
  updateCurrentNode: UpdateCurrentNode;

  /**
   * The last created node.
   * Will be undefined if no node was created yet.
   */
  lastCreatedNode?: BaseNodeData | undefined;
} & Partial<NodeProps>;

export default BaseNodeProps;
