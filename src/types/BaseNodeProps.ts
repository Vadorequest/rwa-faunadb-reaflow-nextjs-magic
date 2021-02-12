import { NodeProps } from 'reaflow';
import BaseNodeData from './BaseNodeData';

export type PatchCurrentNode<NodeData extends Partial<BaseNodeData> = Partial<BaseNodeData>> = (patch: Partial<NodeData>) => void;

/**
 * Props received by any *Node component (InformationNode, etc.).
 */
export type BaseNodeProps<NodeData extends BaseNodeData = BaseNodeData> = {
  /**
   * Current node.
   */
  node: NodeData;

  /**
   * Path the properties of the current node.
   *
   * Only updates the provided properties, doesn't update other properties.
   * Also merges the 'data' object, by keeping existing data and only overwriting those that are specified.
   *
   * @param nodeData
   */
  patchCurrentNode: PatchCurrentNode<Partial<NodeData>>;

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
