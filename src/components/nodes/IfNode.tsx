import { css } from '@emotion/react';
import React, { Fragment } from 'react';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BasePortData from '../../types/BasePortData';
import { IfNodeData } from '../../types/nodes/IfNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import { OnSelectedOptionChange } from '../../types/OnSelectedOptionChange';
import { ReactSelectDefaultOption } from '../../types/ReactSelect';
import { createPort } from '../../utils/ports';
import SelectComparisonOperator from '../plugins/SelectComparisonOperator';
import SelectExpectedValue from '../plugins/SelectExpectedValue';
import SelectVariable from '../plugins/SelectVariable';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<IfNodeData>;

const nodeType: NodeType = 'if';
const defaultWidth = 300;
const defaultHeight = 300;

/**
 * If/Else node.
 *
 * Used to split the workflow depending on the result of comparison between 2 variables.
 *
 * Displays 3 select inputs to define how the compared variable should be compared to the expected value.
 * Has one west port and two east ports.
 * The west port allows unlimited links to other nodes.
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
          const onSelectedComparedVariableChange: OnSelectedOptionChange = (selectedOption: ReactSelectDefaultOption | undefined, actionMeta) => {
            const newValue = selectedOption?.value;

            // Do not update when the value isn't different
            if (newValue !== node?.data?.comparedVariableName) {
              // Updates the value in the Recoil store
              patchCurrentNode({
                data: {
                  comparedVariableName: newValue,
                },
              } as IfNodeData);
            }
          };

          /**
           * Updates the current node "comparisonOperator" value.
           *
           * @param selectedOption
           * @param actionMeta
           */
          const onSelectedComparedComparisonOperatorChange: OnSelectedOptionChange = (selectedOption: ReactSelectDefaultOption | undefined, actionMeta) => {
            const newValue = selectedOption?.value;

            // Do not update when the value isn't different
            if (newValue !== node?.data?.comparisonOperator) {
              // Updates the value in the Recoil store
              patchCurrentNode({
                data: {
                  comparisonOperator: newValue,
                },
              } as IfNodeData);
            }
          };

          /**
           * Updates the current node "expectedValue" value.
           *
           * @param selectedOption
           * @param actionMeta
           */
          const onSelectedComparisonChange: OnSelectedOptionChange = (selectedOption: ReactSelectDefaultOption | undefined, actionMeta) => {
            const newValue = selectedOption?.value;

            // Do not update when the value isn't different
            if (newValue !== node?.data?.expectedValue) {
              // Updates the value in the Recoil store
              patchCurrentNode({
                data: {
                  expectedValue: newValue,
                },
              } as IfNodeData);
            }
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
                css={css`
                  .select {
                    margin-top: 10px;
                    margin-bottom: 10px;
                  }
                `}
              >
                <SelectVariable
                  selectedVariableName={node?.data?.comparedVariableName}
                  onSelectedVariableChange={onSelectedComparedVariableChange}
                  placeholder={'Variable to compare'}
                />

                <SelectComparisonOperator
                  selectedComparisonOperatorName={node?.data?.comparisonOperator}
                  onSelectedComparisonOperatorChange={onSelectedComparedComparisonOperatorChange}
                  placeholder={'Comparison operator'}
                />

                <SelectExpectedValue
                  selectedComparedVariableName={node?.data?.comparedVariableName}
                  selectedExpectedValue={node?.data?.expectedValue}
                  onSelectedComparisonChange={onSelectedComparisonChange}
                  placeholder={'Compared to expected value'}
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
