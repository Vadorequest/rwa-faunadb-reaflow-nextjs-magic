import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import BasePortChildProps from '../../types/BasePortChildProps';

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
  } = props;

  if (isReachable) {
    return null;
  }

  return (
    <foreignObject
      width={100} // Content width will be limited by the width of the foreignObject
      height={60}
      x={props?.x}
      y={props?.y}
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
      >
        <div
          title={`This node is not reachable because there are no edge connected to its entry port.`}
        >
          <FontAwesomeIcon
            icon={['fas', 'exclamation-triangle']}
          />
        </div>
      </div>
    </foreignObject>
  );
};

export default BasePortChild;
