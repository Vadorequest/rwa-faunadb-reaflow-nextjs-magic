import BaseNodeAdditionalData from './BaseNodeAdditionalData';
import BaseNodeData from './BaseNodeData';
import Variable from './Variable';

type WithVariableName = {
  /**
   * Variable name used to store the user's response to the question.
   */
  variableName?: Variable['name'];
}

/**
 * BaseNodeData with variable name property.
 *
 * Abstract type used to treat nodes implementing the "variableName" in a particular way.
 * XXX There might be a better/simpler TS implementation for this, but I haven't found any.
 *
 * @see https://stackoverflow.com/questions/66398473/react-typescript-extending-component-with-generic-type-and-reuse-generic-type
 */
export type NodeDataWithVariableName<AdditionalData extends (BaseNodeAdditionalData & WithVariableName) = (BaseNodeAdditionalData & WithVariableName)> =
  BaseNodeData<AdditionalData>
  & WithVariableName;

export default NodeDataWithVariableName;
