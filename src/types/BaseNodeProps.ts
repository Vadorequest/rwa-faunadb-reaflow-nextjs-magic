import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';

/**
 * Props received by any node.
 */
export type BaseNodeProps = {
  updateCurrentNode?: (nodeData: Partial<BaseNodeData>) => void;
} & Partial<NodeProps>;

export default BaseNodeProps;
