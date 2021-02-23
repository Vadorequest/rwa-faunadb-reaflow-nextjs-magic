import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onBlockClick: OnBlockClick;
};

const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const {
    onBlockClick,
  } = props;

  const onClick = () => {
    onBlockClick('information');
  };

  return (
    <div
      onClick={onClick}
    >
      Information
    </div>
  );
};

export default InformationBlock;
