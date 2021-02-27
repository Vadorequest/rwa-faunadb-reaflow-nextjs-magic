import { Button } from '@chakra-ui/react';
import { css } from '@emotion/react';
import now from 'lodash.now';
import sortBy from 'lodash.sortby';
import React, {
  Fragment,
  useEffect,
  useState,
} from 'react';
import { DebounceInput } from 'react-debounce-input';
import ReactSelect from 'react-select';
import { OptionTypeBase } from 'react-select/src/types';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { v1 as uuid } from 'uuid';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { QuestionChoiceType } from '../../types/nodes/QuestionChoiceType';
import { QuestionChoiceTypeOption } from '../../types/nodes/QuestionChoiceTypeOption';
import { QuestionChoiceVariable } from '../../types/nodes/QuestionNodeAdditionalData';
import { QuestionNodeData } from '../../types/nodes/QuestionNodeData';
import { SpecializedNodeProps } from '../../types/nodes/SpecializedNodeProps';
import NodeType from '../../types/NodeType';
import { isYoungerThan } from '../../utils/date';
import QuestionChoice from '../plugins/QuestionChoice';
import Textarea from '../plugins/Textarea';
import VariableNameInput from '../plugins/VariableNameInput';
import BaseNode from './BaseNode';

type Props = {} & BaseNodeProps<QuestionNodeData>;

const nodeType: NodeType = 'question';
const defaultWidth = 250;
const defaultHeight = 250;

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
            node,
            lastCreated,
            patchCurrentNode,
          } = nodeProps;
          const [questionTextareaAdditionalHeight, setQuestionTextareaAdditionalHeight] = useState<number>(0);
          const choiceTypes: QuestionChoiceTypeOption[] = settings.canvas.nodes.questionNode.choiceTypeOptions;
          const lastCreatedNode = lastCreated?.node;
          const lastCreatedAt = lastCreated?.at;
          const displayChoiceInputs = node?.data?.questionType === 'single-quick-reply';
          const additionalHeightChoiceInputs = 200;

          // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
          const shouldAutofocus = false && lastCreatedNode?.id === node.id && isYoungerThan(lastCreatedAt, 1000);

          /**
           * Calculates the node's height dynamically.
           *
           * The node's height is dynamic and depends on various parameters (selected option, length of text, etc.).
           */
          useEffect(() => {
            const newHeight = defaultHeight + questionTextareaAdditionalHeight + (displayChoiceInputs ? additionalHeightChoiceInputs : 0);

            // Only update the height if it's different
            if (node?.height !== newHeight) {
              patchCurrentNode({
                height: newHeight,
              });
            }
          }, [questionTextareaAdditionalHeight, displayChoiceInputs]);

          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
           *
           * @param height
           * @param meta
           */
          const onTextHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;

            if (questionTextareaAdditionalHeight !== additionalHeight) {
              setQuestionTextareaAdditionalHeight(additionalHeight);
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

            // Don't update if the choice is not different
            if (selectedChoiceValue !== node?.data?.questionType) {
              // Updates the value in the Recoil store
              patchCurrentNode({
                data: {
                  questionType: selectedChoiceValue,
                },
              } as QuestionNodeData);
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
                css={css`
                  .choice-type-select {
                    margin-bottom: 10px;
                  }

                  .add-question-choice {
                    margin-top: 10px;
                  }
                `}
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
                  autoFocus={shouldAutofocus}
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

                  {
                    displayChoiceInputs && (
                      <div
                        className={'question-choices-container'}
                      >
                        <div
                          className={'question-choices'}
                          css={css`
                            max-height: ${additionalHeightChoiceInputs}px;
                            overflow: scroll;
                          `}
                        >
                          {
                            sortBy(node?.data?.questionChoices, ['createdAt'])?.map((questionChoice: QuestionChoiceVariable, key: number) => {
                              return (
                                <QuestionChoice
                                  node={node}
                                  questionChoiceVariable={questionChoice}
                                  patchCurrentNode={patchCurrentNode}
                                />
                              );
                            })
                          }
                        </div>

                        <Button
                          className={'add-question-choice'}
                          width={'100%'}
                          onClick={() => patchCurrentNode({
                            data: {
                              questionChoices: [
                                ...(node?.data?.questionChoices || []),
                                {
                                  id: uuid(),
                                  createdAt: now(),
                                },
                              ],
                            },
                          } as QuestionNodeData)}
                        >
                          +
                        </Button>
                      </div>
                    )
                  }

                  {/* Displays the "Variable name" input at the bottom of the node, in absolute position */}
                  <VariableNameInput<QuestionNodeData>
                    node={node}
                    patchCurrentNode={patchCurrentNode}
                  />
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
