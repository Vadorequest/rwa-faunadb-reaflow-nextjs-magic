import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onBlockClick: OnBlockClick;
};

const IfBlock: BaseBlockComponent<Props> = (props) => {
  const {
    onBlockClick,
  } = props;

  const onClick = () => {
    onBlockClick('if');
  };

  return (
    <div
      onClick={onClick}
    >
      If/Else
    </div>
  );
};

export default IfBlock;
