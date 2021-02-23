import BasePortData from './BasePortData';
import NodeType from './NodeType';

/**
 * Type of the onBlockClick function.
 *
 * @param blockType
 * @param blockPickerMenu Necessary to ensure we're always manipulating an up-to-date "blockPickerMenu" within the "onBlockClick" function
 */
export type OnBlockClick = (blockType: NodeType, blockPickerMenu?: BlockPickerMenu) => void;

/**
 * The block picker menu is a (floating) menu displaying all available blocks.
 *
 * It can be floating or positioned to the bottom of the page.
 * It is used to create new nodes, by clicking on a block.
 */
export type BlockPickerMenu = {
  /**
   * Element source (node/edge) that initiated the display of the block picker menu.
   *
   * Used to know whether to toggle the display of the block picker menu
   * when clicking upon an element that opens it, or to simply refresh its state.
   *
   * `playground` acts as a default value applying when there is no existing node.
   *
   * @default playground
   */
  displayedFrom?: string | 'playground';

  /**
   * Function executed when a block is clicked.
   *
   * Usually used to create a new node, edges, etc.
   */
  onBlockClick?: OnBlockClick;

  /**
   * Whether the block picker menu is displayed
   */
  isDisplayed: boolean;

  /**
   * Absolute CSS "top" position.
   *
   * If not set, the "bottom" CSS position will be set to "0".
   *
   * @default initial
   */
  top?: number;

  /**
   * Absolute CSS "left" position.
   *
   * @default automatically calculated
   */
  left?: number;

  /**
   * When the menu was opened through a click, contains the event.target.
   */
  eventTarget?: EventTarget;

  /**
   * When the menu was opened through a click on a port, contains the port that was clicked on.
   */
  fromPort?: BasePortData;
}

export default BlockPickerMenu;
