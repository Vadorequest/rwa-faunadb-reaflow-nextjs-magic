import BaseNodeType from './BaseNodeType';

export type BlockPickerMenuTarget = {
  x: number;
  y: number;
  size?: number;
};

export type OnBlockClick = (blockType: BaseNodeType) => void;

export type BlockPickerMenu = {
  target?: BlockPickerMenuTarget;
  onBlockClick?: OnBlockClick;
  isDisplayed: boolean;
  top?: number;
  left?: number;
}

export default BlockPickerMenu;
