import { NodeChildProps } from 'reaflow';
import BaseNodeData from '../BaseNodeData';
import { PatchCurrentNode } from '../BaseNodeProps';

export type SpecializedNodeProps<NodeData extends BaseNodeData = BaseNodeData> = Omit<NodeChildProps, 'node'> & {
  /**
   * Current node data.
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
   * Whether the node is being selected.
   */
  isSelected: boolean;

  /**
   * Whether the node can be reached.
   */
  isReachable: boolean;
}
