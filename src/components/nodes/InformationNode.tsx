import { css } from '@emotion/react';
import React from 'react';
import { Node } from 'reaflow';
import BaseNodeComponent  from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps;

const minWidth = 200;
const minHeight = 400;

const InformationNode: BaseNodeComponent<Props> = (props) => {
  const {
    isPreview = false,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BaseNode>
        Information
      </BaseNode>
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
InformationNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    previewText: 'Information',
    type: 'information',
    minWidth: minWidth,
    minHeight: minHeight,
  };
};

export default InformationNode;
