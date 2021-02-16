import React from 'react';
import { SetterOrUpdater } from 'recoil';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BlockPickerMenu, { OnBlockClick } from '../../types/BlockPickerMenu';

type Props = {
  onBlockClick?: OnBlockClick;
  setBlockPickerMenu: SetterOrUpdater<BlockPickerMenu>;
};

const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const {
    onBlockClick,
    setBlockPickerMenu,
  } = props;

  const onClick = () => {
    if (onBlockClick) {
      onBlockClick('information');

      // Automatically hide the block picker menu once a block has been picked
      setBlockPickerMenu({
        isDisplayed: false,
      });
    }
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
