import { css } from '@emotion/react';
import React, { PropsWithChildren } from 'react';
import { DebounceInput } from 'react-debounce-input';
import TextareaAutosize from 'react-textarea-autosize';
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
    patchCurrentNode({
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
            background-color: #F6F6F6;

            input,
            textarea {
              margin: 5px 0px 5px 0px;
              background-color: #F6F6F6;
            }
          }

          &-value {
            background-color: #E0E0E0;

            input,
            textarea {
              margin: 5px 0px 5px 0px;
              background-color: #E0E0E0;
            }
          }
        }
      `}
    >
      <div
        className={'question-choice-name'}
      >
        <DebounceInput
          debounceTimeout={500} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
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
          debounceTimeout={500} // Avoids making the Canvas "lag" due to many unnecessary re-renders, by applying input changes in batches (one at most every 500ms)
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
