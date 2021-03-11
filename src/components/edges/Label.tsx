import { css } from '@emotion/react';
import classNames from 'classnames';
import React, { FC } from 'react';
import { LabelProps } from 'reaflow';

const Label: FC<Partial<LabelProps>> = (props) => {
  const {
    text,
    x,
    y,
    style,
    className,
    originalText,
  } = props;

  const offsetY = -20; // Make label displays below the edge line
  // Dynamically resolve a right offset based on the size of the text to display (moves the text to the left to center it)
  let offsetX = (text?.length || 0) * 2; // Padding left 2px per character

  if (offsetX > 50) {
    offsetX = 50; // Mustn't be higher than 50, otherwise it'll be floating above another node
  }

  return (
    <g
      transform={`translate(${(x || 0) - offsetX}, ${(y || 0) - offsetY})`}
      css={css`
        text {
          fill: #898989;
        }
      `}
    >
      <title>{originalText}</title>
      <text
        className={classNames('label', className)}
        style={style}
      >
        {text}
      </text>
    </g>
  );
};

export default Label;
