import BaseNodeType from './BaseNodeType';

export type BlockPickerMenuTarget = {
  x: number;
  y: number;
  size?: number;
};

export type OnBlockClick = (nodeType: BaseNodeType) => void;

export type BlockPickerMenu = {
  target?: BlockPickerMenuTarget;
  onBlockClick?: OnBlockClick;
  isDisplayed: boolean;
}

export default BlockPickerMenu;
