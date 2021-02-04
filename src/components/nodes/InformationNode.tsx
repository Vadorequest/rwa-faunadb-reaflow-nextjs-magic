import { css } from '@emotion/react';
import React from 'react';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { Node } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import BaseNodeData from '../../types/BaseNodeData';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BasePreviewBlock from '../blocks/BasePreviewBlock';
import Textarea from '../plugins/Textarea';

type Props = {
  updateCurrentNode?: (nodeData: Partial<BaseNodeData>) => void;
} & BaseNodeProps;

const defaultWidth = 200;
const defaultHeight = 100;

const InformationNode: BaseNodeComponent<Props> = (props) => {
  const {
    isPreview = false,
    updateCurrentNode,
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
            console.log('event ...rest', rest);
            console.log('event', event);

            /**
             * When textarea input height changes, we need to increase the height of the element accordingly.
             *
             * @param height
             * @param meta
             */
            const onHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
              // Only consider additional height, by ignoring the height of the first row
              const additionalHeight = height - meta.rowHeight;

              if (updateCurrentNode) {
                updateCurrentNode({
                  height: defaultHeight + additionalHeight,
                });
              }
            };

            return (
              <foreignObject
                className={'information-node-container node-container'}
                width={defaultWidth}
                height={defaultHeight}
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
                  <Textarea
                    className={'information-text'}
                    defaultValue={`Default text`}
                    placeholder={'Text here'}
                    onHeightChange={onHeightChange}
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
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
  };
};

export default InformationNode;
