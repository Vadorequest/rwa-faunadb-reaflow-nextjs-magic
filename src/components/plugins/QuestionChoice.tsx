import { css } from '@emotion/react';
import React, { PropsWithChildren } from 'react';
import { DebounceInput } from 'react-debounce-input';
import TextareaAutosize from 'react-textarea-autosize';
import settings from '../../settings';
import { PatchCurrentNode } from '../../types/BaseNodeProps';
import { QuestionChoiceVariable } from '../../types/nodes/QuestionNodeAdditionalData';
import { QuestionNodeData } from '../../types/nodes/QuestionNodeData';

type Props<NodeData extends QuestionNodeData = QuestionNodeData> = {
  node: NodeData;
  questionChoiceVariable: QuestionChoiceVariable;
  patchCurrentNode: PatchCurrentNode<NodeData>;
};

/**
 * Display a single "question choice".
 *
 * Displays within a QuestionNode component.
 * Displayed only when the QuestionNode's "questionChoiceType" is set to "single-quick-reply".
 */
export const QuestionChoice = <NodeData extends QuestionNodeData = QuestionNodeData>(props: PropsWithChildren<Props<NodeData>>): React.ReactElement => {
  const {
    node,
    questionChoiceVariable,
    patchCurrentNode,
  } = props;
  const {
    id,
    name,
    value,
  } = questionChoiceVariable;

  /**
   * Filter the current question choice to keep only other question choices.
   */
  const filterCurrentQuestionChoice = (): QuestionChoiceVariable[] => {
    return node?.data?.questionChoices?.filter((variable: QuestionChoiceVariable) => variable?.id !== id) || [];
  };

  /**
   * Patches the current question choice, leaving other choices untouched.
   *
   * Might reorder the array of questionChoices within the node.
   *
   * @param patch
   */
  const patchCurrentQuestionChoice = (patch: Partial<QuestionChoiceVariable>) => {
    const patchedQuestionChoices: QuestionChoiceVariable[] = [
      ...filterCurrentQuestionChoice(),
      {
        ...questionChoiceVariable,
        ...patch,
      },
    ];

    // @ts-ignore
    patchCurrentNode<QuestionNodeData>({
      data: {
        questionChoices: patchedQuestionChoices,
      },
    });
  };

  /**
   * Update the question choice variable's name.
   *
   * @param event
   */
  const updateQuestionChoiceVariableName = (event: any) => {
    const newName = event?.target?.value;

    patchCurrentQuestionChoice({
      name: newName,
    });
  };

  /**
   * Update the question choice variable's value.
   *
   * @param event
   */
  const updateQuestionChoiceVariableValue = (event: any) => {
    const newValue = event?.target?.value;

    patchCurrentQuestionChoice({
      value: newValue,
    });
  };

  return (
    <div
      className={'question-choice'}
      css={css`
        border-radius: 5px;
        margin-top: 10px;
        margin-bottom: 10px;

        input,
        textarea {
          resize: none;
          padding-left: 5px;
          width: 100%;
        }

        .question-choice {
          width: 100%;

          &-name {
            background-color: #F9694A;
            border-radius: 5px 5px 0px 0px;

            input,
            textarea {
              margin: 5px 0px 5px 0px;
              background-color: #F9694A;
              color: white;

              ::placeholder {
                color: white !important;
              }
            }
          }

          &-value {
            background-color: #FEE9E4;
            border-radius: 0px 0px 5px 5px;

            input,
            textarea {
              margin: 6px 0px 0px 0px;
              background-color: #FEE9E4;
              color: #F9694A;
              border: solid 1px;
              border-radius: 5px;

              ::placeholder {
                color: #F9694A !important;
              }
            }
          }
        }
      `}
    >
      <div
        className={'question-choice-name'}
      >
        <DebounceInput
          debounceTimeout={settings.canvas.nodes.defaultDebounceWaitFor} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
          placeholder={'Variable name'}
          onChange={updateQuestionChoiceVariableName}
          value={name}
        />
      </div>
      <div
        className={'question-choice-value'}
      >
        <DebounceInput
          // @ts-ignore
          element={TextareaAutosize}
          debounceTimeout={settings.canvas.nodes.defaultDebounceWaitFor} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
          placeholder={'Value'}
          onChange={updateQuestionChoiceVariableValue}
          value={value}
          minRows={1}
          maxRows={5}
        />
      </div>
    </div>
  );
};

export default QuestionChoice;
