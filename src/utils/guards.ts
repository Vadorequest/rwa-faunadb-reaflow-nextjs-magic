import NodeDataWithVariableName from '../types/NodeDataWithVariableName';

/**
 * Applies a TypeScript guard check to make sure the variable is of NodeDataWithVariableName type.
 *
 * @param variable
 *
 * @see https://rangle.io/blog/how-to-use-typescript-type-guards/
 */
export const isNodeDataWithVariableName = (variable: any): variable is NodeDataWithVariableName => {
  return (variable as NodeDataWithVariableName).variableName !== undefined;
}

