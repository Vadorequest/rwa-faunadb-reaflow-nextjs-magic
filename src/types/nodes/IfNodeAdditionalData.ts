import BaseNodeAdditionalData from '../BaseNodeAdditionalData';

export type IfNodeAdditionalData = BaseNodeAdditionalData & {
  comparedVariableName?: string;
  expectedValue?: string;
  comparisonOperator?: string;
};
