import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

const QuestionBlock: BaseBlockComponent<Props> = (props) => {
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
QuestionBlock.previewText = 'Question';

export default QuestionBlock;
