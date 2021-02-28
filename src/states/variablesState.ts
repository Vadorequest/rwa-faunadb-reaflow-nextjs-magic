import capitalize from 'lodash.capitalize';
import { selector } from 'recoil';
import BaseNodeData from '../types/BaseNodeData';
import Variable from '../types/Variable';
import { isNodeDataWithVariableName } from '../utils/guards';
import { nodesSelector } from './nodesState';

/**
 * Builds the list of variables based on the variables used by nodes.
 *
 * This makes sure the list of variables that are displayed in "If" selects are always up-to-date with variable names used in Question nodes.
 * Doesn't allow manual mutation.
 */
export const variablesSelector = selector<Variable[]>({
  key: 'variablesSelector',
  get: ({ get }): Variable[] => {
    const currentNodes: BaseNodeData[] = get(nodesSelector) as BaseNodeData[];
    const variableNamesFromNodes: Variable[] = (currentNodes
      ?.map((node: BaseNodeData): Variable | undefined => {
        if (isNodeDataWithVariableName(node?.data)) {
          return {
            name: node?.data?.variableName as string,
            label: capitalize(node?.data?.variableName) as string,
          };
        } else {
          return undefined;
        }
      }) as Variable[] | undefined)
      ?.filter((variable: Variable) => typeof variable !== 'undefined') as Variable[];

    return variableNamesFromNodes || [];
  },

  set: ({ set, get, reset }, newValue): void => {
    throw new Error(`It is forbidden to set the variables manually, because they're resolved dynamically from nodes directly.`);
  },
});
