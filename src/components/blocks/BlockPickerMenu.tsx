import { css } from '@emotion/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { blockPickerMenuState } from '../../states/blockPickerMenuState';
import BlockPickerMenuState from '../../types/BlockPickerMenu';
import InformationBlock from './InformationBlock';
import QuestionBlock from './QuestionBlock';

type Props = {};

const BlockPickerMenu: React.FunctionComponent<Props> = (props) => {
  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenuState>(blockPickerMenuState);
  const {
    onBlockClick,
    isDisplayed,
    target,
  } = blockPickerMenu;

  if (!isDisplayed) {
    return null;
  }

  console.log('displaying BlockPickerMenu');

  return (
    <div
      className={'block-picker-menu'}
      css={css`
        z-index: 5;
        position: absolute;
        bottom: 0;
        left: calc(50% - 100px);
        width: 200px;
        height: 50px;
        background-color: whitesmoke;

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
          onClick={onBlockClick}
        >
          Information
        </InformationBlock>
        <QuestionBlock
          onClick={onBlockClick}
        />
      </div>
    </div>

  );
};

export default BlockPickerMenu;
