import React from 'react';
import { Node } from 'reaflow';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

const minWidth = 100;
const minHeight = 50;

const QuestionBlock: BaseBlockComponent<Props> = (props) => {
  const {
    isPreview = false,
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
QuestionBlock.minWidth = minWidth;
QuestionBlock.minHeight = minHeight;

export default QuestionBlock;
