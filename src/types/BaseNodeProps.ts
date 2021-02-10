import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';

/**
 * Props received by any node.
 */
export type BaseNodeProps = {
  /**
   * Updates the properties of the current node.
   *
   * @param nodeData
   */
  updateCurrentNode?: (nodeData: Partial<BaseNodeData>) => void;
} & Partial<NodeProps>;

export default BaseNodeProps;
