import { css } from '@emotion/react';
import classnames from 'classnames';
import React, {
  useEffect,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { blockPickerMenuSelector } from '../../states/blockPickerMenuState';
import { OnBlockClick } from '../../types/BlockPickerMenu';
import NodeType from '../../types/NodeType';
import IfBlock from './IfBlock';
import InformationBlock from './InformationBlock';
import QuestionBlock from './QuestionBlock';

type Props = {};

/**
 * Menu where the editor can select (pick) a block amongst a list of blocks.
 *
 * The menu is always displayed using an absolute position, on top of the canvas.
 * It can be displayed either at the bottom of the canvas, or at a specific location.
 * It is usually displayed at the drop location, when dropping an edge.
 */
const BlockPickerMenu: React.FunctionComponent<Props> = (props) => {
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuSelector);
  const {
    onBlockClick,
    isDisplayed,
    displayedFrom,
    top,
    left,
  } = blockPickerMenu;

  const [repeatAnimation, setRepeatAnimation] = useState<boolean>(true);

  /**
   * When the source displaying the menu changes, replay the animations of the component.
   *
   * It toggles the CSS classes injected in the component to force replaying the animations.
   * Uses a short timeout that isn't noticeable to the human eye, but is necessary for the toggle to work properly.
   */
  useEffect(() => {
    setRepeatAnimation(false);
    setTimeout(() => setRepeatAnimation(true), 1);
  }, [displayedFrom]);

  if (!isDisplayed) {
    return null;
  }

  // console.log('displaying BlockPickerMenu');

  /**
   * Called by the specialized blocks upon click.
   *
   * Contains "onClick" business logic that is shared by all blocks.
   *
   * @param nodeType
   */
  const onSpecializedBlockClick: OnBlockClick = (nodeType: NodeType) => {
    if (onBlockClick) {
      // We provide the "blockPickerMenu" so that it is always up-to-date
      // Otherwise, it would be out-of-date when relying on the blockPickerMenu that was bound when creating the onBlockClick function
      onBlockClick(nodeType, blockPickerMenu);

      // Automatically hide the block picker menu once a block has been picked
      setBlockPickerMenu({
        isDisplayed: false,
      });
    }
  };

  return (
    <div
      className={classnames('block-picker-menu', {
        'animate__animated': repeatAnimation,
        'animate__pulse': repeatAnimation,
      })}
      css={css`
        z-index: 5;
        position: absolute;
        top: ${typeof top !== 'undefined' ? `${top}px` : `initial`};
        bottom: ${typeof top !== 'undefined' ? `initial` : `0`};
        left: ${typeof left !== 'undefined' ? `${left}px` : `calc(50% - 100px)`};
        width: 300px;
        height: 58px;
        background-color: white;
        border-radius: 5px;
        padding: 10px;

        .blocks-picker {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-evenly;
        }
      `}
    >
      <div
        className={'blocks-picker'}
      >
        <InformationBlock
          onBlockClick={onSpecializedBlockClick}
        />
        <QuestionBlock
          onBlockClick={onSpecializedBlockClick}
        />
        <IfBlock
          onBlockClick={onSpecializedBlockClick}
        />
      </div>
    </div>
  );
};

export default BlockPickerMenu;
