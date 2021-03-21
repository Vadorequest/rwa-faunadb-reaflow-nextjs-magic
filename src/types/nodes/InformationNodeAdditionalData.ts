import BaseNodeAdditionalData from '../BaseNodeAdditionalData';

/**
 * Additional "node.data" for the "InformationNodeData" type.
 */
export type InformationNodeAdditionalData = BaseNodeAdditionalData & {
  informationText?: string;
};
