import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onBlockClick: OnBlockClick;
};

/**
 * When clicking on this block (from the <BlockPickerMenu>), it creates a <IfNode> component in the canvas.
 */
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
