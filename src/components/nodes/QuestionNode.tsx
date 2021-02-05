import { css } from '@emotion/react';
import React, { useState } from 'react';
import { OptionTypeBase } from 'react-select/src/types';
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
const defaultHeight = 400;

const QuestionNode: BaseNodeComponent<Props> = (props) => {
  const {
    isPreview = false,
    updateCurrentNode,
    ...rest
  } = props;

  if (isPreview) {
    return (
      <BasePreviewBlock>
        Question
      </BasePreviewBlock>
    );
  } else {
    return (
      <Node
        {...rest}
      >
        {
          (event) => {
            // console.log('event ...rest', rest);
            // console.log('event', event);

            const {
              width,
              height,
            } = event;

            const choiceTypes = [
              {
                value: `text`,
                label: `Text`,
              },
              {
                value: `single-quick-reply`,
                label: `Single quick reply`,
              },
            ];
            const [selectedChoiceType, setSelectedChoiceType] = useState<OptionTypeBase | undefined>(undefined);

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
                className={'question-node-container node-container'}
                width={width}
                height={height}
                x={0}
                y={0}
                css={css`
                  .node {
                    margin: 5px;
                  }

                  .question-text {
                    margin-top: 15px;
                    background-color: #eaeaea;
                  }
                `}
              >
                <div
                  className={'question-node node'}
                >
                  <div
                    className={'node-header question-header'}
                  >
                    Question
                  </div>

                  <div
                    className={'question-text-contained'}
                  >
                    <Textarea
                      className={'question-text'}
                      defaultValue={`Ask something here`}
                      placeholder={'Ask something here'}
                      onHeightChange={onHeightChange}
                    />
                  </div>

                  <div
                    className={'choice-container'}
                  >
                    <div
                      className={'choice-header'}
                    >
                      Choice
                    </div>
                    <div
                      className={'choice-type-select'}
                    >
                      TODO select
                    </div>
                  </div>
                </div>
              </foreignObject>
            );
          }
        }
      </Node>
    );
  }
};
QuestionNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    type: 'question',
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
  };
};

export default QuestionNode;
