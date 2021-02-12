import NodeType from './NodeType';

/**
 * Additional node data properties that are common to all nodes.
 */
export type BaseNodeAdditionalData<Type extends NodeType = NodeType> = {
  /**
   * Each node has a type, which affects how it's rendered (layout, size, etc.).
   */
  type: Type;
};

export default BaseNodeAdditionalData;
