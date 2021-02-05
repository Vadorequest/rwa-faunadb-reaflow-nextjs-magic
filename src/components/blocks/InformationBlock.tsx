import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onClick?: OnBlockClick;
};

const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const { onClick } = props;

  return (
    <div
      onClick={() => onClick && onClick('information')}
    >
      Information
    </div>
  );
};

export default InformationBlock;
