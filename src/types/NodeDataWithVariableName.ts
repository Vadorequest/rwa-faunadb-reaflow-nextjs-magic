import { NodeData } from 'reaflow';
import BaseNodeAdditionalData from './BaseNodeAdditionalData';

type WithVariableName = {
  /**
   * Variable name used to store the user's response to the question.
   */
  variableName?: string;
}

/**
 *
 */
export type NodeDataWithVariableName<AdditionalData extends (BaseNodeAdditionalData & WithVariableName) = (BaseNodeAdditionalData & WithVariableName)> = NodeData<AdditionalData> & WithVariableName;

export default NodeDataWithVariableName;
