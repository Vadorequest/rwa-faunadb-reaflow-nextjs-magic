import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  nodeWidth: number;
};

/**
 * Input that stores the name of the node's selected value.
 *
 * Some nodes ask for an input (text, choice, etc.), the selected value will be stored and be indexed using the selected variable's name.
 */
export const VariableNameInput: React.FunctionComponent<Props> = (props) => {
  const {
    nodeWidth = 200,
  } = props;

  return (
    <div
      className={'variable-name-container'}
      css={css`
        position: absolute;
        bottom: 0;
        background-color: black;
        width: ${nodeWidth}px;
        height: 50px;
        margin-left: -15px;
        margin-bottom: -15px;
        padding-left: 15px;
        border-radius: 5px;

        .variable-name {
          width: ${nodeWidth - 50}px;
          margin-top: 10px;
          margin-left: -5px;
          padding-left: 5px;
          background-color: black;
          color: #6E6E6E;
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
      />
      <FontAwesomeIcon
        className={'submit'}
        icon={['fas', 'paper-plane']}
      />
    </div>
  );
};

export default VariableNameInput;
