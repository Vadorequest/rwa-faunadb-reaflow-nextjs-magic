import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  PropsWithChildren,
  useState,
} from 'react';
import { PatchCurrentNode } from '../../types/BaseNodeProps';
import NodeDataWithVariableName from '../../types/NodeDataWithVariableName';

type Props<NodeData extends NodeDataWithVariableName = NodeDataWithVariableName> = {
  node: NodeData;
  patchCurrentNode: PatchCurrentNode<NodeData>;
};

/**
 * Input storing the name of the node's "variable name".
 *
 * Some nodes ask for a "variable name" input (text, choice, etc.).
 * The variable name is used in the <SelectVariable> component, to be displayed as a list of variables.
 *
 * Displays at the bottom of the node, in absolute position.
 * Takes full width of the node component it is contained within.
 */
export const VariableNameInput = <NodeData extends NodeDataWithVariableName = NodeDataWithVariableName>(props: PropsWithChildren<Props<NodeData>>): React.ReactElement => {
  const {
    node,
    patchCurrentNode,
  } = props;
  const {
    width = 200,

  } = node;
  const [variableName, setVariableName] = useState<string | undefined>(node?.data?.variableName);
  const [isSaved, setSave] = useState(false);

  const onChange = (event: any) => {
    setSave(false);
    setVariableName(event?.target?.value);
  };

  const onSubmit = () => {
    setSave(true);
    patchCurrentNode({
      data: {
        variableName: variableName,
      },
    } as NodeData);
  };

  return (
    <div
      className={'variable-name-container'}
      css={css`
        position: absolute;
        bottom: 0;
        background-color: black;
        width: ${width}px;
        height: 60px;
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
        
        text{
        fill: #6E6E6E;
        color: #6E6E6E;
        position: relative;
        top: -5px;
        font-size: 0.6em;
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

      {
         isSaved ? (
          <text>
            Saved
          </text>
        ) : (
          <text>
            Unsaved
          </text>
        )
      }
    </div>
  );
};

export default VariableNameInput;
