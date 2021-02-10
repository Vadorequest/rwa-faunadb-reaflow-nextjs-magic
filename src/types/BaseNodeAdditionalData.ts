import NodeType from './NodeType';

/**
 * Additional node data properties specific to our application.
 */
export type BaseNodeAdditionalData = {
  /**
   * Each node has a type, which affects how it's rendered (layout, size, etc.).
   */
  type: NodeType;
};

export default BaseNodeAdditionalData;
