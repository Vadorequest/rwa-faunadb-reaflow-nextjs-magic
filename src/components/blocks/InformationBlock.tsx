import React from 'react';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import { OnBlockClick } from '../../types/BlockPickerMenu';
import { Button } from '@chakra-ui/button';

type Props = {
  onBlockClick: OnBlockClick;
};

/**
 * When clicking on this block (from the <BlockPickerMenu>), it creates a <InformationNode> component in the canvas.
 */
const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const {
    onBlockClick,
  } = props;

  const onClick = () => {
    onBlockClick('information');
  };

  return (
    <Button
      variant="tertiary"
      onClick={onClick}
    >
      Information
    </Button>
  );
};

export default InformationBlock;
