import React from 'react';
import BlockComponent from '../../types/BlockComponent';
import BaseBlock from './BaseBlock';

type Props = {
  isPreview?: boolean;
}

const QuestionBlock: BlockComponent<Props> = (props) => {
  const { isPreview = true } = props;

  if (isPreview) {
    return (
      <BaseBlock>
        Question
      </BaseBlock>
    );
  } else {
    return (
      <BaseBlock>
        Question
      </BaseBlock>
    );
  }
};
QuestionBlock.defaultName = 'Question';

export default QuestionBlock;
