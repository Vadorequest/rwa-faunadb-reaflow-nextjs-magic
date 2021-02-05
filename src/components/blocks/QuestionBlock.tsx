import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onClick?: OnBlockClick;
};

const QuestionBlock: BaseBlockComponent<Props> = (props) => {
  const { onClick } = props;

  return (
    <div
      onClick={() => onClick && onClick('question')}
    >
      Question
    </div>
  );
};

export default QuestionBlock;
