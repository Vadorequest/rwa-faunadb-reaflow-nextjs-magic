import BaseNodeAdditionalData from '../BaseNodeAdditionalData';
import BaseNodeData from '../BaseNodeData';

export type InformationNodeAdditionalData = BaseNodeData<BaseNodeAdditionalData & {
  text?: string;
}>;
