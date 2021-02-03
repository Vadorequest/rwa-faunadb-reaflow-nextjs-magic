import React from 'react';
import { Node } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps;

const minWidth = 100;
const minHeight = 50;

const QuestionNode: BaseNodeComponent<Props> = (props) => {
  const {
    isPreview = false,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BaseNode>
        Question
      </BaseNode>
    );
  } else {
    return (
      <Node
        {...rest}
      />
    );
  }
};
QuestionNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    previewText: 'Question',
    type: 'question',
    minWidth: minWidth,
    minHeight: minHeight,
  };
};

export default QuestionNode;
