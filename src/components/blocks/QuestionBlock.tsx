import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';
import { Button } from '@chakra-ui/button';

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
    <Button
      variant="tertiary"
      onClick={onClick}
    >
      Question
    </Button>
  );
};

export default QuestionBlock;
