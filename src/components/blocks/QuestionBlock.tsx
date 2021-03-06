import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onBlockClick: OnBlockClick;
};

/**
 * When clicking on this block (from the <BlockPickerMenu>), it creates a <QuestionNode> component in the canvas.
 */
const QuestionBlock: BaseBlockComponent<Props> = (props) => {
  const {
    onBlockClick,
  } = props;

  const onClick = () => {
    onBlockClick('question');
  };

  return (
    <div
      onClick={onClick}
    >
      Question
    </div>
  );
};

export default QuestionBlock;
