import BaseNodeData from '../BaseNodeData';
import BaseNodeProps, { PatchCurrentNode } from '../BaseNodeProps';

export type SpecializedNodeProps<NodeData extends BaseNodeData = BaseNodeData> = BaseNodeProps<NodeData> & {
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
}
