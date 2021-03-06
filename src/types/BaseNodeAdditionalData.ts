import NodeType from './NodeType';

/**
 * Additional node data properties that are common to all nodes.
 */
export type BaseNodeAdditionalData<Type extends NodeType = NodeType> = {
  /**
   * Each node has a type, which affects how it's rendered (layout, size, etc.).
   *
   * The <NodeRouter> component will dynamically detect the type and render the associated React component (StartNode, InformationNode, etc.).
   */
  type: Type;
};

export default BaseNodeAdditionalData;
