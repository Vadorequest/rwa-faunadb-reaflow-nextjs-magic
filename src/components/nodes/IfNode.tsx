import React, { Fragment } from 'react';
import ReactSelect from 'react-select';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BasePortData from '../../types/BasePortData';
import { IfNodeData } from '../../types/nodes/IfNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';
import { createPort } from '../../utils/ports';
import SelectVariable, { OnSelectedVariableChange } from '../plugins/SelectVariable';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<IfNodeData>;

const nodeType: NodeType = 'if';
const defaultWidth = 200;
const defaultHeight = 200;

/**
 * If/Else node.
 *
 * Used to split the workflow depending on the result of comparison between 2 variables.
 *
 * Displays inputs and select to defined how the variable1 should be compared to the variable2.
 * Has one west port and two east ports.
 * The west port allows unlimited links to other nodes.
 * The east port allows only one link to another node. (TODO not enforced yet)
 */
const IfNode: BaseNodeComponent<Props> = (props) => {
  return (
    <BaseNode
      {...props}
    >
      {
        (nodeProps: SpecializedNodeProps<IfNodeData>) => {
          const {
            node,
            patchCurrentNode,
          } = nodeProps;

          /**
           * Updates the current node "comparedVariableName" value.
           *
           * @param selectedOption
           * @param actionMeta
           */
          const onSelectedComparedVariableChange: OnSelectedVariableChange = (selectedOption: ReactSelectDefaultOption, actionMeta) => {
            const newValue = selectedOption.value;

            // Updates the value in the Recoil store
            patchCurrentNode({
              data: {
                comparedVariableName: newValue,
              },
            } as IfNodeData);
          };

          return (
            <Fragment>
              <div
                className={`node-header ${nodeType}-header`}
              >
                If
              </div>

              <div
                className={`node-content ${nodeType}-content`}
              >
                <SelectVariable
                  selectedVariableName={node?.data?.comparedVariableName}
                  onSelectedVariableChange={onSelectedComparedVariableChange}
                />

                Else
              </div>
            </Fragment>
          );
        }
      }
    </BaseNode>
  );
};

IfNode.getDefaultPorts = (): BasePortData[] => {
  return [
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'WEST',
    }),
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'EAST',
      className: 'port-if-true',
    }),
    createPort({
      height: settings.canvas.ports.radius,
      width: settings.canvas.ports.radius,
      alignment: 'CENTER',
      side: 'EAST',
      className: 'port-if-false',
    }),
  ];
};

IfNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    type: nodeType,
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
    // @ts-ignore
    ports: IfNode.getDefaultPorts(),
  };
};

export default IfNode;
