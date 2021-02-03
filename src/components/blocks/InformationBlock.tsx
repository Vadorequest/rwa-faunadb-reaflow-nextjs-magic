import { css } from '@emotion/react';
import React from 'react';
import { Node } from 'reaflow';
import BaseBlockComponent from '../../types/BaseBlockComponent';
import BaseBlockProps from '../../types/BaseBlockProps';
import BaseBlock from './BaseBlock';

type Props = {} & BaseBlockProps;

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
          width: 200px;
          height: 400px;
        `}
      >
        {
          (event) => {
            return (
              <foreignObject height={event.height} width={event.width} x={30} y={30}>
                <textarea>
                  Some text
                </textarea>
              </foreignObject>
            );
          }
        }
      </Node>
    );
  }
};
InformationBlock.previewText = 'Information';
InformationBlock.type = 'information';

export default InformationBlock;
