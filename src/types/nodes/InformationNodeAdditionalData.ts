import BaseNodeAdditionalData from '../BaseNodeAdditionalData';

/**
 * Additional "node.data" for the "InformationNodeData" type.
 */
export type InformationNodeAdditionalData = BaseNodeAdditionalData & {
  /**
   * Text displayed as an information.
   */
  informationText?: string;

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
   */
  dynHeights?: BaseNodeAdditionalData['dynHeights'] & {
    informationTextareaHeight?: number;
  }
};
