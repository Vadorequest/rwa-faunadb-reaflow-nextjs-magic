import React, { Fragment } from 'react';
import { DebounceInput } from 'react-debounce-input';
import ReactSelect from 'react-select';
import { OptionTypeBase } from 'react-select/src/types';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { useRecoilState } from 'recoil';
import settings from '../../settings';
import { lastCreatedNodeState } from '../../states/lastCreatedNodeState';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { QuestionChoiceType } from '../../types/nodes/QuestionChoiceType';
import { QuestionChoiceTypeOption } from '../../types/nodes/QuestionChoiceTypeOption';
import { QuestionNodeData } from '../../types/nodes/QuestionNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import Textarea from '../plugins/Textarea';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<QuestionNodeData>;

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
  return (
    <BaseNode
      {...props}
    >
      {
        (nodeProps: SpecializedNodeProps<QuestionNodeData>) => {
          const {
            id,
            node,
            patchCurrentNode,
          } = nodeProps;
          const choiceTypes: QuestionChoiceTypeOption[] = settings.canvas.nodes.questionNode.choiceTypeOptions;
          const [lastCreatedNode] = useRecoilState(lastCreatedNodeState);

          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
           *
           * @param height
           * @param meta
           */
          const onTextHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;
            const newHeight: number = defaultHeight + additionalHeight;

            // Only update if the new height is different from the current height to avoid needless re-renders
            if (node.height !== newHeight) {
              patchCurrentNode({
                height: newHeight,
              });
            }
          };

          /**
           * Updates the current node "text" value.
           *
           * @param event
           */
          const onTextInputValueChange = (event: any) => {
            const newValue = event.target.value;

            // Updates the value in the Recoil store
            patchCurrentNode({
              data: {
                text: newValue,
              },
            } as QuestionNodeData);
          };

          /**
           * Find the selected option in the question type select.
           *
           * Basically translates the QuestionChoiceType kept in the node "data" into one of the available QuestionChoiceType.
           *
           * @param selectedQuestionTypeValue
           */
          const findSelectedQuestionTypeOption = (selectedQuestionTypeValue: QuestionChoiceType | undefined): OptionTypeBase | undefined => {
            return choiceTypes.find((choiceType: QuestionChoiceTypeOption) => choiceType?.value === selectedQuestionTypeValue);
          };

          /**
           * Updates the current node "questionType" value.
           *
           * @param selectedChoice
           * @param action
           */
          const onSelectedChoiceTypeChange = (selectedChoice: OptionTypeBase, action: { action: string }): void => {
            const selectedChoiceValue: QuestionChoiceType = selectedChoice?.value;

            console.log('setSelectedChoiceType', selectedChoice, 'action:', action);

            // Updates the value in the Recoil store
            patchCurrentNode({
              data: {
                questionType: selectedChoiceValue,
              },
            } as QuestionNodeData);
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
                <DebounceInput
                  // @ts-ignore
                  element={Textarea}
                  debounceTimeout={500} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
                  className={`textarea ${nodeType}-text`}
                  placeholder={'Say something here'}
                  onHeightChange={onTextHeightChange}
                  onChange={onTextInputValueChange}
                  value={node?.data?.text}
                  autoFocus={lastCreatedNode?.id === id} // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
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
                      value={findSelectedQuestionTypeOption(node?.data?.questionType)}
                      options={choiceTypes}
                      onChange={onSelectedChoiceTypeChange}
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
