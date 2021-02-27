import { css } from '@emotion/react';
import React, { PropsWithChildren } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import BaseNodeData from '../../types/BaseNodeData';
import { PatchCurrentNode } from '../../types/BaseNodeProps';
import { QuestionChoiceVariable } from '../../types/nodes/QuestionNodeAdditionalData';
import { QuestionNodeData } from '../../types/nodes/QuestionNodeData';

type Props<NodeData extends BaseNodeData = BaseNodeData> = {
  node: NodeData;
  questionChoiceVariable: QuestionChoiceVariable;
  patchCurrentNode: PatchCurrentNode<NodeData>;
};

/**
 *
 */
export const QuestionChoice: <NodeData extends BaseNodeData = BaseNodeData>(p: PropsWithChildren<Props<NodeData>>) => React.ReactElement = (props) => {
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
    return (node as QuestionNodeData)?.data?.questionChoices?.filter((variable: QuestionChoiceVariable) => variable?.id !== questionChoiceVariable?.id) || [];
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
      key={id}
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
        <input
          value={name}
          placeholder={'Variable name'}
          onChange={updateQuestionChoiceVariableName}
        />
      </div>
      <div
        className={'question-choice-value'}
      >
        <TextareaAutosize
          minRows={1}
          maxRows={5}
          value={value}
          placeholder={'Value'}
          onChange={updateQuestionChoiceVariableValue}
        />
      </div>
    </div>

  );
};

export default QuestionChoice;
