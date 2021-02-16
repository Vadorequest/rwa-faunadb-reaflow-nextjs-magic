import BaseNodeAdditionalData from '../BaseNodeAdditionalData';

export type IfNodeAdditionalData = BaseNodeAdditionalData & {
  variable1?: string;
  variable2?: string;
  comparisonOperator?: string;
};
