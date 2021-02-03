import { css } from '@emotion/react';
import React from 'react';
import { Node } from 'reaflow';
import BaseBlockComponent  from '../../types/BaseBlockComponent';
import { BaseBlockDefaultProps } from '../../types/BaseBlockDefaultProps';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

const minWidth = 200;
const minHeight = 400;

const InformationBlock: BaseBlockComponent<Props> = (props) => {
  const {
    isPreview = false,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BaseBlock>
        Information
      </BaseBlock>
    );
  } else {
    return (
      <Node
        {...rest}
        css={css`
          width: ${minWidth}px;
          height: ${minHeight}px;
        `}
      >
        {
          (event) => {
            // console.log('event', event);
            return (
              <foreignObject width={minWidth} height={minHeight} x={30} y={30}>
                <textarea defaultValue={`Default text`} />
              </foreignObject>
            );
          }
        }
      </Node>
    );
  }
};
InformationBlock.getDefaultNodeProps = (): BaseBlockDefaultProps => {
  return {
    previewText: 'Information',
    type: 'information',
    minWidth: minWidth,
    minHeight: minHeight,
  };
};

export default InformationBlock;
