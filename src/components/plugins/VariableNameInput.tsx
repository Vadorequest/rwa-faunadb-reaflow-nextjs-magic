import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  PropsWithChildren,
  useState,
} from 'react';
import BaseNodeData from '../../types/BaseNodeData';
import { PatchCurrentNode } from '../../types/BaseNodeProps';

type Props<NodeData extends BaseNodeData = BaseNodeData> = {
  node: NodeData;
  patchCurrentNode: PatchCurrentNode<NodeData>;
};

/**
 * Input that stores the name of the node's selected value.
 *
 * Some nodes ask for an input (text, choice, etc.), the selected value will be stored and be indexed using the selected variable's name.
 *
 * Displays at the bottom of the node, in absolute position.
 * Takes all the width of the node it is contained witin.
 */
export const VariableNameInput: <NodeData extends BaseNodeData = BaseNodeData>(p: PropsWithChildren<Props<NodeData>>) => React.ReactElement = (props) => {
  const {
    node,
    patchCurrentNode,
  } = props;
  const {
    width = 200,

  } = node;
  console.log('node', node);
  // @ts-ignore
  const [variableName, setVariableName] = useState<string | undefined>(node?.data?.variableName);
  console.log('VariableNameInput variableName', variableName);

  const onChange = (event: any) => {
    console.log('onChange variableName', event, event?.target?.value);
    setVariableName(event?.target?.value);
  };

  const onSubmit = () => {
    console.log('onSubmit variableName', variableName);
    // @ts-ignore
    patchCurrentNode({
      data: {
        variableName: variableName,
      },
    });
  };

  return (
    <div
      className={'variable-name-container'}
      css={css`
        position: absolute;
        bottom: 0;
        background-color: black;
        width: ${width}px;
        height: 50px;
        margin-left: -15px;
        margin-bottom: -15px;
        padding-left: 15px;
        border-radius: 5px;

        .variable-name {
          width: ${width - 50}px;
          margin-top: 12px;
          margin-left: -5px;
          padding-left: 5px;
          background-color: black;
          color: ${variableName?.length ? 'white' : '#6E6E6E'}; // Change different color between placeholder and actual value
          border: 1px solid #6E6E6E;
        }

        .submit {
          color: #6E6E6E;
          margin-left: 10px;
          cursor: pointer;
        }
      `}
    >
      <input
        className={'variable-name'}
        placeholder={'Variable name'}
        value={variableName}
        onChange={onChange}
      />

      <FontAwesomeIcon
        className={'submit'}
        icon={['fas', 'paper-plane']}
        onClick={onSubmit}
      />
    </div>
  );
};

export default VariableNameInput;
