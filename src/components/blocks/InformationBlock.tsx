import React from 'react';
import { Node } from 'reaflow';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const {
    isPreview = false,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BaseBlock>
        Information
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
InformationBlock.previewText = 'Information';
InformationBlock.type = 'information';

export default InformationBlock;
