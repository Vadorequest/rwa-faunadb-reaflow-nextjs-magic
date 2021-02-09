import React, {
  Fragment,
  useState,
} from 'react';
import { OptionTypeBase } from 'react-select/src/types';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import {
  Node,
  NodeChildProps,
} from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import BaseNodeType from '../../types/BaseNodeType';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps;

const nodeType: BaseNodeType = 'question';
const defaultWidth = 200;
const defaultHeight = 400;

const QuestionNode: BaseNodeComponent<Props> = (props) => {
  const {
    updateCurrentNode,
    ...rest
  } = props;
  const {
    onClick,
  } = props;

  return (
    <BaseNode
      nodeType={nodeType}
      {...rest}
    >
      {
        (event: NodeChildProps) => {
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
            <Fragment>
              <div
                className={'node-header question-header'}
              >
                Question
              </div>

              <div
                className={'question-text-contained'}
              >
                <Textarea
                  className={'textarea question-text'}
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
            </Fragment>
          );
        }
      }
    </BaseNode>
  );
};
QuestionNode.getDefaultNodeProps = (): BaseNodeDefaultProps => {
  return {
    type: 'question',
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
    // @ts-ignore
    ports: BaseNode.getDefaultPorts(),
  };
};

export default QuestionNode;
