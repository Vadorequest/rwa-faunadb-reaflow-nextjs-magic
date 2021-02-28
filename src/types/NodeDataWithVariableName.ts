import { NodeData } from 'reaflow';
import BaseNodeAdditionalData from './BaseNodeAdditionalData';
import Variable from './Variable';

type WithVariableName = {
  /**
   * Variable name used to store the user's response to the question.
   */
  variableName?: Variable['name'];
}

/**
 *
 */
export type NodeDataWithVariableName<AdditionalData extends (BaseNodeAdditionalData & WithVariableName) = (BaseNodeAdditionalData & WithVariableName)> = NodeData<AdditionalData> & WithVariableName;

export default NodeDataWithVariableName;
