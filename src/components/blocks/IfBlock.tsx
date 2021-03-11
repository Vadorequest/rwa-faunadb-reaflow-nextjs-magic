import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';
import { Button } from '@chakra-ui/button';

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
    <Button
      variant="tertiary"
      onClick={onClick}
    >
      If/Else
    </Button>
  );
};

export default IfBlock;
