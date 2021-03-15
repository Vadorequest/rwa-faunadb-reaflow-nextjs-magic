import { Button } from '@chakra-ui/react';
import { css } from '@emotion/react';
import merge from 'lodash.merge';
import now from 'lodash.now';
import sortBy from 'lodash.sortby';
import React, { Fragment } from 'react';
import { DebounceInput } from 'react-debounce-input';
import ReactSelect from 'react-select';
import { OptionTypeBase } from 'react-select/src/types';
import { TextareaHeightChangeMeta } from 'react-textarea-autosize/dist/declarations/src';
import { useDebouncedCallback } from 'use-debounce';
import { v1 as uuid } from 'uuid';
import settings from '../../settings';
import BaseNodeComponent from '../../types/BaseNodeComponent';
import { BaseNodeDefaultProps } from '../../types/BaseNodeDefaultProps';
import BaseNodeProps from '../../types/BaseNodeProps';
import { QuestionChoiceType } from '../../types/nodes/QuestionChoiceType';
import { QuestionChoiceTypeOption } from '../../types/nodes/QuestionChoiceTypeOption';
import {
  QuestionChoiceVariable,
  QuestionNodeAdditionalData,
} from '../../types/nodes/QuestionNodeAdditionalData';
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
const baseWidth = 250;
const baseHeight = 320;

/**
 * Question node.
 *
 * Used to display a information (as text) and its choices.
 *
 * Displays a multi lines text input. (textarea)
 * Displays a "question type" select input. (React Select)
 *  - If question type is "text", doesn't display anything more.
 *  - If question type is "single-quick-reply", displays a list of manual choices below, with ability to create new entries.
 * Displays a "question ref" input at the node's bottom.
 * Has one west port and one east port.
 * The west port allows unlimited links to other nodes.
 */
const QuestionNode: BaseNodeComponent<Props> = (props) => {
  return (
    <BaseNode
      baseWidth={baseWidth}
      baseHeight={baseHeight}
      {...props}
    >
      {
        (nodeProps: SpecializedNodeProps<QuestionNodeData>) => {
          const {
            node,
            lastCreated,
            patchCurrentNode,
            patchCurrentNodeImmediately,
          } = nodeProps;
          const choiceTypes: QuestionChoiceTypeOption[] = settings.canvas.nodes.questionNode.choiceTypeOptions;
          const lastCreatedNode = lastCreated?.node;
          const lastCreatedAt = lastCreated?.at;
          const displayChoiceInputs = node?.data?.questionChoiceType === 'single-quick-reply';
          const choiceBaseHeight = 200;

          // Autofocus works fine when the node is inside the viewport, but when it's created outside it moves the viewport back at the beginning
          const shouldAutofocus = false && lastCreatedNode?.id === node.id && isYoungerThan(lastCreatedAt, 1000); // XXX Disabled for now, need a way to auto-center on the newly created node

          const patches: Partial<QuestionNodeData> = {};

          const _applyConcurrentPatches = useDebouncedCallback(
            () => {
              console.log('Applying patches', patches);
              patchCurrentNode(patches);
            },
            1000, // Wait for other changes to happen, if no change happen then invoke the update
            {
              maxWait: 10000,
            },
          );

          const applyConcurrentPatches = (patch: Partial<QuestionNodeData>) => {
            merge(patches, patches, patch);
            _applyConcurrentPatches();
          };

          /**
           * Calculates the node's height based on the dynamic source that affect the dynamic height of the component.
           *
           * @param dynHeights
           * @param willDisplayChoiceInputs
           */
          const calculateNodeHeight = (dynHeights: Partial<QuestionNodeAdditionalData['dynHeights']>, willDisplayChoiceInputs: boolean): number => {
            console.log('calculateNodeHeight', dynHeights, willDisplayChoiceInputs);
            return (dynHeights?.baseHeight || baseHeight) +
              (dynHeights?.questionTextareaHeight || 0) +
              (willDisplayChoiceInputs ? (choiceBaseHeight || 0) : 0);
          };

          /**
           * When textarea input height changes, we need to increase the height of the whole node accordingly.
           *
           * @param height
           * @param meta
           */
          const onQuestionInputHeightChange = (height: number, meta: TextareaHeightChangeMeta) => {
            // Only consider additional height, by ignoring the height of the first row
            const additionalHeight = height - meta.rowHeight;
            const patchedNodeAdditionalData: Partial<QuestionNodeAdditionalData> = {
              dynHeights: {
                questionTextareaHeight: additionalHeight,
              } as Partial<QuestionNodeAdditionalData['dynHeights']>,
            };
            const newHeight = calculateNodeHeight(patchedNodeAdditionalData.dynHeights, displayChoiceInputs);
            console.log('onTextHeightChange ', node?.data?.dynHeights?.questionTextareaHeight, newHeight, node?.data?.dynHeights?.questionTextareaHeight !== newHeight);

            if (node?.data?.dynHeights?.questionTextareaHeight !== newHeight) {
              // Updates the value in the Recoil store
              applyConcurrentPatches({
                data: patchedNodeAdditionalData,
                height: newHeight,
              } as QuestionNodeData);
            }
          };

          /**
           * Updates the current node "question" value.
           *
           * @param event
           */
          const onQuestionInputValueChange = (event: any) => {
            const newValue = event.target.value;

            if (newValue !== node?.data?.questionText) {
              applyConcurrentPatches({
                data: {
                  questionText: newValue,
                },
              } as QuestionNodeData);
            }
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
           * Updates the current node "questionChoiceType" value.
           *
           * @param selectedChoice
           * @param action
           */
          const onSelectedChoiceTypeChange = (selectedChoice: OptionTypeBase, action: { action: string }): void => {
            const selectedChoiceValue: QuestionChoiceType = selectedChoice?.value;
            console.log('selectedChoiceValue', selectedChoiceValue);

            // Don't update if the choice is not different
            if (selectedChoiceValue !== node?.data?.questionChoiceType) {
              const willDisplayChoiceInputs = selectedChoiceValue === 'single-quick-reply';
              const patchedNodeAdditionalData: Partial<QuestionNodeAdditionalData> = {
                questionChoiceType: selectedChoiceValue,
              };
              const newHeight = calculateNodeHeight(patchedNodeAdditionalData.dynHeights, willDisplayChoiceInputs);

              // Updates the value in the Recoil store
              patchCurrentNodeImmediately({
                data: patchedNodeAdditionalData,
                height: newHeight,
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
                    margin-top: 15px;
                  }

                  .choice-container {
                    margin-top: 15px
                  }

                  .add-question-choice {
                    margin-top: 10px;
                  }
                `}
              >
                <DebounceInput
                  // @ts-ignore
                  element={Textarea}
                  debounceTimeout={settings.canvas.nodes.defaultDebounceWaitFor} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
                  className={`textarea ${nodeType}-text`}
                  placeholder={'Say something here'}
                  onHeightChange={onQuestionInputHeightChange}
                  onChange={onQuestionInputValueChange}
                  value={node?.data?.questionText}
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
                      value={findSelectedQuestionTypeOption(node?.data?.questionChoiceType)}
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
                            max-height: ${choiceBaseHeight}px;
                            overflow: scroll;
                          `}
                        >
                          {
                            // Sort the questions from the oldest to youngest, avoids "jumps" of position when editing
                            sortBy(node?.data?.questionChoices, ['createdAt'])?.map((questionChoice: QuestionChoiceVariable) => {
                              return (
                                <QuestionChoice
                                  key={questionChoice?.id}
                                  node={node}
                                  questionChoiceVariable={questionChoice}
                                  patchCurrentNode={patchCurrentNode}
                                />
                              );
                            })
                          }
                        </div>

                        <Button
                          variant="secondary"
                          className={'add-question-choice'}
                          width={'100%'}
                          onClick={() => patchCurrentNodeImmediately({
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
    baseWidth: baseWidth,
    baseHeight: baseHeight,
    // @ts-ignore
    ports: BaseNode.getDefaultPorts(),
  };
};

export default QuestionNode;
