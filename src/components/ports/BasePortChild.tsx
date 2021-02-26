import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useRecoilState } from 'recoil';
import { absoluteTooltipState } from '../../states/absoluteTooltipState';
import BasePortChildProps from '../../types/BasePortChildProps';
import { translateXYToCanvasPosition } from '../../utils/canvas';

/**
 * Each <BasePort> component contains on <BasePortChild> component provided through the "PortChildComponent" property.
 *
 * The BasePortChild is a <foreignObject> which displays additional content, such as:
 * - A warning when an entry port is not reachable.
 * - A warning when an output port is not connected.
 */
const BasePortChild: React.FunctionComponent<BasePortChildProps> = (props) => {
  const {
    isReachable,
    port,
    x,
    y,
  } = props;

  if (isReachable) {
    return null;
  }

  const [tooltip, setTooltip] = useRecoilState(absoluteTooltipState);
  const newX = x + (port?.side === 'WEST' ? -40 : 20);
  const newY = y - 10;

  return (
    <foreignObject
      // Content width/height will be limited by the width of the foreignObject
      width={30}
      height={30}
      x={newX}
      y={newY}
      css={css`
        position: absolute;
        color: black;
        z-index: 1;

        .port-content {
          position: fixed;
          cursor: help;
          pointer-events: auto;
        }

        .svg-inline--fa {
          color: orange;
        }
      `}
    >
      <div
        className={'port-content'}
        onMouseEnter={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
          const [x, y] = translateXYToCanvasPosition(event.clientX, event.clientY);

          // Displays a tooltip in absolute position based on the X/Y position of the targeted element
          setTooltip({
            isDisplayed: true,
            text: `This node is not reachable because there are no edge connected to its entry port.`,
            x,
            y,
          });
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
          // Hides the tooltip
          setTooltip({
            isDisplayed: false,
          });
        }}
      >
        <FontAwesomeIcon
          icon={['fas', 'exclamation-triangle']}
        />
      </div>


    </foreignObject>
  );
};

export default BasePortChild;
