import BaseNodeAdditionalData from '../BaseNodeAdditionalData';

/**
 * Additional "node.data" for the "IfNodeData" type.
 */
export type IfNodeAdditionalData = BaseNodeAdditionalData & {
  comparedVariableName?: string;
  expectedValue?: string;
  comparisonOperator?: string;
};
