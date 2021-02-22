import BaseNodeData from './BaseNodeData';

/**
 * Node that was created at last, and its timestamp of creation.
 */
export type LastCreated = {
  /**
   * Node that was created last.
   */
  node: BaseNodeData;

  /**
   * Timestamp of creation. (should use lodash.now())
   */
  at: number;
};
