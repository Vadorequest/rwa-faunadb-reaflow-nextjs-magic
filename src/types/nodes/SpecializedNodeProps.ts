import { NodeChildProps } from 'reaflow';
import BaseNodeData from '../BaseNodeData';
import { PatchCurrentNode } from '../BaseNodeProps';
import { QueueCanvasDatasetMutation } from '../CanvasDatasetMutation';
import { LastCreated } from '../LastCreated';

/**
 * A SpecializedNodeProps is a generic type that extends the BaseNodeData, with additional properties common to all specialized nodes.
 */
export type SpecializedNodeProps<NodeData extends BaseNodeData = BaseNodeData> = Omit<NodeChildProps, 'node'> & {
  /**
   * Current node data.
   */
  node: NodeData;

  /**
   * Path the properties of the current node.
   *
   * Only updates the provided properties (deep merge), doesn't update other properties.
   *
   * @param nodeData
   */
  patchCurrentNode: PatchCurrentNode<Partial<NodeData>>;

  /**
   * Identical to patchCurrentNode, but isn't being debounced and will execute immediately.
   *
   * "patchCurrentNode" is a better option for anything that might happen in a burst (e.g: text input "onChange" event).
   *
   * @param nodeData
   */
  patchCurrentNodeImmediately: PatchCurrentNode<Partial<NodeData>>;

  /**
   * The last created node and its time of creation.
   * Will be undefined if no node was created yet.
   */
  lastCreated?: LastCreated | undefined;

  /**
   * Whether the node is being selected.
   */
  isSelected: boolean;

  /**
   * Whether the node can be reached.
   */
  isReachable: boolean;

  /**
   * TODO
   */
  queueCanvasDatasetMutation: QueueCanvasDatasetMutation;

}
