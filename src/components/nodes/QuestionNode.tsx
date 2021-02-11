import React, {
  Fragment,
  useState,
} from 'react';
import ReactSelect from 'react-select';
import { OptionTypeBase } from 'react-select/src/types';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { NodeChildProps } from 'reaflow';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import NodeType from '../../types/NodeType';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps;

const nodeType: NodeType = 'question';
const defaultWidth = 200;
const defaultHeight = 400;

/**
 * Question node.
 *
 * Used to display a information (as text) and its choices.
 *
 * Displays a multi lines text input. (textarea)
 * Displays a "question type" select input. (React Select)
 *  - If question type is "text", doesn't display anything more.
 *  - If question type is "single-quick-reply", displays a list of manual entries below (ref, label), with ability to create new entries.
 * Displays a "question ref" input at the node's bottom.
 * Has one west port and one east port.
 * The west port allows unlimited links to other nodes.
 * The east port allows only one link to another node. (TODO not enforced yet)
 */
const QuestionNode: BaseNodeComponent<Props> = (props) => {
  const {
    updateCurrentNode,
    ...rest
  } = props;
  const {
    id,
    lastCreatedNode,
  } = props;

  return (
    <BaseNode
      nodeType={nodeType}
      {...rest}
    >
      {
        ({ nodeProps }: { nodeProps: NodeChildProps }) => {
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
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
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
                className={`node-header ${nodeType}-header`}
              >
                Question
              </div>

              <div
                className={`node-content ${nodeType}-content`}
              >
                <Textarea
                  className={`textarea ${nodeType}-text`}
                  defaultValue={`Ask something here`}
                  placeholder={'Ask something here'}
                  onHeightChange={onHeightChange}
                  autoFocus={lastCreatedNode?.id === id}
                />

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
                    <ReactSelect
                      className={'select select-simple'}
                      isMulti={false}
                      value={selectedChoiceType}
                      options={choiceTypes}
                      onChange={(
                        selectedChoice: OptionTypeBase,
                        action: { action: string },
                      ): void => {
                        console.log('setSelectedChoiceType', selectedChoice);
                        setSelectedChoiceType(selectedChoice);
                      }}
                    />
                  </div>
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
    type: nodeType,
    defaultWidth: defaultWidth,
    defaultHeight: defaultHeight,
    // @ts-ignore
    ports: BaseNode.getDefaultPorts(),
  };
};

export default QuestionNode;
