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

  // Dynamically resolve a right padding based on the size of the text to display (moves the text to the left to center it)
  let paddingRightX = (text?.length || 0) * 2; // Padding left 2px per character

  if (paddingRightX > 50) {
    paddingRightX = 50; // Mustn't be higher than 50, otherwise it'll be floating above another node
  }

  return (
    <g transform={`translate(${(x || 0) - paddingRightX}, ${y})`}>
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
