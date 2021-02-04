import { css } from '@emotion/react';
import React from 'react';
import { Node } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BasePreviewBlock from '../blocks/BasePreviewBlock';

type Props = {} & BaseNodeProps;

const minWidth = 200;
const minHeight = 100;

const InformationNode: BaseNodeComponent<Props> = (props) => {
  const {
    isPreview = false,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BasePreviewBlock>
        Information
      </BasePreviewBlock>
    );
  } else {
    return (
      <Node
        {...rest}
      >
        {
          (event) => {
            // console.log('event', event);
            return (
              <foreignObject
                className={'information-node-container node-container'}
                width={minWidth}
                height={minHeight}
                x={0}
                y={0}
                css={css`
                  .node {
                    margin: 5px;
                  }

                  .information-text {
                    margin-top: 15px;
                    background-color: #eaeaea;
                  }
                `}
              >
                <div
                  className={'information-node node'}
                >
                  <div
                    className={'node-header information-header'}
                  >
                    Information
                  </div>
                  <textarea
                    className={'information-text'}
                    defaultValue={`Default text`}
                    placeholder={'Text here'}
                  />
                </div>
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
