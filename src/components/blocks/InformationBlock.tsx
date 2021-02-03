import React from 'react';
import BaseBlock from './BaseBlock';

type Props = {
  isPreview?: boolean;
}

const InformationBlock: React.FunctionComponent<Props> = (props) => {
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
export default InformationBlock;
