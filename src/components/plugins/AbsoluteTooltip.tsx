import { Tooltip } from '@chakra-ui/react';
import { css } from '@emotion/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { absoluteTooltipState } from '../../states/absoluteTooltipState';

type Props = {};

/**
 * Tooltip displayed in absolute position.
 *
 * Displays on top of the canvas.
 */
export const AbsoluteTooltip: React.FunctionComponent<Props> = (props) => {
  const [tooltip, setTooltip] = useRecoilState(absoluteTooltipState);

  return (
    <div
      className={'absolute-tooltip'}
      css={css`
        // ChakraUI Tooltip component doesn't support absolute position natively
        // This component wraps the <Tooltip> component and display it in absolute position
        position: absolute;
        left: ${(tooltip?.x || 0)}px;
        top: ${(tooltip?.y || 0)}px;
      `}
    >
      {
        tooltip?.isDisplayed && (
          <Tooltip
            label={tooltip?.text}
            // Automatically opens the tooltip (uncontrolled)
            isOpen={true}
          >
            &nbsp;
          </Tooltip>
        )
      }
    </div>
  );
};

export default AbsoluteTooltip;
