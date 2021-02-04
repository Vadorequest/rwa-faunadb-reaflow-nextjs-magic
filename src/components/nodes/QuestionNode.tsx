import React from 'react';
import { Node } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import BaseNodeData from '../../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BasePreviewBlock from '../blocks/BasePreviewBlock';

type Props = {
  updateCurrentNode?: (nodeData: Partial<BaseNodeData>) => void;
} & BaseNodeProps;

const defaultWidth = 100;
const defaultHeight = 50;

const QuestionNode: BaseNodeComponent<Props> = (props) => {
  const {
    isPreview = false,
    updateCurrentNode,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BasePreviewBlock>
        Question
      </BasePreviewBlock>
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
    type: 'question',
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
  };
};

export default QuestionNode;
