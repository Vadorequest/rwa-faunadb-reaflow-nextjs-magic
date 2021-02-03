import React from 'react';
import BlockComponent from '../../types/BlockComponent';
import BlockProps from '../../types/BlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BlockProps;

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
