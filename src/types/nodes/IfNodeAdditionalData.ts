import BaseNodeAdditionalData from '../BaseNodeAdditionalData';

export type IfNodeAdditionalData = BaseNodeAdditionalData & {
  comparedVariableName?: string;
  expectedVariableName?: string;
  comparisonOperator?: string;
};
