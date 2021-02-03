import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const { isPreview = true } = props;

  if (isPreview) {
    return (
      <BaseBlock>
        Information
      </BaseBlock>
    );
  } else {
    return (
      <BaseBlock>
        Information
      </BaseBlock>
    );
  }
};
InformationBlock.previewText = 'Information';

export default InformationBlock;
