import React from 'react';
import { Node } from 'reaflow';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

const QuestionBlock: BaseBlockComponent<Props> = (props) => {
  const {
    isPreview = true,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BaseBlock>
        Question
      </BaseBlock>
    );
  } else {
    return (
      <Node
        {...rest}
      />
    );
  }
};
QuestionBlock.previewText = 'Question';
QuestionBlock.type = 'question';

export default QuestionBlock;
