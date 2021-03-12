import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
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
  const [variableName, setVariableName] = useState<string>(node?.data?.variableName || '');
  const [isModified, setIsModified] = useState(false); // Whether the input has been modified since the last time it was changed
  const [isPristine, setIsPristine] = useState(true); // The input is pristine until any change is made

  const onChange = (event: any) => {
    setVariableName(event?.target?.value);

    // Avoid unnecessary state changes while modifying
    if (!isModified) {
      setIsModified(true);
    }

    // Avoid unnecessary state changes, we only need to run this once
    if (isPristine) {
      setIsPristine(false);
    }
  };

  const onSubmit = () => {
    patchCurrentNode({
      data: {
        variableName: variableName,
      },
    } as NodeData);
    setIsModified(false);
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
          color:  ${isModified ? 'white' : '#6E6E6E'};
          margin-left: 10px;
          cursor: pointer;
          animation: ${isModified ? 'bounce ease 1s infinite' : ''};
        }

        .highlight-info {
          fill: #6E6E6E;
          color: #6E6E6E;
          position: relative;
          top: -5px;
          font-size: 0.6em;
        }

        .fade {
          animation: fadeOut ease 0.4s forwards;
          animation-delay: 2.5s;
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
          
        @keyframes bounce {
          0% {
            transform:scale(1.1);
          }
          50% {
            transform: scale(0.85);
          }
          100% {
            transform: scale(1.1);
          }
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
        !isPristine && !isModified && (
          <span className={'highlight-info fade'}>
            Saved
          </span>
        )
      }
      {
        !isPristine && isModified && (
          <span className={'highlight-info'}>
            Unsaved
          </span>
        )
      }
    </div>
  );
};

export default VariableNameInput;
