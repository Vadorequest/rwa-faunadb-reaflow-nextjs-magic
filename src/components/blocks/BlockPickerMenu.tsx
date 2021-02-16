import { css } from '@emotion/react';
import classnames from 'classnames';
import React, {
  useEffect,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import InformationBlock from './InformationBlock';
import QuestionBlock from './QuestionBlock';

type Props = {};

const BlockPickerMenu: React.FunctionComponent<Props> = (props) => {
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState(blockPickerMenuState);
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

  console.log('displaying BlockPickerMenu');

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
        width: 200px;
        height: 50px;
        background-color: white;
        border-radius: 5px;
        padding: 10px;

        .blocks-picker {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-evenly;

          div {
            padding: 5px;
            border: 1px solid;
            cursor: pointer;
          }
        }
      `}
    >
      <div
        className={'blocks-picker'}
      >
        <InformationBlock
          onBlockClick={onBlockClick}
          setBlockPickerMenu={setBlockPickerMenu}
        >
          Information
        </InformationBlock>
        <QuestionBlock
          onBlockClick={onBlockClick}
          setBlockPickerMenu={setBlockPickerMenu}
        />
      </div>
    </div>
  );
};

export default BlockPickerMenu;
