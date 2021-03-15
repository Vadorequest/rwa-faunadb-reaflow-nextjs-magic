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

  /**
   * Dynamic widths.
   *
   * The width of the node is dynamic and depends on the cumulated width of multiple sources.
   * Storing the width of each source allows to resolve what widths should be used by default (during component initialization)
   * for each part of the node component.
   *
   * Also, it allows to adapt existing nodes when the node default properties change.
   * For instance, if the baseWidth is changed in the future because we add a new feature that takes some space,
   * we'll be able to detect that "dynWidths.baseWidth" is different from the node's "baseWidth" and update the node "dynWidths/.baseWidth",
   * so the new feature will be visible immediately.
   *
   * XXX This property might be extended from specialized components, because each component might calculate its dynamic width differently.
   */
  dynWidths?: {
    baseWidth?: number;
  };

  /**
   * Dynamic heights.
   *
   * The height of the node is dynamic and depends on the cumulated height of multiple sources.
   * Storing the height of each source allows to resolve what heights should be used by default (during component initialization)
   * for each part of the node component.
   *
   * Also, it allows to adapt existing nodes when the node default properties change.
   * For instance, if the baseHeight is changed in the future because we add a new feature that takes some space,
   * we'll be able to detect that "dynHeights.baseWidth" is different from the node's "baseHeight" and update the node "dynHeights/.baseWidth",
   * so the new feature will be visible immediately.
   *
   * XXX This property might be extended from specialized components, because each component might calculate its dynamic height differently.
   */
  dynHeights?: {
    baseHeight?: number;
  };
};

export default BaseNodeAdditionalData;
